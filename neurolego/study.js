/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Study() {
    Opts.call(this);
    
    let self = this;

    this.study_one_neuron = function(opts, i_layer, i_neuron, x1_example, y1_example, w1) {

        let _y1 = self.n.sum(x1_example, w1);
        let y1 = opts.neuron(_y1);

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
            let error, delta, errors, error_era=0; // суммарная величина ошибки на всех примерах

            let y = []; // выходы слоя

            // перебираем примеры
            for (let i=0; i < opts.sets_study.length; i++) {

                let x1_example = opts.sets_study.get_x_example(i);
                let y1_example = opts.sets_study.get_y_example(i);
                let w1; // весы нейрона
                let _x1_example; // либо пример, либо выход слоя
                x1_example.push(opts.b);

                // перебираем слои
                for (let il=0;il<opts.w1.length;il++) {

                     y[il] = [];

                     if (il === 0) _x1_example = x1_example;
                     else {_x1_example = y[il-1].slice(); _x1_example.push(1);}

                    // перебираем нейроны
                    for (let j=0;j<opts.w1[il].length;j++) {
                        w1 = opts.w1[il][j];

                        if (opts.show_log & il===opts.w1.length-1 & era%20===0) {
                            opts.func_write_log('x1_example: ');
                            self.v.write(x1_example, opts.func_write_log);
                            opts.func_write_log(' | '+y1_example+'\n');
                            //opts.func_write_log('w1: ');
                            //self.v.write(w1, opts.func_write_log);
                        }

                        let y1 = self.study_one_neuron(opts, il, j, _x1_example, y1_example, w1);
                        y[il].push(y1);

                        if(opts.show_log & il===opts.w1.length-1 & era%20===0){
                            opts.func_write_log(' | '+y1+'\n\n');
                        }

                    }
                }

//alert(JSON.stringify(y))

                // проверяем правильность выхода после последнего слоя
                errors = [];

                for (let il=opts.w1.length-1;il>=0;il--) {

                    for (let j=0;j<opts.w1[il].length;j++) {
                         if(!errors[il]) {errors[il] = [];}

                         if (il === opts.w1.length-1) {
                             //error = y[il][j] - y1_example[j];
                             error = y[il][0] - y1_example;
                             //delta = error * opts.neuron(y[il][j], true);
                             delta = error * opts.neuron(y[il][0], true);
                         } else {
                             error = self.v.MultiplyScalConst(opts.w1[il][j], errors[il+1][0].delta);
                             delta = error * opts.neuron(y[il][j], true);
                             error_era += error;
                         }

                         errors[il][j] = {error:error, delta:delta};
                    }
                }

               //alert(JSON.stringify(errors)); exit();

                //  ------------------

                /*if (y[y.length-1][0] === y1_example) {
                } else {
                    opts.free.count_error += 1;
                    for (let il=0;il<opts.w1.length-1;il++) {

                        let _w1;
                        if (il===0) _w1 = x1_example;
                        else {_w1 = y[il-1].slice(); _w1.push(opts.b);}

                        for (let j=0;j<opts.w1[il].length;j++) {

                            if (y[y.length-1][0] === 0) {self.v.Sum(opts.w1[il][j], _w1);}
                            else {self.v.Diff(opts.w1[il][j], _w1);}
                        }
                    }
                }*/

// --------------------

                    if (y[y.length-1][0] !== y1_example) opts.free.count_error += 1;
                    for (let il=0;il<opts.w1.length-1;il++) {

let _y = y[il].slice();
let _d = 0;
_y.push(1);
for (let ie=0; ie<errors[il+1].length;ie++) {_d+=errors[il+1][ie].delta;}
self.v.MultiplyVectConst(_y, _d*10);

                        for (let j=0;j<opts.w1[il].length;j++) {
       //alert(JSON.stringify([opts.w1[il][j], _y]));
                            self.v.Diff(opts.w1[il][j], _y);
                        }
                    }

//   --------------------------------

            }

           //opts.func_write_log(y[y.length-1][0]+' ' +'  ' +error_era+'\n');
           //if (error_era <= 0) {return 1;}
           if (opts.free.count_error === 0) {return 1;}

           era += 1;
           error_era = 0;

        }

        if (opts.free.count_error === 0) {return 1;} else {return 0;}

    }

}