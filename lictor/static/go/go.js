/**
 * go.js: библиотека для упрощения некоторых вещей в JavaScript
 *
 * В данном файле определяется только ядро библиотеки и модуль go.Lang.
 * Остальные модули располагаются в других файлах.
 *
 * @package go.js
 * @author  Григорьев Олег aka vasa_c (http://blgo.ru/)
 * @version 1.0-beta
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 * @link    https://github.com/vasa-c/go-js
 */
/*jslint node: true, nomen: true */
/*global window */
"use strict";

var go = (function (global) {

    var VERSION = "1.0-beta",

        /**
         * http-адрес каталога в котором находится go.js и модули
         *
         * @var string
         */
        GO_DIR,

        doc = global.document,

        /**
         * Загрузчик модулей
         *
         * @var go.__Loader
         */
        loader;

    function go(name, reqs, fmodule) {
        if (name) {
            go.appendModule(name, reqs, fmodule);
        }
        return go;
    }
    go.VERSION = VERSION;

    /**
     * go.include(): инициирование загрузки нужных модулей
     * (только на этапе загрузки страницы)
     *
     * @namespace go
     *
     * @param {String[]} names
     *        имя нужного модуля или список из нескольких имён
     * @param {Function} [listener]
     *        обработчик загрузки всех указанных модулей
     */
    go.include = function (names, listener) {
        loader.include(names, listener);
    };

    /**
     * go.appendModule(): добавление модуля в пространство имён
     * (вызывается при определении модуля в соответствующем файле)
     *
     * @namespace go
     *
     * @param {String} name
     *        имя модуля
     * @param {Array} [reqs]
     * @param {Function} fmodule
     *        функция-конструктор модуля
     */
    go.appendModule = function (name, reqs, fmodule) {
        if (!fmodule) {
            fmodule = reqs;
            reqs = [];
        }
        loader.appendModule(name, reqs, fmodule);
    };

    go.__Loader = (function () {

        var LoaderPrototype, LoaderConstructor;

        LoaderPrototype = {

            '__construct': function (params) {
                var k;
                if (params) {
                    for (k in params) {
                        if (params.hasOwnProperty(k)) {
                            this[k] = params[k];
                        }
                    }
                }
                this.reqs      = {};
                this.loaded    = {};
                this.created   = {};
                this.listeners = {};
            },

            'include': function (names, listener) {
                var i, len, name;
                if (typeof names === "string") {
                    names = [names];
                }
                for (i = 0, len = names.length; i < len; i += 1) {
                    name = names[i];
                    if (!this.reqs[name]) {
                        this.reqs[name] = true;
                        this.requestModule(name);
                    }
                }
                if (listener) {
                    this.addListener(names, listener);
                }
            },

            'addListener': function (names, listener) {
                var L = {'l': 0, 'fn': listener},
                    name,
                    i,
                    len;
                for (i = 0, len = names.length; i < len; i += 1) {
                    name = names[i];
                    if (!this.created[name]) {
                        if (!this.listeners[name]) {
                            this.listeners[name] = [];
                        }
                        L.l += 1;
                        this.listeners[name].push(L);
                    }
                }
                if (L.l === 0) {
                    listener();
                }
            },

            'appendModule': function (name, reqs, fmodule) {
                var lreqs = [], i, len, _this = this, f;
                this.reqs[name] = true;
                if (!reqs) {
                    reqs = [];
                }
                for (i = 0, len = reqs.length; i < len; i += 1) {
                    if (!this.created[reqs[i]]) {
                        lreqs.push(reqs[i]);
                    }
                }
                f = function () {
                    _this.createModule(name, fmodule);
                    _this.onload(name);
                };
                if (lreqs.length > 0) {
                    this.include(lreqs, f);
                } else {
                    f();
                }
            },

            'requestModule': function (name) {
                var src = GO_DIR + name + ".js" + loader._anticache;
                doc.write('<script type="text/javascript" src="' + src + '"></script>');
            },

            'createModule': function (name, fmodule) {
                go[name] = fmodule(go, global);
            },

            'onload': function (name) {
                var listeners = this.listeners[name], i, len, listener;
                this.created[name] = true;
                if (!listeners) {
                    return;
                }
                for (i = 0, len = listeners.length; i < len; i += 1) {
                    listener = listeners[i];
                    listener.l -= 1;
                    if (listener.l <= 0) {
                        listener.fn.call(global);
                    }
                }
            }
        };
        LoaderConstructor = function () {
            this.__construct.apply(this, arguments);
        };
        LoaderConstructor.prototype = LoaderPrototype;

        return LoaderConstructor;
    }());
    loader = new go.__Loader();

    /**
     * Инициализация библиотеки
     * - вычисление каталога с go.js
     * - подключение модулей заданных в параметрах URL
     *
     * @todo оптимизировать и протестировать для различных вариантов URL
     */
    (function () {

        var SRC_PATTERN = new RegExp("^(.*\\/)?go\\.js(\\?[^#]*)?(#(.*?))?$"),
            matches;

        if (doc.currentScript) {
            matches = SRC_PATTERN.exec(doc.currentScript.getAttribute("src"));
        }
        if (!matches) {
            matches = (function () {
                var scripts = doc.getElementsByTagName("script"),
                    i,
                    src,
                    matches;
                for (i = scripts.length; i > 0; i -= 1) {
                    src = scripts[i - 1].getAttribute("src");
                    matches = SRC_PATTERN.exec(src);
                    if (matches) {
                        return matches;
                    }
                }
                return null;
            }());
        }
        if (!matches) {
            throw new Error("go.js is not found in DOM");
        }

        GO_DIR = matches[1];

        loader._anticache = matches[2] || "";

        if (matches[4]) {
            go.include(matches[4].split(","));
        }

    }());

    return go;
}(window));

