import numpy
import scipy.special
import csv
import json

'''   Код берёт начало из примера книги
    Тарик Рашид "Создаём нейронную сеть"
'''

class neuralNetwork:

    def __init__(self, inputnodes, hiddennodes, outputnodes, learningrate):
        
        self.inodes = inputnodes
        self.hnodes = hiddennodes
        self.onodes = outputnodes
        
        self.lr = learningrate
        
        #self.wih = numpy.random.rand(self.hnodes, self.inodes) - 0.5
        #self.who = numpy.random.rand(self.onodes, self.hnodes) - 0.5
        self.wih = numpy.random.normal(0.0, pow(self.hnodes, -0.5), (self.hnodes, self.inodes))
        self.who = numpy.random.normal(0.0, pow(self.onodes, -0.5), (self.onodes, self.hnodes))
        
        self.activation_function = lambda x: scipy.special.expit(x)
        
    def train(self, inputs_list, targets_list):
        
        inputs = numpy.array(inputs_list, ndmin=2).T
        targets = numpy.array(targets_list, ndmin=2).T
        
        # расчёт выхода
        
        hidden_inputs = numpy.dot(self.wih, inputs)
        hidden_outputs = self.activation_function(hidden_inputs)
        
        final_inputs = numpy.dot(self.who, hidden_outputs)
        final_outputs = self.activation_function(final_inputs)
        
        # Расчёт ошибок
        
        output_errors = targets - final_outputs
        self.oe = final_outputs

        hidden_errors = numpy.dot(self.who.T, output_errors)
        
        # Расчёт разницы коэффициентов
        
        self.who += self.lr * numpy.dot((output_errors * final_outputs * (1.0 - final_outputs)), numpy.transpose(hidden_outputs))
        
        self.wih += self.lr * numpy.dot((hidden_errors * hidden_outputs * (1.0 - hidden_outputs)), numpy.transpose(inputs))
        
    def query(self, inputs_list):
        
        inputs = numpy.array(inputs_list, ndmin=2).T
        
        hidden_inputs = numpy.dot(self.wih, inputs)
        hidden_outputs = self.activation_function(hidden_inputs)
        
        final_inputs = numpy.dot(self.who, hidden_outputs)
        final_outputs = self.activation_function(final_inputs)
        
        return final_outputs
        
input_nodes = 784
hidden_nodes = 100
output_nodes = 10
learning_rate = 0.3

n = neuralNetwork(input_nodes, hidden_nodes, output_nodes, learning_rate)
#final_outputs = n.query([5,7,9])

fpath = '/storage/emulated/0/qpython/scripts3/'
with open(fpath+'mnist_train.csv', 'r', newline='') as cf:
    c = csv.reader(cf)
    for i, row in enumerate(c):
        
        inputs = [float(i) / 255 * 0.99 + 0.01 for i in row[1:]]

        targets = numpy.zeros(output_nodes) + 0.01
        targets[int(row[0])] = 0.99

        n.train(inputs, targets)
        
        #print(n.who)
        if i % 6000 == 0: print(row[0], n.oe)
        
        if i == 60000:
            with open(fpath+'w.json', 'w') as f: json.dump([n.wih.tolist(), n.who.tolist()], f)
            break