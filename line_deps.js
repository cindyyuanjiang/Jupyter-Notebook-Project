var fs = require('fs');
var utils = require("./cell_utils.js");
var labeling = require("./sk_label.js");
var py = require("../python-program-analysis");

// hyperparameter-searching models like "ParameterSampler" are currently labeled as supervised
let supervised_learning_models = new Set(["TransformedTargetRegressor", "AdaBoostClassifier",
    "AdaBoostRegressor", "BaggingClassifier", "BaggingRegressor", "ExtraTreesClassifier",
    "ExtraTreesRegressor", "GradientBoostingClassifier", "GradientBoostingRegressor",
    "RandomForestClassifier", "RandomForestRegressor", "StackingClassifier", "StackingRegressor",
    "VotingClassifier", "VotingRegressor", "HistGradientBoostingRegressor",
    "HistGradientBoostingClassifier", "GaussianProcessClassifier", "GaussianProcessRegressor",
    "LogisticRegression", "LogisticRegressionCV", "PassiveAggressiveClassifier",
    "Perceptron", "RidgeClassifier", "RidgeClassifierCV", "SGDClassifier", "LinearRegression", 
    "Ridge", "RidgeCV", "SGDRegressor", "ElasticNet", "ElasticNetCV", "Lars", "LarsCV", "Lasso",
    "LassoCV", "LassoLars", "LassoLarsCV", "LassoLarsIC", "OrthogonalMatchingPursuit", 
    "OrthogonalMatchingPursuitCV", "ARDRegression", "BayesianRidge", "MultiTaskElasticNet", 
    "MultiTaskElasticNetCV", "MultiTaskLasso", "MultiTaskLassoCV", "HuberRegressor", "RANSACRegressor",
    "TheilSenRegressor", "PoissonRegressor", "TweedieRegressor", "GammaRegressor",
    "PassiveAggressiveRegressor", "GridSearchCV", "HalvingGridSearchCV", "ParameterGrid", 
    "ParameterSampler", "RandomizedSearchCV", "HalvingRandomSearchCV", "OneVsRestClassifier", 
    "OneVsOneClassifier", "OntputCodeClassifier", "ClassifierChain", "MultiOutputRegressor", 
    "MultiOutputClassifier", "RegressorChain", "BernoulliNB", "CategoricalNB", "ComplementNB", 
    "GaussianNB", "MultinomialNB", "KNeighborsClassifier", "KNeighborsRegressor",
    "RadiusNeighborsClassifier", "RadiusNeighborsRegressor", "NearestCentroid",
    "NeighborhoodComponentsAnalysis", "BernoulliRBM", "MLPClassifier", "MLPRegressor", 
    "LabelPropagation"/*semi-supervised*/, "LabelSpreading"/*semi-supervised*/, 
    "SelfTrainingClassifier" /*semi-supervised*/, "LinearSVC", "LinearSVR", "NuSVC", "NuSVR", 
    "OneClassSVM", "SVC", "SVR", "DecisionTreeClassifier", "DecisionTreeRegressor", 
    "ExtraTreeClassifier", "ExtraTreeRegressor"]);

let wrangling_models = new Set(["PCA", "NMF", "DictVectorizer", "FeatureHasher", "PatchExtractor",
    "CountVectorizer", "HashingVectorizer", "TfidfTransformer", "TfidfVectorizer",
    "GenericUnivariateSelect", "SelectPercentile", "SelectKBest", "SelectFpr", "SelectFdr",
    "SelectFromModel", "SelectFwe", "SequentialFeatureSelector", "RFE", "RFECV",
    "VarianceThreshold", "Binarizer", "FunctionTransformer", "KBinsDiscretizer",
    "KernelCenterer", "LabelBinarizer", "LabelEncoder", "MultiLabelBinarizer",
    "MaxAbsScaler", "MinMaxScaler", "Normalizer", "OneHotEncoder", "OrdinalEncoder",
    "PolynomialFeatures", "PowerTransformer", "QuantileTransformer", "RobustScaler",
    "StandardScaler"]);

