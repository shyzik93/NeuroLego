/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Opts() {
    Algebra.call(this);
    
    let self = this;

    this.validate_opts = function(opts, action) {

        opts.free = {}; // объект свободного назначения, для внутренних нужд

        /* коррекция некоторых опций */

        opts.b = parseInt(opts.b);

        if(action==='use') {
            opts.count_era = parseInt(opts.count_era);
        } else if (action==='study') {
        }

        /* обязательные */

        if (opts.b === undefined) {console.log('Укажите смещение!'); return;}
        if (opts.w1 === undefined) {console.log('Укажите веса'); return;}

        if(action==='use') {
            if (opts.sets_using === undefined) {console.log('Укажите входные наборы!'); return;}
        } else if (action==='study') {
            if (opts.sets_study === undefined) {console.log('Укажите обучающие наборы!'); return;}
        }

       /* не обязательные */

        if (opts.show_log === undefined) opts.show_log = 1;
        if (opts.func_write_log === undefined) opts.func_write_log = console.log;
        if (opts.neuron === undefined) opts.neuron = self.n.Perceptron;

        if(action==='use') {
        } else if (action==='study') {
            if (opts.count_era === undefined) opts.count_era = 50;
        }
    }
}