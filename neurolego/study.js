/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function Study() {
    Opts.call(this);
    
    self = this;

    this.study_one_neuron = function(opts, ix_example) {
        let x1_example = opts.sets_study.get_x_example(ix_example);
        let y1_example = opts.sets_study.get_y_example(ix_example);

        if (opts.show_log) {
            opts.func_write_log('x1_example: ');
            self.v.write(x1_example, opts.func_write_log);
            opts.func_write_log(' | '+y1_example+'\n');
            opts.func_write_log('w1: ');
            self.v.write(opts.w1, opts.func_write_log);
        }

        let y1 = opts.neuron(x1_example, opts.w1, opts.b);

        if(opts.show_log) opts.func_write_log(' | '+y1);

        if (y1 === y1_example) {
        } else {
            opts.count_error += 1;
            if (y1 === 0) {self.v.Sum(opts.w1, x1_example);}
            else {self.v.Diff(opts.w1,x1_example);}
        }

        if(opts.show_log) opts.func_write_log('\n\n');

        return y1;
    }

    this.study = function(opts) {

        // ----------- опции обучения

        /* коррекция некоторых опций */

        opts.count_era = parseInt(opts.count_era);
        opts.b = parseInt(opts.b);

        /* обязательные */

        if (opts.b === undefined) {console.log('Укажите смещение!'); return;}
        if (opts.w1 === undefined) {console.log('Укажите веса!'); return;}
        if (opts.sets_study === undefined) {console.log('Укажите обучающие наборы!'); return;}

       /* не обязательные */

        if (opts.count_era === undefined) opts.count_era = 50;
        if (opts.show_log === undefined) opts.show_log = 1;
        if (opts.func_write_log === undefined) opts.func_write_log = console.log;
        if (opts.neuron === undefined) opts.neuron = self.n.Perceptron;
        //count_input: btn.form.count_input.value;

        // ----------- стартовые значения разных счётчиков

        opts.count_error = -1;
        let era = 1;

        //alert(JSON.stringify(opts));

        // ----------- обучение

        while (opts.count_error !== 0) {

            if (era == opts.count_era+1) { /*alert('Обучение прервано!');*/ break; }
            if (opts.show_log) opts.func_write_log('-------------- Era '+era+'\n\n');

            opts.count_error = 0;

            for (let i=0; i < opts.sets_study.length; i++) {
                let y1 = self.study_one_neuron(opts, i);
            }

           if (opts.count_error === 0) {return 1;}

           era += 1;

        }

        if (opts.count_error === 0) {return 1;} else {return 0;}

    }

}