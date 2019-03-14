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

        if (opts.W === undefined) {console.log('Укажите веса'); return;}

        if(action==='use') {
            if (opts.sets_using === undefined) {console.log('Укажите входные наборы!'); return;}
        } else if (action==='study') {
            if (opts.sets_study === undefined) {console.log('Укажите обучающие наборы!'); return;}
            if (opts.topology === undefined) {console.log('Укажите кол-во нейронов в слоях!'); return;}
        }

       /* не обязательные */

        if (opts.show_log === undefined) opts.show_log = 1;
        if (opts.func_write_log === undefined) opts.func_write_log = console.log;
        if (opts.neuron === undefined) opts.neuron = self.n.Perceptron;
        if (opts.b === undefined) opts.b = 1;

        if(action==='use') {
        } else if (action==='study') {
            if (opts.count_era === undefined) opts.count_era = 50;
            if (opts.show_log_era_in_step === undefined) opts.show_log_era_in_step = 1;
        }

        /* коррекция опций. Например, строку в число конвертируем */

        opts.b = parseInt(opts.b);

        if(action==='use') {
        } else if (action==='study') {
            opts.count_era = parseInt(opts.count_era);
            opts.show_log_era_in_step = parseInt(opts.show_log_era_in_step);
        }

    }
}