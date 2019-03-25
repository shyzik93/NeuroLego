/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

/* y_examples - for studing only */
function Sets_Array(x_examples, y_examples) {

    let self = this;

    this._x_examples = x_examples;
    this._y_examples = y_examples;
    this.length = this._x_examples.length;

    this.get_x_example = function(ix) {
        return self._x_examples[ix].slice(0);
    }

    this.get_y_example = function(iy) {
        if (self._y_examples !== undefined) return self._y_examples[iy];
    }
}

function DataSeter(source_dir, type) {

    self = this;
    this.sub_dataset = null;
    this.pair = null;
    this.fname = null;

    this.length = null;
    this.sub_length = null;
    this.count_input = null; // для генератора весов
    this.count_output = null;
    this.source_dir = 'dataset/'+source_dir+'/'+type+'/'; // type='study' or 'use'
 
    /*this.import_datasets2 = function(name) {
        let script = document.getElementById('NL_dataset_el');
        if (script) script.remove();

        script = document.createElement('script');
        script.id = 'NL_dataset_el';
        script.async = true;
        script.src = 'dataset/'+name;
        document.body.insertBefore(script, null);
    }*/

    this.load_data = function(name, func, is_async) {
        let url = this.source_dir  + name + '.json';
        let req = new XMLHttpRequest();
        req.open('GET', url, is_async);

        if (is_async) {req.onreadystatechange = function(req) {func(req, this);};}

        req.send(null);

        if (!is_async) {func(req, this);}
    }

    this.get_dataset = function(index) {
        let i = index % this.sub_length; // индекс в поднаборе
        let fname = (index  -  i) + this.sub_length; // имя файла

        if (this.sub_dataset === null | this.fname !== fname) {
            this.fname = fname;
            this.load_data(fname, function(req, self) {
                self.sub_dataset = JSON.parse(req.responseText);
            }, false);
        }
        this.pair = this.sub_dataset[i];
    }

    this.get_x_example = function(ix) {
        this.get_dataset(ix);
        return this.pair[1].slice();
    }

    this.get_y_example = function(iy) {
        this.get_dataset(iy);
        return this.pair[0];
    } 

    // вызов функции при инициализации класса
    this.load_data('meta', function(req, self) {
        let data = JSON.parse(req.responseText);
        self.length = data.count_total;
        self.sub_length = data.count_in_file;
        self.count_input = data.count_input;
        self.count_output = data.count_output;
    }, false);

}