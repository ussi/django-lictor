"use strict";

/**
 * @class Lictor.History
 */
Lictor.History = go.Class([go.Ext.Nodes], {

    'nodes': {
        'list': "ul#history-step"
    },

    '__construct': (function (node) {
        this.initNodes(node);
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),
    
    'append': (function (id, title) {
        var html = '<li><a href="javascript:void(0) data-id="' + id + '">' + title + '</a></li>',
            item = $(html);
        this.nodes.list.prepend(item);
        item.click(this.onClickItem);
    }),
    
    'onClickItem': (function (e) {
console.log(e);
    }),

    'eoc': null
});
