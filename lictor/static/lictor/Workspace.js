"use strict";

Lictor.Workspace = go.Class([go.Ext.Nodes], {

    '__construct': (function (node) {
        this.initNodes(node);
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),

    'eoc': null
});
