// var dep = require("./cell_deps.js");
var line_dep = require("./line_deps.js");
// var sk = require("./extract_sk_stmts.js");
// var counting = require("./count_labels.js");
var fs = require('fs');

const args = process.argv.slice(2);
const path = args[0];
let printMode = args[1];

let notebookCount = 0;
// let notebookCount_with_multi_labels = 0;
// let cellCount = 0;

// let map_labels_to_count = new Object();
// let map_labels_to_count_nb = new Object();
// let map_nb_to_hashed_set = new Object();

// how many cells have the label
// how many notebooks have label which is associated with the highest number of cells in the notebook
// let map_labels_to_cell_count = new Object();
// let map_labels_to_nb_count = new Object();

// let map_top_label_to_nb_count = new Object();

// let parallel_training_nb_count = 0;
// let interleaved_nb_count = 0;

// let hyper_count = 0;

// let num_nb_with_tensorflow = 0;
// let num_nb_with_pandas = 0;
// let num_nb_with_numpy = 0;

// let map_label_to_line_nums = new Object();
// map_label_to_line_nums['data collection'] = 0;
// map_label_to_line_nums['data cleaning'] = 0;
// map_label_to_line_nums['data labeling'] = 0;
// map_label_to_line_nums['data exploration'] = 0;
// map_label_to_line_nums['feature engineering'] = 0;
// map_label_to_line_nums['training'] = 0;
// map_label_to_line_nums['evaluation'] = 0;

function getExt(filename){
    return filename.substring(filename.lastIndexOf('.')+1, filename.length);
}

function hash(labels){
    let res = 0;
    for(var elem of labels){
        if(elem == 'data collection'){
            res += 1;
        } else if(elem == 'data cleaning'){
            res += 10;
        } else if(elem == 'data labeling'){
            res += 100;
        } else if(elem == 'feature engineering'){
            res += 1000;
        } else if(elem == 'training'){
            res += 10000;
        } else if(elem == 'evaluation'){
            res += 100000;
        } else if(elem == 'data exploration'){
            res += 1000000;
        }
    }
    return res;
}

const start = Date.now();

