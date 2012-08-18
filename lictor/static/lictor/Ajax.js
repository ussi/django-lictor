"use strict";

/**
 * @class Ajax
 */
var Ajax = go.Class({
    
    'request': (function (action, data, success, error) {
        jQuery.ajax({
            'type'     : "POST",
            'data'     : data,
            'dataType' : "json",
            'success'  : success,            
            'error'    : error
        });
    }),

    'eoc': null
});
