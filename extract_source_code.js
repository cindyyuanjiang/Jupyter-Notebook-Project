// var fs = require('fs');
// const args = process.argv.slice(2);
// const filename = args[0];

// const programSrc = fs.readFileSync(filename).toString();
// const programJson = JSON.parse(programSrc);
// if (programJson.cells == undefined) {
//     return;
// }

// var last_exe_cnt = -1;
// for (let cell of programJson.cells) {
//     if (cell.execution_count == null) {
//         cell.execution_count = last_exe_cnt + 10;
//     }
//     last_exe_cnt = cell.execution_count;
// }

// let res = "";

// for (let cell of programJson.cells) {
//     if (cell.cell_type === 'code') {
//         var sourceCode = "";
//         for (let line of cell.source) {
//             if (line[0] != '#' && line[0] != '%' && line[0] != '!' && line != "") {
//                 sourceCode += line;
//             }
//         }
//         if (sourceCode != ""){
//             res += "##" + cell.execution_count + "@@";
//             res += sourceCode;
//         }
//     }
// }

// var new_name = filename.substring(0, filename.lastIndexOf('.'));
// fs.writeFile(new_name + '_source_code.txt', res, function (err) {
//     if (err) throw err;
// });

var fs = require('fs');
const args = process.argv.slice(2);
const path = args[0];
let num_notebooks = 0;

function getExt(filename){
    return filename.substring(filename.lastIndexOf('.')+1, filename.length);
}

const start = Date.now();
fs.readdirSync(path).forEach(file => {
    if (getExt(file) === "ipynb") {
        let filename = path + file;
        const programSrc = fs.readFileSync(filename).toString();
        const programJson = JSON.parse(programSrc);
        if (programJson.cells == undefined) {
            return;
        }

        var last_exe_cnt = -1;
        for (let cell of programJson.cells) {
            if (cell.execution_count == null) {
                cell.execution_count = last_exe_cnt + 10;
            }
            last_exe_cnt = cell.execution_count;
        }

        let res = "";

        for (let cell of programJson.cells) {
            if (cell.cell_type === 'code') {
                var sourceCode = "";
                for (let line of cell.source) {
                    if (line[0] != '#' && line[0] != '%' && line[0] != '!' && line != "") {
                        sourceCode += line;
                    }
                }
                if (sourceCode != ""){
                    res += "#?#?" + cell.execution_count + "@@";
                    res += sourceCode;
                }
            }
        }

        var new_name = filename.substring(0, filename.lastIndexOf('.'));
        fs.writeFile(new_name + '_source_code.txt', res, function (err) {
            if (err) throw err;
        });
        num_notebooks += 1;
    }
});

const millis = Date.now() - start;
console.log("Finished extracting source code for " + num_notebooks + " notebooks!");
console.log("Time used = " + millis + " ms!");