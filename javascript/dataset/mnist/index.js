function DataSeter() {

    self = this;
    this.NL_dataset = null;

    this.length = 4;

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
        self.NL_dataset = JSON.parse(req.responseText);
    }

    this.get_x_example = function(ix) {
        self.import_dataset('mnist/dataset/'+ix);
        return self.NL_dataset[0][0];
    }
    this.get_y_example = function(iy) {
        self.import_dataset('mnist/dataset/'+iy);
        return [self.NL_dataset[0][1]];
    } 

}