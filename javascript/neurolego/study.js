/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function StudyBackPropagation() {
    Algebra.call(this);

    let self = this;

    /* Расчёт ошибки для одного примера
         Выходы данной функции для всех примеров затем следует просуммировать и разделить на 2.
    */
    this.calcError = function(opts, Y_real, sY_ideal) {
        let E = Y_real[Y_real.length-1].slice();
        // разница между реальным ответов и идеальным
        self.v.Diff(E, sY_ideal);
        // разницу возводим в квадрат
        self.v.MultiplyVect(E, E);
        // суммируем разницы всех выходов
        E = self.v.MultiplyScalConst(E, 1);

       return E;

    }

    this.step = function(opts, Y_real, sY_ideal, X) {

       let delta;

        // расчёт ошибок

        let output_errors = sY_ideal.slice();
        self.m.Diff(output_errors, Y_real[1]);

       self.m.T(opts.W[1]);
       let hidden_errors = self.m.Multiply(opts.W[1], output_errors);
       self.m.T(opts.W[1]);

       self.m.T(hidden_errors); //

        // расчёт разницы коэффициентов

        // выходной слой

        let _1_y = Y_real[1].slice();
        self.m.MultiplyConst(_1_y, -1);
        self.m.SumConst(_1_y, 1.0);

        let _output_errors = output_errors.slice();
        self.m.MultiplySimple(_output_errors, Y_real[1]);
        self.m.MultiplySimple(_output_errors, _1_y);

        self.m.T(Y_real[0]);
        delta = self.m.Multiply(_output_errors, Y_real[0]);
        self.m.T(Y_real[0]);

        self.m.MultiplyConst(delta, opts.speed_study);

        self.m.T(delta); //
        self.m.Sum(opts.W[1], delta);

        // скрытый слой

        let _1_h = Y_real[0].slice();
        self.m.MultiplyConst(_1_h, -1);
        self.m.SumConst(_1_h, 1.0);

        let _hidden_errors = hidden_errors.slice();
        self.m.MultiplySimple(_hidden_errors, Y_real[0]);
        self.m.MultiplySimple(_hidden_errors, _1_h);

        self.m.T(X);
        delta = self.m.Multiply(_hidden_errors, X);
        self.m.T(X);

        self.m.MultiplyConst(delta, opts.speed_study);

        self.m.T(delta);
        self.m.Sum(opts.W[0], delta);

    }

    // шаг 2: расчёт изменения весов для выходного слоя
    this.step2 = function(opts, Y_real, sY_ideal, X) {

        /*let sW_delta = [];

        let sY_delta = sY_ideal.slice();
        // разница между идеальным ответов и реальным
        self.v.Diff(sY_delta, Y_real[Y_real.length-1]);

        return sW_delta;*/

        // выход для последнего слоя (через производную)
        let _sY_real = [];
        // вход для последнего слоя (выход предыдущего)
        let _X = X;
        if (Y_real.length > 1) _X = Y_real[Y_real.length-2];
        // веса последнего слоя
        let sW = opts.W[opts.W.length-1];

        /* формула 1.31 */

        let sY_delta = Y_real[Y_real.length-1].slice();
        // разница между реальным ответов и идеальным
        self.v.Diff(sY_delta, sY_ideal);
        // находим выход от производной
        for (let j=0; j<sW.length; j++) {
             let s = self.n.sum(_X, sW[j]);
             let nY_real = opts.neuron(s, true);
             _sY_real.push(nY_real);
        }

        // умножаем разницу на результаты производной
        self.v.MultiplyVect(sY_delta, _sY_real);

        /* формула 1.32: расчёт изменения веса */

        let sW_delta = [];
        let nW_delta;
        //self.v.MultiplyVectConst(sY_delta, -opts.speed_study);
        for (let j=0; j<sW.length; j++) {
            sY_delta[j] *= -opts.speed_study;
            nW_delta = _X.slice();
            self.v.MultiplyVectConst(nW_delta, sY_delta[j]);
            sW_delta.push(nW_delta);
        }

        return sW_delta;

    }

    // шаг 3: расчёт изменения весов для остальных слоёв
    this.step3 = function(opts, Y_real, sY_ideal, X) {

        /*let W_delta = [];

        for (let i=0; i < opts.W[1].length; i++) {
             let sY_delta = [];
             for (let j=0; j < W[1][0].length; j++) {
                 
             }
        }

        return W_delta;*/

        let W_delta = [];

        for (let il=0; il < opts.W.length-1; il++) { // без последнего слоя
            let sY_delta = [];
            let sW = opts.W[il];
            for (let j=0; j < sW.length; j++) {
                
            }
            
        }

        return W_delta;
    }

   // шаг 4: Обновление весов
    this.step4 = function(opts, W_delta) {
        for (let il=0; il < opts.W.length; il++) {
            let sW = opts.W[il];
            for (let j=0; j < sW.length; j++) {
                self.v.Sum(sW[j], W_delta[il][j]);
            }
        }
    }

}

