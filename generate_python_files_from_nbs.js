var line_dep = require("./line_deps.js");
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
        let name = path + file;
        var new_name = name.substring(0, name.lastIndexOf('.'));
        num_notebooks += 1;
        try{
            const programSrc = fs.readFileSync(name).toString();
            const programJson = JSON.parse(programSrc);
            var notebookCode = "";
            for (let cell of programJson.cells) {
                if (cell.cell_type === 'code') {
                    var sourceCode = "";
                    for (let line of cell.source) {
                        if (line[0] != '#' && line[0] != '%' && line[0] != '!') {
                            sourceCode += line;
                        }
                    }
                    if (sourceCode != "" && sourceCode[sourceCode.length -1] != "\n") {
                        notebookCode += sourceCode + '\n';
                    } else {
                        notebookCode += sourceCode;
                    }
                }
            }
            fs.writeFile(new_name + '_no_comments.py', notebookCode, function (err) {
              if (err) throw err;
            });
        } catch (err) {
            // comment out for measuring performance
            // console.log("Error occured: " + err.message)
            fs.writeFile(new_name + '_no_comments.py', "", function (err) {
              if (err) throw err;
            });
        }
    }
});

const millis = Date.now() - start;
console.log("Finished generating " + num_notebooks + " python files from notebooks!");
console.log("Time used = " + millis + " ms!");
