"use strict";

/**
 * @class Lictor.Workspace
 *
 * @param {Lictor.Step[]} steps
 */
Lictor.Workspace = go.Class([go.Ext.Nodes], {

    '__construct': (function (node) {
        this.initNodes(node);
        this.steps = [];
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),
    
    /**
     * @param {String} title
     * @return {Lictor.Step}
     */
    'appendStep': (function (title) {
        var step = new Lictor.Step(title),
            width,
            len,
            i;
        this.node.prepend(step.node);
        this.steps.push(step);
        width = step.node.width();
        for (i = 0, len = this.steps.length - 1; i < len; i += 1) {
            this.steps[i].shift(width);
        }
        return step;
    }),

    'eoc': null
});
