var fs = require('fs');
var utils = require("./cell_utils.js");
var py = require("../python-program-analysis");


module.exports = {
    calculateCells: function(name){
        const programSrc = fs.readFileSync(name).toString();
        const programJson = JSON.parse(programSrc);
        
        let cell_count = 0;

        let map_from_cell_to_labels = new Object();

        // edge case
        if(programJson.cells == undefined){

            return [false, 0, map_from_cell_to_labels];
        }


        // relabel cells with no execution counts
        var last_exe_cnt = -1;
        for (let cell of programJson.cells){
            
            if((cell.execution_count == null) && (cell.cell_type === 'code')){
                cell.execution_count = last_exe_cnt + 1;
            }
            last_exe_cnt = cell.execution_count;
        }


        // init map from cell's execution counts to labels(set)
        for (let cell of programJson.cells){
            map_from_cell_to_labels[cell.execution_count] = new Set();
        }


        let training_set = new Set();
        let eval_set = new Set();

        for (let cell of programJson.cells){

            if (cell.cell_type === 'code'){
                cell_count += 1;

                for(let line of cell.source){

                    if(!line.includes('import')){
                    
                        if(line.includes('read_csv')){
                            map_from_cell_to_labels[cell.execution_count].add('data collection');
                        }
                        //special case: consider improving this
                        else if(line.includes('scaler.fit')){
                            map_from_line_to_label[cell.execution_count] = 'feature engineering';
                        }
                        else if(line.includes('.predict')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('.accuracy_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('.classification_report')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('.confusion_matrix')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('.f1_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('train_test_split')){
                            map_from_cell_to_labels[cell.execution_count].add('data labeling');
                        }
                        else if(line.includes('LinearRegression')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('.score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('permutation_importance')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('ColumnTransformer')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('OrdinalEncoder')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('HistGradientBoostingRegressor')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('RandomizedSearchCV')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('.make_classification')){
                            map_from_cell_to_labels[cell.execution_count].add('data collection');
                        }
                        else if(line.includes('.predict_proba')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('.decision_function')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('calibration_curve')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('LinearSVC')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('cross_val_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('RandomForestClassifier')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('GaussianNB')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('CalibratedClassifierCV')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('brier_score_loss')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('log_loss')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('fetch_lfw_people')){
                            map_from_cell_to_labels[cell.execution_count].add('data collection');
                        }
                        else if(line.includes('PCA')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('SVC')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('GridSearchCV')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('fetch_20newsgroups')){
                            map_from_cell_to_labels[cell.execution_count].add('data collection');
                        }
                        else if(line.includes('CountVectorizer')){
                            map_from_cell_to_labels[cell.execution_count].add('data cleaning');
                        }
                        else if(line.includes('HashingVectorizer')){
                            map_from_cell_to_labels[cell.execution_count].add('data cleaning');
                        }
                        else if(line.includes('SGDClassifier')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('MLPClassifier')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('SimpleImputer')){
                            map_from_cell_to_labels[cell.execution_count].add('data cleaning');
                        }
                        else if(line.includes('OneHotEncoder')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('GradientBoostingRegressor')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('fetch_california_housing')){
                            map_from_cell_to_labels[cell.execution_count].add('data collection');
                        }
                        else if(line.includes('StandardScaler')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('TransformedTargetRegressor')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('make_pipeline')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('PolynomialFeatures')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('RandomForestRegressor')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('enable_hist_gradient_boosting')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('plot_partial_dependence')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('XGBRegressor')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('make_column_transformer')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('DecisionTreeClassifier')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('learning_curve')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('validation_curve')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('GradientBoostingClassifier')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('roc_auc_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('precision_recall_curve')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('BaseEstimator')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('TransformerMixin')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('clone')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('LabelBinarizer')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('LogisticRegression')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('.fit_transform')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('QuantileTransformer')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                        else if(line.includes('load_iris')){
                            map_from_cell_to_labels[cell.execution_count].add('data collection');
                        }
                        else if(line.includes('Perceptron')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('make_blobs')){
                            map_from_cell_to_labels[cell.execution_count].add('data labeling');
                        }
                        else if(line.includes('DBSCAN')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('normalized_mutual_info_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('adjusted_rand_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('MiniBatchKMeans')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('KMeans')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('Birch')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('silhouette_score')){
                            map_from_cell_to_labels[cell.execution_count].add('evaluation');
                            eval_set.add(line);
                        }
                        else if(line.includes('MultinomialNB')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('BernoulliNB')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('ComplementNB')){
                            map_from_cell_to_labels[cell.execution_count].add('training');
                            training_set.add(line);
                        }
                        else if(line.includes('TfidfTransformer')){
                            map_from_cell_to_labels[cell.execution_count].add('feature engineering');
                        }
                    } 
                }
            }
        }


        for (let cell of programJson.cells){
            let prev = '';

            if((cell.execution_count in map_from_cell_to_labels) && (map_from_cell_to_labels[cell.execution_count].size == 2) 
                && (map_from_cell_to_labels[cell.execution_count].has('training')) && (map_from_cell_to_labels[cell.execution_count].has('evaluation'))){
                
                console.log(cell.source);

                for(let line of cell.source){
                    if((training_set.has(line)) && (prev != 'training') && (prev != '')){
                        console.log('\n\nconsider splitting here');
                    }

                    if(training_set.has(line)){
                        prev = 'training';
                    }

                    if((eval_set.has(line))&&(prev != 'evaluation')&&(prev != '')){
                        console.log('\n\nconsider splitting here');
                    }

                    if(eval_set.has(line)){
                        prev = 'evaluation';
                    }

                    console.log(line);
                }

                console.log('\n\n\n\n');
            }
        }


        return [true, cell_count, map_from_cell_to_labels];
    }
}

