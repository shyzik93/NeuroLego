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
    let Xs = JSON.parse(btn.form.Xs.value);
    let sYs_ideal = JSON.parse(btn.form.sYs_ideal.value);
    // xor
    //let x_example = [[1, 0, 0], [1, 0, 1], [1, 1, 0], [1,1,1]];
    //let y_example = [0, 1, 1, 0];
    //let x_example = [[1, 1, 0.3], [1, 0.4, 0.5], [1, 0.7, 0.8]];
    //let y_example = [1, 1, 0];

    // генерируем веса
    let count_input = parseInt(btn.form.count_input.value);
    let topology = JSON.parse(btn.form.topology.value);
    let W = [];

    s.generateWByTopology(W, topology, count_input);

    let opts = {
        sets_study: new Sets_Array(Xs, sYs_ideal),
        speed_study: btn.form.speed_study.value,
        restart_study: btn.form.restart_study.checked,
        restart_study_count: btn.form.restart_study_count.value,
        count_era: btn.form.count_era.value,
        count_input: count_input,
        topology: topology,
        show_log_era_in_step: btn.form.show_log_era_in_step.value,

        show_log: btn.form.show_log.checked,
        neuron: s.neurons[btn.form.neuron.value],
        func_write_log: writeLog,
        W: W
        //b: btn.form.b.value
    }

    let t1 = (new Date()).getMilliseconds();
    let is_studied = s.study(opts);
    let t2 = (new Date()).getMilliseconds();
    writeLog('Прошло секунд: '+ ((t1-t2)/1000)+'\n');
    if (is_studied) { writeLog('Обучение завершено'); }
    else { writeLog('Обучение не закончилось'); }

    writeLog('\nw1: ');
    s.v.write(W, writeLog);

    btn.form.W.value = JSON.stringify(W);
}

function startUsing(btn) {

    clearLog();
    let u = new Use();

    let Xs = JSON.parse(btn.form.Xs.value);

    let opts = {
        sets_using: new Sets_Array(Xs),

        show_log: btn.form.show_log.checked,
        neuron: u.neurons[btn.form.neuron.value],
        func_write_log: writeLog,
        W: JSON.parse(btn.form.W.value)
        //b: btn.form.b.value
    }

    let t1 = (new Date()).getMilliseconds();
    u.use(opts);
    let t2 = (new Date()).getMilliseconds();
    writeLog('Прошло секунд: '+ ((t1-t2)/1000)+'\n')

}

function copyW1(btn) {
    let form_study = document.getElementById('form_study');
    let W = form_study.W.value;
    if (W === '') {
        alert('Результатов весов нет! Возможно, обучения ещё не происходило.');
        return;
    }
    btn.form.W.value = W;
}

function calcCountInput(field) {
    let Xs;
    try {
        Xs = JSON.parse(field.value);
    } catch {
        alert("Синтаксическая ошибка в примерах (x)!");
        return;
    }

    if (Xs.length > 0) {
        field.form.count_input.value = Xs[0].length;
    }

}