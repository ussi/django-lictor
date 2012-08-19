"use strict";

Lictor.Sidebar = go.Class([go.Ext.Nodes], {

    'nodes': {
        'apps': "input[name=app]"
    },

    '__construct': (function (node) {
        this.initNodes(node);
        this.loadApps();
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),
    
    'loadApps': (function () {
        var napps = this.nodes.apps,
            len = napps.length,
            i;
        for (i = 0; i < len; i += 1) {
            napps.eq(i).click(this.onAppClick);
        }
    }),
    
    'onAppClick': (function (e) {
        var napps = this.nodes.apps,
            len = napps.length,
            i,
            item,
            apps = [];
        for (i = 0; i < len; i += 1) {
            item = napps.eq(i);
            if (item[0].checked) {
                apps.push(item.val());
            }
        }
        console.log(apps);
    }),

    'eoc': null
});
