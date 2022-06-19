var fs = require('fs');
const args = process.argv.slice(2);
const path = args[0];
let notebookCount = 0;
let numNumpy = 0;
let numPandas = 0;
let numTensorflow = 0;
let numSkLearn = 0;
let numSkLearnWithSupervisedLearning = 0;
let numKeras = 0;
let numSkLearnAndKeras = 0;
let numSkLearnSupervisedAndKeras = 0;
let supervisedLearningModels = new Set(["TransformedTargetRegressor", "AdaBoostClassifier",
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

function getExt(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
}

fs.readdirSync(path).forEach(file => {
    if (getExt(file) === "ipynb") {
        const filePath = path + file;
        const programSrc = fs.readFileSync(filePath).toString();
        let programJson = undefined;
        try {
            programJson = JSON.parse(programSrc);
        }
        catch (err) {
            return;
        }
        if (programJson == undefined || programJson.cells == undefined) {
            return;
        }
        notebookCount += 1;
        let containNumpy = false;
        let containPandas = false;
        let containTensorFlow = false;
        let containSkLearn = false;
        let containSkLearnSupervised = false;
        let containKeras = false;
        for (let cell of programJson.cells) {
            if (cell.cell_type === 'code') {
                for (let line of cell.source) {
                    if (!containNumpy && line.includes("numpy")) {
                        containNumpy = true;
                    }
                    if (!containPandas && line.includes("pandas")) {
                        containPandas = true;
                    }
                    if (!containTensorFlow && line.includes("tensorflow")) {
                        containTensorFlow = true;
                    }
                    if (!containSkLearn && line.includes("sklearn")) {
                        containSkLearn = true;
                    }
                    if (!containKeras && line.includes("keras")) {
                        containKeras = true;
                    }
                    if (containSkLearn && !containSkLearnSupervised) {
                        for (let model of supervisedLearningModels) {
                            if (line.includes(model)) {
                                containSkLearnSupervised = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (containNumpy) {
            numNumpy += 1;
        }
        if (containPandas) {
            numPandas += 1;
        }
        if (containTensorFlow) {
            numTensorflow += 1;
        }
        if (containSkLearn) {
            numSkLearn += 1;
        }
        if (containSkLearnSupervised) {
            numSkLearnWithSupervisedLearning += 1;
        }
        if (containKeras) {
            numKeras += 1;
        }
        if (containSkLearn && containKeras) {
            numSkLearnAndKeras += 1;
        }
        if (containSkLearnSupervised && containKeras) {
            numSkLearnSupervisedAndKeras += 1;
        }
    }
});

console.log("Total number of notebooks = " + notebookCount);
console.log("Number of notebooks with numpy = " + numNumpy + ", percentage = " + (numNumpy/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with pandas = " + numPandas + ", percentage = " + (numPandas/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with tensorflow = " + numTensorflow + ", percentage = " + (numTensorflow/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with scikit-learn = " + numSkLearn + ", percentage = " + (numSkLearn/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with scikit-learn supervised learning = " + numSkLearnWithSupervisedLearning + ", percentage = " + (numSkLearnWithSupervisedLearning/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with keras = " + numKeras + ", percentage = " + (numKeras/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with scikit-learn and keras = " + numSkLearnAndKeras + ", percentage = " + (numSkLearnAndKeras/notebookCount*100).toFixed(2) + "%");
console.log("Number of notebooks with scikit-learn supervised learning and keras = " + numSkLearnSupervisedAndKeras + ", percentage = " + (numSkLearnSupervisedAndKeras/notebookCount*100).toFixed(2) + "%");
