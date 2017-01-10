var Dragons = Dragons || {};

(function(exports) {

    var Class = exports.Class;
    var Utils = exports.Utils;
    var BaseElement = exports.BaseElement;
    var Composite = exports.Composite;
    var DisplayNode = exports.DisplayNode;
    var BoneFrame = exports.BoneFrame;

    // TODO
    var Mesh = GT.Class.create({
        superclass: DisplayNode,

        type: "mesh",

        // 子骨架指向的骨架名、网格包含的贴图名 (可选属性 默认: null, 仅对子骨架、网格有效)
        path: "path",

        // 共享网格的索引 (可选属性 默认: null, 仅对网格有效)
        "share": "meshName",

        // 是否继承动画 (可选属性 默认: true, 仅对共享网格有效)
        "inheritFFD": true,

        // 顶点相对显示对象轴点的坐标列表 (可选属性 默认: null, 仅对网格或自定义多边形边界框有效)
        // [x0, y0, x1, y1, ...]
        vertices: [-64.00, -64.00, 64.00, -64.00, 64.00, 64.00, -64.00, 64.00],

        // 顶点的 UV 坐标列表 (可选属性 默认: null, 仅对网格有效)
        // [u0, v0, u1, v1, ...]
        uvs: [0.0000, 0.0000, 1.0000, 0.0000, 1.0000, 1.0000, 0.0000, 1.0000],

        // 三角形顶点索引列表 (可选属性 默认: null, 仅对网格有效)
        triangles: [0, 1, 2, 2, 3, 0],

        // 顶点权重列表 (可选属性 默认: null, 仅对网格有效)
        // [骨骼数量, 骨骼索引, 权重, ..., ...]
        weights: [1, 0, 1.00, 2, 0, 0.50, 1, 0.50],

        // 蒙皮插槽注册的矩阵变换 (可选属性 默认: null, 仅对网格有效)
        // [a, b, c, d, tx, ty]
        "slotPose": [1.0000, 0.0000, 0.0000, 1.0000, 0.00, 0.00],

        // 蒙皮骨骼注册的矩阵变换 (可选属性 默认: null, 仅对网格有效)
        // [骨骼索引, a, b, c, d, tx, ty, ...]
        "bonePose": [0, 1.0000, 0.0000, 0.0000, 1.0000, 0.00, 0.00]
    });

    exports.Mesh = Mesh;

}(Dragons));
