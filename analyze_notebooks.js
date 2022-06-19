var line_dep = require("./line_deps.js");
var fs = require('fs');

const args = process.argv.slice(2);
const path = args[0];
let printMode = args[1];
let totalNotebookCount = 0;
let notebookCount = 0;

function getExt(filename) {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length);
}

const start = Date.now();
fs.readdirSync(path).forEach(file => {
    if (getExt(file) === "ipynb"){
        totalNotebookCount += 1;
        try {
            line_dep.calculateCells(path + file, printMode);
            notebookCount += 1;
        } catch(err) {
            // comment out for measuring performance
            // console.log("Error occured: " + err.message);
            var name = path + file;
            fs.writeFile(name.substring(0, name.lastIndexOf('.')) + '_new_labels.txt', "", function (err) {
              if (err) throw err;
            });
        }
    } 
});

const millis = Date.now() - start;
console.log("Total number of notebooks = " + totalNotebookCount + "!");
console.log("Finished analyzing (with no exceptions) " + notebookCount + " notebooks!");
console.log("Time used = " + millis + " ms!");
