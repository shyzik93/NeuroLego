/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Use() {
    Opts.call(this);

    let self = this;

    /*this.use_one_neuron = function(opts, x_example, w1) {
        //if(opts.show_log) opts.func_write_log(' ');

        let y1 = opts.neuron(x_example, w1);

        return y1;
    }*/

    this.use = function(opts) {

        self.validate_opts(opts, 'use');

        // перебираем примеры
        for (let ix=0; ix < opts.sets_using.length; ix++) {

            let layer_y, layer_w1;

            let x = opts.sets_using.get_x_example(ix);

            if(opts.show_log) opts.func_write_log('Вход (x): ');
            if(opts.show_log) self.v.write(x, opts.func_write_log);
            if(opts.show_log) opts.func_write_log('\n');

            x.push(opts.b);

            // перебираем слои
            for (let il=0;il<opts.w1.length;il++) {

                if(opts.show_log) {
                    if (il === opts.w1.length-1) {opts.func_write_log('  Выход (y):');
                    } else { opts.func_write_log('  Слой '+(il+1)+':'); }
                 }

                if (il > 0) {x = layer_y;x.push(opts.b);}

                layer_y = []; // выходы для слоя
                layer_w1 = opts.w1[il]; // веса для нейронов в слое

                /*if ((typeof opts.w1[0]) === 'number') { // один нейрон в слое
                    layer_w1 = [opts.w1];
                } else { layer_w1 = opts.w1; }*/

                // перебираем нейроны в слое
                for (let iw = 0; iw<layer_w1.length; iw++) {
                
                    //let y1 = self.use_one_neuron(opts, x, layer_w1[iw]);
                    let y1 = opts.neuron(x, layer_w1[iw]);
                    if(opts.show_log) opts.func_write_log(' '+y1);
                    layer_y.push(y1);
                }

                if(opts.show_log) opts.func_write_log('\n');

            }
        }
    }

}