fs.readdirSync(path).forEach(file => {
    if (getExt(file) === "ipynb"){
        // console.log('Currently processing:');
        // console.log(path + file + '\n');

        // generating data flow graph information for current file
        // dep.calculateCells(path + file, printMode);
        // try {
        //     line_dep.calculateCells(path + file, printMode);
        // } catch (e) {
        //     console.log("exception!");
        //     console.log(file);
        //     console.log(e);
        // }
        let computed = line_dep.calculateCells(path + file, printMode);
        notebookCount += computed;

        // let flag = false;

        // let [hyper_param_search, processed, parallel, is_interleaved, cell_count, map_from_cell_to_labels, contain_tf, contain_pd, contain_np, map_from_label_to_line_nums] = counting.calculateCells(path + file);

        // map_label_to_line_nums['data collection'] += map_from_label_to_line_nums['data collection'];
        // map_label_to_line_nums['data cleaning'] += map_from_label_to_line_nums['data cleaning'];
        // map_label_to_line_nums['data labeling'] += map_from_label_to_line_nums['data labeling'];
        // map_label_to_line_nums['data exploration'] += map_from_label_to_line_nums['data exploration'];
        // map_label_to_line_nums['feature engineering'] += map_from_label_to_line_nums['feature engineering'];
        // map_label_to_line_nums['training'] += map_from_label_to_line_nums['training'];
        // map_label_to_line_nums['evaluation'] += map_from_label_to_line_nums['evaluation'];


        // if(parallel){
        //     parallel_training_nb_count += 1;
        // }

        // if(is_interleaved){
        //     interleaved_nb_count += 1;
        // }

        // if(contain_tf){
        //     num_nb_with_tensorflow += 1;
        // }

        // if(contain_pd){
        //     num_nb_with_pandas += 1;
        // }

        // if(contain_np){
        //     num_nb_with_numpy += 1;
        // }

        // if (hyper_param_search) {
        //     hyper_count += 1;
        // }


        // map_nb_to_hashed_set[file] = new Set();

        // let map_label_to_cell_count_cur_nb = new Object();

        // let all_labels_in_nb = new Set();
        

        // for (var key in map_from_cell_to_labels) {

        //     var value = map_from_cell_to_labels[key];
        //     var hashed = hash(value);


        //     // all_labels_in_nb = all_labels_in_nb.union(value);

        //     for(let label of value){
        //         all_labels_in_nb.add(label);

        //         if(label in map_labels_to_cell_count){
        //             map_labels_to_cell_count[label] += 1;
        //         }
        //         else{
        //             map_labels_to_cell_count[label] = 1;
        //         }
        //     }

        //     for(let label of value){
        //         if(label in map_label_to_cell_count_cur_nb){
        //             map_label_to_cell_count_cur_nb[label] += 1;
        //         }
        //         else{
        //             map_label_to_cell_count_cur_nb[label] = 1;
        //         }
        //     }


        //     if(value.size > 1){

        //         map_nb_to_hashed_set[file].add(hashed);

        //         flag = true;

        //         if(hashed in map_labels_to_count){
        //             map_labels_to_count[hashed] += 1;
        //         }
        //         else{
        //             map_labels_to_count[hashed] = 1;
        //         }
        //     }
        // }

        // let sortable = [];
        // for(var label in map_label_to_cell_count_cur_nb){
        //     sortable.push([label, map_label_to_cell_count_cur_nb[label]]);
        // }

        // // console.log('sortable size = ' + sortable.length);

        // if(sortable.length > 0){
        //     sortable.sort(function(a, b) {
        //         return b[1] - a[1];
        //     });

        //     let top_label = sortable[0][0];

        //     if(top_label in map_top_label_to_nb_count){
        //         map_top_label_to_nb_count[top_label] += 1;
        //     }
        //     else{
        //         map_top_label_to_nb_count[top_label] = 1;
        //     }

        //     // if(top_label == 'feature engineering'){
        //     //     top_feature_eng_nbs += file + '\n';
        //     // }

        // }

        // sortable.sort(function(a, b) {
        //     return a[1] - b[1];
        // });

        // let top_label = sortable[0][0];

        // if(top_label in map_top_label_to_nb_count){
        //     map_top_label_to_nb_count[top_label] += 1;
        // }
        // else{
        //     map_top_label_to_nb_count[top_label] = 1;
        // }


        // for(let label of all_labels_in_nb){
        //     if(label in map_labels_to_nb_count){
        //         map_labels_to_nb_count[label] += 1;
        //     }
        //     else{
        //         map_labels_to_nb_count[label] = 1;
        //     }
        // }


        // for(let comb of map_nb_to_hashed_set[file]){

        //     if(comb in map_labels_to_count_nb){
        //         map_labels_to_count_nb[comb] += 1;
        //     }
        //     else{
        //         map_labels_to_count_nb[comb] = 1;
        //     }
        // }


        // if(processed){
        //     // console.log()
        //     notebookCount += 1;
        // }

        // cellCount += cell_count;

        // if(flag){
        //     notebookCount_with_multi_labels += 1;
        // }
    }
    
});
const millis = Date.now() - start;
// console.log("Finished analyzing " + notebookCount + " notebooks!");
console.log("Time used = " + millis + " ms!");

// console.log('Examined notebook count = ' + notebookCount);
// console.log('Number of notebooks with multiple labels in one cell = ' + notebookCount_with_multi_labels);
// console.log('The percentage of notebooks with multiple labels in one cell = ' + (notebookCount_with_multi_labels/notebookCount*100) + '%\n');
// console.log('\n');

// console.log('The number of notebooks with parallel training cells = ' + parallel_training_nb_count);
// console.log('The percentage of notebooks with parallel training cells = ' + (parallel_training_nb_count/notebookCount*100) + '%\n');

// console.log('The number of notebooks with interleaved training and evaluation cells = ' + interleaved_nb_count);
// console.log('The percentage of notebooks with interleaved training and evaluation cells = ' + (interleaved_nb_count/notebookCount*100) + '%\n');

// console.log('\n\n\n');

// function to_labels(hashed){
//     let res = [];

