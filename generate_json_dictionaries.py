import os
import sys
import time

directory_in_str = sys.argv[1]
directory = os.fsencode(directory_in_str)

num_python_files = 0

start = time.time()
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".py"):
        num_python_files += 1
        os.system("/Users/cindyjiang/Desktop/pyright/packages/pyright/index.js --lib " + directory_in_str + filename)

print(num_python_files)
print("time used = " + str(time.time() - start))