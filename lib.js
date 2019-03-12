/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

/* операции над векторами */
function Vector(func_write_log) {

    /*if(func_write_log === undefined) {this.func_write_log = document.write;}
    else {this.func_write_log = func_write_log;}*/

    this.check_size = function(v1, v2) {
        if (v1.length !== v2.length) {
            alert('Векторы имеют разную размерность!');
            exit();
        }
    }

    /* умножение вектора на константу ( v1 * c )*/
    this.MultiplyConst = function(v1, c, offset) {
        if (offset === undefined) offset = 0;
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] * c;
    }

    /* сложение векторов ( v1 + v2 ) */
    this.Sum = function(v1, v2, offset) {
        if (offset === undefined) offset = 0;
        this.check_size(v1, v2);
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] + v2[i];
    }

    /* вычитание векторов ( v1 - v2 ) */
    this.Diff = function(v1, v2, offset) {
        if (offset === undefined) offset = 0;
        this.check_size(v1, v2);
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] - v2[i];
    }

    /* сложение вектора с числом ( v1 + c ) */
    this.SumConst = function(v1, c, offset) {
        if (offset === undefined) offset = 0;
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] + c;
    }

    /* взятие длины вектора ( |v1| )*/
    this.GetLen = function(v1) {
        let sum = 0;
        for (let i=0; i < v1.length; i++) sum += Math.pow(v1[i], 2);
        return Math.sqrt(sum);
    }

    /* скалярное произведение векторов ( v1 * v2 )*/
    this.MultiplyScal = function(v1, v2) {
        this.check_size(v1, v2);
        let sum = 0;
        for (let i=0; i < v1.length; i++) sum += v1[i] * v2[i];
        return sum;
    }

    /* векторное произведение векторов ( v2 x v2 )*/
    this.MultiplyVect = function(v1, v2) {
        this.check_size(v1, v2);
        for (let i=0; i < v1.length; i++) v1[i] = v1[i] * v2[i];
    }


    /* генерация вектора
     * n - размерность вектора, content - заполнитель
    */
    this.create = function(n, content, b) {
        let v = [];
        if (b !== undefined) v.push(b);

        let _content;
        for (let i=v.length; i < n; i++) {
            if (content === 'ones') _content = 1;
            else if (content === 'zeros') _content = 0;
            else if (content === 'random') _content = Math.round(Math.random() * 10);
            v.push(_content);
        }
        return v;
      }

    this.write = function(v1, func_write_log) {
        if(func_write_log === undefined) func_write_log = console.log;

        for (let i=0; i < v1.length; i++) {
            func_write_log(v1[i]);
            func_write_log(' ');
        }
    }
}

function _Matrix() {

    this.offset = 3;

    this.pushMetaInfo = function(m1) {
        m1.push(undefined); // число рядов
        m1.push(undefined); // число строк
        m1.push(0); // флаг транспонированности
    }

    this.setT = function(m1, t) {
        m1[m1.length-1] = t;
    }

    this.isT = function(m1) {
        return m1[m1.length-1];
    }

    this.countRows = function(m1) {
        return m1[m1.length-2];
    }
    this.countCols = function(m1) {
        return m1[m1.length-3];
    }

    this.setCountRows = function(m1, m) {
        m1[m1.length-2] = m;
    }
    this.setCountCols = function(m1, n) {
        m1[m1.length-3] = n;
    }

    /* извлечение элемента матрицы
        i - номер строки
        j - номер столбца
    */
    this.getCell = function(m1, j, i) {
        let cols;
        if (this.isT(m1)) {
            let tmp = j; j = i; i = tmp;
            //i = Math.abs(this.countRows(m1)-i);
            cols = this.countRows(m1);
        } else { cols = this.countCols(m1); }

        return m1[i * cols + j];
    }

    this.setCell = function(m1, j, i, cell) {
        let cols;
        if (this.isT(m1)) {
            let tmp = j; j = i; i = tmp;
            //i = Math.abs(this.countRows(m1)-i);
            cols = this.countRows(m1);
        } else { cols = this.countCols(m1); }

        m1[i * this.cols + j] = cell;
    }
}

