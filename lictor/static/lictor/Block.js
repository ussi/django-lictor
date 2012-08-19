"use strict";

/**
 * @class Lictor.Block
 *
 * @param jQuery node
 * @param hash params
 * @param hash{width,height} size
 * @param hash{x,y} position
 * @param jQuery container
 * @param jsPlumb plumb
 */
Lictor.Block = go.Class({

    '__construct': (function (params, position, container, plumb) {
        this.params = params;
        if (position) {
            this.pos(position);
        } else {
            this.pos({'x': 0, 'y': 0});
        }
        this.container = container;
        this.plumb = plumb;
        this.createNode();
    }),
    
    'getId': (function () {
        return this.params.id;
    }),
    
    'getParentId': (function () {
        return this.params.pid;
    }),
    
    'getSize': (function () {
        if (!this.size) {
            this.size = {
                'width'  : this.node.width(),
                'height' : this.node.height()
            };
        }
        return this.size;
    }),
    
    'connect': (function (child) {
    }),
    
    'appendChild': (function (child) {
        this.connect(child);
    }),
    
    'pos': (function (position) {
        this.position = position;
        this.node.css("left", position.x + "px");
        this.node.css("top", position.y + "px");        
    }),
    
    'createNode': (function () {
        this.node = $('<div class="lictor-block"></div>');
        this.container.append(this.node);
    }),
    
    'eoc': null
});
