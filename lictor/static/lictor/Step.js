"use strict";

/**
 * @class Lictor.Ster
 *
 * @property {Number} num
 * @property {String} title 
 * @property {jQuery} node
 * @property {Number} posX
 */
Lictor.Step = go.Class({

    'HTML_PATTERN': "<div class='lictor-step'><div class='title'>{{ title }}</div><div class='content'></div></div>",

    /**
     * @param {String} title
     */
    '__construct': (function (num, title) {
        this.num   = num;
        this.title = title;
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
    
    'eoc': null
});
