/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Study() {
    Opts.call(this);
    
    let self = this;

    this.study_one_neuron = function(opts, i_layer, i_neuron, x1_example, y1_example, w1) {

        if (opts.show_log) {
            opts.func_write_log('x1_example: ');
            self.v.write(x1_example, opts.func_write_log);
            opts.func_write_log(' | '+y1_example+'\n');
            opts.func_write_log('w1: ');
            self.v.write(w1, opts.func_write_log);
        }

        let y1 = opts.neuron(x1_example, w1);

        if(opts.show_log) opts.func_write_log(' | '+y1);
        if(opts.show_log) opts.func_write_log('\n\n');

        return y1;
    }

    this.study = function(opts) {

        self.validate_opts(opts, 'study');

        opts.free.count_error = -1;
        let era = 1;

        while (opts.free.count_error !== 0) {

            if (era == opts.count_era+1) { /*alert('Обучение прервано!');*/ break; }
            if (opts.show_log) opts.func_write_log('-------------- Era '+era+'\n\n');

            opts.free.count_error = 0;
            let e; // суммарная величина ошибки на всех примерах

            // перебираем примеры
            for (let i=0; i < opts.sets_study.length; i++) {

                let x1_example = opts.sets_study.get_x_example(i);
                let y1_example = opts.sets_study.get_y_example(i);
                let y = []; // выходы слоя
                let w1; // весы нейрона
                let _x1_example; // либо пример, либо выход слоя
                x1_example.push(opts.b);
                e = 0;

                // перебираем слои
                for (let il=0;il<opts.w1.length;il++) {

                     y[il] = [];

                     if (il === 0) _x1_example = x1_example;
                     else {_x1_example = y[il-1].slice(); _x1_example.push(1);}

                    // перебираем нейроны
                    for (let j=0;j<opts.w1[il].length;j++) {
                        w1 = opts.w1[il][j];
//alert(JSON.stringify([_x1_example, w1]));
                        let y1 = self.study_one_neuron(opts, il, j, _x1_example, y1_example, w1);
                        y[il].push(y1);
                    }
                }

                // проверяем правильность выхода после последнего слоя
                e += Math.pow(y[y.length-1][0] - y1_example, 2);
                if (y[y.length-1][0] === y1_example) {
                } else {
                    opts.free.count_error += 1;
                    for (let il=0;il<opts.w1.length;il++) {

                        let _w1;
                        if (il===0) _w1 = x1_example;
                        else {_w1 = y[il-1].slice(); _w1.push(opts.b);}

                        for (let j=0;j<opts.w1[il].length;j++) {
//alert(JSON.stringify([il, j]));
 //alert(JSON.stringify([opts.w1[il][j], _w1]));
                            if (y[y.length-1][0] === 0) {self.v.Sum(opts.w1[il][j], _w1);}
                            else {self.v.Diff(opts.w1[il][j], _w1);}
                        }
                    }
                }

            }

           //opts.func_write_log(e+'\n');
           if (opts.free.count_error === 0) {return 1;}

           era += 1;

        }

        if (opts.free.count_error === 0) {return 1;} else {return 0;}

    }

}