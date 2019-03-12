/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function StudyOneNeuron(opts, ix_example, v) {
    let x1_example = opts.sets_study.get_x_example(ix_example);
    let y1_example = opts.sets_study.get_y_example(ix_example);

    if (opts.show_log) {
        opts.func_write_log('x1_example: ');
        v.write(x1_example, opts.func_write_log);
        opts.func_write_log(' | '+y1_example+'\n');
        opts.func_write_log('w1: ');
        v.write(opts.w1, opts.func_write_log);
    }

    let y1 = opts.neuron(x1_example, opts.w1, opts.b);

    if(opts.show_log) opts.func_write_log(' | '+y1);

    if (y1 === y1_example) {
    } else {
        opts.count_error += 1;
        if (y1 === 0) {v.Sum(opts.w1, x1_example);}
        else {v.Diff(opts.w1,x1_example);}
    }

    if(opts.show_log) opts.func_write_log('\n\n');

    return y1;
}

function StudyPerceptron(opts) {

    let v = new Vector();
    let n = new Neuron(v);

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
    if (opts.neuron === undefined) opts.neuron = n.Perceptron;
    //count_input: btn.form.count_input.value;

    // ----------- стартовые значения разных счётчиков

    opts.count_error = -1;
    let era = 1;

    // ----------- обучение

    while (opts.count_error !== 0) {

        if (era == opts.count_era+1) { /*alert('Обучение прервано!');*/ break; }
        if (opts.show_log) opts.func_write_log('-------------- Era '+era+'\n\n');

        opts.count_error = 0;

        for (let i=0; i < opts.sets_study.length; i++) {
            let y1 = StudyOneNeuron(opts, i, v);
        }

       if (opts.count_error === 0) {return 1;}

       era += 1;

    }

    if (opts.count_error === 0) {return 1;} else {return 0;}

}

function UseOneNeuron(opts, ix, v) {

    let x_example = opts.sets_using.get_x_example(ix);

    if(opts.show_log) opts.func_write_log('x1: ');
    if(opts.show_log) v.write(x_example, opts.func_write_log);
    if(opts.show_log) opts.func_write_log(' ');

    let y1 = opts.neuron(x_example, opts.w1, opts.b);

    if(opts.show_log) opts.func_write_log(' | '+y1+'\n');

    return y1;
}

function UsePerceptron(opts) {

    let v = new Vector();
    let n = new Neuron(v);

    // ----------- опции использования

    /* коррекция некоторых опций */

    opts.b = parseInt(opts.b);

    /* обязательные */

    if (opts.w1 === undefined) {console.log('Укажите веса'); return;}
    if (opts.sets_using === undefined) {console.log('Укажите входные наборы!'); return;}

   /* не обязательные */

    if (opts.b === undefined) opts.b = 1;
    if (opts.show_log === undefined) opts.show_log = 1;
    if (opts.func_write_log === undefined) opts.func_write_log = console.log;
    if (opts.neuron === undefined) opts.neuron = n.Perceptron;

    for (let i=0; i < opts.sets_using.length; i++) {
        let y1 = UseOneNeuron(opts, i, v);
    }
}

/* y_examples - for studing only */
function Sets_Array(x_examples, y_examples) {

    this._x_examples = x_examples;
    this._y_examples = y_examples;

    this.length = this._x_examples.length;

    this.get_x_example = function(ix) {
        return this._x_examples[ix].slice(0);
    }

    this.get_y_example = function(iy) {
        if (this._y_examples !== undefined) return this._y_examples[iy];
    }
}