//     while(hashed != 0){
//         let cur = hashed % 10;
//         hashed = Math.floor(hashed/10);
//         res.push(cur);
//     }

//     while(res.length < 6){
//         res.push(0);
//     }

//     return res;
// }


// for (let key in map_labels_to_count) {

//     // how many such cells there are
//     var value = map_labels_to_count[key];

//     var labels_list  = to_labels(key);
//     var labels_set = "";


//     if(labels_list[0] == 1){
//         labels_set += 'data collection, ';
//     }
//     if(labels_list[1] == 1){
//         labels_set += 'data cleaning, ';
//     }
//     if(labels_list[2] == 1){
//         labels_set += 'data labeling, ';
//     }
//     if(labels_list[3] == 1){
//         labels_set += 'feature engineering, ';
//     }
//     if(labels_list[4] == 1){
//         labels_set += 'training, ';
//     }
//     if(labels_list[5] == 1){
//         labels_set += 'evaluation, ';
//     }
//     if(labels_list[6] == 1){
//         labels_set += 'data exploration, ';
//     }



//     console.log('The number of cells having labels -- ' + labels_set + ' -- is: ' + value);
//     // console.log('Total cell count = ' + cellCount);
//     console.log('The percentage of such cells over all cells = ' + (value/cellCount*100) + '%\n');

// }

// console.log('\n\n\n');


// for (let key in map_labels_to_count_nb){

//     var nb_count = map_labels_to_count_nb[key];

//     var labels_list = to_labels(key);
//     var labels_set = "";

//     if(labels_list[0] == 1){
//         labels_set += 'data collection, ';
//     }
//     if(labels_list[1] == 1){
//         labels_set += 'data cleaning, ';
//     }
//     if(labels_list[2] == 1){
//         labels_set += 'data labeling, ';
//     }
//     if(labels_list[3] == 1){
//         labels_set += 'feature engineering, ';
//     }
//     if(labels_list[4] == 1){
//         labels_set += 'training, ';
//     }
//     if(labels_list[5] == 1){
//         labels_set += 'evaluation, ';
//     }
//     if(labels_list[6] == 1){
//         labels_set += 'data exploration, ';
//     }

//     console.log('The number of notebooks with cell(s) having lables -- ' + labels_set + ' -- is: ' + nb_count);
//     console.log('The percentage of such notebooks over all notebooks = ' + (nb_count/notebookCount*100) + '%\n');
// }

// for(let key in map_labels_to_cell_count){
//     console.log('The number of cells with label ' + key + ' is = ' + map_labels_to_cell_count[key]);
// }

// console.log('\n\n');

// for(let key in map_labels_to_nb_count){
//     console.log('The number of notebooks with label ' + key + ' is = ' + map_labels_to_nb_count[key]);
// }

// console.log('\n\n');

// for(let key in map_top_label_to_nb_count){
//     console.log('The number of notebooks where the most number of cells are associated with label ' + key + ' is ' + map_top_label_to_nb_count[key]);
// }


// console.log('\n\n');
// console.log('The number of notebooks with tensorflow is = ' + num_nb_with_tensorflow);
// console.log('The percentage of notebooks with tensorflow is = ' + (num_nb_with_tensorflow/notebookCount*100) + '%\n');

// console.log('The number of notebooks with pandas is = ' + num_nb_with_pandas);
// console.log('The percentage of notebooks with tensorflow is = ' + (num_nb_with_pandas/notebookCount*100) + '%\n');

// console.log('The number of notebooks with numpy is = ' + num_nb_with_numpy);
// console.log('The percentage of notebooks with tensorflow is = ' + (num_nb_with_numpy/notebookCount*100) + '%\n');

// console.log('\n\n');

// for(let label in map_label_to_line_nums){
//     console.log('The total number of lines that has label ' + label + ' = ' + map_label_to_line_nums[label]);
// }

// // console.log(top_feature_eng_nbs);

// console.log('Examined notebook count = ' + notebookCount);
// console.log('Number of notebooks with hyper param tuning = ' + hyper_count);
// console.log('The percentage of notebooks with hyper param tuning = ' + (hyper_count/notebookCount*100) + '%\n');
// console.log('\n');









