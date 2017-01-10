/*
 a c tx
 b d ty
 0 0 1
 */
function Matrix(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
}

Matrix.prototype = {

    clone: function() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },

    /**
     * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
     * @param {Matrix} mtx 要连接到源矩阵的矩阵。
     * @returns {Matrix} 一个Matrix对象。
     */
    concat: function(mtx) {
        if (!mtx) {
            return this;
        }
        var args = arguments,
            a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            tx = this.tx,
            ty = this.ty;

        if (args.length >= 6) {
            var ma = args[0],
                mb = args[1],
                mc = args[2],
                md = args[3],
                mx = args[4],
                my = args[5];
        } else {
            ma = mtx.a;
            mb = mtx.b;
            mc = mtx.c;
            md = mtx.d;
            mx = mtx.tx;
            my = mtx.ty;
        }

        this.a = a * ma + b * mc;
        this.b = a * mb + b * md;
        this.c = c * ma + d * mc;
        this.d = c * mb + d * md;
        this.tx = tx * ma + ty * mc + mx;
        this.ty = tx * mb + ty * md + my;
        return this;
    },

    /**
     * 对 Matrix 对象应用旋转转换。
     * @param {Number} angle 旋转的角度。
     * @returns {Matrix} 一个Matrix对象。
     *
     * cos   -sin  0     a c tx
     * sin    cos  0     b d ty
     * 0      0    1     0 0 1
     */
    rotate: function(angle) {
        // counter-clockwise
        var sin = Math.sin(angle),
            cos = Math.cos(angle),
            a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            tx = this.tx,
            ty = this.ty;

        this.a = a * cos - b * sin;
        this.b = a * sin + b * cos;
        this.c = c * cos - d * sin;
        this.d = c * sin + d * cos;
        this.tx = tx * cos - ty * sin;
        this.ty = tx * sin + ty * cos;
        return this;
    },

    /**
     * 对矩阵应用缩放转换。
     * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
     * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
     * @returns {Matrix} 一个Matrix对象。
     * sx   0   0     a c tx
     * 0    sy  0     b d ty
     * 0    0   1     0 0 1
     */
    scale: function(sx, sy) {
        this.a *= sx;
        this.d *= sy;
        this.c *= sx;
        this.b *= sy;
        this.tx *= sx;
        this.ty *= sy;
        return this;
    },

    /**
     * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
     * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位）。
     * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位）。
     * @returns {Matrix} 一个Matrix对象。
     *
     * 1  0  dx    a c tx
     * 0  1  dy    b d ty
     * 0  0  1     0 0 1
     */
    translate: function(dx, dy) {
        this.tx += dx;
        this.ty += dy;
        return this;
    },

    /**
     * 为每个矩阵属性设置一个值，该值将导致 null 转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
     * @returns {Matrix} 一个Matrix对象。
     */
    identity: function() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },

    /**
     * 执行原始矩阵的逆转换。您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
     * @returns {Matrix} 一个Matrix对象。
     */
    invert: function() {
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var tx = this.tx;
        var i = a * d - b * c;

        this.a = d / i;
        this.b = -b / i;
        this.c = -c / i;
        this.d = a / i;
        this.tx = (c * this.ty - d * tx) / i;
        this.ty = -(a * this.ty - b * tx) / i;
        return this;
    },

    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * @param {Object} point 想要获得其矩阵转换结果的点。
     * @param {Boolean} round 是否对点的坐标进行向上取整。
     * @param {Boolean} returnNew 是否返回一个新的点。
     * @returns {Object} 由应用矩阵转换所产生的点。
     *
     *  a c tx      x
     *  b d ty   *  y
     *  0 0 1       1
     */
    transformPoint: function(x, y) {
        var nx = x * this.a + y * this.c + this.tx,
            ny = x * this.b + y * this.d + this.ty;

        return [nx, ny];
    },
    transformPoly: function(vertices) {
        var poly = [];
        var Me = this;
        vertices.forEach(function(v) {
            var nx = v[0] * Me.a + v[1] * Me.c + Me.tx,
                ny = v[0] * Me.b + v[1] * Me.d + Me.ty;
            poly.push([nx, ny]);
        });
        return poly;
    },
    transformAABB: function(aabb) {
        var vertices = [
            [aabb[0], aabb[1]],
            [aabb[2], aabb[1]],
            [aabb[2], aabb[3]],
            [aabb[0], aabb[3]]
        ];
        return this.transformPoly(vertices);
    },
};
