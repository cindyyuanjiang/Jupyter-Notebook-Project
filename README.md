# Jupyter-Notebook-Project

## Part 1: Scripts

The followings are all scripts contained in this folder:

**1. generate_python_files_from_nbs.js**

This file takes in a folder path in command line, and generates a python file for each notebook in the folder and saves the python file in the same folder.

Example usage: “node generate_python_files_from_nbs.js folder_name”

**2. generate_json_dictionaries_all_files.py**

This file takes in a folder path in command line, and generates the type inference information for each python file in the folder and saves the information as a json file in the same folder.

Example usage: “python generate_json_dictionaries_all_files.py folder_name”

**3. analyze_notebooks.js**

This file takes in a folder path in command line, and generates the data dependency information and seed API call labelings for each notebook in the folder and saves the information as a text file in the same folder.

Example usage: “node analyze_notebooks.js folder_name”

**4. generate_graphs_cell_level.py**

generate_graphs_cell_level.py

This file takes in a folder path in command line, and performs the propagation algorithm for each notebook using results from “analyze_notebooks.js” and outputs the labeled data dependency graph as a pdf file in the same folder.

Example usage: “python generate_graphs_cell_level.py folder_name”

## Part 2: Manually Labeled Notebooks Data

In the “notebook sample” folder, there are 50 notebooks used for the paper’s accuracy measurement. Their corresponding manual labelings are in file “Manual Notebook Labelings.xlsx”.

## Part 3: Supporting Tools

We used two off-the-shelve tools in our project - "python-program-analysis" and "pyright". We modified their source code, which can be found at https://tinyurl.com/2p8uw4vv.