import numpy
import scipy.special
import csv
import json

'''   Код берёт начало из примера книги
    Тарик Рашид "Создаём нейронную сеть"
'''

class neuralNetwork:

    '''
    this.generateWByTopology = function(W, topology, count_input, format_w, add_b) {

        for (let il=0; il<topology.length;il++) {
            // количество входов нейрона равно количеству нейронов в предыдущем слое
            let _count_input = il === 0 ? count_input : topology[il-1];

            W[il] = self.m.create(add_b ? _count_input+1 : _count_input, topology[il], 'random'+format_w);
        }

    }
    '''

    neurons = {
        'sigma': scipy.special.expit
    }

    def generate_w_by_topology(self, W, topology, count_input, format_w, add_b):
        for il in range(len(topology)):
            _count_input = count_input if il == 0 else topology[il-1]
            
            if add_b: _count_input +=1
            
            if format_w == 'random0':
                pass
            elif format_w == 'random1':
                W.append(numpy.random.normal(0.0, pow(topology[il], -0.5), (topology[il], _count_input)))

    def __init__(self, opts):
        
        self.opts = opts
        
        self.generate_w_by_topology(opts['W'], opts['topology'], opts['count_input'], opts['format_w'], opts['add_b'])
        
        #self.wih = numpy.random.rand(self.hnodes, self.inodes) - 0.5
        #self.who = numpy.random.rand(self.onodes, self.hnodes) - 0.5
        self.wih = opts['W'][0] #numpy.random.normal(0.0, pow(self.hnodes, -0.5), (self.hnodes, self.inodes))
        self.who = opts['W'][1] #numpy.random.normal(0.0, pow(self.onodes, -0.5), (self.onodes, self.hnodes))
        
        self.activation_function = self.neurons[self.opts['neuron']]
        
    def train(self, inputs_list, targets_list):
        
        inputs = numpy.array(inputs_list, ndmin=2).T
        targets = numpy.array(targets_list, ndmin=2).T
        
        # расчёт выхода
        #print(self.wih)
        #print(inputs)
        hidden_inputs = numpy.dot(self.wih, inputs)
        hidden_outputs = self.activation_function(hidden_inputs)
        
        final_inputs = numpy.dot(self.who, hidden_outputs)
        final_outputs = self.activation_function(final_inputs)
        
        # Расчёт ошибок
        
        output_errors = targets - final_outputs
        self.oe = final_outputs

        hidden_errors = numpy.dot(self.who.T, output_errors)
        
        # Расчёт разницы коэффициентов
        
        self.who += self.opts['speed_study'] * numpy.dot((output_errors * final_outputs * (1.0 - final_outputs)), numpy.transpose(hidden_outputs))
        
        self.wih += self.opts['speed_study'] * numpy.dot((hidden_errors * hidden_outputs * (1.0 - hidden_outputs)), numpy.transpose(inputs))
        
    def query(self, inputs_list):
        
        inputs = numpy.array(inputs_list, ndmin=2).T
        
        hidden_inputs = numpy.dot(self.wih, inputs)
        hidden_outputs = self.activation_function(hidden_inputs)
        
        final_inputs = numpy.dot(self.who, hidden_outputs)
        final_outputs = self.activation_function(final_inputs)
        
        return final_outputs
        

'''
        sYs_ideal: sYs_ideal,
        sYs_use: sYs_use,

        restart_study: form.restart_study.checked,
        restart_study_count: form.restart_study_count.value,
        count_era: form.count_era.value,
        show_log_era_in_step: form.show_log_era_in_step.value,
        method_study: form.method_study.value,

        Xs: Xs,
        Xs_use: Xs_use,
        source_input: form.source_input.value,
        source_dir: form.source_dir.value,
        source_dir_is_length: form.source_dir_is_length.checked,
        source_dir_length: form.source_dir_length.value,
        source_dir_is_length_using: form.source_dir_is_length_using.checked,
        source_dir_length_using: form.source_dir_length_using.value,
        show_log: form.show_log.checked,
        show_log_using: form.show_log_using.checked,
        //b: form.b.value
'''

opts = {
    'speed_study': 0.3,
    'count_input': 784,
    'neuron': 'sigma',
    'topology': [100, 10],
    'W':[],
    'add_b': False,
    'format_w': 'random1',
}

n = neuralNetwork(opts)
#final_outputs = n.query([5,7,9])

fpath = '/storage/emulated/0/qpython/scripts3/'
with open(fpath+'mnist_train.csv', 'r', newline='') as cf:
    c = csv.reader(cf)
    for i, row in enumerate(c):
        
        inputs = [float(i) / 255 * 0.99 + 0.01 for i in row[1:]]

        targets = numpy.zeros(opts['topology'][-1]) + 0.01
        targets[int(row[0])] = 0.99

        n.train(inputs, targets)
        
        #print(n.who)
        if i % 1000 == 0: print(row[0], n.oe)
        
        if i == 60000:
            with open(fpath+'w.json', 'w') as f: json.dump([n.wih.tolist(), n.who.tolist()], f)
            break