import os
import sys
import time
from graph_prop_labels import *

directory_in_str = sys.argv[1]
directory = os.fsencode(directory_in_str)
    
# num_files_with_parallel_training = 0
num_files_with_parallel_training_common_data_collection = 0
num_files_with_parallel_training_no_common_data_collection = 0
num_files_with_evaluation_comparison = 0
num_files_with_deadends = 0
num_files_processed = 0
num_notebooks_in_folder = 0
num_files_with_labels = 0

start = time.time()
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith("labels.txt"):
        num_files_with_labels += 1
        try:
            # os.system('python3 graph_prop_labels.py ' + str(directory)[1:] + filename)
            num_pair_of_parallel_training_common_data_collection, num_pair_of_parallel_training_no_common_data_collection, compare_eval, dead_ends = f(str(directory)[1:][1:-1] + filename)
            # num_files_with_parallel_training += 1 if num_pair_of_parallel_training > 0 else 0
            num_files_with_parallel_training_common_data_collection += 1 if num_pair_of_parallel_training_common_data_collection > 0 else 0
            num_files_with_parallel_training_no_common_data_collection += 1 if num_pair_of_parallel_training_no_common_data_collection > 0 else 0
            num_files_with_evaluation_comparison += 1 if compare_eval > 0 else 0
            num_files_with_deadends += 1 if dead_ends > 0 else 0
            num_files_processed += 1
        except Exception as e:
            print(filename)
            print("exception!\n")
            print(e)
            continue
    if filename.endswith(".ipynb"):
        num_notebooks_in_folder += 1

# print("num_files_with_parallel_training = " + str(num_files_with_parallel_training) + "\n")
print("num_files_with_parallel_training_common_data_collection = " + str(num_files_with_parallel_training_common_data_collection) + "\n")
print("num_files_with_parallel_training_no_common_data_collection = " + str(num_files_with_parallel_training_no_common_data_collection) + "\n")
print("num_files_with_evaluation_comparison = " + str(num_files_with_evaluation_comparison) + "\n")
print("num_files_with_deadends = " + str(num_files_with_deadends) + "\n")
print("num_files_processed = " + str(num_files_processed) + "\n")
print("num_files_with_labels = " + str(num_files_with_labels) + "\n")
print("num_notebooks_in_folder = " + str(num_notebooks_in_folder))

print("\ntime used = " + str(time.time() - start))