module.exports = {
    // label: string -> string
    // input: line of code
    // returns: its corresponding label based on the keyword it contains
    label: function(line) {
        if(line.slice(0, 6) == "import") {
            return "";
        }
        if(line.split(" ").length >= 3 && line.split(" ")[2] == "import") {
            return "";
        }
        if (line == "" || line == "\n") {
            return "";
        }
        if (line.includes("RandomizedSearchCV")) {
            return "training";
        }
        if (line.includes("make_moons")) {
            return "data collection";
        }
        if (line.includes(".compile")) {
            return "training";
        }
        if (line.includes("fetch_mldata")) {
            return "data collection";
        }
        if (line.includes("PCA")) {
            return "wrangling"; 
        }
        if (line.includes("NMF")) {
            return "wrangling";
        }
        if (line.includes(".predict_proba")) {
            return "evaluation";
        }
        if (line.includes(".plot")) {
            return "exploration";
        }
        if (line.includes(".show")) {
            return "exploration";
        }
        if (line.includes("best_params_")) {
            return "evaluation";
        }
        if (line.includes("best_score_")) {
            return "evaluation";
        }
        if (line.includes("grid_scores_")) {
            return "evaluation";
        }
        if (line.includes("best_estimator_")) {
            return "evaluation";
        }
        if (line.includes(".feature_importances_")) {
            return "evaluation";
        }
        if (line.includes(".subplot")) {
            return "exploration";
        }
        if (line.includes(".histogram")) {
            return "exploration";
        }
        if (line.includes(".matshow")) {
            return "exploration";
        }
        if (line.includes(".imshow")) {
            return "exploration";
        }
        if (line.includes(".contour")) {
            return "exploration";
        }
        if (line.includes(".scatter")) {
            return "exploration";
        }

        // sklearn.cluster: Clustering
        // classes
        if (line.includes("AffinityPropagation")) {
            return "exploration";
        }
        if (line.includes("AgglomerativeClustering")) {
            return "exploration";
        }
        if (line.includes("Birch")) {
            return "exploration";
        }
        if (line.includes("DBSCAN")) {
            return "exploration";
        }
        if (line.includes("FeatureAgglomeration")) {
            return "exploration";
        }
        if (line.includes("KMeans")) {
            return "exploration";
        }
        if (line.includes("MiniBatchKMeans")) {
            return "exploration";
        }
        if (line.includes("MeanShift")) {
            return "exploration";
        }
        if (line.includes("OPTICS")) {
            return "exploration";
        }
        if (line.includes("SpectralClustering")) {
            return "exploration";
        }
        if (line.includes("SpectralBiclustering")) {
            return "exploration";
        }
        if (line.includes("SpectralCoclustering")) {
            return "exploration";
        }
        // functions
        if (line.includes("affinity_propagation")) {
            return "exploration";
        }
        if (line.includes("cluster_optics_dbscan")) {
            return "exploration";
        }
        if (line.includes("cluster_optics_xi")) {
            return "exploration";
        }
        if (line.includes("compute_optics_graph")) {
            return "exploration";
        }
        if (line.includes("dbscan")) {
            return "exploration";
        }
        if (line.includes("estimate_bandwidth")) {
            return "exploration";
        }
        if (line.includes("k_means")) {
            return "exploration";
        }
        if (line.includes("kmeans_plusplus")) {
            return "exploration";
        }
        if (line.includes("mean_shift")) {
            return "exploration";
        }
        if (line.includes("spectral_clustering")) {
            return "exploration";
        }
        if (line.includes("ward_tree")) {
            return "exploration";
        }

        // sklearn.compose: Composite Estimators
        if (line.includes("ColumnTransformer")) {
            return "exploration";
        }
        if (line.includes("TransformedTargetRegressor")) {
            return "training";
        }
        if (line.includes("make_column_transformer")) {
            return "exploration";
        }
        if (line.includes("make_column_selector")) {
            return "exploration";
        }

        // sklearn.datasets: Datasets
        if(line.includes("fetch_20newsgroups")){
            return "data collection";
        }
        if(line.includes("fetch_20newsgroups_vectorized")){
            return "data collection";
        }
        if(line.includes("fetch_california_housing")){
            return "data collection";
        }
        if(line.includes("fetch_covtype")){
            return "data collection";
        }
        if(line.includes("fetch_kddcup99")){
            return "data collection";
        }
        if(line.includes("fetch_lfw_pairs")){
            return "data collection";
        }
        if(line.includes("fetch_lfw_people")){
            return "data collection";
        }
        if(line.includes("fetch_olivetti_faces")){
            return "data collection";
        }
        if(line.includes("fetch_openml")){
            return "data collection";
        }
        if(line.includes("fetch_rcv1")){
            return "data collection";
        }
        if(line.includes("fetch_species_distributions")){
            return "data collection";
        }
        if(line.includes("load_boston")){
            return "data collection";
        }
        if(line.includes("load_breast_cancer")){
            return "data collection";
        }
        if(line.includes("load_diabetes")){
            return "data collection";
        }
        if(line.includes("load_digits")){
            return "data collection";
        }
        if(line.includes("load_files")){
            return "data collection";
        }
        if(line.includes("load_iris")){
            return "data collection";
        }
        if(line.includes("load_linnerud")){
            return "data collection";
        }
        if(line.includes("load_sample_image")){
            return "data collection";
        }
        if(line.includes("load_sample_images")){
            return "data collection";
        }
        if(line.includes("load_svmlight_file")){
            return "data collection";
        }
        if(line.includes("load_svmlight_files")){
            return "data collection";
        }
        if(line.includes("load_wine")){
            return "data collection";
        }
        // sample generators
        if(line.includes("make_biclusters")){
            return "data collection";
        }
        if(line.includes("make_blobs")){
            return "data collection";
        }
        if(line.includes("make_checkerboard")){
            return "data collection";
        }
        if(line.includes("make_classification")){
            return "data collection";
        }
        if(line.includes("make_friedman1")){
            return "data collection";
        }
        if(line.includes("make_friedman2")){
            return "data collection";
        }
        if(line.includes("make_friedman3")){
            return "data collection";
        }
        if(line.includes("make_gaussian_quantiles")){
            return "data collection";
        }
        if(line.includes("make_hastie_10_2")){
            return "data collection";
        }
        if(line.includes("make_low_rank_matrix")){
            return "data collection";
        }
        if(line.includes("make_multilabel_classification")){
            return "data collection";
        }
        if(line.includes("make_regression")){
            return "data collection";
        }
        if(line.includes("make_s_curve")){
            return "data collection";
        }
        if(line.includes("make_sparse_spd_matrix")){
            return "data collection";
        }
        if(line.includes("make_sparse_uncorrelated")){
            return "data collection";
        }
        if(line.includes("make_spd_matrix")){
            return "data collection";
        }
        if(line.includes("make_swiss_roll")){
            return "data collection";
        }

        // sklearn.dummy: Dummy estimators
        if(line.includes("DummyClassifier")){
            return "exploration";
        }
        if(line.includes("DummyRegressor")){
            return "exploration";
        }

        // sklearn.ensemble: Ensemble Methods
        if(line.includes("AdaBoostClassifier")){
            return "training";
        }
        if(line.includes("AdaBoostRegressor")){
            return "training";
        }
        if(line.includes("BaggingClassifier")){
            return "training";
        }
        if(line.includes("BaggingRegressor")){
            return "training";
        }
        if(line.includes("ExtraTreeClassifier")){
            return "training";
        }
        if(line.includes("ExtraTreeRegressor")){
            return "training";
        }
        if(line.includes("GradientBoostingClassifier")){
            return "training";
        }
        if(line.includes("GradientBoostingRegressor")){
            return "training";
        }
        if(line.includes("RandomForestClassifier")){
            return "training";
        }
        if(line.includes("RandomForestRegressor")){
            return "training";
        }
        if(line.includes("StackingClassifier")){
            return "training";
        }
        if(line.includes("StackingRegressor")){
            return "training";
        }
        if(line.includes("VotingClassifier")){
            return "training";
        }
        if(line.includes("VotingRegressor")){
            return "training";
        }
        if(line.includes("HistGradientBoostingRegressor")){
            return "training";
        }
        if(line.includes("HistGradientBoostingClassifier")){
            return "training";
        }

        // sklearn.experimental: Experimental
        if(line.includes("enable_hist_gradient_boosting")){
            return "training";
        }
        if(line.includes("enable_halving_search_cv")){
            return "training";
        }

        // sklearn.feature_extraction: Feature Extraction
        if(line.includes("DictVectorizer")){
            return "wrangling";
        }
        if(line.includes("FeatureHasher")){
            return "wrangling";
        }
        // from images
        if(line.includes("extract_patches_2d")){
            return "wrangling";
        }
        if(line.includes("grid_to_graph")){
            return "wrangling";
        }
        if(line.includes("img_to_graph")){
            return "wrangling";
        }
        if(line.includes("reconstruct_from_patches_2d")){
            return "wrangling";
        }
        if(line.includes("PatchExtractor")){
            return "wrangling";
        }
        // from text
        if(line.includes("CountVectorizer")){
            return "wrangling";
        }
        if(line.includes("HashingVectorizer")){
            return "wrangling";
        }
        if(line.includes("TfidfTransformer")){
            return "wrangling";
        }
        if(line.includes("TfidfVectorizer")){
            return "wrangling";
        }

        // sklearn.feature_selection: Feature Selection
        if(line.includes("GenericUnivariateSelect")){
            return "wrangling";
        }
        if(line.includes("SelectPercentile")){
            return "wrangling";
        }
        if(line.includes("SelectKBest")){
            return "wrangling";
        }
        if(line.includes("SelectFpr")){
            return "wrangling";
        }
        if(line.includes("SelectFdr")){
            return "wrangling";
        }
        if(line.includes("SelectFromModel")){
            return "wrangling";
        }
        if(line.includes("SelectFwe")){
            return "wrangling";
        }
        if(line.includes("SequentialFeatureSelector")){
            return "wrangling";
        }
        if(line.includes("RFE")){
            return "wrangling";
        }
        if(line.includes("RFECV")){
            return "wrangling";
        }
        if(line.includes("VarianceThreshold")){
            return "wrangling";
        }
        if(line.includes("chi2")){
            return "wrangling";
        }
        if(line.includes("f_classif")){
            return "wrangling";
        }
        if(line.includes("f_regression")){
            return "wrangling";
        }
        if(line.includes("mutual_info_classif")){
            return "wrangling";
        }
        if(line.includes("mutual_info_regression")){
            return "wrangling";
        }

        // sklearn.gaussian_process: Gaussian Processes
        if(line.includes("GaussianProcessClassifier")){
            return "training";
        }
        if(line.includes("GaussianProcessRegressor")){
            return "training";
        }

        // sklearn.linear_model: Linear Models
        // linear classifiers
        if(line.includes("LogisticRegression")){
            return "training";
        }
        if(line.includes("LogisticRegressionCV")){
            return "training";
        }
        if(line.includes("PassiveAggressiveClassifier")){
            return "training";
        }
        if(line.includes("Perceptron")){
            return "training";
        }
        if(line.includes("RidgeClassifier")){
            return "training";
        }
        if(line.includes("RidgeClassifierCV")){
            return "training";
        }
        if(line.includes("SGDClassifier")){
            return "training";
        }
        // classical linear regressors
        if(line.includes("LinearRegression")){
            return "training";
        }
        if(line.includes("Ridge(")){
            return "training";
        }
        if(line.includes("RidgeCV")){
            return "training";
        }
        if(line.includes("SGDRegressor")){
            return "training";
        }
        // regressors with variable selection
        if(line.includes("ElasticNet(")){
            return "training";
        }
        if(line.includes("ElasticNetCV")){
            return "training";
        }
        if(line.includes("Lars")){
            return "training";
        }
        if(line.includes("LarsCV")){
            return "training";
        }
        if(line.includes("Lasso(")){
            return "training";
        }
        if(line.includes("LassoCV")){
            return "training";
        }
        if(line.includes("LassoLars")){
            return "training";
        }
        if(line.includes("LassoLarsCV")){
            return "training";
        }
        if(line.includes("LassoLarsIC")){
            return "training";
        }
        if(line.includes("OrthogonalMatchingPursuit")){
            return "training";
        }
        if(line.includes("OrthogonalMatchingPursuitCV")){
            return "training";
        }
        // bayesian regressors
        if(line.includes("ARDRegression")){
            return "training";
        }
        if(line.includes("BayesianRidge")){
            return "training";
        }
        // multi-task linear regressors with variable selection
        if(line.includes("MultiTaskElasticNet")){
            return "training";
        }
        if(line.includes("MultiTaskElasticNetCV")){
            return "training";
        }
        if(line.includes("MultiTaskLasso")){
            return "training";
        }
        if(line.includes("MultiTaskLassoCV")){
            return "training";
        }
        // outlier-robust regressors
        if(line.includes("HuberRegressor")){
            return "training";
        }
        if(line.includes("RANSACRegressor")){
            return "training";
        }
        if(line.includes("TheilSenRegressor")){
            return "training";
        }
        // generalized linear models (GLM) for regression
        if(line.includes("PoissonRegressor")){
            return "training";
        }
        if(line.includes("TweedieRegressor")){
            return "training";
        }
        if(line.includes("GammaRegressor")){
            return "training";
        }
        // miscellaneous
        if(line.includes("PassiveAggressiveRegressor")){
            return "training";
        }
        if(line.includes("enet_path")){
            return "training";
        }
        if(line.includes("lars_path")){
            return "training";
        }
        if(line.includes("lars_path_gram")){
            return "training";
        }
        if(line.includes("lasso_path")){
            return "training";
        }
        if(line.includes("orthogonal_mp")){
            return "training";
        }
        if(line.includes("orthogonal_mp_gram")){
            return "training";
        }
        if(line.includes("ridge_regression")){
            return "training";
        }

        // sklearn.metrics: Metrics
        // model selection interface
        if(line.includes("check_scoring")){
            return "evaluation";
        }
        if(line.includes("get_scorer")){
            return "evaluation";
        }
        if(line.includes("make_scorer")){
            return "evaluation";
        }
        // classification metrics
        if(line.includes("accuracy_score")){
            return "evaluation";
        }
        if(line.includes("auc")){
            return "evaluation";
        }
        if(line.includes("average_precision_score")){
            return "evaluation";
        }
        if(line.includes("balanced_accuracy_score")){
            return "evaluation";
        }
        if(line.includes("brier_score_loss")){
            return "evaluation";
        }
        if(line.includes("classification_report")){
            return "evaluation";
        }
        if(line.includes("cohen_kappa_score")){
            return "evaluation";
        }
        if(line.includes("confusion_matrix")){
            return "evaluation";
        }
        if(line.includes("dcg_score")){
            return "evaluation";
        }
        if(line.includes("det_curve")){
            return "evaluation";
        }
        if(line.includes("f1_score")){
            return "evaluation";
        }
        if(line.includes("fbeta_score")){
            return "evaluation";
        }
        if(line.includes("hamming_loss")){
            return "evaluation";
        }
        if(line.includes("hinge_loss")){
            return "evaluation";
        }
        if(line.includes("jaccard_score")){
            return "evaluation";
        }
        if(line.includes("log_loss")){
            return "evaluation";
        }
        if(line.includes("matthews_corrcoef")){
            return "evaluation";
        }
        if(line.includes("multilabel_confusion_matrix")){
            return "evaluation";
        }
        if(line.includes("ndcg_score")){
            return "evaluation";
        }
        if(line.includes("precision_recall_curve")){
            return "evaluation";
        }
        if(line.includes("precision_recall_fscore_support")){
            return "evaluation";
        }
        if(line.includes("precision_score")){
            return "evaluation";
        }
        if(line.includes("recall_score")){
            return "evaluation";
        }
        if(line.includes("roc_auc_score")){
            return "evaluation";
        }
        if(line.includes("roc_curve")){
            return "evaluation";
        }
        if(line.includes("top_k_accuracy_score")){
            return "evaluation";
        }
        if(line.includes("zero_one_loss")){
            return "evaluation";
        }
        // regression metrics
        if(line.includes("explained_variance_score")){
            return "evaluation";
        }
        if(line.includes("max_error")){
            return "evaluation";
        }
        if(line.includes("mean_absolute_error")){
            return "evaluation";
        }
        if(line.includes("mean_squared_error")){
            return "evaluation";
        }
        if(line.includes("mean_squared_log_error")){
            return "evaluation";
        }
        if(line.includes("median_absolute_error")){
            return "evaluation";
        }
        if(line.includes("mean_absolute_percentage_error")){
            return "evaluation";
        }
        if(line.includes("r2_score")){
            return "evaluation";
        }
        if(line.includes("mean_poisson_deviance")){
            return "evaluation";
        }
        if(line.includes("mean_gamma_deviance")){
            return "evaluation";
        }
        if(line.includes("mean_tweedie_deviance")){
            return "evaluation";
        }
        // multilabel ranking metrics
        if(line.includes("coverage_error")){
            return "evaluation";
        }
        if(line.includes("label_ranking_average_precision_score")){
            return "evaluation";
        }
        if(line.includes("label_ranking_loss")){
            return "evaluation";
        }
        // clustering metrics
        if(line.includes("adjusted_mutual_info_score")){
            return "evaluation";
        }
        if(line.includes("adjusted_rand_score")){
            return "evaluation";
        }
        if(line.includes("calinski_harabasz_score")){
            return "evaluation";
        }
        if(line.includes("davies_bouldin_score")){
            return "evaluation";
        }
        if(line.includes("completeness_score")){
            return "evaluation";
        }
        if(line.includes("contingency_matrix")){
            return "evaluation";
        }
        if(line.includes("pair_confusion_matrix")){
            return "evaluation";
        }
        if(line.includes("fowlkes_mallows_score")){
            return "evaluation";
        }
        if(line.includes("homogeneity_completeness_v_measure")){
            return "evaluation";
        }
        if(line.includes("homogeneity_score")){
            return "evaluation";
        }
        if(line.includes("mutual_info_score")){
            return "evaluation";
        }
        if(line.includes("normalized_mutual_info_score")){
            return "evaluation";
        }
        if(line.includes("rand_score")){
            return "evaluation";
        }
        if(line.includes("silhouette_score")){
            return "evaluation";
        }
        if(line.includes("silhouette_samples")){
            return "evaluation";
        }
        if(line.includes("v_measure_score")){
            return "evaluation";
        }
        // biclustering metrics
        if(line.includes("consensus_score")){
            return "evaluation";
        }
        // pairwise metrics
        if(line.includes("additive_chi2_kernel")){
            return "evaluation";
        }
        if(line.includes("chi2_kernel")){
            return "evaluation";
        }
        if(line.includes("cosine_similarity")){
            return "evaluation";
        }
        if(line.includes("cosine_distances")){
            return "evaluation";
        }
        if(line.includes("distance_metrics")){
            return "evaluation";
        }
        if(line.includes("euclidean_distances")){
            return "evaluation";
        }
        if(line.includes("haversine_distances")){
            return "evaluation";
        }
        if(line.includes("kernel_metrics")){
            return "evaluation";
        }
        if(line.includes("laplacian_kernel")){
            return "evaluation";
        }
        if(line.includes("linear_kernel")){
            return "evaluation";
        }
        if(line.includes("manhattan_distances")){
            return "evaluation";
        }
        if(line.includes("nan_euclidean_distances")){
            return "evaluation";
        }
        if(line.includes("pairwise_kernels")){
            return "evaluation";
        }
        if(line.includes("polynomial_kernel")){
            return "evaluation";
        }
        if(line.includes("rbf_kernel")){
            return "evaluation";
        }
        if(line.includes("sigmoid_kernel")){
            return "evaluation";
        }
        if(line.includes("paired_euclidean_distances")){
            return "evaluation";
        }
        if(line.includes("paired_manhattan_distances")){
            return "evaluation";
        }
        if(line.includes("paired_cosine_distances")){
            return "evaluation";
        }
        if(line.includes("paired_distances")){
            return "evaluation";
        }
        if(line.includes("pairwise_distances")){
            return "evaluation";
        }
        if(line.includes("pairwise_distances_argmin")){
            return "evaluation";
        }
        if(line.includes("pairwise_distances_argmin_min")){
            return "evaluation";
        }
        if(line.includes("pairwise_distances_chunked")){
            return "evaluation";
        }
        // exploration
        if(line.includes("plot_confusion_matrix")){
            return "exploration";
        }
        if(line.includes("plot_det_curve")){
            return "exploration";
        }
        if(line.includes("plot_precision_recall_curve")){
            return "exploration";
        }
        if(line.includes("plot_roc_curve")){
            return "exploration";
        }
        if(line.includes("ConfusionMatrixDisplay")){
            return "exploration";
        }
        if(line.includes("DetCurveDisplay")){
            return "exploration";
        }
        if(line.includes("PrecisionRecallDisplay")){
            return "exploration";
        }
        if(line.includes("RocCurveDisplay")){
            return "exploration";
        }

        // sklearn.mixture: Gaussian Mixture Models
        if(line.includes("BayesianGaussianMixture")){
            return "evaluation";
        }
        if(line.includes("GaussianMixture")){
            return "evaluation";
        }

        // sklearn.model_selection: Model Selection
        if(line.includes("GroupKFold")){
            return "evaluation";
        }
        if(line.includes("GroupShuffleSplit")){
            return "evaluation";
        }
        if(line.includes("KFold")){
            return "evaluation";
        }
        if(line.includes("LeaveOneGroupOut")){
            return "evaluation";
        }
        if(line.includes("LeavePGroupsOut")){
            return "evaluation";
        }
        if(line.includes("LeaveOneOut")){
            return "evaluation";
        }
        if(line.includes("LeavePOut")){
            return "evaluation";
        }
        if(line.includes("PredefinedSplit")){
            return "evaluation";
        }
        if(line.includes("RepeatedKFold")){
            return "evaluation";
        }
        if(line.includes("RepeatedStratifiedKFold")){
            return "evaluation";
        }
        if(line.includes("ShuffleSplit")){
            return "evaluation";
        }
        if(line.includes("StratifiedKFold")){
            return "evaluation";
        }
        if(line.includes("StratifiedShuffleSplit")){
            return "evaluation";
        }
        if(line.includes("TimeSeriesSplit")){
            return "evaluation";
        }
        // splitter functions
        if(line.includes("train_test_split")){
            return "wrangling";
        }
        // hyper-parameter optimizers
        if(line.includes("GridSearchCV")){
            return "training";
        }
        if(line.includes("HalvingGridSearchCV")){
            return "training";
        }
        if(line.includes("ParameterGrid")){
            return "training";
        }
        if(line.includes("ParameterSampler")){
            return "training";
        }
        if(line.includes("RandomizedSearchCV")){
            return "training";
        }
        if(line.includes("HalvingRandomSearchCV")){
            return "training";
        }
        // model validation
        if(line.includes("cross_validate")){
            return "evaluation";
        }
        if(line.includes("cross_val_predict")){
            return "evaluation";
        }
        if(line.includes("cross_val_score")){
            return "evaluation";
        }
        if(line.includes("learning_curve")){
            return "evaluation";
        }
        if(line.includes("permutation_test_score")){
            return "evaluation";
        }
        if(line.includes("validation_curve")){
            return "evaluation";
        }

        // sklearn.multiclass: Multiclass classification
        if(line.includes("OneVsRestClassifier")){
            return "training";
        }
        if(line.includes("OneVsOneClassifier")){
            return "training";
        }
        if(line.includes("OneputCodeClassifier")){
            return "training";
        }

        // sklearn.multioutput: Multioutput regression and classification
        if(line.includes("ClassifierChain")){
            return "training";
        }
        if(line.includes("MultiOutputRegressor")){
            return "training";
        }
        if(line.includes("MultiOutputClassifier")){
            return "training";
        }
        if(line.includes("RegressorChain")){
            return "training";
        }

        // sklearn.naive_bayes: Naive Bayes
        if(line.includes("BernoulliNB")){
            return "training";
        }
        if(line.includes("CategoricalNB")){
            return "training";
        }
        if(line.includes("ComplementNB")){
            return "training";
        }
        if(line.includes("GaussianNB")){
            return "training";
        }
        if(line.includes("MultinomialNB")){
            return "training";
        }

        // sklearn.neighbors: Nearest Neighbors
        if(line.includes("KNeighborsClassifier")){
            return "training";
        }
        if(line.includes("KNeighborsRegressor")){
            return "training";
        }
        if(line.includes("RadiusNeighborsClassifier")){
            return "training";
        }
        if(line.includes("RadiusNeighborsRegressor")){
            return "training";
        }
        if(line.includes("NearestCentroid")){
            return "training";
        }
        if(line.includes("NearestNeighbors")){
            return "exploration";
        }
        if(line.includes("NeighborhoodComponentsAnalysis")){
            return "training";
        }

        // sklearn.neural_network: Neural network models
        if(line.includes("BernoulliRBM")){
            return "training";
        }
        if(line.includes("MLPClassifier")){
            return "training";
        }
        if(line.includes("MLPRegressor")){
            return "training";
        }

        // sklearn.preprocessing: Preprocessing and Normalization
        if(line.includes("Binarizer")){
            return "wrangling";
        }
        if(line.includes("FunctionTransformer")){
            return "wrangling";
        }
        if(line.includes("KBinsDiscretizer")){
            return "wrangling";
        }
        if(line.includes("KernelCenterer")){
            return "wrangling";
        }
        if(line.includes("LabelBinarizer")){
            return "wrangling";
        }
        if(line.includes("LabelEncoder")){
            return "wrangling";
        }
        if(line.includes("MultiLabelBinarizer")){
            return "wrangling";
        }
        if(line.includes("MaxAbsScaler")){
            return "wrangling";
        }
        if(line.includes("MinMaxScaler")){
            return "wrangling";
        }
        if(line.includes("Normalizer")){
            return "wrangling";
        }
        if(line.includes("OneHotEncoder")){
            return "wrangling";
        }
        if(line.includes("OrdinalEncoder")){
            return "wrangling";
        }
        if(line.includes("PolynomialFeatures")){
            return "wrangling";
        }
        if(line.includes("PowerTransformer")){
            return "wrangling";
        }
        if(line.includes("QuantileTransformer")){
            return "wrangling";
        }
        if(line.includes("RobustScaler")){
            return "wrangling";
        }
        if(line.includes("StandardScaler")){
            return "wrangling";
        }
        if(line.includes("add_dummy_feature")){
            return "wrangling";
        }
        if(line.includes("binarizer")){
            return "wrangling";
        }
        if(line.includes("label_binarize")){
            return "wrangling";
        }
        if(line.includes("maxabs_scale")){
            return "wrangling";
        }
        if(line.includes("minmax_scale")){
            return "wrangling";
        }
        if(line.includes("normalize")){
            return "wrangling";
        }
        if(line.includes("quantile_transform")){
            return "wrangling";
        }
        if(line.includes("robust_scale")){
            return "wrangling";
        }
        if(line.includes("power_transform")){
            return "wrangling";
        }

        // sklearn.semi_supervised: Semi-Supervised Learning
        if(line.includes("LabelPropagation")){
            return "training";
        }
        if(line.includes("LabelSpreading")){
            return "training";
        }
        if(line.includes("SelfTrainingClassifier")){
            return "training";
        }

        // sklearn.svm: Support Vector Machines
        // estimators
        if(line.includes("LinearSVC")){
            return "training";
        }
        if(line.includes("LinearSVR")){
            return "training";
        }
        if(line.includes("NuSVC")){
            return "training";
        }
        if(line.includes("NuSVR")){
            return "training";
        }
        if(line.includes("OneClassSVM")){
            return "training";
        }
        if(line.includes("SVC(")){
            return "training";
        }
        if(line.includes("SVR")){
            return "training";
        }
        if(line.includes("l1_min_c")){
            return "training";
        }

        // sklearn.tree: Decision Trees
        if(line.includes("DecisionTreeClassifier")){
            return "training";
        }
        if(line.includes("DecisionTreeRegressor")){
            return "training";
        }
        if(line.includes("ExtraTreeClassifier")){
            return "training";
        }
        if(line.includes("ExtraTreeRegressor")){
            return "training";
        }
        // exploration
        if(line.includes("plot_tree")){
            return "exploration";
        }

        // keras Model API
        if (line.includes("Model(")) {
            return "training";
        }
        if (line.includes(".summary(")) {
            return "exploration";
        }
        if (line.includes("Sequential")) {
            return "training";
        }
        if (line.includes(".compile")) {
            return "training";
        }
        // API: fit
        if (line.includes(".evaluate")) {
            return "evaluation";
        }
        // API: predict
        if (line.includes(".train_on_batch")) {
            return "training";
        }
        if (line.includes(".test_on_batch")) {
            return "evaluation";
        }
        if (line.includes(".predict_on_batch")) {
            return "evaluation";
        }
        if (line.includes(".run_eagerly")) {
            return "training";
        }
        // API: save
        // API: save_model
        if (line.includes(".load_model")) {
            return "training";
        }
        if (line.includes(".get_weights")) {
            return "training";
        }
        if (line.includes(".set_weights")) {
            return "training";
        }
        // API: save_weights
        if (line.includes(".load_weights")) {
            return "training";
        }
        if (line.includes(".get_config")) {
            return "training";
        }
        if (line.includes(".from_config")) {
            return "training";
        }
        if (line.includes(".model_from_config")) {
            return "training";
        }
        // API: to_json
        if (line.includes(".model_from_json")) {
            return "training";
        }
        if (line.includes(".clone_model")) {
            return "training";
        }

        // keras Layer API
        if (line.includes("Layer")) {
            return "training";
        }
        // API: weights
        // API: trainable_weights
        // API: non_trainable_weights
        // API: trainable
        // API: get_weights
        // API: set_weights
        // API: get_config
        if (line.includes(".add_loss")) {
            return "training";
        }
        if (line.includes(".add_metric")) {
            return "training";
        }
        // API: losses
        // API: metrics
        // API: dynamic
        if (line.includes(".relu")) {
            return "training";
        }
        if (line.includes(".sigmoid")) {
            return "training";
        }
        if (line.includes(".softmax")) {
            return "training";
        }
        if (line.includes(".softplus")) {
            return "training";
        }
        if (line.includes(".softsign")) {
            return "training";
        }
        if (line.includes(".tanh")) {
            return "training";
        }
        if (line.includes(".selu")) {
            return "training";
        }
        if (line.includes(".elu")) {
            return "training";
        }
        if (line.includes(".exponential")) {
            return "training";
        }
        // API: RandomNormal
        // API: random_normal
        // API: RandomUniform
        // API: random_uniform
        // API: TruncatedNormal
        // API: truncated_normal
        // API: Zeros
        // API: zeros
        // API: Ones
        // API: ones
        // API: GlorotNormal
        // API: glorot_normal
        // API: GlorotUniform
        // API: glorot_uniform
        // API: HeNormal
        // API: he_normal
        // API: HeUniform
        // API: he_uniform
        // API: Identity
        // API: identity
        // API: Orthogonal
        // API: orthogonal
        // API: Constant
        // API: constant
        // API: VarianceScaling
        // API: variance_scaling
        if (line.includes("L1")) {
            return "training";
        }
        if (line.includes("L2")) {
            return "training";
        }
        if (line.includes("L1L2")) {
            return "training";
        }
        // API: MaxNorm
        // API: max_norm
        // API: MinMaxNorm
        // API: min_max_norm
        // API: NonNeg
        // API: non_neg
        // API: UnitNorm
        // API: unit_norm
        // API: RadialConstraint
        if (line.includes("Input(")) {
            return "training";
        }
        if (line.includes("Dense(")) {
            return "training";
        }
        if (line.includes("Activation(")) {
            return "training";
        }
        if (line.includes("Embedding(")) {
            return "training";
        }
        if (line.includes("Masking(")) {
            return "training";
        }
        if (line.includes("Lambda(")) {
            return "training";
        }
        if (line.includes("Conv1D(")) {
            return "training";
        }
        if (line.includes("Conv2D(")) {
            return "training";
        }
        if (line.includes("Conv3D(")) {
            return "training";
        }
        if (line.includes("SeparableConv1D(")) {
            return "training";
        }
        if (line.includes("SeparableConv2D(")) {
            return "training";
        }
        if (line.includes("DepthwiseConv2D(")) {
            return "training";
        }
        if (line.includes("Conv2DTranspose(")) {
            return "training";
        }
        if (line.includes("Conv3DTranspose(")) {
            return "training";
        }
        if (line.includes("MaxPooling1D(")) {
            return "training";
        }
        if (line.includes("MaxPooling2D(")) {
            return "training";
        }
        if (line.includes("MaxPooling3D(")) {
            return "training";
        }
        if (line.includes("AveragePooling1D(")) {
            return "training";
        }
        if (line.includes("AveragePooling2D(")) {
            return "training";
        }
        if (line.includes("AveragePooling3D(")) {
            return "training";
        }
        if (line.includes("GlobalMaxPooling1D(")) {
            return "training";
        }
        if (line.includes("GlobalMaxPooling2D(")) {
            return "training";
        }
        if (line.includes("GlobalMaxPooling3D(")) {
            return "training";
        }
        if (line.includes("GlobalAveragePooling1D(")) {
            return "training";
        }
        if (line.includes("GlobalAveragePooling2D(")) {
            return "training";
        }
        if (line.includes("GlobalAveragePooling3D(")) {
            return "training";
        }
        if (line.includes("LSTM(")) {
            return "training";
        }
        if (line.includes("GRU(")) {
            return "training";
        }
        if (line.includes("SimpleRNN(")) {
            return "training";
        }
        if (line.includes("TimeDistributed(")) {
            return "training";
        }
        if (line.includes("Bidirectional(")) {
            return "training";
        }
        if (line.includes("ConvLSTM1D(")) {
            return "training";
        }
        if (line.includes("ConvLSTM2D(")) {
            return "training";
        }
        if (line.includes("ConvLSTM3D(")) {
            return "training";
        }
        if (line.includes("RNN(")) {
            return "training";
        }
        if (line.includes("TextVectorization(")) {
            return "wrangling";
        }
        if (line.includes("Normalization(")) {
            return "wrangling";
        }
        if (line.includes("Discretization(")) {
            return "wrangling";
        }
        if (line.includes("TextVectorization(")) {
            return "wrangling";
        }
        if (line.includes("CategoryEncoding(")) {
            return "wrangling";
        }
        if (line.includes("Hashing(")) {
            return "wrangling";
        }
        if (line.includes("StringLookup(")) {
            return "wrangling";
        }
        if (line.includes("IntegerLookup(")) {
            return "wrangling";
        }
        if (line.includes("Resizing(")) {
            return "wrangling";
        }
        if (line.includes("Rescaling(")) {
            return "wrangling";
        }
        if (line.includes("CenterCrop(")) {
            return "wrangling";
        }
        if (line.includes("RandomCrop(")) {
            return "wrangling";
        }
        if (line.includes("RandomFlip(")) {
            return "wrangling";
        }
        if (line.includes("RandomTranslation(")) {
            return "wrangling";
        }
        if (line.includes("RandomRotation(")) {
            return "wrangling";
        }
        if (line.includes("RandomZoom(")) {
            return "wrangling";
        }
        if (line.includes("RandomHeight(")) {
            return "wrangling";
        }
        if (line.includes("RandomWidth(")) {
            return "wrangling";
        }
        if (line.includes("RandomContrast(")) {
            return "wrangling";
        }
        if (line.includes("BatchNormalization(")) {
            return "training";
        }
        if (line.includes("LayerNormalization(")) {
            return "training";
        }
        if (line.includes("Dropout(")) {
            return "training";
        }
        if (line.includes("SpatialDropout1D(")) {
            return "training";
        }
        if (line.includes("SpatialDropout2D(")) {
            return "training";
        }
        if (line.includes("SpatialDropout3D(")) {
            return "training";
        }
        if (line.includes("GaussianDropout(")) {
            return "training";
        }
        if (line.includes("GaussianNoise(")) {
            return "training";
        }
        if (line.includes("ActivityRegularization(")) {
            return "training";
        }
        if (line.includes("AlphaDropout(")) {
            return "training";
        }
        if (line.includes("MultiHeadAttention(")) {
            return "training";
        }
        if (line.includes("Attention(")) {
            return "training";
        }
        if (line.includes("AdditiveAttention(")) {
            return "training";
        }
        if (line.includes("Reshape(")) {
            return "training";
        }
        if (line.includes("Flatten(")) {
            return "training";
        }
        if (line.includes("RepeatVector(")) {
            return "training";
        }
        if (line.includes("Permute(")) {
            return "training";
        }
        if (line.includes("RepeatVector(")) {
            return "training";
        }
        // API: Cropping1D
        // API: Cropping2D
        // API: Cropping3D
        // API: Unsampling1D
        // API: Unsampling2D
        // API: Unsampling3D
        // API: ZeroPadding1D
        // API: ZeroPadding2D
        // API: ZeroPadding3D
        // API: Concatenate
        // API: Average
        // API: Maximum
        // API: Minimum
        // API: Add
        // API: Subtract
        // API: Multiply
        // API: Dot
        if (line.includes("LocallyConnected1D(")) {
            return "training";
        }
        if (line.includes("LocallyConnected2D(")) {
            return "training";
        }
        if (line.includes("ReLU(")) {
            return "training";
        }
        if (line.includes("Softmax(")) {
            return "training";
        }
        if (line.includes("LeakyReLU(")) {
            return "training";
        }
        if (line.includes("PReLU(")) {
            return "training";
        }
        if (line.includes("ELU(")) {
            return "training";
        }
        if (line.includes("ThresholdedReLU(")) {
            return "training";
        }
        if (line.includes("CallBack(")) {
            return "training";
        }
        if (line.includes("ModelCheckpoint(")) {
            return "training";
        }
        if (line.includes("TensorBoard(")) {
            return "training";
        }
        if (line.includes("EarlyStopping(")) {
            return "training";
        }
        if (line.includes("LearningRateScheduler(")) {
            return "training";
        }
        if (line.includes("ReduceLROnPlateau(")) {
            return "training";
        }
        if (line.includes("RemoteMonitor(")) {
            return "training";
        }
        if (line.includes("LambdaCallback(")) {
            return "training";
        }
        if (line.includes("TerminateOnNaN(")) {
            return "training";
        }
        if (line.includes("CSVLogger(")) {
            return "training";
        }
        if (line.includes("ProgbarLogger(")) {
            return "training";
        }
        if (line.includes("BackupAndRestore(")) {
            return "training";
        }
        if (line.includes("SGD(")) {
            return "training";
        }
        if (line.includes("RMSprop(")) {
            return "training";
        }
        if (line.includes("Adam(")) {
            return "training";
        }
        if (line.includes("Adadelta(")) {
            return "training";
        }
        if (line.includes("Adagrad(")) {
            return "training";
        }
        if (line.includes("Adamax(")) {
            return "training";
        }
        if (line.includes("Nadam(")) {
            return "training";
        }
        if (line.includes("Ftrl(")) {
            return "training";
        }
        if (line.includes("apply_gradients(")) {
            return "training";
        }
        // API: weights
        // API: get_weights
        // API: set_weights
        if (line.includes("Accuracy(")) {
            return "evaluation";
        }
        if (line.includes("BinaryAccuracy(")) {
            return "evaluation";
        }
        if (line.includes("CategoricalAccuracy(")) {
            return "evaluation";
        }
        if (line.includes("SparseCategoricalAccuracy(")) {
            return "evaluation";
        }
        if (line.includes("TopKCategoricalAccuracy(")) {
            return "evaluation";
        }
        if (line.includes("SparseTopKCategoricalAccuracy(")) {
            return "evaluation";
        }
        if (line.includes("BinaryCrossentropy(")) {
            return "evaluation";
        }
        if (line.includes("CategoricalCrossentropy(")) {
            return "evaluation";
        }
        if (line.includes("SparseCategoricalCrossentropy(")) {
            return "evaluation";
        }
        if (line.includes("KLDivergence(")) {
            return "evaluation";
        }
        if (line.includes("Poisson(")) {
            return "evaluation";
        }
        if (line.includes("MeanSquaredError(")) {
            return "evaluation";
        }
        if (line.includes("RootMeanSquaredError(")) {
            return "evaluation";
        }
        if (line.includes("MeanAbsoluteError(")) {
            return "evaluation";
        }
        if (line.includes("MeanAbsolutePercentageError(")) {
            return "evaluation";
        }
        if (line.includes("MeanSquaredLogarithmicError(")) {
            return "evaluation";
        }
        if (line.includes("CosineSimilarity(")) {
            return "evaluation";
        }
        if (line.includes("LogCoshError(")) {
            return "evaluation";
        }
        if (line.includes("AUC(")) {
            return "evaluation";
        }
        if (line.includes("Precision(")) {
            return "evaluation";
        }
        if (line.includes("Recall(")) {
            return "evaluation";
        }
        if (line.includes("TruePositives(")) {
            return "evaluation";
        }
        if (line.includes("TrueNegatives(")) {
            return "evaluation";
        }
        if (line.includes("FalsePositives(")) {
            return "evaluation";
        }
        if (line.includes("FalseNegatives(")) {
            return "evaluation";
        }
        if (line.includes("PrecisionAtRecall(")) {
            return "evaluation";
        }
        if (line.includes("SensitivityAtSpecificity(")) {
            return "evaluation";
        }
        if (line.includes("SpecificityAtSensitivity(")) {
            return "evaluation";
        }
        if (line.includes("MeanIoU(")) {
            return "evaluation";
        }
        if (line.includes("Hinge(")) {
            return "evaluation";
        }
        if (line.includes("SquaredHinge(")) {
            return "evaluation";
        }
        if (line.includes("CategoricalHinge(")) {
            return "evaluation";
        }
        if (line.includes(".add_metric(")) {
            return "evaluation";
        }
        if (line.includes("binary_crossentropy(")) {
            return "evaluation";
        }
        if (line.includes("categorical_crossentropy(")) {
            return "evaluation";
        }
        if (line.includes("sparse_categorical_crossentropy(")) {
            return "evaluation";
        }
        if (line.includes(".poisson(")) {
            return "evaluation";
        }
        if (line.includes("KLDivergence(")) {
            return "evaluation";
        }
        if (line.includes("kl_divergence(")) {
            return "evaluation";
        }
        if (line.includes("mean_squared_error(")) {
            return "evaluation";
        }
        if (line.includes("mean_absolute_error(")) {
            return "evaluation";
        }
        if (line.includes("mean_absolute_percentage_error(")) {
            return "evaluation";
        }
        if (line.includes("mean_squared_logarithmic_error(")) {
            return "evaluation";
        }
        if (line.includes("cosine_similarity(")) {
            return "evaluation";
        }
        if (line.includes("Huber(")) {
            return "evaluation";
        }
        if (line.includes("huber(")) {
            return "evaluation";
        }
        if (line.includes("LogCosh(")) {
            return "evaluation";
        }
        if (line.includes("log_cosh(")) {
            return "evaluation";
        }
        if (line.includes("hinge(")) {
            return "evaluation";
        }
        if (line.includes("square_hinge(")) {
            return "evaluation";
        }
        if (line.includes("categorical_hinge(")) {
            return "evaluation";
        }
        if (line.includes("add_loss(")) {
            return "evaluation";
        }
        if (line.includes("image_dataset_from_directory(")) {
            return "data collection";
        }
        if (line.includes("load_img(")) {
            return "data collection";
        }
        if (line.includes("img_to_array(")) {
            return "data collection";
        }
        // API: save_img
        if (line.includes("timeseries_dataset_from_array(")) {
            return "data collection";
        }
        if (line.includes("text_dataset_from_directory(")) {
            return "data collection";
        }
        if (line.includes("load_data(")) {
            return "data collection";
        }
        if (line.includes("Xception(")) {
            return "training";
        }
        if (line.includes("VGG16(")) {
            return "training";
        }
        if (line.includes("VGG19(")) {
            return "training";
        }
        if (line.includes("ResNet50(")) {
            return "training";
        }
        if (line.includes("ResNet50V2(")) {
            return "training";
        }
        if (line.includes("ResNet101(")) {
            return "training";
        }
        if (line.includes("ResNet101V2(")) {
            return "training";
        }
        if (line.includes("ResNet152(")) {
            return "training";
        }
        if (line.includes("ResNet152V2(")) {
            return "training";
        }
        if (line.includes("InceptionV3(")) {
            return "training";
        }
        if (line.includes("InceptionResNetV2(")) {
            return "training";
        }
        if (line.includes("MobileNet(")) {
            return "training";
        }
        if (line.includes("MobileNetV2(")) {
            return "training";
        }
        if (line.includes("DenseNet121(")) {
            return "training";
        }
        if (line.includes("DenseNet169(")) {
            return "training";
        }
        if (line.includes("DenseNet201(")) {
            return "training";
        }
        if (line.includes("NASNetMobile(")) {
            return "training";
        }
        if (line.includes("NASNetLarge(")) {
            return "training";
        }
        if (line.includes("EfficientNetB0(")) {
            return "training";
        }
        if (line.includes("EfficientNetB1(")) {
            return "training";
        }
        if (line.includes("EfficientNetB2(")) {
            return "training";
        }
        if (line.includes("EfficientNetB3(")) {
            return "training";
        }
        if (line.includes("EfficientNetB4(")) {
            return "training";
        }
        if (line.includes("EfficientNetB5(")) {
            return "training";
        }
        if (line.includes("EfficientNetB6(")) {
            return "training";
        }
        if (line.includes("EfficientNetB7(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2B0(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2B1(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2B2(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2B3(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2S(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2M(")) {
            return "training";
        }
        if (line.includes("EfficientNetV2L(")) {
            return "training";
        }
        if (line.includes("BaseLossScaleOptimizer(")) {
            return "training";
        }
        if (line.includes("LossScaleOptimizer(")) {
            return "training";
        }
        if (line.includes("plot_model(")) {
            return "training";
        }
        if (line.includes("model_to_dot(")) {
            return "training";
        }
        if (line.includes("HyperParameters(")) {
            return "training";
        }
        if (line.includes("Tuner(")) {
            return "training";
        }
        if (line.includes("get_best_hyperparameters(")) {
            return "training";
        }
        if (line.includes("get_best_models(")) {
            return "training";
        }
        if (line.includes("on_epoch_begin(")) {
            return "training";
        }
        if (line.includes("on_batch_begin(")) {
            return "training";
        }
        if (line.includes("on_batch_end(")) {
            return "training";
        }
        if (line.includes("on_epoch_end(")) {
            return "training";
        }
        if (line.includes("run_trial(")) {
            return "training";
        }
        if (line.includes("results_summary(")) {
            return "exploration";
        }
        if (line.includes("save_model(")) {
            return "training";
        }
        if (line.includes("Tuner.search(")) {
            return "training";
        }
        if (line.includes("search_space_summary(")) {
            return "exploration";
        }
        if (line.includes("RandomSearch(")) {
            return "training";
        }
        if (line.includes("BayesianOptimization(")) {
            return "training";
        }
        if (line.includes("Hyperband(")) {
            return "training";
        }
        if (line.includes("SklearnTuner(")) {
            return "training";
        }
        if (line.includes("Oracle(")) {
            return "training";
        }
        if (line.includes("create_trial(")) {
            return "training";
        }
        if (line.includes("end_trial(")) {
            return "training";
        }
        // if (line.includes("get_best_trial(")) {
        //     return "training";
        // }
        if (line.includes("score_trial(")) {
            return "training";
        }
        if (line.includes("populate_space(")) {
            return "training";
        }
        if (line.includes("update_trial(")) {
            return "training";
        }
        if (line.includes("RandomSearchOracle(")) {
            return "training";
        }
        if (line.includes("BayesianOptimizationOracle(")) {
            return "training";
        }
        if (line.includes("HyperbandOracle(")) {
            return "training";
        }
        if (line.includes("HyperModel(")) {
            return "training";
        }
        if (line.includes(".build(")) {
            return "training";
        }
        if (line.includes("HyperResNet(")) {
            return "training";
        }
        if (line.includes("HyperXception(")) {
            return "training";
        }

        // pandas lib
        if(line.includes("read_csv")){
            return "data collection";
        }
        if(line.includes("read_table")){
            return "data collection";
        }
        if(line.includes("read_excel")){
            return "data collection";
        }
        if(line.includes("read_sql")){
            return "data collection";
        }
        if(line.includes("read_json")){
            return "data collection";
        }
        if(line.includes("read_html")){
            return "data collection";
        }
        if(line.includes("read_clipboard")){
            return "data collection";
        }
        if(line.includes(".reindex")){
            return "wrangling";
        }
        if(line.includes(".dropna")){
            return "wrangling";
        }
        if(line.includes(".fillna")){
            return "wrangling";
        }
        if(line.includes(".apply")){
            return "wrangling";
        }
        if(line.includes("pd.concat")){
            return "wrangling";
        }
        if(line.includes(".merge")){
            return "wrangling";
        }
        if(line.includes(".groupby")){
            return "wrangling";
        }
        if(line.includes(".stack")){
            return "wrangling";
        }
        if(line.includes(".unstack")){
            return "wrangling";
        }
        if(line.includes(".date_range")){
            return "wrangling";
        }
        if(line.includes(".tz_convert")){
            return "wrangling";
        }
        if(line.includes(".to_period")){
            return "wrangling";
        }
        if(line.includes(".to_timestamp")){
            return "wrangling";
        }
        if(line.includes(".to_datetime")){
            return "wrangling";
        }
        if(line.includes(".period_range")){
            return "wrangling";
        }
        if(line.includes(".astype")){
            return "wrangling";
        }
        if(line.includes(".set_categories")){
            return "wrangling";
        }
        if(line.includes(".sort_values")){
            if ((line.indexOf("=") < line.indexOf("sort_values")) && (!line.includes("return"))) {
                return "exploration";
            }
            return "wrangling";
        }
        if(line.includes(".set_index")){
            return "wrangling";
        }
        if(line.includes(".assign")){
            return "wrangling";
        }
        if(line.includes(".shape")){
            return "exploration";
        }
        if(line.includes(".head")){
            return "exploration";
        }
        if(line.includes(".describe")){
            return "exploration";
        }
        if(line.includes(".value_counts")){
            return "exploration";
        }
        if(line.includes(".info")){
            return "exploration";
        }
        if(line.includes(".hist")){
            return "exploration";
        }
        if(line.includes("display(")){
            return "exploration";
        }
        if(line.includes(".dtypes")){
            return "exploration";
        }
        if(line.includes("plot_acf")) {
            return "exploration";
        }
        if(line.includes("plot_pacf")) {
            return "exploration";
        }
        if(line.includes("month_plot")) {
            return "exploration";
        }
        if(line.includes("quarter_plot")) {
            return "exploration";
        }
        if(line.includes(".drop")){
            if ((!line.includes("=")) && (!line.includes("return"))) {
                return "exploration";
            }
            return "wrangling";
        }
        if(line.includes(".iloc")){
            if ((!line.includes("=")) && (!line.includes("return"))) {
                return "exploration";
            }
            return "wrangling";
        }
        if(line.includes(".loc")){
            if ((!line.includes("=")) && (!line.includes(".")) && (!line.includes("return"))) {
                return "exploration";
            }
            return "wrangling";
        }
        if (line.includes("pickle.load")) {
            return "data collection";
        }
        if (line.slice(0,5) == "print") {
            return "exploration";
        }
        if (line.slice(0,5) == "list(") {
            return "exploration";
        }
        if (line.slice(0,4) == "len(") {
            return "exploration";
        }
        if((!line.includes("=")) && (!line.includes(".")) && (!line.includes("return")) && (!line.includes("(")) && (!line.includes(")"))) {
            return "exploration";
        }
        return "";
    }
}