function find_model(s) {
    let first = s.split(".fit")[0];
    let last_index = first.length;
    let first_index = last_index - 1;
    while (first_index > 0) {
        if (first.charAt(first_index) == ')') {
            first_index--;
            while (first.charAt(first_index) != '(') {
                first_index--;
            }
            first_index--;
            continue;
        }
        // first occurrence of non-alphabetical letter
        if (first.charAt(first_index) != "_" && first.charAt(first_index).toLowerCase() == first.charAt(first_index).toUpperCase()) {
            break;
        }
        first_index--;
    }
    return first.substring(first_index <= 0 ? 0 : first_index + 1, last_index);
}

function printDependencies(cell_to_lines, line_dep, line_cfg_dep, line_cfg_dep_btwn_cells, 
                           printMode, dict, name, res_color_map, sources, sinks, cell_counts) {
    let res = "";
    var dep_count = 0;
    var cfg_count = 0;
    var cell_count = 0;
    for (var cell in cell_to_lines) {
        let lines = cell_to_lines[cell];
        res += (cell + " -> " + lines + '\n');
        cell_count += 1;
    }
    let line_dep_new = "";
    for (var line in line_dep) {
        let deps = line_dep[line];
        for (let dep of deps) {
            dep_count += 1;
            line_dep_new += (line + " -> " + dep + '\n');
        }
    }
    res = cell_count + '\n' + res;
    res += dep_count + '\n' + line_dep_new;
    res += res_color_map + sources + '\n';
    res += sinks + '\n' + cell_counts + '\n';
    for (var line in line_cfg_dep) {
        let deps = line_cfg_dep[line];
        for (let dep of deps) {
            cfg_count += 1;
            res += (line + " -> " + dep + '\n');
        }
    }
    res += cfg_count + '\n';
    let cfg_btwn_cnt = 0;
    for (var line in line_cfg_dep_btwn_cells) {
        let deps = line_cfg_dep_btwn_cells[line];
        for (let dep of deps) {
            cfg_btwn_cnt += 1;
            res += line + " -> " + dep + '\n';
        }
    }
    res += cfg_btwn_cnt;
    var new_name = name.substring(0, name.lastIndexOf('.'));
    fs.writeFile(new_name + '_new_labels.txt', res, function (err) {
      if (err) throw err;
    });
}

