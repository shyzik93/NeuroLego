/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

/* операции над векторами */
function Vector(func_write_log) {

    let self = this;

    this.check_size = function(v1, v2) {
        if (v1.length !== v2.length) {
            postMessage(['alert', 'Векторы '+JSON.stringify(v1)+'  и '+JSON.stringify(v2)+' имеют разную размерность! ('+v1.length+' и '+v2.length+')']);
            close();
        }
    }

    /* сравнение векторов */
    this.IsEq = function(v1, v2) {
        self.check_size(v1, v2);
        for (let i=0; i < v1.length; i++) {
            if (v1[i] !== v2[i]) return 0;
        }
        return 1;
    }

    /* сложение векторов ( v1 + v2 ) */
    this.Sum = function(v1, v2, offset=0) {
        self.check_size(v1, v2);
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] + v2[i];
    }

    /* вычитание векторов ( v1 - v2 ) */
    this.Diff = function(v1, v2, offset=0) {
        self.check_size(v1, v2);
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] - v2[i];
    }

    /* сложение вектора с числом ( v1 + c ) */
    this.SumConst = function(v1, c, offset=0) {
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] + c;
    }

    /* взятие длины вектора ( |v1| )*/
    this.GetLen = function(v1) {
        let sum = 0;
        for (let i=0; i < v1.length; i++) sum += Math.pow(v1[i], 2);
        return Math.sqrt(sum);
    }

    /* скалярное произведение вектора на число ( v1 * c )*/
    this.MultiplyScalConst = function(v1, c, offset=9) {
        let sum = 0;
        for (let i=0; i < v1.length-offset; i++) sum += v1[i] * c;
        return sum;
    }

    /* скалярное произведение векторов ( v1 * v2 )*/
    this.MultiplyScal = function(v1, v2) {
        self.check_size(v1, v2);
        let sum = 0;
        for (let i=0; i < v1.length; i++) sum += v1[i] * v2[i];
        return sum;
    }

    /* векторное произведение векторов ( v2 x v2 )*/
    this.MultiplyVect = function(v1, v2, offset=0) {
        self.check_size(v1, v2);
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] * v2[i];
    }

    /* векторное умножение вектора на число ( v1 * c )*/
    this.MultiplyVectConst = function(v1, c, offset=0) {
        for (let i=0; i < v1.length-offset; i++) v1[i] = v1[i] * c;
    }

    /* векторное умножение вектора на функцию ( v1 * f )*/
    this.MultiplyVectFunc = function(v1, f, offset=0) {
        for (let i=0; i < v1.length-offset; i++) v1[i] = f(v1[i]);
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
            else if (content === 'random0') _content = Math.round(Math.random() * 10);
            else if (content === 'random1') _content = Math.random();
            v.push(_content);
        }
        self.SumConst(v, -0.5);
        return v;
      }

    this.write = function(v1) {

        for (let i=0; i < v1.length; i++) {
            postMessage(['msg', v1[i]]);
            postMessage(['msg', ' ']);
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
            postMessage(['alert', 'Матрицы имеют разную размерность!']);
            close();
        }
    }

   /* сложение матриц (m1 + m2) */
    this.Sum = function(m1, m2) {
        this.check_size(m1, m2);
        this.v.Sum(m1, m2, this.offset);
    }

   /* сложение матрицы с константой (m1 + c) */
    this.SumConst = function(m1, c) {
        this.v.SumConst(m1, c, this.offset);
    }

    /* вычитание матриц (m1 - m2) */
    this.Diff = function(m1, m2) {
        this.check_size(m1, m2);
        this.v.Diff(m1, m2, this.offset);
    }

    /* умножение матрицы на константу ( m1 * c )*/
    this.MultiplyConst = function(m1, c) {
        this.v.MultiplyVectConst(m1, c, this.offset);
    }
    /* умножение матрицы на функцию ( m1 * f )*/
    this.MultiplyFunc = function(m1, f) {
        this.v.MultiplyVectFunc(m1, f, this.offset);
    }

   /* сложение матрицы с вектором построчно (m1 + v) */
    this.SumVect = function(m1, v) {
        for (let j=0; j<this.countRows(m1); j++) {
              let start = this.countCols(m1) * j;
              let end = start + this.countCols(m1);
              for (let i=start; i < end; i++) m1[i] += v[i-start];
        }
    }

   /* вычитание из матрицы вектора построчно (m1 - v) */
    this.DiffVect = function(m1, v) {
        for (let j=0; j<this.countRows(m1); j++) {
              let start = this.countCols(m1) * j;
              let end = start + this.countCols(m1);
              for (let i=start; i < end; i++) m1[i] -= v[i-start];
        }
    }

    /* переумножение элементов матриц ( m1 * m2 ) */
    this.MultiplySimple = function(m1, m2) {
        this.check_size(m1, m2);
        this.v.MultiplyVect(m1, m2, this.offset);
    }

    /* умножение матриц ( m1 @ m2 ) */
    this.Multiply = function(m1, m2) {
        // check size
        if (this.countCols(m1) !== this.countRows(m2)) {
            postMessage(['alert', 'Число столбцов первой матрицы не равно числу рядов второй! ('+JSON.stringify([[this.countCols(m1), this.countRows(m1)], [this.countCols(m2), this.countRows(m2)]])+' )']);
            close();
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
                postMessage(['alert', j+','+i+' '+tmp]);
                this.setCell(m1, j, i, this.getCell(m1, i, j));
                this.setCell(m1, i, j, tmp);
            }
        }
        tmp = this.countRows(m1);
        this.setCountRows(m1, this.countCols(m1));
        this.setCountCols(m1, tmp);
    }

   /* транспонирование матрицы ( (m1)T ) */
    this.T = function(m1) {
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

    this.createFromVect = function(vector, copy) {
        let v;
        if (copy) v = vector.slice();
        else v = vector;

        this.pushMetaInfo(v);
        this.setCountCols(v, vector.length);
        this.setCountRows(v, 1);
        return v;
    }

    this.write = function(m1) {
        let ceil;
        for (let i=0; i < this.countRows(m1); i++) {
            for (let j=0; j < this.countCols(m1); j++) {
                ceil = this.getCell(m1, j, i);
                postMessage(['msg', ceil]);
                postMessage(['msg', ' ']);
            }
            postMessage(['msg', '\n']);
        }
    }
}


