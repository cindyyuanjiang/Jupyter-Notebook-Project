var dep = require("./cell_deps.js");
var sk = require("./extract_sk_stmts.js");
var counting = require("./count_labels.js");
var fs = require('fs');

const args = process.argv.slice(2);
const path = args[0];
let printMode = args[1];


let notebookCount = 0;
let notebookCount_with_multi_labels = 0;


let cellCount = 0;


let map_labels_to_count = new Object();
let map_labels_to_count_nb = new Object();
let map_nb_to_hashed_set = new Object();


function getExt(filename){

    return filename.substring(filename.lastIndexOf('.')+1, filename.length);
}


function hash(labels){
    let res = 0;
    for(var elem of labels){
        if(elem == 'data collection'){
            res += 1;
        }
        else if(elem == 'data cleaning'){
            res += 10;
        }
        else if(elem == 'data labeling'){
            res += 100;
        }
        else if(elem == 'feature engineering'){
            res += 1000;
        }
        else if(elem == 'training'){
            res += 10000;
        }
        else if(elem == 'evaluation'){
            res += 100000;
        }
    }

    return res;
}


fs.readdirSync(path).forEach(file => {

    let flag = false;

    if (getExt(file) === "ipynb"){
        console.log('Currently processing:');
        console.log(path + file + '\n');

        // generating data flow graph information for current file
        dep.calculateCells(path + file, printMode);

        let [processed, cell_count, map_from_cell_to_labels] = counting.calculateCells(path + file);

        map_nb_to_hashed_set[file] = new Set();
        

        for (var key in map_from_cell_to_labels) {

            var value = map_from_cell_to_labels[key];
            var hashed = hash(value);

            if(value.size > 1){

                map_nb_to_hashed_set[file].add(hashed);

                flag = true;

                if(hashed in map_labels_to_count){
                    map_labels_to_count[hashed] += 1;
                }
                else{
                    map_labels_to_count[hashed] = 1;
                }
            }
        }


        for(let comb of map_nb_to_hashed_set[file]){

            if(comb in map_labels_to_count_nb){
                map_labels_to_count_nb[comb] += 1;
            }
            else{
                map_labels_to_count_nb[comb] = 1;
            }
        }


        if(processed){
            notebookCount += 1;
        }

        cellCount += cell_count;
    }
    

    if(flag){
        notebookCount_with_multi_labels += 1;
    }
});


console.log('Examined notebook count = ' + notebookCount);
console.log('Number of notebooks with multiple labels in one cell = ' + notebookCount_with_multi_labels);
console.log('The percent of notebooks with multiple labels in one cell = ' + (notebookCount_with_multi_labels/notebookCount*100) + '%\n');
console.log('\n\n\n');


function to_labels(hashed){
    let res = [];

    while(hashed != 0){
        let cur = hashed % 10;
        hashed = Math.floor(hashed/10);
        res.push(cur);
    }

    while(res.length < 6){
        res.push(0);
    }

    return res;
}


for (let key in map_labels_to_count) {

    // how many such cells there are
    var value = map_labels_to_count[key];

    var labels_list  = to_labels(key);
    var labels_set = "";


    if(labels_list[0] == 1){
        labels_set += 'data collection, ';
    }
    if(labels_list[1] == 1){
        labels_set += 'data cleaning, ';
    }
    if(labels_list[2] == 1){
        labels_set += 'data labeling, ';
    }
    if(labels_list[3] == 1){
        labels_set += 'feature engineering, ';
    }
    if(labels_list[4] == 1){
        labels_set += 'training, ';
    }
    if(labels_list[5] == 1){
        labels_set += 'evaluation, ';
    }


    console.log('The number of cells having labels -- ' + labels_set + ' -- is: ' + value);
    console.log('The percentage of such cells over all cells = ' + (value/cellCount*100) + '%\n');

}

console.log('\n\n\n');


for (let key in map_labels_to_count_nb){

    var nb_count = map_labels_to_count_nb[key];

    var labels_list = to_labels(key);
    var labels_set = "";

    if(labels_list[0] == 1){
        labels_set += 'data collection, ';
    }
    if(labels_list[1] == 1){
        labels_set += 'data cleaning, ';
    }
    if(labels_list[2] == 1){
        labels_set += 'data labeling, ';
    }
    if(labels_list[3] == 1){
        labels_set += 'feature engineering, ';
    }
    if(labels_list[4] == 1){
        labels_set += 'training, ';
    }
    if(labels_list[5] == 1){
        labels_set += 'evaluation, ';
    }

    console.log('The number of notebooks with cell(s) having lables -- ' + labels_set + ' -- is: ' + nb_count);
    console.log('The percentage of such notebooks over all notebooks = ' + (nb_count/notebookCount*100) + '%\n');
}

