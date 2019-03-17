/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Study() {
    Opts.call(this);
    
    let self = this;

    /* генерирует веса по описанию топологии */
    this.generateWByTopology = function(W, topology, count_input) {
        let _count_input;

        for (let il=0; il<topology.length;il++) {
            W[il] = [];

            // количество входов нейрона равно количеству нейронов в предыдущем слое
            if (il === 0) _count_input = count_input;
            else _count_input = topology[il-1]

            for (let j=0;j<topology[il];j++) {
                W[il][j] = self.v.create(_count_input+1, 'random');
            }
        }
    }

    this.calcError = function(opts, Y_real, sY_ideal, errors) {
        for (let il=opts.W.length-1;il>=0;il--) {

            for (let j=0;j<opts.W[il].length;j++) {
                 if(!errors[il]) {errors[il] = [];}

                 if (il === opts.W.length-1) {
                     error = Y_real[il][j] - sY_ideal[j];
                     //error = Y_real[il][0] - sY_ideal;
                     delta = error * opts.neuron(Y_real[il][j], true);
                     //delta = error * opts.neuron(Y_real[il][0], true);
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

    /* Дельта-правило. Для одного нейрона с выходом и входом от 0.0 до 1.0 */
    this.studyDelta = function(opts, Y_real, sY_ideal, X) {
        let _delta = sY_ideal.slice();
        self.v.Diff(_delta, Y_real[Y_real.length-1]);
        _delta = self.v.MultiplyScalConst(_delta, 1);
        let delta = _delta * opts.speed_study;
        //let delta = Math.pow(_delta, 2) * opts.speed_study;
        //if (_delta < 0) delta = delta * -1;
        //let delta = (sY_ideal - Y_real[Y_real.length-1]) * opts.speed_study;

        if (delta !== 0) opts.free.count_error += 1;

        for (let il=0;il<opts.W.length;il++) {

            let _nW=X;
            if (il !== 0) {
                _nW = Y_real[il-1].slice();
                _nW.push(opts.b);
             }

            self.v.MultiplyVectConst(_nW, delta);

             for (let j=0;j<opts.W[il].length;j++) {
                  self.v.Sum(opts.W[il][j], _nW);
             }
        }
    }

    /* Правила Хебба. Идеально для одного бинарного нейрона (1 и 0). Для двух слоёв срабатывает не всегда.*/
    this.studySimple = function(opts, Y_real, sY_ideal, X) {
        if (self.v.IsEq(Y_real[Y_real.length-1], sY_ideal)) {
        } else {
            opts.free.count_error += 1;
            for (let il=0;il<opts.W.length;il++) {

                let _nW=X;
                if (il===0) _nW = X;
                else {_nW = Y_real[il-1].slice();  _nW.push(opts.b);}

                self.v.MultiplyVectConst(_nW, opts.speed_study);

                 for (let j=0;j<opts.W[il].length;j++) {
                      if (Y_real[Y_real.length-1][0] === 0) {
                          self.v.Sum(opts.W[il][j], _nW);
                      } else {
                          self.v.Diff(opts.W[il][j], _nW);
                     }
                 }

            }
        }
    }

    this.studyBackpropag = function(opts, Y_real, sY_ideal, errors) {
        let delta = sY_ideal.slice();
        self.v.Diff(delta, Y_real[Y_real.length-1]);
        delta = self.v.MultiplyScalConst(delta, 1) * opts.speed_study;
        //opts.func_write_log('D: '+JSON.stringify(delta)+'\n\n');

        if (self.v.MultiplyScalConst(delta, 1) !== 0) opts.free.count_error += 1;

        //for (let il=opts.W.length-2;il>=0;il--) {
        for (let il=0;il<opts.W.length;il++) {
            //let commonStratumW = [];

            // вычисляем суммарный вклад веса по слою

            /*for (let j=0;j<opts.W[il].length;j++) {
                let commonNeuronW = self.v.MultiplyScalConst(opts.W[il][j], 1);
                commonStratumW.push(commonNeuronW);
                }
            commonStratumW = self.v.MultiplyScalConst(commonStratumW, 1);*/

            // расчитываем значимость и ошибку каждого веса

            for (let j=0;j<opts.W[il].length;j++) {
                // значимость веса
                let nE = opts.W[il][j].slice();
                //self.v.MultiplyVectConst(nE, 1/commonStratumW);
//opts.func_write_log('D: '+JSON.stringify(nE)+'\n\n');
                // ошибочность веса
                self.v.MultiplyVectConst(nE, delta);
                // обновление веса
                self.v.Diff(opts.W[il][j], nE);
            }
        }

    /*        if (self.v.IsEq(Y_real[Y_real.length-1], sY_ideal)) opts.free.count_error += 1;
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
            }    */
    }

    this.study = function(opts) {

        self.validate_opts(opts, 'study');

        opts.free.count_error = -1;
        opts.free.restart_study_count = opts.restart_study_count;
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
                     sW = opts.W[il]

                     if (il === 0) _X = X;
                     else {_X = Y_real[il-1].slice(); _X.push(1);}

                    // перебираем нейроны
                    for (let iw=0;iw<sW.length;iw++) {
                        let _nY_real = self.n.sum(_X, sW[iw]);
                        let nY_real = opts.neuron(_nY_real);
                        Y_real[il].push(nY_real);
                    }

//[[0,1], [1,1], [1,1], [0,1]]

                   if(opts.show_log & il===opts.W.length-1 & era%opts.show_log_era_in_step===0){
                        opts.func_write_log('X: ');
                        self.v.write(X, opts.func_write_log);
                        opts.func_write_log(' | '+JSON.stringify(sY_ideal)+'\n');
                        for(let j=0;j<opts.W[il].length;j++) {
                            opts.func_write_log('nW: ');
                            self.v.write(opts.W[il][j], opts.func_write_log);
                            opts.func_write_log(' | '+Y_real[il][j]+'\n');
                       }
                       opts.func_write_log('\n');
                    }

                }

//alert(JSON.stringify(Y_real))

               if (opts.method_study === 'gradient' ) {

                    // проверяем правильность выхода после последнего слоя
                    errors = [];
                   self.calcError(opts, Y_real, sY_ideal, errors);
                   self.studyBackpropag(opts, Y_real, sY_ideal, errors)
                } else if (opts.method_study === 'delta' ) {
                    self.studyDelta(opts, Y_real, sY_ideal, X);
                } else if (opts.method_study === 'simple') {
                    self.studySimple(opts, Y_real, sY_ideal, X);
                }

            }

           //opts.func_write_log(Y_real[Y_real.length-1][0]+' ' +'  ' +error_era+'\n');
           //if (error_era <= 0) {return 1;}

           if (opts.free.count_error === 0) {return 1;}

           era += 1;
           error_era = 0;

           if (opts.restart_study & era == opts.count_era+1 & opts.free.restart_study_count > 0) {
                era = 1;
                opts.free.restart_study_count -= 1;
                self.generateWByTopology(opts.W, opts.topology, opts.count_input);
           }

        }

        if (opts.free.count_error === 0) {return 1;} else {return 0;}

    }

}