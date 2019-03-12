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
    let s = new Study();

    // ne-or
    let x_example = JSON.parse(btn.form.x.value);
    let y_example = JSON.parse(btn.form.y.value);
    // xor
    //let x_example = [[1, 0, 0], [1, 0, 1], [1, 1, 0], [1,1,1]];
    //let y_example = [0, 1, 1, 0];
    //let x_example = [[1, 1, 0.3], [1, 0.4, 0.5], [1, 0.7, 0.8]];
    //let y_example = [1, 1, 0];

    let count_input = parseInt(btn.form.count_input.value);
    let w1 = s.v.create(count_input+1, 'random');

    let opts = {
        sets_study: new Sets_Array(x_example, y_example),
        count_era: btn.form.count_era.value,
        count_input: count_input,

        show_log: btn.form.show_log.checked,
        neuron: s.neurons[btn.form.neuron.value],
        func_write_log: writeLog,
        w1: w1
        //b: btn.form.b.value
    }

    let t1 = (new Date()).getMilliseconds();
    let is_studied = s.study(opts);
    let t2 = (new Date()).getMilliseconds();
    writeLog('Прошло секунд: '+ ((t1-t2)/1000)+'\n');
    if (is_studied) { writeLog('Обучение завершено'); }
    else { writeLog('Обучение не закончилось'); }

    writeLog('\nw1: ');
    s.v.write(w1, writeLog);

    btn.form.w1.value = '[['+JSON.stringify(w1)+']]';
}

function startUsing(btn) {

    clearLog();
    let u = new Use();

    let x = JSON.parse(btn.form.x.value);

    let opts = {
        sets_using: new Sets_Array(x),

        show_log: btn.form.show_log.checked,
        neuron: u.neurons[btn.form.neuron.value],
        func_write_log: writeLog,
        w1: JSON.parse(btn.form.w1.value)
        //b: btn.form.b.value
    }

    let t1 = (new Date()).getMilliseconds();
    u.use(opts);
    let t2 = (new Date()).getMilliseconds();
    writeLog('Прошло секунд: '+ ((t1-t2)/1000)+'\n')

}

function copyW1(btn) {
    let form_study = document.getElementById('form_study');
    let w1 = form_study.w1.value;
    if (w1 === '') {
        alert('Результатов весов нет! Возможно, обучения ещё не происходило.');
        return;
    }
    btn.form.w1.value = w1;
}