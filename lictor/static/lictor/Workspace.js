"use strict";

/**
 * @class Lictor.Workspace
 *
 * @param {Lictor.Step{num}} steps
 * @param {Lictor.Ajax} ajax
 * @param {Lictor.History} history
 * @param {Number} lastId
 */
Lictor.Workspace = go.Class([go.Ext.Nodes], {

    '__construct': (function (node, ajax, history) {
        this.initNodes(node);
        this.ajax    = ajax;
        this.history = history;
        this.steps   = [];
        this.lastId  = 0;
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),
    
    /**
     * @param {String} title
     * @return {Lictor.Step}
     */
    'appendStep': (function (num, title) {
        var step = new Lictor.Step(num, title),
            width,
            k;
        this.node.prepend(step.node);
        width = step.node.width();
        for (k in this.steps) {
            this.steps[k].shift(width);
        }
        this.steps[num] = step;
        this.history.append(step.num, step.title);
        return step;
    }),
    
    'requestNewSteps': (function (sessionId) {
        this.ajax.requestLast(sessionId, this.lastId, this.onSuccessLast);
    }),
    
    'onSuccessLast': (function (result) {
        var items = result['new'],
            len = items.length,
            i,
            item;
        for (i = 0; i < len; i += 1) {
            item = items[i];
            if (!this.steps[item[0]]) {
                this.appendStep(item[0], item[1]);
                if (item[0] > this.lastId) {
                    this.lastId = item[0];
                }
            }
        }
    }),

    'eoc': null
});
