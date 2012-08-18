"use strict";

/**
 * @static Lictor instance
 * @property-read Lictor.Session session
 */
var Lictor = go.Class(go.Ext.Nodes, {

    '__static': {
    
        'classes': [
            "Session"
        ],
        
        'loadClasses': (function () {
            var dir = "/static/lictor", // @todo
                len = this.classes.length,
                i,
                src,
                html = [];
            for (i = 0; i < len; i += 1) {
                src = dir + "/" + this.classes[i] + ".js";
                html.push('<script src="' + src + '"></script>');
            }
            document.write(html);
        }),    
    
        'getInstance': (function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        })
    },
    
    'nodes': {
        'session_toggle': "#session-toggle"
    },
    
    '__construct': (function (registry) {
        this.initNodes($("body"));
        this.registry = registry;
        this.session = new Lictor.Session(this.nodes.session_toggle, registry.session_cookie_name);
    }),
    
    '__destruct': (function () {
        this.doneNodes();
        this.session.destroy();
    }),
    
    'run': (function () {
    }),

    'eoc': null
});

Lictor.loadClasses();
