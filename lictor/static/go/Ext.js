/**
 * go.Ext: вспомогательные расширения
 *
 * @package    go.js
 * @subpackage Ext
 * @author     Григорьев Олег aka vasa_c (http://blgo.ru/)
 * @uses       go.Class
 */
/*jslint node: true, nomen: true */
/*global go, window, jQuery */
"use strict";

if (!window.go) {
    throw new Error("go.core is not found");
}

go("Ext", ["Class"], function (go, global) {

    var Ext = {};

    /**
     * Ext.Options - класс с настройками
     *
     * @property {Object} options
     *           настройки данного класса,
     *           перекрывают настройки предка и перекрываются настройками объекта
     */
    Ext.Options = go.Class({

        '__classname': "go.Ext.Options",

        'options': {},

        '__mutators': {

            /**
             * Мутатор "options" - подгрузка предковых настроек
             */
            'options' : {
                'processClass': function (props) {
                    var paropt;
                    if (this.parent) {
                        paropt = this.parent.__mutators.mutators.options.options;
                    }
                    if (props.options) {
                        if (paropt) {
                            this.options = go.Lang.copy(paropt);
                            go.Lang.merge(this.options, props.options);
                        } else {
                            this.options = props.options;
                        }
                    } else {
                        if (this.parent) {
                            this.options = paropt;
                        } else {
                            this.options = {};
                        }
                    }
                    props.options = this.options;
                },
                'loadFromParents': function () {
                    return;
                }
            }

        },

        /**
         * Конструктор
         *
         * @param {Object} options
         *        уникальные настройки объекта
         */
        '__construct': function (options) {
            this.initOptions(options);
        },

        /**
         * Сохранение настроек объекта
         *
         * @param {Object} options
         */
        'initOptions': function (options) {
            if (options) {
                this.options = go.Lang.copy(this.__self.prototype.options);
                go.Lang.merge(this.options, options);
                this.__OptionsLazy = false;
            } else {
                this.__OptionsLazy = true;
            }
        },

        /**
         * Получить настройки объекта
         *
         * @return {Object}
         */
        'getOptions': function () {
            return this.options;
        },

        /**
         * Получить указанную настройку
         *
         * @throws go.Ext.Exception.NotFound
         * @param {String} opt
         *        имя настройки в виде пути ("one.two.three")
         * @return {mixed}
         */
        'getOption': function (opt) {
            var path = opt.split("."),
                value = this.options,
                i,
                len;
            for (i = 0, len = path.length; i < len; i += 1) {
                if ((!value) || (typeof value !== "object")) {
                    throw new Ext.Options.Exceptions.NotFound("getOption(" + opt + ")");
                }
                value = value[path[i]];
            }
            return value;
        },

        /**
         * Установить настройку
         *
         * @throws go.Ext.Exception.NotFound
         * @param {String} opt
         * @param {mixed} value
         */
        'setOption': function (opt, value) {
            var path = opt.split("."),
                dict,
                i,
                len;
            if (this.__OptionsLazy) {
                this.options = go.Lang.copy(this.options);
                this.__OptionsLazy = false;
            }
            dict = this.options;
            for (i = 0, len = path.length; i < len; i += 1) {
                if ((!dict) || (typeof dict !== "object")) {
                    throw new Ext.Options.Exceptions.NotFound("setOption(" + opt + ")");
                }
                if (i === len - 1) {
                    dict[path[i]] = value;
                } else {
                    dict = dict[path[i]];
                }
            }
        },

        'eoc': null
    });

    Ext.Options.Exceptions = {
        'NotFound' : go.Lang.Exception.create("go.Ext.Options.Exceptions.NotFound", go.Lang.Exception)
    };

    /**
     * Ext.Nodes - класс, обрабатывающий DOM-элементы
     *
     * @uses jQuery
     *
     * @property {jQuery} node
     *           основная нода объекта
     * @property {Object} nodes
     *           список загруженных нод
     * @property {Array} nodesListeners
     *           список установленных слушателей событий
     */
    Ext.Nodes = go.Class({

        /**
         * Список указателей на ноды
         * Переопределяется у потомков
         */
        'nodes': {},

        '__abstract': true,

        '__mutators': {
            /**
             * Мутатор "nodes" - подгрузка предковых списков нод
             */
            'nodes' : {
                'processClass': function (props) {
                    var parnodes;
                    if (this.parent) {
                        parnodes = this.parent.__mutators.mutators.nodes.nodes;
                    }
                    if (props.nodes) {
                        if (parnodes) {
                            this.nodes = go.Lang.copy(parnodes);
                            go.Lang.merge(this.nodes, props.nodes);
                        } else {
                            this.nodes = props.nodes;
                        }
                    } else {
                        if (this.parent) {
                            this.nodes = parnodes;
                        } else {
                            this.nodes = {};
                        }
                    }
                    props.nodes = this.nodes;
                },
                'loadFromParents': function () {
                    return;
                }
            }
        },

        /**
         * Конструктор
         *
         * @param {mixed} node
         *        указатель на основной контейнер объекта
         */
        '__construct': function (node) {
            this.initNodes(node);
        },

        /**
         * Деструктор
         */
        '__destruct': function () {
            this.doneNodes();
        },

        /**
         * Инициализация нод
         *
         * @param {mixed} node
         *        указатель на основной контейнер объекта
         * @todo протестировать лучше
         */
        'initNodes': function (node) {
            var nodes = {},
                nnode,
                lnodes = this.nodes,
                lnode,
                k,
                _this = this;
            function create(lnode) {
                var nnode,
                    parent,
                    events,
                    k,
                    handler;
                if (!lnode) {
                    return null;
                }
                if ((typeof lnode === "object") && (typeof lnode.length !== "undefined")) {
                    return lnode;
                }
                if (typeof lnode === "function") {
                    lnode = {
                        'creator': lnode
                    };
                } else if (typeof lnode === "string") {
                    lnode = {
                        'selector': lnode
                    };
                }
                if (lnode.selector) {
                    parent = lnode.global ? jQuery(global) : node;
                    nnode = parent.find(lnode.selector);
                } else if (lnode.creator) {
                    nnode = lnode.creator.call(_this, node, lnode);
                    nnode = create(nnode);
                }
                events = lnode.events;
                if (events) {
                    for (k in events) {
                        if (events.hasOwnProperty(k)) {
                            if (typeof events[k] === "function") {
                                handler = events[k];
                            } else {
                                handler = _this[events[k]];
                            }
                            _this.bind(nnode, k, handler);
                        }
                    }
                }
                return nnode;
            } // create()
            node = node ? jQuery(node) : jQuery(global);
            this.node = node;
            this.nodesListeners = [];
            for (k in lnodes) {
                if (lnodes.hasOwnProperty(k)) {
                    lnode = lnodes[k];
                    nnode = create(lnode);
                    if (nnode) {
                        nodes[k] = nnode;
                    }
                }
            }
            this.nodes = nodes;
        },

        /**
         * Очищение структур данных
         */
        'doneNodes': function () {
            this.unbindAll();
        },

        /**
         * Установить обработчик события
         *
         * @param {mixed} node
         *        указатель на ноду
         * @param {String} eventType
         *        тип события
         * @param {Function(e)|String} handler
         *        обработчик - функция или имя метода данного объекта
         */
        'bind': function (node, eventType, handler) {
            if (typeof handler !== "function") {
                handler = this[handler];
            }
            jQuery(node).bind(eventType, handler);
            this.nodesListeners.push([node, eventType, handler]);
        },

        /**
         * Снять обработчик события
         *
         * @param {mixed} node
         * @param {String} eventType
         * @param {Function(e)|String} handler
         */
        'unbind': function (node, eventType, handler) {
            if (typeof handler !== "function") {
                handler = this[handler];
            }
            jQuery(node).unbind(eventType, handler);
        },

        /**
         * Снять все обработчики, установленные ранее через bind()
         */
        'unbindAll': function () {
            var listeners = this.nodesListeners,
                listener;
            while (listeners.length > 0) {
                listener = listeners.pop();
                this.unbind.apply(this, listener);
            }
        },

        'eoc': null
    });

    /**
     * Ext.Events - класс, генерирующий события, на которые можно подписываться
     *
     * @property {Object} eventListeners
     *           тип события => список подписчиков
     */
    Ext.Events = go.Class({

        /**
         * Добавить обработчик события
         *
         * @param {String} eventType [optional]
         *        тип события
         * @param {Function} listener
         *        обработчик события
         * @return {Number}
         *         идентификатор слушателя
         */
        'addEventListener': function (eventType, listener) {
            var elisteners;
            if (!listener) {
                listener  = eventType;
                eventType = "";
            }
            if (!this.eventListeners) {
                this.eventListeners = {};
            }
            elisteners = this.eventListeners;
            if (elisteners[eventType]) {
                elisteners[eventType].push(listener);
            } else {
                elisteners[eventType] = [listener];
            }
        },

        /**
         * Удалить обработчик события
         *
         * @param {String} [eventType]
         *        тип события
         * @param {Function|Number} listener
         *        обработчик или его идентификатор
         * @return {Boolean}
         *         был ли обработчик найден и удалён
         */
        'removeEventListener': function (eventType, listener) {
            var elisteners = this.eventListeners, i, len;
            if (!elisteners) {
                return false;
            }
            elisteners = elisteners[eventType];
            if (!elisteners) {
                return false;
            }
            for (i = 0, len = elisteners.length; i < len; i += 1) {
                if (listener === elisteners[i]) {
                    elisteners[i] = null;
                    return true;
                }
            }
            return false;
        },

        /**
         * Удалить все обработчики одного события
         *
         * @param {String} eventType [optional]
         *        тип события
         */
        'removeEventAllListeners': function (eventType) {
            this.eventListeners[eventType] = [];
        },

        /**
         * Сброс всех обработчиков всех событий
         */
        'resetEventListeners': function () {
            this.eventListeners = {};
        },

        /**
         * Генерация события
         *
         * @param {String|Object} event
         *        объект события или его тип
         * @param {mixed} eventData
         *        данные события (если event - строка)
         */
        'fireEvent': function (event, eventData) {
            var listeners, listener, i, len;
            if ((!event) || (typeof event !== "object")) {
                event = new Ext.Events.Event(event, eventData);
            }
            listeners = this.eventListeners && this.eventListeners[event.type];
            if (!listeners) {
                return;
            }
            for (i = 0, len = listeners.length; i < len; i += 1) {
                listener = listeners[i];
                if (listener) {
                    listener(event);
                }
            }
        },

        /**
         * Деструктор
         */
        '__destruct': function () {
            this.resetEventListeners();
        },

        'eoc': null
    });

    /**
     * Конструктор объектов-событий для go.Ext.Events
     */
    Ext.Events.Event = (function () {

        var EventPrototype = {
            'toString': function () {
                return "[Event " + this.type + "]";
            }
        };
        function EventConstructor(eventType, eventData) {
            this.type = eventType;
            this.data = eventData;
        }
        EventConstructor.prototype = EventPrototype;

        return EventConstructor;
    }());

    return Ext;
});