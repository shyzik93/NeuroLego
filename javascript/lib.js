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

function DataSeter(source_dir) {

    self = this;
    this.sub_dataset = null;
    this.pair = null;
    this.fname = null;

    this.length = null;
    this.sub_length = null;
    this.count_input = null; // для генератора весов
    this.count_output = null;
    this.source_dir = 'dataset/' + source_dir + '/';

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
        let url = self.source_dir  + name + '.json';
        let req = new XMLHttpRequest();
        req.open('get', url, is_async);
        req.send();
        if (is_async) {req.onreadystatechange = func;}
        else {func(req, self);}
    }

    this.get_dataset = function(index) {
        let i = index % self.sub_length; // индекс в поднаборе
        let fname = (index  -  i) + self.sub_length; // имя файла

        if (self.sub_dataset === null | self.fname !== fname) {
            self.fname = fname;
            self.load_data(fname, function(req, self) {
                self.sub_dataset = JSON.parse(req.responseText);
            }, false);
        }
        self.pair = self.sub_dataset[i];
    }

    this.get_x_example = function(ix) {
        self.get_dataset(ix);
        return self.pair[1].slice();
    }

    this.get_y_example = function(iy) {
        self.get_dataset(iy);
        return self.pair[0];
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