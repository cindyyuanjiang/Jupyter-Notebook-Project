var fs = require('fs');
var utils = require("./cell_utils.js");
var py = require("../python-program-analysis");


const args = process.argv.slice(2);
const name = args[0];
const programSrc = fs.readFileSync(name).toString();
const programJson = JSON.parse(programSrc);


let res_html = "";
res_html += '<!DOCTYPE html>';
res_html += '<html>';
res_html += '<body>';


if(programJson.cells == undefined){
    console.log('program cells undefined');
}
else{
    let currentLineNo = 1;

    var last_exe_cnt = -1;

    // relabel cells with no execution counts
    for (let cell of programJson.cells){
        
        // if((cell.execution_count == null) && (cell.cell_type === "code")){
        //     cell.execution_count = last_exe_cnt + 1;
        // }
        if(cell.execution_count == null){
            cell.execution_count = last_exe_cnt + 10;
        }
        last_exe_cnt = cell.execution_count;
    }

    for (let cell of programJson.cells){

        if (cell.cell_type === 'code'){
            res_html += '<div class="cell border-box-sizing code_cell rendered">';
            res_html += '<div class="input">';

            // res_html += '<div style="background-color: purple">';
            res_html += '<div class="prompt input_prompt">In&nbsp;['+ cell.execution_count + ']:</div>';
            // res_html += '</div>';

            res_html += '<div class="inner_cell">';
            res_html += '<div class="input_area">';
            res_html += '<div class=" highlight hl-ipython3">';
            res_html += '<pre>';

            for(let line of cell.source){

                if((!(line[0] == '#')) && (!(line[0] == '%')) && (!(line[0] == '!'))){

                        let line_removed_nl, nl;
                        if(line[line.length - 1] == "\n"){
                            line_removed_nl = line.split("\n")[0]
                            nl = "\n"
                        }
                        else{
                            line_removed_nl = line
                            nl = ""
                        }
                    
                        if(line.includes('read_csv')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        //special case: consider improving this
                        else if(line.includes('scaler.fit')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('predict_proba')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('fit_predict')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('predict')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('accuracy_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('classification_report')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('confusion_matrix')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('f1_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('train_test_split')){
                            res_html += '<div style = "background-color: green">' + currentLineNo + ' ' + line_removed_nl + ' (Data Labeling) ' + nl + '</div>';
                        }
                        else if(line.includes('LinearRegression')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        // else if(line.includes('score')){
                        //     map_from_line_to_label[currentLineNo] = 'evaluation';
                        //     //console.log('label: evaluation\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        else if(line.includes('permutation_importance')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('ColumnTransformer')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('OrdinalEncoder')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('HistGradientBoostingRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        // else if(line.includes('RandomizedSearchCV')){
                        //     map_from_line_to_label[currentLineNo] = 'model deployment';
                        //     //console.log('label: model deployment\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        else if(line.includes('RandomizedSearchCV')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('make_classification')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('decision_function')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        // else if(line.includes('calibration_curve')){
                        //     map_from_line_to_label[currentLineNo] = 'model deployment';
                        //     //console.log('label: model deployment\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        else if(line.includes('calibration_curve')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('LinearSVC')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('cross_val_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('RandomForestClassifier')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('GaussianNB')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        // else if(line.includes('CalibratedClassifierCV')){
                        //     map_from_line_to_label[currentLineNo] = 'model deployment';
                        //     //console.log('label: model deployment\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        else if(line.includes('CalibratedClassifierCV')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('brier_score_loss')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('log_loss')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('fetch_lfw_people')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('PCA')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('SVC')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        // else if(line.includes('GridSearchCV')){
                        //     map_from_line_to_label[currentLineNo] = 'model deployment';
                        //     //console.log('label: model deployment\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        else if(line.includes('GridSearchCV')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('fetch_20newsgroups')){
                            map_from_line_to_label[currentLineNo] = 'data collection';
                            //console.log('label: data collection\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        }
                        else if(line.includes('CountVectorizer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('HashingVectorizer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('TfidfVectorizer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('SGDClassifier')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('MLPClassifier')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('SimpleImputer')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('OneHotEncoder')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('GradientBoostingRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('fetch_california_housing')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('StandardScaler')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('scale')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('TransformedTargetRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('make_pipeline')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('PolynomialFeatures')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('RandomForestRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('enable_hist_gradient_boosting')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('plot_partial_dependence')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('XGBRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('make_column_transformer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('DecisionTreeClassifier')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('learning_curve')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('validation_curve')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('GradientBoostingClassifier')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('roc_auc_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('precision_recall_curve')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('BaseEstimator')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('TransformerMixin')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('clone')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('LabelBinarizer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('LogisticRegression')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('QuantileTransformer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('load_iris')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('Perceptron')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('make_blobs')){
                            res_html += '<div style = "background-color: green">' + currentLineNo + ' ' + line_removed_nl + ' (Data Labeling) ' + nl + '</div>';
                        }
                        else if(line.includes('DBSCAN')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('normalized_mutual_info_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('adjusted_rand_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('MiniBatchKMeans')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('KMeans')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('Birch')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('silhouette_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        // else if(line.includes('.plot')){
                        //     map_from_line_to_label[currentLineNo] = 'plotting';
                        //     //console.log('label: plotting\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        // else if(line.includes('.show')){
                        //     map_from_line_to_label[currentLineNo] = 'plotting';
                        //     //console.log('label: plotting\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        // else if(line.includes('plt')){
                        //     map_from_line_to_label[currentLineNo] = 'plotting';
                        //     //console.log('label: plotting\n' + currentLineNo + ' ' + line_removed_nl + '\n');
                        // }
                        else if(line.includes('MultinomialNB')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('BernoulliNB')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('ComplementNB')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('TfidfTransformer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('LabelEncoder')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('ShuffleSplit')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('make_scorer')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('recall_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('roc_curve')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('auc')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('roc_auc_score')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('LogisticRegressionCV')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('ParameterSampler')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('RBFSampler')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('DictVectorizer')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('ParameterGrid')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('SelectFromModel')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('BernoulliRBM')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('mean_squared_error')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('StratifiedKFold')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('RFECV')){
                            res_html += '<div style = "background-color: blue">' + currentLineNo + ' ' + line_removed_nl + ' (Feature Engineering) ' + nl + '</div>';
                        }
                        else if(line.includes('feature_importances_')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('KNeighborsClassifier')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('KNeighborsRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('DecisionTreeRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('load_digits')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('load_breast_cancer')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('KFold')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('LeaveOneOut')){
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        }
                        else if(line.includes('BaggingClassifier')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('BaggingRegressor')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('AgglomerativeClustering')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('FeatureAgglomeration')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }
                        else if(line.includes('RidgeCV')){
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        }

                        // newly added labelings for pandas lib
                        else if(line.includes('read_table')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('read_excel')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('read_sql')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('read_json')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('read_html')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('read_clipboard')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('Datarame')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('.DatetimeIndex')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('DataFrame')){
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        }
                        else if(line.includes('.head')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.tail')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.shape')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.info')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.describe')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.value_counts')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.apply')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.loc')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.iloc')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.columns')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.isnull')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.notnull')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.dropna')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.fillna')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.astype')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        // else if(line.includes('.replace')){
                        //     map_from_cell_to_labels[cell.execution_count].add('data cleaning');
                        //     map_from_label_to_line_nums['data cleaning'] += 1;
                        // }
                        else if(line.includes('.rename')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.set_index')){
                            res_html += '<div style = "background-color: yellow">' + currentLineNo + ' ' + line_removed_nl + ' (Data Cleaning) ' + nl + '</div>';
                        }
                        else if(line.includes('.sort_values')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.groupby')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else if(line.includes('.pivot_table')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        // else if(line.includes('.append')){
                        //     map_from_cell_to_labels[cell.execution_count].add('data exploration');
                        //     map_from_label_to_line_nums['data exploration'] += 1;
                        // }
                        else if(line.includes('pd.concat')){
                            res_html += '<div style = "background-color: pink">' + currentLineNo + ' ' + line_removed_nl + ' (Data Exploration) ' + nl + '</div>';
                        }
                        else{
                            res_html += '<div>' + currentLineNo + ' ' + line_removed_nl + nl + '</div>';
                        }
                        currentLineNo += 1;
                    }
                    // else{
                    //     res_html += '<div>' + currentLineNo + ' ' + line_removed_nl + nl + '</div>';
                    // }

                    // currentLineNo += 1;


            }

            res_html += '</pre>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '<p><br><br></p>';
            // res_html += '<div></div>';
        }
    }
}


res_html += '</body>';
res_html += '</html>';

// var new_name = '.' + name.split('.')[1] + '.html';
var new_name = name.substring(0, name.lastIndexOf('.')) + '.html';
console.log(new_name);

fs.writeFile(new_name, res_html, function (err) {
      if (err) throw err;
      console.log(new_name + ' saved!');

    });