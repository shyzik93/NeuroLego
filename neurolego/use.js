/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Use() {
    Opts.call(this);

    let self = this;

    this.use_one_neuron = function(opts, ix) {

        let x_example = opts.sets_using.get_x_example(ix);

        if(opts.show_log) opts.func_write_log('x1: ');
        if(opts.show_log) self.v.write(x_example, opts.func_write_log);
        if(opts.show_log) opts.func_write_log(' ');

        let y1 = opts.neuron(x_example, opts.w1, opts.b);

        if(opts.show_log) opts.func_write_log(' | '+y1+'\n');

        return y1;
    }

    this.use = function(opts) {

        self.validate_opts(opts, 'use');

        for (let i=0; i < opts.sets_using.length; i++) {
            let y1 = self.use_one_neuron(opts, i);
        }
    }

}