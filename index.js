/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

var a = new Algebra();

function writeLog(text) {
    document.getElementById('form_log').log.value += text;
}
function clearLog() {
    document.getElementById('form_log').log.value = '';
}

function startStudy(btn) {
    clearLog();
    // ne-or
    let x_example = [[0, 0], [0, 1], [1, 0], [1,1]];
    let y_example = [1, 1, 1, 0];
    // xor
    //let x_example = [[1, 0, 0], [1, 0, 1], [1, 1, 0], [1,1,1]];
    //let y_example = [0, 1, 1, 0];
    //let x_example = [[1, 1, 0.3], [1, 0.4, 0.5], [1, 0.7, 0.8]];
    //let y_example = [1, 1, 0];

    count_input = 2;

    let w1 = a.v.create(count_input+1, 'random');

    let opts = {
        sets_study: new Sets_Array(x_example, y_example),
        count_era: btn.form.count_era.value,
        count_input: btn.form.count_input.value,

        show_log: btn.form.show_log.checked,
        neuron: a.neurons[btn.form.neuron.value],
        func_write_log: writeLog,
        //x_examples: x_example,
        //y_examples: y_example,
        w1: w1,
        b: btn.form.b.value
    }

    let t1 = (new Date()).getMilliseconds();
    let is_studied = StudyPerceptron(opts);
    let t2 = (new Date()).getMilliseconds();
    writeLog('Прошло секунд: '+ ((t1-t2)/1000)+'\n');
    if (is_studied) { writeLog('Обучение завершено'); }
    else { writeLog('Обучение не закончилось'); }

    writeLog('\nw1: ');
    a.v.write(w1, writeLog);
    btn.form.result_w1.value = JSON.stringify(w1);
}

function startUsing(btn) {

    clearLog();

    let x = [[0, 0], [0, 1], [1, 0], [1,1]];

    let opts = {
        sets_using: new Sets_Array(x),

        show_log: btn.form.show_log.checked,
        neuron: a.neurons[btn.form.neuron.value],
        func_write_log: writeLog,
        w1: JSON.parse(btn.form.w1.value),
        b: btn.form.b.value
    }

    let t1 = (new Date()).getMilliseconds();
    UsePerceptron(opts);
    let t2 = (new Date()).getMilliseconds();
    writeLog('Прошло секунд: '+ ((t1-t2)/1000)+'\n')

}

function copyW1(btn) {
    let form_study = document.getElementById('form_study');
    let w1 = form_study.result_w1.value;
    if (w1 === '') {
        alert('Результатов весов нет! Возможно, обучения ещё не происходило.');
        return;
    }
    btn.form.w1.value = w1;
}