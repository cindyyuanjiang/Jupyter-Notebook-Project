var fs = require('fs');
var utils = require("./cell_utils.js");
var py = require("../python-program-analysis");


module.exports = {
    calculateCells: function(name){
        const programSrc = fs.readFileSync(name).toString();
        const programJson = JSON.parse(programSrc);

        let currentLine = 1;

        var all_sk = new Set();
        var all_sk_stmt = "";

        var notebookCode = "";
        
        for (let cell of programJson.cells){

            if (cell.cell_type === 'code'){

                var sourceCode = "";

                for(let line of cell.source){
                    if(!((line[0] == '%') || (line[0] == '!'))){
                        sourceCode += line;
                    }

                    if(line.includes('sk')){
                        all_sk.add(currentLine);
                        all_sk_stmt += line + '\n';
                    }
                }

                notebookCode += sourceCode + '\n';

                let cellLength = cell.source.length;
                cell.lineNos = [currentLine, currentLine + cellLength - 1];
                currentLine += cellLength;
            }
        }

        flows = utils.getDefUse(notebookCode);

        var all_sk_children = new Set();
        var all_sk_children_stmt = "";

        for (let flow of flows.items) {
            let fromNodeLineNo = flow.fromNode.location.first_line;

            all_sk.forEach(function(item){
                if (item == fromNodeLineNo){
                    all_sk_children.add(item);
                    all_sk_children_stmt += py.printNode(flow.toNode) + '\n\n';
                }
            })
        }

        console.log("\n\nThese are all of the scikit-learn statements:\n");
        console.log(all_sk_stmt + all_sk_children_stmt);
        var new_name = name.split('.')[1];
        // console.log('new name = ' + new_name);

        fs.writeFile(('.' + new_name + '_sk_stmts.txt'), all_sk_stmt + all_sk_children_stmt, function (err) {
          if (err) throw err;
          // console.log('saved!');
        });
    }
}