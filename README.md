# Jupyter-Notebook-Project

## Converting Jupyter notebooks to python files

generate_python_files_from_nbs.js

This file takes in a folder path in command line, and generates a python file for each notebook in the folder and saves the python file in the same folder.

## Generating type inference information from python files

generate_json_dictionaries.js

This file takes in a folder path in command line, and generates the type inference information for each python file in the folder and saves the generated json file in the same folder.

## Performing static analysis to generate data dependencies and labeling library API calls

analyze_notebooks.js

This file takes in a folder path in command line, it genrates the data dependency and initial API call labelings for each notebook and saves the information in a txt file.

## Performing propogation algorithm and generating data dependency graphs with cell label annotation

generate_graphs_cell_level.py

This file takes in a folder path in command line, it performs the propagation algorithm for each notebook and analysis file from the previous result, and outputs the data dependency graph with cell labelings.

## Report analysis on changes between versions of notebooks

run_versions.py

This file takes in a notebook name and a starting and ending version numbers. It performs analysis on the changes from notebook version to version and outputs the analysis report.