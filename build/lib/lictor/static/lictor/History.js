"use strict";

/**
 * @class Lictor.History
 *
 * @event Lictor.History.click
 */
Lictor.History = go.Class([go.Ext.Nodes, go.Ext.Events], {

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
        var html = '<li style="text-align: center; "><a href="javascript:void(0)">' + moment(title).fromNow() + '</a></li>',
            item = $(html),
            handler = this.onClickItem;    
        this.nodes.list.prepend(item);
        item.find("a").click(function () {
            handler(id);
        });
    }),
    
    'onClickItem': (function (id) {
        this.fireEvent("click", id);
    }),

    'eoc': null
});
