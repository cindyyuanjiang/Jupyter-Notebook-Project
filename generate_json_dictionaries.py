import os
import sys
import time

directory_in_str = sys.argv[1]
start = int(sys.argv[2])
end = int(sys.argv[3])
# directory = os.fsencode(directory_in_str)
num_python_files = 0

start_time = time.time()
# for file in os.listdir(directory):
#     filename = os.fsdecode(file)
#     if filename.endswith("_no_comments.py"):
#         num_python_files += 1
#         # print(directory_in_str)
#         # print(filename)
#         # print("\n\n\n")
#         # filename = filename.replace(" ", "\ ")
#         command = "/Users/cindyjiang/Desktop/pyright/packages/pyright/index.js --lib " + directory_in_str + filename
#         os.system(command)
for i in range(start, end + 1):
    filename = "nb_" + str(i) + "_no_comments.py"
    num_python_files += 1
    command = "/Users/cindyjiang/Desktop/pyright/packages/pyright/index.js --lib " + directory_in_str + filename
    os.system(command)
end_time = time.time()

print("Total number of python files analyzed = {}!".format(num_python_files))
print("Time used = {} s!".format(end_time - start_time))