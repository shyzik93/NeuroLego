/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Use() {
    Opts.call(this);

    let self = this;

    /*this.use_one_neuron = function(opts, X, nW) {
        //if(opts.show_log) opts.func_write_log(' ');

        let nY_real = opts.neuron(X, nW);

        return nY_real;
    }*/

    this.use = function(opts) {

        self.validate_opts(opts, 'use');

        // перебираем примеры
        for (let ix=0; ix < opts.sets_using.length; ix++) {

            let sY_real, sW;

            let X = opts.sets_using.get_x_example(ix);

            if(opts.show_log) opts.func_write_log('Вход (x): ');
            if(opts.show_log) self.v.write(X, opts.func_write_log);
            if(opts.show_log) opts.func_write_log('\n');

            X.push(opts.b);

            // перебираем слои
            for (let il=0;il<opts.W.length;il++) {

                if(opts.show_log) {
                    if (il === opts.W.length-1) {opts.func_write_log('  Выход (y):');
                    } else { opts.func_write_log('  Слой '+(il+1)+':'); }
                 }

                if (il > 0) {X = sY_real; X.push(opts.b);}

                sY_real = []; // выходы для слоя
                sW = opts.W[il]; // веса для нейронов в слое

                /*if ((typeof opts.W[0]) === 'number') { // один нейрон в слое
                    sW = [opts.W];
                } else { sW = opts.W; }*/

                // перебираем нейроны в слое
                for (let iw = 0; iw<sW.length; iw++) {
                
                    //let nY = self.use_one_neuron(opts, X, sW[iw]);
                    let _nY_real = self.n.sum(X, sW[iw]);
                    let nY_real = opts.neuron(_nY_real);
                    if(opts.show_log) opts.func_write_log(' '+nY_real);
                    sY_real.push(nY_real);
                }

                if(opts.show_log) opts.func_write_log('\n');

            }
        }
    }

}