module.exports = {
    calculateCells: function(name, printMode) {
        const programSrc = fs.readFileSync(name).toString();
        const programJson = JSON.parse(programSrc);
        let jsonName = name.substring(0, name.lastIndexOf(".")) + "_no_comments.json";
        const jsonSrc = fs.readFileSync(jsonName).toString();
        const jsonFile = JSON.parse(jsonSrc);

        //dict is a dictionary pointing from execution_count to the corresponding cell 
        let dict = new Object();
        let cells = [];
        let currentLine = 0;
        let currentLineNo = 0;
        let cell_counts = [];
        let map_from_line_to_label = new Object();
        var notebookCode = "";
        var res_color_map = "";
        let line_dep = new Object();
        let line_cfg_dep = new Object();
        let line_cfg_dep_btwn_cells = new Object();
        let line_to_lineNo = new Object();
        let cell_to_lines = new Object();
        var last_exe_cnt = -1;
        // relabel cells with no execution counts
        for (let cell of programJson.cells) {
            if (cell.execution_count == null) {
                cell.execution_count = last_exe_cnt + 10;
            }
            last_exe_cnt = cell.execution_count;
        }
        var flag = false;
        var plt = "@@@@";
        for (let cell of programJson.cells) {
            if (cell.cell_type === 'code') {
                cell_counts.push(cell.execution_count);
                cell_to_lines[cell.execution_count] = [];
                var sourceCode = "";
                for (let line of cell.source) {
                    if (line[0] != '#' && line[0] != '%' && line[0] != '!') {
                        sourceCode += line;
                        cell_to_lines[cell.execution_count].push(currentLineNo + 1);
                        if (line.includes('import matplotlib.pyplot as')) {
                            plt = line.split(" ")[3].slice(0, -1);
                            flag = true;
                        }
                        if ((!line.includes("import ")) && flag && line.includes(plt + ".")) {
                            map_from_line_to_label[currentLineNo + 1] = "exploration";
                        } else {
                            var label = labeling.label(line);
                            if (label != "") {
                                map_from_line_to_label[currentLineNo + 1] = label;
                            }
                        }
                        if ((currentLineNo + 1) in map_from_line_to_label) {
                            if (map_from_line_to_label[(currentLineNo + 1)] == "data collection") {
                                res_color_map += ((currentLineNo + 1) + '->' + 'red' + '\n');
                            } else if (map_from_line_to_label[(currentLineNo + 1)] == 'wrangling') {
                                res_color_map += ((currentLineNo + 1) + '->' + 'green' + '\n');
                            } else if (map_from_line_to_label[(currentLineNo + 1)] == 'training') {
                                res_color_map += ((currentLineNo + 1) + '->' + 'purple' + '\n');
                            } else if(map_from_line_to_label[(currentLineNo + 1)] == 'evaluation') {
                                res_color_map += ((currentLineNo + 1) + '->' + 'orange' + '\n');
                            } else if(map_from_line_to_label[(currentLineNo + 1)] == 'exploration') {
                                res_color_map += ((currentLineNo + 1) + '->' + 'lightblue' + '\n');
                            }
                        }
                        line_dep[currentLineNo] = [];
                        line_cfg_dep[currentLineNo] = [];
                        currentLineNo += 1;
                    }
                }
                line_cfg_dep_btwn_cells[currentLineNo] = [currentLineNo+1];
                if (sourceCode != "" && sourceCode[sourceCode.length -1] != "\n") {
                    notebookCode += sourceCode + '\n';
                } else {
                    notebookCode += sourceCode;
                }
                let cellLength = cell.source.length;
                cell.lineNos = [currentLine, currentLine + cellLength - 1];
                currentLine += cellLength;
                cells.push(cell);
                dict[cell.execution_count] = cell;
            }
        }
        delete line_cfg_dep_btwn_cells[currentLineNo];

        let cfg = utils.getControlFlow(notebookCode);
        let blocks = cfg.blocks;
        let all_line_nos = new Set();
        for (let block of blocks) {
            let block_stmts = block.statements;
            if (block_stmts[0] == undefined) {
                continue;
            }
            for (let i = 0; i < block_stmts.length - 1; i++) {
                if (block_stmts[i + 1] == undefined) {
                    continue;
                }
                let from = block_stmts[i].location.first_line;
                let to = block_stmts[i + 1].location.first_line;
                all_line_nos.add(from);
                all_line_nos.add(to);
                line_cfg_dep[from].push(to);
            }
            let succ = cfg.getSuccessors(block);
            if (succ == undefined) {
                continue;
            }
            let from_line_no = block_stmts[block_stmts.length - 1].location.first_line;
            for (let succ_block of succ) {
                let succ_stmts = succ_block.statements;
                if (succ_stmts[0] == undefined) {
                    let subSucc = cfg.getSuccessors(succ_block);
                    if (subSucc == undefined) {
                        continue;
                    }
                    for (let subSuccBlock of subSucc) {
                        let subSuccStmts = subSuccBlock.statements;
                        if (subSuccStmts == undefined || subSuccStmts[0] == undefined) {
                            continue;
                        }
                        let subToLineNo = subSuccStmts[0].location.first_line;
                        if (line_cfg_dep[from_line_no] != undefined && !line_cfg_dep[from_line_no].includes(subToLineNo)) {
                            line_cfg_dep[from_line_no].push(subToLineNo);
                        }
                        all_line_nos.add(subToLineNo);
                    }
                    continue;
                }
                let to_line_no = succ_stmts[0].location.first_line;
                all_line_nos.add(to_line_no);
                if (from_line_no in line_cfg_dep && !line_cfg_dep[from_line_no].includes(to_line_no)) {
                    line_cfg_dep[from_line_no].push(to_line_no);
                }
            }
        }

        flows = utils.getDefUse(notebookCode);
        for (let flow of flows.items) {
            if (py.printNode(flow.toNode) != undefined && py.printNode(flow.toNode).includes('.fit')) {
                let toNodeLineNo = flow.toNode.location.first_line;
                let fromNodeLineNo = flow.fromNode.location.first_line;
                if ((!(toNodeLineNo in map_from_line_to_label)) && fromNodeLineNo in map_from_line_to_label && map_from_line_to_label[fromNodeLineNo] == 'training') {
                    let trainingModel = find_model(py.printNode(flow.toNode));
                    if ((jsonFile.hasOwnProperty(trainingModel)) && supervised_learning_models.has(jsonFile[trainingModel][1])) {
                        map_from_line_to_label[toNodeLineNo] = 'training';
                        res_color_map += (toNodeLineNo + '->' + 'purple' + '\n');
                    }
                }
                if ((!(toNodeLineNo in map_from_line_to_label)) && fromNodeLineNo in map_from_line_to_label && map_from_line_to_label[fromNodeLineNo] == 'wrangling') {
                    let wranglingModel = find_model(py.printNode(flow.toNode));
                    if ((jsonFile.hasOwnProperty(wranglingModel)) && wrangling_models.has(jsonFile[wranglingModel][1])) {
                        map_from_line_to_label[toNodeLineNo] = 'wrangling';
                        res_color_map += (toNodeLineNo + '->' + 'green' + '\n');
                    }
                }
            } else if (py.printNode(flow.toNode) != undefined && (py.printNode(flow.toNode).includes('.predict') || py.printNode(flow.toNode).includes('.fit_predict'))) {
                let toNodeLineNo = flow.toNode.location.first_line;
                let fromNodeLineNo = flow.fromNode.location.first_line;
                if (fromNodeLineNo in map_from_line_to_label && map_from_line_to_label[fromNodeLineNo] == 'training' && (!(toNodeLineNo in map_from_line_to_label))) {
                    map_from_line_to_label[toNodeLineNo] = 'evaluation';
                    res_color_map += (toNodeLineNo + '->' + 'orange' + '\n');
                }
            } else if (py.printNode(flow.toNode) != undefined && py.printNode(flow.toNode).includes('.score')) {
                let toNodeLineNo = flow.toNode.location.first_line;
                let fromNodeLineNo = flow.fromNode.location.first_line;
                if (fromNodeLineNo in map_from_line_to_label && map_from_line_to_label[fromNodeLineNo] == 'training' && (!(toNodeLineNo in map_from_line_to_label))) {
                    map_from_line_to_label[toNodeLineNo] = 'evaluation';
                    res_color_map += (toNodeLineNo + '->' + 'orange' + '\n');
                }
            } else if (py.printNode(flow.toNode) != undefined && py.printNode(flow.toNode).includes('.decision_function')) {
                let toNodeLineNo = flow.toNode.location.first_line;
                let fromNodeLineNo = flow.fromNode.location.first_line;
                if (fromNodeLineNo in map_from_line_to_label && map_from_line_to_label[fromNodeLineNo] == 'training' && (!(toNodeLineNo in map_from_line_to_label))) {
                    map_from_line_to_label[toNodeLineNo] = 'evaluation';
                    res_color_map += (toNodeLineNo + '->' + 'orange' + '\n');
                }
            }
        }
        let all_defs = new Set();
        let all_uses = new Set();
        for (let flow of flows.items) {
            let defCell;
            let useCell;
            let fromNodeLineNo = flow.fromNode.location.first_line;
            let toNodeLineNo = flow.toNode.location.first_line;
            all_line_nos.add(fromNodeLineNo);
            all_line_nos.add(toNodeLineNo);
            if (py.printNode(flow.fromNode) != undefined && py.printNode(flow.fromNode).includes('import ')) {
                continue;
            }
            if (toNodeLineNo == currentLineNo) {
                continue;
            }
            if (fromNodeLineNo in line_dep && !line_dep[fromNodeLineNo].includes(toNodeLineNo)) {
                line_dep[fromNodeLineNo].push(toNodeLineNo);
            }
            all_defs.add(fromNodeLineNo);
            all_uses.add(toNodeLineNo);
        }
        let sources = [];
        let sinks = [];
        for (let line of all_line_nos) {
            if (!all_uses.has(line)) {
                sources.push(line);
            }
            if (!all_defs.has(line)) {
                sinks.push(line);
            }
        }
        printDependencies(cell_to_lines, line_dep, line_cfg_dep, line_cfg_dep_btwn_cells, printMode, 
                          dict, name, res_color_map, sources, sinks, Array.from(all_line_nos));
    }
}