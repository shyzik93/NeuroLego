/*
    Author: Polyakov Konstantin
    Start date: 2019-03-10 05:30
*/

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