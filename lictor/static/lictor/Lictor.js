"use strict";

var Lictor = go.Class({

    '__static': {
    
        'classes': [
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
    
    '__construct': (function () {
    }),
    
    '__destruct': (function () {
    }),
    
    'run': (function () {
    }),

    'eoc': null
});

Lictor.loadClasses();
