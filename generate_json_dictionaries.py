import os
import sys
import time
from subprocess import call

directory_in_str = sys.argv[1]
directory = os.fsencode(directory_in_str)

num_python_files = 0

start = time.time()
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".py"):
        num_python_files += 1
        print(directory_in_str)
        print(filename)
        print("\n\n\n")
        filename = filename.replace(" ", "\ ")
        command = "/Users/cindyjiang/Desktop/pyright/packages/pyright/index.js --lib " + directory_in_str + filename
        os.system(command)
        # call(command)

print(num_python_files)
print("time used = " + str(time.time() - start))