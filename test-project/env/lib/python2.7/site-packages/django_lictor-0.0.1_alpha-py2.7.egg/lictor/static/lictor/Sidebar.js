"use strict";

/**
 * @class Lictor.Sidebar
 * 
 * @event Lictor.Sidebar.change
 */
Lictor.Sidebar = go.Class([go.Ext.Nodes, go.Ext.Events], {

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
        this.fireEvent("change", apps);
    }),
    
    'setAppsList': (function (apps) {
        var hash = {},
            len  = apps.length,
            i,
            item,
            napps = this.nodes.apps,
            name;                      
        for (i = 0; i < len; i += 1) {
            hash[apps[i]] = true;
        }       
        len = napps.length;
        for (i = 0; i < len; i += 1) {
            item = napps.eq(i);
            name = item.val(); 
            item[0].checked = hash[name] ? true : false;
        }
    }),

    'eoc': null
});
