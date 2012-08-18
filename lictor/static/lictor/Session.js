"use strict";

/**
 * @class Lictor.Session
 *
 * @property {String} id
 *
 * @event start
 * @event stop
 */
Lictor.Session = go.Class([go.Ext.Nodes, go.Ext.Events], {

    'COOKIE_NAME': "lictor_session",

    'nodes': {
        'start' : {
            'selector': "#session-start",
            'events': {
                'click': "onClickStart"
            }
        },
        'stop' : {
            'selector': "#session-stop",
            'events': {
                'click': "onClickStop"
            }
        }
    },

    '__construct': (function (node, cookieName) {
        this.initNodes(node);
        this.COOKIE_NAME = cookieName || this.COOKIE_NAME;
        this.id = $.cookie(this.COOKIE_NAME);
        if (this.id) {
            this.toggleStart();
        } else {
            this.toggleStop();
        }
    }),
    
    '__destruct': (function () {
        this.doneNodes();
    }),
    
    'inProcess': (function () {
        return this.id ? true : false;
    }),

    'toggleStart': (function () {
        this.nodes.start.hide();
        this.nodes.stop.show();
    }),
    
    'toggleStop': (function () {
        this.nodes.start.show();
        this.nodes.stop.hide();    
    }),
    
    'start': (function () {
        if (this.id) {
            return;
        }
        this.id = this.createId();
        $.cookie(this.COOKIE_NAME, this.id, {'path': "/"});
        this.toggleStart();
        this.fireEvent("start", this.id);
    }),
    
    'stop': (function () {
        var id = this.id;
        if (!id) {
            return;
        }
        $.removeCookie(this.COOKIE_NAME, {'path': "/"});
        this.id = null;
        this.toggleStop();
        this.fireEvent("stop", id);
    }),
    
    'onClickStart': (function (e) {
        this.start();
    }),
    
    'onClickStop': (function (e) {
        this.stop();
    }),    
    
    'createId': (function () {
        return (new Date()).getTime();
    }),

    'eoc': null
});
