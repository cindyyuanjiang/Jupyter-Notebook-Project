// var dep = require("./cell_deps.js");
var line_dep = require("./line_deps.js");
var sk = require("./extract_sk_stmts.js");
var counting = require("./count_labels.js");
var fs = require('fs');

const args = process.argv.slice(2);
const path = args[0];
const sizeOfSample = args[1];

let supervised_learning_models = new Set(["TransformedTargetRegressor", "AdaBoostClassifier",
    "AdaBoostRegressor", "BaggingClassifier", "BaggingRegressor", "ExtraTreesClassifier",
    "ExtraTreesRegressor", "GradientBoostingClassifier", "GradientBoostingRegressor",
    "RandomForestClassifier", "RandomForestRegressor", "StackingClassifier", 
    "StackingRegressor", "VotingClassifier", "VotingRegressor", "HistGradientBoostingRegressor",
    "HistGradientBoostingClassifier", "GaussianProcessClassifier", "GaussianProcessRegressor",
    "LogisticRegression", "LogisticRegressionCV", "PassiveAggressiveClassifier",
    "Perceptron", "RidgeClassifier", "SGDClassifier", "LinearRegression", "Ridge",
    "RidgeCV", "SGDRegressor", "ElasticNet", "ElasticNetCV", "Lars", "LarsCV", "Lasso",
    "LassoCV", "LassoLars", "LassoLarsCV", "LassoLarsIC", "OrthogonalMatchingPursuit",
    "ARDRegression", "BayesianRidge", "MultiTaskElasticNet", "MultiTaskElasticNetCV",
    "MultiTaskLasso", "MultiTaskLassoCV", "HuberRegressor", "RANSACRegressor",
    "TheilSenRegressor", "PoissonRegressor", "TweedieRegressor", "GammaRegressor",
    "PassiveAggressiveRegressor", "GridSearchCV", "HalvingGridSearchCV",
    "ParameterGrid", "ParameterSampler", "RandomizedSearchCV", "HalvingRandomSearchCV",
    "OneVsRestClassifier", "OneVsOneClassifier", "OntputCodeClassifier",
    "ClassifierChain", "MultiOutputRegressor", "MultiOutputClassifier",
    "RegressorChain", "BernoulliNB", "CategoricalNB", "ComplementNB", "GaussianNB",
    "MultinomialNB", "KNeighborsClassifier", "KNeighborsRegressor",
    "RadiusNeighborsClassifier", "RadiusNeighborsRegressor", "NearestCentroid",
    "MLPClassifier", "MLPRegressor", "LabelPropagation"/*semi-supervised*/,
    "LabelSpreading"/*semi-supervised*/, "SelfTrainingClassifier" /*semi-supervised*/,
    "LinearSVC", "LinearSVR", "NuSVC", "NuSVR", "OneClassSVM", "SVC", "SVR", 
    "DecisionTreeClassifier", "DecisionTreeRegressor"]);

function getExt(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
}

function containKeras(source) {
    if (source == undefined) {
        return false;
    }
    for (let line of source) {
        if (line.includes('keras')) {
            return true;
        }
    }
    return false;
}

function containSklearn(source) {
    if (source == undefined) {
        return false;
    }
    for (let line of source) {
        if (line.includes('sklearn')) {
            return true;
        }
    }
    return false;
}

function containSklearnModel(source) {
    if (source == undefined) {
        return false;
    }
    for (let line of source) {
        for (let model of supervised_learning_models) {
            if (line.includes(model)) {
                return true;
            }
        }
    }
    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let num_notebooks = 0;
var listSklearnNotebooks = [];

fs.readdirSync(path).forEach(file => {
    if (getExt(file) === "ipynb") {
        try {
            num_notebooks += 1;
            // console.log('Currently processing:');
            let name = path + file;
            // console.log(name + '\n');
            const programSrc = fs.readFileSync(name).toString();
            const programJson = JSON.parse(programSrc);
            if (programJson == undefined || programJson.cells == undefined) {
                return;
            }
            for (let cell of programJson.cells) {
                if (cell.cell_type === 'code') {
                    if (containSklearnModel(cell.source) || containSklearnModel(cell.source)) {
                        listSklearnNotebooks.push(name);
                    }
                    // if (containKeras(cell.source) && containSklearnModel(cell.source)) {
                    //     listSklearnNotebooks.push(name);
                    // }
                    break;
                }
            }
        }
        catch (err) {

        }
    }
});

var notSample = [43, 81, 9, 98, 64, 198, 142, 82, 160, 138, 97, 143, 229, 537, 298];
var listOfIndices = [];
var numberSklearnNotebooks = listSklearnNotebooks.length;
console.log(numberSklearnNotebooks)
// for (let nb of listSklearnNotebooks) {
//     console.log(nb);
// }

while (listOfIndices.length != sizeOfSample) {
    var curIndex = getRandomInt(0, numberSklearnNotebooks);
    console.log(curIndex);
    if (listOfIndices.includes(curIndex) || notSample.includes(curIndex)) {
        continue;
    }
    listOfIndices.push(curIndex);
    // console.lsog(listSklearnNotebooks[curIndex]);
}

console.log("number of notebooks = " + num_notebooks);
console.log("number of sklearn notebooks = " + numberSklearnNotebooks);

for (let index of listOfIndices) {
    console.log(index);
    console.log(listSklearnNotebooks[index]);
}