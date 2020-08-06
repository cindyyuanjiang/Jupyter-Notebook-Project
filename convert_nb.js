var fs = require('fs');

const args = process.argv.slice(2);
const nb = args[0];
const analysis = args[1]

// let res = new Object();


const programSrc = fs.readFileSync(nb).toString();
const programJson = JSON.parse(programSrc);

var prev_exe_cnt = -1

for (let cell of programJson.cells){
    
    // if((cell.execution_count == null) && (cell.cell_type === 'code')){
    //     cell.execution_count = prev_exe_cnt + 1;
    // }

    if(cell.execution_count == null){
        cell.execution_count = prev_exe_cnt + 1;
    }

    prev_exe_cnt = cell.execution_count;
}


var last_exe_cnt = 0;

for(var i = (programJson.cells.length - 1); i >= 0; i--){
    let cell = programJson.cells[i];
    if(cell.execution_count == null){
        continue;
    }
    else{
        last_exe_cnt = cell.execution_count;
        break;
    }
}


for(var i = (programJson.cells.length - 1); i >= 0; i--){
    let cell = programJson.cells[i];

    if(cell.execution_count == null){
        cell.execution_count = last_exe_cnt;
    }
    else{
        last_exe_cnt = cell.execution_count;
    }
}


// console.log('got here');




const data = fs.readFileSync(analysis, {encoding:'utf8', flag:'r'});
console.log(data);




let new_cells = [];



let orig_lines = data.split('\n');
// orig_lines.pop();

for(var i = 0; i < orig_lines.length; i++){
    orig_lines[i] = orig_lines[i] + "\n\n";

}
orig_lines.pop();

let table = new Object();
table['cell_type'] = 'markdown';
table['metadata'] = new Object();
table['source'] = [];
table['source'].push(("## " + 'Table of Content'));
new_cells.push(table);

let table_content = new Object();
table_content['cell_type'] = 'markdown';
table_content['metadata'] = new Object();
table_content['source'] = orig_lines;
// table_content['source'].push((data));
new_cells.push(table_content);

// let orig_lines = data.split('\n');
// orig_lines.pop();

// for(const line of orig_lines){
//     let cur_line = new Object();
//     cur_line['cell_type'] = 'markdown';
//     cur_line['metadata'] = new Object();
//     cur_line['source'] = [];
//     cur_line['source'].push(line);

//     new_cells.push(cur_line);
// }

let df_graph_title = new Object();

df_graph_title['cell_type'] = 'markdown';
df_graph_title['metadata'] = new Object();
df_graph_title['source'] = [];
df_graph_title['source'].push("## " + 'Data Dependency Graph');
new_cells.push(df_graph_title);



let df_graph = new Object();

df_graph['cell_type'] = 'markdown';
df_graph['metadata'] = new Object();
df_graph['source'] = [];
df_graph['source'].push("![title](./image.png)");
new_cells.push(df_graph);







let sec_markdowns = [];
let sec_cells = [];

const sections = data.split(']\n');
sections.pop();

for(const sec of sections){
    const lines = sec.split('\n');



    var cells = lines.pop();
    cells = cells.split('[')[1]

    var lines_to_string = lines;
    var cells_to_list = cells.split(', ');
    cells_to_list.pop();

    // console.log(lines_to_string);
    // console.log(cells_to_list.toString());

    sec_markdowns.push(lines_to_string);
    sec_cells.push(cells_to_list);
}

// res[0] = sec_markdowns;
// res[1] = sec_cells;

// let markdowns = res[0];
// let cells_list = res[1];

let markdowns = sec_markdowns;
let cells_list = sec_cells;


let content = "";

let len = markdowns.length;




for(var i = 0; i < len; i++){

    let markdown = markdowns[i];
    let cells = cells_list[i];

    content += (markdown + '\n\n');


    for(var j = 0; j < markdown.length; j++){
        if(j == 0){
            let new_markdown = new Object();
            new_markdown['cell_type'] = 'markdown';
            new_markdown['metadata'] = new Object();
            new_markdown['source'] = [];
            new_markdown['source'].push(("## " + markdown[j]));

            new_cells.push(new_markdown);
        }
        else{
            let new_markdown = new Object();
            new_markdown['cell_type'] = 'markdown';
            new_markdown['metadata'] = new Object();
            new_markdown['source'] = [];
            new_markdown['source'].push((markdown[j]));

            new_cells.push(new_markdown);
        }
    }


    for(let cell_exe_count of cells){
        for(let cell of programJson.cells){

            if(cell.execution_count == cell_exe_count){
                console.log(cell_exe_count);

                if(cell.cell_type === 'code'){
                    for(let line of cell.source){
                        if(!((line[0] == '%') || (line[0] == '!'))){
                            content += line;
                        }
                        else{
                            content += '#' + line;
                        }
                    }
                }
                else{
                    for(let line of cell.source){
                        content += '#' + line;
                    }
                    delete cell.execution_count;
                }
                content += '\n\n';

                new_cells.push(cell);
            }
        }
    }

    content += '\n\n\n';
}

var new_name = '.' + analysis.split('.')[1];
// console.log(content);

// fs.writeFile((new_name + '_clean.py'), content, function (err) {
//     if (err) throw err;
//     console.log('saved!');
// });


programJson.cells = new_cells;

fs.writeFile((new_name + '_clean.ipynb'), JSON.stringify(programJson), function (err) {
    if (err) throw err;
    console.log('saved!');
});

