/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Use() {
    Opts.call(this);

    this.log1 = function(opts, il, ix) {
        if(!opts.show_log_using) return;
        if (il === opts.W.length-1) {
            postMessage(['msg', 'Верный ответ: '+JSON.stringify(opts.sets_using.get_y_example(ix))+'\n']);
            postMessage(['msg', '  Выход (y): ']);
        } // else { opts.func_write_log('  Слой '+(il+1)+': '); }
    }

   this.log2 = function(opts, Y_real, il) {
        if(!opts.show_log_using) retutn;
        if (il === opts.W.length-1) {
            this.m.write(Y_real[il]);
            postMessage(['msg', '\n']);
        }
    }

    this.use = function(opts) {

        this.validate_opts(opts);

        // перебираем примеры
        for (let ix=0; ix < opts.sets_using.length; ix++) {

            let X = this.m.createFromVect(opts.sets_using.get_x_example(ix), true);
            this.m.T(X);

            //if(opts.show_log_using) opts.func_write_log('Вход (x): ');
            //if(opts.show_log_using) this.v.write(X, opts.func_write_log);
            //if(opts.show_log_using) opts.func_write_log('\n');

            this.add_b(X, opts);

            let Y_real = [];

            // перебираем слои
            for (let il=0;il<opts.W.length;il++) {

                this.log1(opts, il, ix);

                // в ответ выходного слоя смещение не добавится
                if (il !== 0) { X = Y_real[il-1]; this.add_b(X, opts);}

                Y_real[il] = this.m.Multiply(opts.W[il], X);
                this.m.MultiplyFunc(Y_real[il], opts.neuron);
                this.m.T(Y_real[il]);

                this.log2(opts, Y_real, il);

            }
        }
    }

}