"use strict";

/**
 * @class Lictor.Ster
 *
 * @property {Number} id
 * @property {String} title 
 * @property {Lictor.Ajax} ajax
 * @property {jQuery} container
 * @property {jQuery} node
 * @property {Number} posX
 * @property {jsPlumb} plumb
 * @property {Lictor.Block{id}} blocks
 * @property {Boolean} drawed
 * @property {Object} trace
 */
Lictor.Step = go.Class({

    'HTML_PATTERN': "<div class='lictor-step'><div class='title'>{{ title }}</div><div class='content loading'></div></div>",

    /**
     * @param {String} title
     */
    '__construct': (function (id, title, ajax) {
        this.id    = id;
        this.title = title;
        this.ajax  = ajax;
        this.plumb = jsPlumb.getInstance();
        this.blocks = {};
        this.drawed = false;
        this.createNode();
    }),
    
    'createNode': (function () {
        this.node = $(this.HTML_PATTERN.replace("{{ title }}", this.title));
        this.pos(0);
    }),
    
    'setTitle': (function (title) {
        this.title = title;
        this.node.find(".title").text(title);
    }),    
  
    'pos': (function (x) {
        this.posX = x;
        this.node.css("left", x + "px");
    }),
    
    'shift': (function (d) {
        this.pos(this.posX + d);
    }),
    
    'createBlock': (function (params, position) {
        var block = new Lictor.Block(params, position, this.container, this.plumb);
        this.blocks[block.id] = block;        
    }),
    
    'connectBlocks': (function () {        
        var id, 
            block, 
            parent;
        for (id in this.blocks) {
            block = this.blocks[id];
            parent = this.blocks[block.getParentId()];
            if (parent) {
                parent.appendChild(block);
            }
        }
    }),
    
    'onVisible': (function () {
        if (this.drawed) {
            return;
        }
        this.drawed = true;
        this.ajax.requestGet(this.id, this.onSuccessGet);
    }),
    
    'onSuccessGet': (function (result) {
        if (result && result[this.id].json) {
            this.trace = result[this.id].json;
            this.draw();
        }
    }),
    
    'draw': (function () {
        this.container = this.node.find(".content");
        this.container.removeClass("loading");
        this.createAllBlocks();
        this.positionAllBLocks();
        this.connectAllBlocks();
    }),
    
    'createAllBlocks': (function () {
        var trace = this.trace,
            len = trace.length,
            i;
        for (i = 0; i < len; i += 1) {
            this.createBlock(trace[i]);
        }
    }),
    
    'positionAllBLocks': (function () {
    }),
    
    'connectAllBlocks': (function () {
    }),
    
    'eoc': null
});
