var fs = require('fs');
const args = process.argv.slice(2);
const filename = args[0];

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
        // res += cell.execution_count + ":";
        // res += cell.source;
        var sourceCode = "";
        for (let line of cell.source) {
            if (line[0] != '#' && line[0] != '%' && line[0] != '!' && line != "") {
                sourceCode += line;
            }
        }
        if (sourceCode != ""){
            res += "#" + cell.execution_count + ":";
            res += sourceCode;
            res += "\n";
        }
    }
}

var new_name = filename.substring(0, filename.lastIndexOf('.'));
fs.writeFile(new_name + '_source_code.txt', res, function (err) {
    if (err) throw err;
});