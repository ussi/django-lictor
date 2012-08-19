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
        var nums = result['new'],
            len = nums.length,
            i,
            num,
            step;
        for (i = 0; i < len; i += 1) {
            num = nums[i];
            if (!this.steps[num]) {
                this.appendStep(num, "loading ...");
                if (num > this.lastId) {
                    this.lastId = num;
                }
            }
        }
        if (result.json) {
            step = this.steps[result.json.id];
            if (step) {
                step.setTitle(result.json.created);
                step.draw(result.json.json);
            }
        }
    }),

    'eoc': null
});
