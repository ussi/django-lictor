"use strict";

/**
 * @class Lictor.Ster
 *
 * @property {Number} num
 * @property {String} title 
 * @property {jQuery} node
 * @property {Number} posX
 * @property {jsPlumb} plumb
 * @property {Lictor.Block{id}} blocks
 */
Lictor.Step = go.Class({

    'HTML_PATTERN': "<div class='lictor-step'><div class='title'>{{ title }}</div><div class='content'></div></div>",

    /**
     * @param {String} title
     */
    '__construct': (function (num, title) {
        this.num   = num;
        this.title = title;
        this.plumb = jsPlumb.getInstance();
        this.blocks = {};
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
    
    'draw': (function (data) {
        
    }),
    
    'pos': (function (x) {
        this.posX = x;
        this.node.css("left", x + "px");
    }),
    
    'shift': (function (d) {
        this.pos(this.posX + d);
    }),
    
    'createBlock': (function (params) {
        var block = new Lictor.Block(params, position, this.node, this.plumb);
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
    
    'eoc': null
});
