function DataSeter() {

    self = this;
    this.sub_dataset = null;
    this.pair = null;
    this.f = null;
    

    this.length = 100;

    // входов: 784

    /*this.import_datasets2 = function(name) {
        let script = document.getElementById('NL_dataset_el');
        if (script) script.remove();

        script = document.createElement('script');
        script.id = 'NL_dataset_el';
        script.async = true;
        script.src = 'dataset/'+name;
        document.body.insertBefore(script, null);
    }*/

    this.import_dataset = function(name) {
        let url = 'dataset/'+name+'.json';
        var req = new XMLHttpRequest();
        req.open('get', url, false);
        req.send();
        self.sub_dataset = JSON.parse(req.responseText);
    }

    this.get_dataset = function(index) {
        let i = index % 50; // индекс в поднаборе
        let f = (index  -  i) + 50; // имя файла
        let fname = 'mnist/dataset/'+f;

        if (self.sub_dataset === null | self.f !== f) {
            self.f = f;
            self.import_dataset(fname);
        }
        self.pair = self.sub_dataset[i];
    }

    this.get_x_example = function(ix) {
        self.get_dataset(ix);
        return self.pair[1];
    }

    this.get_y_example = function(iy) {
        self.get_dataset(iy);
        return self.pair[0];
    } 

}