/*jslint unparam: true */
/**
 * @namespace go
 * @subpackage Lang
 */
go("Lang", function (go, global) {
    /*jslint unparam: false */

    var Lang = {

        /**
         * Связывание функции с контекстом и аргументами
         * Поведение аналогично Function.prototype.bind()
         * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
         *
         * Если для функции определён свой метод bind(), то используется он
         *
         * @namespace go.Lang
         *
         * @param {Function} func
         *        функция
         * @param {Object} [thisArg=global]
         *        контекст в котором функция должна выполняться
         * @param {Array} [args]
         *        аргументы, вставляемые в начало вызова функции
         * @return {Function}
         *         связанная с контекстом функция
         */
        'bind': function (func, thisArg, args) {
            var result;
            thisArg = thisArg || global;
            if (func.bind) {
                if (args) {
                    args = [thisArg].concat(args);
                } else {
                    args = [thisArg];
                }
                result = func.bind.apply(func, args);
            } else if (args) {
                result = function () {
                    return func.apply(thisArg, args.concat(Array.prototype.slice.call(arguments, 0)));
                };
            } else {
                result = function () {
                    return func.apply(thisArg, arguments);
                };
            }
            return result;
        },

        /**
         * Получение расширенного типа значения
         *
         * @namespace go.Lang
         *
         * @param {mixed} value
         *        проверяемое значение
         * @return {String}
         *         название типа
         */
        'getType': function (value) {
            var type;

            if (value && (typeof value.go$type === "string")) {
                return value.go$type;
            }

            type = typeof value;
            if ((type !== "object") && (type !== "function")) {
                return type;
            }
            if (value === null) {
                return "null";
            }

            switch (Object.prototype.toString.call(value)) {
            case "[object Function]":
                return "function";
            case "[object Array]":
                return "array";
            case "[object RegExp]":
                return "regexp";
            case "[object Error]":
                return "error";
            case "[object Date]":
                return "date";
            case "[object HTMLCollection]":
            case "[object NodeList]":
                return "collection";
            case "[object Text]":
                return "textnode";
            case "[object Arguments]":
                return "arguments";
            case "[object Number]":
                return "number";
            case "[object String]":
                return "string";
            case "[object Boolean]":
                return "boolean";
            }

            if (value.constructor) {
                if (value instanceof Array) {
                    return "array";
                }
                if (window.HTMLElement) {
                    if (value instanceof window.HTMLElement) {
                        return "element";
                    }
                } else {
                    if (value.nodeType === 1) {
                        return "element";
                    }
                }
                if (window.Text && (value instanceof window.Text)) {
                    return "textnode";
                }
                if (window.HTMLCollection && (value instanceof window.HTMLCollection)) {
                    return "collection";
                }
                if (window.NodeList && (value instanceof window.NodeList)) {
                    return "collection";
                }
                if ((typeof value.length === "number") && (!value.slice)) {
                    return "arguments";
                }
            } else {
                if (value.nodeType === 1) {
                    return "element";
                }
                if (value.nodeType === 3) {
                    return "textnode";
                }
                if (typeof value.length === "number") {
                    return "collection";
                }
                /* Идентификация host-функции в старых IE (typeof === "object") по строковому представлению
                 * Также у них нет toString(), так что складываем со строкой.
                 * Сложение с пустой строкой не нравится JSLint
                 */
                if ((value + ":").indexOf("function") !== -1) {
                    return "function";
                }
            }

            return "object";
        },

        /**
         * Является ли значение массивом
         *
         * @namespace go.Lang
         *
         * @param {mixed} value
         *        проверяемое значение
         * @param {Boolean} [strict=false]
         *        точная проверка - именно массивом
         *        по умолчанию - любая коллекция с порядковым доступом
         * @return {Boolean}
         *         является ли значение массивом
         */
        'isArray': function (value, strict) {
            switch (Lang.getType(value)) {
            case "array":
                return true;
            case "collection":
            case "arguments":
                return (!strict);
            default:
                return false;
            }
        },

        /**
         * Является ли объект простым словарём.
         * То есть любым объектом, не имеющий более специфического типа.
         *
         * @namespace go.Lang
         *
         * @param {Object} value
         *        проверяемое значение
         * @return {Boolean}
         *         является ли значение простым словарём
         */
        'isDict': function (value) {
            return (value && (value.constructor === Object));
        },

        /**
         * Обход элементов объекта
         *
         * @namespace go.Lang
         *
         * @param {Object|Array} iter
         *        итерируемый объект (или порядковый массив)
         * @param {Function(value, key, iter)} fn
         *        тело цикла
         * @param {Object} [thisArg=global]
         *        контект, в котором следует выполнять тело цикла
         * @param {Boolean} [deep=false]
         *        обходить ли прототипы
         * @return {Object|Array}
         *         результаты выполнения функции для всех элементов
         */
        'each': function (iter, fn, thisArg, deep) {

            var result, i, len;
            thisArg = thisArg || global;

            if (Lang.isArray(iter)) {
                result = [];
                for (i = 0, len = iter.length; i < len; i += 1) {
                    result.push(fn.call(thisArg, iter[i], i, iter));
                }
            } else {
                result = {};
                /*jslint forin: true */
                for (i in iter) {
                    if (iter.hasOwnProperty(i) || deep) {
                        result[i] = fn.call(thisArg, iter[i], i, iter);
                    }
                }
                /*jslint forin: false */
            }

            return result;
        },

        /**
         * Копирование объекта или массива
         *
         * @namespace go.Lang
         *
         * @param {Object|Array} source
         *        исходный объект
         * @return {Object|Array}
         *         копия исходного объекта
         */
        'copy': function (source) {
            var result, i, len;
            if (Lang.isArray(source)) {
                result = [];
                for (i = 0, len = source.length; i < len; i += 1) {
                    result.push(source[i]);
                }
            } else {
                result = {};
                for (i in source) {
                    if (source.hasOwnProperty(i)) {
                        result[i] = source[i];
                    }
                }
            }
            return result;
        },

        /**
         * Расширение объекта свойствами другого
         *
         * @namespace go.Lang
         *
         * @param {Object} destination
         *        исходный объект (расширяется на месте)
         * @param {Object} source
         *        источник новых свойств
         * @param {Boolean} [deep=false]
         *        обходить прототипы source
         * @return {Object}
         *         расширенный destination
         */
        'extend': function (destination, source, deep) {
            var k;
            /*jslint forin: true */
            for (k in source) {
                if (deep || source.hasOwnProperty(k)) {
                    destination[k] = source[k];
                }
            }
            /*jslint forin: false */
            return destination;
        },

        /**
         * Рекурсивное слияние двух объектов на месте
         *
         * @namespace go.Lang
         *
         * @param {Object} destination
         *        исходных объект (изменяется)
         * @param {Object} source
         *        источник новых свойств
         * @return {Object}
         *         расширенный destination
         */
        'merge': function (destination, source) {
            var k, value;
            for (k in source) {
                if (source.hasOwnProperty(k)) {
                    value = source[k];
                    if (Lang.isDict(value) && Lang.isDict(destination[k])) {
                        destination[k] = Lang.merge(destination[k], value);
                    } else {
                        destination[k] = value;
                    }
                }
            }
            return destination;
        },

        /**
         * Каррирование функции
         *
         * @namespace go.Lang
         *
         * @param {Function} fn
         *        исходная функция
         * @params {mixed} arg1 ...
         *         запоминаемые аргументы
         * @return {Function}
         *         каррированная функция
         */
        'curry': function (fn) {
            var slice = Array.prototype.slice,
                cargs = slice.call(arguments, 1);
            return function () {
                var args = cargs.concat(slice.call(arguments));
                return fn.apply(global, args);
            };
        },

        /**
         * Присутствует ли значение в массиве
         * (строгая проверка)
         *
         * @namespace go.Lang
         *
         * @param {mixed} needle
         *        значение
         * @param {Array} haystack
         *        порядковый массив
         * @return {Boolean}
         *         находится ли значение в массиве
         */
        'inArray': function (needle, haystack) {
            var i, len;
            for (i = 0, len = haystack.length; i < len; i += 1) {
                if (haystack[i] === needle) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Выполнить первую корректную функцию
         *
         * @namespace go.Lang
         *
         * @param {Function[]} funcs
         *        список функций
         * @return {mixed}
         *         результат первой корректно завершившейся
         *         ни одна не сработала - undefined
         */
        'tryDo': function (funcs) {
            var i, len, result;
            for (i = 0, len = funcs.length; i < len; i += 1) {
                try {
                    return funcs[i]();
                } catch (e) {
                }
            }
            return result;
        },

        /**
         * Разбор GET или POST запроса
         *
         * @namespace go.Lang
         *
         * @param {String} [query=window.location]
         *        строка запроса
         * @param {String} [sep="&"]
         *        разделитель переменных
         * @return {Object}
         *         переменные из запроса
         */
        'parseQuery': function (query, sep) {
            var result = {}, i, len, v;
            if (typeof query === "undefined") {
                query = global.location.toString().split("#", 2)[0].split("?", 2)[1];
            } else if (typeof query !== "string") {
                return query;
            }
            if (!query) {
                return result;
            }
            query = query.split(sep || "&");
            for (i = 0, len = query.length; i < len; i += 1) {
                v = query[i].split("=", 2);
                if (v.length === 2) {
                    result[decodeURIComponent(v[0])] = decodeURIComponent(v[1]);
                } else {
                    result[''] = decodeURIComponent(v[0]);
                }
            }
            return result;
        },

        /**
         * Сформировать строку запроса на основе набора переменных
         *
         * @namespace go.Lang
         *
         * @param {Object|String} vars
         *        набор переменных (или сразу строка)
         * @param {String} [sep="&"]
         *        разделитель
         * @return {String}
         *         строка запроса
         */
        'buildQuery': function (vars, sep) {
            var query = [], buildValue, buildArray, buildDict;
            if (typeof vars === "string") {
                return vars;
            }
            buildValue = function (name, value) {
                if (Lang.isDict(value)) {
                    buildDict(value, name);
                } else if (Lang.isArray(value)) {
                    buildArray(value, name);
                } else {
                    query.push(name + "=" + encodeURIComponent(value));
                }
            };
            buildArray = function (vars, prefix) {
                var i, len, name;
                for (i = 0, len = vars.length; i < len; i += 1) {
                    name = prefix ? prefix + "[" + i + "]" : i;
                    buildValue(name, vars[i]);
                }
            };
            buildDict = function (vars, prefix) {
                var k, name;
                for (k in vars) {
                    if (vars.hasOwnProperty(k)) {
                        name = prefix ? prefix + "[" + k + "]" : k;
                        buildValue(name, vars[k]);
                    }
                }
            };
            buildDict(vars, "");
            return query.join(sep || "&");
        },

        /**
         * Вспомогательные функции-заготовки
         *
         * @namespace go.Lang
         */
        'f': {
            /**
             * Функция, не делающая ничего
             *
             * @namespace go.Lang.f
             */
            'empty': function () {
            },

            /**
             * Функция, просто возвращающая FALSE
             *
             * @namespace go.Lang.f
             */
            'ffalse': function () {
                return false;
            }
        },

        /**
         * Создание собственных "классов" исключений
         *
         * @namespace go.Lang
         */
        'Exception': (function () {

            var Base, create;

            /**
             * go.Lang.Exception.create - создание "класса" исключения
             *
             * @namespace go.Lang.Exception
             *
             * @param {String} name
             *        название класса
             * @param {Function} [parent=Error]
             *        родительский класс (конструктор), по умолчанию - Error
             * @param {String} [defmessage]
             *        сообщение по умолчанию
             */
            create = function (name, parent, defmessage) {
                var Exc, Fake;
                if ((!parent) && (typeof global.Error === "function")) {
                    parent = global.Error;
                }
                defmessage = defmessage || "";
                Exc = function Exc(message) {
                    this.name    = name;
                    this.message = message || defmessage;
                    this.stack = (new Error()).stack;
                    if (this.stack) {
                        /*jslint regexp: true */
                        this.stack = this.stack.replace(/^[^n]*\n/, ""); // @todo
                        /*jslint regexp: false */
                    }
                };
                if (parent) {
                    Fake = function () {};
                    Fake.prototype = parent.prototype;
                    Exc.prototype  = new Fake();
                    Exc.prototype.constructor = Exc;
                }
                return Exc;
            };
            Base = create("go.Exception");

            Base.create = create;
            Base.Base   = Base;

            return Base;
        }()),

        'eoc': null
    };

    return Lang;
});
