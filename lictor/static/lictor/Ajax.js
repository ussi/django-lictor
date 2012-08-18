"use strict";

/**
 * @class Ajax
 */
var Ajax = go.Class({
    
    'ACTION_LAST' : "{{ lictor_dir }}/last/",
    'ACTION_GET'  : "{{ lictor_dir }}/get/",
    
    '__construct': (function (dir) {
        this.dir = dir;
    }),
    
    'request': (function (action, data, success, error) {
        action = action.replace("{{ lictor_dir }}", dir);
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
        this.request(this.ACTION_LIST, data, success);
    }),

    'eoc': null
});
