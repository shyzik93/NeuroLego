/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Use() {
    Opts.call(this);

    this.use = function(opts) {

        this.validate_opts(opts, 'use');

        // перебираем примеры
        for (let ix=0; ix < opts.sets_using.length; ix++) {

            let X = this.m.createFromVect(opts.sets_using.get_x_example(ix), true);
            this.m.T(X);

            //if(opts.show_log) opts.func_write_log('Вход (x): ');
            //if(opts.show_log) this.v.write(X, opts.func_write_log);
            //if(opts.show_log) opts.func_write_log('\n');

            //X.push(opts.b);

            // перебираем слои
            for (let il=0;il<opts.W.length;il++) {

                if(opts.show_log) {
                    if (il === opts.W.length-1) {
    postMessage(['msg', 'Верный ответ: '+JSON.stringify(opts.sets_using.get_y_example(ix))+'\n']);
                        postMessage(['msg', '  Выход (y): ']);
                    } // else { opts.func_write_log('  Слой '+(il+1)+': '); }
                 }

                // перебираем нейроны в слое

                let sY_real = this.m.Multiply(opts.W[il], X);
                this.m.MultiplyFunc(sY_real, opts.neuron);
                this.m.T(sY_real);

                if (il === opts.W.length-1) {
                    if(opts.show_log) this.v.write(sY_real, function(msg) {postMessage(['msg', msg]);});
                    if(opts.show_log) postMessage(['msg', '\n']);
                }

                X = sY_real;
                //X.push(opts.b);
            }
        }
    }

}