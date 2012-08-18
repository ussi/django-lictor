"use strict";

/**
 * @class Lictor
 *
 * @static {Lictor} instance
 * @property {Lictor.Session} session
 * @property {Lictor.Workspace} workspace
 */
var Lictor = go.Class(go.Ext.Nodes, {

    '__static': {
    
        'classes': [
            "Session",
            "Workspace",
            "Step"
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
            document.write(html.join(""));
        }),    
    
        'getInstance': (function () {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        })
    },
    
    'nodes': {
        'session_toggle' : "#session-toggle",
        'workspace'      : "#workspace"
    },
    
    '__construct': (function () {
        this.initNodes($("body"));
    }),
    
    '__destruct': (function () {
        this.doneNodes();
        this.session.destroy();
        this.workspace.destroy();
    }),
    
    'run': (function (registry) {
        this.registry = registry;
        this.session = new Lictor.Session(this.nodes.session_toggle, registry.session_cookie_name);
        this.workspace = new Lictor.Workspace(this.nodes.workspace);       
    }),

    'eoc': null
});

Lictor.loadClasses();
