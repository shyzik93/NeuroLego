importScripts('neurolego/algebra.js');
importScripts('neurolego/opts.js');
importScripts('neurolego/use.js');
importScripts('neurolego/study.js');

importScripts('lib.js');

onmessage = function(e) {
    let opts = e.data[0];
    let type = e.data[1];

    if (opts.source_input === 'form') {

        opts.sets_using = new Sets_Array(opts.Xs, opts.sYs_ideal);

        opts.sets_study = new Sets_Array(opts.Xs, opts.sYs_ideal);

    } else if (opts.source_input === 'files') {
        let source_dir = opts.source_dir;

        opts.sets_using = new DataSeter(source_dir, type);
        if (opts.source_dir_is_length) opts.sets_using.length = opts.source_dir_length;

        opts.sets_study = new DataSeter(source_dir, type);
        if (opts.source_dir_is_length) opts.sets_study.length = opts.source_dir_length;

    }

    if (type === 'study') {

        let s = new Study();

        let t1 = (new Date()).getMilliseconds();
        let is_studied = s.study(opts);
        let t2 = (new Date()).getMilliseconds();
        postMessage(['msg', 'Прошло секунд: '+ ((t1-t2)/1000)+'\n']);

        if (is_studied) { postMessage(['msg', 'Обучение завершено']); }
        else { postMessage(['msg', 'Обучение не закончилось']); }

        postMessage(['result', {
            W: opts.W
        }]);

    } else if (type === 'use') {

        let u = new Use();

        let t1 = (new Date()).getMilliseconds();
        u.use(opts);
        let t2 = (new Date()).getMilliseconds();
        postMessage(['msg', 'Прошло секунд: '+ ((t1-t2)/1000)+'\n']);

    }

    close();
}