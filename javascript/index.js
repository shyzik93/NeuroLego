/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

function writeLog(text) {
    document.getElementById('form_log').log.value += text;
}
function clearLog() {
    document.getElementById('form_log').log.value = "";
}

function _CopyToClipboard(el) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select().createTextRange();
        document.execCommand("Copy");
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(el);
        window.getSelection().addRange(range);
        document.execCommand("Copy");
    }
}

function copyToClipboard(text) {
    let element = document.createElement("div");
    element.textContent = text;
    let $temp = document.createElement("input");
    document.body.appendChild($temp);
    $temp.value = element.textContent;

_CopyToClipboard(document.getElementById('form_study'));

    /*// select text
    // https://learn.javascript.ru/range-textrange-selection
    let rng = document.createRange();
    rng.selectNodeContents(element);
    window.getSelection().addRange(rng);
    //rng.setStart($temp, 0);
    //rng.setEnd($temp, 10);
    //return rng.toString();
    //input.select();
 
    document.execCommand("copy");
    $temp.remove();*/
}

function setOptsToForm(form, opts) {
        form.W.value = JSON.stringify(opts.W);
        form.Xs.value = JSON.stringify(opts.Xs);
        form.sYs_ideal.value = JSON.stringify(opts.sYs_ideal);
        form.Xs_use.value = JSON.stringify(opts.Xs);
        form.sYs_use.value = JSON.stringify(opts.sYs_ideal);
        form.source_input.value = opts.source_input;
        form.source_dir.value = opts.source_dir,

        form.source_dir_is_length.checked = opts.source_dir_is_length,
        form.source_dir_length.value = opts.source_dir_length,

        form.speed_study.value = opts.speed_study;
        form.restart_study.checked = opts.restart_study;
        form.restart_study_count.value=opts.restart_study_count;
        form.count_era.value = opts.count_era;
        form.count_input.value = opts.count_input;
        form.topology.value = JSON.stringify(opts.topology);
        form.show_log_era_in_step.value = opts.show_log_era_in_step;
        form.method_study.value = opts.method_study;

        form.show_log.checked = opts.show_log;
        form.neuron.value = opts.neuron;
        form.format_w.value = opts.format_w;
        form.add_b.checked = opts.add_b;
        //form.b.value = opts.b;
}

function collectOptsFromForm(form) {

    let W = null, Xs = [], sYs_ideal = [];

    try { W = JSON.parse(form.W.value); }
    catch { alert("Синтаксическая ошибка в весах (W)!"); }

    try { Xs = JSON.parse(form.Xs.value); }
    catch { alert("Синтаксическая ошибка в примерах (Xs)!"); }

    try { sYs_ideal = JSON.parse(form.sYs_ideal.value); }
    catch { alert("Синтаксическая ошибка в примерах (sYs_ideal)!"); }

    try { Xs_use = JSON.parse(form.Xs_use.value); }
    catch { alert("Синтаксическая ошибка в примерах (Xs)!"); }

    try { sYs_use = JSON.parse(form.sYs_use.value); }
    catch { alert("Синтаксическая ошибка в примерах (sYs_ideal)!"); }

    return {
        W: W,

        sYs_ideal: sYs_ideal,
        sYs_use: sYs_use,

        speed_study: form.speed_study.value,
        restart_study: form.restart_study.checked,
        restart_study_count: form.restart_study_count.value,
        count_era: form.count_era.value,
        count_input: parseInt(form.count_input.value),
        topology: JSON.parse(form.topology.value),
        show_log_era_in_step: form.show_log_era_in_step.value,
        method_study: form.method_study.value,

        Xs: Xs,
        Xs_use: Xs_use,
        source_input: form.source_input.value,
        source_dir: form.source_dir.value,
        source_dir_is_length: form.source_dir_is_length.checked,
        source_dir_length: form.source_dir_length.value,
        show_log: form.show_log.checked,
        neuron: form.neuron.value,
        format_w: form.format_w.value,
        add_b: form.add_b.checked
        //b: form.b.value
    };
}

function RunNN(btn, type) {

    clearLog();

    let opts = collectOptsFromForm(btn.form);

    if (window.Worker) {
        const myWorker = new Worker("worker.js");
        myWorker.postMessage([opts, type]);
        myWorker.onmessage = function(e) {
            if (e.data[0] === 'msg') {
                writeLog(e.data[1]);
            } else if (e.data[0] === 'alert') {
                alert(e.data[1]);
            } else if (e.data[0] === 'result') {
                if (type==='study') btn.form.W.value = JSON.stringify(e.data[1].W);
            }
        }
    } else {
        alert('Your browser doesn\'t support web workers.')
    }
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

function actionsStudy(select, action) {
    if (action === 'export') {
        let opts = collectOptsFromForm(select.form);
        opts = JSON.stringify(opts);

        let blob = unescape( encodeURIComponent(opts));
        let a = document.getElementById('a_load');
        a.href = "data:text/json;charset=utf-8;base64,"+btoa(blob);
        a.download = 'exportExample.json';
        a.click();

    } else if (action === 'import') {
        let reader = new FileReader();
        reader.onload = function(event) {
            let opts = event.target.result;
            opts = atob(opts.replace(/^data.*,/, ''));
            setOptsToForm(select.form, JSON.parse(opts));
         };
         reader.readAsDataURL(select.files[0]);
    }
}

function selectSourceInput(form, name) {
    form.querySelector('.source_input_form').style.display = 'none';
    form.querySelector('.source_input_files').style.display = 'none';

    if (name==='form') form.querySelector('.source_input_form').style.display = 'block';
    if (name==='files') form.querySelector('.source_input_files').style.display = 'block';
}

function setInputMetaData(input) {
        let ds = new DataSeter(input.value, input.form.count_input ? 'study' : 'use');
        input.form.querySelector('.source_input_files_meta').innerHTML = 'Количество примеров: '+ds.length +'<br>Количество нейронов в последнем слое: '+ds.count_output;
        if(input.form.count_input) input.form.count_input.value = ds.count_input;
}


function loadExample(name) {
    if (name === 'load') return;

    let url = 'examples/' + name + '.json';
    let req = new XMLHttpRequest();
    req.open('GET', url, false);

    req.send(null);

    let form = document.getElementById('form_study');
    setOptsToForm(form, JSON.parse(req.responseText));
    form.load_example.value = 'load';
}