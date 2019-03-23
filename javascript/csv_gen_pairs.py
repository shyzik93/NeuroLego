import csv
import json

'''
Convert datasets
from https://pjreddie.com/projects/mnist-in-csv/
into https://github.com/shyzik93/neurolego

original mnist dataset: http://yann.lecun.com/exdb/mnist/
'''

def write_json(i, Xs, fpath):
    with open(fpath+'dataset/'+i+'.json', 'w') as f:
        json.dump(Xs, f)

meta  = {
	   "count_total": 0,
	   "count_in_file": 50,
	   "count_input": 0,
}

fpath = '/storage/emulated/0/qpython/scripts3/'
with open(fpath+'mnist_train.csv', 'r', newline='') as cf:
    c = csv.reader(cf)
    Xs = []
    count = 0
    for i, row in enumerate(c):
        Y = [0 for i in range(10)]
        Y[int(row[0])] = 1
        #if Y != 5: continue
        X = [int(i) for i in row[1:]]
        Xs.append([Y, X])
        
        if count % 50==0 and count != 0:
            write_json(str(count), Xs, fpath)
            Xs = []
        
        if count == 0:
            meta["count_input"] = len(X)
            meta["count_output"] = len(Y)
        
        count += 1

    meta["count_total"] = count

    write_json(str(count), Xs, fpath)
    write_json('meta', meta, fpath)