function Study() {
    Opts.call(this);
    
    let self = this;

    self.study_bp = new StudyBackPropagation();

    /* генерирует веса по описанию топологии */
    this.generateWByTopology = function(W, topology, count_input) {
        let _count_input;

        for (let il=0; il<topology.length;il++) {
            //W[il] = [];

            // количество входов нейрона равно количеству нейронов в предыдущем слое
            if (il === 0) _count_input = count_input;
            else _count_input = topology[il-1]

            W[il] = self.m.create(_count_input/*+1*/, topology[il], 'random');

            //for (let j=0;j<topology[il];j++) {
            //    W[il][j] = self.v.create(_count_input+1, 'random');
            //}
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

        let delta = sY_ideal.slice();
        // разница между идеальным ответов и реальным
        self.v.Diff(delta, Y_real[Y_real.length-1]);
        // суммируем разницы всех выходов
        delta = self.v.MultiplyScalConst(delta, 1);

        delta = delta * opts.speed_study;

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
        //alert(JSON.stringify([]));
        if (self.v.IsEq(Y_real[Y_real.length-1], sY_ideal)) {
        } else {
            opts.free.count_error += 1;
            for (let il=0;il<opts.W.length;il++) {

                let _nW=X;
                if (il===0) _nW = X;
                else {_nW = Y_real[il-1].slice();  /*_nW.push(opts.b);*/}

                self.m.MultiplyConst(_nW, opts.speed_study);
                //self.v.MultiplyVectConst(_nW, opts.speed_study);

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

    this.study = function(opts) {

        self.validate_opts(opts, 'study');

        // генерируем веса
        opts.W = [];
        self.generateWByTopology(opts.W, opts.topology, opts.count_input);

        opts.free.count_error = -1;
        opts.free.restart_study_count = opts.restart_study_count;
        let era = 1;

        while (opts.free.count_error !== 0) {

            if (era == opts.count_era+1) { /*alert('Обучение прервано!');*/ break; }
            if (opts.show_log & era%opts.show_log_era_in_step===0) opts.func_write_log('-------------- Era '+era+'\n\n');

            opts.free.count_error = 0;
            let error, delta, errors, error_era=0; // суммарная величина ошибки на всех примерах

            let Y_real = [];

            let ers = 0;

            // перебираем примеры
            for (let i=0; i < opts.sets_study.length; i++) {

                //let i = self.getRandomInt(0, opts.sets_study.length);

                let X = self.m.createFromVect(opts.sets_study.get_x_example(i), true);
                self.m.T(X);

                let sY_ideal = self.m.createFromVect(opts.sets_study.get_y_example(i), true);
                self.m.T(sY_ideal);

                let nW;
                let _X; // либо пример, либо выход слоя
                /*X.push(opts.b);*/

                // перебираем слои
                for (let il=0;il<opts.W.length;il++) {

                     //Y_real[il] = [];
                     //sW = opts.W[il];
                     sW = opts.W[il].slice();

                     if (il === 0) _X = X;
                     else {_X = Y_real[il-1]; /*_X.push(1);*/}

                     Y_real[il] = self.m.Multiply(sW, _X);
                     self.m.MultiplyFunc(Y_real[il], opts.neuron);
                     self.m.T(Y_real[il]);

                    // перебираем нейроны
                    /*for (let iw=0;iw<sW.length;iw++) {
                        let _nY_real = self.n.sum(_X, sW[iw]);
                        let nY_real = opts.neuron(_nY_real);
                        Y_real[il].push(nY_real);
                    }*/

                   if(opts.show_log & il===opts.W.length-1 & era%opts.show_log_era_in_step===0){
                        //opts.func_write_log('X: ');
                        //self.v.write(X, opts.func_write_log);
                        opts.func_write_log(' | '+JSON.stringify(sY_ideal)+'\n');
                        for(let j=0;j<opts.W[il].length;j++) {
                            //opts.func_write_log('nW: ');
                            //self.v.write(opts.W[il][j], opts.func_write_log);
                            opts.func_write_log(' | '+Y_real[il][j]+'\n');
                       }
                       opts.func_write_log('\n');
                    }

                }

//alert(JSON.stringify(Y_real))

               if (opts.method_study === 'gradient' ) {
                    self.study_bp.step(opts, Y_real, sY_ideal, X);
                    //let sW_delta = self.study_bp.step2(opts, Y_real, sY_ideal, X);
                    //if(era%1===0) opts.func_write_log(i+':: '+JSON.stringify(Y_real[1])+'\n');
                    //self.study_bp.step4(opts, sW_delta);
                    //opts.free.count_error += 1;
                } else if (opts.method_study === 'delta' ) {
                    self.studyDelta(opts, Y_real, sY_ideal, X);
                } else if (opts.method_study === 'simple') {
                    self.studySimple(opts, Y_real, sY_ideal, X);
                }

               //ers += this.study_bp.calcDelta(opts, Y_real, sY_ideal);

            }

           if (era%opts.show_log_era_in_step===0) opts.func_write_log('Error: '+ers+'\n');

           //opts.func_write_log(Y_real[Y_real.length-1][0]+' ' +'  ' +error_era+'\n');
           //if (error_era <= 0) {return 1;}

           if (opts.free.count_error === 0) {return 1;}

           era += 1;
           error_era = 0;

           if (opts.restart_study & era == opts.count_era+1 & opts.free.restart_study_count > 0) {
                era = 1;
                opts.free.restart_study_count -= 1;
                self.generateWByTopology(opts.W, opts.topology, opts.count_input);
                ers = 0;
           }

        }

        if (opts.free.count_error === 0) {return 1;} else {return 0;}

    }

}