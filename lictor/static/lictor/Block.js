"use strict";

/**
 * @class Lictor.Block
 *
 * @param {jQuery} node
 * @param {hash} params
 * @param {hash{width,height}} size
 * @param {hash{x,y}} position
 * @param {Number} width
 * @param {Number} height   
 * @param {Number} lineHeight
 * @param {jQuery} container
 * @param {jsPlumb} plumb
 * @param {Lictor.Block[]} childs
 */
Lictor.Block = go.Class({

    'MARGIN_X': 25,
    'MARGIN_Y': 25,

    'ENDPOINT_PARAMS': {
        'anchor': "Continuous", 
        'paintStyle': {
            'fillStyle': "#999999", 
            'radius'   : 2
        }
    },

    '__construct': (function (params, position, container, plumb) {
        this.params = params;
        this.container = container;
        this.plumb = plumb;
        this.createNode();
        if (position) {
            this.pos(position);
        } else {
            this.pos({'x': 0, 'y': 0});
        }
        this.childs = [];
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
    
    'appendChild': (function (child) {
        this.childs.push(child);
    }),    
    
    'connectAllChilds': (function () {
        var childs = this.childs,
            len = childs.length,
            i;
        for (i = 0; i < len; i += 1) {
            this.connectChild(childs[i]);
            childs[i].connectAllChilds();
        }    
    }),
    
    'connectChild': (function (child) {
        var plumb = this.plumb,
            source = this.plumb.addEndpoint(this.node, this.ENDPOINT_PARAMS),
            target = this.plumb.addEndpoint(child.node, this.ENDPOINT_PARAMS);
        plumb.connect({
            'source': source,
            'target': target,
           	'overlays': [
                ["Arrow", {'location': 1, 'width': 5 }],                    
        	],
        	'paintStyle': {'strokeStyle':"#999999", 'lineWidth': 1}
        });
    }),    
    
    'pos': (function (position) {
        this.position = position;
        this.node.css("left", position.x + "px");
        this.node.css("top", position.y + "px");        
    }),
    
    'createNode': (function () {
        var type = this.params.type.toLowerCase();
        this.node = $('<div class="lictor-block ' + type + '">' + this.params.name + '<br />' + this.params.module + '</div>');
        this.container.append(this.node);
        this.width  = this.node.width();
        this.height = this.node.height();
        this.plumb.draggable(this.node, {'containment': this.container});
    }),
    
    'positionLine': (function (position) {
        var childs = this.childs,
            child,
            len = childs.length,
            i,
            npos;           
        this.pos(position);
        if (len == 0) {
            this.lineHeight = this.height;
            return;
        }        
        npos = {
            'x': this.position.x + this.width + this.MARGIN_X,
            'y': this.position.y
        };
        for (i = 0; i < len; i += 1) {
            child = childs[i];
            child.positionLine(npos);
            npos.y += child.lineHeight + this.MARGIN_Y;           
        }
        this.lineHeight = npos.y - position.y;
    }),
    
    'eoc': null
});