/* операции над матрицами  */
function Matrix(v) {

    _Matrix.call(this);
    this.v = v;//new Vector();

    this.check_size = function(m1, m2) {
        if (this.countRows(m1) !== this.countRows(m2)
             || this.countCols(m1) !== this.countCols(m2)) {
            alert('Матрицы имеют разную размерность!');
            exit();
        }
    }

   /* сложение матриц (m1 + m2) */
    this.Sum = function(m1, m2) {
        this.check_size(m1, m2);
        this.v.Sum(m1, m2, this.offset);
    }

    /* вычитание матриц (m1 - m2) */
    this.Diff = function(m1, m2) {
        this.check_size(m1, m2);
        this.v.Diff(m1, m2, this.offset);
    }

    /* умножение матрицы на константу ( m1 * c )*/
    this.MultiplyConst = function(m1, c) {
        this.v.MultiplyConst(m1, c, this.offset);
    }

    /* умножение матриц ( m1 @ m2 ) */
    this.Multiply = function(m1, m2) {
        // check size
        if (this.countCols(m1) !== this.countRows(m2)) {
            alert('Число столбцов первой матрицы не равно числу рядов второй!!');
            exit();
        }

        let m3 = [];

        for (let i1=0; i1 < this.countRows(m1); i1++) {
            for (let j2=0; j2 < this.countCols(m2); j2++) {
                // скалярное произведение векторов (строки первой матрицы на столбец второй
                let sum = 0;
                for (let j1 = 0; j1 <  this.countCols(m1); j1++) {
                    let i2 = j1; // для ясности :)
                    sum += this.getCell(m1, j1, i1) * this.getCell(m2, j2, i2);
                    //document.write(this.getCell(m1, j1, i1) +' '+ this.getCell(m2, j2, i2)+'<br>');
                }
                //document.write('<br>------'+sum+'<br>');
                m3.push(sum);
            }
        }

        this.pushMetaInfo(m3);
        this.setCountCols(m3, this.countRows(m1));
        this.setCountRows(m3, this.countCols(m2));

        return m3;
    }

    /* транспонирование матрицы ( (m1)T ) */
    this.T1 = function(m1) {
        let tmp;
        for (let i=0; i < this.countRows(m1); i++) {
            for (let j=0; j < this.countCols(m1); j++) {
                tmp = this.getCell(m1, j, i);
                alert(j+','+i+' '+tmp);
                this.setCell(m1, j, i, this.getCell(m1, i, j));
                this.setCell(m1, i, j, tmp);
            }
        }
        tmp = this.countRows(m1);
        this.setCountRows(m1, this.countCols(m1));
        this.setCountCols(m1, tmp);
    }

   /* транспонирование матрицы ( (m1)T ) */
    this.T2 = function(m1) {
        let tmp = this.countRows(m1);
        this.setCountRows(m1, this.countCols(m1));
        this.setCountCols(m1, tmp);

        if (this.isT(m1)) this.setT(m1, 0);
        else this.setT(m1, 1);
    }

    /* Эта функция - следствие отсутствия вычислительной ассоциативности при умножении матриц. */
    this.findFastOrder = function(m1, m2, m3) {
        
    }

    /* генерация матрицы
      * n - число столбцов, m - число строк,
      * content - заполнитель
    */
    this.create = function(n, m, content) {
        let m1 = this.v.create(m*n, content);
        this.pushMetaInfo(m1);
        this.setCountCols(m1, n);
        this.setCountRows(m1, m);
        return m1;
    }

    this.write = function(m1) {
        let ceil;
        for (let i=0; i < this.countRows(m1); i++) {
            for (let j=0; j < this.countCols(m1); j++) {
                ceil = this.getCell(m1, j, i);
                document.write(ceil);
                document.write(' ');
            }
            document.write('<br>');
        }
    }
}


/* Искусственные нейроны */
function Neuron(v, m) {

    let self = this;

    self.v = v;//new Vector();
    self.m = m;//new Matrix();

    /* Перцептрон
    * x - вектор входных активаций
    * w - вектор весов
    */
    this.Perceptron = function(x1, w1, b) {
        //alert(JSON.stringify([x1, w1, b]));
        x1.push(b);
        let y1 = self.v.MultiplyScal(x1, w1); // сумматорная ф-ция
        if (y1 > 0) {return 1;} else {return 0;} // активационная ф-ция
    }

    /* Линейный нейрон */
    this.Linear = function(x1, w1, b) {
        x1.push(b);
        let y1 = self.v.MultiplyScal(x1, w1); // сумматорная ф-ция
        return y1; // активационная ф-ция
    }

    /* Нейрон - логистическая функция (сигмоидная) */
    this.Sigma = function(x1, w1, b) {
        x1.push(b);
        let y1 = self.v.MultiplyScal(x1, w1); // сумматорная ф-ция
        return 1 / (1 + Math.pow(Math.E, -y1)); // активационная ф-ция
    }

    /* Нейрон - гиперболический тангенс */
    this.Tanh = function(x1, w1, b) {
        x1.push(b);
        let y1 = self.v.MultiplyScal(x1, w1); // сумматорная ф-ция
        //return Math.tanh(y1); // активационная ф-ция
        return (Math.pow(Math.E, y1) - Math.pow(Math.E, -y1)) / (Math.pow(Math.E, y1) + Math.pow(Math.E, -y1)); // активационная ф-ция
    }

    /* Нейрон - улучшенная линейная функция (rectified linear unit*/
    this.ReLU = function(x1, w1, b) {
        x1.push(b);
        let y1 = self.v.MultiplyScal(x1, w1); // сумматорная ф-ция
        return Math.max(y1, 0); // активационная ф-ция
    }

    /* Нейрон - softplus */
    this.Softplus = function(x1, w1, b) {
        x1.push(b);
        let y1 = self.v.MultiplyScal(x1, w1); // сумматорная ф-ция
        return Math.log(1 + Math.pow(Math.E, y1)); // активационная ф-ция
    }
}

function Algebra() {
    this.v = new Vector();
    this.m = new Matrix(this.v);
    this.n = new Neuron(this.v, this.m);

    this.neurons = {
    'perceptron': this.n.Perceptron,
    'linear': this.n.Linear,
    'sigma': this.n.Sigma,
    'tahn': this.n.Tanh,
    'relu': this.n.ReLU,
    'softplus': this.n.Softplus
    };

}

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