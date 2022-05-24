var dep = require("./cell_deps.js");
var line_dep = require("./line_deps.js");
var sk = require("./extract_sk_stmts.js");
var counting = require("./count_labels.js");
var fs = require('fs');

const args = process.argv.slice(2);
const path = args[0];

function getExt(filename){
    return filename.substring(filename.lastIndexOf('.')+1, filename.length);
}

let num_notebooks = 0;

fs.readdirSync(path).forEach(file => {
    if (getExt(file) === "ipynb") {
        num_notebooks += 1;
        console.log('Currently processing:');
        console.log(path + file + '\n');

        let name = path + file;
        const programSrc = fs.readFileSync(name).toString();
        const programJson = JSON.parse(programSrc);

        if (programJson.cells == undefined) {
            // var new_name = '.' + name.split('.')[1];
            var new_name = name.substring(0, name.lastIndexOf('.'));
            fs.writeFile(new_name + '.py', "", function (err) {
              if (err) throw err;
            });
            return;
        }

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
        if (notebookCode != "") {
            // var new_name = '.' + name.split('.')[1];
            var new_name = name.substring(0, name.lastIndexOf('.'));
            fs.writeFile(new_name + '_no_comments.py', notebookCode, function (err) {
              if (err) throw err;
            });
        }
    }
});

console.log(num_notebooks);