"use strict";

/**
 * @class Lictor.Ajax
 *
 * @property {String} dir
 * @property {String} csrf
 */
Lictor.Ajax = go.Class({
    
    'ACTION_LAST' : "{{ lictor_dir }}last/",
    'ACTION_GET'  : "{{ lictor_dir }}get/",
    
    '__construct': (function (dir, csrf) {
        this.dir  = dir;
        this.csrf = csrf;
    }),
    
    'request': (function (action, data, success, error) {
        action = action.replace("{{ lictor_dir }}", this.dir);
        data.csrfmiddlewaretoken = this.csrf;
        jQuery.ajax({
            'url'      : action,
            'type'     : "POST",
            'data'     : data,
            'dataType' : "json",
            'success'  : success,
            'error'    : error
        });
    }),
    
    'requestLast': (function (sid, last, success) {
        var data = {
            'sid'  : sid,
            'last' : last
        };
        this.request(this.ACTION_LAST, data, success);
    }),
    
    'requestGet': (function (id, success) {
        var data = {
            'id': id
        };
        this.request(this.ACTION_GET, data, success);
    }),

    'eoc': null
});
