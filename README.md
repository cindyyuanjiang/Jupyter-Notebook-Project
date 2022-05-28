# Jupyter-Notebook-Project

generate_python_files_from_nbs.js

This file takes in a folder path in command line, and generates a python file for each notebook in the folder and saves the python file in the same folder.

generate_python files_from_nbs.js

This file takes in a folder path in command line, and generates the type inference information for each python file in the folder and saves the generated json file in the same folder.

analyze_notebooks.js

This file takes in a folder path in command line, it genrates the data dependency and initial API call labelings for each notebook and saves the information in a txt file.

generate_graphs_cell_level.py

This file takes in a folder path in command line, it performs the propagation algorithm for each notebook and analysis file from the previous result, and outputs the data dependency graph with cell labelings.
