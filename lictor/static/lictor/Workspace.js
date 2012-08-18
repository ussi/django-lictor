"use strict";

/**
 * @class Lictor.Workspace
 *
 * @param {Lictor.Step[]} steps
 * @param {Lictor.Ajax} ajax
 * @param {Number} lastId
 */
Lictor.Workspace = go.Class([go.Ext.Nodes], {

    '__construct': (function (node, ajax) {
        this.initNodes(node);
        this.ajax   = ajax;
        this.steps  = [];
        this.lastId = 0;
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
    
    'requestNewSteps': (function (sessionId) {
        this.ajax.requestLast(sessionId, this.lastId, this.onSuccessLast);
    }),
    
    'onSuccessLast': (function (result) {
    }),

    'eoc': null
});
