"use strict";

/**
 * @class Lictor.Workspace
 *
 * @property {Lictor.Step{num}} steps
 * @property {Lictor.Step[]} listSteps
 * @property {Lictor.Ajax} ajax
 * @property {Lictor.History} history
 * @property {Number} lastId
 * @property {Number} pos
 * @property {Number} checkPosInterval
 * @property {Number} stepWidth
 * @property {Number} width
 */
Lictor.Workspace = go.Class([go.Ext.Nodes], {

    'CHECK_POS_PERIOD': 500,

    '__construct': (function (node, ajax, history) {
        this.initNodes(node);
        this.ajax    = ajax;
        this.history = history;
        this.steps   = {};
        this.listSteps = [];
        this.lastId  = 0;        
        this.checkPosInterval = setInterval(this.onCheckPos, this.CHECK_POS_PERIOD);
        this.pos = this.node.scrollLeft();
        this.width = this.node.width();     
        this.history.addEventListener("click", this.onClickHistory);
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),
    
    'appendStep': (function (id, title) {
        var step = new Lictor.Step(id, title, this.ajax),
            width,
            k;
        this.node.prepend(step.node);
        width = step.node.width();
        this.stepWidth = width;
        for (k in this.steps) {
            this.steps[k].shift(width);
        }
        this.steps[id] = step;
        this.listSteps.push(step);
        this.history.append(step.id, step.title);
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
        if (len) {
            this.checkPos(true);
        }
    }),
    
    'checkPos': (function (force) {
        var pos = this.node.scrollLeft(),
            begin,
            end,
            i,
            list = this.listSteps,
            len = list.length;
        if ((!force) && (pos == this.pos)) {
            return;
        }
        this.pos = pos;
        if (!this.stepWidth) {
            return;
        }
        end   = len - Math.floor(pos / this.stepWidth) - 1;
        begin = len - Math.floor((pos + this.width) / this.stepWidth) - 1;
        for (i = begin; i <= end; i += 1) {
            if (list[i]) {
                list[i].onVisible();
            }
        } 
    }),
    
    'onCheckPos': (function () {
        this.checkPos(false);
    }),
    
    'onClickHistory': (function (e) {
        var id = e.data,
            step = this.steps[id],
            pos;
        if (step) {
            pos = step.posX;
            this.node.scrollLeft(pos);
            this.checkPos();
        }         
    }),

    'eoc': null
});