/* Искусственные нейроны */
function Neuron(v, m) {

    let self = this;

    self.v = v;//new Vector();
    self.m = m;//new Matrix();

    /* сумматорная функция */
    this.sum = function(x1, w1, b) {
        if(b !== undefined) x1.push(b);
        return self.v.MultiplyScal(x1, w1);
    }

    /* Перцептрон
    * x - вектор входных активаций
    * w - вектор весов
    */
    this.Perceptron = function(y1, derive) {
        //if (derive) y1;
        if (y1 > 0) {return 1;} else {return 0;} // активационная ф-ция
    }

    /* Линейный нейрон */
    this.Linear = function(y1) {
        return y1; // активационная ф-ция
    }

    /* Нейрон - сигмоид (логистическая функция) */
    this.Sigma = function(y1, derive) {
        if (derive) return y1 * (1-y1);
        return 1 / (1 + Math.pow(Math.E, -y1)); // активационная ф-ция
    }

    /* Нейрон - сигмоид (гиперболический тангенс) */
    this.Tanh = function(y1, derive) {
        if (derive) return 1 - y1*y1;
        return Math.tanh(y1); // активационная ф-ция
        //return (Math.pow(Math.E, y1) - Math.pow(Math.E, -y1)) / (Math.pow(Math.E, y1) + Math.pow(Math.E, -y1)); // активационная ф-ция
    }

    /* Нейрон - улучшенная линейная функция (rectified linear unit*/
    this.ReLU = function(y1) {
        return Math.max(y1, 0); // активационная ф-ция
    }

    /* Нейрон - softplus */
    this.Softplus = function(y1) {
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
    'tanh': this.n.Tanh,
    'relu': this.n.ReLU,
    'softplus': this.n.Softplus
    };

    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}