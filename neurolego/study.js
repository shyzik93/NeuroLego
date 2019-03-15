/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Study() {
    Opts.call(this);
    
    let self = this;

    this.calcError = function(opts, Y_real, sY_ideal, errors) {
        for (let il=opts.W.length-1;il>=0;il--) {

            for (let j=0;j<opts.W[il].length;j++) {
                 if(!errors[il]) {errors[il] = [];}

                 if (il === opts.W.length-1) {
                     //error = Y_real[il][j] - sY_ideal[j];
                     error = Y_real[il][0] - sY_ideal;
                     //delta = error * opts.neuron(Y_real[il][j], true);
                     delta = error * opts.neuron(Y_real[il][0], true);
                 } else {
                     error = self.v.MultiplyScalConst(opts.W[il][j], errors[il+1][0].delta);
                     delta = error * opts.neuron(Y_real[il][j], true);
                     error_era += error;
                 }

                 errors[il][j] = {error:error, delta:delta};
            }
        }

       //alert(JSON.stringify(errors)); exit();
    }

    /* Дельта-правило. Для одного нейрона с выходом и входом от 0. до 1.0 */
    this.studyDelta = function() {
        
    }

    /* Правила Хебба. Идеально для одного бинарного нейрона (1 и 0). Для двух слоёв срабатывает не всегда.*/
    this.studySimple = function(opts, Y_real, sY_ideal, X) {
        if (Y_real[Y_real.length-1][0] === sY_ideal) {
        } else {
            opts.free.count_error += 1;
            for (let il=0;il<opts.W.length;il++) {

                let _nW=X;
                if (il===0) _nW = X;
                else {_nW = Y_real[il-1].slice();  _nW.push(opts.b);}

                 for (let j=0;j<opts.W[il].length;j++) {
                      if (Y_real[Y_real.length-1][0] === 0) {self.v.Sum(opts.W[il][j], _nW);}
                      else {self.v.Diff(opts.W[il][j], _nW);}
                 }

            }
        }
    }

    this.studyBackpropag = function(opts, Y_real, sY_ideal, errors) {
            if (Y_real[Y_real.length-1][0] !== sY_ideal) opts.free.count_error += 1;
            for (let il=0;il<opts.W.length-1;il++) {
                let sY_real = Y_real[il].slice();
                let _d = 0;
                sY_real.push(1);
                for (let ie=0; ie<errors[il+1].length;ie++) {_d+=errors[il+1][ie].delta;}
                self.v.MultiplyVectConst(sY_real, _d*10);

                for (let j=0;j<opts.W[il].length;j++) {
                    //alert(JSON.stringify([opts.W[il][j], sY_real]));
                    self.v.Diff(opts.W[il][j], sY_real);
                }
            }
    }

    this.study = function(opts) {

        self.validate_opts(opts, 'study');

        opts.free.count_error = -1;
        let era = 1;

        while (opts.free.count_error !== 0) {

            if (era == opts.count_era+1) { /*alert('Обучение прервано!');*/ break; }
            if (opts.show_log & era%opts.show_log_era_in_step===0) opts.func_write_log('-------------- Era '+era+'\n\n');

            opts.free.count_error = 0;
            let error, delta, errors, error_era=0; // суммарная величина ошибки на всех примерах

            let Y_real = [];

            // перебираем примеры
            for (let i=0; i < opts.sets_study.length; i++) {

                //let i = self.getRandomInt(0, opts.sets_study.length);

                let X = opts.sets_study.get_x_example(i);
                let sY_ideal = opts.sets_study.get_y_example(i);
                let nW;
                let _X; // либо пример, либо выход слоя
                X.push(opts.b);

                // перебираем слои
                for (let il=0;il<opts.W.length;il++) {

                     Y_real[il] = [];

                     if (il === 0) _X = X;
                     else {_X = Y_real[il-1].slice(); _X.push(1);}

                    // перебираем нейроны
                    for (let j=0;j<opts.W[il].length;j++) {
                        nW = opts.W[il][j];

                        if (opts.show_log & il===opts.W.length-1 & era%opts.show_log_era_in_step===0) {
                            opts.func_write_log('X: ');
                            self.v.write(X, opts.func_write_log);
                            opts.func_write_log(' | '+sY_ideal+'\nnW: ');
                            self.v.write(nW, opts.func_write_log);
                        }

                        let _nY_real = self.n.sum(_X, nW);
                        let nY_real = opts.neuron(_nY_real);
                        Y_real[il].push(nY_real);

                        if(opts.show_log & il===opts.W.length-1 & era%opts.show_log_era_in_step===0){
                            opts.func_write_log(' | '+nY_real+'\n\n');
                        }

                    }
                }

//alert(JSON.stringify(Y_real))

                // проверяем правильность выхода после последнего слоя
                errors = [];
                //self.calcError(opts, Y_real, sY_ideal, errors);

                // обучение
                self.studySimple(opts, Y_real, sY_ideal, X);
                //self.studyBackpropag(opts, Y_real, sY_ideal, errors);

            }

           //opts.func_write_log(Y_real[Y_real.length-1][0]+' ' +'  ' +error_era+'\n');
           //if (error_era <= 0) {return 1;}
           if (opts.free.count_error === 0) {return 1;}

           era += 1;
           error_era = 0;

        }

        if (opts.free.count_error === 0) {return 1;} else {return 0;}

    }

}