"use strict";

/**
 * @class Lictor
 *
 * @static {Lictor} instance
 * @property {Lictor.Session} session
 * @property {Lictor.Workspace} workspace
 * @property {Lictor.Ajax} ajax
 * @property {Lictor.History} history
 * @property {Lictor.Sidebar} sidebar
 * @property int stepRequestInterval
 */
var Lictor = go.Class(go.Ext.Nodes, {

    '__static': {
    
        'classes': [
            "Ajax",
            "Session",
            "Workspace",
            "Step",
            "Block",
            "History",
            "Sidebar"
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
        'workspace'      : "#workspace",
        'history'        : "#history",
        'sidebar'        : "#sidebar"
    },
    
    'STEP_REQUEST_PERIOD': 5000,
    
    '__construct': (function () {
        this.initNodes($("body"));
    }),
    
    '__destruct': (function () {
        this.doneNodes();
        this.session.destroy();
        this.workspace.destroy();
        this.ajax.destroy();
        this.sidebar.destroy();
    }),
    
    'run': (function (registry) {
        this.registry  = registry;        
        this.session   = new Lictor.Session(this.nodes.session_toggle, registry.session_cookie_name);
        this.ajax      = new Lictor.Ajax(registry.lictor_dir, registry.csrf);
        this.history   = new Lictor.History(this.nodes.history);
        this.workspace = new Lictor.Workspace(this.nodes.workspace, this.ajax, this.history);        
        this.sidebar   = new Lictor.Sidebar(this.nodes.sidebar);
        
        this.sidebar.addEventListener("change", this.onChangeApps);
        if (this.session.id) {
            this.sidebar.setAppsList(this.session.apps);
        }
                
        this.stepRequestInterval = setInterval(this.onStepInterval, this.STEP_REQUEST_PERIOD);
        this.onStepInterval();
    }),

    'onStepInterval': (function () {
        if (!this.session.id) {
            return;
        }
        this.workspace.requestNewSteps(this.session.id);
    }),
    
    'onChangeApps': (function (e) {
        var apps = e.data;
        this.session.setAppsList(apps);
    }),

    'eoc': null
});

Lictor.loadClasses();
