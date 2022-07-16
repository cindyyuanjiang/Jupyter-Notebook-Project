var fs = require('fs');
var labeling = require("./sk_label.js");

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
        if(cell.execution_count == null){
            cell.execution_count = last_exe_cnt + 10;
        }
        last_exe_cnt = cell.execution_count;
    }
    for (let cell of programJson.cells){

        if (cell.cell_type === 'code'){
            res_html += '<div class="cell border-box-sizing code_cell rendered">';
            res_html += '<div class="input">';
            res_html += '<div class="prompt input_prompt">In&nbsp;['+ cell.execution_count + ']:</div>';
            res_html += '<div class="inner_cell">';
            res_html += '<div class="input_area">';
            res_html += '<div class=" highlight hl-ipython3">';
            res_html += '<pre>';
            for(let line of cell.source){
                if ((!(line[0] == '#')) && (!(line[0] == '%')) && (!(line[0] == '!'))) {
                        let line_removed_nl, nl;
                        if (line[line.length - 1] == "\n") {
                            line_removed_nl = line.split("\n")[0]
                            nl = "\n"
                        } else {
                            line_removed_nl = line
                            nl = ""
                        }
                        let cur_label = labeling.label(line);
                        if (cur_label == "data collection") {
                            res_html += '<div style = "background-color: red">' + currentLineNo + ' ' + line_removed_nl + ' (Data Collection) ' + nl + '</div>';
                        } else if (cur_label == "wrangling") {
                            res_html += '<div style = "background-color: green">' + currentLineNo + ' ' + line_removed_nl + ' (Data Wrangling) ' + nl + '</div>';
                        } else if (cur_label == "training") {
                            res_html += '<div style = "background-color: purple">' + currentLineNo + ' ' + line_removed_nl + ' (Training) ' + nl + '</div>';
                        } else if (cur_label == "evaluation") {
                            res_html += '<div style = "background-color: orange">' + currentLineNo + ' ' + line_removed_nl + ' (Evaluation) ' + nl + '</div>';
                        } else if (cur_label == "exploration") {
                            res_html += '<div style = "background-color: lightblue">' + currentLineNo + ' ' + line_removed_nl + ' (Exploration) ' + nl + '</div>';
                        } else {
                            res_html += '<div>' + currentLineNo + ' ' + line_removed_nl + nl + '</div>';
                        }
                        currentLineNo += 1;
                    }
            }
            res_html += '</pre>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '</div>';
            res_html += '<p><br><br></p>';
        }
    }
}
res_html += '</body>';
res_html += '</html>';

var new_name = name.substring(0, name.lastIndexOf('.')) + '.html';
fs.writeFile(new_name, res_html, function (err) {
  if (err) throw err;
  console.log(new_name + ' saved!');
});
