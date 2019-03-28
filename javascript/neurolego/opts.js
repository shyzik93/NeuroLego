/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Opts() {
    Algebra.call(this);
    
    let self = this;

    this.validate_opts = function(opts, action) {

        opts.free = {}; // объект свободного назначения, для внутренних нужд

        /* обязательные */

        if (opts.neuron === undefined) {console.log('Укажите нейрон!'); return;}
        if (opts.format_w === undefined) {console.log('Укажите формат веса!'); return;}

        if (opts.source_input === undefined) {console.log('Укажите источник входных наборов!'); return;}
        if (opts.source_dir === undefined) {console.log('Укажите директорию!'); return;}
        if (opts.W === undefined) {console.log('Укажите веса'); return;}
        if (opts.sets_using === undefined) {console.log('Укажите входные наборы!'); return;}
        if (opts.sets_study === undefined) {console.log('Укажите обучающие наборы!'); return;}
        if (opts.topology === undefined) {console.log('Укажите кол-во нейронов в слоях!'); return;}
        if (opts.speed_study === undefined) {console.log('Укажите скорость обучения!'); return;}
        if (opts.method_study === undefined) {console.log('Укажите метод обучения!'); return;}

       /* не обязательные */

        if (opts.show_log === undefined) opts.show_log = 1;
        if (opts.func_write_log === undefined) opts.func_write_log = console.log;
        if (opts.neuron === undefined) opts.neuron = self.n.Perceptron;
        if (opts.b === undefined) opts.b = 1;
        if (opts.add_b === undefined) opts.add_b = false;

        if (opts.source_dir_is_length === undefined) opts.source_dir_is_length = false;
        if (opts.source_dir_length === undefined) opts.source_dir_length = 0;

        if (opts.count_era === undefined) opts.count_era = 50;
        if (opts.restart_study === undefined) opts.restart_study = false;
        if (opts.restart_study_count === undefined) opts.restart_study_count = 0;
        if (opts.show_log_era_in_step === undefined) opts.show_log_era_in_step = 1;

        /* коррекция опций. Например, строку в число конвертируем */

        opts.b = parseInt(opts.b);

        if (typeof opts.neuron === 'string') {
            opts.neuron = self.neurons[opts.neuron];
        }

        opts.source_dir_length = parseInt(opts.source_dir_length);
        opts.count_era = parseInt(opts.count_era);
        opts.speed_study = parseFloat(opts.speed_study);
        opts.restart_study_count = parseInt(opts.restart_study_count);
        opts.show_log_era_in_step = parseInt(opts.show_log_era_in_step);

    }

    this.add_b = function(m1_n, opts) {
        if (opts.add_b) {
            //postMessage(['alert', m1_n]);
            m1_n.splice(-this.m.offset, 0, opts.b);
            if (this.m.isT(m1_n)) this.m.setCountRows(m1_n, this.m.countRows(m1_n)+1);
            else this.m.setCountCols(m1_n, this.m.countCols(m1_n)+1);
            //postMessage(['alert', m1_n]);
        }
    }
}