/*! angular-onsenui.js for onsenui - v2.2.6-build.4532 - 2017-05-10 */
"use strict";

/* Simple JavaScript Inheritance for ES 5.1
 * based on http://ejohn.org/blog/simple-javascript-inheritance/
 *  (inspired by base2 and Prototype)
 * MIT Licensed.
 */
(function () {
  "use strict";

  var fnTest = /xyz/.test(function () {
    xyz;
  }) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  function BaseClass() {}

  // Create a new Class that inherits from this class
  BaseClass.extend = function (props) {
    var _super = this.prototype;

    // Set up the prototype to inherit from the base class
    // (but without running the init constructor)
    var proto = Object.create(_super);

    // Copy the properties over onto the new prototype
    for (var name in props) {
      // Check if we're overwriting an existing function
      proto[name] = typeof props[name] === "function" && typeof _super[name] == "function" && fnTest.test(props[name]) ? function (name, fn) {
        return function () {
          var tmp = this._super;

          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name];

          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      }(name, props[name]) : props[name];
    }

    // The new constructor
    var newClass = typeof proto.init === "function" ? proto.hasOwnProperty("init") ? proto.init // All construction is actually done in the init method
    : function SubClass() {
      _super.init.apply(this, arguments);
    } : function EmptyClass() {};

    // Populate our constructed prototype object
    newClass.prototype = proto;

    // Enforce the constructor to be what we expect
    proto.constructor = newClass;

    // And make this class extendable
    newClass.extend = BaseClass.extend;

    return newClass;
  };

  // export
  window.Class = BaseClass;
})();
"use strict";

//HEAD 
(function (app) {
    try {
        app = angular.module("templates-main");
    } catch (err) {
        app = angular.module("templates-main", []);
    }
    app.run(["$templateCache", function ($templateCache) {
        "use strict";

        $templateCache.put("templates/sliding_menu.tpl", "<div class=\"onsen-sliding-menu__menu\"></div>\n" + "<div class=\"onsen-sliding-menu__main\"></div>\n" + "");

        $templateCache.put("templates/split_view.tpl", "<div class=\"onsen-split-view__secondary full-screen\"></div>\n" + "<div class=\"onsen-split-view__main full-screen\"></div>\n" + "");
    }]);
})();
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

/**
 * @object ons
 * @description
 *   [ja]Onsen UIで利用できるグローバルなオブジェクトです。このオブジェクトは、AngularJSのスコープから参照することができます。 [/ja]
 *   [en]A global object that's used in Onsen UI. This object can be reached from the AngularJS scope.[/en]
 */

(function (ons) {
  'use strict';

  var module = angular.module('onsen', ['templates-main']);
  angular.module('onsen.directives', ['onsen']); // for BC

  // JS Global facade for Onsen UI.
  initOnsenFacade();
  waitOnsenUILoad();
  initAngularModule();
  initTemplateCache();

  function waitOnsenUILoad() {
    var unlockOnsenUI = ons._readyLock.lock();
    module.run(['$compile', '$rootScope', function ($compile, $rootScope) {
      // for initialization hook.
      if (document.readyState === 'loading' || document.readyState == 'uninitialized') {
        window.addEventListener('DOMContentLoaded', function () {
          document.body.appendChild(document.createElement('ons-dummy-for-init'));
        });
      } else if (document.body) {
        document.body.appendChild(document.createElement('ons-dummy-for-init'));
      } else {
        throw new Error('Invalid initialization state.');
      }

      $rootScope.$on('$ons-ready', unlockOnsenUI);
    }]);
  }

  function initAngularModule() {
    module.value('$onsGlobal', ons);
    module.run(['$compile', '$rootScope', '$onsen', '$q', function ($compile, $rootScope, $onsen, $q) {
      ons._onsenService = $onsen;
      ons._qService = $q;

      $rootScope.ons = window.ons;
      $rootScope.console = window.console;
      $rootScope.alert = window.alert;

      ons.$compile = $compile;
    }]);
  }

  function initTemplateCache() {
    module.run(['$templateCache', function ($templateCache) {
      var tmp = ons._internal.getTemplateHTMLAsync;

      ons._internal.getTemplateHTMLAsync = function (page) {
        var cache = $templateCache.get(page);

        if (cache) {
          return Promise.resolve(cache);
        } else {
          return tmp(page);
        }
      };
    }]);
  }

  function initOnsenFacade() {
    ons._onsenService = null;

    // Object to attach component variables to when using the var="..." attribute.
    // Can be set to null to avoid polluting the global scope.
    ons.componentBase = window;

    /**
     * @method bootstrap
     * @signature bootstrap([moduleName, [dependencies]])
     * @description
     *   [ja]Onsen UIの初期化を行います。Angular.jsのng-app属性を利用すること無しにOnsen UIを読み込んで初期化してくれます。[/ja]
     *   [en]Initialize Onsen UI. Can be used to load Onsen UI without using the <code>ng-app</code> attribute from AngularJS.[/en]
     * @param {String} [moduleName]
     *   [en]AngularJS module name.[/en]
     *   [ja]Angular.jsでのモジュール名[/ja]
     * @param {Array} [dependencies]
     *   [en]List of AngularJS module dependencies.[/en]
     *   [ja]依存するAngular.jsのモジュール名の配列[/ja]
     * @return {Object}
     *   [en]An AngularJS module object.[/en]
     *   [ja]AngularJSのModuleオブジェクトを表します。[/ja]
     */
    ons.bootstrap = function (name, deps) {
      if (angular.isArray(name)) {
        deps = name;
        name = undefined;
      }

      if (!name) {
        name = 'myOnsenApp';
      }

      deps = ['onsen'].concat(angular.isArray(deps) ? deps : []);
      var module = angular.module(name, deps);

      var doc = window.document;
      if (doc.readyState == 'loading' || doc.readyState == 'uninitialized' || doc.readyState == 'interactive') {
        doc.addEventListener('DOMContentLoaded', function () {
          angular.bootstrap(doc.documentElement, [name]);
        }, false);
      } else if (doc.documentElement) {
        angular.bootstrap(doc.documentElement, [name]);
      } else {
        throw new Error('Invalid state');
      }

      return module;
    };

    /**
     * @method findParentComponentUntil
     * @signature findParentComponentUntil(name, [dom])
     * @param {String} name
     *   [en]Name of component, i.e. 'ons-page'.[/en]
     *   [ja]コンポーネント名を指定します。例えばons-pageなどを指定します。[/ja]
     * @param {Object/jqLite/HTMLElement} [dom]
     *   [en]$event, jqLite or HTMLElement object.[/en]
     *   [ja]$eventオブジェクト、jqLiteオブジェクト、HTMLElementオブジェクトのいずれかを指定できます。[/ja]
     * @return {Object}
     *   [en]Component object. Will return null if no component was found.[/en]
     *   [ja]コンポーネントのオブジェクトを返します。もしコンポーネントが見つからなかった場合にはnullを返します。[/ja]
     * @description
     *   [en]Find parent component object of <code>dom</code> element.[/en]
     *   [ja]指定されたdom引数の親要素をたどってコンポーネントを検索します。[/ja]
     */
    ons.findParentComponentUntil = function (name, dom) {
      var element;
      if (dom instanceof HTMLElement) {
        element = angular.element(dom);
      } else if (dom instanceof angular.element) {
        element = dom;
      } else if (dom.target) {
        element = angular.element(dom.target);
      }

      return element.inheritedData(name);
    };

    /**
     * @method findComponent
     * @signature findComponent(selector, [dom])
     * @param {String} selector
     *   [en]CSS selector[/en]
     *   [ja]CSSセレクターを指定します。[/ja]
     * @param {HTMLElement} [dom]
     *   [en]DOM element to search from.[/en]
     *   [ja]検索対象とするDOM要素を指定します。[/ja]
     * @return {Object/null}
     *   [en]Component object. Will return null if no component was found.[/en]
     *   [ja]コンポーネントのオブジェクトを返します。もしコンポーネントが見つからなかった場合にはnullを返します。[/ja]
     * @description
     *   [en]Find component object using CSS selector.[/en]
     *   [ja]CSSセレクタを使ってコンポーネントのオブジェクトを検索します。[/ja]
     */
    ons.findComponent = function (selector, dom) {
      var target = (dom ? dom : document).querySelector(selector);
      return target ? angular.element(target).data(target.nodeName.toLowerCase()) || null : null;
    };

    /**
     * @method compile
     * @signature compile(dom)
     * @param {HTMLElement} dom
     *   [en]Element to compile.[/en]
     *   [ja]コンパイルする要素を指定します。[/ja]
     * @description
     *   [en]Compile Onsen UI components.[/en]
     *   [ja]通常のHTMLの要素をOnsen UIのコンポーネントにコンパイルします。[/ja]
     */
    ons.compile = function (dom) {
      if (!ons.$compile) {
        throw new Error('ons.$compile() is not ready. Wait for initialization with ons.ready().');
      }

      if (!(dom instanceof HTMLElement)) {
        throw new Error('First argument must be an instance of HTMLElement.');
      }

      var scope = angular.element(dom).scope();
      if (!scope) {
        throw new Error('AngularJS Scope is null. Argument DOM element must be attached in DOM document.');
      }

      ons.$compile(dom)(scope);
    };

    ons._getOnsenService = function () {
      if (!this._onsenService) {
        throw new Error('$onsen is not loaded, wait for ons.ready().');
      }

      return this._onsenService;
    };

    /**
     * @param {String} elementName
     * @param {Function} lastReady
     * @return {Function}
     */
    ons._waitDiretiveInit = function (elementName, lastReady) {
      return function (element, callback) {
        if (angular.element(element).data(elementName)) {
          lastReady(element, callback);
        } else {
          var listen = function listen() {
            lastReady(element, callback);
            element.removeEventListener(elementName + ':init', listen, false);
          };
          element.addEventListener(elementName + ':init', listen, false);
        }
      };
    };

    /**
     * @method createElement
     * @signature createElement(template, [options])
     * @param {String} template
     *   [en]Either an HTML file path, an `<ons-template>` id or an HTML string such as `'<div id="foo">hoge</div>'`.[/en]
     *   [ja][/ja]
     * @param {Object} [options]
     *   [en]Parameter object.[/en]
     *   [ja]オプションを指定するオブジェクト。[/ja]
     * @param {Boolean|HTMLElement} [options.append]
     *   [en]Whether or not the element should be automatically appended to the DOM.  Defaults to `false`. If `true` value is given, `document.body` will be used as the target.[/en]
     *   [ja][/ja]
     * @param {HTMLElement} [options.insertBefore]
     *   [en]Reference node that becomes the next sibling of the new node (`options.append` element).[/en]
     *   [ja][/ja]
     * @param {Object} [options.parentScope]
     *   [en]Parent scope of the element. Used to bind models and access scope methods from the element. Requires append option.[/en]
     *   [ja][/ja]
     * @return {HTMLElement|Promise}
     *   [en]If the provided template was an inline HTML string, it returns the new element. Otherwise, it returns a promise that resolves to the new element.[/en]
     *   [ja][/ja]
     * @description
     *   [en]Create a new element from a template. Both inline HTML and external files are supported although the return value differs. If the element is appended it will also be compiled by AngularJS (otherwise, `ons.compile` should be manually used).[/en]
     *   [ja][/ja]
     */
    var createElementOriginal = ons.createElement;
    ons.createElement = function (template) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var link = function link(element) {
        if (options.parentScope) {
          ons.$compile(angular.element(element))(options.parentScope.$new());
          options.parentScope.$evalAsync();
        } else {
          ons.compile(element);
        }
      };

      var getScope = function getScope(e) {
        return angular.element(e).data(e.tagName.toLowerCase()) || e;
      };
      var result = createElementOriginal(template, _extends({ append: !!options.parentScope, link: link }, options));

      return result instanceof Promise ? result.then(getScope) : getScope(result);
    };

    /**
     * @method createAlertDialog
     * @signature createAlertDialog(page, [options])
     * @param {String} page
     *   [en]Page name. Can be either an HTML file or an <ons-template> containing a <ons-alert-dialog> component.[/en]
     *   [ja]pageのURLか、もしくはons-templateで宣言したテンプレートのid属性の値を指定できます。[/ja]
     * @param {Object} [options]
     *   [en]Parameter object.[/en]
     *   [ja]オプションを指定するオブジェクト。[/ja]
     * @param {Object} [options.parentScope]
     *   [en]Parent scope of the dialog. Used to bind models and access scope methods from the dialog.[/en]
     *   [ja]ダイアログ内で利用する親スコープを指定します。ダイアログからモデルやスコープのメソッドにアクセスするのに使います。このパラメータはAngularJSバインディングでのみ利用できます。[/ja]
     * @return {Promise}
     *   [en]Promise object that resolves to the alert dialog component object.[/en]
     *   [ja]ダイアログのコンポーネントオブジェクトを解決するPromiseオブジェクトを返します。[/ja]
     * @description
     *   [en]Create a alert dialog instance from a template. This method will be deprecated in favor of `ons.createElement`.[/en]
     *   [ja]テンプレートからアラートダイアログのインスタンスを生成します。[/ja]
     */

    /**
     * @method createDialog
     * @signature createDialog(page, [options])
     * @param {String} page
     *   [en]Page name. Can be either an HTML file or an <ons-template> containing a <ons-dialog> component.[/en]
     *   [ja]pageのURLか、もしくはons-templateで宣言したテンプレートのid属性の値を指定できます。[/ja]
     * @param {Object} [options]
     *   [en]Parameter object.[/en]
     *   [ja]オプションを指定するオブジェクト。[/ja]
     * @param {Object} [options.parentScope]
     *   [en]Parent scope of the dialog. Used to bind models and access scope methods from the dialog.[/en]
     *   [ja]ダイアログ内で利用する親スコープを指定します。ダイアログからモデルやスコープのメソッドにアクセスするのに使います。このパラメータはAngularJSバインディングでのみ利用できます。[/ja]
     * @return {Promise}
     *   [en]Promise object that resolves to the dialog component object.[/en]
     *   [ja]ダイアログのコンポーネントオブジェクトを解決するPromiseオブジェクトを返します。[/ja]
     * @description
     *   [en]Create a dialog instance from a template. This method will be deprecated in favor of `ons.createElement`.[/en]
     *   [ja]テンプレートからダイアログのインスタンスを生成します。[/ja]
     */

    /**
     * @method createPopover
     * @signature createPopover(page, [options])
     * @param {String} page
     *   [en]Page name. Can be either an HTML file or an <ons-template> containing a <ons-dialog> component.[/en]
     *   [ja]pageのURLか、もしくはons-templateで宣言したテンプレートのid属性の値を指定できます。[/ja]
     * @param {Object} [options]
     *   [en]Parameter object.[/en]
     *   [ja]オプションを指定するオブジェクト。[/ja]
     * @param {Object} [options.parentScope]
     *   [en]Parent scope of the dialog. Used to bind models and access scope methods from the dialog.[/en]
     *   [ja]ダイアログ内で利用する親スコープを指定します。ダイアログからモデルやスコープのメソッドにアクセスするのに使います。このパラメータはAngularJSバインディングでのみ利用できます。[/ja]
     * @return {Promise}
     *   [en]Promise object that resolves to the popover component object.[/en]
     *   [ja]ポップオーバーのコンポーネントオブジェクトを解決するPromiseオブジェクトを返します。[/ja]
     * @description
     *   [en]Create a popover instance from a template. This method will be deprecated in favor of `ons.createElement`.[/en]
     *   [ja]テンプレートからポップオーバーのインスタンスを生成します。[/ja]
     */

    /**
     * @param {String} page
     */
    var resolveLoadingPlaceHolderOriginal = ons.resolveLoadingPlaceHolder;
    ons.resolveLoadingPlaceholder = function (page) {
      return resolveLoadingPlaceholderOriginal(page, function (element, done) {
        ons.compile(element);
        angular.element(element).scope().$evalAsync(function () {
          return setImmediate(done);
        });
      });
    };

    ons._setupLoadingPlaceHolders = function () {
      // Do nothing
    };
  }
})(window.ons = window.ons || {});
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('ActionSheetView', ['$onsen', function ($onsen) {

    var ActionSheetView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._scope = scope;
        this._element = element;
        this._attrs = attrs;

        this._clearDerivingMethods = $onsen.deriveMethods(this, this._element[0], ['show', 'hide']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, this._element[0], ['preshow', 'postshow', 'prehide', 'posthide', 'cancel'], function (detail) {
          if (detail.actionSheet) {
            detail.actionSheet = this;
          }
          return detail;
        }.bind(this));

        this._scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._element.remove();
        this._clearDerivingMethods();
        this._clearDerivingEvents();

        this._scope = this._attrs = this._element = null;
      }

    });

    ActionSheetView.registerAnimator = function (name, Animator) {
      return window.ons.ActionSheetElement.registerAnimator(name, Animator);
    };

    MicroEvent.mixin(ActionSheetView);
    $onsen.derivePropertiesFromElement(ActionSheetView, ['disabled', 'cancelable', 'visible', 'onDeviceBackButton']);

    return ActionSheetView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('AlertDialogView', ['$onsen', function ($onsen) {

    var AlertDialogView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._scope = scope;
        this._element = element;
        this._attrs = attrs;

        this._clearDerivingMethods = $onsen.deriveMethods(this, this._element[0], ['show', 'hide']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, this._element[0], ['preshow', 'postshow', 'prehide', 'posthide', 'cancel'], function (detail) {
          if (detail.alertDialog) {
            detail.alertDialog = this;
          }
          return detail;
        }.bind(this));

        this._scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._element.remove();

        this._clearDerivingMethods();
        this._clearDerivingEvents();

        this._scope = this._attrs = this._element = null;
      }

    });

    MicroEvent.mixin(AlertDialogView);
    $onsen.derivePropertiesFromElement(AlertDialogView, ['disabled', 'cancelable', 'visible', 'onDeviceBackButton']);

    return AlertDialogView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

angular.module('onsen').value('AlertDialogAnimator', ons._internal.AlertDialogAnimator).value('AndroidAlertDialogAnimator', ons._internal.AndroidAlertDialogAnimator).value('IOSAlertDialogAnimator', ons._internal.IOSAlertDialogAnimator);
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

angular.module('onsen').value('AnimationChooser', ons._internal.AnimatorFactory);
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('CarouselView', ['$onsen', function ($onsen) {

    /**
     * @class CarouselView
     */
    var CarouselView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingMethods = $onsen.deriveMethods(this, element[0], ['setActiveIndex', 'getActiveIndex', 'next', 'prev', 'refresh', 'first', 'last']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['refresh', 'postchange', 'overscroll'], function (detail) {
          if (detail.carousel) {
            detail.carousel = this;
          }
          return detail;
        }.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingEvents();
        this._clearDerivingMethods();

        this._element = this._scope = this._attrs = null;
      }
    });

    MicroEvent.mixin(CarouselView);

    $onsen.derivePropertiesFromElement(CarouselView, ['centered', 'overscrollable', 'disabled', 'autoScroll', 'swipeable', 'autoScrollRatio', 'itemCount']);

    return CarouselView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('DialogView', ['$onsen', function ($onsen) {

    var DialogView = Class.extend({

      init: function init(scope, element, attrs) {
        this._scope = scope;
        this._element = element;
        this._attrs = attrs;

        this._clearDerivingMethods = $onsen.deriveMethods(this, this._element[0], ['show', 'hide']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, this._element[0], ['preshow', 'postshow', 'prehide', 'posthide', 'cancel'], function (detail) {
          if (detail.dialog) {
            detail.dialog = this;
          }
          return detail;
        }.bind(this));

        this._scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._element.remove();
        this._clearDerivingMethods();
        this._clearDerivingEvents();

        this._scope = this._attrs = this._element = null;
      }
    });

    DialogView.registerAnimator = function (name, Animator) {
      return window.ons.DialogElement.registerAnimator(name, Animator);
    };

    MicroEvent.mixin(DialogView);
    $onsen.derivePropertiesFromElement(DialogView, ['disabled', 'cancelable', 'visible', 'onDeviceBackButton']);

    return DialogView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

angular.module('onsen').value('DialogAnimator', ons._internal.DialogAnimator).value('IOSDialogAnimator', ons._internal.IOSDialogAnimator).value('AndroidDialogAnimator', ons._internal.AndroidDialogAnimator).value('SlideDialogAnimator', ons._internal.SlideDialogAnimator);
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('FabView', ['$onsen', function ($onsen) {

    /**
     * @class FabView
     */
    var FabView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingMethods = $onsen.deriveMethods(this, element[0], ['show', 'hide', 'toggle']);
      },

      _destroy: function _destroy() {
        this.emit('destroy');
        this._clearDerivingMethods();

        this._element = this._scope = this._attrs = null;
      }
    });

    $onsen.derivePropertiesFromElement(FabView, ['disabled', 'visible']);

    MicroEvent.mixin(FabView);

    return FabView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  angular.module('onsen').factory('GenericView', ['$onsen', function ($onsen) {

    var GenericView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       * @param {Object} [options]
       * @param {Boolean} [options.directiveOnly]
       * @param {Function} [options.onDestroy]
       * @param {String} [options.modifierTemplate]
       */
      init: function init(scope, element, attrs, options) {
        var self = this;
        options = {};

        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        if (options.directiveOnly) {
          if (!options.modifierTemplate) {
            throw new Error('options.modifierTemplate is undefined.');
          }
          $onsen.addModifierMethods(this, options.modifierTemplate, element);
        } else {
          $onsen.addModifierMethodsForCustomElements(this, element);
        }

        $onsen.cleaner.onDestroy(scope, function () {
          self._events = undefined;
          $onsen.removeModifierMethods(self);

          if (options.onDestroy) {
            options.onDestroy(self);
          }

          $onsen.clearComponent({
            scope: scope,
            attrs: attrs,
            element: element
          });

          self = element = self._element = self._scope = scope = self._attrs = attrs = options = null;
        });
      }
    });

    /**
     * @param {Object} scope
     * @param {jqLite} element
     * @param {Object} attrs
     * @param {Object} options
     * @param {String} options.viewKey
     * @param {Boolean} [options.directiveOnly]
     * @param {Function} [options.onDestroy]
     * @param {String} [options.modifierTemplate]
     */
    GenericView.register = function (scope, element, attrs, options) {
      var view = new GenericView(scope, element, attrs, options);

      if (!options.viewKey) {
        throw new Error('options.viewKey is required.');
      }

      $onsen.declareVarAttribute(attrs, view);
      element.data(options.viewKey, view);

      var destroy = options.onDestroy || angular.noop;
      options.onDestroy = function (view) {
        destroy(view);
        element.data(options.viewKey, null);
      };

      return view;
    };

    MicroEvent.mixin(GenericView);

    return GenericView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('LazyRepeatView', ['AngularLazyRepeatDelegate', function (AngularLazyRepeatDelegate) {

    var LazyRepeatView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs, linker) {
        var _this = this;

        this._element = element;
        this._scope = scope;
        this._attrs = attrs;
        this._linker = linker;

        var userDelegate = this._scope.$eval(this._attrs.onsLazyRepeat);

        var internalDelegate = new AngularLazyRepeatDelegate(userDelegate, element[0], element.scope());

        this._provider = new ons._internal.LazyRepeatProvider(element[0].parentNode, internalDelegate);

        // Expose refresh method to user.
        userDelegate.refresh = this._provider.refresh.bind(this._provider);

        element.remove();

        // Render when number of items change.
        this._scope.$watch(internalDelegate.countItems.bind(internalDelegate), this._provider._onChange.bind(this._provider));

        this._scope.$on('$destroy', function () {
          _this._element = _this._scope = _this._attrs = _this._linker = null;
        });
      }
    });

    return LazyRepeatView;
  }]);
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  angular.module('onsen').factory('AngularLazyRepeatDelegate', ['$compile', function ($compile) {

    var directiveAttributes = ['ons-lazy-repeat', 'ons:lazy:repeat', 'ons_lazy_repeat', 'data-ons-lazy-repeat', 'x-ons-lazy-repeat'];

    var AngularLazyRepeatDelegate = function (_ons$_internal$LazyRe) {
      _inherits(AngularLazyRepeatDelegate, _ons$_internal$LazyRe);

      /**
       * @param {Object} userDelegate
       * @param {Element} templateElement
       * @param {Scope} parentScope
       */
      function AngularLazyRepeatDelegate(userDelegate, templateElement, parentScope) {
        _classCallCheck(this, AngularLazyRepeatDelegate);

        var _this = _possibleConstructorReturn(this, (AngularLazyRepeatDelegate.__proto__ || Object.getPrototypeOf(AngularLazyRepeatDelegate)).call(this, userDelegate, templateElement));

        _this._parentScope = parentScope;

        directiveAttributes.forEach(function (attr) {
          return templateElement.removeAttribute(attr);
        });
        _this._linker = $compile(templateElement ? templateElement.cloneNode(true) : null);
        return _this;
      }

      _createClass(AngularLazyRepeatDelegate, [{
        key: 'configureItemScope',
        value: function configureItemScope(item, scope) {
          if (this._userDelegate.configureItemScope instanceof Function) {
            this._userDelegate.configureItemScope(item, scope);
          }
        }
      }, {
        key: 'destroyItemScope',
        value: function destroyItemScope(item, element) {
          if (this._userDelegate.destroyItemScope instanceof Function) {
            this._userDelegate.destroyItemScope(item, element);
          }
        }
      }, {
        key: '_usingBinding',
        value: function _usingBinding() {
          if (this._userDelegate.configureItemScope) {
            return true;
          }

          if (this._userDelegate.createItemContent) {
            return false;
          }

          throw new Error('`lazy-repeat` delegate object is vague.');
        }
      }, {
        key: 'loadItemElement',
        value: function loadItemElement(index, done) {
          this._prepareItemElement(index, function (_ref) {
            var element = _ref.element,
                scope = _ref.scope;

            done({ element: element, scope: scope });
          });
        }
      }, {
        key: '_prepareItemElement',
        value: function _prepareItemElement(index, done) {
          var _this2 = this;

          var scope = this._parentScope.$new();
          this._addSpecialProperties(index, scope);

          if (this._usingBinding()) {
            this.configureItemScope(index, scope);
          }

          this._linker(scope, function (cloned) {
            var element = cloned[0];
            if (!_this2._usingBinding()) {
              element = _this2._userDelegate.createItemContent(index, element);
              $compile(element)(scope);
            }

            done({ element: element, scope: scope });
          });
        }

        /**
         * @param {Number} index
         * @param {Object} scope
         */

      }, {
        key: '_addSpecialProperties',
        value: function _addSpecialProperties(i, scope) {
          var last = this.countItems() - 1;
          angular.extend(scope, {
            $index: i,
            $first: i === 0,
            $last: i === last,
            $middle: i !== 0 && i !== last,
            $even: i % 2 === 0,
            $odd: i % 2 === 1
          });
        }
      }, {
        key: 'updateItem',
        value: function updateItem(index, item) {
          var _this3 = this;

          if (this._usingBinding()) {
            item.scope.$evalAsync(function () {
              return _this3.configureItemScope(index, item.scope);
            });
          } else {
            _get(AngularLazyRepeatDelegate.prototype.__proto__ || Object.getPrototypeOf(AngularLazyRepeatDelegate.prototype), 'updateItem', this).call(this, index, item);
          }
        }

        /**
         * @param {Number} index
         * @param {Object} item
         * @param {Object} item.scope
         * @param {Element} item.element
         */

      }, {
        key: 'destroyItem',
        value: function destroyItem(index, item) {
          if (this._usingBinding()) {
            this.destroyItemScope(index, item.scope);
          } else {
            _get(AngularLazyRepeatDelegate.prototype.__proto__ || Object.getPrototypeOf(AngularLazyRepeatDelegate.prototype), 'destroyItem', this).call(this, index, item.element);
          }
          item.scope.$destroy();
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          _get(AngularLazyRepeatDelegate.prototype.__proto__ || Object.getPrototypeOf(AngularLazyRepeatDelegate.prototype), 'destroy', this).call(this);
          this._scope = null;
        }
      }]);

      return AngularLazyRepeatDelegate;
    }(ons._internal.LazyRepeatDelegate);

    return AngularLazyRepeatDelegate;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.value('ModalAnimator', ons._internal.ModalAnimator);
  module.value('FadeModalAnimator', ons._internal.FadeModalAnimator);

  module.factory('ModalView', ['$onsen', '$parse', function ($onsen, $parse) {

    var ModalView = Class.extend({
      _element: undefined,
      _scope: undefined,

      init: function init(scope, element, attrs) {
        this._scope = scope;
        this._element = element;
        this._scope.$on('$destroy', this._destroy.bind(this));

        element[0]._animatorFactory.setAnimationOptions($parse(attrs.animationOptions)());
      },

      show: function show(options) {
        return this._element[0].show(options);
      },

      hide: function hide(options) {
        return this._element[0].hide(options);
      },

      toggle: function toggle(options) {
        return this._element[0].toggle(options);
      },

      _destroy: function _destroy() {
        this.emit('destroy', { page: this });

        this._events = this._element = this._scope = null;
      }
    });

    ModalView.registerAnimator = function (name, Animator) {
      return window.ons.ModalElement.registerAnimator(name, Animator);
    };

    MicroEvent.mixin(ModalView);
    $onsen.derivePropertiesFromElement(ModalView, ['onDeviceBackButton']);

    return ModalView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('NavigatorView', ['$compile', '$onsen', function ($compile, $onsen) {

    /**
     * Manages the page navigation backed by page stack.
     *
     * @class NavigatorView
     */
    var NavigatorView = Class.extend({

      /**
       * @member {jqLite} Object
       */
      _element: undefined,

      /**
       * @member {Object} Object
       */
      _attrs: undefined,

      /**
       * @member {Object}
       */
      _scope: undefined,

      /**
       * @param {Object} scope
       * @param {jqLite} element jqLite Object to manage with navigator
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {

        this._element = element || angular.element(window.document.body);
        this._scope = scope || this._element.scope();
        this._attrs = attrs;
        this._previousPageScope = null;

        this._boundOnPrepop = this._onPrepop.bind(this);
        this._element.on('prepop', this._boundOnPrepop);

        this._scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['prepush', 'postpush', 'prepop', 'postpop', 'init', 'show', 'hide', 'destroy'], function (detail) {
          if (detail.navigator) {
            detail.navigator = this;
          }
          return detail;
        }.bind(this));

        this._clearDerivingMethods = $onsen.deriveMethods(this, element[0], ['insertPage', 'pushPage', 'bringPageTop', 'popPage', 'replacePage', 'resetToPage', 'canPopPage']);
      },

      _onPrepop: function _onPrepop(event) {
        var pages = event.detail.navigator.pages;
        angular.element(pages[pages.length - 2]).data('_scope').$evalAsync();
      },

      _destroy: function _destroy() {
        this.emit('destroy');
        this._clearDerivingEvents();
        this._clearDerivingMethods();
        this._element.off('prepop', this._boundOnPrepop);
        this._element = this._scope = this._attrs = null;
      }
    });

    MicroEvent.mixin(NavigatorView);
    $onsen.derivePropertiesFromElement(NavigatorView, ['pages', 'topPage']);

    return NavigatorView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

angular.module('onsen').value('NavigatorTransitionAnimator', ons._internal.NavigatorTransitionAnimator).value('FadeTransitionAnimator', ons._internal.FadeNavigatorTransitionAnimator).value('IOSSlideTransitionAnimator', ons._internal.IOSSlideNavigatorTransitionAnimator).value('LiftTransitionAnimator', ons._internal.LiftNavigatorTransitionAnimator).value('NullTransitionAnimator', ons._internal.NavigatorTransitionAnimator).value('SimpleSlideTransitionAnimator', ons._internal.SimpleSlideNavigatorTransitionAnimator);
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('OverlaySlidingMenuAnimator', ['SlidingMenuAnimator', function (SlidingMenuAnimator) {

    var OverlaySlidingMenuAnimator = SlidingMenuAnimator.extend({

      _blackMask: undefined,

      _isRight: false,
      _element: false,
      _menuPage: false,
      _mainPage: false,
      _width: false,

      /**
       * @param {jqLite} element "ons-sliding-menu" or "ons-split-view" element
       * @param {jqLite} mainPage
       * @param {jqLite} menuPage
       * @param {Object} options
       * @param {String} options.width "width" style value
       * @param {Boolean} options.isRight
       */
      setup: function setup(element, mainPage, menuPage, options) {
        options = options || {};
        this._width = options.width || '90%';
        this._isRight = !!options.isRight;
        this._element = element;
        this._mainPage = mainPage;
        this._menuPage = menuPage;

        menuPage.css('box-shadow', '0px 0 10px 0px rgba(0, 0, 0, 0.2)');
        menuPage.css({
          width: options.width,
          display: 'none',
          zIndex: 2
        });

        // Fix for transparent menu page on iOS8.
        menuPage.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');

        mainPage.css({ zIndex: 1 });

        if (this._isRight) {
          menuPage.css({
            right: '-' + options.width,
            left: 'auto'
          });
        } else {
          menuPage.css({
            right: 'auto',
            left: '-' + options.width
          });
        }

        this._blackMask = angular.element('<div></div>').css({
          backgroundColor: 'black',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          position: 'absolute',
          display: 'none',
          zIndex: 0
        });

        element.prepend(this._blackMask);
      },

      /**
       * @param {Object} options
       * @param {String} options.width
       */
      onResized: function onResized(options) {
        this._menuPage.css('width', options.width);

        if (this._isRight) {
          this._menuPage.css({
            right: '-' + options.width,
            left: 'auto'
          });
        } else {
          this._menuPage.css({
            right: 'auto',
            left: '-' + options.width
          });
        }

        if (options.isOpened) {
          var max = this._menuPage[0].clientWidth;
          var menuStyle = this._generateMenuPageStyle(max);
          ons.animit(this._menuPage[0]).queue(menuStyle).play();
        }
      },

      /**
       */
      destroy: function destroy() {
        if (this._blackMask) {
          this._blackMask.remove();
          this._blackMask = null;
        }

        this._mainPage.removeAttr('style');
        this._menuPage.removeAttr('style');

        this._element = this._mainPage = this._menuPage = null;
      },

      /**
       * @param {Function} callback
       * @param {Boolean} instant
       */
      openMenu: function openMenu(callback, instant) {
        var duration = instant === true ? 0.0 : this.duration;
        var delay = instant === true ? 0.0 : this.delay;

        this._menuPage.css('display', 'block');
        this._blackMask.css('display', 'block');

        var max = this._menuPage[0].clientWidth;
        var menuStyle = this._generateMenuPageStyle(max);
        var mainPageStyle = this._generateMainPageStyle(max);

        setTimeout(function () {

          ons.animit(this._mainPage[0]).wait(delay).queue(mainPageStyle, {
            duration: duration,
            timing: this.timing
          }).queue(function (done) {
            callback();
            done();
          }).play();

          ons.animit(this._menuPage[0]).wait(delay).queue(menuStyle, {
            duration: duration,
            timing: this.timing
          }).play();
        }.bind(this), 1000 / 60);
      },

      /**
       * @param {Function} callback
       * @param {Boolean} instant
       */
      closeMenu: function closeMenu(callback, instant) {
        var duration = instant === true ? 0.0 : this.duration;
        var delay = instant === true ? 0.0 : this.delay;

        this._blackMask.css({ display: 'block' });

        var menuPageStyle = this._generateMenuPageStyle(0);
        var mainPageStyle = this._generateMainPageStyle(0);

        setTimeout(function () {

          ons.animit(this._mainPage[0]).wait(delay).queue(mainPageStyle, {
            duration: duration,
            timing: this.timing
          }).queue(function (done) {
            this._menuPage.css('display', 'none');
            callback();
            done();
          }.bind(this)).play();

          ons.animit(this._menuPage[0]).wait(delay).queue(menuPageStyle, {
            duration: duration,
            timing: this.timing
          }).play();
        }.bind(this), 1000 / 60);
      },

      /**
       * @param {Object} options
       * @param {Number} options.distance
       * @param {Number} options.maxDistance
       */
      translateMenu: function translateMenu(options) {

        this._menuPage.css('display', 'block');
        this._blackMask.css({ display: 'block' });

        var menuPageStyle = this._generateMenuPageStyle(Math.min(options.maxDistance, options.distance));
        var mainPageStyle = this._generateMainPageStyle(Math.min(options.maxDistance, options.distance));
        delete mainPageStyle.opacity;

        ons.animit(this._menuPage[0]).queue(menuPageStyle).play();

        if (Object.keys(mainPageStyle).length > 0) {
          ons.animit(this._mainPage[0]).queue(mainPageStyle).play();
        }
      },

      _generateMenuPageStyle: function _generateMenuPageStyle(distance) {
        var x = this._isRight ? -distance : distance;
        var transform = 'translate3d(' + x + 'px, 0, 0)';

        return {
          transform: transform,
          'box-shadow': distance === 0 ? 'none' : '0px 0 10px 0px rgba(0, 0, 0, 0.2)'
        };
      },

      _generateMainPageStyle: function _generateMainPageStyle(distance) {
        var max = this._menuPage[0].clientWidth;
        var opacity = 1 - 0.1 * distance / max;

        return {
          opacity: opacity
        };
      },

      copy: function copy() {
        return new OverlaySlidingMenuAnimator();
      }
    });

    return OverlaySlidingMenuAnimator;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('PageView', ['$onsen', '$parse', function ($onsen, $parse) {

    var PageView = Class.extend({
      init: function init(scope, element, attrs) {
        var _this = this;

        this._scope = scope;
        this._element = element;
        this._attrs = attrs;

        this._clearListener = scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['init', 'show', 'hide', 'destroy']);

        Object.defineProperty(this, 'onDeviceBackButton', {
          get: function get() {
            return _this._element[0].onDeviceBackButton;
          },
          set: function set(value) {
            if (!_this._userBackButtonHandler) {
              _this._enableBackButtonHandler();
            }
            _this._userBackButtonHandler = value;
          }
        });

        if (this._attrs.ngDeviceBackButton || this._attrs.onDeviceBackButton) {
          this._enableBackButtonHandler();
        }
        if (this._attrs.ngInfiniteScroll) {
          this._element[0].onInfiniteScroll = function (done) {
            $parse(_this._attrs.ngInfiniteScroll)(_this._scope)(done);
          };
        }
      },

      _enableBackButtonHandler: function _enableBackButtonHandler() {
        this._userBackButtonHandler = angular.noop;
        this._element[0].onDeviceBackButton = this._onDeviceBackButton.bind(this);
      },

      _onDeviceBackButton: function _onDeviceBackButton($event) {
        this._userBackButtonHandler($event);

        // ng-device-backbutton
        if (this._attrs.ngDeviceBackButton) {
          $parse(this._attrs.ngDeviceBackButton)(this._scope, { $event: $event });
        }

        // on-device-backbutton
        /* jshint ignore:start */
        if (this._attrs.onDeviceBackButton) {
          var lastEvent = window.$event;
          window.$event = $event;
          new Function(this._attrs.onDeviceBackButton)(); // eslint-disable-line no-new-func
          window.$event = lastEvent;
        }
        /* jshint ignore:end */
      },

      _destroy: function _destroy() {
        this._clearDerivingEvents();

        this._element = null;
        this._scope = null;

        this._clearListener();
      }
    });
    MicroEvent.mixin(PageView);

    return PageView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  angular.module('onsen').factory('PopoverView', ['$onsen', function ($onsen) {

    var PopoverView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingMethods = $onsen.deriveMethods(this, this._element[0], ['show', 'hide']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, this._element[0], ['preshow', 'postshow', 'prehide', 'posthide'], function (detail) {
          if (detail.popover) {
            detail.popover = this;
          }
          return detail;
        }.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingMethods();
        this._clearDerivingEvents();

        this._element.remove();

        this._element = this._scope = null;
      }
    });

    MicroEvent.mixin(PopoverView);
    $onsen.derivePropertiesFromElement(PopoverView, ['cancelable', 'disabled', 'onDeviceBackButton']);

    return PopoverView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

angular.module('onsen').value('PopoverAnimator', ons._internal.PopoverAnimator).value('FadePopoverAnimator', ons._internal.FadePopoverAnimator);
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('PullHookView', ['$onsen', '$parse', function ($onsen, $parse) {

    var PullHookView = Class.extend({

      init: function init(scope, element, attrs) {
        var _this = this;

        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._clearDerivingEvents = $onsen.deriveEvents(this, this._element[0], ['changestate'], function (detail) {
          if (detail.pullHook) {
            detail.pullHook = _this;
          }
          return detail;
        });

        this.on('changestate', function () {
          return _this._scope.$evalAsync();
        });

        this._element[0].onAction = function (done) {
          if (_this._attrs.ngAction) {
            _this._scope.$eval(_this._attrs.ngAction, { $done: done });
          } else {
            _this.onAction ? _this.onAction(done) : done();
          }
        };

        this._scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingEvents();

        this._element = this._scope = this._attrs = null;
      }
    });

    MicroEvent.mixin(PullHookView);
    $onsen.derivePropertiesFromElement(PullHookView, ['state', 'pullDistance', 'height', 'thresholdHeight', 'disabled']);

    return PullHookView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('PushSlidingMenuAnimator', ['SlidingMenuAnimator', function (SlidingMenuAnimator) {

    var PushSlidingMenuAnimator = SlidingMenuAnimator.extend({

      _isRight: false,
      _element: undefined,
      _menuPage: undefined,
      _mainPage: undefined,
      _width: undefined,

      /**
       * @param {jqLite} element "ons-sliding-menu" or "ons-split-view" element
       * @param {jqLite} mainPage
       * @param {jqLite} menuPage
       * @param {Object} options
       * @param {String} options.width "width" style value
       * @param {Boolean} options.isRight
       */
      setup: function setup(element, mainPage, menuPage, options) {
        options = options || {};

        this._element = element;
        this._mainPage = mainPage;
        this._menuPage = menuPage;

        this._isRight = !!options.isRight;
        this._width = options.width || '90%';

        menuPage.css({
          width: options.width,
          display: 'none'
        });

        if (this._isRight) {
          menuPage.css({
            right: '-' + options.width,
            left: 'auto'
          });
        } else {
          menuPage.css({
            right: 'auto',
            left: '-' + options.width
          });
        }
      },

      /**
       * @param {Object} options
       * @param {String} options.width
       * @param {Object} options.isRight
       */
      onResized: function onResized(options) {
        this._menuPage.css('width', options.width);

        if (this._isRight) {
          this._menuPage.css({
            right: '-' + options.width,
            left: 'auto'
          });
        } else {
          this._menuPage.css({
            right: 'auto',
            left: '-' + options.width
          });
        }

        if (options.isOpened) {
          var max = this._menuPage[0].clientWidth;
          var mainPageTransform = this._generateAbovePageTransform(max);
          var menuPageStyle = this._generateBehindPageStyle(max);

          ons.animit(this._mainPage[0]).queue({ transform: mainPageTransform }).play();
          ons.animit(this._menuPage[0]).queue(menuPageStyle).play();
        }
      },

      /**
       */
      destroy: function destroy() {
        this._mainPage.removeAttr('style');
        this._menuPage.removeAttr('style');

        this._element = this._mainPage = this._menuPage = null;
      },

      /**
       * @param {Function} callback
       * @param {Boolean} instant
       */
      openMenu: function openMenu(callback, instant) {
        var duration = instant === true ? 0.0 : this.duration;
        var delay = instant === true ? 0.0 : this.delay;

        this._menuPage.css('display', 'block');

        var max = this._menuPage[0].clientWidth;

        var aboveTransform = this._generateAbovePageTransform(max);
        var behindStyle = this._generateBehindPageStyle(max);

        setTimeout(function () {

          ons.animit(this._mainPage[0]).wait(delay).queue({
            transform: aboveTransform
          }, {
            duration: duration,
            timing: this.timing
          }).queue(function (done) {
            callback();
            done();
          }).play();

          ons.animit(this._menuPage[0]).wait(delay).queue(behindStyle, {
            duration: duration,
            timing: this.timing
          }).play();
        }.bind(this), 1000 / 60);
      },

      /**
       * @param {Function} callback
       * @param {Boolean} instant
       */
      closeMenu: function closeMenu(callback, instant) {
        var duration = instant === true ? 0.0 : this.duration;
        var delay = instant === true ? 0.0 : this.delay;

        var aboveTransform = this._generateAbovePageTransform(0);
        var behindStyle = this._generateBehindPageStyle(0);

        setTimeout(function () {

          ons.animit(this._mainPage[0]).wait(delay).queue({
            transform: aboveTransform
          }, {
            duration: duration,
            timing: this.timing
          }).queue({
            transform: 'translate3d(0, 0, 0)'
          }).queue(function (done) {
            this._menuPage.css('display', 'none');
            callback();
            done();
          }.bind(this)).play();

          ons.animit(this._menuPage[0]).wait(delay).queue(behindStyle, {
            duration: duration,
            timing: this.timing
          }).queue(function (done) {
            done();
          }).play();
        }.bind(this), 1000 / 60);
      },

      /**
       * @param {Object} options
       * @param {Number} options.distance
       * @param {Number} options.maxDistance
       */
      translateMenu: function translateMenu(options) {

        this._menuPage.css('display', 'block');

        var aboveTransform = this._generateAbovePageTransform(Math.min(options.maxDistance, options.distance));
        var behindStyle = this._generateBehindPageStyle(Math.min(options.maxDistance, options.distance));

        ons.animit(this._mainPage[0]).queue({ transform: aboveTransform }).play();

        ons.animit(this._menuPage[0]).queue(behindStyle).play();
      },

      _generateAbovePageTransform: function _generateAbovePageTransform(distance) {
        var x = this._isRight ? -distance : distance;
        var aboveTransform = 'translate3d(' + x + 'px, 0, 0)';

        return aboveTransform;
      },

      _generateBehindPageStyle: function _generateBehindPageStyle(distance) {
        var behindX = this._isRight ? -distance : distance;
        var behindTransform = 'translate3d(' + behindX + 'px, 0, 0)';

        return {
          transform: behindTransform
        };
      },

      copy: function copy() {
        return new PushSlidingMenuAnimator();
      }
    });

    return PushSlidingMenuAnimator;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('RevealSlidingMenuAnimator', ['SlidingMenuAnimator', function (SlidingMenuAnimator) {

    var RevealSlidingMenuAnimator = SlidingMenuAnimator.extend({

      _blackMask: undefined,

      _isRight: false,

      _menuPage: undefined,
      _element: undefined,
      _mainPage: undefined,

      /**
       * @param {jqLite} element "ons-sliding-menu" or "ons-split-view" element
       * @param {jqLite} mainPage
       * @param {jqLite} menuPage
       * @param {Object} options
       * @param {String} options.width "width" style value
       * @param {Boolean} options.isRight
       */
      setup: function setup(element, mainPage, menuPage, options) {
        this._element = element;
        this._menuPage = menuPage;
        this._mainPage = mainPage;
        this._isRight = !!options.isRight;
        this._width = options.width || '90%';

        mainPage.css({
          boxShadow: '0px 0 10px 0px rgba(0, 0, 0, 0.2)'
        });

        menuPage.css({
          width: options.width,
          opacity: 0.9,
          display: 'none'
        });

        if (this._isRight) {
          menuPage.css({
            right: '0px',
            left: 'auto'
          });
        } else {
          menuPage.css({
            right: 'auto',
            left: '0px'
          });
        }

        this._blackMask = angular.element('<div></div>').css({
          backgroundColor: 'black',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          position: 'absolute',
          display: 'none'
        });

        element.prepend(this._blackMask);

        // Dirty fix for broken rendering bug on android 4.x.
        ons.animit(mainPage[0]).queue({ transform: 'translate3d(0, 0, 0)' }).play();
      },

      /**
       * @param {Object} options
       * @param {Boolean} options.isOpened
       * @param {String} options.width
       */
      onResized: function onResized(options) {
        this._width = options.width;
        this._menuPage.css('width', this._width);

        if (options.isOpened) {
          var max = this._menuPage[0].clientWidth;

          var aboveTransform = this._generateAbovePageTransform(max);
          var behindStyle = this._generateBehindPageStyle(max);

          ons.animit(this._mainPage[0]).queue({ transform: aboveTransform }).play();
          ons.animit(this._menuPage[0]).queue(behindStyle).play();
        }
      },

      /**
       * @param {jqLite} element "ons-sliding-menu" or "ons-split-view" element
       * @param {jqLite} mainPage
       * @param {jqLite} menuPage
       */
      destroy: function destroy() {
        if (this._blackMask) {
          this._blackMask.remove();
          this._blackMask = null;
        }

        if (this._mainPage) {
          this._mainPage.attr('style', '');
        }

        if (this._menuPage) {
          this._menuPage.attr('style', '');
        }

        this._mainPage = this._menuPage = this._element = undefined;
      },

      /**
       * @param {Function} callback
       * @param {Boolean} instant
       */
      openMenu: function openMenu(callback, instant) {
        var duration = instant === true ? 0.0 : this.duration;
        var delay = instant === true ? 0.0 : this.delay;

        this._menuPage.css('display', 'block');
        this._blackMask.css('display', 'block');

        var max = this._menuPage[0].clientWidth;

        var aboveTransform = this._generateAbovePageTransform(max);
        var behindStyle = this._generateBehindPageStyle(max);

        setTimeout(function () {

          ons.animit(this._mainPage[0]).wait(delay).queue({
            transform: aboveTransform
          }, {
            duration: duration,
            timing: this.timing
          }).queue(function (done) {
            callback();
            done();
          }).play();

          ons.animit(this._menuPage[0]).wait(delay).queue(behindStyle, {
            duration: duration,
            timing: this.timing
          }).play();
        }.bind(this), 1000 / 60);
      },

      /**
       * @param {Function} callback
       * @param {Boolean} instant
       */
      closeMenu: function closeMenu(callback, instant) {
        var duration = instant === true ? 0.0 : this.duration;
        var delay = instant === true ? 0.0 : this.delay;

        this._blackMask.css('display', 'block');

        var aboveTransform = this._generateAbovePageTransform(0);
        var behindStyle = this._generateBehindPageStyle(0);

        setTimeout(function () {

          ons.animit(this._mainPage[0]).wait(delay).queue({
            transform: aboveTransform
          }, {
            duration: duration,
            timing: this.timing
          }).queue({
            transform: 'translate3d(0, 0, 0)'
          }).queue(function (done) {
            this._menuPage.css('display', 'none');
            callback();
            done();
          }.bind(this)).play();

          ons.animit(this._menuPage[0]).wait(delay).queue(behindStyle, {
            duration: duration,
            timing: this.timing
          }).queue(function (done) {
            done();
          }).play();
        }.bind(this), 1000 / 60);
      },

      /**
       * @param {Object} options
       * @param {Number} options.distance
       * @param {Number} options.maxDistance
       */
      translateMenu: function translateMenu(options) {

        this._menuPage.css('display', 'block');
        this._blackMask.css('display', 'block');

        var aboveTransform = this._generateAbovePageTransform(Math.min(options.maxDistance, options.distance));
        var behindStyle = this._generateBehindPageStyle(Math.min(options.maxDistance, options.distance));
        delete behindStyle.opacity;

        ons.animit(this._mainPage[0]).queue({ transform: aboveTransform }).play();

        ons.animit(this._menuPage[0]).queue(behindStyle).play();
      },

      _generateAbovePageTransform: function _generateAbovePageTransform(distance) {
        var x = this._isRight ? -distance : distance;
        var aboveTransform = 'translate3d(' + x + 'px, 0, 0)';

        return aboveTransform;
      },

      _generateBehindPageStyle: function _generateBehindPageStyle(distance) {
        var max = this._menuPage[0].getBoundingClientRect().width;

        var behindDistance = (distance - max) / max * 10;
        behindDistance = isNaN(behindDistance) ? 0 : Math.max(Math.min(behindDistance, 0), -10);

        var behindX = this._isRight ? -behindDistance : behindDistance;
        var behindTransform = 'translate3d(' + behindX + '%, 0, 0)';
        var opacity = 1 + behindDistance / 100;

        return {
          transform: behindTransform,
          opacity: opacity
        };
      },

      copy: function copy() {
        return new RevealSlidingMenuAnimator();
      }
    });

    return RevealSlidingMenuAnimator;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  var SlidingMenuViewModel = Class.extend({

    /**
     * @member Number
     */
    _distance: 0,

    /**
     * @member Number
     */
    _maxDistance: undefined,

    /**
     * @param {Object} options
     * @param {Number} maxDistance
     */
    init: function init(options) {
      if (!angular.isNumber(options.maxDistance)) {
        throw new Error('options.maxDistance must be number');
      }

      this.setMaxDistance(options.maxDistance);
    },

    /**
     * @param {Number} maxDistance
     */
    setMaxDistance: function setMaxDistance(maxDistance) {
      if (maxDistance <= 0) {
        throw new Error('maxDistance must be greater then zero.');
      }

      if (this.isOpened()) {
        this._distance = maxDistance;
      }
      this._maxDistance = maxDistance;
    },

    /**
     * @return {Boolean}
     */
    shouldOpen: function shouldOpen() {
      return !this.isOpened() && this._distance >= this._maxDistance / 2;
    },

    /**
     * @return {Boolean}
     */
    shouldClose: function shouldClose() {
      return !this.isClosed() && this._distance < this._maxDistance / 2;
    },

    openOrClose: function openOrClose(options) {
      if (this.shouldOpen()) {
        this.open(options);
      } else if (this.shouldClose()) {
        this.close(options);
      }
    },

    close: function close(options) {
      var callback = options.callback || function () {};

      if (!this.isClosed()) {
        this._distance = 0;
        this.emit('close', options);
      } else {
        callback();
      }
    },

    open: function open(options) {
      var callback = options.callback || function () {};

      if (!this.isOpened()) {
        this._distance = this._maxDistance;
        this.emit('open', options);
      } else {
        callback();
      }
    },

    /**
     * @return {Boolean}
     */
    isClosed: function isClosed() {
      return this._distance === 0;
    },

    /**
     * @return {Boolean}
     */
    isOpened: function isOpened() {
      return this._distance === this._maxDistance;
    },

    /**
     * @return {Number}
     */
    getX: function getX() {
      return this._distance;
    },

    /**
     * @return {Number}
     */
    getMaxDistance: function getMaxDistance() {
      return this._maxDistance;
    },

    /**
     * @param {Number} x
     */
    translate: function translate(x) {
      this._distance = Math.max(1, Math.min(this._maxDistance - 1, x));

      var options = {
        distance: this._distance,
        maxDistance: this._maxDistance
      };

      this.emit('translate', options);
    },

    toggle: function toggle() {
      if (this.isClosed()) {
        this.open();
      } else {
        this.close();
      }
    }
  });
  MicroEvent.mixin(SlidingMenuViewModel);

  module.factory('SlidingMenuView', ['$onsen', '$compile', '$parse', 'AnimationChooser', 'SlidingMenuAnimator', 'RevealSlidingMenuAnimator', 'PushSlidingMenuAnimator', 'OverlaySlidingMenuAnimator', function ($onsen, $compile, $parse, AnimationChooser, SlidingMenuAnimator, RevealSlidingMenuAnimator, PushSlidingMenuAnimator, OverlaySlidingMenuAnimator) {

    var SlidingMenuView = Class.extend({
      _scope: undefined,
      _attrs: undefined,

      _element: undefined,
      _menuPage: undefined,
      _mainPage: undefined,

      _doorLock: undefined,

      _isRightMenu: false,

      init: function init(scope, element, attrs) {
        this._scope = scope;
        this._attrs = attrs;
        this._element = element;

        this._menuPage = angular.element(element[0].querySelector('.onsen-sliding-menu__menu'));
        this._mainPage = angular.element(element[0].querySelector('.onsen-sliding-menu__main'));

        this._doorLock = new ons._DoorLock();

        this._isRightMenu = attrs.side === 'right';

        // Close menu on tap event.
        this._mainPageGestureDetector = new ons.GestureDetector(this._mainPage[0]);
        this._boundOnTap = this._onTap.bind(this);

        var maxDistance = this._normalizeMaxSlideDistanceAttr();
        this._logic = new SlidingMenuViewModel({ maxDistance: Math.max(maxDistance, 1) });
        this._logic.on('translate', this._translate.bind(this));
        this._logic.on('open', function (options) {
          this._open(options);
        }.bind(this));
        this._logic.on('close', function (options) {
          this._close(options);
        }.bind(this));

        attrs.$observe('maxSlideDistance', this._onMaxSlideDistanceChanged.bind(this));
        attrs.$observe('swipeable', this._onSwipeableChanged.bind(this));

        this._boundOnWindowResize = this._onWindowResize.bind(this);
        window.addEventListener('resize', this._boundOnWindowResize);

        this._boundHandleEvent = this._handleEvent.bind(this);
        this._bindEvents();

        if (attrs.mainPage) {
          this.setMainPage(attrs.mainPage);
        }

        if (attrs.menuPage) {
          this.setMenuPage(attrs.menuPage);
        }

        this._deviceBackButtonHandler = ons._deviceBackButtonDispatcher.createHandler(this._element[0], this._onDeviceBackButton.bind(this));

        var unlock = this._doorLock.lock();

        window.setTimeout(function () {
          var maxDistance = this._normalizeMaxSlideDistanceAttr();
          this._logic.setMaxDistance(maxDistance);

          this._menuPage.css({ opacity: 1 });

          var animationChooser = new AnimationChooser({
            animators: SlidingMenuView._animatorDict,
            baseClass: SlidingMenuAnimator,
            baseClassName: 'SlidingMenuAnimator',
            defaultAnimation: attrs.type,
            defaultAnimationOptions: $parse(attrs.animationOptions)()
          });
          this._animator = animationChooser.newAnimator();
          this._animator.setup(this._element, this._mainPage, this._menuPage, {
            isRight: this._isRightMenu,
            width: this._attrs.maxSlideDistance || '90%'
          });

          unlock();
        }.bind(this), 400);

        scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['init', 'show', 'hide', 'destroy']);

        if (!attrs.swipeable) {
          this.setSwipeable(true);
        }
      },

      getDeviceBackButtonHandler: function getDeviceBackButtonHandler() {
        return this._deviceBackButtonHandler;
      },

      _onDeviceBackButton: function _onDeviceBackButton(event) {
        if (this.isMenuOpened()) {
          this.closeMenu();
        } else {
          event.callParentHandler();
        }
      },

      _onTap: function _onTap() {
        if (this.isMenuOpened()) {
          this.closeMenu();
        }
      },

      _refreshMenuPageWidth: function _refreshMenuPageWidth() {
        var width = 'maxSlideDistance' in this._attrs ? this._attrs.maxSlideDistance : '90%';

        if (this._animator) {
          this._animator.onResized({
            isOpened: this._logic.isOpened(),
            width: width
          });
        }
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingEvents();

        this._deviceBackButtonHandler.destroy();
        window.removeEventListener('resize', this._boundOnWindowResize);

        this._mainPageGestureDetector.off('tap', this._boundOnTap);
        this._element = this._scope = this._attrs = null;
      },

      _onSwipeableChanged: function _onSwipeableChanged(swipeable) {
        swipeable = swipeable === '' || swipeable === undefined || swipeable == 'true';

        this.setSwipeable(swipeable);
      },

      /**
       * @param {Boolean} enabled
       */
      setSwipeable: function setSwipeable(enabled) {
        if (enabled) {
          this._activateGestureDetector();
        } else {
          this._deactivateGestureDetector();
        }
      },

      _onWindowResize: function _onWindowResize() {
        this._recalculateMAX();
        this._refreshMenuPageWidth();
      },

      _onMaxSlideDistanceChanged: function _onMaxSlideDistanceChanged() {
        this._recalculateMAX();
        this._refreshMenuPageWidth();
      },

      /**
       * @return {Number}
       */
      _normalizeMaxSlideDistanceAttr: function _normalizeMaxSlideDistanceAttr() {
        var maxDistance = this._attrs.maxSlideDistance;

        if (!('maxSlideDistance' in this._attrs)) {
          maxDistance = 0.9 * this._mainPage[0].clientWidth;
        } else if (typeof maxDistance == 'string') {
          if (maxDistance.indexOf('px', maxDistance.length - 2) !== -1) {
            maxDistance = parseInt(maxDistance.replace('px', ''), 10);
          } else if (maxDistance.indexOf('%', maxDistance.length - 1) > 0) {
            maxDistance = maxDistance.replace('%', '');
            maxDistance = parseFloat(maxDistance) / 100 * this._mainPage[0].clientWidth;
          }
        } else {
          throw new Error('invalid state');
        }

        return maxDistance;
      },

      _recalculateMAX: function _recalculateMAX() {
        var maxDistance = this._normalizeMaxSlideDistanceAttr();

        if (maxDistance) {
          this._logic.setMaxDistance(parseInt(maxDistance, 10));
        }
      },

      _activateGestureDetector: function _activateGestureDetector() {
        this._gestureDetector.on('touch dragleft dragright swipeleft swiperight release', this._boundHandleEvent);
      },

      _deactivateGestureDetector: function _deactivateGestureDetector() {
        this._gestureDetector.off('touch dragleft dragright swipeleft swiperight release', this._boundHandleEvent);
      },

      _bindEvents: function _bindEvents() {
        this._gestureDetector = new ons.GestureDetector(this._element[0], {
          dragMinDistance: 1
        });
      },

      _appendMainPage: function _appendMainPage(pageUrl, templateHTML) {
        var _this = this;

        var pageScope = this._scope.$new();
        var pageContent = angular.element(templateHTML);
        var link = $compile(pageContent);

        this._mainPage.append(pageContent);

        if (this._currentPageElement) {
          this._currentPageElement.remove();
          this._currentPageScope.$destroy();
        }

        link(pageScope);

        this._currentPageElement = pageContent;
        this._currentPageScope = pageScope;
        this._currentPageUrl = pageUrl;

        setImmediate(function () {
          _this._currentPageElement[0]._show();
        });
      },

      /**
       * @param {String}
       */
      _appendMenuPage: function _appendMenuPage(templateHTML) {
        var pageScope = this._scope.$new();
        var pageContent = angular.element(templateHTML);
        var link = $compile(pageContent);

        this._menuPage.append(pageContent);

        if (this._currentMenuPageScope) {
          this._currentMenuPageScope.$destroy();
          this._currentMenuPageElement.remove();
        }

        link(pageScope);

        this._currentMenuPageElement = pageContent;
        this._currentMenuPageScope = pageScope;
      },

      /**
       * @param {String} page
       * @param {Object} options
       * @param {Boolean} [options.closeMenu]
       * @param {Boolean} [options.callback]
       */
      setMenuPage: function setMenuPage(page, options) {
        if (page) {
          options = options || {};
          options.callback = options.callback || function () {};

          var self = this;
          $onsen.getPageHTMLAsync(page).then(function (html) {
            self._appendMenuPage(angular.element(html));
            if (options.closeMenu) {
              self.close();
            }
            options.callback();
          }, function () {
            throw new Error('Page is not found: ' + page);
          });
        } else {
          throw new Error('cannot set undefined page');
        }
      },

      /**
       * @param {String} pageUrl
       * @param {Object} options
       * @param {Boolean} [options.closeMenu]
       * @param {Boolean} [options.callback]
       */
      setMainPage: function setMainPage(pageUrl, options) {
        options = options || {};
        options.callback = options.callback || function () {};

        var done = function () {
          if (options.closeMenu) {
            this.close();
          }
          options.callback();
        }.bind(this);

        if (this._currentPageUrl === pageUrl) {
          done();
          return;
        }

        if (pageUrl) {
          var self = this;
          $onsen.getPageHTMLAsync(pageUrl).then(function (html) {
            self._appendMainPage(pageUrl, html);
            done();
          }, function () {
            throw new Error('Page is not found: ' + page);
          });
        } else {
          throw new Error('cannot set undefined page');
        }
      },

      _handleEvent: function _handleEvent(event) {

        if (this._doorLock.isLocked()) {
          return;
        }

        if (this._isInsideIgnoredElement(event.target)) {
          this._deactivateGestureDetector();
        }

        switch (event.type) {
          case 'dragleft':
          case 'dragright':

            if (this._logic.isClosed() && !this._isInsideSwipeTargetArea(event)) {
              return;
            }

            event.gesture.preventDefault();

            var deltaX = event.gesture.deltaX;
            var deltaDistance = this._isRightMenu ? -deltaX : deltaX;

            var startEvent = event.gesture.startEvent;

            if (!('isOpened' in startEvent)) {
              startEvent.isOpened = this._logic.isOpened();
            }

            if (deltaDistance < 0 && this._logic.isClosed()) {
              break;
            }

            if (deltaDistance > 0 && this._logic.isOpened()) {
              break;
            }

            var distance = startEvent.isOpened ? deltaDistance + this._logic.getMaxDistance() : deltaDistance;

            this._logic.translate(distance);

            break;

          case 'swipeleft':
            event.gesture.preventDefault();

            if (this._logic.isClosed() && !this._isInsideSwipeTargetArea(event)) {
              return;
            }

            if (this._isRightMenu) {
              this.open();
            } else {
              this.close();
            }

            event.gesture.stopDetect();
            break;

          case 'swiperight':
            event.gesture.preventDefault();

            if (this._logic.isClosed() && !this._isInsideSwipeTargetArea(event)) {
              return;
            }

            if (this._isRightMenu) {
              this.close();
            } else {
              this.open();
            }

            event.gesture.stopDetect();
            break;

          case 'release':
            this._lastDistance = null;

            if (this._logic.shouldOpen()) {
              this.open();
            } else if (this._logic.shouldClose()) {
              this.close();
            }

            break;
        }
      },

      /**
       * @param {jqLite} element
       * @return {Boolean}
       */
      _isInsideIgnoredElement: function _isInsideIgnoredElement(element) {
        do {
          if (element.getAttribute && element.getAttribute('sliding-menu-ignore')) {
            return true;
          }
          element = element.parentNode;
        } while (element);

        return false;
      },

      _isInsideSwipeTargetArea: function _isInsideSwipeTargetArea(event) {
        var x = event.gesture.center.pageX;

        if (!('_swipeTargetWidth' in event.gesture.startEvent)) {
          event.gesture.startEvent._swipeTargetWidth = this._getSwipeTargetWidth();
        }

        var targetWidth = event.gesture.startEvent._swipeTargetWidth;
        return this._isRightMenu ? this._mainPage[0].clientWidth - x < targetWidth : x < targetWidth;
      },

      _getSwipeTargetWidth: function _getSwipeTargetWidth() {
        var targetWidth = this._attrs.swipeTargetWidth;

        if (typeof targetWidth == 'string') {
          targetWidth = targetWidth.replace('px', '');
        }

        var width = parseInt(targetWidth, 10);
        if (width < 0 || !targetWidth) {
          return this._mainPage[0].clientWidth;
        } else {
          return width;
        }
      },

      closeMenu: function closeMenu() {
        return this.close.apply(this, arguments);
      },

      /**
       * Close sliding-menu page.
       *
       * @param {Object} options
       */
      close: function close(options) {
        options = options || {};
        options = typeof options == 'function' ? { callback: options } : options;

        if (!this._logic.isClosed()) {
          this.emit('preclose', {
            slidingMenu: this
          });

          this._doorLock.waitUnlock(function () {
            this._logic.close(options);
          }.bind(this));
        }
      },

      _close: function _close(options) {
        var callback = options.callback || function () {},
            unlock = this._doorLock.lock(),
            instant = options.animation == 'none';

        this._animator.closeMenu(function () {
          unlock();

          this._mainPage.children().css('pointer-events', '');
          this._mainPageGestureDetector.off('tap', this._boundOnTap);

          this.emit('postclose', {
            slidingMenu: this
          });

          callback();
        }.bind(this), instant);
      },

      /**
       * Open sliding-menu page.
       *
       * @param {Object} [options]
       * @param {Function} [options.callback]
       */
      openMenu: function openMenu() {
        return this.open.apply(this, arguments);
      },

      /**
       * Open sliding-menu page.
       *
       * @param {Object} [options]
       * @param {Function} [options.callback]
       */
      open: function open(options) {
        options = options || {};
        options = typeof options == 'function' ? { callback: options } : options;

        this.emit('preopen', {
          slidingMenu: this
        });

        this._doorLock.waitUnlock(function () {
          this._logic.open(options);
        }.bind(this));
      },

      _open: function _open(options) {
        var callback = options.callback || function () {},
            unlock = this._doorLock.lock(),
            instant = options.animation == 'none';

        this._animator.openMenu(function () {
          unlock();

          this._mainPage.children().css('pointer-events', 'none');
          this._mainPageGestureDetector.on('tap', this._boundOnTap);

          this.emit('postopen', {
            slidingMenu: this
          });

          callback();
        }.bind(this), instant);
      },

      /**
       * Toggle sliding-menu page.
       * @param {Object} [options]
       * @param {Function} [options.callback]
       */
      toggle: function toggle(options) {
        if (this._logic.isClosed()) {
          this.open(options);
        } else {
          this.close(options);
        }
      },

      /**
       * Toggle sliding-menu page.
       */
      toggleMenu: function toggleMenu() {
        return this.toggle.apply(this, arguments);
      },

      /**
       * @return {Boolean}
       */
      isMenuOpened: function isMenuOpened() {
        return this._logic.isOpened();
      },

      /**
       * @param {Object} event
       */
      _translate: function _translate(event) {
        this._animator.translateMenu(event);
      }
    });

    // Preset sliding menu animators.
    SlidingMenuView._animatorDict = {
      'default': RevealSlidingMenuAnimator,
      'overlay': OverlaySlidingMenuAnimator,
      'reveal': RevealSlidingMenuAnimator,
      'push': PushSlidingMenuAnimator
    };

    /**
     * @param {String} name
     * @param {Function} Animator
     */
    SlidingMenuView.registerAnimator = function (name, Animator) {
      if (!(Animator.prototype instanceof SlidingMenuAnimator)) {
        throw new Error('"Animator" param must inherit SlidingMenuAnimator');
      }

      this._animatorDict[name] = Animator;
    };

    MicroEvent.mixin(SlidingMenuView);

    return SlidingMenuView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('SlidingMenuAnimator', function () {
    return Class.extend({

      delay: 0,
      duration: 0.4,
      timing: 'cubic-bezier(.1, .7, .1, 1)',

      /**
       * @param {Object} options
       * @param {String} options.timing
       * @param {Number} options.duration
       * @param {Number} options.delay
       */
      init: function init(options) {
        options = options || {};

        this.timing = options.timing || this.timing;
        this.duration = options.duration !== undefined ? options.duration : this.duration;
        this.delay = options.delay !== undefined ? options.delay : this.delay;
      },

      /**
       * @param {jqLite} element "ons-sliding-menu" or "ons-split-view" element
       * @param {jqLite} mainPage
       * @param {jqLite} menuPage
       * @param {Object} options
       * @param {String} options.width "width" style value
       * @param {Boolean} options.isRight
       */
      setup: function setup(element, mainPage, menuPage, options) {},

      /**
       * @param {Object} options
       * @param {Boolean} options.isRight
       * @param {Boolean} options.isOpened
       * @param {String} options.width
       */
      onResized: function onResized(options) {},

      /**
       * @param {Function} callback
       */
      openMenu: function openMenu(callback) {},

      /**
       * @param {Function} callback
       */
      closeClose: function closeClose(callback) {},

      /**
       */
      destroy: function destroy() {},

      /**
       * @param {Object} options
       * @param {Number} options.distance
       * @param {Number} options.maxDistance
       */
      translateMenu: function translateMenu(mainPage, menuPage, options) {},

      /**
       * @return {SlidingMenuAnimator}
       */
      copy: function copy() {
        throw new Error('Override copy method.');
      }
    });
  });
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('SpeedDialView', ['$onsen', function ($onsen) {

    /**
     * @class SpeedDialView
     */
    var SpeedDialView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingMethods = $onsen.deriveMethods(this, element[0], ['show', 'hide', 'showItems', 'hideItems', 'isOpen', 'toggle', 'toggleItems']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['open', 'close']).bind(this);
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingEvents();
        this._clearDerivingMethods();

        this._element = this._scope = this._attrs = null;
      }
    });

    MicroEvent.mixin(SpeedDialView);

    $onsen.derivePropertiesFromElement(SpeedDialView, ['disabled', 'visible', 'inline']);

    return SpeedDialView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('SplitView', ['$compile', 'RevealSlidingMenuAnimator', '$onsen', '$onsGlobal', function ($compile, RevealSlidingMenuAnimator, $onsen, $onsGlobal) {
    var SPLIT_MODE = 0;
    var COLLAPSE_MODE = 1;
    var MAIN_PAGE_RATIO = 0.9;

    var SplitView = Class.extend({

      init: function init(scope, element, attrs) {
        element.addClass('onsen-sliding-menu');

        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._mainPage = angular.element(element[0].querySelector('.onsen-split-view__main'));
        this._secondaryPage = angular.element(element[0].querySelector('.onsen-split-view__secondary'));

        this._max = this._mainPage[0].clientWidth * MAIN_PAGE_RATIO;
        this._mode = SPLIT_MODE;
        this._doorLock = new ons._DoorLock();

        this._doSplit = false;
        this._doCollapse = false;

        $onsGlobal.orientation.on('change', this._onResize.bind(this));

        this._animator = new RevealSlidingMenuAnimator();

        this._element.css('display', 'none');

        if (attrs.mainPage) {
          this.setMainPage(attrs.mainPage);
        }

        if (attrs.secondaryPage) {
          this.setSecondaryPage(attrs.secondaryPage);
        }

        var unlock = this._doorLock.lock();

        this._considerChangingCollapse();
        this._setSize();

        setTimeout(function () {
          this._element.css('display', 'block');
          unlock();
        }.bind(this), 1000 / 60 * 2);

        scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['init', 'show', 'hide', 'destroy']);
      },

      /**
       * @param {String} templateHTML
       */
      _appendSecondPage: function _appendSecondPage(templateHTML) {
        var pageScope = this._scope.$new();
        var pageContent = $compile(templateHTML)(pageScope);

        this._secondaryPage.append(pageContent);

        if (this._currentSecondaryPageElement) {
          this._currentSecondaryPageElement.remove();
          this._currentSecondaryPageScope.$destroy();
        }

        this._currentSecondaryPageElement = pageContent;
        this._currentSecondaryPageScope = pageScope;
      },

      /**
       * @param {String} templateHTML
       */
      _appendMainPage: function _appendMainPage(templateHTML) {
        var _this = this;

        var pageScope = this._scope.$new();
        var pageContent = $compile(templateHTML)(pageScope);

        this._mainPage.append(pageContent);

        if (this._currentPage) {
          this._currentPageScope.$destroy();
        }

        this._currentPage = pageContent;
        this._currentPageScope = pageScope;

        setImmediate(function () {
          _this._currentPage[0]._show();
        });
      },

      /**
       * @param {String} page
       */
      setSecondaryPage: function setSecondaryPage(page) {
        if (page) {
          $onsen.getPageHTMLAsync(page).then(function (html) {
            this._appendSecondPage(angular.element(html.trim()));
          }.bind(this), function () {
            throw new Error('Page is not found: ' + page);
          });
        } else {
          throw new Error('cannot set undefined page');
        }
      },

      /**
       * @param {String} page
       */
      setMainPage: function setMainPage(page) {
        if (page) {
          $onsen.getPageHTMLAsync(page).then(function (html) {
            this._appendMainPage(angular.element(html.trim()));
          }.bind(this), function () {
            throw new Error('Page is not found: ' + page);
          });
        } else {
          throw new Error('cannot set undefined page');
        }
      },

      _onResize: function _onResize() {
        var lastMode = this._mode;

        this._considerChangingCollapse();

        if (lastMode === COLLAPSE_MODE && this._mode === COLLAPSE_MODE) {
          this._animator.onResized({
            isOpened: false,
            width: '90%'
          });
        }

        this._max = this._mainPage[0].clientWidth * MAIN_PAGE_RATIO;
      },

      _considerChangingCollapse: function _considerChangingCollapse() {
        var should = this._shouldCollapse();

        if (should && this._mode !== COLLAPSE_MODE) {
          this._fireUpdateEvent();
          if (this._doSplit) {
            this._activateSplitMode();
          } else {
            this._activateCollapseMode();
          }
        } else if (!should && this._mode === COLLAPSE_MODE) {
          this._fireUpdateEvent();
          if (this._doCollapse) {
            this._activateCollapseMode();
          } else {
            this._activateSplitMode();
          }
        }

        this._doCollapse = this._doSplit = false;
      },

      update: function update() {
        this._fireUpdateEvent();

        var should = this._shouldCollapse();

        if (this._doSplit) {
          this._activateSplitMode();
        } else if (this._doCollapse) {
          this._activateCollapseMode();
        } else if (should) {
          this._activateCollapseMode();
        } else if (!should) {
          this._activateSplitMode();
        }

        this._doSplit = this._doCollapse = false;
      },

      _getOrientation: function _getOrientation() {
        if ($onsGlobal.orientation.isPortrait()) {
          return 'portrait';
        } else {
          return 'landscape';
        }
      },

      getCurrentMode: function getCurrentMode() {
        if (this._mode === COLLAPSE_MODE) {
          return 'collapse';
        } else {
          return 'split';
        }
      },

      _shouldCollapse: function _shouldCollapse() {
        var c = 'portrait';
        if (typeof this._attrs.collapse === 'string') {
          c = this._attrs.collapse.trim();
        }

        if (c == 'portrait') {
          return $onsGlobal.orientation.isPortrait();
        } else if (c == 'landscape') {
          return $onsGlobal.orientation.isLandscape();
        } else if (c.substr(0, 5) == 'width') {
          var num = c.split(' ')[1];
          if (num.indexOf('px') >= 0) {
            num = num.substr(0, num.length - 2);
          }

          var width = window.innerWidth;

          return isNumber(num) && width < num;
        } else {
          var mq = window.matchMedia(c);
          return mq.matches;
        }
      },

      _setSize: function _setSize() {
        if (this._mode === SPLIT_MODE) {
          if (!this._attrs.mainPageWidth) {
            this._attrs.mainPageWidth = '70';
          }

          var secondarySize = 100 - this._attrs.mainPageWidth.replace('%', '');
          this._secondaryPage.css({
            width: secondarySize + '%',
            opacity: 1
          });

          this._mainPage.css({
            width: this._attrs.mainPageWidth + '%'
          });

          this._mainPage.css('left', secondarySize + '%');
        }
      },

      _fireEvent: function _fireEvent(name) {
        this.emit(name, {
          splitView: this,
          width: window.innerWidth,
          orientation: this._getOrientation()
        });
      },

      _fireUpdateEvent: function _fireUpdateEvent() {
        var that = this;

        this.emit('update', {
          splitView: this,
          shouldCollapse: this._shouldCollapse(),
          currentMode: this.getCurrentMode(),
          split: function split() {
            that._doSplit = true;
            that._doCollapse = false;
          },
          collapse: function collapse() {
            that._doSplit = false;
            that._doCollapse = true;
          },
          width: window.innerWidth,
          orientation: this._getOrientation()
        });
      },

      _activateCollapseMode: function _activateCollapseMode() {
        if (this._mode !== COLLAPSE_MODE) {
          this._fireEvent('precollapse');
          this._secondaryPage.attr('style', '');
          this._mainPage.attr('style', '');

          this._mode = COLLAPSE_MODE;

          this._animator.setup(this._element, this._mainPage, this._secondaryPage, { isRight: false, width: '90%' });

          this._fireEvent('postcollapse');
        }
      },

      _activateSplitMode: function _activateSplitMode() {
        if (this._mode !== SPLIT_MODE) {
          this._fireEvent('presplit');

          this._animator.destroy();

          this._secondaryPage.attr('style', '');
          this._mainPage.attr('style', '');

          this._mode = SPLIT_MODE;
          this._setSize();

          this._fireEvent('postsplit');
        }
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingEvents();

        this._element = null;
        this._scope = null;
      }
    });

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    MicroEvent.mixin(SplitView);

    return SplitView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
(function () {
  'use strict';

  angular.module('onsen').factory('SplitterContent', ['$onsen', '$compile', function ($onsen, $compile) {

    var SplitterContent = Class.extend({

      init: function init(scope, element, attrs) {
        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this.load = this._element[0].load.bind(this._element[0]);
        scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');
        this._element = this._scope = this._attrs = this.load = this._pageScope = null;
      }
    });

    MicroEvent.mixin(SplitterContent);
    $onsen.derivePropertiesFromElement(SplitterContent, ['page']);

    return SplitterContent;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
(function () {
  'use strict';

  angular.module('onsen').factory('SplitterSide', ['$onsen', '$compile', function ($onsen, $compile) {

    var SplitterSide = Class.extend({

      init: function init(scope, element, attrs) {
        var _this = this;

        this._element = element;
        this._scope = scope;
        this._attrs = attrs;

        this._clearDerivingMethods = $onsen.deriveMethods(this, this._element[0], ['open', 'close', 'toggle', 'load']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['modechange', 'preopen', 'preclose', 'postopen', 'postclose'], function (detail) {
          return detail.side ? angular.extend(detail, { side: _this }) : detail;
        });

        scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingMethods();
        this._clearDerivingEvents();

        this._element = this._scope = this._attrs = null;
      }
    });

    MicroEvent.mixin(SplitterSide);
    $onsen.derivePropertiesFromElement(SplitterSide, ['page', 'mode', 'isOpen']);

    return SplitterSide;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
(function () {
  'use strict';

  angular.module('onsen').factory('Splitter', ['$onsen', function ($onsen) {

    var Splitter = Class.extend({
      init: function init(scope, element, attrs) {
        this._element = element;
        this._scope = scope;
        this._attrs = attrs;
        scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');
        this._element = this._scope = this._attrs = null;
      }
    });

    MicroEvent.mixin(Splitter);
    $onsen.derivePropertiesFromElement(Splitter, ['onDeviceBackButton']);

    ['left', 'right', 'content', 'mask'].forEach(function (prop, i) {
      Object.defineProperty(Splitter.prototype, prop, {
        get: function get() {
          var tagName = 'ons-splitter-' + (i < 2 ? 'side' : prop);
          return angular.element(this._element[0][prop]).data(tagName);
        }
      });
    });

    return Splitter;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  angular.module('onsen').factory('SwitchView', ['$parse', '$onsen', function ($parse, $onsen) {

    var SwitchView = Class.extend({

      /**
       * @param {jqLite} element
       * @param {Object} scope
       * @param {Object} attrs
       */
      init: function init(element, scope, attrs) {
        var _this = this;

        this._element = element;
        this._checkbox = angular.element(element[0].querySelector('input[type=checkbox]'));
        this._scope = scope;

        this._prepareNgModel(element, scope, attrs);

        this._scope.$on('$destroy', function () {
          _this.emit('destroy');
          _this._element = _this._checkbox = _this._scope = null;
        });
      },

      _prepareNgModel: function _prepareNgModel(element, scope, attrs) {
        var _this2 = this;

        if (attrs.ngModel) {
          var set = $parse(attrs.ngModel).assign;

          scope.$parent.$watch(attrs.ngModel, function (value) {
            _this2.checked = !!value;
          });

          this._element.on('change', function (e) {
            set(scope.$parent, _this2.checked);

            if (attrs.ngChange) {
              scope.$eval(attrs.ngChange);
            }

            scope.$parent.$evalAsync();
          });
        }
      }
    });

    MicroEvent.mixin(SwitchView);
    $onsen.derivePropertiesFromElement(SwitchView, ['disabled', 'checked', 'checkbox']);

    return SwitchView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.value('TabbarNoneAnimator', ons._internal.TabbarNoneAnimator);
  module.value('TabbarFadeAnimator', ons._internal.TabbarFadeAnimator);
  module.value('TabbarSlideAnimator', ons._internal.TabbarSlideAnimator);

  module.factory('TabbarView', ['$onsen', function ($onsen) {
    var TabbarView = Class.extend({

      init: function init(scope, element, attrs) {
        if (element[0].nodeName.toLowerCase() !== 'ons-tabbar') {
          throw new Error('"element" parameter must be a "ons-tabbar" element.');
        }

        this._scope = scope;
        this._element = element;
        this._attrs = attrs;
        this._lastPageElement = null;
        this._lastPageScope = null;

        this._scope.$on('$destroy', this._destroy.bind(this));

        this._clearDerivingEvents = $onsen.deriveEvents(this, element[0], ['reactive', 'postchange', 'prechange', 'init', 'show', 'hide', 'destroy']);

        this._clearDerivingMethods = $onsen.deriveMethods(this, element[0], ['setActiveTab', 'setTabbarVisibility', 'getActiveTabIndex', 'loadPage']);
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._clearDerivingEvents();
        this._clearDerivingMethods();

        this._element = this._scope = this._attrs = null;
      }
    });
    MicroEvent.mixin(TabbarView);

    TabbarView.registerAnimator = function (name, Animator) {
      return window.ons.TabbarElement.registerAnimator(name, Animator);
    };

    return TabbarView;
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.factory('ToastView', ['$onsen', function ($onsen) {

    var ToastView = Class.extend({

      /**
       * @param {Object} scope
       * @param {jqLite} element
       * @param {Object} attrs
       */
      init: function init(scope, element, attrs) {
        this._scope = scope;
        this._element = element;
        this._attrs = attrs;

        this._clearDerivingMethods = $onsen.deriveMethods(this, this._element[0], ['show', 'hide', 'toggle']);

        this._clearDerivingEvents = $onsen.deriveEvents(this, this._element[0], ['preshow', 'postshow', 'prehide', 'posthide'], function (detail) {
          if (detail.toast) {
            detail.toast = this;
          }
          return detail;
        }.bind(this));

        this._scope.$on('$destroy', this._destroy.bind(this));
      },

      _destroy: function _destroy() {
        this.emit('destroy');

        this._element.remove();

        this._clearDerivingMethods();
        this._clearDerivingEvents();

        this._scope = this._attrs = this._element = null;
      }

    });

    MicroEvent.mixin(ToastView);
    $onsen.derivePropertiesFromElement(ToastView, ['visible', 'onDeviceBackButton']);

    return ToastView;
  }]);
})();
'use strict';

/**
 * @element ons-action-sheet
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this action sheet.[/en]
 *  [ja]このアクションシートを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-preshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preshow" event is fired.[/en]
 *  [ja]"preshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prehide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prehide" event is fired.[/en]
 *  [ja]"prehide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postshow" event is fired.[/en]
 *  [ja]"postshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-posthide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "posthide" event is fired.[/en]
 *  [ja]"posthide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火された際に呼び出されるコールバックを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出されるコールバックを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしlistenerパラメータが指定されなかった場合、そのイベントのリスナーが全て削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーの関数オブジェクトを渡します。[/ja]
 */

(function () {
  'use strict';

  /**
   * Action sheet directive.
   */

  angular.module('onsen').directive('onsActionSheet', ['$onsen', 'ActionSheetView', function ($onsen, ActionSheetView) {
    return {
      restrict: 'E',
      replace: false,
      scope: true,
      transclude: false,

      compile: function compile(element, attrs) {

        return {
          pre: function pre(scope, element, attrs) {
            var actionSheet = new ActionSheetView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, actionSheet);
            $onsen.registerEventHandlers(actionSheet, 'preshow prehide postshow posthide destroy');
            $onsen.addModifierMethodsForCustomElements(actionSheet, element);

            element.data('ons-action-sheet', actionSheet);

            scope.$on('$destroy', function () {
              actionSheet._events = undefined;
              $onsen.removeModifierMethods(actionSheet);
              element.data('ons-action-sheet', undefined);
              element = null;
            });
          },
          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsActionSheetButton', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        GenericView.register(scope, element, attrs, { viewKey: 'ons-action-sheet-button' });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-alert-dialog
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this alert dialog.[/en]
 *  [ja]このアラートダイアログを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-preshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preshow" event is fired.[/en]
 *  [ja]"preshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prehide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prehide" event is fired.[/en]
 *  [ja]"prehide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postshow" event is fired.[/en]
 *  [ja]"postshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-posthide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "posthide" event is fired.[/en]
 *  [ja]"posthide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火された際に呼び出されるコールバックを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出されるコールバックを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしlistenerパラメータが指定されなかった場合、そのイベントのリスナーが全て削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーの関数オブジェクトを渡します。[/ja]
 */

(function () {
  'use strict';

  /**
   * Alert dialog directive.
   */

  angular.module('onsen').directive('onsAlertDialog', ['$onsen', 'AlertDialogView', function ($onsen, AlertDialogView) {
    return {
      restrict: 'E',
      replace: false,
      scope: true,
      transclude: false,

      compile: function compile(element, attrs) {

        return {
          pre: function pre(scope, element, attrs) {
            var alertDialog = new AlertDialogView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, alertDialog);
            $onsen.registerEventHandlers(alertDialog, 'preshow prehide postshow posthide destroy');
            $onsen.addModifierMethodsForCustomElements(alertDialog, element);

            element.data('ons-alert-dialog', alertDialog);
            element.data('_scope', scope);

            scope.$on('$destroy', function () {
              alertDialog._events = undefined;
              $onsen.removeModifierMethods(alertDialog);
              element.data('ons-alert-dialog', undefined);
              element = null;
            });
          },
          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsBackButton', ['$onsen', '$compile', 'GenericView', 'ComponentCleaner', function ($onsen, $compile, GenericView, ComponentCleaner) {
    return {
      restrict: 'E',
      replace: false,

      compile: function compile(element, attrs) {

        return {
          pre: function pre(scope, element, attrs, controller, transclude) {
            var backButton = GenericView.register(scope, element, attrs, {
              viewKey: 'ons-back-button'
            });

            if (attrs.ngClick) {
              element[0].onClick = angular.noop;
            }

            scope.$on('$destroy', function () {
              backButton._events = undefined;
              $onsen.removeModifierMethods(backButton);
              element = null;
            });

            ComponentCleaner.onDestroy(scope, function () {
              ComponentCleaner.destroyScope(scope);
              ComponentCleaner.destroyAttributes(attrs);
              element = scope = attrs = null;
            });
          },
          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsBottomToolbar', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: {
        pre: function pre(scope, element, attrs) {
          GenericView.register(scope, element, attrs, {
            viewKey: 'ons-bottomToolbar'
          });
        },

        post: function post(scope, element, attrs) {
          $onsen.fireComponentEvent(element[0], 'init');
        }
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-button
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsButton', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        var button = GenericView.register(scope, element, attrs, {
          viewKey: 'ons-button'
        });

        Object.defineProperty(button, 'disabled', {
          get: function get() {
            return this._element[0].disabled;
          },
          set: function set(value) {
            return this._element[0].disabled = value;
          }
        });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-carousel
 * @description
 *   [en]Carousel component.[/en]
 *   [ja]カルーセルを表示できるコンポーネント。[/ja]
 * @codepen xbbzOQ
 * @guide UsingCarousel
 *   [en]Learn how to use the carousel component.[/en]
 *   [ja]carouselコンポーネントの使い方[/ja]
 * @example
 * <ons-carousel style="width: 100%; height: 200px">
 *   <ons-carousel-item>
 *    ...
 *   </ons-carousel-item>
 *   <ons-carousel-item>
 *    ...
 *   </ons-carousel-item>
 * </ons-carousel>
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this carousel.[/en]
 *   [ja]このカルーセルを参照するための変数名を指定します。[/ja]
 */

/**
 * @attribute ons-postchange
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postchange" event is fired.[/en]
 *  [ja]"postchange"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-refresh
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "refresh" event is fired.[/en]
 *  [ja]"refresh"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-overscroll
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "overscroll" event is fired.[/en]
 *  [ja]"overscroll"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーが指定されなかった場合には、そのイベントに紐付いているイベントリスナーが全て削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsCarousel', ['$onsen', 'CarouselView', function ($onsen, CarouselView) {
    return {
      restrict: 'E',
      replace: false,

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      scope: false,
      transclude: false,

      compile: function compile(element, attrs) {

        return function (scope, element, attrs) {
          var carousel = new CarouselView(scope, element, attrs);

          element.data('ons-carousel', carousel);

          $onsen.registerEventHandlers(carousel, 'postchange refresh overscroll destroy');
          $onsen.declareVarAttribute(attrs, carousel);

          scope.$on('$destroy', function () {
            carousel._events = undefined;
            element.data('ons-carousel', undefined);
            element = null;
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }

    };
  }]);

  module.directive('onsCarouselItem', function () {
    return {
      restrict: 'E',
      compile: function compile(element, attrs) {
        return function (scope, element, attrs) {
          if (scope.$last) {
            element[0].parentElement._setup();
            element[0].parentElement._setupInitialIndex();
            element[0].parentElement._saveLastState();
          }
        };
      }
    };
  });
})();
'use strict';

/**
 * @element ons-dialog
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this dialog.[/en]
 *  [ja]このダイアログを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-preshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preshow" event is fired.[/en]
 *  [ja]"preshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prehide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prehide" event is fired.[/en]
 *  [ja]"prehide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postshow" event is fired.[/en]
 *  [ja]"postshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-posthide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "posthide" event is fired.[/en]
 *  [ja]"posthide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーが指定されなかった場合には、そのイベントに紐付いているイベントリスナーが全て削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */
(function () {
  'use strict';

  angular.module('onsen').directive('onsDialog', ['$onsen', 'DialogView', function ($onsen, DialogView) {
    return {
      restrict: 'E',
      scope: true,
      compile: function compile(element, attrs) {

        return {
          pre: function pre(scope, element, attrs) {

            var dialog = new DialogView(scope, element, attrs);
            $onsen.declareVarAttribute(attrs, dialog);
            $onsen.registerEventHandlers(dialog, 'preshow prehide postshow posthide destroy');
            $onsen.addModifierMethodsForCustomElements(dialog, element);

            element.data('ons-dialog', dialog);
            scope.$on('$destroy', function () {
              dialog._events = undefined;
              $onsen.removeModifierMethods(dialog);
              element.data('ons-dialog', undefined);
              element = null;
            });
          },

          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsDummyForInit', ['$rootScope', function ($rootScope) {
    var isReady = false;

    return {
      restrict: 'E',
      replace: false,

      link: {
        post: function post(scope, element) {
          if (!isReady) {
            isReady = true;
            $rootScope.$broadcast('$ons-ready');
          }
          element.remove();
        }
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-fab
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer the floating action button.[/en]
 *   [ja]このフローティングアクションボタンを参照するための変数名をしてします。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsFab', ['$onsen', 'FabView', function ($onsen, FabView) {
    return {
      restrict: 'E',
      replace: false,
      scope: false,
      transclude: false,

      compile: function compile(element, attrs) {

        return function (scope, element, attrs) {
          var fab = new FabView(scope, element, attrs);

          element.data('ons-fab', fab);

          $onsen.declareVarAttribute(attrs, fab);

          scope.$on('$destroy', function () {
            element.data('ons-fab', undefined);
            element = null;
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }

    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  var EVENTS = ('drag dragleft dragright dragup dragdown hold release swipe swipeleft swiperight ' + 'swipeup swipedown tap doubletap touch transform pinch pinchin pinchout rotate').split(/ +/);

  angular.module('onsen').directive('onsGestureDetector', ['$onsen', function ($onsen) {

    var scopeDef = EVENTS.reduce(function (dict, name) {
      dict['ng' + titlize(name)] = '&';
      return dict;
    }, {});

    function titlize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
      restrict: 'E',
      scope: scopeDef,

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      replace: false,
      transclude: true,

      compile: function compile(element, attrs) {
        return function link(scope, element, attrs, _, transclude) {

          transclude(scope.$parent, function (cloned) {
            element.append(cloned);
          });

          var handler = function handler(event) {
            var attr = 'ng' + titlize(event.type);

            if (attr in scopeDef) {
              scope[attr]({ $event: event });
            }
          };

          var gestureDetector;

          setImmediate(function () {
            gestureDetector = element[0]._gestureDetector;
            gestureDetector.on(EVENTS.join(' '), handler);
          });

          $onsen.cleaner.onDestroy(scope, function () {
            gestureDetector.off(EVENTS.join(' '), handler);
            $onsen.clearComponent({
              scope: scope,
              element: element,
              attrs: attrs
            });
            gestureDetector.element = scope = element = attrs = null;
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-icon
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsIcon', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',

      compile: function compile(element, attrs) {

        if (attrs.icon.indexOf('{{') !== -1) {
          attrs.$observe('icon', function () {
            setImmediate(function () {
              return element[0]._update();
            });
          });
        }

        return function (scope, element, attrs) {
          GenericView.register(scope, element, attrs, {
            viewKey: 'ons-icon'
          });
          // $onsen.fireComponentEvent(element[0], 'init');
        };
      }

    };
  }]);
})();
'use strict';

/**
 * @element ons-if-orientation
 * @category conditional
 * @description
 *   [en]Conditionally display content depending on screen orientation. Valid values are portrait and landscape. Different from other components, this component is used as attribute in any element.[/en]
 *   [ja]画面の向きに応じてコンテンツの制御を行います。portraitもしくはlandscapeを指定できます。すべての要素の属性に使用できます。[/ja]
 * @seealso ons-if-platform [en]ons-if-platform component[/en][ja]ons-if-platformコンポーネント[/ja]
 * @guide UtilityAPIs [en]Other utility APIs[/en][ja]他のユーティリティAPI[/ja]
 * @example
 * <div ons-if-orientation="portrait">
 *   <p>This will only be visible in portrait mode.</p>
 * </div>
 */

/**
 * @attribute ons-if-orientation
 * @initonly
 * @type {String}
 * @description
 *   [en]Either "portrait" or "landscape".[/en]
 *   [ja]portraitもしくはlandscapeを指定します。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsIfOrientation', ['$onsen', '$onsGlobal', function ($onsen, $onsGlobal) {
    return {
      restrict: 'A',
      replace: false,

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      transclude: false,
      scope: false,

      compile: function compile(element) {
        element.css('display', 'none');

        return function (scope, element, attrs) {
          attrs.$observe('onsIfOrientation', update);
          $onsGlobal.orientation.on('change', update);

          update();

          $onsen.cleaner.onDestroy(scope, function () {
            $onsGlobal.orientation.off('change', update);

            $onsen.clearComponent({
              element: element,
              scope: scope,
              attrs: attrs
            });
            element = scope = attrs = null;
          });

          function update() {
            var userOrientation = ('' + attrs.onsIfOrientation).toLowerCase();
            var orientation = getLandscapeOrPortrait();

            if (userOrientation === 'portrait' || userOrientation === 'landscape') {
              if (userOrientation === orientation) {
                element.css('display', '');
              } else {
                element.css('display', 'none');
              }
            }
          }

          function getLandscapeOrPortrait() {
            return $onsGlobal.orientation.isPortrait() ? 'portrait' : 'landscape';
          }
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-if-platform
 * @category conditional
 * @description
 *    [en]Conditionally display content depending on the platform / browser. Valid values are "opera", "firefox", "safari", "chrome", "ie", "edge", "android", "blackberry", "ios" and "wp".[/en]
 *    [ja]プラットフォームやブラウザーに応じてコンテンツの制御をおこないます。opera, firefox, safari, chrome, ie, edge, android, blackberry, ios, wpのいずれかの値を空白区切りで複数指定できます。[/ja]
 * @seealso ons-if-orientation [en]ons-if-orientation component[/en][ja]ons-if-orientationコンポーネント[/ja]
 * @guide UtilityAPIs [en]Other utility APIs[/en][ja]他のユーティリティAPI[/ja]
 * @example
 * <div ons-if-platform="android">
 *   ...
 * </div>
 */

/**
 * @attribute ons-if-platform
 * @type {String}
 * @initonly
 * @description
 *   [en]One or multiple space separated values: "opera", "firefox", "safari", "chrome", "ie", "edge", "android", "blackberry", "ios" or "wp".[/en]
 *   [ja]"opera", "firefox", "safari", "chrome", "ie", "edge", "android", "blackberry", "ios", "wp"のいずれか空白区切りで複数指定できます。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsIfPlatform', ['$onsen', function ($onsen) {
    return {
      restrict: 'A',
      replace: false,

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      transclude: false,
      scope: false,

      compile: function compile(element) {
        element.css('display', 'none');

        var platform = getPlatformString();

        return function (scope, element, attrs) {
          attrs.$observe('onsIfPlatform', function (userPlatform) {
            if (userPlatform) {
              update();
            }
          });

          update();

          $onsen.cleaner.onDestroy(scope, function () {
            $onsen.clearComponent({
              element: element,
              scope: scope,
              attrs: attrs
            });
            element = scope = attrs = null;
          });

          function update() {
            var userPlatforms = attrs.onsIfPlatform.toLowerCase().trim().split(/\s+/);
            if (userPlatforms.indexOf(platform.toLowerCase()) >= 0) {
              element.css('display', 'block');
            } else {
              element.css('display', 'none');
            }
          }
        };

        function getPlatformString() {

          if (navigator.userAgent.match(/Android/i)) {
            return 'android';
          }

          if (navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/RIM Tablet OS/i) || navigator.userAgent.match(/BB10/i)) {
            return 'blackberry';
          }

          if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            return 'ios';
          }

          if (navigator.userAgent.match(/Windows Phone|IEMobile|WPDesktop/i)) {
            return 'wp';
          }

          // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
          var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
          if (isOpera) {
            return 'opera';
          }

          var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
          if (isFirefox) {
            return 'firefox';
          }

          var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
          // At least Safari 3+: "[object HTMLElementConstructor]"
          if (isSafari) {
            return 'safari';
          }

          var isEdge = navigator.userAgent.indexOf(' Edge/') >= 0;
          if (isEdge) {
            return 'edge';
          }

          var isChrome = !!window.chrome && !isOpera && !isEdge; // Chrome 1+
          if (isChrome) {
            return 'chrome';
          }

          var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
          if (isIE) {
            return 'ie';
          }

          return 'unknown';
        }
      }
    };
  }]);
})();
'use strict';

/**
 * @ngdoc directive
 * @id input
 * @name ons-input
 * @category form
 * @description
 *  [en]Input component.[/en]
 *  [ja]inputコンポ―ネントです。[/ja]
 * @codepen ojQxLj
 * @guide UsingFormComponents
 *   [en]Using form components[/en]
 *   [ja]フォームを使う[/ja]
 * @guide EventHandling
 *   [en]Event handling descriptions[/en]
 *   [ja]イベント処理の使い方[/ja]
 * @example
 * <ons-input></ons-input>
 * <ons-input modifier="material" label="Username"></ons-input>
 */

/**
 * @ngdoc attribute
 * @name label
 * @type {String}
 * @description
 *   [en]Text for animated floating label.[/en]
 *   [ja]アニメーションさせるフローティングラベルのテキストを指定します。[/ja]
 */

/**
 * @ngdoc attribute
 * @name float
 * @description
 *  [en]If this attribute is present, the label will be animated.[/en]
 *  [ja]この属性が設定された時、ラベルはアニメーションするようになります。[/ja]
 */

/**
 * @ngdoc attribute
 * @name ng-model
 * @extensionOf angular
 * @description
 *   [en]Bind the value to a model. Works just like for normal input elements.[/en]
 *   [ja]この要素の値をモデルに紐付けます。通常のinput要素の様に動作します。[/ja]
 */

/**
 * @ngdoc attribute
 * @name ng-change
 * @extensionOf angular
 * @description
 *   [en]Executes an expression when the value changes. Works just like for normal input elements.[/en]
 *   [ja]値が変わった時にこの属性で指定したexpressionが実行されます。通常のinput要素の様に動作します。[/ja]
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsInput', ['$parse', function ($parse) {
    return {
      restrict: 'E',
      replace: false,
      scope: false,

      link: function link(scope, element, attrs) {
        var el = element[0];

        var onInput = function onInput() {
          var set = $parse(attrs.ngModel).assign;

          if (el._isTextInput) {
            el.type === 'number' ? set(scope, Number(el.value)) : set(scope, el.value);
          } else if (el.type === 'radio' && el.checked) {
            set(scope, el.value);
          } else {
            set(scope, el.checked);
          }

          if (attrs.ngChange) {
            scope.$eval(attrs.ngChange);
          }

          scope.$parent.$evalAsync();
        };

        if (attrs.ngModel) {
          scope.$watch(attrs.ngModel, function (value) {
            if (el._isTextInput) {
              if (typeof value !== 'undefined' && value !== el.value) {
                el.value = value;
              }
            } else if (el.type === 'radio') {
              el.checked = value === el.value;
            } else {
              el.checked = value;
            }
          });

          el._isTextInput ? element.on('input', onInput) : element.on('change', onInput);
        }

        scope.$on('$destroy', function () {
          el._isTextInput ? element.off('input', onInput) : element.off('change', onInput);

          scope = element = attrs = el = null;
        });
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-keyboard-active
 * @category form
 * @description
 *   [en]
 *     Conditionally display content depending on if the software keyboard is visible or hidden.
 *     This component requires cordova and that the com.ionic.keyboard plugin is installed.
 *   [/en]
 *   [ja]
 *     ソフトウェアキーボードが表示されているかどうかで、コンテンツを表示するかどうかを切り替えることが出来ます。
 *     このコンポーネントは、Cordovaやcom.ionic.keyboardプラグインを必要とします。
 *   [/ja]
 * @guide UtilityAPIs
 *   [en]Other utility APIs[/en]
 *   [ja]他のユーティリティAPI[/ja]
 * @example
 * <div ons-keyboard-active>
 *   This will only be displayed if the software keyboard is open.
 * </div>
 * <div ons-keyboard-inactive>
 *   There is also a component that does the opposite.
 * </div>
 */

/**
 * @attribute ons-keyboard-active
 * @description
 *   [en]The content of tags with this attribute will be visible when the software keyboard is open.[/en]
 *   [ja]この属性がついた要素は、ソフトウェアキーボードが表示された時に初めて表示されます。[/ja]
 */

/**
 * @attribute ons-keyboard-inactive
 * @description
 *   [en]The content of tags with this attribute will be visible when the software keyboard is hidden.[/en]
 *   [ja]この属性がついた要素は、ソフトウェアキーボードが隠れている時のみ表示されます。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  var compileFunction = function compileFunction(show, $onsen) {
    return function (element) {
      return function (scope, element, attrs) {
        var dispShow = show ? 'block' : 'none',
            dispHide = show ? 'none' : 'block';

        var onShow = function onShow() {
          element.css('display', dispShow);
        };

        var onHide = function onHide() {
          element.css('display', dispHide);
        };

        var onInit = function onInit(e) {
          if (e.visible) {
            onShow();
          } else {
            onHide();
          }
        };

        ons.softwareKeyboard.on('show', onShow);
        ons.softwareKeyboard.on('hide', onHide);
        ons.softwareKeyboard.on('init', onInit);

        if (ons.softwareKeyboard._visible) {
          onShow();
        } else {
          onHide();
        }

        $onsen.cleaner.onDestroy(scope, function () {
          ons.softwareKeyboard.off('show', onShow);
          ons.softwareKeyboard.off('hide', onHide);
          ons.softwareKeyboard.off('init', onInit);

          $onsen.clearComponent({
            element: element,
            scope: scope,
            attrs: attrs
          });
          element = scope = attrs = null;
        });
      };
    };
  };

  module.directive('onsKeyboardActive', ['$onsen', function ($onsen) {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      scope: false,
      compile: compileFunction(true, $onsen)
    };
  }]);

  module.directive('onsKeyboardInactive', ['$onsen', function ($onsen) {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      scope: false,
      compile: compileFunction(false, $onsen)
    };
  }]);
})();
'use strict';

/**
 * @element ons-lazy-repeat
 * @description
 *   [en]
 *     Using this component a list with millions of items can be rendered without a drop in performance.
 *     It does that by "lazily" loading elements into the DOM when they come into view and
 *     removing items from the DOM when they are not visible.
 *   [/en]
 *   [ja]
 *     このコンポーネント内で描画されるアイテムのDOM要素の読み込みは、画面に見えそうになった時まで自動的に遅延され、
 *     画面から見えなくなった場合にはその要素は動的にアンロードされます。
 *     このコンポーネントを使うことで、パフォーマンスを劣化させること無しに巨大な数の要素を描画できます。
 *   [/ja]
 * @codepen QwrGBm
 * @guide UsingLazyRepeat
 *   [en]How to use Lazy Repeat[/en]
 *   [ja]レイジーリピートの使い方[/ja]
 * @example
 * <script>
 *   ons.bootstrap()
 *
 *   .controller('MyController', function($scope) {
 *     $scope.MyDelegate = {
 *       countItems: function() {
 *         // Return number of items.
 *         return 1000000;
 *       },
 *
 *       calculateItemHeight: function(index) {
 *         // Return the height of an item in pixels.
 *         return 45;
 *       },
 *
 *       configureItemScope: function(index, itemScope) {
 *         // Initialize scope
 *         itemScope.item = 'Item #' + (index + 1);
 *       },
 *
 *       destroyItemScope: function(index, itemScope) {
 *         // Optional method that is called when an item is unloaded.
 *         console.log('Destroyed item with index: ' + index);
 *       }
 *     };
 *   });
 * </script>
 *
 * <ons-list ng-controller="MyController">
 *   <ons-list-item ons-lazy-repeat="MyDelegate">
 *     {{ item }}
 *   </ons-list-item>
 * </ons-list>
 */

/**
 * @attribute ons-lazy-repeat
 * @type {Expression}
 * @initonly
 * @description
 *  [en]A delegate object, can be either an object attached to the scope (when using AngularJS) or a normal JavaScript variable.[/en]
 *  [ja]要素のロード、アンロードなどの処理を委譲するオブジェクトを指定します。AngularJSのスコープの変数名や、通常のJavaScriptの変数名を指定します。[/ja]
 */

/**
 * @property delegate.configureItemScope
 * @type {Function}
 * @description
 *   [en]Function which recieves an index and the scope for the item. Can be used to configure values in the item scope.[/en]
 *   [ja][/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  /**
   * Lazy repeat directive.
   */
  module.directive('onsLazyRepeat', ['$onsen', 'LazyRepeatView', function ($onsen, LazyRepeatView) {
    return {
      restrict: 'A',
      replace: false,
      priority: 1000,
      terminal: true,

      compile: function compile(element, attrs) {
        return function (scope, element, attrs) {
          var lazyRepeat = new LazyRepeatView(scope, element, attrs);

          scope.$on('$destroy', function () {
            scope = element = attrs = lazyRepeat = null;
          });
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsList', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        GenericView.register(scope, element, attrs, { viewKey: 'ons-list' });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsListHeader', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        GenericView.register(scope, element, attrs, { viewKey: 'ons-list-header' });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsListItem', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        GenericView.register(scope, element, attrs, { viewKey: 'ons-list-item' });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-loading-placeholder
 * @category util
 * @description
 *   [en]Display a placeholder while the content is loading.[/en]
 *   [ja]Onsen UIが読み込まれるまでに表示するプレースホルダーを表現します。[/ja]
 * @guide UtilityAPIs [en]Other utility APIs[/en][ja]他のユーティリティAPI[/ja]
 * @example
 * <div ons-loading-placeholder="page.html">
 *   Loading...
 * </div>
 */

/**
 * @attribute ons-loading-placeholder
 * @initonly
 * @type {String}
 * @description
 *   [en]The url of the page to load.[/en]
 *   [ja]読み込むページのURLを指定します。[/ja]
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsLoadingPlaceholder', function () {
    return {
      restrict: 'A',
      link: function link(scope, element, attrs) {
        if (attrs.onsLoadingPlaceholder) {
          ons._resolveLoadingPlaceholder(element[0], attrs.onsLoadingPlaceholder, function (contentElement, done) {
            ons.compile(contentElement);
            scope.$evalAsync(function () {
              setImmediate(done);
            });
          });
        }
      }
    };
  });
})();
'use strict';

/**
 * @element ons-modal
 */

/**
 * @attribute var
 * @type {String}
 * @initonly
 * @description
 *   [en]Variable name to refer this modal.[/en]
 *   [ja]このモーダルを参照するための名前を指定します。[/ja]
 */

(function () {
  'use strict';

  /**
   * Modal directive.
   */

  angular.module('onsen').directive('onsModal', ['$onsen', 'ModalView', function ($onsen, ModalView) {
    return {
      restrict: 'E',
      replace: false,

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      scope: false,
      transclude: false,

      compile: function compile(element, attrs) {

        return {
          pre: function pre(scope, element, attrs) {
            var modal = new ModalView(scope, element, attrs);
            $onsen.addModifierMethodsForCustomElements(modal, element);

            $onsen.declareVarAttribute(attrs, modal);
            element.data('ons-modal', modal);

            scope.$on('$destroy', function () {
              $onsen.removeModifierMethods(modal);
              element.data('ons-modal', undefined);
              modal = element = scope = attrs = null;
            });
          },

          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-navigator
 * @example
 * <ons-navigator animation="slide" var="app.navi">
 *   <ons-page>
 *     <ons-toolbar>
 *       <div class="center">Title</div>
 *     </ons-toolbar>
 *
 *     <p style="text-align: center">
 *       <ons-button modifier="light" ng-click="app.navi.pushPage('page.html');">Push</ons-button>
 *     </p>
 *   </ons-page>
 * </ons-navigator>
 *
 * <ons-template id="page.html">
 *   <ons-page>
 *     <ons-toolbar>
 *       <div class="center">Title</div>
 *     </ons-toolbar>
 *
 *     <p style="text-align: center">
 *       <ons-button modifier="light" ng-click="app.navi.popPage();">Pop</ons-button>
 *     </p>
 *   </ons-page>
 * </ons-template>
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this navigator.[/en]
 *  [ja]このナビゲーターを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-prepush
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prepush" event is fired.[/en]
 *  [ja]"prepush"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prepop
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prepop" event is fired.[/en]
 *  [ja]"prepop"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postpush
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postpush" event is fired.[/en]
 *  [ja]"postpush"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postpop
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postpop" event is fired.[/en]
 *  [ja]"postpop"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-init
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "init" event is fired.[/en]
 *  [ja]ページの"init"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-show
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "show" event is fired.[/en]
 *  [ja]ページの"show"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-hide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "hide" event is fired.[/en]
 *  [ja]ページの"hide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "destroy" event is fired.[/en]
 *  [ja]ページの"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  var lastReady = window.ons.NavigatorElement.rewritables.ready;
  window.ons.NavigatorElement.rewritables.ready = ons._waitDiretiveInit('ons-navigator', lastReady);

  angular.module('onsen').directive('onsNavigator', ['NavigatorView', '$onsen', function (NavigatorView, $onsen) {
    return {
      restrict: 'E',

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      transclude: false,
      scope: true,

      compile: function compile(element) {

        return {
          pre: function pre(scope, element, attrs, controller) {
            var view = new NavigatorView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, view);
            $onsen.registerEventHandlers(view, 'prepush prepop postpush postpop init show hide destroy');

            element.data('ons-navigator', view);

            element[0].pageLoader = $onsen.createPageLoader(view);

            scope.$on('$destroy', function () {
              view._events = undefined;
              element.data('ons-navigator', undefined);
              scope = element = null;
            });
          },
          post: function post(scope, element, attrs) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-page
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this page.[/en]
 *   [ja]このページを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ng-infinite-scroll
 * @initonly
 * @type {String}
 * @description
 *   [en]Path of the function to be executed on infinite scrolling. The path is relative to $scope. The function receives a done callback that must be called when it's finished.[/en]
 *   [ja][/ja]
 */

/**
 * @attribute on-device-back-button
 * @type {Expression}
 * @description
 *   [en]Allows you to specify custom behavior when the back button is pressed.[/en]
 *   [ja]デバイスのバックボタンが押された時の挙動を設定できます。[/ja]
 */

/**
 * @attribute ng-device-back-button
 * @initonly
 * @type {Expression}
 * @description
 *   [en]Allows you to specify custom behavior with an AngularJS expression when the back button is pressed.[/en]
 *   [ja]デバイスのバックボタンが押された時の挙動を設定できます。AngularJSのexpressionを指定できます。[/ja]
 */

/**
 * @attribute ons-init
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "init" event is fired.[/en]
 *  [ja]"init"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-show
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "show" event is fired.[/en]
 *  [ja]"show"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-hide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "hide" event is fired.[/en]
 *  [ja]"hide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsPage', ['$onsen', 'PageView', function ($onsen, PageView) {

    function firePageInitEvent(element) {
      // TODO: remove dirty fix
      var i = 0,
          f = function f() {
        if (i++ < 15) {
          if (isAttached(element)) {
            $onsen.fireComponentEvent(element, 'init');
            fireActualPageInitEvent(element);
          } else {
            if (i > 10) {
              setTimeout(f, 1000 / 60);
            } else {
              setImmediate(f);
            }
          }
        } else {
          throw new Error('Fail to fire "pageinit" event. Attach "ons-page" element to the document after initialization.');
        }
      };

      f();
    }

    function fireActualPageInitEvent(element) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('pageinit', true, true);
      element.dispatchEvent(event);
    }

    function isAttached(element) {
      if (document.documentElement === element) {
        return true;
      }
      return element.parentNode ? isAttached(element.parentNode) : false;
    }

    return {
      restrict: 'E',

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      transclude: false,
      scope: true,

      compile: function compile(element, attrs) {
        return {
          pre: function pre(scope, element, attrs) {
            var page = new PageView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, page);
            $onsen.registerEventHandlers(page, 'init show hide destroy');

            element.data('ons-page', page);
            $onsen.addModifierMethodsForCustomElements(page, element);

            element.data('_scope', scope);

            $onsen.cleaner.onDestroy(scope, function () {
              page._events = undefined;
              $onsen.removeModifierMethods(page);
              element.data('ons-page', undefined);
              element.data('_scope', undefined);

              $onsen.clearComponent({
                element: element,
                scope: scope,
                attrs: attrs
              });
              scope = element = attrs = null;
            });
          },

          post: function postLink(scope, element, attrs) {
            firePageInitEvent(element[0]);
          }
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-popover
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this popover.[/en]
 *  [ja]このポップオーバーを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-preshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preshow" event is fired.[/en]
 *  [ja]"preshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prehide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prehide" event is fired.[/en]
 *  [ja]"prehide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postshow" event is fired.[/en]
 *  [ja]"postshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-posthide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "posthide" event is fired.[/en]
 *  [ja]"posthide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsPopover', ['$onsen', 'PopoverView', function ($onsen, PopoverView) {
    return {
      restrict: 'E',
      replace: false,
      scope: true,
      compile: function compile(element, attrs) {
        return {
          pre: function pre(scope, element, attrs) {

            var popover = new PopoverView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, popover);
            $onsen.registerEventHandlers(popover, 'preshow prehide postshow posthide destroy');
            $onsen.addModifierMethodsForCustomElements(popover, element);

            element.data('ons-popover', popover);

            scope.$on('$destroy', function () {
              popover._events = undefined;
              $onsen.removeModifierMethods(popover);
              element.data('ons-popover', undefined);
              element = null;
            });
          },

          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
"use strict";
'use strict';

/**
 * @element ons-pull-hook
 * @example
 * <script>
 *   ons.bootstrap()
 *
 *   .controller('MyController', function($scope, $timeout) {
 *     $scope.items = [3, 2 ,1];
 *
 *     $scope.load = function($done) {
 *       $timeout(function() {
 *         $scope.items.unshift($scope.items.length + 1);
 *         $done();
 *       }, 1000);
 *     };
 *   });
 * </script>
 *
 * <ons-page ng-controller="MyController">
 *   <ons-pull-hook var="loader" ng-action="load($done)">
 *     <span ng-switch="loader.state">
 *       <span ng-switch-when="initial">Pull down to refresh</span>
 *       <span ng-switch-when="preaction">Release to refresh</span>
 *       <span ng-switch-when="action">Loading data. Please wait...</span>
 *     </span>
 *   </ons-pull-hook>
 *   <ons-list>
 *     <ons-list-item ng-repeat="item in items">
 *       Item #{{ item }}
 *     </ons-list-item>
 *   </ons-list>
 * </ons-page>
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this component.[/en]
 *   [ja]このコンポーネントを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ng-action
 * @initonly
 * @type {Expression}
 * @description
 *   [en]Use to specify custom behavior when the page is pulled down. A <code>$done</code> function is available to tell the component that the action is completed.[/en]
 *   [ja]pull downしたときの振る舞いを指定します。アクションが完了した時には<code>$done</code>関数を呼び出します。[/ja]
 */

/**
 * @attribute ons-changestate
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "changestate" event is fired.[/en]
 *  [ja]"changestate"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  /**
   * Pull hook directive.
   */

  angular.module('onsen').directive('onsPullHook', ['$onsen', 'PullHookView', function ($onsen, PullHookView) {
    return {
      restrict: 'E',
      replace: false,
      scope: true,

      compile: function compile(element, attrs) {
        return {
          pre: function pre(scope, element, attrs) {
            var pullHook = new PullHookView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, pullHook);
            $onsen.registerEventHandlers(pullHook, 'changestate destroy');
            element.data('ons-pull-hook', pullHook);

            scope.$on('$destroy', function () {
              pullHook._events = undefined;
              element.data('ons-pull-hook', undefined);
              scope = element = attrs = null;
            });
          },
          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsRange', ['$parse', function ($parse) {
    return {
      restrict: 'E',
      replace: false,
      scope: false,

      link: function link(scope, element, attrs) {

        var onInput = function onInput() {
          var set = $parse(attrs.ngModel).assign;

          set(scope, element[0].value);
          if (attrs.ngChange) {
            scope.$eval(attrs.ngChange);
          }
          scope.$parent.$evalAsync();
        };

        if (attrs.ngModel) {
          scope.$watch(attrs.ngModel, function (value) {
            element[0].value = value;
          });

          element.on('input', onInput);
        }

        scope.$on('$destroy', function () {
          element.off('input', onInput);
          scope = element = attrs = null;
        });
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsRipple', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        GenericView.register(scope, element, attrs, { viewKey: 'ons-ripple' });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-scope
 * @category util
 * @description
 *   [en]All child elements using the "var" attribute will be attached to the scope of this element.[/en]
 *   [ja]"var"属性を使っている全ての子要素のviewオブジェクトは、この要素のAngularJSスコープに追加されます。[/ja]
 * @example
 * <ons-list>
 *   <ons-list-item ons-scope ng-repeat="item in items">
 *     <ons-carousel var="carousel">
 *       <ons-carousel-item ng-click="carousel.next()">
 *         {{ item }}
 *       </ons-carousel-item>
 *       </ons-carousel-item ng-click="carousel.prev()">
 *         ...
 *       </ons-carousel-item>
 *     </ons-carousel>
 *   </ons-list-item>
 * </ons-list>
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsScope', ['$onsen', function ($onsen) {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      scope: false,

      link: function link(scope, element) {
        element.data('_scope', scope);

        scope.$on('$destroy', function () {
          element.data('_scope', undefined);
        });
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-select
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsSelect', ['$parse', '$onsen', 'GenericView', function ($parse, $onsen, GenericView) {
    return {
      restrict: 'E',
      replace: false,
      scope: false,

      link: function link(scope, element, attrs) {
        var onInput = function onInput() {
          var set = $parse(attrs.ngModel).assign;

          set(scope, element[0].value);
          if (attrs.ngChange) {
            scope.$eval(attrs.ngChange);
          }
          scope.$parent.$evalAsync();
        };

        if (attrs.ngModel) {
          scope.$watch(attrs.ngModel, function (value) {
            element[0].value = value;
          });

          element.on('input', onInput);
        }

        scope.$on('$destroy', function () {
          element.off('input', onInput);
          scope = element = attrs = null;
        });

        GenericView.register(scope, element, attrs, { viewKey: 'ons-select' });
        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-sliding-menu
 * @category menu
 * @description
 *   [en]Component for sliding UI where one page is overlayed over another page. The above page can be slided aside to reveal the page behind.[/en]
 *   [ja]スライディングメニューを表現するためのコンポーネントで、片方のページが別のページの上にオーバーレイで表示されます。above-pageで指定されたページは、横からスライドして表示します。[/ja]
 * @codepen IDvFJ
 * @seealso ons-page
 *   [en]ons-page component[/en]
 *   [ja]ons-pageコンポーネント[/ja]
 * @guide UsingSlidingMenu
 *   [en]Using sliding menu[/en]
 *   [ja]スライディングメニューを使う[/ja]
 * @guide EventHandling
 *   [en]Using events[/en]
 *   [ja]イベントの利用[/ja]
 * @guide CallingComponentAPIsfromJavaScript
 *   [en]Using navigator from JavaScript[/en]
 *   [ja]JavaScriptからコンポーネントを呼び出す[/ja]
 * @guide DefiningMultiplePagesinSingleHTML
 *   [en]Defining multiple pages in single html[/en]
 *   [ja]複数のページを1つのHTMLに記述する[/ja]
 * @example
 * <ons-sliding-menu var="app.menu" main-page="page.html" menu-page="menu.html" max-slide-distance="200px" type="reveal" side="left">
 * </ons-sliding-menu>
 *
 * <ons-template id="page.html">
 *   <ons-page>
 *    <p style="text-align: center">
 *      <ons-button ng-click="app.menu.toggleMenu()">Toggle</ons-button>
 *    </p>
 *   </ons-page>
 * </ons-template>
 *
 * <ons-template id="menu.html">
 *   <ons-page>
 *     <!-- menu page's contents -->
 *   </ons-page>
 * </ons-template>
 *
 */

/**
 * @event preopen
 * @description
 *   [en]Fired just before the sliding menu is opened.[/en]
 *   [ja]スライディングメニューが開く前に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクトです。[/ja]
 * @param {Object} event.slidingMenu
 *   [en]Sliding menu view object.[/en]
 *   [ja]イベントが発火したSlidingMenuオブジェクトです。[/ja]
 */

/**
 * @event postopen
 * @description
 *   [en]Fired just after the sliding menu is opened.[/en]
 *   [ja]スライディングメニューが開き終わった後に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクトです。[/ja]
 * @param {Object} event.slidingMenu
 *   [en]Sliding menu view object.[/en]
 *   [ja]イベントが発火したSlidingMenuオブジェクトです。[/ja]
 */

/**
 * @event preclose
 * @description
 *   [en]Fired just before the sliding menu is closed.[/en]
 *   [ja]スライディングメニューが閉じる前に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクトです。[/ja]
 * @param {Object} event.slidingMenu
 *   [en]Sliding menu view object.[/en]
 *   [ja]イベントが発火したSlidingMenuオブジェクトです。[/ja]
 */

/**
 * @event postclose
 * @description
 *   [en]Fired just after the sliding menu is closed.[/en]
 *   [ja]スライディングメニューが閉じ終わった後に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクトです。[/ja]
 * @param {Object} event.slidingMenu
 *   [en]Sliding menu view object.[/en]
 *   [ja]イベントが発火したSlidingMenuオブジェクトです。[/ja]
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this sliding menu.[/en]
 *  [ja]このスライディングメニューを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute menu-page
 * @initonly
 * @type {String}
 * @description
 *   [en]The url of the menu page.[/en]
 *   [ja]左に位置するメニューページのURLを指定します。[/ja]
 */

/**
 * @attribute main-page
 * @initonly
 * @type {String}
 * @description
 *   [en]The url of the main page.[/en]
 *   [ja]右に位置するメインページのURLを指定します。[/ja]
 */

/**
 * @attribute swipeable
 * @initonly
 * @type {Boolean}
 * @description
 *   [en]Whether to enable swipe interaction.[/en]
 *   [ja]スワイプ操作を有効にする場合に指定します。[/ja]
 */

/**
 * @attribute swipe-target-width
 * @initonly
 * @type {String}
 * @description
 *   [en]The width of swipeable area calculated from the left (in pixels). Use this to enable swipe only when the finger touch on the screen edge.[/en]
 *   [ja]スワイプの判定領域をピクセル単位で指定します。画面の端から指定した距離に達するとページが表示されます。[/ja]
 */

/**
 * @attribute max-slide-distance
 * @initonly
 * @type {String}
 * @description
 *   [en]How far the menu page will slide open. Can specify both in px and %. eg. 90%, 200px[/en]
 *   [ja]menu-pageで指定されたページの表示幅を指定します。ピクセルもしくは%の両方で指定できます（例: 90%, 200px）[/ja]
 */

/**
 * @attribute side
 * @initonly
 * @type {String}
 * @description
 *   [en]Specify which side of the screen the menu page is located on. Possible values are "left" and "right".[/en]
 *   [ja]menu-pageで指定されたページが画面のどちら側から表示されるかを指定します。leftもしくはrightのいずれかを指定できます。[/ja]
 */

/**
 * @attribute type
 * @initonly
 * @type {String}
 * @description
 *   [en]Sliding menu animator. Possible values are reveal (default), push and overlay.[/en]
 *   [ja]スライディングメニューのアニメーションです。"reveal"（デフォルト）、"push"、"overlay"のいずれかを指定できます。[/ja]
 */

/**
 * @attribute ons-preopen
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preopen" event is fired.[/en]
 *  [ja]"preopen"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-preclose
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preclose" event is fired.[/en]
 *  [ja]"preclose"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postopen
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postopen" event is fired.[/en]
 *  [ja]"postopen"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postclose
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postclose" event is fired.[/en]
 *  [ja]"postclose"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-init
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "init" event is fired.[/en]
 *  [ja]ページの"init"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-show
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "show" event is fired.[/en]
 *  [ja]ページの"show"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-hide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "hide" event is fired.[/en]
 *  [ja]ページの"hide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "destroy" event is fired.[/en]
 *  [ja]ページの"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method setMainPage
 * @signature setMainPage(pageUrl, [options])
 * @param {String} pageUrl
 *   [en]Page URL. Can be either an HTML document or an <code>&lt;ons-template&gt;</code>.[/en]
 *   [ja]pageのURLか、ons-templateで宣言したテンプレートのid属性の値を指定します。[/ja]
 * @param {Object} [options]
 *   [en]Parameter object.[/en]
 *   [ja]オプションを指定するオブジェクト。[/ja]
 * @param {Boolean} [options.closeMenu]
 *   [en]If true the menu will be closed.[/en]
 *   [ja]trueを指定すると、開いているメニューを閉じます。[/ja]
 * @param {Function} [options.callback]
 *   [en]Function that is executed after the page has been set.[/en]
 *   [ja]ページが読み込まれた後に呼び出される関数オブジェクトを指定します。[/ja]
 * @description
 *   [en]Show the page specified in pageUrl in the main contents pane.[/en]
 *   [ja]中央部分に表示されるページをpageUrlに指定します。[/ja]
 */

/**
 * @method setMenuPage
 * @signature setMenuPage(pageUrl, [options])
 * @param {String} pageUrl
 *   [en]Page URL. Can be either an HTML document or an <code>&lt;ons-template&gt;</code>.[/en]
 *   [ja]pageのURLか、ons-templateで宣言したテンプレートのid属性の値を指定します。[/ja]
 * @param {Object} [options]
 *   [en]Parameter object.[/en]
 *   [ja]オプションを指定するオブジェクト。[/ja]
 * @param {Boolean} [options.closeMenu]
 *   [en]If true the menu will be closed after the menu page has been set.[/en]
 *   [ja]trueを指定すると、開いているメニューを閉じます。[/ja]
 * @param {Function} [options.callback]
 *   [en]This function will be executed after the menu page has been set.[/en]
 *   [ja]メニューページが読み込まれた後に呼び出される関数オブジェクトを指定します。[/ja]
 * @description
 *   [en]Show the page specified in pageUrl in the side menu pane.[/en]
 *   [ja]メニュー部分に表示されるページをpageUrlに指定します。[/ja]
 */

/**
 * @method openMenu
 * @signature openMenu([options])
 * @param {Object} [options]
 *   [en]Parameter object.[/en]
 *   [ja]オプションを指定するオブジェクト。[/ja]
 * @param {Function} [options.callback]
 *   [en]This function will be called after the menu has been opened.[/en]
 *   [ja]メニューが開いた後に呼び出される関数オブジェクトを指定します。[/ja]
 * @description
 *   [en]Slide the above layer to reveal the layer behind.[/en]
 *   [ja]メニューページを表示します。[/ja]
 */

/**
 * @method closeMenu
 * @signature closeMenu([options])
 * @param {Object} [options]
 *   [en]Parameter object.[/en]
 *   [ja]オプションを指定するオブジェクト。[/ja]
 * @param {Function} [options.callback]
 *   [en]This function will be called after the menu has been closed.[/en]
 *   [ja]メニューが閉じられた後に呼び出される関数オブジェクトを指定します。[/ja]
 * @description
 *   [en]Slide the above layer to hide the layer behind.[/en]
 *   [ja]メニューページを非表示にします。[/ja]
 */

/**
 * @method toggleMenu
 * @signature toggleMenu([options])
 * @param {Object} [options]
 *   [en]Parameter object.[/en]
 *   [ja]オプションを指定するオブジェクト。[/ja]
 * @param {Function} [options.callback]
 *   [en]This function will be called after the menu has been opened or closed.[/en]
 *   [ja]メニューが開き終わった後か、閉じ終わった後に呼び出される関数オブジェクトです。[/ja]
 * @description
 *   [en]Slide the above layer to reveal the layer behind if it is currently hidden, otherwise, hide the layer behind.[/en]
 *   [ja]現在の状況に合わせて、メニューページを表示もしくは非表示にします。[/ja]
 */

/**
 * @method isMenuOpened
 * @signature isMenuOpened()
 * @return {Boolean}
 *   [en]true if the menu is currently open.[/en]
 *   [ja]メニューが開いていればtrueとなります。[/ja]
 * @description
 *   [en]Returns true if the menu page is open, otherwise false.[/en]
 *   [ja]メニューページが開いている場合はtrue、そうでない場合はfalseを返します。[/ja]
 */

/**
 * @method getDeviceBackButtonHandler
 * @signature getDeviceBackButtonHandler()
 * @return {Object}
 *   [en]Device back button handler.[/en]
 *   [ja]デバイスのバックボタンハンドラを返します。[/ja]
 * @description
 *   [en]Retrieve the back-button handler.[/en]
 *   [ja]ons-sliding-menuに紐付いているバックボタンハンドラを取得します。[/ja]
 */

/**
 * @method setSwipeable
 * @signature setSwipeable(swipeable)
 * @param {Boolean} swipeable
 *   [en]If true the menu will be swipeable.[/en]
 *   [ja]スワイプで開閉できるようにする場合にはtrueを指定します。[/ja]
 * @description
 *   [en]Specify if the menu should be swipeable or not.[/en]
 *   [ja]スワイプで開閉するかどうかを設定する。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsSlidingMenu', ['$compile', 'SlidingMenuView', '$onsen', function ($compile, SlidingMenuView, $onsen) {
    return {
      restrict: 'E',
      replace: false,

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      transclude: false,
      scope: true,

      compile: function compile(element, attrs) {
        ons._util.warn('\'ons-sliding-menu\' component has been deprecated and will be removed in the next release. Please use \'ons-splitter\' instead.');

        var main = element[0].querySelector('.main'),
            menu = element[0].querySelector('.menu');

        if (main) {
          var mainHtml = angular.element(main).remove().html().trim();
        }

        if (menu) {
          var menuHtml = angular.element(menu).remove().html().trim();
        }

        return function (scope, element, attrs) {
          element.append(angular.element('<div></div>').addClass('onsen-sliding-menu__menu'));
          element.append(angular.element('<div></div>').addClass('onsen-sliding-menu__main'));

          var slidingMenu = new SlidingMenuView(scope, element, attrs);

          $onsen.registerEventHandlers(slidingMenu, 'preopen preclose postopen postclose init show hide destroy');

          if (mainHtml && !attrs.mainPage) {
            slidingMenu._appendMainPage(null, mainHtml);
          }

          if (menuHtml && !attrs.menuPage) {
            slidingMenu._appendMenuPage(menuHtml);
          }

          $onsen.declareVarAttribute(attrs, slidingMenu);
          element.data('ons-sliding-menu', slidingMenu);

          scope.$on('$destroy', function () {
            slidingMenu._events = undefined;
            element.data('ons-sliding-menu', undefined);
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-speed-dial
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer the speed dial.[/en]
 *   [ja]このスピードダイアルを参照するための変数名をしてします。[/ja]
 */

/**
 * @attribute ons-open
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "open" event is fired.[/en]
 *  [ja]"open"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-close
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "close" event is fired.[/en]
 *  [ja]"close"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーが指定されなかった場合には、そのイベントに紐付いているイベントリスナーが全て削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsSpeedDial', ['$onsen', 'SpeedDialView', function ($onsen, SpeedDialView) {
    return {
      restrict: 'E',
      replace: false,
      scope: false,
      transclude: false,

      compile: function compile(element, attrs) {

        return function (scope, element, attrs) {
          var speedDial = new SpeedDialView(scope, element, attrs);

          element.data('ons-speed-dial', speedDial);

          $onsen.registerEventHandlers(speedDial, 'open close');
          $onsen.declareVarAttribute(attrs, speedDial);

          scope.$on('$destroy', function () {
            speedDial._events = undefined;
            element.data('ons-speed-dial', undefined);
            element = null;
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }

    };
  }]);
})();
'use strict';

/**
 * @element ons-split-view
 * @category control
 * @description
 *  [en]Divides the screen into a left and right section.[/en]
 *  [ja]画面を左右に分割するコンポーネントです。[/ja]
 * @codepen nKqfv {wide}
 * @guide Usingonssplitviewcomponent
 *   [en]Using ons-split-view.[/en]
 *   [ja]ons-split-viewコンポーネントを使う[/ja]
 * @guide CallingComponentAPIsfromJavaScript
 *   [en]Using navigator from JavaScript[/en]
 *   [ja]JavaScriptからコンポーネントを呼び出す[/ja]
 * @example
 * <ons-split-view
 *   secondary-page="secondary.html"
 *   main-page="main.html"
 *   main-page-width="70%"
 *   collapse="portrait">
 * </ons-split-view>
 */

/**
 * @event update
 * @description
 *   [en]Fired when the split view is updated.[/en]
 *   [ja]split viewの状態が更新された際に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクトです。[/ja]
 * @param {Object} event.splitView
 *   [en]Split view object.[/en]
 *   [ja]イベントが発火したSplitViewオブジェクトです。[/ja]
 * @param {Boolean} event.shouldCollapse
 *   [en]True if the view should collapse.[/en]
 *   [ja]collapse状態の場合にtrueになります。[/ja]
 * @param {String} event.currentMode
 *   [en]Current mode.[/en]
 *   [ja]現在のモード名を返します。"collapse"か"split"かのいずれかです。[/ja]
 * @param {Function} event.split
 *   [en]Call to force split.[/en]
 *   [ja]この関数を呼び出すと強制的にsplitモードにします。[/ja]
 * @param {Function} event.collapse
 *   [en]Call to force collapse.[/en]
 *   [ja]この関数を呼び出すと強制的にcollapseモードにします。[/ja]
 * @param {Number} event.width
 *   [en]Current width.[/en]
 *   [ja]現在のSplitViewの幅を返します。[/ja]
 * @param {String} event.orientation
 *   [en]Current orientation.[/en]
 *   [ja]現在の画面のオリエンテーションを返します。"portrait"かもしくは"landscape"です。 [/ja]
 */

/**
 * @event presplit
 * @description
 *   [en]Fired just before the view is split.[/en]
 *   [ja]split状態にる前に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクト。[/ja]
 * @param {Object} event.splitView
 *   [en]Split view object.[/en]
 *   [ja]イベントが発火したSplitViewオブジェクトです。[/ja]
 * @param {Number} event.width
 *   [en]Current width.[/en]
 *   [ja]現在のSplitViewnの幅です。[/ja]
 * @param {String} event.orientation
 *   [en]Current orientation.[/en]
 *   [ja]現在の画面のオリエンテーションを返します。"portrait"もしくは"landscape"です。[/ja]
 */

/**
 * @event postsplit
 * @description
 *   [en]Fired just after the view is split.[/en]
 *   [ja]split状態になった後に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクト。[/ja]
 * @param {Object} event.splitView
 *   [en]Split view object.[/en]
 *   [ja]イベントが発火したSplitViewオブジェクトです。[/ja]
 * @param {Number} event.width
 *   [en]Current width.[/en]
 *   [ja]現在のSplitViewnの幅です。[/ja]
 * @param {String} event.orientation
 *   [en]Current orientation.[/en]
 *   [ja]現在の画面のオリエンテーションを返します。"portrait"もしくは"landscape"です。[/ja]
 */

/**
 * @event precollapse
 * @description
 *   [en]Fired just before the view is collapsed.[/en]
 *   [ja]collapse状態になる前に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクト。[/ja]
 * @param {Object} event.splitView
 *   [en]Split view object.[/en]
 *   [ja]イベントが発火したSplitViewオブジェクトです。[/ja]
 * @param {Number} event.width
 *   [en]Current width.[/en]
 *   [ja]現在のSplitViewnの幅です。[/ja]
 * @param {String} event.orientation
 *   [en]Current orientation.[/en]
 *   [ja]現在の画面のオリエンテーションを返します。"portrait"もしくは"landscape"です。[/ja]
 */

/**
 * @event postcollapse
 * @description
 *   [en]Fired just after the view is collapsed.[/en]
 *   [ja]collapse状態になった後に発火します。[/ja]
 * @param {Object} event
 *   [en]Event object.[/en]
 *   [ja]イベントオブジェクト。[/ja]
 * @param {Object} event.splitView
 *   [en]Split view object.[/en]
 *   [ja]イベントが発火したSplitViewオブジェクトです。[/ja]
 * @param {Number} event.width
 *   [en]Current width.[/en]
 *   [ja]現在のSplitViewnの幅です。[/ja]
 * @param {String} event.orientation
 *   [en]Current orientation.[/en]
 *   [ja]現在の画面のオリエンテーションを返します。"portrait"もしくは"landscape"です。[/ja]
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this split view.[/en]
 *   [ja]このスプリットビューコンポーネントを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute main-page
 * @initonly
 * @type {String}
 * @description
 *   [en]The url of the page on the right.[/en]
 *   [ja]右側に表示するページのURLを指定します。[/ja]
 */

/**
 * @attribute main-page-width
 * @initonly
 * @type {Number}
 * @description
 *   [en]Main page width percentage. The secondary page width will be the remaining percentage.[/en]
 *   [ja]右側のページの幅をパーセント単位で指定します。[/ja]
 */

/**
 * @attribute secondary-page
 * @initonly
 * @type {String}
 * @description
 *   [en]The url of the page on the left.[/en]
 *   [ja]左側に表示するページのURLを指定します。[/ja]
 */

/**
 * @attribute collapse
 * @initonly
 * @type {String}
 * @description
 *   [en]
 *     Specify the collapse behavior. Valid values are portrait, landscape, width #px or a media query.
 *     "portrait" or "landscape" means the view will collapse when device is in landscape or portrait orientation.
 *     "width #px" means the view will collapse when the window width is smaller than the specified #px.
 *     If the value is a media query, the view will collapse when the media query is true.
 *   [/en]
 *   [ja]
 *     左側のページを非表示にする条件を指定します。portrait, landscape、width #pxもしくはメディアクエリの指定が可能です。
 *     portraitもしくはlandscapeを指定すると、デバイスの画面が縦向きもしくは横向きになった時に適用されます。
 *     width #pxを指定すると、画面が指定した横幅よりも短い場合に適用されます。
 *     メディアクエリを指定すると、指定したクエリに適合している場合に適用されます。
 *   [/ja]
 */

/**
 * @attribute ons-update
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "update" event is fired.[/en]
 *  [ja]"update"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-presplit
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "presplit" event is fired.[/en]
 *  [ja]"presplit"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-precollapse
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "precollapse" event is fired.[/en]
 *  [ja]"precollapse"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postsplit
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postsplit" event is fired.[/en]
 *  [ja]"postsplit"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postcollapse
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postcollapse" event is fired.[/en]
 *  [ja]"postcollapse"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-init
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "init" event is fired.[/en]
 *  [ja]ページの"init"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-show
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "show" event is fired.[/en]
 *  [ja]ページの"show"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-hide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "hide" event is fired.[/en]
 *  [ja]ページの"hide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "destroy" event is fired.[/en]
 *  [ja]ページの"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method setMainPage
 * @signature setMainPage(pageUrl)
 * @param {String} pageUrl
 *   [en]Page URL. Can be either an HTML document or an <ons-template>.[/en]
 *   [ja]pageのURLか、ons-templateで宣言したテンプレートのid属性の値を指定します。[/ja]
 * @description
 *   [en]Show the page specified in pageUrl in the right section[/en]
 *   [ja]指定したURLをメインページを読み込みます。[/ja]
 */

/**
 * @method setSecondaryPage
 * @signature setSecondaryPage(pageUrl)
 * @param {String} pageUrl
 *   [en]Page URL. Can be either an HTML document or an <ons-template>.[/en]
 *   [ja]pageのURLか、ons-templateで宣言したテンプレートのid属性の値を指定します。[/ja]
 * @description
 *   [en]Show the page specified in pageUrl in the left section[/en]
 *   [ja]指定したURLを左のページの読み込みます。[/ja]
 */

/**
 * @method update
 * @signature update()
 * @description
 *   [en]Trigger an 'update' event and try to determine if the split behavior should be changed.[/en]
 *   [ja]splitモードを変えるべきかどうかを判断するための'update'イベントを発火します。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsSplitView', ['$compile', 'SplitView', '$onsen', function ($compile, SplitView, $onsen) {

    return {
      restrict: 'E',
      replace: false,
      transclude: false,
      scope: true,

      compile: function compile(element, attrs) {
        ons._util.warn('\'ons-split-view\' component has been deprecated and will be removed in the next release. Please use \'ons-splitter\' instead.');

        var mainPage = element[0].querySelector('.main-page'),
            secondaryPage = element[0].querySelector('.secondary-page');

        if (mainPage) {
          var mainHtml = angular.element(mainPage).remove().html().trim();
        }

        if (secondaryPage) {
          var secondaryHtml = angular.element(secondaryPage).remove().html().trim();
        }

        return function (scope, element, attrs) {
          element.append(angular.element('<div></div>').addClass('onsen-split-view__secondary full-screen'));
          element.append(angular.element('<div></div>').addClass('onsen-split-view__main full-screen'));

          var splitView = new SplitView(scope, element, attrs);

          if (mainHtml && !attrs.mainPage) {
            splitView._appendMainPage(mainHtml);
          }

          if (secondaryHtml && !attrs.secondaryPage) {
            splitView._appendSecondPage(secondaryHtml);
          }

          $onsen.declareVarAttribute(attrs, splitView);
          $onsen.registerEventHandlers(splitView, 'update presplit precollapse postsplit postcollapse init show hide destroy');

          element.data('ons-split-view', splitView);

          scope.$on('$destroy', function () {
            splitView._events = undefined;
            element.data('ons-split-view', undefined);
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-splitter
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this split view.[/en]
 *   [ja]このスプリットビューコンポーネントを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsSplitter', ['$compile', 'Splitter', '$onsen', function ($compile, Splitter, $onsen) {
    return {
      restrict: 'E',
      scope: true,

      compile: function compile(element, attrs) {

        return function (scope, element, attrs) {

          var splitter = new Splitter(scope, element, attrs);

          $onsen.declareVarAttribute(attrs, splitter);
          $onsen.registerEventHandlers(splitter, 'destroy');

          element.data('ons-splitter', splitter);

          scope.$on('$destroy', function () {
            splitter._events = undefined;
            element.data('ons-splitter', undefined);
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-splitter-content
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */
(function () {
  'use strict';

  var lastReady = window.ons.SplitterContentElement.rewritables.ready;
  window.ons.SplitterContentElement.rewritables.ready = ons._waitDiretiveInit('ons-splitter-content', lastReady);

  angular.module('onsen').directive('onsSplitterContent', ['$compile', 'SplitterContent', '$onsen', function ($compile, SplitterContent, $onsen) {
    return {
      restrict: 'E',

      compile: function compile(element, attrs) {

        return function (scope, element, attrs) {

          var view = new SplitterContent(scope, element, attrs);

          $onsen.declareVarAttribute(attrs, view);
          $onsen.registerEventHandlers(view, 'destroy');

          element.data('ons-splitter-content', view);

          element[0].pageLoader = $onsen.createPageLoader(view);

          scope.$on('$destroy', function () {
            view._events = undefined;
            element.data('ons-splitter-content', undefined);
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-splitter-side
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-preopen
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preopen" event is fired.[/en]
 *  [ja]"preopen"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-preclose
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preclose" event is fired.[/en]
 *  [ja]"preclose"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postopen
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postopen" event is fired.[/en]
 *  [ja]"postopen"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postclose
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postclose" event is fired.[/en]
 *  [ja]"postclose"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-modechange
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "modechange" event is fired.[/en]
 *  [ja]"modechange"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */
(function () {
  'use strict';

  var lastReady = window.ons.SplitterSideElement.rewritables.ready;
  window.ons.SplitterSideElement.rewritables.ready = ons._waitDiretiveInit('ons-splitter-side', lastReady);

  angular.module('onsen').directive('onsSplitterSide', ['$compile', 'SplitterSide', '$onsen', function ($compile, SplitterSide, $onsen) {
    return {
      restrict: 'E',

      compile: function compile(element, attrs) {

        return function (scope, element, attrs) {

          var view = new SplitterSide(scope, element, attrs);

          $onsen.declareVarAttribute(attrs, view);
          $onsen.registerEventHandlers(view, 'destroy preopen preclose postopen postclose modechange');

          element.data('ons-splitter-side', view);

          element[0].pageLoader = $onsen.createPageLoader(view);

          scope.$on('$destroy', function () {
            view._events = undefined;
            element.data('ons-splitter-side', undefined);
          });

          $onsen.fireComponentEvent(element[0], 'init');
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-switch
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this switch.[/en]
 *   [ja]JavaScriptから参照するための変数名を指定します。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  angular.module('onsen').directive('onsSwitch', ['$onsen', 'SwitchView', function ($onsen, SwitchView) {
    return {
      restrict: 'E',
      replace: false,
      scope: true,

      link: function link(scope, element, attrs) {

        if (attrs.ngController) {
          throw new Error('This element can\'t accept ng-controller directive.');
        }

        var switchView = new SwitchView(element, scope, attrs);
        $onsen.addModifierMethodsForCustomElements(switchView, element);

        $onsen.declareVarAttribute(attrs, switchView);
        element.data('ons-switch', switchView);

        $onsen.cleaner.onDestroy(scope, function () {
          switchView._events = undefined;
          $onsen.removeModifierMethods(switchView);
          element.data('ons-switch', undefined);
          $onsen.clearComponent({
            element: element,
            scope: scope,
            attrs: attrs
          });
          element = attrs = scope = null;
        });

        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  tab.$inject = ['$onsen', 'GenericView'];
  angular.module('onsen').directive('onsTab', tab).directive('onsTabbarItem', tab); // for BC

  function tab($onsen, GenericView) {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        var view = new GenericView(scope, element, attrs);
        element[0].pageLoader = $onsen.createPageLoader(view);

        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }
})();
'use strict';

/**
 * @element ons-tabbar
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this tab bar.[/en]
 *   [ja]このタブバーを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute hide-tabs
 * @initonly
 * @type {Boolean}
 * @default false
 * @description
 *   [en]Whether to hide the tabs. Valid values are true/false.[/en]
 *   [ja]タブを非表示にする場合に指定します。trueもしくはfalseを指定できます。[/ja]
 */

/**
 * @attribute ons-reactive
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "reactive" event is fired.[/en]
 *  [ja]"reactive"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prechange
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prechange" event is fired.[/en]
 *  [ja]"prechange"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postchange
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postchange" event is fired.[/en]
 *  [ja]"postchange"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-init
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "init" event is fired.[/en]
 *  [ja]ページの"init"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-show
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "show" event is fired.[/en]
 *  [ja]ページの"show"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-hide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "hide" event is fired.[/en]
 *  [ja]ページの"hide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when a page's "destroy" event is fired.[/en]
 *  [ja]ページの"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]このイベントが発火された際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出される関数オブジェクトを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしイベントリスナーを指定しなかった場合には、そのイベントに紐づく全てのイベントリスナーが削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーを指定します。[/ja]
 */

(function () {
  'use strict';

  var lastReady = window.ons.TabbarElement.rewritables.ready;
  window.ons.TabbarElement.rewritables.ready = ons._waitDiretiveInit('ons-tabbar', lastReady);

  angular.module('onsen').directive('onsTabbar', ['$onsen', '$compile', '$parse', 'TabbarView', function ($onsen, $compile, $parse, TabbarView) {

    return {
      restrict: 'E',

      replace: false,
      scope: true,

      link: function link(scope, element, attrs, controller) {

        scope.$watch(attrs.hideTabs, function (hide) {
          if (typeof hide === 'string') {
            hide = hide === 'true';
          }
          element[0].setTabbarVisibility(!hide);
        });

        var tabbarView = new TabbarView(scope, element, attrs);
        $onsen.addModifierMethodsForCustomElements(tabbarView, element);

        $onsen.registerEventHandlers(tabbarView, 'reactive prechange postchange init show hide destroy');

        element.data('ons-tabbar', tabbarView);
        $onsen.declareVarAttribute(attrs, tabbarView);

        scope.$on('$destroy', function () {
          tabbarView._events = undefined;
          $onsen.removeModifierMethods(tabbarView);
          element.data('ons-tabbar', undefined);
        });

        $onsen.fireComponentEvent(element[0], 'init');
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('onsen').directive('onsTemplate', ['$templateCache', function ($templateCache) {
    return {
      restrict: 'E',
      terminal: true,
      compile: function compile(element) {
        var content = element[0].template || element.html();
        $templateCache.put(element.attr('id'), content);
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-toast
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this toast dialog.[/en]
 *  [ja]このトーストを参照するための名前を指定します。[/ja]
 */

/**
 * @attribute ons-preshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "preshow" event is fired.[/en]
 *  [ja]"preshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-prehide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "prehide" event is fired.[/en]
 *  [ja]"prehide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-postshow
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "postshow" event is fired.[/en]
 *  [ja]"postshow"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-posthide
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "posthide" event is fired.[/en]
 *  [ja]"posthide"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @attribute ons-destroy
 * @initonly
 * @type {Expression}
 * @description
 *  [en]Allows you to specify custom behavior when the "destroy" event is fired.[/en]
 *  [ja]"destroy"イベントが発火された時の挙動を独自に指定できます。[/ja]
 */

/**
 * @method on
 * @signature on(eventName, listener)
 * @description
 *   [en]Add an event listener.[/en]
 *   [ja]イベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火された際に呼び出されるコールバックを指定します。[/ja]
 */

/**
 * @method once
 * @signature once(eventName, listener)
 * @description
 *  [en]Add an event listener that's only triggered once.[/en]
 *  [ja]一度だけ呼び出されるイベントリスナーを追加します。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]イベントが発火した際に呼び出されるコールバックを指定します。[/ja]
 */

/**
 * @method off
 * @signature off(eventName, [listener])
 * @description
 *  [en]Remove an event listener. If the listener is not specified all listeners for the event type will be removed.[/en]
 *  [ja]イベントリスナーを削除します。もしlistenerパラメータが指定されなかった場合、そのイベントのリスナーが全て削除されます。[/ja]
 * @param {String} eventName
 *   [en]Name of the event.[/en]
 *   [ja]イベント名を指定します。[/ja]
 * @param {Function} listener
 *   [en]Function to execute when the event is triggered.[/en]
 *   [ja]削除するイベントリスナーの関数オブジェクトを渡します。[/ja]
 */

(function () {
  'use strict';

  /**
   * Toast directive.
   */

  angular.module('onsen').directive('onsToast', ['$onsen', 'ToastView', function ($onsen, ToastView) {
    return {
      restrict: 'E',
      replace: false,
      scope: true,
      transclude: false,

      compile: function compile(element, attrs) {

        return {
          pre: function pre(scope, element, attrs) {
            var toast = new ToastView(scope, element, attrs);

            $onsen.declareVarAttribute(attrs, toast);
            $onsen.registerEventHandlers(toast, 'preshow prehide postshow posthide destroy');
            $onsen.addModifierMethodsForCustomElements(toast, element);

            element.data('ons-toast', toast);
            element.data('_scope', scope);

            scope.$on('$destroy', function () {
              toast._events = undefined;
              $onsen.removeModifierMethods(toast);
              element.data('ons-toast', undefined);
              element = null;
            });
          },
          post: function post(scope, element) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-toolbar
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *  [en]Variable name to refer this toolbar.[/en]
 *  [ja]このツールバーを参照するための名前を指定します。[/ja]
 */
(function () {
  'use strict';

  angular.module('onsen').directive('onsToolbar', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      scope: false,
      transclude: false,

      compile: function compile(element) {
        return {
          pre: function pre(scope, element, attrs) {
            // TODO: Remove this dirty fix!
            if (element[0].nodeName === 'ons-toolbar') {
              GenericView.register(scope, element, attrs, { viewKey: 'ons-toolbar' });
            }
          },
          post: function post(scope, element, attrs) {
            $onsen.fireComponentEvent(element[0], 'init');
          }
        };
      }
    };
  }]);
})();
'use strict';

/**
 * @element ons-toolbar-button
 */

/**
 * @attribute var
 * @initonly
 * @type {String}
 * @description
 *   [en]Variable name to refer this button.[/en]
 *   [ja]このボタンを参照するための名前を指定します。[/ja]
 */
(function () {
  'use strict';

  var module = angular.module('onsen');

  module.directive('onsToolbarButton', ['$onsen', 'GenericView', function ($onsen, GenericView) {
    return {
      restrict: 'E',
      scope: false,
      link: {
        pre: function pre(scope, element, attrs) {
          var toolbarButton = new GenericView(scope, element, attrs);
          element.data('ons-toolbar-button', toolbarButton);
          $onsen.declareVarAttribute(attrs, toolbarButton);

          $onsen.addModifierMethodsForCustomElements(toolbarButton, element);

          $onsen.cleaner.onDestroy(scope, function () {
            toolbarButton._events = undefined;
            $onsen.removeModifierMethods(toolbarButton);
            element.data('ons-toolbar-button', undefined);
            element = null;

            $onsen.clearComponent({
              scope: scope,
              attrs: attrs,
              element: element
            });
            scope = element = attrs = null;
          });
        },
        post: function post(scope, element, attrs) {
          $onsen.fireComponentEvent(element[0], 'init');
        }
      }
    };
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  var ComponentCleaner = {
    /**
     * @param {jqLite} element
     */
    decomposeNode: function decomposeNode(element) {
      var children = element.remove().children();
      for (var i = 0; i < children.length; i++) {
        ComponentCleaner.decomposeNode(angular.element(children[i]));
      }
    },

    /**
     * @param {Attributes} attrs
     */
    destroyAttributes: function destroyAttributes(attrs) {
      attrs.$$element = null;
      attrs.$$observers = null;
    },

    /**
     * @param {jqLite} element
     */
    destroyElement: function destroyElement(element) {
      element.remove();
    },

    /**
     * @param {Scope} scope
     */
    destroyScope: function destroyScope(scope) {
      scope.$$listeners = {};
      scope.$$watchers = null;
      scope = null;
    },

    /**
     * @param {Scope} scope
     * @param {Function} fn
     */
    onDestroy: function onDestroy(scope, fn) {
      var clear = scope.$on('$destroy', function () {
        clear();
        fn.apply(null, arguments);
      });
    }
  };

  module.factory('ComponentCleaner', function () {
    return ComponentCleaner;
  });

  // override builtin ng-(eventname) directives
  (function () {
    var ngEventDirectives = {};
    'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ').forEach(function (name) {
      var directiveName = directiveNormalize('ng-' + name);
      ngEventDirectives[directiveName] = ['$parse', function ($parse) {
        return {
          compile: function compile($element, attr) {
            var fn = $parse(attr[directiveName]);
            return function (scope, element, attr) {
              var listener = function listener(event) {
                scope.$apply(function () {
                  fn(scope, { $event: event });
                });
              };
              element.on(name, listener);

              ComponentCleaner.onDestroy(scope, function () {
                element.off(name, listener);
                element = null;

                ComponentCleaner.destroyScope(scope);
                scope = null;

                ComponentCleaner.destroyAttributes(attr);
                attr = null;
              });
            };
          }
        };
      }];

      function directiveNormalize(name) {
        return name.replace(/-([a-z])/g, function (matches) {
          return matches[1].toUpperCase();
        });
      }
    });
    module.config(['$provide', function ($provide) {
      var shift = function shift($delegate) {
        $delegate.shift();
        return $delegate;
      };
      Object.keys(ngEventDirectives).forEach(function (directiveName) {
        $provide.decorator(directiveName + 'Directive', ['$delegate', shift]);
      });
    }]);
    Object.keys(ngEventDirectives).forEach(function (directiveName) {
      module.directive(directiveName, ngEventDirectives[directiveName]);
    });
  })();
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  var module = angular.module('onsen');

  /**
   * Internal service class for framework implementation.
   */
  module.factory('$onsen', ['$rootScope', '$window', '$cacheFactory', '$document', '$templateCache', '$http', '$q', '$compile', '$onsGlobal', 'ComponentCleaner', function ($rootScope, $window, $cacheFactory, $document, $templateCache, $http, $q, $compile, $onsGlobal, ComponentCleaner) {

    var $onsen = createOnsenService();
    var ModifierUtil = $onsGlobal._internal.ModifierUtil;

    return $onsen;

    function createOnsenService() {
      return {

        DIRECTIVE_TEMPLATE_URL: 'templates',

        cleaner: ComponentCleaner,

        DeviceBackButtonHandler: $onsGlobal._deviceBackButtonDispatcher,

        _defaultDeviceBackButtonHandler: $onsGlobal._defaultDeviceBackButtonHandler,

        /**
         * @return {Object}
         */
        getDefaultDeviceBackButtonHandler: function getDefaultDeviceBackButtonHandler() {
          return this._defaultDeviceBackButtonHandler;
        },

        /**
         * @param {Object} view
         * @param {Element} element
         * @param {Array} methodNames
         * @return {Function} A function that dispose all driving methods.
         */
        deriveMethods: function deriveMethods(view, element, methodNames) {
          methodNames.forEach(function (methodName) {
            view[methodName] = function () {
              return element[methodName].apply(element, arguments);
            };
          });

          return function () {
            methodNames.forEach(function (methodName) {
              view[methodName] = null;
            });
            view = element = null;
          };
        },

        /**
         * @param {Class} klass
         * @param {Array} properties
         */
        derivePropertiesFromElement: function derivePropertiesFromElement(klass, properties) {
          properties.forEach(function (property) {
            Object.defineProperty(klass.prototype, property, {
              get: function get() {
                return this._element[0][property];
              },
              set: function set(value) {
                return this._element[0][property] = value; // eslint-disable-line no-return-assign
              }
            });
          });
        },

        /**
         * @param {Object} view
         * @param {Element} element
         * @param {Array} eventNames
         * @param {Function} [map]
         * @return {Function} A function that clear all event listeners
         */
        deriveEvents: function deriveEvents(view, element, eventNames, map) {
          map = map || function (detail) {
            return detail;
          };
          eventNames = [].concat(eventNames);
          var listeners = [];

          eventNames.forEach(function (eventName) {
            var listener = function listener(event) {
              map(event.detail || {});
              view.emit(eventName, event);
            };
            listeners.push(listener);
            element.addEventListener(eventName, listener, false);
          });

          return function () {
            eventNames.forEach(function (eventName, index) {
              element.removeEventListener(eventName, listeners[index], false);
            });
            view = element = listeners = map = null;
          };
        },

        /**
         * @return {Boolean}
         */
        isEnabledAutoStatusBarFill: function isEnabledAutoStatusBarFill() {
          return !!$onsGlobal._config.autoStatusBarFill;
        },

        /**
         * @return {Boolean}
         */
        shouldFillStatusBar: $onsGlobal.shouldFillStatusBar,

        /**
         * @param {Function} action
         */
        autoStatusBarFill: $onsGlobal.autoStatusBarFill,

        /**
         * @param {Object} directive
         * @param {HTMLElement} pageElement
         * @param {Function} callback
         */
        compileAndLink: function compileAndLink(view, pageElement, callback) {
          var link = $compile(pageElement);
          var pageScope = view._scope.$new();

          /**
           * Overwrite page scope.
           */
          angular.element(pageElement).data('_scope', pageScope);

          pageScope.$evalAsync(function () {
            callback(pageElement); // Attach and prepare
            link(pageScope); // Run the controller
          });
        },

        /**
         * @param {Object} view
         * @return {Object} pageLoader
         */
        createPageLoader: function createPageLoader(view) {
          var _this = this;

          return new window.ons.PageLoader(function (_ref, done) {
            var page = _ref.page,
                parent = _ref.parent;

            window.ons._internal.getPageHTMLAsync(page).then(function (html) {
              _this.compileAndLink(view, window.ons._util.createElement(html.trim()), function (element) {
                return done(parent.appendChild(element));
              });
            });
          }, function (element) {
            element._destroy();
            if (angular.element(element).data('_scope')) {
              angular.element(element).data('_scope').$destroy();
            }
          });
        },

        /**
         * @param {Object} params
         * @param {Scope} [params.scope]
         * @param {jqLite} [params.element]
         * @param {Array} [params.elements]
         * @param {Attributes} [params.attrs]
         */
        clearComponent: function clearComponent(params) {
          if (params.scope) {
            ComponentCleaner.destroyScope(params.scope);
          }

          if (params.attrs) {
            ComponentCleaner.destroyAttributes(params.attrs);
          }

          if (params.element) {
            ComponentCleaner.destroyElement(params.element);
          }

          if (params.elements) {
            params.elements.forEach(function (element) {
              ComponentCleaner.destroyElement(element);
            });
          }
        },

        /**
         * @param {jqLite} element
         * @param {String} name
         */
        findElementeObject: function findElementeObject(element, name) {
          return element.inheritedData(name);
        },

        /**
         * @param {String} page
         * @return {Promise}
         */
        getPageHTMLAsync: function getPageHTMLAsync(page) {
          var cache = $templateCache.get(page);

          if (cache) {
            var deferred = $q.defer();

            var html = typeof cache === 'string' ? cache : cache[1];
            deferred.resolve(this.normalizePageHTML(html));

            return deferred.promise;
          } else {
            return $http({
              url: page,
              method: 'GET'
            }).then(function (response) {
              var html = response.data;

              return this.normalizePageHTML(html);
            }.bind(this));
          }
        },

        /**
         * @param {String} html
         * @return {String}
         */
        normalizePageHTML: function normalizePageHTML(html) {
          html = ('' + html).trim();

          if (!html.match(/^<ons-page/)) {
            html = '<ons-page _muted>' + html + '</ons-page>';
          }

          return html;
        },

        /**
         * Create modifier templater function. The modifier templater generate css classes bound modifier name.
         *
         * @param {Object} attrs
         * @param {Array} [modifiers] an array of appendix modifier
         * @return {Function}
         */
        generateModifierTemplater: function generateModifierTemplater(attrs, modifiers) {
          var attrModifiers = attrs && typeof attrs.modifier === 'string' ? attrs.modifier.trim().split(/ +/) : [];
          modifiers = angular.isArray(modifiers) ? attrModifiers.concat(modifiers) : attrModifiers;

          /**
           * @return {String} template eg. 'ons-button--*', 'ons-button--*__item'
           * @return {String}
           */
          return function (template) {
            return modifiers.map(function (modifier) {
              return template.replace('*', modifier);
            }).join(' ');
          };
        },

        /**
         * Add modifier methods to view object for custom elements.
         *
         * @param {Object} view object
         * @param {jqLite} element
         */
        addModifierMethodsForCustomElements: function addModifierMethodsForCustomElements(view, element) {
          var methods = {
            hasModifier: function hasModifier(needle) {
              var tokens = ModifierUtil.split(element.attr('modifier'));
              needle = typeof needle === 'string' ? needle.trim() : '';

              return ModifierUtil.split(needle).some(function (needle) {
                return tokens.indexOf(needle) != -1;
              });
            },

            removeModifier: function removeModifier(needle) {
              needle = typeof needle === 'string' ? needle.trim() : '';

              var modifier = ModifierUtil.split(element.attr('modifier')).filter(function (token) {
                return token !== needle;
              }).join(' ');

              element.attr('modifier', modifier);
            },

            addModifier: function addModifier(modifier) {
              element.attr('modifier', element.attr('modifier') + ' ' + modifier);
            },

            setModifier: function setModifier(modifier) {
              element.attr('modifier', modifier);
            },

            toggleModifier: function toggleModifier(modifier) {
              if (this.hasModifier(modifier)) {
                this.removeModifier(modifier);
              } else {
                this.addModifier(modifier);
              }
            }
          };

          for (var method in methods) {
            if (methods.hasOwnProperty(method)) {
              view[method] = methods[method];
            }
          }
        },

        /**
         * Add modifier methods to view object.
         *
         * @param {Object} view object
         * @param {String} template
         * @param {jqLite} element
         */
        addModifierMethods: function addModifierMethods(view, template, element) {
          var _tr = function _tr(modifier) {
            return template.replace('*', modifier);
          };

          var fns = {
            hasModifier: function hasModifier(modifier) {
              return element.hasClass(_tr(modifier));
            },

            removeModifier: function removeModifier(modifier) {
              element.removeClass(_tr(modifier));
            },

            addModifier: function addModifier(modifier) {
              element.addClass(_tr(modifier));
            },

            setModifier: function setModifier(modifier) {
              var classes = element.attr('class').split(/\s+/),
                  patt = template.replace('*', '.');

              for (var i = 0; i < classes.length; i++) {
                var cls = classes[i];

                if (cls.match(patt)) {
                  element.removeClass(cls);
                }
              }

              element.addClass(_tr(modifier));
            },

            toggleModifier: function toggleModifier(modifier) {
              var cls = _tr(modifier);
              if (element.hasClass(cls)) {
                element.removeClass(cls);
              } else {
                element.addClass(cls);
              }
            }
          };

          var append = function append(oldFn, newFn) {
            if (typeof oldFn !== 'undefined') {
              return function () {
                return oldFn.apply(null, arguments) || newFn.apply(null, arguments);
              };
            } else {
              return newFn;
            }
          };

          view.hasModifier = append(view.hasModifier, fns.hasModifier);
          view.removeModifier = append(view.removeModifier, fns.removeModifier);
          view.addModifier = append(view.addModifier, fns.addModifier);
          view.setModifier = append(view.setModifier, fns.setModifier);
          view.toggleModifier = append(view.toggleModifier, fns.toggleModifier);
        },

        /**
         * Remove modifier methods.
         *
         * @param {Object} view object
         */
        removeModifierMethods: function removeModifierMethods(view) {
          view.hasModifier = view.removeModifier = view.addModifier = view.setModifier = view.toggleModifier = undefined;
        },

        /**
         * Define a variable to JavaScript global scope and AngularJS scope as 'var' attribute name.
         *
         * @param {Object} attrs
         * @param object
         */
        declareVarAttribute: function declareVarAttribute(attrs, object) {
          if (typeof attrs.var === 'string') {
            var varName = attrs.var;
            this._defineVar(varName, object);
          }
        },

        _registerEventHandler: function _registerEventHandler(component, eventName) {
          var capitalizedEventName = eventName.charAt(0).toUpperCase() + eventName.slice(1);

          component.on(eventName, function (event) {
            $onsen.fireComponentEvent(component._element[0], eventName, event && event.detail);

            var handler = component._attrs['ons' + capitalizedEventName];
            if (handler) {
              component._scope.$eval(handler, { $event: event });
              component._scope.$evalAsync();
            }
          });
        },

        /**
         * Register event handlers for attributes.
         *
         * @param {Object} component
         * @param {String} eventNames
         */
        registerEventHandlers: function registerEventHandlers(component, eventNames) {
          eventNames = eventNames.trim().split(/\s+/);

          for (var i = 0, l = eventNames.length; i < l; i++) {
            var eventName = eventNames[i];
            this._registerEventHandler(component, eventName);
          }
        },

        /**
         * @return {Boolean}
         */
        isAndroid: function isAndroid() {
          return !!window.navigator.userAgent.match(/android/i);
        },

        /**
         * @return {Boolean}
         */
        isIOS: function isIOS() {
          return !!window.navigator.userAgent.match(/(ipad|iphone|ipod touch)/i);
        },

        /**
         * @return {Boolean}
         */
        isWebView: function isWebView() {
          return window.ons.isWebView();
        },

        /**
         * @return {Boolean}
         */
        isIOS7above: function () {
          var ua = window.navigator.userAgent;
          var match = ua.match(/(iPad|iPhone|iPod touch);.*CPU.*OS (\d+)_(\d+)/i);

          var result = match ? parseFloat(match[2] + '.' + match[3]) >= 7 : false;

          return function () {
            return result;
          };
        }(),

        /**
         * Fire a named event for a component. The view object, if it exists, is attached to event.component.
         *
         * @param {HTMLElement} [dom]
         * @param {String} event name
         */
        fireComponentEvent: function fireComponentEvent(dom, eventName, data) {
          data = data || {};

          var event = document.createEvent('HTMLEvents');

          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              event[key] = data[key];
            }
          }

          event.component = dom ? angular.element(dom).data(dom.nodeName.toLowerCase()) || null : null;
          event.initEvent(dom.nodeName.toLowerCase() + ':' + eventName, true, true);

          dom.dispatchEvent(event);
        },

        /**
         * Define a variable to JavaScript global scope and AngularJS scope.
         *
         * Util.defineVar('foo', 'foo-value');
         * // => window.foo and $scope.foo is now 'foo-value'
         *
         * Util.defineVar('foo.bar', 'foo-bar-value');
         * // => window.foo.bar and $scope.foo.bar is now 'foo-bar-value'
         *
         * @param {String} name
         * @param object
         */
        _defineVar: function _defineVar(name, object) {
          var names = name.split(/\./);

          function set(container, names, object) {
            var name;
            for (var i = 0; i < names.length - 1; i++) {
              name = names[i];
              if (container[name] === undefined || container[name] === null) {
                container[name] = {};
              }
              container = container[name];
            }

            container[names[names.length - 1]] = object;

            if (container[names[names.length - 1]] !== object) {
              throw new Error('Cannot set var="' + object._attrs.var + '" because it will overwrite a read-only variable.');
            }
          }

          if (ons.componentBase) {
            set(ons.componentBase, names, object);
          }

          // Attach to ancestor with ons-scope attribute.
          var element = object._element[0];

          while (element.parentNode) {
            if (element.hasAttribute('ons-scope')) {
              set(angular.element(element).data('_scope'), names, object);
              element = null;
              return;
            }

            element = element.parentNode;
          }
          element = null;

          // If no ons-scope element was found, attach to $rootScope.
          set($rootScope, names, object);
        }
      };
    }
  }]);
})();
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

Object.keys(ons.notification).filter(function (name) {
  return !/^_/.test(name);
}).forEach(function (name) {
  var originalNotification = ons.notification[name];

  ons.notification[name] = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    typeof message === 'string' ? options.message = message : options = message;

    var compile = options.compile;
    var $element = void 0;

    options.compile = function (element) {
      $element = angular.element(compile ? compile(element) : element);
      return ons.$compile($element)($element.injector().get('$rootScope'));
    };

    options.destroy = function () {
      $element.data('_scope').$destroy();
      $element = null;
    };

    return originalNotification(options);
  };
});
'use strict';

// confirm to use jqLite
if (window.jQuery && angular.element === window.jQuery) {
  console.warn('Onsen UI require jqLite. Load jQuery after loading AngularJS to fix this error. jQuery may break Onsen UI behavior.'); // eslint-disable-line no-console
}
'use strict';

/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function () {
  'use strict';

  angular.module('onsen').run(['$templateCache', function ($templateCache) {
    var templates = window.document.querySelectorAll('script[type="text/ons-template"]');

    for (var i = 0; i < templates.length; i++) {
      var template = angular.element(templates[i]);
      var id = template.attr('id');
      if (typeof id === 'string') {
        $templateCache.put(id, template.text());
      }
    }
  }]);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzLmpzIiwidGVtcGxhdGVzLmpzIiwib25zZW4uanMiLCJhY3Rpb25TaGVldC5qcyIsImFsZXJ0RGlhbG9nLmpzIiwiYWxlcnREaWFsb2dBbmltYXRvci5qcyIsImFuaW1hdGlvbkNob29zZXIuanMiLCJjYXJvdXNlbC5qcyIsImRpYWxvZy5qcyIsImRpYWxvZ0FuaW1hdG9yLmpzIiwiZmFiLmpzIiwiZ2VuZXJpYy5qcyIsImxhenlSZXBlYXQuanMiLCJsYXp5UmVwZWF0RGVsZWdhdGUuanMiLCJtb2RhbC5qcyIsIm5hdmlnYXRvci5qcyIsIm5hdmlnYXRvclRyYW5zaXRpb25BbmltYXRvci5qcyIsIm92ZXJsYXlTbGlkaW5nTWVudUFuaW1hdG9yLmpzIiwicGFnZS5qcyIsInBvcG92ZXIuanMiLCJwb3BvdmVyQW5pbWF0b3IuanMiLCJwdWxsSG9vay5qcyIsInB1c2hTbGlkaW5nTWVudUFuaW1hdG9yLmpzIiwicmV2ZWFsU2xpZGluZ01lbnVBbmltYXRvci5qcyIsInNsaWRpbmdNZW51LmpzIiwic2xpZGluZ01lbnVBbmltYXRvci5qcyIsInNwZWVkRGlhbC5qcyIsInNwbGl0Vmlldy5qcyIsInNwbGl0dGVyLWNvbnRlbnQuanMiLCJzcGxpdHRlci1zaWRlLmpzIiwic3BsaXR0ZXIuanMiLCJzd2l0Y2guanMiLCJ0YWJiYXJWaWV3LmpzIiwidG9hc3QuanMiLCJhY3Rpb25TaGVldEJ1dHRvbi5qcyIsImJhY2tCdXR0b24uanMiLCJib3R0b21Ub29sYmFyLmpzIiwiYnV0dG9uLmpzIiwiZHVtbXlGb3JJbml0LmpzIiwiZ2VzdHVyZURldGVjdG9yLmpzIiwiaWNvbi5qcyIsImlmT3JpZW50YXRpb24uanMiLCJpZlBsYXRmb3JtLmpzIiwiaW5wdXQuanMiLCJrZXlib2FyZC5qcyIsImxpc3QuanMiLCJsaXN0SGVhZGVyLmpzIiwibGlzdEl0ZW0uanMiLCJsb2FkaW5nUGxhY2Vob2xkZXIuanMiLCJwcm9ncmVzc0Jhci5qcyIsInJhbmdlLmpzIiwicmlwcGxlLmpzIiwic2NvcGUuanMiLCJzZWxlY3QuanMiLCJzcGxpdHRlckNvbnRlbnQuanMiLCJzcGxpdHRlclNpZGUuanMiLCJ0YWIuanMiLCJ0YWJCYXIuanMiLCJ0ZW1wbGF0ZS5qcyIsInRvb2xiYXIuanMiLCJ0b29sYmFyQnV0dG9uLmpzIiwiY29tcG9uZW50Q2xlYW5lci5qcyIsIm5vdGlmaWNhdGlvbi5qcyIsInNldHVwLmpzIiwidGVtcGxhdGVMb2FkZXIuanMiXSwibmFtZXMiOlsiZm5UZXN0IiwidGVzdCIsInh5eiIsIkJhc2VDbGFzcyIsImV4dGVuZCIsInByb3BzIiwiX3N1cGVyIiwicHJvdG90eXBlIiwicHJvdG8iLCJPYmplY3QiLCJjcmVhdGUiLCJuYW1lIiwiZm4iLCJ0bXAiLCJyZXQiLCJhcHBseSIsImFyZ3VtZW50cyIsIm5ld0NsYXNzIiwiaW5pdCIsImhhc093blByb3BlcnR5IiwiU3ViQ2xhc3MiLCJFbXB0eUNsYXNzIiwiY29uc3RydWN0b3IiLCJ3aW5kb3ciLCJDbGFzcyIsImFwcCIsImFuZ3VsYXIiLCJtb2R1bGUiLCJlcnIiLCJydW4iLCIkdGVtcGxhdGVDYWNoZSIsInB1dCIsIm9ucyIsImluaXRPbnNlbkZhY2FkZSIsIndhaXRPbnNlblVJTG9hZCIsImluaXRBbmd1bGFyTW9kdWxlIiwiaW5pdFRlbXBsYXRlQ2FjaGUiLCJ1bmxvY2tPbnNlblVJIiwiX3JlYWR5TG9jayIsImxvY2siLCIkY29tcGlsZSIsIiRyb290U2NvcGUiLCJkb2N1bWVudCIsInJlYWR5U3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiYm9keSIsImFwcGVuZENoaWxkIiwiY3JlYXRlRWxlbWVudCIsIkVycm9yIiwiJG9uIiwidmFsdWUiLCIkb25zZW4iLCIkcSIsIl9vbnNlblNlcnZpY2UiLCJfcVNlcnZpY2UiLCJjb25zb2xlIiwiYWxlcnQiLCJfaW50ZXJuYWwiLCJnZXRUZW1wbGF0ZUhUTUxBc3luYyIsInBhZ2UiLCJjYWNoZSIsImdldCIsIlByb21pc2UiLCJyZXNvbHZlIiwiY29tcG9uZW50QmFzZSIsImJvb3RzdHJhcCIsImRlcHMiLCJpc0FycmF5IiwidW5kZWZpbmVkIiwiY29uY2F0IiwiZG9jIiwiZG9jdW1lbnRFbGVtZW50IiwiZmluZFBhcmVudENvbXBvbmVudFVudGlsIiwiZG9tIiwiZWxlbWVudCIsIkhUTUxFbGVtZW50IiwidGFyZ2V0IiwiaW5oZXJpdGVkRGF0YSIsImZpbmRDb21wb25lbnQiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3IiLCJkYXRhIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbXBpbGUiLCJzY29wZSIsIl9nZXRPbnNlblNlcnZpY2UiLCJfd2FpdERpcmV0aXZlSW5pdCIsImVsZW1lbnROYW1lIiwibGFzdFJlYWR5IiwiY2FsbGJhY2siLCJsaXN0ZW4iLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY3JlYXRlRWxlbWVudE9yaWdpbmFsIiwidGVtcGxhdGUiLCJvcHRpb25zIiwibGluayIsInBhcmVudFNjb3BlIiwiJG5ldyIsIiRldmFsQXN5bmMiLCJnZXRTY29wZSIsImUiLCJ0YWdOYW1lIiwicmVzdWx0IiwiYXBwZW5kIiwidGhlbiIsInJlc29sdmVMb2FkaW5nUGxhY2VIb2xkZXJPcmlnaW5hbCIsInJlc29sdmVMb2FkaW5nUGxhY2VIb2xkZXIiLCJyZXNvbHZlTG9hZGluZ1BsYWNlaG9sZGVyIiwicmVzb2x2ZUxvYWRpbmdQbGFjZWhvbGRlck9yaWdpbmFsIiwiZG9uZSIsInNldEltbWVkaWF0ZSIsIl9zZXR1cExvYWRpbmdQbGFjZUhvbGRlcnMiLCJmYWN0b3J5IiwiQWN0aW9uU2hlZXRWaWV3IiwiYXR0cnMiLCJfc2NvcGUiLCJfZWxlbWVudCIsIl9hdHRycyIsIl9jbGVhckRlcml2aW5nTWV0aG9kcyIsImRlcml2ZU1ldGhvZHMiLCJfY2xlYXJEZXJpdmluZ0V2ZW50cyIsImRlcml2ZUV2ZW50cyIsImRldGFpbCIsImFjdGlvblNoZWV0IiwiYmluZCIsIl9kZXN0cm95IiwiZW1pdCIsInJlbW92ZSIsInJlZ2lzdGVyQW5pbWF0b3IiLCJBbmltYXRvciIsIkFjdGlvblNoZWV0RWxlbWVudCIsIk1pY3JvRXZlbnQiLCJtaXhpbiIsImRlcml2ZVByb3BlcnRpZXNGcm9tRWxlbWVudCIsIkFsZXJ0RGlhbG9nVmlldyIsImFsZXJ0RGlhbG9nIiwiQWxlcnREaWFsb2dBbmltYXRvciIsIkFuZHJvaWRBbGVydERpYWxvZ0FuaW1hdG9yIiwiSU9TQWxlcnREaWFsb2dBbmltYXRvciIsIkFuaW1hdG9yRmFjdG9yeSIsIkNhcm91c2VsVmlldyIsImNhcm91c2VsIiwiRGlhbG9nVmlldyIsImRpYWxvZyIsIkRpYWxvZ0VsZW1lbnQiLCJEaWFsb2dBbmltYXRvciIsIklPU0RpYWxvZ0FuaW1hdG9yIiwiQW5kcm9pZERpYWxvZ0FuaW1hdG9yIiwiU2xpZGVEaWFsb2dBbmltYXRvciIsIkZhYlZpZXciLCJHZW5lcmljVmlldyIsInNlbGYiLCJkaXJlY3RpdmVPbmx5IiwibW9kaWZpZXJUZW1wbGF0ZSIsImFkZE1vZGlmaWVyTWV0aG9kcyIsImFkZE1vZGlmaWVyTWV0aG9kc0ZvckN1c3RvbUVsZW1lbnRzIiwiY2xlYW5lciIsIm9uRGVzdHJveSIsIl9ldmVudHMiLCJyZW1vdmVNb2RpZmllck1ldGhvZHMiLCJjbGVhckNvbXBvbmVudCIsInJlZ2lzdGVyIiwidmlldyIsInZpZXdLZXkiLCJkZWNsYXJlVmFyQXR0cmlidXRlIiwiZGVzdHJveSIsIm5vb3AiLCJBbmd1bGFyTGF6eVJlcGVhdERlbGVnYXRlIiwiTGF6eVJlcGVhdFZpZXciLCJsaW5rZXIiLCJfbGlua2VyIiwidXNlckRlbGVnYXRlIiwiJGV2YWwiLCJvbnNMYXp5UmVwZWF0IiwiaW50ZXJuYWxEZWxlZ2F0ZSIsIl9wcm92aWRlciIsIkxhenlSZXBlYXRQcm92aWRlciIsInBhcmVudE5vZGUiLCJyZWZyZXNoIiwiJHdhdGNoIiwiY291bnRJdGVtcyIsIl9vbkNoYW5nZSIsImRpcmVjdGl2ZUF0dHJpYnV0ZXMiLCJ0ZW1wbGF0ZUVsZW1lbnQiLCJfcGFyZW50U2NvcGUiLCJmb3JFYWNoIiwicmVtb3ZlQXR0cmlidXRlIiwiYXR0ciIsImNsb25lTm9kZSIsIml0ZW0iLCJfdXNlckRlbGVnYXRlIiwiY29uZmlndXJlSXRlbVNjb3BlIiwiRnVuY3Rpb24iLCJkZXN0cm95SXRlbVNjb3BlIiwiY3JlYXRlSXRlbUNvbnRlbnQiLCJpbmRleCIsIl9wcmVwYXJlSXRlbUVsZW1lbnQiLCJfYWRkU3BlY2lhbFByb3BlcnRpZXMiLCJfdXNpbmdCaW5kaW5nIiwiY2xvbmVkIiwiaSIsImxhc3QiLCIkaW5kZXgiLCIkZmlyc3QiLCIkbGFzdCIsIiRtaWRkbGUiLCIkZXZlbiIsIiRvZGQiLCIkZGVzdHJveSIsIkxhenlSZXBlYXREZWxlZ2F0ZSIsIk1vZGFsQW5pbWF0b3IiLCJGYWRlTW9kYWxBbmltYXRvciIsIiRwYXJzZSIsIk1vZGFsVmlldyIsIl9hbmltYXRvckZhY3RvcnkiLCJzZXRBbmltYXRpb25PcHRpb25zIiwiYW5pbWF0aW9uT3B0aW9ucyIsInNob3ciLCJoaWRlIiwidG9nZ2xlIiwiTW9kYWxFbGVtZW50IiwiTmF2aWdhdG9yVmlldyIsIl9wcmV2aW91c1BhZ2VTY29wZSIsIl9ib3VuZE9uUHJlcG9wIiwiX29uUHJlcG9wIiwib24iLCJuYXZpZ2F0b3IiLCJldmVudCIsInBhZ2VzIiwibGVuZ3RoIiwib2ZmIiwiTmF2aWdhdG9yVHJhbnNpdGlvbkFuaW1hdG9yIiwiRmFkZU5hdmlnYXRvclRyYW5zaXRpb25BbmltYXRvciIsIklPU1NsaWRlTmF2aWdhdG9yVHJhbnNpdGlvbkFuaW1hdG9yIiwiTGlmdE5hdmlnYXRvclRyYW5zaXRpb25BbmltYXRvciIsIlNpbXBsZVNsaWRlTmF2aWdhdG9yVHJhbnNpdGlvbkFuaW1hdG9yIiwiU2xpZGluZ01lbnVBbmltYXRvciIsIk92ZXJsYXlTbGlkaW5nTWVudUFuaW1hdG9yIiwiX2JsYWNrTWFzayIsIl9pc1JpZ2h0IiwiX21lbnVQYWdlIiwiX21haW5QYWdlIiwiX3dpZHRoIiwic2V0dXAiLCJtYWluUGFnZSIsIm1lbnVQYWdlIiwid2lkdGgiLCJpc1JpZ2h0IiwiY3NzIiwiZGlzcGxheSIsInpJbmRleCIsInJpZ2h0IiwibGVmdCIsImJhY2tncm91bmRDb2xvciIsInRvcCIsImJvdHRvbSIsInBvc2l0aW9uIiwicHJlcGVuZCIsIm9uUmVzaXplZCIsImlzT3BlbmVkIiwibWF4IiwiY2xpZW50V2lkdGgiLCJtZW51U3R5bGUiLCJfZ2VuZXJhdGVNZW51UGFnZVN0eWxlIiwiYW5pbWl0IiwicXVldWUiLCJwbGF5IiwicmVtb3ZlQXR0ciIsIm9wZW5NZW51IiwiaW5zdGFudCIsImR1cmF0aW9uIiwiZGVsYXkiLCJtYWluUGFnZVN0eWxlIiwiX2dlbmVyYXRlTWFpblBhZ2VTdHlsZSIsInNldFRpbWVvdXQiLCJ3YWl0IiwidGltaW5nIiwiY2xvc2VNZW51IiwibWVudVBhZ2VTdHlsZSIsInRyYW5zbGF0ZU1lbnUiLCJNYXRoIiwibWluIiwibWF4RGlzdGFuY2UiLCJkaXN0YW5jZSIsIm9wYWNpdHkiLCJrZXlzIiwieCIsInRyYW5zZm9ybSIsImNvcHkiLCJQYWdlVmlldyIsIl9jbGVhckxpc3RlbmVyIiwiZGVmaW5lUHJvcGVydHkiLCJvbkRldmljZUJhY2tCdXR0b24iLCJzZXQiLCJfdXNlckJhY2tCdXR0b25IYW5kbGVyIiwiX2VuYWJsZUJhY2tCdXR0b25IYW5kbGVyIiwibmdEZXZpY2VCYWNrQnV0dG9uIiwibmdJbmZpbml0ZVNjcm9sbCIsIm9uSW5maW5pdGVTY3JvbGwiLCJfb25EZXZpY2VCYWNrQnV0dG9uIiwiJGV2ZW50IiwibGFzdEV2ZW50IiwiUG9wb3ZlclZpZXciLCJwb3BvdmVyIiwiUG9wb3ZlckFuaW1hdG9yIiwiRmFkZVBvcG92ZXJBbmltYXRvciIsIlB1bGxIb29rVmlldyIsInB1bGxIb29rIiwib25BY3Rpb24iLCJuZ0FjdGlvbiIsIiRkb25lIiwiUHVzaFNsaWRpbmdNZW51QW5pbWF0b3IiLCJtYWluUGFnZVRyYW5zZm9ybSIsIl9nZW5lcmF0ZUFib3ZlUGFnZVRyYW5zZm9ybSIsIl9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZSIsImFib3ZlVHJhbnNmb3JtIiwiYmVoaW5kU3R5bGUiLCJiZWhpbmRYIiwiYmVoaW5kVHJhbnNmb3JtIiwiUmV2ZWFsU2xpZGluZ01lbnVBbmltYXRvciIsImJveFNoYWRvdyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImJlaGluZERpc3RhbmNlIiwiaXNOYU4iLCJTbGlkaW5nTWVudVZpZXdNb2RlbCIsIl9kaXN0YW5jZSIsIl9tYXhEaXN0YW5jZSIsImlzTnVtYmVyIiwic2V0TWF4RGlzdGFuY2UiLCJzaG91bGRPcGVuIiwic2hvdWxkQ2xvc2UiLCJpc0Nsb3NlZCIsIm9wZW5PckNsb3NlIiwib3BlbiIsImNsb3NlIiwiZ2V0WCIsImdldE1heERpc3RhbmNlIiwidHJhbnNsYXRlIiwiQW5pbWF0aW9uQ2hvb3NlciIsIlNsaWRpbmdNZW51VmlldyIsIl9kb29yTG9jayIsIl9pc1JpZ2h0TWVudSIsIl9Eb29yTG9jayIsInNpZGUiLCJfbWFpblBhZ2VHZXN0dXJlRGV0ZWN0b3IiLCJHZXN0dXJlRGV0ZWN0b3IiLCJfYm91bmRPblRhcCIsIl9vblRhcCIsIl9ub3JtYWxpemVNYXhTbGlkZURpc3RhbmNlQXR0ciIsIl9sb2dpYyIsIl90cmFuc2xhdGUiLCJfb3BlbiIsIl9jbG9zZSIsIiRvYnNlcnZlIiwiX29uTWF4U2xpZGVEaXN0YW5jZUNoYW5nZWQiLCJfb25Td2lwZWFibGVDaGFuZ2VkIiwiX2JvdW5kT25XaW5kb3dSZXNpemUiLCJfb25XaW5kb3dSZXNpemUiLCJfYm91bmRIYW5kbGVFdmVudCIsIl9oYW5kbGVFdmVudCIsIl9iaW5kRXZlbnRzIiwic2V0TWFpblBhZ2UiLCJzZXRNZW51UGFnZSIsIl9kZXZpY2VCYWNrQnV0dG9uSGFuZGxlciIsIl9kZXZpY2VCYWNrQnV0dG9uRGlzcGF0Y2hlciIsImNyZWF0ZUhhbmRsZXIiLCJ1bmxvY2siLCJhbmltYXRpb25DaG9vc2VyIiwiYW5pbWF0b3JzIiwiX2FuaW1hdG9yRGljdCIsImJhc2VDbGFzcyIsImJhc2VDbGFzc05hbWUiLCJkZWZhdWx0QW5pbWF0aW9uIiwidHlwZSIsImRlZmF1bHRBbmltYXRpb25PcHRpb25zIiwiX2FuaW1hdG9yIiwibmV3QW5pbWF0b3IiLCJtYXhTbGlkZURpc3RhbmNlIiwic3dpcGVhYmxlIiwic2V0U3dpcGVhYmxlIiwiZ2V0RGV2aWNlQmFja0J1dHRvbkhhbmRsZXIiLCJpc01lbnVPcGVuZWQiLCJjYWxsUGFyZW50SGFuZGxlciIsIl9yZWZyZXNoTWVudVBhZ2VXaWR0aCIsImVuYWJsZWQiLCJfYWN0aXZhdGVHZXN0dXJlRGV0ZWN0b3IiLCJfZGVhY3RpdmF0ZUdlc3R1cmVEZXRlY3RvciIsIl9yZWNhbGN1bGF0ZU1BWCIsImluZGV4T2YiLCJwYXJzZUludCIsInJlcGxhY2UiLCJwYXJzZUZsb2F0IiwiX2dlc3R1cmVEZXRlY3RvciIsImRyYWdNaW5EaXN0YW5jZSIsIl9hcHBlbmRNYWluUGFnZSIsInBhZ2VVcmwiLCJ0ZW1wbGF0ZUhUTUwiLCJwYWdlU2NvcGUiLCJwYWdlQ29udGVudCIsIl9jdXJyZW50UGFnZUVsZW1lbnQiLCJfY3VycmVudFBhZ2VTY29wZSIsIl9jdXJyZW50UGFnZVVybCIsIl9zaG93IiwiX2FwcGVuZE1lbnVQYWdlIiwiX2N1cnJlbnRNZW51UGFnZVNjb3BlIiwiX2N1cnJlbnRNZW51UGFnZUVsZW1lbnQiLCJnZXRQYWdlSFRNTEFzeW5jIiwiaHRtbCIsImlzTG9ja2VkIiwiX2lzSW5zaWRlSWdub3JlZEVsZW1lbnQiLCJfaXNJbnNpZGVTd2lwZVRhcmdldEFyZWEiLCJnZXN0dXJlIiwicHJldmVudERlZmF1bHQiLCJkZWx0YVgiLCJkZWx0YURpc3RhbmNlIiwic3RhcnRFdmVudCIsInN0b3BEZXRlY3QiLCJfbGFzdERpc3RhbmNlIiwiZ2V0QXR0cmlidXRlIiwiY2VudGVyIiwicGFnZVgiLCJfc3dpcGVUYXJnZXRXaWR0aCIsIl9nZXRTd2lwZVRhcmdldFdpZHRoIiwidGFyZ2V0V2lkdGgiLCJzd2lwZVRhcmdldFdpZHRoIiwic2xpZGluZ01lbnUiLCJ3YWl0VW5sb2NrIiwiYW5pbWF0aW9uIiwiY2hpbGRyZW4iLCJ0b2dnbGVNZW51IiwiY2xvc2VDbG9zZSIsIlNwZWVkRGlhbFZpZXciLCIkb25zR2xvYmFsIiwiU1BMSVRfTU9ERSIsIkNPTExBUFNFX01PREUiLCJNQUlOX1BBR0VfUkFUSU8iLCJTcGxpdFZpZXciLCJhZGRDbGFzcyIsIl9zZWNvbmRhcnlQYWdlIiwiX21heCIsIl9tb2RlIiwiX2RvU3BsaXQiLCJfZG9Db2xsYXBzZSIsIm9yaWVudGF0aW9uIiwiX29uUmVzaXplIiwic2Vjb25kYXJ5UGFnZSIsInNldFNlY29uZGFyeVBhZ2UiLCJfY29uc2lkZXJDaGFuZ2luZ0NvbGxhcHNlIiwiX3NldFNpemUiLCJfYXBwZW5kU2Vjb25kUGFnZSIsIl9jdXJyZW50U2Vjb25kYXJ5UGFnZUVsZW1lbnQiLCJfY3VycmVudFNlY29uZGFyeVBhZ2VTY29wZSIsIl9jdXJyZW50UGFnZSIsInRyaW0iLCJsYXN0TW9kZSIsInNob3VsZCIsIl9zaG91bGRDb2xsYXBzZSIsIl9maXJlVXBkYXRlRXZlbnQiLCJfYWN0aXZhdGVTcGxpdE1vZGUiLCJfYWN0aXZhdGVDb2xsYXBzZU1vZGUiLCJ1cGRhdGUiLCJfZ2V0T3JpZW50YXRpb24iLCJpc1BvcnRyYWl0IiwiZ2V0Q3VycmVudE1vZGUiLCJjIiwiY29sbGFwc2UiLCJpc0xhbmRzY2FwZSIsInN1YnN0ciIsIm51bSIsInNwbGl0IiwiaW5uZXJXaWR0aCIsIm1xIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJtYWluUGFnZVdpZHRoIiwic2Vjb25kYXJ5U2l6ZSIsIl9maXJlRXZlbnQiLCJzcGxpdFZpZXciLCJ0aGF0Iiwic2hvdWxkQ29sbGFwc2UiLCJjdXJyZW50TW9kZSIsIm4iLCJpc0Zpbml0ZSIsIlNwbGl0dGVyQ29udGVudCIsImxvYWQiLCJfcGFnZVNjb3BlIiwiU3BsaXR0ZXJTaWRlIiwiU3BsaXR0ZXIiLCJwcm9wIiwiU3dpdGNoVmlldyIsIl9jaGVja2JveCIsIl9wcmVwYXJlTmdNb2RlbCIsIm5nTW9kZWwiLCJhc3NpZ24iLCIkcGFyZW50IiwiY2hlY2tlZCIsIm5nQ2hhbmdlIiwiVGFiYmFyTm9uZUFuaW1hdG9yIiwiVGFiYmFyRmFkZUFuaW1hdG9yIiwiVGFiYmFyU2xpZGVBbmltYXRvciIsIlRhYmJhclZpZXciLCJfbGFzdFBhZ2VFbGVtZW50IiwiX2xhc3RQYWdlU2NvcGUiLCJUYWJiYXJFbGVtZW50IiwiVG9hc3RWaWV3IiwidG9hc3QiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInRyYW5zY2x1ZGUiLCJwcmUiLCJyZWdpc3RlckV2ZW50SGFuZGxlcnMiLCJwb3N0IiwiZmlyZUNvbXBvbmVudEV2ZW50IiwiQ29tcG9uZW50Q2xlYW5lciIsImNvbnRyb2xsZXIiLCJiYWNrQnV0dG9uIiwibmdDbGljayIsIm9uQ2xpY2siLCJkZXN0cm95U2NvcGUiLCJkZXN0cm95QXR0cmlidXRlcyIsImJ1dHRvbiIsImRpc2FibGVkIiwicGFyZW50RWxlbWVudCIsIl9zZXR1cCIsIl9zZXR1cEluaXRpYWxJbmRleCIsIl9zYXZlTGFzdFN0YXRlIiwiaXNSZWFkeSIsIiRicm9hZGNhc3QiLCJmYWIiLCJFVkVOVFMiLCJzY29wZURlZiIsInJlZHVjZSIsImRpY3QiLCJ0aXRsaXplIiwic3RyIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsIl8iLCJoYW5kbGVyIiwiZ2VzdHVyZURldGVjdG9yIiwiam9pbiIsImljb24iLCJfdXBkYXRlIiwidXNlck9yaWVudGF0aW9uIiwib25zSWZPcmllbnRhdGlvbiIsImdldExhbmRzY2FwZU9yUG9ydHJhaXQiLCJwbGF0Zm9ybSIsImdldFBsYXRmb3JtU3RyaW5nIiwidXNlclBsYXRmb3JtIiwidXNlclBsYXRmb3JtcyIsIm9uc0lmUGxhdGZvcm0iLCJ1c2VyQWdlbnQiLCJtYXRjaCIsImlzT3BlcmEiLCJvcGVyYSIsImlzRmlyZWZveCIsIkluc3RhbGxUcmlnZ2VyIiwiaXNTYWZhcmkiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0VkZ2UiLCJpc0Nocm9tZSIsImNocm9tZSIsImlzSUUiLCJkb2N1bWVudE1vZGUiLCJlbCIsIm9uSW5wdXQiLCJfaXNUZXh0SW5wdXQiLCJOdW1iZXIiLCJjb21waWxlRnVuY3Rpb24iLCJkaXNwU2hvdyIsImRpc3BIaWRlIiwib25TaG93Iiwib25IaWRlIiwib25Jbml0IiwidmlzaWJsZSIsInNvZnR3YXJlS2V5Ym9hcmQiLCJfdmlzaWJsZSIsInByaW9yaXR5IiwidGVybWluYWwiLCJsYXp5UmVwZWF0Iiwib25zTG9hZGluZ1BsYWNlaG9sZGVyIiwiX3Jlc29sdmVMb2FkaW5nUGxhY2Vob2xkZXIiLCJjb250ZW50RWxlbWVudCIsIm1vZGFsIiwiTmF2aWdhdG9yRWxlbWVudCIsInJld3JpdGFibGVzIiwicmVhZHkiLCJwYWdlTG9hZGVyIiwiY3JlYXRlUGFnZUxvYWRlciIsImZpcmVQYWdlSW5pdEV2ZW50IiwiZiIsImlzQXR0YWNoZWQiLCJmaXJlQWN0dWFsUGFnZUluaXRFdmVudCIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInBvc3RMaW5rIiwiX3V0aWwiLCJ3YXJuIiwibWFpbiIsIm1lbnUiLCJtYWluSHRtbCIsIm1lbnVIdG1sIiwic3BlZWREaWFsIiwic2Vjb25kYXJ5SHRtbCIsInNwbGl0dGVyIiwiU3BsaXR0ZXJDb250ZW50RWxlbWVudCIsIlNwbGl0dGVyU2lkZUVsZW1lbnQiLCJuZ0NvbnRyb2xsZXIiLCJzd2l0Y2hWaWV3IiwidGFiIiwiaGlkZVRhYnMiLCJzZXRUYWJiYXJWaXNpYmlsaXR5IiwidGFiYmFyVmlldyIsImNvbnRlbnQiLCJ0b29sYmFyQnV0dG9uIiwiZGVjb21wb3NlTm9kZSIsIiQkZWxlbWVudCIsIiQkb2JzZXJ2ZXJzIiwiZGVzdHJveUVsZW1lbnQiLCIkJGxpc3RlbmVycyIsIiQkd2F0Y2hlcnMiLCJjbGVhciIsIm5nRXZlbnREaXJlY3RpdmVzIiwiZGlyZWN0aXZlTmFtZSIsImRpcmVjdGl2ZU5vcm1hbGl6ZSIsIiRlbGVtZW50IiwibGlzdGVuZXIiLCIkYXBwbHkiLCJjb25maWciLCIkcHJvdmlkZSIsInNoaWZ0IiwiJGRlbGVnYXRlIiwiZGVjb3JhdG9yIiwiJHdpbmRvdyIsIiRjYWNoZUZhY3RvcnkiLCIkZG9jdW1lbnQiLCIkaHR0cCIsImNyZWF0ZU9uc2VuU2VydmljZSIsIk1vZGlmaWVyVXRpbCIsIkRJUkVDVElWRV9URU1QTEFURV9VUkwiLCJEZXZpY2VCYWNrQnV0dG9uSGFuZGxlciIsIl9kZWZhdWx0RGV2aWNlQmFja0J1dHRvbkhhbmRsZXIiLCJnZXREZWZhdWx0RGV2aWNlQmFja0J1dHRvbkhhbmRsZXIiLCJtZXRob2ROYW1lcyIsIm1ldGhvZE5hbWUiLCJrbGFzcyIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsImV2ZW50TmFtZXMiLCJtYXAiLCJsaXN0ZW5lcnMiLCJldmVudE5hbWUiLCJwdXNoIiwiaXNFbmFibGVkQXV0b1N0YXR1c0JhckZpbGwiLCJfY29uZmlnIiwiYXV0b1N0YXR1c0JhckZpbGwiLCJzaG91bGRGaWxsU3RhdHVzQmFyIiwiY29tcGlsZUFuZExpbmsiLCJwYWdlRWxlbWVudCIsIlBhZ2VMb2FkZXIiLCJwYXJlbnQiLCJwYXJhbXMiLCJlbGVtZW50cyIsImZpbmRFbGVtZW50ZU9iamVjdCIsImRlZmVycmVkIiwiZGVmZXIiLCJub3JtYWxpemVQYWdlSFRNTCIsInByb21pc2UiLCJ1cmwiLCJtZXRob2QiLCJyZXNwb25zZSIsImdlbmVyYXRlTW9kaWZpZXJUZW1wbGF0ZXIiLCJtb2RpZmllcnMiLCJhdHRyTW9kaWZpZXJzIiwibW9kaWZpZXIiLCJtZXRob2RzIiwiaGFzTW9kaWZpZXIiLCJuZWVkbGUiLCJ0b2tlbnMiLCJzb21lIiwicmVtb3ZlTW9kaWZpZXIiLCJmaWx0ZXIiLCJ0b2tlbiIsImFkZE1vZGlmaWVyIiwic2V0TW9kaWZpZXIiLCJ0b2dnbGVNb2RpZmllciIsIl90ciIsImZucyIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJjbGFzc2VzIiwicGF0dCIsImNscyIsIm9sZEZuIiwibmV3Rm4iLCJvYmplY3QiLCJ2YXIiLCJ2YXJOYW1lIiwiX2RlZmluZVZhciIsIl9yZWdpc3RlckV2ZW50SGFuZGxlciIsImNvbXBvbmVudCIsImNhcGl0YWxpemVkRXZlbnROYW1lIiwibCIsImlzQW5kcm9pZCIsImlzSU9TIiwiaXNXZWJWaWV3IiwiaXNJT1M3YWJvdmUiLCJ1YSIsImtleSIsIm5hbWVzIiwiY29udGFpbmVyIiwiaGFzQXR0cmlidXRlIiwibm90aWZpY2F0aW9uIiwib3JpZ2luYWxOb3RpZmljYXRpb24iLCJtZXNzYWdlIiwiaW5qZWN0b3IiLCJqUXVlcnkiLCJ0ZW1wbGF0ZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaWQiLCJ0ZXh0Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7QUFLQSxDQUFDLFlBQVc7QUFDVjs7QUFDQSxNQUFJQSxTQUFTLE1BQU1DLElBQU4sQ0FBVyxZQUFVO0FBQUNDO0FBQUssR0FBM0IsSUFBK0IsWUFBL0IsR0FBOEMsSUFBM0Q7O0FBRUE7QUFDQSxXQUFTQyxTQUFULEdBQW9CLENBQUU7O0FBRXRCO0FBQ0FBLFlBQVVDLE1BQVYsR0FBbUIsVUFBU0MsS0FBVCxFQUFnQjtBQUNqQyxRQUFJQyxTQUFTLEtBQUtDLFNBQWxCOztBQUVBO0FBQ0E7QUFDQSxRQUFJQyxRQUFRQyxPQUFPQyxNQUFQLENBQWNKLE1BQWQsQ0FBWjs7QUFFQTtBQUNBLFNBQUssSUFBSUssSUFBVCxJQUFpQk4sS0FBakIsRUFBd0I7QUFDdEI7QUFDQUcsWUFBTUcsSUFBTixJQUFjLE9BQU9OLE1BQU1NLElBQU4sQ0FBUCxLQUF1QixVQUF2QixJQUNaLE9BQU9MLE9BQU9LLElBQVAsQ0FBUCxJQUF1QixVQURYLElBQ3lCWCxPQUFPQyxJQUFQLENBQVlJLE1BQU1NLElBQU4sQ0FBWixDQUR6QixHQUVULFVBQVNBLElBQVQsRUFBZUMsRUFBZixFQUFrQjtBQUNqQixlQUFPLFlBQVc7QUFDaEIsY0FBSUMsTUFBTSxLQUFLUCxNQUFmOztBQUVBO0FBQ0E7QUFDQSxlQUFLQSxNQUFMLEdBQWNBLE9BQU9LLElBQVAsQ0FBZDs7QUFFQTtBQUNBO0FBQ0EsY0FBSUcsTUFBTUYsR0FBR0csS0FB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QixFQUF1QnJuQixTQUFTc25CLElBQVQsRUFBdkI7QUFDRDtBQUNGO0FBQ0YsR0FWRDtBQVlELENBZkQiLCJmaWxlIjoiYW5ndWxhci1vbnNlbnVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogU2ltcGxlIEphdmFTY3JpcHQgSW5oZXJpdGFuY2UgZm9yIEVTIDUuMVxuICogYmFzZWQgb24gaHR0cDovL2Vqb2huLm9yZy9ibG9nL3NpbXBsZS1qYXZhc2NyaXB0LWluaGVyaXRhbmNlL1xuICogIChpbnNwaXJlZCBieSBiYXNlMiBhbmQgUHJvdG90eXBlKVxuICogTUlUIExpY2Vuc2VkLlxuICovXG4oZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgZm5UZXN0ID0gL3h5ei8udGVzdChmdW5jdGlvbigpe3h5ejt9KSA/IC9cXGJfc3VwZXJcXGIvIDogLy4qLztcblxuICAvLyBUaGUgYmFzZSBDbGFzcyBpbXBsZW1lbnRhdGlvbiAoZG9lcyBub3RoaW5nKVxuICBmdW5jdGlvbiBCYXNlQ2xhc3MoKXt9XG5cbiAgLy8gQ3JlYXRlIGEgbmV3IENsYXNzIHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIGNsYXNzXG4gIEJhc2VDbGFzcy5leHRlbmQgPSBmdW5jdGlvbihwcm9wcykge1xuICAgIHZhciBfc3VwZXIgPSB0aGlzLnByb3RvdHlwZTtcblxuICAgIC8vIFNldCB1cCB0aGUgcHJvdG90eXBlIHRvIGluaGVyaXQgZnJvbSB0aGUgYmFzZSBjbGFzc1xuICAgIC8vIChidXQgd2l0aG91dCBydW5uaW5nIHRoZSBpbml0IGNvbnN0cnVjdG9yKVxuICAgIHZhciBwcm90byA9IE9iamVjdC5jcmVhdGUoX3N1cGVyKTtcblxuICAgIC8vIENvcHkgdGhlIHByb3BlcnRpZXMgb3ZlciBvbnRvIHRoZSBuZXcgcHJvdG90eXBlXG4gICAgZm9yICh2YXIgbmFtZSBpbiBwcm9wcykge1xuICAgICAgLy8gQ2hlY2sgaWYgd2UncmUgb3ZlcndyaXRpbmcgYW4gZXhpc3RpbmcgZnVuY3Rpb25cbiAgICAgIHByb3RvW25hbWVdID0gdHlwZW9mIHByb3BzW25hbWVdID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgdHlwZW9mIF9zdXBlcltuYW1lXSA9PSBcImZ1bmN0aW9uXCIgJiYgZm5UZXN0LnRlc3QocHJvcHNbbmFtZV0pXG4gICAgICAgID8gKGZ1bmN0aW9uKG5hbWUsIGZuKXtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIHRtcCA9IHRoaXMuX3N1cGVyO1xuXG4gICAgICAgICAgICAgIC8vIEFkZCBhIG5ldyAuX3N1cGVyKCkgbWV0aG9kIHRoYXQgaXMgdGhlIHNhbWUgbWV0aG9kXG4gICAgICAgICAgICAgIC8vIGJ1dCBvbiB0aGUgc3VwZXItY2xhc3NcbiAgICAgICAgICAgICAgdGhpcy5fc3VwZXIgPSBfc3VwZXJbbmFtZV07XG5cbiAgICAgICAgICAgICAgLy8gVGhlIG1ldGhvZCBvbmx5IG5lZWQgdG8gYmUgYm91bmQgdGVtcG9yYXJpbHksIHNvIHdlXG4gICAgICAgICAgICAgIC8vIHJlbW92ZSBpdCB3aGVuIHdlJ3JlIGRvbmUgZXhlY3V0aW5nXG4gICAgICAgICAgICAgIHZhciByZXQgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IHRtcDtcblxuICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KShuYW1lLCBwcm9wc1tuYW1lXSlcbiAgICAgICAgOiBwcm9wc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBUaGUgbmV3IGNvbnN0cnVjdG9yXG4gICAgdmFyIG5ld0NsYXNzID0gdHlwZW9mIHByb3RvLmluaXQgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBwcm90by5oYXNPd25Qcm9wZXJ0eShcImluaXRcIilcbiAgICAgICAgPyBwcm90by5pbml0IC8vIEFsbCBjb25zdHJ1Y3Rpb24gaXMgYWN0dWFsbHkgZG9uZSBpbiB0aGUgaW5pdCBtZXRob2RcbiAgICAgICAgOiBmdW5jdGlvbiBTdWJDbGFzcygpeyBfc3VwZXIuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG4gICAgICA6IGZ1bmN0aW9uIEVtcHR5Q2xhc3MoKXt9O1xuXG4gICAgLy8gUG9wdWxhdGUgb3VyIGNvbnN0cnVjdGVkIHByb3RvdHlwZSBvYmplY3RcbiAgICBuZXdDbGFzcy5wcm90b3R5cGUgPSBwcm90bztcblxuICAgIC8vIEVuZm9yY2UgdGhlIGNvbnN0cnVjdG9yIHRvIGJlIHdoYXQgd2UgZXhwZWN0XG4gICAgcHJvdG8uY29uc3RydWN0b3IgPSBuZXdDbGFzcztcblxuICAgIC8vIEFuZCBtYWtlIHRoaXMgY2xhc3MgZXh0ZW5kYWJsZVxuICAgIG5ld0NsYXNzLmV4dGVuZCA9IEJhc2VDbGFzcy5leHRlbmQ7XG5cbiAgICByZXR1cm4gbmV3Q2xhc3M7XG4gIH07XG5cbiAgLy8gZXhwb3J0XG4gIHdpbmRvdy5DbGFzcyA9IEJhc2VDbGFzcztcbn0pKCk7XG4iLCIvL0hFQUQgXG4oZnVuY3Rpb24oYXBwKSB7XG50cnkgeyBhcHAgPSBhbmd1bGFyLm1vZHVsZShcInRlbXBsYXRlcy1tYWluXCIpOyB9XG5jYXRjaChlcnIpIHsgYXBwID0gYW5ndWxhci5tb2R1bGUoXCJ0ZW1wbGF0ZXMtbWFpblwiLCBbXSk7IH1cbmFwcC5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcblwidXNlIHN0cmljdFwiO1xuXG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvc2xpZGluZ19tZW51LnRwbFwiLFwiPGRpdiBjbGFzcz1cXFwib25zZW4tc2xpZGluZy1tZW51X19tZW51XFxcIj48L2Rpdj5cXG5cIiArXG4gICAgXCI8ZGl2IGNsYXNzPVxcXCJvbnNlbi1zbGlkaW5nLW1lbnVfX21haW5cXFwiPjwvZGl2PlxcblwiICtcbiAgICBcIlwiKVxuXG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJ0ZW1wbGF0ZXMvc3BsaXRfdmlldy50cGxcIixcIjxkaXYgY2xhc3M9XFxcIm9uc2VuLXNwbGl0LXZpZXdfX3NlY29uZGFyeSBmdWxsLXNjcmVlblxcXCI+PC9kaXY+XFxuXCIgK1xuICAgIFwiPGRpdiBjbGFzcz1cXFwib25zZW4tc3BsaXQtdmlld19fbWFpbiBmdWxsLXNjcmVlblxcXCI+PC9kaXY+XFxuXCIgK1xuICAgIFwiXCIpXG59XSk7XG59KSgpOyIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBzZXJ2aWNlIGNsYXNzIGZvciBmcmFtZXdvcmsgaW1wbGVtZW50YXRpb24uXG4gICAqL1xuICBtb2R1bGUuZmFjdG9yeSgnJG9uc2VuJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdywgJGNhY2hlRmFjdG9yeSwgJGRvY3VtZW50LCAkdGVtcGxhdGVDYWNoZSwgJGh0dHAsICRxLCAkY29tcGlsZSwgJG9uc0dsb2JhbCwgQ29tcG9uZW50Q2xlYW5lcikge1xuXG4gICAgdmFyICRvbnNlbiA9IGNyZWF0ZU9uc2VuU2VydmljZSgpO1xuICAgIHZhciBNb2RpZmllclV0aWwgPSAkb25zR2xvYmFsLl9pbnRlcm5hbC5Nb2RpZmllclV0aWw7XG5cbiAgICByZXR1cm4gJG9uc2VuO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlT25zZW5TZXJ2aWNlKCkge1xuICAgICAgcmV0dXJuIHtcblxuICAgICAgICBESVJFQ1RJVkVfVEVNUExBVEVfVVJMOiAndGVtcGxhdGVzJyxcblxuICAgICAgICBjbGVhbmVyOiBDb21wb25lbnRDbGVhbmVyLFxuXG4gICAgICAgIERldmljZUJhY2tCdXR0b25IYW5kbGVyOiAkb25zR2xvYmFsLl9kZXZpY2VCYWNrQnV0dG9uRGlzcGF0Y2hlcixcblxuICAgICAgICBfZGVmYXVsdERldmljZUJhY2tCdXR0b25IYW5kbGVyOiAkb25zR2xvYmFsLl9kZWZhdWx0RGV2aWNlQmFja0J1dHRvbkhhbmRsZXIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGdldERlZmF1bHREZXZpY2VCYWNrQnV0dG9uSGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHREZXZpY2VCYWNrQnV0dG9uSGFuZGxlcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZpZXdcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IG1ldGhvZE5hbWVzXG4gICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRoYXQgZGlzcG9zZSBhbGwgZHJpdmluZyBtZXRob2RzLlxuICAgICAgICAgKi9cbiAgICAgICAgZGVyaXZlTWV0aG9kczogZnVuY3Rpb24odmlldywgZWxlbWVudCwgbWV0aG9kTmFtZXMpIHtcbiAgICAgICAgICBtZXRob2ROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgICAgIHZpZXdbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRbbWV0aG9kTmFtZV0uYXBwbHkoZWxlbWVudCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtZXRob2ROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgICAgICAgdmlld1ttZXRob2ROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZpZXcgPSBlbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0NsYXNzfSBrbGFzc1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBwcm9wZXJ0aWVzXG4gICAgICAgICAqL1xuICAgICAgICBkZXJpdmVQcm9wZXJ0aWVzRnJvbUVsZW1lbnQ6IGZ1bmN0aW9uKGtsYXNzLCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2xhc3MucHJvdG90eXBlLCBwcm9wZXJ0eSwge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudFswXVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudFswXVtwcm9wZXJ0eV0gPSB2YWx1ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXR1cm4tYXNzaWduXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmlld1xuICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gZXZlbnROYW1lc1xuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbbWFwXVxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IGNsZWFyIGFsbCBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICovXG4gICAgICAgIGRlcml2ZUV2ZW50czogZnVuY3Rpb24odmlldywgZWxlbWVudCwgZXZlbnROYW1lcywgbWFwKSB7XG4gICAgICAgICAgbWFwID0gbWFwIHx8IGZ1bmN0aW9uKGRldGFpbCkgeyByZXR1cm4gZGV0YWlsOyB9O1xuICAgICAgICAgIGV2ZW50TmFtZXMgPSBbXS5jb25jYXQoZXZlbnROYW1lcyk7XG4gICAgICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuXG4gICAgICAgICAgZXZlbnROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgbWFwKGV2ZW50LmRldGFpbCB8fCB7fSk7XG4gICAgICAgICAgICAgIHZpZXcuZW1pdChldmVudE5hbWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZXZlbnROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50TmFtZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXJzW2luZGV4XSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2aWV3ID0gZWxlbWVudCA9IGxpc3RlbmVycyA9IG1hcCA9IG51bGw7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGlzRW5hYmxlZEF1dG9TdGF0dXNCYXJGaWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gISEkb25zR2xvYmFsLl9jb25maWcuYXV0b1N0YXR1c0JhckZpbGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBzaG91bGRGaWxsU3RhdHVzQmFyOiAkb25zR2xvYmFsLnNob3VsZEZpbGxTdGF0dXNCYXIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGFjdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgYXV0b1N0YXR1c0JhckZpbGw6ICRvbnNHbG9iYWwuYXV0b1N0YXR1c0JhckZpbGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkaXJlY3RpdmVcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFnZUVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAgICovXG4gICAgICAgIGNvbXBpbGVBbmRMaW5rOiBmdW5jdGlvbih2aWV3LCBwYWdlRWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgICBjb25zdCBsaW5rID0gJGNvbXBpbGUocGFnZUVsZW1lbnQpO1xuICAgICAgICAgIGNvbnN0IHBhZ2VTY29wZSA9IHZpZXcuX3Njb3BlLiRuZXcoKTtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIE92ZXJ3cml0ZSBwYWdlIHNjb3BlLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChwYWdlRWxlbWVudCkuZGF0YSgnX3Njb3BlJywgcGFnZVNjb3BlKTtcblxuICAgICAgICAgIHBhZ2VTY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2FsbGJhY2socGFnZUVsZW1lbnQpOyAvLyBBdHRhY2ggYW5kIHByZXBhcmVcbiAgICAgICAgICAgIGxpbmsocGFnZVNjb3BlKTsgLy8gUnVuIHRoZSBjb250cm9sbGVyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2aWV3XG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gcGFnZUxvYWRlclxuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlUGFnZUxvYWRlcjogZnVuY3Rpb24odmlldykge1xuICAgICAgICAgIHJldHVybiBuZXcgd2luZG93Lm9ucy5QYWdlTG9hZGVyKFxuICAgICAgICAgICAgKHtwYWdlLCBwYXJlbnR9LCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgIHdpbmRvdy5vbnMuX2ludGVybmFsLmdldFBhZ2VIVE1MQXN5bmMocGFnZSkudGhlbihodG1sID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGVBbmRMaW5rKFxuICAgICAgICAgICAgICAgICAgdmlldyxcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbnMuX3V0aWwuY3JlYXRlRWxlbWVudChodG1sLnRyaW0oKSksXG4gICAgICAgICAgICAgICAgICBlbGVtZW50ID0+IGRvbmUocGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICBlbGVtZW50Ll9kZXN0cm95KCk7XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkuZGF0YSgnX3Njb3BlJykpIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkuZGF0YSgnX3Njb3BlJykuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICogQHBhcmFtIHtTY29wZX0gW3BhcmFtcy5zY29wZV1cbiAgICAgICAgICogQHBhcmFtIHtqcUxpdGV9IFtwYXJhbXMuZWxlbWVudF1cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gW3BhcmFtcy5lbGVtZW50c11cbiAgICAgICAgICogQHBhcmFtIHtBdHRyaWJ1dGVzfSBbcGFyYW1zLmF0dHJzXVxuICAgICAgICAgKi9cbiAgICAgICAgY2xlYXJDb21wb25lbnQ6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgIGlmIChwYXJhbXMuc2NvcGUpIHtcbiAgICAgICAgICAgIENvbXBvbmVudENsZWFuZXIuZGVzdHJveVNjb3BlKHBhcmFtcy5zY29wZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBhcmFtcy5hdHRycykge1xuICAgICAgICAgICAgQ29tcG9uZW50Q2xlYW5lci5kZXN0cm95QXR0cmlidXRlcyhwYXJhbXMuYXR0cnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwYXJhbXMuZWxlbWVudCkge1xuICAgICAgICAgICAgQ29tcG9uZW50Q2xlYW5lci5kZXN0cm95RWxlbWVudChwYXJhbXMuZWxlbWVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHBhcmFtcy5lbGVtZW50cykge1xuICAgICAgICAgICAgcGFyYW1zLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICBDb21wb25lbnRDbGVhbmVyLmRlc3Ryb3lFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge2pxTGl0ZX0gZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgZmluZEVsZW1lbnRlT2JqZWN0OiBmdW5jdGlvbihlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQuaW5oZXJpdGVkRGF0YShuYW1lKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhZ2VcbiAgICAgICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFBhZ2VIVE1MQXN5bmM6IGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgICB2YXIgY2FjaGUgPSAkdGVtcGxhdGVDYWNoZS5nZXQocGFnZSk7XG5cbiAgICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgIHZhciBodG1sID0gdHlwZW9mIGNhY2hlID09PSAnc3RyaW5nJyA/IGNhY2hlIDogY2FjaGVbMV07XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHRoaXMubm9ybWFsaXplUGFnZUhUTUwoaHRtbCkpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICB1cmw6IHBhZ2UsXG4gICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgdmFyIGh0bWwgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVBhZ2VIVE1MKGh0bWwpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIG5vcm1hbGl6ZVBhZ2VIVE1MOiBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgICAgaHRtbCA9ICgnJyArIGh0bWwpLnRyaW0oKTtcblxuICAgICAgICAgIGlmICghaHRtbC5tYXRjaCgvXjxvbnMtcGFnZS8pKSB7XG4gICAgICAgICAgICBodG1sID0gJzxvbnMtcGFnZSBfbXV0ZWQ+JyArIGh0bWwgKyAnPC9vbnMtcGFnZT4nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBodG1sO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgbW9kaWZpZXIgdGVtcGxhdGVyIGZ1bmN0aW9uLiBUaGUgbW9kaWZpZXIgdGVtcGxhdGVyIGdlbmVyYXRlIGNzcyBjbGFzc2VzIGJvdW5kIG1vZGlmaWVyIG5hbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyc1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBbbW9kaWZpZXJzXSBhbiBhcnJheSBvZiBhcHBlbmRpeCBtb2RpZmllclxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgICAgICovXG4gICAgICAgIGdlbmVyYXRlTW9kaWZpZXJUZW1wbGF0ZXI6IGZ1bmN0aW9uKGF0dHJzLCBtb2RpZmllcnMpIHtcbiAgICAgICAgICB2YXIgYXR0ck1vZGlmaWVycyA9IGF0dHJzICYmIHR5cGVvZiBhdHRycy5tb2RpZmllciA9PT0gJ3N0cmluZycgPyBhdHRycy5tb2RpZmllci50cmltKCkuc3BsaXQoLyArLykgOiBbXTtcbiAgICAgICAgICBtb2RpZmllcnMgPSBhbmd1bGFyLmlzQXJyYXkobW9kaWZpZXJzKSA/IGF0dHJNb2RpZmllcnMuY29uY2F0KG1vZGlmaWVycykgOiBhdHRyTW9kaWZpZXJzO1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSB0ZW1wbGF0ZSBlZy4gJ29ucy1idXR0b24tLSonLCAnb25zLWJ1dHRvbi0tKl9faXRlbSdcbiAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kaWZpZXJzLm1hcChmdW5jdGlvbihtb2RpZmllcikge1xuICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgnKicsIG1vZGlmaWVyKTtcbiAgICAgICAgICAgIH0pLmpvaW4oJyAnKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgbW9kaWZpZXIgbWV0aG9kcyB0byB2aWV3IG9iamVjdCBmb3IgY3VzdG9tIGVsZW1lbnRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmlldyBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtqcUxpdGV9IGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIGFkZE1vZGlmaWVyTWV0aG9kc0ZvckN1c3RvbUVsZW1lbnRzOiBmdW5jdGlvbih2aWV3LCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgICAgICBoYXNNb2RpZmllcjogZnVuY3Rpb24obmVlZGxlKSB7XG4gICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBNb2RpZmllclV0aWwuc3BsaXQoZWxlbWVudC5hdHRyKCdtb2RpZmllcicpKTtcbiAgICAgICAgICAgICAgbmVlZGxlID0gdHlwZW9mIG5lZWRsZSA9PT0gJ3N0cmluZycgPyBuZWVkbGUudHJpbSgpIDogJyc7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIE1vZGlmaWVyVXRpbC5zcGxpdChuZWVkbGUpLnNvbWUoZnVuY3Rpb24obmVlZGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2Vucy5pbmRleE9mKG5lZWRsZSkgIT0gLTE7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVtb3ZlTW9kaWZpZXI6IGZ1bmN0aW9uKG5lZWRsZSkge1xuICAgICAgICAgICAgICBuZWVkbGUgPSB0eXBlb2YgbmVlZGxlID09PSAnc3RyaW5nJyA/IG5lZWRsZS50cmltKCkgOiAnJztcblxuICAgICAgICAgICAgICB2YXIgbW9kaWZpZXIgPSBNb2RpZmllclV0aWwuc3BsaXQoZWxlbWVudC5hdHRyKCdtb2RpZmllcicpKS5maWx0ZXIoZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4gIT09IG5lZWRsZTtcbiAgICAgICAgICAgICAgfSkuam9pbignICcpO1xuXG4gICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignbW9kaWZpZXInLCBtb2RpZmllcik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhZGRNb2RpZmllcjogZnVuY3Rpb24obW9kaWZpZXIpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdtb2RpZmllcicsIGVsZW1lbnQuYXR0cignbW9kaWZpZXInKSArICcgJyArIG1vZGlmaWVyKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldE1vZGlmaWVyOiBmdW5jdGlvbihtb2RpZmllcikge1xuICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ21vZGlmaWVyJywgbW9kaWZpZXIpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdG9nZ2xlTW9kaWZpZXI6IGZ1bmN0aW9uKG1vZGlmaWVyKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmhhc01vZGlmaWVyKG1vZGlmaWVyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTW9kaWZpZXIobW9kaWZpZXIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTW9kaWZpZXIobW9kaWZpZXIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZvciAodmFyIG1ldGhvZCBpbiBtZXRob2RzKSB7XG4gICAgICAgICAgICBpZiAobWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShtZXRob2QpKSB7XG4gICAgICAgICAgICAgIHZpZXdbbWV0aG9kXSA9IG1ldGhvZHNbbWV0aG9kXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBtb2RpZmllciBtZXRob2RzIHRvIHZpZXcgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmlldyBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlXG4gICAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBhZGRNb2RpZmllck1ldGhvZHM6IGZ1bmN0aW9uKHZpZXcsIHRlbXBsYXRlLCBlbGVtZW50KSB7XG4gICAgICAgICAgdmFyIF90ciA9IGZ1bmN0aW9uKG1vZGlmaWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgnKicsIG1vZGlmaWVyKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGZucyA9IHtcbiAgICAgICAgICAgIGhhc01vZGlmaWVyOiBmdW5jdGlvbihtb2RpZmllcikge1xuICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5oYXNDbGFzcyhfdHIobW9kaWZpZXIpKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlbW92ZU1vZGlmaWVyOiBmdW5jdGlvbihtb2RpZmllcikge1xuICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKF90cihtb2RpZmllcikpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYWRkTW9kaWZpZXI6IGZ1bmN0aW9uKG1vZGlmaWVyKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoX3RyKG1vZGlmaWVyKSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXRNb2RpZmllcjogZnVuY3Rpb24obW9kaWZpZXIpIHtcbiAgICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtZW50LmF0dHIoJ2NsYXNzJykuc3BsaXQoL1xccysvKSxcbiAgICAgICAgICAgICAgICAgIHBhdHQgPSB0ZW1wbGF0ZS5yZXBsYWNlKCcqJywgJy4nKTtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xzID0gY2xhc3Nlc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmIChjbHMubWF0Y2gocGF0dCkpIHtcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoY2xzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKF90cihtb2RpZmllcikpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdG9nZ2xlTW9kaWZpZXI6IGZ1bmN0aW9uKG1vZGlmaWVyKSB7XG4gICAgICAgICAgICAgIHZhciBjbHMgPSBfdHIobW9kaWZpZXIpO1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5oYXNDbGFzcyhjbHMpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhjbHMpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoY2xzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgYXBwZW5kID0gZnVuY3Rpb24ob2xkRm4sIG5ld0ZuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9sZEZuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9sZEZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgfHwgbmV3Rm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXdGbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmlldy5oYXNNb2RpZmllciA9IGFwcGVuZCh2aWV3Lmhhc01vZGlmaWVyLCBmbnMuaGFzTW9kaWZpZXIpO1xuICAgICAgICAgIHZpZXcucmVtb3ZlTW9kaWZpZXIgPSBhcHBlbmQodmlldy5yZW1vdmVNb2RpZmllciwgZm5zLnJlbW92ZU1vZGlmaWVyKTtcbiAgICAgICAgICB2aWV3LmFkZE1vZGlmaWVyID0gYXBwZW5kKHZpZXcuYWRkTW9kaWZpZXIsIGZucy5hZGRNb2RpZmllcik7XG4gICAgICAgICAgdmlldy5zZXRNb2RpZmllciA9IGFwcGVuZCh2aWV3LnNldE1vZGlmaWVyLCBmbnMuc2V0TW9kaWZpZXIpO1xuICAgICAgICAgIHZpZXcudG9nZ2xlTW9kaWZpZXIgPSBhcHBlbmQodmlldy50b2dnbGVNb2RpZmllciwgZm5zLnRvZ2dsZU1vZGlmaWVyKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIG1vZGlmaWVyIG1ldGhvZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2aWV3IG9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlTW9kaWZpZXJNZXRob2RzOiBmdW5jdGlvbih2aWV3KSB7XG4gICAgICAgICAgdmlldy5oYXNNb2RpZmllciA9IHZpZXcucmVtb3ZlTW9kaWZpZXIgPVxuICAgICAgICAgICAgdmlldy5hZGRNb2RpZmllciA9IHZpZXcuc2V0TW9kaWZpZXIgPVxuICAgICAgICAgICAgdmlldy50b2dnbGVNb2RpZmllciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lIGEgdmFyaWFibGUgdG8gSmF2YVNjcmlwdCBnbG9iYWwgc2NvcGUgYW5kIEFuZ3VsYXJKUyBzY29wZSBhcyAndmFyJyBhdHRyaWJ1dGUgbmFtZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gICAgICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIGRlY2xhcmVWYXJBdHRyaWJ1dGU6IGZ1bmN0aW9uKGF0dHJzLCBvYmplY3QpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGF0dHJzLnZhciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciB2YXJOYW1lID0gYXR0cnMudmFyO1xuICAgICAgICAgICAgdGhpcy5fZGVmaW5lVmFyKHZhck5hbWUsIG9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9yZWdpc3RlckV2ZW50SGFuZGxlcjogZnVuY3Rpb24oY29tcG9uZW50LCBldmVudE5hbWUpIHtcbiAgICAgICAgICB2YXIgY2FwaXRhbGl6ZWRFdmVudE5hbWUgPSBldmVudE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBldmVudE5hbWUuc2xpY2UoMSk7XG5cbiAgICAgICAgICBjb21wb25lbnQub24oZXZlbnROYW1lLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChjb21wb25lbnQuX2VsZW1lbnRbMF0sIGV2ZW50TmFtZSwgZXZlbnQgJiYgZXZlbnQuZGV0YWlsKTtcblxuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBjb21wb25lbnQuX2F0dHJzWydvbnMnICsgY2FwaXRhbGl6ZWRFdmVudE5hbWVdO1xuICAgICAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgY29tcG9uZW50Ll9zY29wZS4kZXZhbChoYW5kbGVyLCB7JGV2ZW50OiBldmVudH0pO1xuICAgICAgICAgICAgICBjb21wb25lbnQuX3Njb3BlLiRldmFsQXN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnMgZm9yIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZXNcbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVyczogZnVuY3Rpb24oY29tcG9uZW50LCBldmVudE5hbWVzKSB7XG4gICAgICAgICAgZXZlbnROYW1lcyA9IGV2ZW50TmFtZXMudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGV2ZW50TmFtZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gZXZlbnROYW1lc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRIYW5kbGVyKGNvbXBvbmVudCwgZXZlbnROYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBpc0FuZHJvaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAhIXdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9hbmRyb2lkL2kpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgaXNJT1M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAhIXdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaXBhZHxpcGhvbmV8aXBvZCB0b3VjaCkvaSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBpc1dlYlZpZXc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB3aW5kb3cub25zLmlzV2ViVmlldygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgaXNJT1M3YWJvdmU6IChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSB1YS5tYXRjaCgvKGlQYWR8aVBob25lfGlQb2QgdG91Y2gpOy4qQ1BVLipPUyAoXFxkKylfKFxcZCspL2kpO1xuXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IG1hdGNoID8gcGFyc2VGbG9hdChtYXRjaFsyXSArICcuJyArIG1hdGNoWzNdKSA+PSA3IDogZmFsc2U7XG5cbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKCksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpcmUgYSBuYW1lZCBldmVudCBmb3IgYSBjb21wb25lbnQuIFRoZSB2aWV3IG9iamVjdCwgaWYgaXQgZXhpc3RzLCBpcyBhdHRhY2hlZCB0byBldmVudC5jb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtkb21dXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBuYW1lXG4gICAgICAgICAqL1xuICAgICAgICBmaXJlQ29tcG9uZW50RXZlbnQ6IGZ1bmN0aW9uKGRvbSwgZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG5cbiAgICAgICAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgZXZlbnRba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBldmVudC5jb21wb25lbnQgPSBkb20gP1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGRvbSkuZGF0YShkb20ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkgfHwgbnVsbCA6IG51bGw7XG4gICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KGRvbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgJzonICsgZXZlbnROYW1lLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgIGRvbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lIGEgdmFyaWFibGUgdG8gSmF2YVNjcmlwdCBnbG9iYWwgc2NvcGUgYW5kIEFuZ3VsYXJKUyBzY29wZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVXRpbC5kZWZpbmVWYXIoJ2ZvbycsICdmb28tdmFsdWUnKTtcbiAgICAgICAgICogLy8gPT4gd2luZG93LmZvbyBhbmQgJHNjb3BlLmZvbyBpcyBub3cgJ2Zvby12YWx1ZSdcbiAgICAgICAgICpcbiAgICAgICAgICogVXRpbC5kZWZpbmVWYXIoJ2Zvby5iYXInLCAnZm9vLWJhci12YWx1ZScpO1xuICAgICAgICAgKiAvLyA9PiB3aW5kb3cuZm9vLmJhciBhbmQgJHNjb3BlLmZvby5iYXIgaXMgbm93ICdmb28tYmFyLXZhbHVlJ1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICBfZGVmaW5lVmFyOiBmdW5jdGlvbihuYW1lLCBvYmplY3QpIHtcbiAgICAgICAgICB2YXIgbmFtZXMgPSBuYW1lLnNwbGl0KC9cXC4vKTtcblxuICAgICAgICAgIGZ1bmN0aW9uIHNldChjb250YWluZXIsIG5hbWVzLCBvYmplY3QpIHtcbiAgICAgICAgICAgIHZhciBuYW1lO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgICBpZiAoY29udGFpbmVyW25hbWVdID09PSB1bmRlZmluZWQgfHwgY29udGFpbmVyW25hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyW25hbWVdID0ge307XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyW25hbWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250YWluZXJbbmFtZXNbbmFtZXMubGVuZ3RoIC0gMV1dID0gb2JqZWN0O1xuXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyW25hbWVzW25hbWVzLmxlbmd0aCAtIDFdXSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCB2YXI9XCInICsgb2JqZWN0Ll9hdHRycy52YXIgKyAnXCIgYmVjYXVzZSBpdCB3aWxsIG92ZXJ3cml0ZSBhIHJlYWQtb25seSB2YXJpYWJsZS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAob25zLmNvbXBvbmVudEJhc2UpIHtcbiAgICAgICAgICAgIHNldChvbnMuY29tcG9uZW50QmFzZSwgbmFtZXMsIG9iamVjdCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQXR0YWNoIHRvIGFuY2VzdG9yIHdpdGggb25zLXNjb3BlIGF0dHJpYnV0ZS5cbiAgICAgICAgICB2YXIgZWxlbWVudCA9IG9iamVjdC5fZWxlbWVudFswXTtcblxuICAgICAgICAgIHdoaWxlIChlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnb25zLXNjb3BlJykpIHtcbiAgICAgICAgICAgICAgc2V0KGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5kYXRhKCdfc2NvcGUnKSwgbmFtZXMsIG9iamVjdCk7XG4gICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuXG4gICAgICAgICAgLy8gSWYgbm8gb25zLXNjb3BlIGVsZW1lbnQgd2FzIGZvdW5kLCBhdHRhY2ggdG8gJHJvb3RTY29wZS5cbiAgICAgICAgICBzZXQoJHJvb3RTY29wZSwgbmFtZXMsIG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLWFjdGlvbi1zaGVldFxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB2YXJcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoaXMgYWN0aW9uIHNoZWV0LlsvZW5dXG4gKiAgW2phXeOBk+OBruOCouOCr+OCt+ODp+ODs+OCt+ODvOODiOOCkuWPgueFp+OBmeOCi+OBn+OCgeOBruWQjeWJjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVzaG93XG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVzaG93XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlaGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicHJlaGlkZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicHJlaGlkZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RzaG93XG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0c2hvd1wiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdHNob3dcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0aGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicG9zdGhpZGVcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInBvc3RoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwiZGVzdHJveVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiZGVzdHJveVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25cbiAqIEBzaWduYXR1cmUgb24oZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+OCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uY2VcbiAqIEBzaWduYXR1cmUgb25jZShldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lciB0aGF0J3Mgb25seSB0cmlnZ2VyZWQgb25jZS5bL2VuXVxuICogIFtqYV3kuIDluqbjgaDjgZHlkbzjgbPlh7rjgZXjgozjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+OCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9mZlxuICogQHNpZ25hdHVyZSBvZmYoZXZlbnROYW1lLCBbbGlzdGVuZXJdKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXVJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci4gSWYgdGhlIGxpc3RlbmVyIGlzIG5vdCBzcGVjaWZpZWQgYWxsIGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50IHR5cGUgd2lsbCBiZSByZW1vdmVkLlsvZW5dXG4gKiAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkuWJiumZpOOBl+OBvuOBmeOAguOCguOBl2xpc3RlbmVy44OR44Op44Oh44O844K/44GM5oyH5a6a44GV44KM44Gq44GL44Gj44Gf5aC05ZCI44CB44Gd44Gu44Kk44OZ44Oz44OI44Gu44Oq44K544OK44O844GM5YWo44Gm5YmK6Zmk44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3liYrpmaTjgZnjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjga7plqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmuKHjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBBY3Rpb24gc2hlZXQgZGlyZWN0aXZlLlxuICAgKi9cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNBY3Rpb25TaGVldCcsIGZ1bmN0aW9uKCRvbnNlbiwgQWN0aW9uU2hlZXRWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmU6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyIGFjdGlvblNoZWV0ID0gbmV3IEFjdGlvblNoZWV0VmlldyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgICAkb25zZW4uZGVjbGFyZVZhckF0dHJpYnV0ZShhdHRycywgYWN0aW9uU2hlZXQpO1xuICAgICAgICAgICAgJG9uc2VuLnJlZ2lzdGVyRXZlbnRIYW5kbGVycyhhY3Rpb25TaGVldCwgJ3ByZXNob3cgcHJlaGlkZSBwb3N0c2hvdyBwb3N0aGlkZSBkZXN0cm95Jyk7XG4gICAgICAgICAgICAkb25zZW4uYWRkTW9kaWZpZXJNZXRob2RzRm9yQ3VzdG9tRWxlbWVudHMoYWN0aW9uU2hlZXQsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1hY3Rpb24tc2hlZXQnLCBhY3Rpb25TaGVldCk7XG5cbiAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgYWN0aW9uU2hlZXQuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgJG9uc2VuLnJlbW92ZU1vZGlmaWVyTWV0aG9kcyhhY3Rpb25TaGVldCk7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLWFjdGlvbi1zaGVldCcsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLWFsZXJ0LWRpYWxvZ1xuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB2YXJcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoaXMgYWxlcnQgZGlhbG9nLlsvZW5dXG4gKiAgW2phXeOBk+OBruOCouODqeODvOODiOODgOOCpOOCouODreOCsOOCkuWPgueFp+OBmeOCi+OBn+OCgeOBruWQjeWJjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVzaG93XG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVzaG93XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlaGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicHJlaGlkZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicHJlaGlkZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RzaG93XG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0c2hvd1wiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdHNob3dcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0aGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicG9zdGhpZGVcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInBvc3RoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwiZGVzdHJveVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiZGVzdHJveVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25cbiAqIEBzaWduYXR1cmUgb24oZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+OCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uY2VcbiAqIEBzaWduYXR1cmUgb25jZShldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lciB0aGF0J3Mgb25seSB0cmlnZ2VyZWQgb25jZS5bL2VuXVxuICogIFtqYV3kuIDluqbjgaDjgZHlkbzjgbPlh7rjgZXjgozjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+OCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9mZlxuICogQHNpZ25hdHVyZSBvZmYoZXZlbnROYW1lLCBbbGlzdGVuZXJdKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXVJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci4gSWYgdGhlIGxpc3RlbmVyIGlzIG5vdCBzcGVjaWZpZWQgYWxsIGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50IHR5cGUgd2lsbCBiZSByZW1vdmVkLlsvZW5dXG4gKiAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkuWJiumZpOOBl+OBvuOBmeOAguOCguOBl2xpc3RlbmVy44OR44Op44Oh44O844K/44GM5oyH5a6a44GV44KM44Gq44GL44Gj44Gf5aC05ZCI44CB44Gd44Gu44Kk44OZ44Oz44OI44Gu44Oq44K544OK44O844GM5YWo44Gm5YmK6Zmk44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3liYrpmaTjgZnjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjga7plqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmuKHjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBBbGVydCBkaWFsb2cgZGlyZWN0aXZlLlxuICAgKi9cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNBbGVydERpYWxvZycsIGZ1bmN0aW9uKCRvbnNlbiwgQWxlcnREaWFsb2dWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmU6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyIGFsZXJ0RGlhbG9nID0gbmV3IEFsZXJ0RGlhbG9nVmlldyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgICAkb25zZW4uZGVjbGFyZVZhckF0dHJpYnV0ZShhdHRycywgYWxlcnREaWFsb2cpO1xuICAgICAgICAgICAgJG9uc2VuLnJlZ2lzdGVyRXZlbnRIYW5kbGVycyhhbGVydERpYWxvZywgJ3ByZXNob3cgcHJlaGlkZSBwb3N0c2hvdyBwb3N0aGlkZSBkZXN0cm95Jyk7XG4gICAgICAgICAgICAkb25zZW4uYWRkTW9kaWZpZXJNZXRob2RzRm9yQ3VzdG9tRWxlbWVudHMoYWxlcnREaWFsb2csIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1hbGVydC1kaWFsb2cnLCBhbGVydERpYWxvZyk7XG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ19zY29wZScsIHNjb3BlKTtcblxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBhbGVydERpYWxvZy5fZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAkb25zZW4ucmVtb3ZlTW9kaWZpZXJNZXRob2RzKGFsZXJ0RGlhbG9nKTtcbiAgICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtYWxlcnQtZGlhbG9nJywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuXG59KSgpO1xuIiwiXG4vKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG5hbmd1bGFyLm1vZHVsZSgnb25zZW4nKVxuICAudmFsdWUoJ0FsZXJ0RGlhbG9nQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLkFsZXJ0RGlhbG9nQW5pbWF0b3IpXG4gIC52YWx1ZSgnQW5kcm9pZEFsZXJ0RGlhbG9nQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLkFuZHJvaWRBbGVydERpYWxvZ0FuaW1hdG9yKVxuICAudmFsdWUoJ0lPU0FsZXJ0RGlhbG9nQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLklPU0FsZXJ0RGlhbG9nQW5pbWF0b3IpO1xuIiwiLypcbkNvcHlyaWdodCAyMDEzLTIwMTUgQVNJQUwgQ09SUE9SQVRJT05cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuKi9cblxuYW5ndWxhci5tb2R1bGUoJ29uc2VuJykudmFsdWUoJ0FuaW1hdGlvbkNob29zZXInLCBvbnMuX2ludGVybmFsLkFuaW1hdG9yRmFjdG9yeSk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1jYXJvdXNlbFxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1DYXJvdXNlbCBjb21wb25lbnQuWy9lbl1cbiAqICAgW2phXeOCq+ODq+ODvOOCu+ODq+OCkuihqOekuuOBp+OBjeOCi+OCs+ODs+ODneODvOODjeODs+ODiOOAglsvamFdXG4gKiBAY29kZXBlbiB4YmJ6T1FcbiAqIEBndWlkZSBVc2luZ0Nhcm91c2VsXG4gKiAgIFtlbl1MZWFybiBob3cgdG8gdXNlIHRoZSBjYXJvdXNlbCBjb21wb25lbnQuWy9lbl1cbiAqICAgW2phXWNhcm91c2Vs44Kz44Oz44Od44O844ON44Oz44OI44Gu5L2/44GE5pa5Wy9qYV1cbiAqIEBleGFtcGxlXG4gKiA8b25zLWNhcm91c2VsIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMjAwcHhcIj5cbiAqICAgPG9ucy1jYXJvdXNlbC1pdGVtPlxuICogICAgLi4uXG4gKiAgIDwvb25zLWNhcm91c2VsLWl0ZW0+XG4gKiAgIDxvbnMtY2Fyb3VzZWwtaXRlbT5cbiAqICAgIC4uLlxuICogICA8L29ucy1jYXJvdXNlbC1pdGVtPlxuICogPC9vbnMtY2Fyb3VzZWw+XG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIHZhclxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoaXMgY2Fyb3VzZWwuWy9lbl1cbiAqICAgW2phXeOBk+OBruOCq+ODq+ODvOOCu+ODq+OCkuWPgueFp+OBmeOCi+OBn+OCgeOBruWkieaVsOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0Y2hhbmdlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0Y2hhbmdlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwb3N0Y2hhbmdlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcmVmcmVzaFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicmVmcmVzaFwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicmVmcmVzaFwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLW92ZXJzY3JvbGxcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcIm92ZXJzY3JvbGxcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cIm92ZXJzY3JvbGxcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1kZXN0cm95XG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJkZXN0cm95XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJkZXN0cm95XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvbmNlXG4gKiBAc2lnbmF0dXJlIG9uY2UoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCdzIG9ubHkgdHJpZ2dlcmVkIG9uY2UuWy9lbl1cbiAqICBbamFd5LiA5bqm44Gg44GR5ZG844Gz5Ye644GV44KM44KL44Kk44OZ44Oz44OI44Oq44K544OK44KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvZmZcbiAqIEBzaWduYXR1cmUgb2ZmKGV2ZW50TmFtZSwgW2xpc3RlbmVyXSlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1SZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuIElmIHRoZSBsaXN0ZW5lciBpcyBub3Qgc3BlY2lmaWVkIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudCB0eXBlIHdpbGwgYmUgcmVtb3ZlZC5bL2VuXVxuICogIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLliYrpmaTjgZfjgb7jgZnjgILjgoLjgZfjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzmjIflrprjgZXjgozjgarjgYvjgaPjgZ/loLTlkIjjgavjga/jgIHjgZ3jga7jgqTjg5njg7Pjg4jjgavntJDku5jjgYTjgabjgYTjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzlhajjgabliYrpmaTjgZXjgozjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uXG4gKiBAc2lnbmF0dXJlIG9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lci5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKTtcblxuICBtb2R1bGUuZGlyZWN0aXZlKCdvbnNDYXJvdXNlbCcsIGZ1bmN0aW9uKCRvbnNlbiwgQ2Fyb3VzZWxWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcblxuICAgICAgLy8gTk9URTogVGhpcyBlbGVtZW50IG11c3QgY29leGlzdHMgd2l0aCBuZy1jb250cm9sbGVyLlxuICAgICAgLy8gRG8gbm90IHVzZSBpc29sYXRlZCBzY29wZSBhbmQgdGVtcGxhdGUncyBuZy10cmFuc2NsdWRlLlxuICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHZhciBjYXJvdXNlbCA9IG5ldyBDYXJvdXNlbFZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLWNhcm91c2VsJywgY2Fyb3VzZWwpO1xuXG4gICAgICAgICAgJG9uc2VuLnJlZ2lzdGVyRXZlbnRIYW5kbGVycyhjYXJvdXNlbCwgJ3Bvc3RjaGFuZ2UgcmVmcmVzaCBvdmVyc2Nyb2xsIGRlc3Ryb3knKTtcbiAgICAgICAgICAkb25zZW4uZGVjbGFyZVZhckF0dHJpYnV0ZShhdHRycywgY2Fyb3VzZWwpO1xuXG4gICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2Fyb3VzZWwuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLWNhcm91c2VsJywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgIH07XG4gIH0pO1xuXG4gIG1vZHVsZS5kaXJlY3RpdmUoJ29uc0Nhcm91c2VsSXRlbScsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGlmIChzY29wZS4kbGFzdCkge1xuICAgICAgICAgICAgZWxlbWVudFswXS5wYXJlbnRFbGVtZW50Ll9zZXR1cCgpO1xuICAgICAgICAgICAgZWxlbWVudFswXS5wYXJlbnRFbGVtZW50Ll9zZXR1cEluaXRpYWxJbmRleCgpO1xuICAgICAgICAgICAgZWxlbWVudFswXS5wYXJlbnRFbGVtZW50Ll9zYXZlTGFzdFN0YXRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuXG59KSgpO1xuXG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1kaWFsb2dcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIGRpYWxvZy5bL2VuXVxuICogIFtqYV3jgZPjga7jg4DjgqTjgqLjg63jgrDjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lkI3liY3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlc2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicHJlc2hvd1wiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicHJlc2hvd1wi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXByZWhpZGVcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZWhpZGVcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInByZWhpZGVcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0c2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicG9zdHNob3dcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInBvc3RzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcG9zdGhpZGVcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInBvc3RoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwb3N0aGlkZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWRlc3Ryb3lcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcImRlc3Ryb3lcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cImRlc3Ryb3lcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uXG4gKiBAc2lnbmF0dXJlIG9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lci5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvbmNlXG4gKiBAc2lnbmF0dXJlIG9uY2UoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCdzIG9ubHkgdHJpZ2dlcmVkIG9uY2UuWy9lbl1cbiAqICBbamFd5LiA5bqm44Gg44GR5ZG844Gz5Ye644GV44KM44KL44Kk44OZ44Oz44OI44Oq44K544OK44KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvZmZcbiAqIEBzaWduYXR1cmUgb2ZmKGV2ZW50TmFtZSwgW2xpc3RlbmVyXSlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1SZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuIElmIHRoZSBsaXN0ZW5lciBpcyBub3Qgc3BlY2lmaWVkIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudCB0eXBlIHdpbGwgYmUgcmVtb3ZlZC5bL2VuXVxuICogIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLliYrpmaTjgZfjgb7jgZnjgILjgoLjgZfjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzmjIflrprjgZXjgozjgarjgYvjgaPjgZ/loLTlkIjjgavjga/jgIHjgZ3jga7jgqTjg5njg7Pjg4jjgavntJDku5jjgYTjgabjgYTjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzlhajjgabliYrpmaTjgZXjgozjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zRGlhbG9nJywgZnVuY3Rpb24oJG9uc2VuLCBEaWFsb2dWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBzY29wZTogdHJ1ZSxcbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmU6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICB2YXIgZGlhbG9nID0gbmV3IERpYWxvZ1ZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcbiAgICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCBkaWFsb2cpO1xuICAgICAgICAgICAgJG9uc2VuLnJlZ2lzdGVyRXZlbnRIYW5kbGVycyhkaWFsb2csICdwcmVzaG93IHByZWhpZGUgcG9zdHNob3cgcG9zdGhpZGUgZGVzdHJveScpO1xuICAgICAgICAgICAgJG9uc2VuLmFkZE1vZGlmaWVyTWV0aG9kc0ZvckN1c3RvbUVsZW1lbnRzKGRpYWxvZywgZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLWRpYWxvZycsIGRpYWxvZyk7XG4gICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGRpYWxvZy5fZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAkb25zZW4ucmVtb3ZlTW9kaWZpZXJNZXRob2RzKGRpYWxvZyk7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLWRpYWxvZycsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuXG59KSgpO1xuIiwiLypcbkNvcHlyaWdodCAyMDEzLTIwMTUgQVNJQUwgQ09SUE9SQVRJT05cblxuICAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAgIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG5odHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuKi9cblxuYW5ndWxhci5tb2R1bGUoJ29uc2VuJylcbiAgLnZhbHVlKCdEaWFsb2dBbmltYXRvcicsIG9ucy5faW50ZXJuYWwuRGlhbG9nQW5pbWF0b3IpXG4gIC52YWx1ZSgnSU9TRGlhbG9nQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLklPU0RpYWxvZ0FuaW1hdG9yKVxuICAudmFsdWUoJ0FuZHJvaWREaWFsb2dBbmltYXRvcicsIG9ucy5faW50ZXJuYWwuQW5kcm9pZERpYWxvZ0FuaW1hdG9yKVxuICAudmFsdWUoJ1NsaWRlRGlhbG9nQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLlNsaWRlRGlhbG9nQW5pbWF0b3IpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtZmFiXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIHZhclxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoZSBmbG9hdGluZyBhY3Rpb24gYnV0dG9uLlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jg5Xjg63jg7zjg4bjgqPjg7PjgrDjgqLjgq/jgrfjg6fjg7Pjg5zjgr/jg7PjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lpInmlbDlkI3jgpLjgZfjgabjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKTtcblxuICBtb2R1bGUuZGlyZWN0aXZlKCdvbnNGYWInLCBmdW5jdGlvbigkb25zZW4sIEZhYlZpZXcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIHZhciBmYWIgPSBuZXcgRmFiVmlldyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtZmFiJywgZmFiKTtcblxuICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCBmYWIpO1xuXG4gICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtZmFiJywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgIH07XG4gIH0pO1xuXG59KSgpO1xuXG4iLCIvKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG4oZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmZhY3RvcnkoJ0dlbmVyaWNWaWV3JywgZnVuY3Rpb24oJG9uc2VuKSB7XG5cbiAgICB2YXIgR2VuZXJpY1ZpZXcgPSBDbGFzcy5leHRlbmQoe1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZVxuICAgICAgICogQHBhcmFtIHtqcUxpdGV9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyc1xuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kaXJlY3RpdmVPbmx5XVxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25EZXN0cm95XVxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGlmaWVyVGVtcGxhdGVdXG4gICAgICAgKi9cbiAgICAgIGluaXQ6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgb3B0aW9ucykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5fc2NvcGUgPSBzY29wZTtcbiAgICAgICAgdGhpcy5fYXR0cnMgPSBhdHRycztcblxuICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3RpdmVPbmx5KSB7XG4gICAgICAgICAgaWYgKCFvcHRpb25zLm1vZGlmaWVyVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb3B0aW9ucy5tb2RpZmllclRlbXBsYXRlIGlzIHVuZGVmaW5lZC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJG9uc2VuLmFkZE1vZGlmaWVyTWV0aG9kcyh0aGlzLCBvcHRpb25zLm1vZGlmaWVyVGVtcGxhdGUsIGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRvbnNlbi5hZGRNb2RpZmllck1ldGhvZHNGb3JDdXN0b21FbGVtZW50cyh0aGlzLCBlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRvbnNlbi5jbGVhbmVyLm9uRGVzdHJveShzY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5fZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICRvbnNlbi5yZW1vdmVNb2RpZmllck1ldGhvZHMoc2VsZik7XG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5vbkRlc3Ryb3kpIHtcbiAgICAgICAgICAgIG9wdGlvbnMub25EZXN0cm95KHNlbGYpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICRvbnNlbi5jbGVhckNvbXBvbmVudCh7XG4gICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICBhdHRyczogYXR0cnMsXG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBzZWxmID0gZWxlbWVudCA9IHNlbGYuX2VsZW1lbnQgPSBzZWxmLl9zY29wZSA9IHNjb3BlID0gc2VsZi5fYXR0cnMgPSBhdHRycyA9IG9wdGlvbnMgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZVxuICAgICAqIEBwYXJhbSB7anFMaXRlfSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy52aWV3S2V5XG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kaXJlY3RpdmVPbmx5XVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRGVzdHJveV1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kaWZpZXJUZW1wbGF0ZV1cbiAgICAgKi9cbiAgICBHZW5lcmljVmlldy5yZWdpc3RlciA9IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgb3B0aW9ucykge1xuICAgICAgdmFyIHZpZXcgPSBuZXcgR2VuZXJpY1ZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBvcHRpb25zKTtcblxuICAgICAgaWYgKCFvcHRpb25zLnZpZXdLZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zLnZpZXdLZXkgaXMgcmVxdWlyZWQuJyk7XG4gICAgICB9XG5cbiAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCB2aWV3KTtcbiAgICAgIGVsZW1lbnQuZGF0YShvcHRpb25zLnZpZXdLZXksIHZpZXcpO1xuXG4gICAgICB2YXIgZGVzdHJveSA9IG9wdGlvbnMub25EZXN0cm95IHx8IGFuZ3VsYXIubm9vcDtcbiAgICAgIG9wdGlvbnMub25EZXN0cm95ID0gZnVuY3Rpb24odmlldykge1xuICAgICAgICBkZXN0cm95KHZpZXcpO1xuICAgICAgICBlbGVtZW50LmRhdGEob3B0aW9ucy52aWV3S2V5LCBudWxsKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH07XG5cbiAgICBNaWNyb0V2ZW50Lm1peGluKEdlbmVyaWNWaWV3KTtcblxuICAgIHJldHVybiBHZW5lcmljVmlldztcbiAgfSk7XG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtbGF6eS1yZXBlYXRcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dXG4gKiAgICAgVXNpbmcgdGhpcyBjb21wb25lbnQgYSBsaXN0IHdpdGggbWlsbGlvbnMgb2YgaXRlbXMgY2FuIGJlIHJlbmRlcmVkIHdpdGhvdXQgYSBkcm9wIGluIHBlcmZvcm1hbmNlLlxuICogICAgIEl0IGRvZXMgdGhhdCBieSBcImxhemlseVwiIGxvYWRpbmcgZWxlbWVudHMgaW50byB0aGUgRE9NIHdoZW4gdGhleSBjb21lIGludG8gdmlldyBhbmRcbiAqICAgICByZW1vdmluZyBpdGVtcyBmcm9tIHRoZSBET00gd2hlbiB0aGV5IGFyZSBub3QgdmlzaWJsZS5cbiAqICAgWy9lbl1cbiAqICAgW2phXVxuICogICAgIOOBk+OBruOCs+ODs+ODneODvOODjeODs+ODiOWGheOBp+aPj+eUu+OBleOCjOOCi+OCouOCpOODhuODoOOBrkRPTeimgee0oOOBruiqreOBv+i+vOOBv+OBr+OAgeeUu+mdouOBq+imi+OBiOOBneOBhuOBq+OBquOBo+OBn+aZguOBvuOBp+iHquWLleeahOOBq+mBheW7tuOBleOCjOOAgVxuICogICAgIOeUu+mdouOBi+OCieimi+OBiOOBquOBj+OBquOBo+OBn+WgtOWQiOOBq+OBr+OBneOBruimgee0oOOBr+WLleeahOOBq+OCouODs+ODreODvOODieOBleOCjOOBvuOBmeOAglxuICogICAgIOOBk+OBruOCs+ODs+ODneODvOODjeODs+ODiOOCkuS9v+OBhuOBk+OBqOOBp+OAgeODkeODleOCqeODvOODnuODs+OCueOCkuWKo+WMluOBleOBm+OCi+OBk+OBqOeEoeOBl+OBq+W3qOWkp+OBquaVsOOBruimgee0oOOCkuaPj+eUu+OBp+OBjeOBvuOBmeOAglxuICogICBbL2phXVxuICogQGNvZGVwZW4gUXdyR0JtXG4gKiBAZ3VpZGUgVXNpbmdMYXp5UmVwZWF0XG4gKiAgIFtlbl1Ib3cgdG8gdXNlIExhenkgUmVwZWF0Wy9lbl1cbiAqICAgW2phXeODrOOCpOOCuOODvOODquODlOODvOODiOOBruS9v+OBhOaWuVsvamFdXG4gKiBAZXhhbXBsZVxuICogPHNjcmlwdD5cbiAqICAgb25zLmJvb3RzdHJhcCgpXG4gKlxuICogICAuY29udHJvbGxlcignTXlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gKiAgICAgJHNjb3BlLk15RGVsZWdhdGUgPSB7XG4gKiAgICAgICBjb3VudEl0ZW1zOiBmdW5jdGlvbigpIHtcbiAqICAgICAgICAgLy8gUmV0dXJuIG51bWJlciBvZiBpdGVtcy5cbiAqICAgICAgICAgcmV0dXJuIDEwMDAwMDA7XG4gKiAgICAgICB9LFxuICpcbiAqICAgICAgIGNhbGN1bGF0ZUl0ZW1IZWlnaHQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gKiAgICAgICAgIC8vIFJldHVybiB0aGUgaGVpZ2h0IG9mIGFuIGl0ZW0gaW4gcGl4ZWxzLlxuICogICAgICAgICByZXR1cm4gNDU7XG4gKiAgICAgICB9LFxuICpcbiAqICAgICAgIGNvbmZpZ3VyZUl0ZW1TY29wZTogZnVuY3Rpb24oaW5kZXgsIGl0ZW1TY29wZSkge1xuICogICAgICAgICAvLyBJbml0aWFsaXplIHNjb3BlXG4gKiAgICAgICAgIGl0ZW1TY29wZS5pdGVtID0gJ0l0ZW0gIycgKyAoaW5kZXggKyAxKTtcbiAqICAgICAgIH0sXG4gKlxuICogICAgICAgZGVzdHJveUl0ZW1TY29wZTogZnVuY3Rpb24oaW5kZXgsIGl0ZW1TY29wZSkge1xuICogICAgICAgICAvLyBPcHRpb25hbCBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbiBhbiBpdGVtIGlzIHVubG9hZGVkLlxuICogICAgICAgICBjb25zb2xlLmxvZygnRGVzdHJveWVkIGl0ZW0gd2l0aCBpbmRleDogJyArIGluZGV4KTtcbiAqICAgICAgIH1cbiAqICAgICB9O1xuICogICB9KTtcbiAqIDwvc2NyaXB0PlxuICpcbiAqIDxvbnMtbGlzdCBuZy1jb250cm9sbGVyPVwiTXlDb250cm9sbGVyXCI+XG4gKiAgIDxvbnMtbGlzdC1pdGVtIG9ucy1sYXp5LXJlcGVhdD1cIk15RGVsZWdhdGVcIj5cbiAqICAgICB7eyBpdGVtIH19XG4gKiAgIDwvb25zLWxpc3QtaXRlbT5cbiAqIDwvb25zLWxpc3Q+XG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1sYXp5LXJlcGVhdFxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAaW5pdG9ubHlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BIGRlbGVnYXRlIG9iamVjdCwgY2FuIGJlIGVpdGhlciBhbiBvYmplY3QgYXR0YWNoZWQgdG8gdGhlIHNjb3BlICh3aGVuIHVzaW5nIEFuZ3VsYXJKUykgb3IgYSBub3JtYWwgSmF2YVNjcmlwdCB2YXJpYWJsZS5bL2VuXVxuICogIFtqYV3opoHntKDjga7jg63jg7zjg4njgIHjgqLjg7Pjg63jg7zjg4njgarjganjga7lh6bnkIbjgpLlp5TorbLjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJBbmd1bGFySlPjga7jgrnjgrPjg7zjg5fjga7lpInmlbDlkI3jgoTjgIHpgJrluLjjga5KYXZhU2NyaXB044Gu5aSJ5pWw5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSBkZWxlZ2F0ZS5jb25maWd1cmVJdGVtU2NvcGVcbiAqIEB0eXBlIHtGdW5jdGlvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRnVuY3Rpb24gd2hpY2ggcmVjaWV2ZXMgYW4gaW5kZXggYW5kIHRoZSBzY29wZSBmb3IgdGhlIGl0ZW0uIENhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB2YWx1ZXMgaW4gdGhlIGl0ZW0gc2NvcGUuWy9lbl1cbiAqICAgW2phXVsvamFdXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIC8qKlxuICAgKiBMYXp5IHJlcGVhdCBkaXJlY3RpdmUuXG4gICAqL1xuICBtb2R1bGUuZGlyZWN0aXZlKCdvbnNMYXp5UmVwZWF0JywgZnVuY3Rpb24oJG9uc2VuLCBMYXp5UmVwZWF0Vmlldykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICBwcmlvcml0eTogMTAwMCxcbiAgICAgIHRlcm1pbmFsOiB0cnVlLFxuXG4gICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgdmFyIGxhenlSZXBlYXQgPSBuZXcgTGF6eVJlcGVhdFZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJzID0gbGF6eVJlcGVhdCA9IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbn0pKCk7XG4iLCIvKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG4oZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmZhY3RvcnkoJ0FuZ3VsYXJMYXp5UmVwZWF0RGVsZWdhdGUnLCBmdW5jdGlvbigkY29tcGlsZSkge1xuXG4gICAgY29uc3QgZGlyZWN0aXZlQXR0cmlidXRlcyA9IFsnb25zLWxhenktcmVwZWF0JywgJ29uczpsYXp5OnJlcGVhdCcsICdvbnNfbGF6eV9yZXBlYXQnLCAnZGF0YS1vbnMtbGF6eS1yZXBlYXQnLCAneC1vbnMtbGF6eS1yZXBlYXQnXTtcbiAgICBjbGFzcyBBbmd1bGFyTGF6eVJlcGVhdERlbGVnYXRlIGV4dGVuZHMgb25zLl9pbnRlcm5hbC5MYXp5UmVwZWF0RGVsZWdhdGUge1xuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gdXNlckRlbGVnYXRlXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRlbXBsYXRlRWxlbWVudFxuICAgICAgICogQHBhcmFtIHtTY29wZX0gcGFyZW50U2NvcGVcbiAgICAgICAqL1xuICAgICAgY29uc3RydWN0b3IodXNlckRlbGVnYXRlLCB0ZW1wbGF0ZUVsZW1lbnQsIHBhcmVudFNjb3BlKSB7XG4gICAgICAgIHN1cGVyKHVzZXJEZWxlZ2F0ZSwgdGVtcGxhdGVFbGVtZW50KTtcbiAgICAgICAgdGhpcy5fcGFyZW50U2NvcGUgPSBwYXJlbnRTY29wZTtcblxuICAgICAgICBkaXJlY3RpdmVBdHRyaWJ1dGVzLmZvckVhY2goYXR0ciA9PiB0ZW1wbGF0ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHIpKTtcbiAgICAgICAgdGhpcy5fbGlua2VyID0gJGNvbXBpbGUodGVtcGxhdGVFbGVtZW50ID8gdGVtcGxhdGVFbGVtZW50LmNsb25lTm9kZSh0cnVlKSA6IG51bGwpO1xuICAgICAgfVxuXG4gICAgICBjb25maWd1cmVJdGVtU2NvcGUoaXRlbSwgc2NvcGUpe1xuICAgICAgICBpZiAodGhpcy5fdXNlckRlbGVnYXRlLmNvbmZpZ3VyZUl0ZW1TY29wZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5fdXNlckRlbGVnYXRlLmNvbmZpZ3VyZUl0ZW1TY29wZShpdGVtLCBzY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGVzdHJveUl0ZW1TY29wZShpdGVtLCBlbGVtZW50KXtcbiAgICAgICAgaWYgKHRoaXMuX3VzZXJEZWxlZ2F0ZS5kZXN0cm95SXRlbVNjb3BlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLl91c2VyRGVsZWdhdGUuZGVzdHJveUl0ZW1TY29wZShpdGVtLCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfdXNpbmdCaW5kaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5fdXNlckRlbGVnYXRlLmNvbmZpZ3VyZUl0ZW1TY29wZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3VzZXJEZWxlZ2F0ZS5jcmVhdGVJdGVtQ29udGVudCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGxhenktcmVwZWF0YCBkZWxlZ2F0ZSBvYmplY3QgaXMgdmFndWUuJyk7XG4gICAgICB9XG5cbiAgICAgIGxvYWRJdGVtRWxlbWVudChpbmRleCwgZG9uZSkge1xuICAgICAgICB0aGlzLl9wcmVwYXJlSXRlbUVsZW1lbnQoaW5kZXgsICh7ZWxlbWVudCwgc2NvcGV9KSA9PiB7XG4gICAgICAgICAgZG9uZSh7ZWxlbWVudCwgc2NvcGV9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIF9wcmVwYXJlSXRlbUVsZW1lbnQoaW5kZXgsIGRvbmUpIHtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLl9wYXJlbnRTY29wZS4kbmV3KCk7XG4gICAgICAgIHRoaXMuX2FkZFNwZWNpYWxQcm9wZXJ0aWVzKGluZGV4LCBzY29wZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3VzaW5nQmluZGluZygpKSB7XG4gICAgICAgICAgdGhpcy5jb25maWd1cmVJdGVtU2NvcGUoaW5kZXgsIHNjb3BlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xpbmtlcihzY29wZSwgKGNsb25lZCkgPT4ge1xuICAgICAgICAgIGxldCBlbGVtZW50ID0gY2xvbmVkWzBdO1xuICAgICAgICAgIGlmICghdGhpcy5fdXNpbmdCaW5kaW5nKCkpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLl91c2VyRGVsZWdhdGUuY3JlYXRlSXRlbUNvbnRlbnQoaW5kZXgsIGVsZW1lbnQpO1xuICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoc2NvcGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvbmUoe2VsZW1lbnQsIHNjb3BlfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXG4gICAgICAgKi9cbiAgICAgIF9hZGRTcGVjaWFsUHJvcGVydGllcyhpLCBzY29wZSkge1xuICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5jb3VudEl0ZW1zKCkgLSAxO1xuICAgICAgICBhbmd1bGFyLmV4dGVuZChzY29wZSwge1xuICAgICAgICAgICRpbmRleDogaSxcbiAgICAgICAgICAkZmlyc3Q6IGkgPT09IDAsXG4gICAgICAgICAgJGxhc3Q6IGkgPT09IGxhc3QsXG4gICAgICAgICAgJG1pZGRsZTogaSAhPT0gMCAmJiBpICE9PSBsYXN0LFxuICAgICAgICAgICRldmVuOiBpICUgMiA9PT0gMCxcbiAgICAgICAgICAkb2RkOiBpICUgMiA9PT0gMVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlSXRlbShpbmRleCwgaXRlbSkge1xuICAgICAgICBpZiAodGhpcy5fdXNpbmdCaW5kaW5nKCkpIHtcbiAgICAgICAgICBpdGVtLnNjb3BlLiRldmFsQXN5bmMoKCkgPT4gdGhpcy5jb25maWd1cmVJdGVtU2NvcGUoaW5kZXgsIGl0ZW0uc2NvcGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdXBlci51cGRhdGVJdGVtKGluZGV4LCBpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW1cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtLnNjb3BlXG4gICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGl0ZW0uZWxlbWVudFxuICAgICAgICovXG4gICAgICBkZXN0cm95SXRlbShpbmRleCwgaXRlbSkge1xuICAgICAgICBpZiAodGhpcy5fdXNpbmdCaW5kaW5nKCkpIHtcbiAgICAgICAgICB0aGlzLmRlc3Ryb3lJdGVtU2NvcGUoaW5kZXgsIGl0ZW0uc2NvcGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1cGVyLmRlc3Ryb3lJdGVtKGluZGV4LCBpdGVtLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uc2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLl9zY29wZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gQW5ndWxhckxhenlSZXBlYXREZWxlZ2F0ZTtcbiAgfSk7XG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtbW9kYWxcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGluaXRvbmx5XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVZhcmlhYmxlIG5hbWUgdG8gcmVmZXIgdGhpcyBtb2RhbC5bL2VuXVxuICogICBbamFd44GT44Gu44Oi44O844OA44Or44KS5Y+C54Wn44GZ44KL44Gf44KB44Gu5ZCN5YmN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogTW9kYWwgZGlyZWN0aXZlLlxuICAgKi9cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNNb2RhbCcsIGZ1bmN0aW9uKCRvbnNlbiwgTW9kYWxWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcblxuICAgICAgLy8gTk9URTogVGhpcyBlbGVtZW50IG11c3QgY29leGlzdHMgd2l0aCBuZy1jb250cm9sbGVyLlxuICAgICAgLy8gRG8gbm90IHVzZSBpc29sYXRlZCBzY29wZSBhbmQgdGVtcGxhdGUncyBuZy10cmFuc2NsdWRlLlxuICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG5cbiAgICAgIGNvbXBpbGU6IChlbGVtZW50LCBhdHRycykgPT4ge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcHJlOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbCA9IG5ldyBNb2RhbFZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcbiAgICAgICAgICAgICRvbnNlbi5hZGRNb2RpZmllck1ldGhvZHNGb3JDdXN0b21FbGVtZW50cyhtb2RhbCwgZWxlbWVudCk7XG5cbiAgICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCBtb2RhbCk7XG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1tb2RhbCcsIG1vZGFsKTtcblxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkb25zZW4ucmVtb3ZlTW9kaWZpZXJNZXRob2RzKG1vZGFsKTtcbiAgICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtbW9kYWwnLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICBtb2RhbCA9IGVsZW1lbnQgPSBzY29wZSA9IGF0dHJzID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn0pKCk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1uYXZpZ2F0b3JcbiAqIEBleGFtcGxlXG4gKiA8b25zLW5hdmlnYXRvciBhbmltYXRpb249XCJzbGlkZVwiIHZhcj1cImFwcC5uYXZpXCI+XG4gKiAgIDxvbnMtcGFnZT5cbiAqICAgICA8b25zLXRvb2xiYXI+XG4gKiAgICAgICA8ZGl2IGNsYXNzPVwiY2VudGVyXCI+VGl0bGU8L2Rpdj5cbiAqICAgICA8L29ucy10b29sYmFyPlxuICpcbiAqICAgICA8cCBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiPlxuICogICAgICAgPG9ucy1idXR0b24gbW9kaWZpZXI9XCJsaWdodFwiIG5nLWNsaWNrPVwiYXBwLm5hdmkucHVzaFBhZ2UoJ3BhZ2UuaHRtbCcpO1wiPlB1c2g8L29ucy1idXR0b24+XG4gKiAgICAgPC9wPlxuICogICA8L29ucy1wYWdlPlxuICogPC9vbnMtbmF2aWdhdG9yPlxuICpcbiAqIDxvbnMtdGVtcGxhdGUgaWQ9XCJwYWdlLmh0bWxcIj5cbiAqICAgPG9ucy1wYWdlPlxuICogICAgIDxvbnMtdG9vbGJhcj5cbiAqICAgICAgIDxkaXYgY2xhc3M9XCJjZW50ZXJcIj5UaXRsZTwvZGl2PlxuICogICAgIDwvb25zLXRvb2xiYXI+XG4gKlxuICogICAgIDxwIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCI+XG4gKiAgICAgICA8b25zLWJ1dHRvbiBtb2RpZmllcj1cImxpZ2h0XCIgbmctY2xpY2s9XCJhcHAubmF2aS5wb3BQYWdlKCk7XCI+UG9wPC9vbnMtYnV0dG9uPlxuICogICAgIDwvcD5cbiAqICAgPC9vbnMtcGFnZT5cbiAqIDwvb25zLXRlbXBsYXRlPlxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB2YXJcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoaXMgbmF2aWdhdG9yLlsvZW5dXG4gKiAgW2phXeOBk+OBruODiuODk+OCsuODvOOCv+ODvOOCkuWPgueFp+OBmeOCi+OBn+OCgeOBruWQjeWJjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVwdXNoXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVwdXNoXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVwdXNoXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlcG9wXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVwb3BcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInByZXBvcFwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RwdXNoXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0cHVzaFwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdHB1c2hcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0cG9wXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0cG9wXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwb3N0cG9wXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaW5pdFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJpbml0XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJpbml0XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtc2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJzaG93XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJkZXN0cm95XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJkZXN0cm95XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvblxuICogQHNpZ25hdHVyZSBvbihldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44GT44Gu44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25jZVxuICogQHNpZ25hdHVyZSBvbmNlKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQncyBvbmx5IHRyaWdnZXJlZCBvbmNlLlsvZW5dXG4gKiAgW2phXeS4gOW6puOBoOOBkeWRvOOBs+WHuuOBleOCjOOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb2ZmXG4gKiBAc2lnbmF0dXJlIG9mZihldmVudE5hbWUsIFtsaXN0ZW5lcl0pXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyLiBJZiB0aGUgbGlzdGVuZXIgaXMgbm90IHNwZWNpZmllZCBhbGwgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuWy9lbl1cbiAqICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5YmK6Zmk44GX44G+44GZ44CC44KC44GX44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5oyH5a6a44GX44Gq44GL44Gj44Gf5aC05ZCI44Gr44Gv44CB44Gd44Gu44Kk44OZ44Oz44OI44Gr57SQ44Gl44GP5YWo44Gm44Gu44Kk44OZ44Oz44OI44Oq44K544OK44O844GM5YmK6Zmk44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3liYrpmaTjgZnjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBsYXN0UmVhZHkgPSB3aW5kb3cub25zLk5hdmlnYXRvckVsZW1lbnQucmV3cml0YWJsZXMucmVhZHk7XG4gIHdpbmRvdy5vbnMuTmF2aWdhdG9yRWxlbWVudC5yZXdyaXRhYmxlcy5yZWFkeSA9IG9ucy5fd2FpdERpcmV0aXZlSW5pdCgnb25zLW5hdmlnYXRvcicsIGxhc3RSZWFkeSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNOYXZpZ2F0b3InLCBmdW5jdGlvbihOYXZpZ2F0b3JWaWV3LCAkb25zZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcblxuICAgICAgLy8gTk9URTogVGhpcyBlbGVtZW50IG11c3QgY29leGlzdHMgd2l0aCBuZy1jb250cm9sbGVyLlxuICAgICAgLy8gRG8gbm90IHVzZSBpc29sYXRlZCBzY29wZSBhbmQgdGVtcGxhdGUncyBuZy10cmFuc2NsdWRlLlxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgICBzY29wZTogdHJ1ZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcHJlOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgIHZhciB2aWV3ID0gbmV3IE5hdmlnYXRvclZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgICAgJG9uc2VuLmRlY2xhcmVWYXJBdHRyaWJ1dGUoYXR0cnMsIHZpZXcpO1xuICAgICAgICAgICAgJG9uc2VuLnJlZ2lzdGVyRXZlbnRIYW5kbGVycyh2aWV3LCAncHJlcHVzaCBwcmVwb3AgcG9zdHB1c2ggcG9zdHBvcCBpbml0IHNob3cgaGlkZSBkZXN0cm95Jyk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLW5hdmlnYXRvcicsIHZpZXcpO1xuXG4gICAgICAgICAgICBlbGVtZW50WzBdLnBhZ2VMb2FkZXIgPSAkb25zZW4uY3JlYXRlUGFnZUxvYWRlcih2aWV3KTtcblxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2aWV3Ll9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLW5hdmlnYXRvcicsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9zdDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbiAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbmFuZ3VsYXIubW9kdWxlKCdvbnNlbicpXG4gIC52YWx1ZSgnTmF2aWdhdG9yVHJhbnNpdGlvbkFuaW1hdG9yJywgb25zLl9pbnRlcm5hbC5OYXZpZ2F0b3JUcmFuc2l0aW9uQW5pbWF0b3IpXG4gIC52YWx1ZSgnRmFkZVRyYW5zaXRpb25BbmltYXRvcicsIG9ucy5faW50ZXJuYWwuRmFkZU5hdmlnYXRvclRyYW5zaXRpb25BbmltYXRvcilcbiAgLnZhbHVlKCdJT1NTbGlkZVRyYW5zaXRpb25BbmltYXRvcicsIG9ucy5faW50ZXJuYWwuSU9TU2xpZGVOYXZpZ2F0b3JUcmFuc2l0aW9uQW5pbWF0b3IpXG4gIC52YWx1ZSgnTGlmdFRyYW5zaXRpb25BbmltYXRvcicsIG9ucy5faW50ZXJuYWwuTGlmdE5hdmlnYXRvclRyYW5zaXRpb25BbmltYXRvcilcbiAgLnZhbHVlKCdOdWxsVHJhbnNpdGlvbkFuaW1hdG9yJywgb25zLl9pbnRlcm5hbC5OYXZpZ2F0b3JUcmFuc2l0aW9uQW5pbWF0b3IpXG4gIC52YWx1ZSgnU2ltcGxlU2xpZGVUcmFuc2l0aW9uQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLlNpbXBsZVNsaWRlTmF2aWdhdG9yVHJhbnNpdGlvbkFuaW1hdG9yKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmZhY3RvcnkoJ092ZXJsYXlTbGlkaW5nTWVudUFuaW1hdG9yJywgZnVuY3Rpb24oU2xpZGluZ01lbnVBbmltYXRvcikge1xuXG4gICAgdmFyIE92ZXJsYXlTbGlkaW5nTWVudUFuaW1hdG9yID0gU2xpZGluZ01lbnVBbmltYXRvci5leHRlbmQoe1xuXG4gICAgICBfYmxhY2tNYXNrOiB1bmRlZmluZWQsXG5cbiAgICAgIF9pc1JpZ2h0OiBmYWxzZSxcbiAgICAgIF9lbGVtZW50OiBmYWxzZSxcbiAgICAgIF9tZW51UGFnZTogZmFsc2UsXG4gICAgICBfbWFpblBhZ2U6IGZhbHNlLFxuICAgICAgX3dpZHRoOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge2pxTGl0ZX0gZWxlbWVudCBcIm9ucy1zbGlkaW5nLW1lbnVcIiBvciBcIm9ucy1zcGxpdC12aWV3XCIgZWxlbWVudFxuICAgICAgICogQHBhcmFtIHtqcUxpdGV9IG1haW5QYWdlXG4gICAgICAgKiBAcGFyYW0ge2pxTGl0ZX0gbWVudVBhZ2VcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy53aWR0aCBcIndpZHRoXCIgc3R5bGUgdmFsdWVcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5pc1JpZ2h0XG4gICAgICAgKi9cbiAgICAgIHNldHVwOiBmdW5jdGlvbihlbGVtZW50LCBtYWluUGFnZSwgbWVudVBhZ2UsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHRoaXMuX3dpZHRoID0gb3B0aW9ucy53aWR0aCB8fCAnOTAlJztcbiAgICAgICAgdGhpcy5faXNSaWdodCA9ICEhb3B0aW9ucy5pc1JpZ2h0O1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5fbWFpblBhZ2UgPSBtYWluUGFnZTtcbiAgICAgICAgdGhpcy5fbWVudVBhZ2UgPSBtZW51UGFnZTtcblxuICAgICAgICBtZW51UGFnZS5jc3MoJ2JveC1zaGFkb3cnLCAnMHB4IDAgMTBweCAwcHggcmdiYSgwLCAwLCAwLCAwLjIpJyk7XG4gICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgd2lkdGg6IG9wdGlvbnMud2lkdGgsXG4gICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAgIHpJbmRleDogMlxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGaXggZm9yIHRyYW5zcGFyZW50IG1lbnUgcGFnZSBvbiBpT1M4LlxuICAgICAgICBtZW51UGFnZS5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKDBweCwgMHB4LCAwcHgpJyk7XG5cbiAgICAgICAgbWFpblBhZ2UuY3NzKHt6SW5kZXg6IDF9KTtcblxuICAgICAgICBpZiAodGhpcy5faXNSaWdodCkge1xuICAgICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgICByaWdodDogJy0nICsgb3B0aW9ucy53aWR0aCxcbiAgICAgICAgICAgIGxlZnQ6ICdhdXRvJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgICByaWdodDogJ2F1dG8nLFxuICAgICAgICAgICAgbGVmdDogJy0nICsgb3B0aW9ucy53aWR0aFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYmxhY2tNYXNrID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2PjwvZGl2PicpLmNzcyh7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnYmxhY2snLFxuICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgbGVmdDogJzBweCcsXG4gICAgICAgICAgcmlnaHQ6ICcwcHgnLFxuICAgICAgICAgIGJvdHRvbTogJzBweCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAgIHpJbmRleDogMFxuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LnByZXBlbmQodGhpcy5fYmxhY2tNYXNrKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLndpZHRoXG4gICAgICAgKi9cbiAgICAgIG9uUmVzaXplZDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB0aGlzLl9tZW51UGFnZS5jc3MoJ3dpZHRoJywgb3B0aW9ucy53aWR0aCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzUmlnaHQpIHtcbiAgICAgICAgICB0aGlzLl9tZW51UGFnZS5jc3Moe1xuICAgICAgICAgICAgcmlnaHQ6ICctJyArIG9wdGlvbnMud2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiAnYXV0bydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9tZW51UGFnZS5jc3Moe1xuICAgICAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgICAgIGxlZnQ6ICctJyArIG9wdGlvbnMud2lkdGhcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmlzT3BlbmVkKSB7XG4gICAgICAgICAgdmFyIG1heCA9IHRoaXMuX21lbnVQYWdlWzBdLmNsaWVudFdpZHRoO1xuICAgICAgICAgIHZhciBtZW51U3R5bGUgPSB0aGlzLl9nZW5lcmF0ZU1lbnVQYWdlU3R5bGUobWF4KTtcbiAgICAgICAgICBvbnMuYW5pbWl0KHRoaXMuX21lbnVQYWdlWzBdKS5xdWV1ZShtZW51U3R5bGUpLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKi9cbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYmxhY2tNYXNrKSB7XG4gICAgICAgICAgdGhpcy5fYmxhY2tNYXNrLnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuX2JsYWNrTWFzayA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tYWluUGFnZS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICB0aGlzLl9tZW51UGFnZS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLl9tYWluUGFnZSA9IHRoaXMuX21lbnVQYWdlID0gbnVsbDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5zdGFudFxuICAgICAgICovXG4gICAgICBvcGVuTWVudTogZnVuY3Rpb24oY2FsbGJhY2ssIGluc3RhbnQpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5zdGFudCA9PT0gdHJ1ZSA/IDAuMCA6IHRoaXMuZHVyYXRpb247XG4gICAgICAgIHZhciBkZWxheSA9IGluc3RhbnQgPT09IHRydWUgPyAwLjAgOiB0aGlzLmRlbGF5O1xuXG4gICAgICAgIHRoaXMuX21lbnVQYWdlLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB0aGlzLl9ibGFja01hc2suY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICAgdmFyIG1heCA9IHRoaXMuX21lbnVQYWdlWzBdLmNsaWVudFdpZHRoO1xuICAgICAgICB2YXIgbWVudVN0eWxlID0gdGhpcy5fZ2VuZXJhdGVNZW51UGFnZVN0eWxlKG1heCk7XG4gICAgICAgIHZhciBtYWluUGFnZVN0eWxlID0gdGhpcy5fZ2VuZXJhdGVNYWluUGFnZVN0eWxlKG1heCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWFpblBhZ2VbMF0pXG4gICAgICAgICAgICAud2FpdChkZWxheSlcbiAgICAgICAgICAgIC5xdWV1ZShtYWluUGFnZVN0eWxlLCB7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgdGltaW5nOiB0aGlzLnRpbWluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5xdWV1ZShmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAgIC53YWl0KGRlbGF5KVxuICAgICAgICAgICAgLnF1ZXVlKG1lbnVTdHlsZSwge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgIHRpbWluZzogdGhpcy50aW1pbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSwgMTAwMCAvIDYwKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5zdGFudFxuICAgICAgICovXG4gICAgICBjbG9zZU1lbnU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBpbnN0YW50KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGluc3RhbnQgPT09IHRydWUgPyAwLjAgOiB0aGlzLmR1cmF0aW9uO1xuICAgICAgICB2YXIgZGVsYXkgPSBpbnN0YW50ID09PSB0cnVlID8gMC4wIDogdGhpcy5kZWxheTtcblxuICAgICAgICB0aGlzLl9ibGFja01hc2suY3NzKHtkaXNwbGF5OiAnYmxvY2snfSk7XG5cbiAgICAgICAgdmFyIG1lbnVQYWdlU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZU1lbnVQYWdlU3R5bGUoMCk7XG4gICAgICAgIHZhciBtYWluUGFnZVN0eWxlID0gdGhpcy5fZ2VuZXJhdGVNYWluUGFnZVN0eWxlKDApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBvbnMuYW5pbWl0KHRoaXMuX21haW5QYWdlWzBdKVxuICAgICAgICAgICAgLndhaXQoZGVsYXkpXG4gICAgICAgICAgICAucXVldWUobWFpblBhZ2VTdHlsZSwge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgIHRpbWluZzogdGhpcy50aW1pbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucXVldWUoZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgICB0aGlzLl9tZW51UGFnZS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAgIC53YWl0KGRlbGF5KVxuICAgICAgICAgICAgLnF1ZXVlKG1lbnVQYWdlU3R5bGUsIHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICB0aW1pbmc6IHRoaXMudGltaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnBsYXkoKTtcblxuICAgICAgICB9LmJpbmQodGhpcyksIDEwMDAgLyA2MCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kaXN0YW5jZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4RGlzdGFuY2VcbiAgICAgICAqL1xuICAgICAgdHJhbnNsYXRlTWVudTogZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICAgIHRoaXMuX21lbnVQYWdlLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB0aGlzLl9ibGFja01hc2suY3NzKHtkaXNwbGF5OiAnYmxvY2snfSk7XG5cbiAgICAgICAgdmFyIG1lbnVQYWdlU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZU1lbnVQYWdlU3R5bGUoTWF0aC5taW4ob3B0aW9ucy5tYXhEaXN0YW5jZSwgb3B0aW9ucy5kaXN0YW5jZSkpO1xuICAgICAgICB2YXIgbWFpblBhZ2VTdHlsZSA9IHRoaXMuX2dlbmVyYXRlTWFpblBhZ2VTdHlsZShNYXRoLm1pbihvcHRpb25zLm1heERpc3RhbmNlLCBvcHRpb25zLmRpc3RhbmNlKSk7XG4gICAgICAgIGRlbGV0ZSBtYWluUGFnZVN0eWxlLm9wYWNpdHk7XG5cbiAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAucXVldWUobWVudVBhZ2VTdHlsZSlcbiAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhtYWluUGFnZVN0eWxlKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tYWluUGFnZVswXSlcbiAgICAgICAgICAgIC5xdWV1ZShtYWluUGFnZVN0eWxlKVxuICAgICAgICAgICAgLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgX2dlbmVyYXRlTWVudVBhZ2VTdHlsZTogZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLl9pc1JpZ2h0ID8gLWRpc3RhbmNlIDogZGlzdGFuY2U7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAncHgsIDAsIDApJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtLFxuICAgICAgICAgICdib3gtc2hhZG93JzogZGlzdGFuY2UgPT09IDAgPyAnbm9uZScgOiAnMHB4IDAgMTBweCAwcHggcmdiYSgwLCAwLCAwLCAwLjIpJ1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgX2dlbmVyYXRlTWFpblBhZ2VTdHlsZTogZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgICAgICAgdmFyIG1heCA9IHRoaXMuX21lbnVQYWdlWzBdLmNsaWVudFdpZHRoO1xuICAgICAgICB2YXIgb3BhY2l0eSA9IDEgLSAoMC4xICogZGlzdGFuY2UgLyBtYXgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb3BhY2l0eTogb3BhY2l0eVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgY29weTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3ZlcmxheVNsaWRpbmdNZW51QW5pbWF0b3IoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBPdmVybGF5U2xpZGluZ01lbnVBbmltYXRvcjtcbiAgfSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1wYWdlXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIHZhclxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoaXMgcGFnZS5bL2VuXVxuICogICBbamFd44GT44Gu44Oa44O844K444KS5Y+C54Wn44GZ44KL44Gf44KB44Gu5ZCN5YmN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgbmctaW5maW5pdGUtc2Nyb2xsXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVBhdGggb2YgdGhlIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIG9uIGluZmluaXRlIHNjcm9sbGluZy4gVGhlIHBhdGggaXMgcmVsYXRpdmUgdG8gJHNjb3BlLiBUaGUgZnVuY3Rpb24gcmVjZWl2ZXMgYSBkb25lIGNhbGxiYWNrIHRoYXQgbXVzdCBiZSBjYWxsZWQgd2hlbiBpdCdzIGZpbmlzaGVkLlsvZW5dXG4gKiAgIFtqYV1bL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbi1kZXZpY2UtYmFjay1idXR0b25cbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIGJhY2sgYnV0dG9uIGlzIHByZXNzZWQuWy9lbl1cbiAqICAgW2phXeODh+ODkOOCpOOCueOBruODkOODg+OCr+ODnOOCv+ODs+OBjOaKvOOBleOCjOOBn+aZguOBruaMmeWLleOCkuioreWumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG5nLWRldmljZS1iYWNrLWJ1dHRvblxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aXRoIGFuIEFuZ3VsYXJKUyBleHByZXNzaW9uIHdoZW4gdGhlIGJhY2sgYnV0dG9uIGlzIHByZXNzZWQuWy9lbl1cbiAqICAgW2phXeODh+ODkOOCpOOCueOBruODkOODg+OCr+ODnOOCv+ODs+OBjOaKvOOBleOCjOOBn+aZguOBruaMmeWLleOCkuioreWumuOBp+OBjeOBvuOBmeOAgkFuZ3VsYXJKU+OBrmV4cHJlc3Npb27jgpLmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaW5pdFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwiaW5pdFwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiaW5pdFwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXNob3dcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInNob3dcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInNob3dcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1oaWRlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwiZGVzdHJveVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiZGVzdHJveVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmRpcmVjdGl2ZSgnb25zUGFnZScsIGZ1bmN0aW9uKCRvbnNlbiwgUGFnZVZpZXcpIHtcblxuICAgIGZ1bmN0aW9uIGZpcmVQYWdlSW5pdEV2ZW50KGVsZW1lbnQpIHtcbiAgICAgIC8vIFRPRE86IHJlbW92ZSBkaXJ0eSBmaXhcbiAgICAgIHZhciBpID0gMCwgZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoaSsrIDwgMTUpICB7XG4gICAgICAgICAgaWYgKGlzQXR0YWNoZWQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudCwgJ2luaXQnKTtcbiAgICAgICAgICAgIGZpcmVBY3R1YWxQYWdlSW5pdEV2ZW50KGVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaSA+IDEwKSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZiwgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNldEltbWVkaWF0ZShmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsIHRvIGZpcmUgXCJwYWdlaW5pdFwiIGV2ZW50LiBBdHRhY2ggXCJvbnMtcGFnZVwiIGVsZW1lbnQgdG8gdGhlIGRvY3VtZW50IGFmdGVyIGluaXRpYWxpemF0aW9uLicpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlyZUFjdHVhbFBhZ2VJbml0RXZlbnQoZWxlbWVudCkge1xuICAgICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIGV2ZW50LmluaXRFdmVudCgncGFnZWluaXQnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBdHRhY2hlZChlbGVtZW50KSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZSA/IGlzQXR0YWNoZWQoZWxlbWVudC5wYXJlbnROb2RlKSA6IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuXG4gICAgICAvLyBOT1RFOiBUaGlzIGVsZW1lbnQgbXVzdCBjb2V4aXN0cyB3aXRoIG5nLWNvbnRyb2xsZXIuXG4gICAgICAvLyBEbyBub3QgdXNlIGlzb2xhdGVkIHNjb3BlIGFuZCB0ZW1wbGF0ZSdzIG5nLXRyYW5zY2x1ZGUuXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuXG4gICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHByZTogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IG5ldyBQYWdlVmlldyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgICAkb25zZW4uZGVjbGFyZVZhckF0dHJpYnV0ZShhdHRycywgcGFnZSk7XG4gICAgICAgICAgICAkb25zZW4ucmVnaXN0ZXJFdmVudEhhbmRsZXJzKHBhZ2UsICdpbml0IHNob3cgaGlkZSBkZXN0cm95Jyk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLXBhZ2UnLCBwYWdlKTtcbiAgICAgICAgICAgICRvbnNlbi5hZGRNb2RpZmllck1ldGhvZHNGb3JDdXN0b21FbGVtZW50cyhwYWdlLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdfc2NvcGUnLCBzY29wZSk7XG5cbiAgICAgICAgICAgICRvbnNlbi5jbGVhbmVyLm9uRGVzdHJveShzY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHBhZ2UuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgJG9uc2VuLnJlbW92ZU1vZGlmaWVyTWV0aG9kcyhwYWdlKTtcbiAgICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtcGFnZScsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnX3Njb3BlJywgdW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAkb25zZW4uY2xlYXJDb21wb25lbnQoe1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgICAgIGF0dHJzOiBhdHRyc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cnMgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uIHBvc3RMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgZmlyZVBhZ2VJbml0RXZlbnQoZWxlbWVudFswXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLXBvcG92ZXJcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIHBvcG92ZXIuWy9lbl1cbiAqICBbamFd44GT44Gu44Od44OD44OX44Kq44O844OQ44O844KS5Y+C54Wn44GZ44KL44Gf44KB44Gu5ZCN5YmN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXByZXNob3dcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZXNob3dcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInByZXNob3dcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVoaWRlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcG9zdHNob3dcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInBvc3RzaG93XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwb3N0c2hvd1wi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RoaWRlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0aGlkZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdGhpZGVcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1kZXN0cm95XG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJkZXN0cm95XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJkZXN0cm95XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvblxuICogQHNpZ25hdHVyZSBvbihldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44GT44Gu44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25jZVxuICogQHNpZ25hdHVyZSBvbmNlKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQncyBvbmx5IHRyaWdnZXJlZCBvbmNlLlsvZW5dXG4gKiAgW2phXeS4gOW6puOBoOOBkeWRvOOBs+WHuuOBleOCjOOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb2ZmXG4gKiBAc2lnbmF0dXJlIG9mZihldmVudE5hbWUsIFtsaXN0ZW5lcl0pXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyLiBJZiB0aGUgbGlzdGVuZXIgaXMgbm90IHNwZWNpZmllZCBhbGwgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuWy9lbl1cbiAqICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5YmK6Zmk44GX44G+44GZ44CC44KC44GX44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5oyH5a6a44GX44Gq44GL44Gj44Gf5aC05ZCI44Gr44Gv44CB44Gd44Gu44Kk44OZ44Oz44OI44Gr57SQ44Gl44GP5YWo44Gm44Gu44Kk44OZ44Oz44OI44Oq44K544OK44O844GM5YmK6Zmk44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3liYrpmaTjgZnjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIG1vZHVsZS5kaXJlY3RpdmUoJ29uc1BvcG92ZXInLCBmdW5jdGlvbigkb25zZW4sIFBvcG92ZXJWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmU6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgICAgICB2YXIgcG9wb3ZlciA9IG5ldyBQb3BvdmVyVmlldyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgICAkb25zZW4uZGVjbGFyZVZhckF0dHJpYnV0ZShhdHRycywgcG9wb3Zlcik7XG4gICAgICAgICAgICAkb25zZW4ucmVnaXN0ZXJFdmVudEhhbmRsZXJzKHBvcG92ZXIsICdwcmVzaG93IHByZWhpZGUgcG9zdHNob3cgcG9zdGhpZGUgZGVzdHJveScpO1xuICAgICAgICAgICAgJG9uc2VuLmFkZE1vZGlmaWVyTWV0aG9kc0ZvckN1c3RvbUVsZW1lbnRzKHBvcG92ZXIsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1wb3BvdmVyJywgcG9wb3Zlcik7XG5cbiAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcG9wb3Zlci5fZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAkb25zZW4ucmVtb3ZlTW9kaWZpZXJNZXRob2RzKHBvcG92ZXIpO1xuICAgICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1wb3BvdmVyJywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcG9zdDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KSgpO1xuXG4iLCIvKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG4gICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbmh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG5hbmd1bGFyLm1vZHVsZSgnb25zZW4nKVxuICAudmFsdWUoJ1BvcG92ZXJBbmltYXRvcicsIG9ucy5faW50ZXJuYWwuUG9wb3ZlckFuaW1hdG9yKVxuICAudmFsdWUoJ0ZhZGVQb3BvdmVyQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLkZhZGVQb3BvdmVyQW5pbWF0b3IpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtcHVsbC1ob29rXG4gKiBAZXhhbXBsZVxuICogPHNjcmlwdD5cbiAqICAgb25zLmJvb3RzdHJhcCgpXG4gKlxuICogICAuY29udHJvbGxlcignTXlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkdGltZW91dCkge1xuICogICAgICRzY29wZS5pdGVtcyA9IFszLCAyICwxXTtcbiAqXG4gKiAgICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbigkZG9uZSkge1xuICogICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gKiAgICAgICAgICRzY29wZS5pdGVtcy51bnNoaWZ0KCRzY29wZS5pdGVtcy5sZW5ndGggKyAxKTtcbiAqICAgICAgICAgJGRvbmUoKTtcbiAqICAgICAgIH0sIDEwMDApO1xuICogICAgIH07XG4gKiAgIH0pO1xuICogPC9zY3JpcHQ+XG4gKlxuICogPG9ucy1wYWdlIG5nLWNvbnRyb2xsZXI9XCJNeUNvbnRyb2xsZXJcIj5cbiAqICAgPG9ucy1wdWxsLWhvb2sgdmFyPVwibG9hZGVyXCIgbmctYWN0aW9uPVwibG9hZCgkZG9uZSlcIj5cbiAqICAgICA8c3BhbiBuZy1zd2l0Y2g9XCJsb2FkZXIuc3RhdGVcIj5cbiAqICAgICAgIDxzcGFuIG5nLXN3aXRjaC13aGVuPVwiaW5pdGlhbFwiPlB1bGwgZG93biB0byByZWZyZXNoPC9zcGFuPlxuICogICAgICAgPHNwYW4gbmctc3dpdGNoLXdoZW49XCJwcmVhY3Rpb25cIj5SZWxlYXNlIHRvIHJlZnJlc2g8L3NwYW4+XG4gKiAgICAgICA8c3BhbiBuZy1zd2l0Y2gtd2hlbj1cImFjdGlvblwiPkxvYWRpbmcgZGF0YS4gUGxlYXNlIHdhaXQuLi48L3NwYW4+XG4gKiAgICAgPC9zcGFuPlxuICogICA8L29ucy1wdWxsLWhvb2s+XG4gKiAgIDxvbnMtbGlzdD5cbiAqICAgICA8b25zLWxpc3QtaXRlbSBuZy1yZXBlYXQ9XCJpdGVtIGluIGl0ZW1zXCI+XG4gKiAgICAgICBJdGVtICN7eyBpdGVtIH19XG4gKiAgICAgPC9vbnMtbGlzdC1pdGVtPlxuICogICA8L29ucy1saXN0PlxuICogPC9vbnMtcGFnZT5cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVZhcmlhYmxlIG5hbWUgdG8gcmVmZXIgdGhpcyBjb21wb25lbnQuWy9lbl1cbiAqICAgW2phXeOBk+OBruOCs+ODs+ODneODvOODjeODs+ODiOOCkuWPgueFp+OBmeOCi+OBn+OCgeOBruWQjeWJjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG5nLWFjdGlvblxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVXNlIHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIHBhZ2UgaXMgcHVsbGVkIGRvd24uIEEgPGNvZGU+JGRvbmU8L2NvZGU+IGZ1bmN0aW9uIGlzIGF2YWlsYWJsZSB0byB0ZWxsIHRoZSBjb21wb25lbnQgdGhhdCB0aGUgYWN0aW9uIGlzIGNvbXBsZXRlZC5bL2VuXVxuICogICBbamFdcHVsbCBkb3du44GX44Gf44Go44GN44Gu5oyv44KL6Iie44GE44KS5oyH5a6a44GX44G+44GZ44CC44Ki44Kv44K344On44Oz44GM5a6M5LqG44GX44Gf5pmC44Gr44GvPGNvZGU+JGRvbmU8L2NvZGU+6Zai5pWw44KS5ZG844Gz5Ye644GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWNoYW5nZXN0YXRlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJjaGFuZ2VzdGF0ZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiY2hhbmdlc3RhdGVcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uXG4gKiBAc2lnbmF0dXJlIG9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lci5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvbmNlXG4gKiBAc2lnbmF0dXJlIG9uY2UoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCdzIG9ubHkgdHJpZ2dlcmVkIG9uY2UuWy9lbl1cbiAqICBbamFd5LiA5bqm44Gg44GR5ZG844Gz5Ye644GV44KM44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvZmZcbiAqIEBzaWduYXR1cmUgb2ZmKGV2ZW50TmFtZSwgW2xpc3RlbmVyXSlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1SZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuIElmIHRoZSBsaXN0ZW5lciBpcyBub3Qgc3BlY2lmaWVkIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudCB0eXBlIHdpbGwgYmUgcmVtb3ZlZC5bL2VuXVxuICogIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLliYrpmaTjgZfjgb7jgZnjgILjgoLjgZfjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgarjgYvjgaPjgZ/loLTlkIjjgavjga/jgIHjgZ3jga7jgqTjg5njg7Pjg4jjgavntJDjgaXjgY/lhajjgabjga7jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzliYrpmaTjgZXjgozjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeWJiumZpOOBmeOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIFB1bGwgaG9vayBkaXJlY3RpdmUuXG4gICAqL1xuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc1B1bGxIb29rJywgZnVuY3Rpb24oJG9uc2VuLCBQdWxsSG9va1ZpZXcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgc2NvcGU6IHRydWUsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcHJlOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBwdWxsSG9vayA9IG5ldyBQdWxsSG9va1ZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgICAgJG9uc2VuLmRlY2xhcmVWYXJBdHRyaWJ1dGUoYXR0cnMsIHB1bGxIb29rKTtcbiAgICAgICAgICAgICRvbnNlbi5yZWdpc3RlckV2ZW50SGFuZGxlcnMocHVsbEhvb2ssICdjaGFuZ2VzdGF0ZSBkZXN0cm95Jyk7XG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1wdWxsLWhvb2snLCBwdWxsSG9vayk7XG5cbiAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHVsbEhvb2suX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtcHVsbC1ob29rJywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cnMgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxufSkoKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmZhY3RvcnkoJ1B1c2hTbGlkaW5nTWVudUFuaW1hdG9yJywgZnVuY3Rpb24oU2xpZGluZ01lbnVBbmltYXRvcikge1xuXG4gICAgdmFyIFB1c2hTbGlkaW5nTWVudUFuaW1hdG9yID0gU2xpZGluZ01lbnVBbmltYXRvci5leHRlbmQoe1xuXG4gICAgICBfaXNSaWdodDogZmFsc2UsXG4gICAgICBfZWxlbWVudDogdW5kZWZpbmVkLFxuICAgICAgX21lbnVQYWdlOiB1bmRlZmluZWQsXG4gICAgICBfbWFpblBhZ2U6IHVuZGVmaW5lZCxcbiAgICAgIF93aWR0aDogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBlbGVtZW50IFwib25zLXNsaWRpbmctbWVudVwiIG9yIFwib25zLXNwbGl0LXZpZXdcIiBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0ge2pxTGl0ZX0gbWFpblBhZ2VcbiAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBtZW51UGFnZVxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLndpZHRoIFwid2lkdGhcIiBzdHlsZSB2YWx1ZVxuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmlzUmlnaHRcbiAgICAgICAqL1xuICAgICAgc2V0dXA6IGZ1bmN0aW9uKGVsZW1lbnQsIG1haW5QYWdlLCBtZW51UGFnZSwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5fbWFpblBhZ2UgPSBtYWluUGFnZTtcbiAgICAgICAgdGhpcy5fbWVudVBhZ2UgPSBtZW51UGFnZTtcblxuICAgICAgICB0aGlzLl9pc1JpZ2h0ID0gISFvcHRpb25zLmlzUmlnaHQ7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gb3B0aW9ucy53aWR0aCB8fCAnOTAlJztcblxuICAgICAgICBtZW51UGFnZS5jc3Moe1xuICAgICAgICAgIHdpZHRoOiBvcHRpb25zLndpZHRoLFxuICAgICAgICAgIGRpc3BsYXk6ICdub25lJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5faXNSaWdodCkge1xuICAgICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgICByaWdodDogJy0nICsgb3B0aW9ucy53aWR0aCxcbiAgICAgICAgICAgIGxlZnQ6ICdhdXRvJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgICByaWdodDogJ2F1dG8nLFxuICAgICAgICAgICAgbGVmdDogJy0nICsgb3B0aW9ucy53aWR0aFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy53aWR0aFxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuaXNSaWdodFxuICAgICAgICovXG4gICAgICBvblJlc2l6ZWQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fbWVudVBhZ2UuY3NzKCd3aWR0aCcsIG9wdGlvbnMud2lkdGgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc1JpZ2h0KSB7XG4gICAgICAgICAgdGhpcy5fbWVudVBhZ2UuY3NzKHtcbiAgICAgICAgICAgIHJpZ2h0OiAnLScgKyBvcHRpb25zLndpZHRoLFxuICAgICAgICAgICAgbGVmdDogJ2F1dG8nXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbWVudVBhZ2UuY3NzKHtcbiAgICAgICAgICAgIHJpZ2h0OiAnYXV0bycsXG4gICAgICAgICAgICBsZWZ0OiAnLScgKyBvcHRpb25zLndpZHRoXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5pc09wZW5lZCkge1xuICAgICAgICAgIHZhciBtYXggPSB0aGlzLl9tZW51UGFnZVswXS5jbGllbnRXaWR0aDtcbiAgICAgICAgICB2YXIgbWFpblBhZ2VUcmFuc2Zvcm0gPSB0aGlzLl9nZW5lcmF0ZUFib3ZlUGFnZVRyYW5zZm9ybShtYXgpO1xuICAgICAgICAgIHZhciBtZW51UGFnZVN0eWxlID0gdGhpcy5fZ2VuZXJhdGVCZWhpbmRQYWdlU3R5bGUobWF4KTtcblxuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWFpblBhZ2VbMF0pLnF1ZXVlKHt0cmFuc2Zvcm06IG1haW5QYWdlVHJhbnNmb3JtfSkucGxheSgpO1xuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWVudVBhZ2VbMF0pLnF1ZXVlKG1lbnVQYWdlU3R5bGUpLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKi9cbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLl9tYWluUGFnZS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICB0aGlzLl9tZW51UGFnZS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLl9tYWluUGFnZSA9IHRoaXMuX21lbnVQYWdlID0gbnVsbDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5zdGFudFxuICAgICAgICovXG4gICAgICBvcGVuTWVudTogZnVuY3Rpb24oY2FsbGJhY2ssIGluc3RhbnQpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5zdGFudCA9PT0gdHJ1ZSA/IDAuMCA6IHRoaXMuZHVyYXRpb247XG4gICAgICAgIHZhciBkZWxheSA9IGluc3RhbnQgPT09IHRydWUgPyAwLjAgOiB0aGlzLmRlbGF5O1xuXG4gICAgICAgIHRoaXMuX21lbnVQYWdlLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICAgIHZhciBtYXggPSB0aGlzLl9tZW51UGFnZVswXS5jbGllbnRXaWR0aDtcblxuICAgICAgICB2YXIgYWJvdmVUcmFuc2Zvcm0gPSB0aGlzLl9nZW5lcmF0ZUFib3ZlUGFnZVRyYW5zZm9ybShtYXgpO1xuICAgICAgICB2YXIgYmVoaW5kU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZShtYXgpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBvbnMuYW5pbWl0KHRoaXMuX21haW5QYWdlWzBdKVxuICAgICAgICAgICAgLndhaXQoZGVsYXkpXG4gICAgICAgICAgICAucXVldWUoe1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGFib3ZlVHJhbnNmb3JtXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgdGltaW5nOiB0aGlzLnRpbWluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5xdWV1ZShmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAgIC53YWl0KGRlbGF5KVxuICAgICAgICAgICAgLnF1ZXVlKGJlaGluZFN0eWxlLCB7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgdGltaW5nOiB0aGlzLnRpbWluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5wbGF5KCk7XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwIC8gNjApO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpbnN0YW50XG4gICAgICAgKi9cbiAgICAgIGNsb3NlTWVudTogZnVuY3Rpb24oY2FsbGJhY2ssIGluc3RhbnQpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5zdGFudCA9PT0gdHJ1ZSA/IDAuMCA6IHRoaXMuZHVyYXRpb247XG4gICAgICAgIHZhciBkZWxheSA9IGluc3RhbnQgPT09IHRydWUgPyAwLjAgOiB0aGlzLmRlbGF5O1xuXG4gICAgICAgIHZhciBhYm92ZVRyYW5zZm9ybSA9IHRoaXMuX2dlbmVyYXRlQWJvdmVQYWdlVHJhbnNmb3JtKDApO1xuICAgICAgICB2YXIgYmVoaW5kU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZSgwKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tYWluUGFnZVswXSlcbiAgICAgICAgICAgIC53YWl0KGRlbGF5KVxuICAgICAgICAgICAgLnF1ZXVlKHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBhYm92ZVRyYW5zZm9ybVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgIHRpbWluZzogdGhpcy50aW1pbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucXVldWUoe1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucXVldWUoZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgICB0aGlzLl9tZW51UGFnZS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAgIC53YWl0KGRlbGF5KVxuICAgICAgICAgICAgLnF1ZXVlKGJlaGluZFN0eWxlLCB7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgdGltaW5nOiB0aGlzLnRpbWluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5xdWV1ZShmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSwgMTAwMCAvIDYwKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmRpc3RhbmNlXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5tYXhEaXN0YW5jZVxuICAgICAgICovXG4gICAgICB0cmFuc2xhdGVNZW51OiBmdW5jdGlvbihvcHRpb25zKSB7XG5cbiAgICAgICAgdGhpcy5fbWVudVBhZ2UuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICAgdmFyIGFib3ZlVHJhbnNmb3JtID0gdGhpcy5fZ2VuZXJhdGVBYm92ZVBhZ2VUcmFuc2Zvcm0oTWF0aC5taW4ob3B0aW9ucy5tYXhEaXN0YW5jZSwgb3B0aW9ucy5kaXN0YW5jZSkpO1xuICAgICAgICB2YXIgYmVoaW5kU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZShNYXRoLm1pbihvcHRpb25zLm1heERpc3RhbmNlLCBvcHRpb25zLmRpc3RhbmNlKSk7XG5cbiAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tYWluUGFnZVswXSlcbiAgICAgICAgICAucXVldWUoe3RyYW5zZm9ybTogYWJvdmVUcmFuc2Zvcm19KVxuICAgICAgICAgIC5wbGF5KCk7XG5cbiAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAucXVldWUoYmVoaW5kU3R5bGUpXG4gICAgICAgICAgLnBsYXkoKTtcbiAgICAgIH0sXG5cbiAgICAgIF9nZW5lcmF0ZUFib3ZlUGFnZVRyYW5zZm9ybTogZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLl9pc1JpZ2h0ID8gLWRpc3RhbmNlIDogZGlzdGFuY2U7XG4gICAgICAgIHZhciBhYm92ZVRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgeCArICdweCwgMCwgMCknO1xuXG4gICAgICAgIHJldHVybiBhYm92ZVRyYW5zZm9ybTtcbiAgICAgIH0sXG5cbiAgICAgIF9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZTogZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgICAgICAgdmFyIGJlaGluZFggPSB0aGlzLl9pc1JpZ2h0ID8gLWRpc3RhbmNlIDogZGlzdGFuY2U7XG4gICAgICAgIHZhciBiZWhpbmRUcmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArIGJlaGluZFggKyAncHgsIDAsIDApJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyYW5zZm9ybTogYmVoaW5kVHJhbnNmb3JtXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQdXNoU2xpZGluZ01lbnVBbmltYXRvcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFB1c2hTbGlkaW5nTWVudUFuaW1hdG9yO1xuICB9KTtcblxufSkoKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmZhY3RvcnkoJ1JldmVhbFNsaWRpbmdNZW51QW5pbWF0b3InLCBmdW5jdGlvbihTbGlkaW5nTWVudUFuaW1hdG9yKSB7XG5cbiAgICB2YXIgUmV2ZWFsU2xpZGluZ01lbnVBbmltYXRvciA9IFNsaWRpbmdNZW51QW5pbWF0b3IuZXh0ZW5kKHtcblxuICAgICAgX2JsYWNrTWFzazogdW5kZWZpbmVkLFxuXG4gICAgICBfaXNSaWdodDogZmFsc2UsXG5cbiAgICAgIF9tZW51UGFnZTogdW5kZWZpbmVkLFxuICAgICAgX2VsZW1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgIF9tYWluUGFnZTogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBlbGVtZW50IFwib25zLXNsaWRpbmctbWVudVwiIG9yIFwib25zLXNwbGl0LXZpZXdcIiBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0ge2pxTGl0ZX0gbWFpblBhZ2VcbiAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBtZW51UGFnZVxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLndpZHRoIFwid2lkdGhcIiBzdHlsZSB2YWx1ZVxuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmlzUmlnaHRcbiAgICAgICAqL1xuICAgICAgc2V0dXA6IGZ1bmN0aW9uKGVsZW1lbnQsIG1haW5QYWdlLCBtZW51UGFnZSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5fbWVudVBhZ2UgPSBtZW51UGFnZTtcbiAgICAgICAgdGhpcy5fbWFpblBhZ2UgPSBtYWluUGFnZTtcbiAgICAgICAgdGhpcy5faXNSaWdodCA9ICEhb3B0aW9ucy5pc1JpZ2h0O1xuICAgICAgICB0aGlzLl93aWR0aCA9IG9wdGlvbnMud2lkdGggfHwgJzkwJSc7XG5cbiAgICAgICAgbWFpblBhZ2UuY3NzKHtcbiAgICAgICAgICBib3hTaGFkb3c6ICcwcHggMCAxMHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMiknXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgd2lkdGg6IG9wdGlvbnMud2lkdGgsXG4gICAgICAgICAgb3BhY2l0eTogMC45LFxuICAgICAgICAgIGRpc3BsYXk6ICdub25lJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5faXNSaWdodCkge1xuICAgICAgICAgIG1lbnVQYWdlLmNzcyh7XG4gICAgICAgICAgICByaWdodDogJzBweCcsXG4gICAgICAgICAgICBsZWZ0OiAnYXV0bydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZW51UGFnZS5jc3Moe1xuICAgICAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgICAgICAgIGxlZnQ6ICcwcHgnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9ibGFja01hc2sgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+JykuY3NzKHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdibGFjaycsXG4gICAgICAgICAgdG9wOiAnMHB4JyxcbiAgICAgICAgICBsZWZ0OiAnMHB4JyxcbiAgICAgICAgICByaWdodDogJzBweCcsXG4gICAgICAgICAgYm90dG9tOiAnMHB4JyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBkaXNwbGF5OiAnbm9uZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5wcmVwZW5kKHRoaXMuX2JsYWNrTWFzayk7XG5cbiAgICAgICAgLy8gRGlydHkgZml4IGZvciBicm9rZW4gcmVuZGVyaW5nIGJ1ZyBvbiBhbmRyb2lkIDQueC5cbiAgICAgICAgb25zLmFuaW1pdChtYWluUGFnZVswXSkucXVldWUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJ30pLnBsYXkoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5pc09wZW5lZFxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMud2lkdGhcbiAgICAgICAqL1xuICAgICAgb25SZXNpemVkOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICAgICAgdGhpcy5fbWVudVBhZ2UuY3NzKCd3aWR0aCcsIHRoaXMuX3dpZHRoKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5pc09wZW5lZCkge1xuICAgICAgICAgIHZhciBtYXggPSB0aGlzLl9tZW51UGFnZVswXS5jbGllbnRXaWR0aDtcblxuICAgICAgICAgIHZhciBhYm92ZVRyYW5zZm9ybSA9IHRoaXMuX2dlbmVyYXRlQWJvdmVQYWdlVHJhbnNmb3JtKG1heCk7XG4gICAgICAgICAgdmFyIGJlaGluZFN0eWxlID0gdGhpcy5fZ2VuZXJhdGVCZWhpbmRQYWdlU3R5bGUobWF4KTtcblxuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWFpblBhZ2VbMF0pLnF1ZXVlKHt0cmFuc2Zvcm06IGFib3ZlVHJhbnNmb3JtfSkucGxheSgpO1xuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWVudVBhZ2VbMF0pLnF1ZXVlKGJlaGluZFN0eWxlKS5wbGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtqcUxpdGV9IGVsZW1lbnQgXCJvbnMtc2xpZGluZy1tZW51XCIgb3IgXCJvbnMtc3BsaXQtdmlld1wiIGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBtYWluUGFnZVxuICAgICAgICogQHBhcmFtIHtqcUxpdGV9IG1lbnVQYWdlXG4gICAgICAgKi9cbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYmxhY2tNYXNrKSB7XG4gICAgICAgICAgdGhpcy5fYmxhY2tNYXNrLnJlbW92ZSgpO1xuICAgICAgICAgIHRoaXMuX2JsYWNrTWFzayA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbWFpblBhZ2UpIHtcbiAgICAgICAgICB0aGlzLl9tYWluUGFnZS5hdHRyKCdzdHlsZScsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9tZW51UGFnZSkge1xuICAgICAgICAgIHRoaXMuX21lbnVQYWdlLmF0dHIoJ3N0eWxlJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbWFpblBhZ2UgPSB0aGlzLl9tZW51UGFnZSA9IHRoaXMuX2VsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluc3RhbnRcbiAgICAgICAqL1xuICAgICAgb3Blbk1lbnU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBpbnN0YW50KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGluc3RhbnQgPT09IHRydWUgPyAwLjAgOiB0aGlzLmR1cmF0aW9uO1xuICAgICAgICB2YXIgZGVsYXkgPSBpbnN0YW50ID09PSB0cnVlID8gMC4wIDogdGhpcy5kZWxheTtcblxuICAgICAgICB0aGlzLl9tZW51UGFnZS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgdGhpcy5fYmxhY2tNYXNrLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgICAgIHZhciBtYXggPSB0aGlzLl9tZW51UGFnZVswXS5jbGllbnRXaWR0aDtcblxuICAgICAgICB2YXIgYWJvdmVUcmFuc2Zvcm0gPSB0aGlzLl9nZW5lcmF0ZUFib3ZlUGFnZVRyYW5zZm9ybShtYXgpO1xuICAgICAgICB2YXIgYmVoaW5kU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZShtYXgpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBvbnMuYW5pbWl0KHRoaXMuX21haW5QYWdlWzBdKVxuICAgICAgICAgICAgLndhaXQoZGVsYXkpXG4gICAgICAgICAgICAucXVldWUoe1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGFib3ZlVHJhbnNmb3JtXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgdGltaW5nOiB0aGlzLnRpbWluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5xdWV1ZShmdW5jdGlvbihkb25lKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgICAgb25zLmFuaW1pdCh0aGlzLl9tZW51UGFnZVswXSlcbiAgICAgICAgICAgIC53YWl0KGRlbGF5KVxuICAgICAgICAgICAgLnF1ZXVlKGJlaGluZFN0eWxlLCB7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgdGltaW5nOiB0aGlzLnRpbWluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5wbGF5KCk7XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwIC8gNjApO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpbnN0YW50XG4gICAgICAgKi9cbiAgICAgIGNsb3NlTWVudTogZnVuY3Rpb24oY2FsbGJhY2ssIGluc3RhbnQpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5zdGFudCA9PT0gdHJ1ZSA/IDAuMCA6IHRoaXMuZHVyYXRpb247XG4gICAgICAgIHZhciBkZWxheSA9IGluc3RhbnQgPT09IHRydWUgPyAwLjAgOiB0aGlzLmRlbGF5O1xuXG4gICAgICAgIHRoaXMuX2JsYWNrTWFzay5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgICB2YXIgYWJvdmVUcmFuc2Zvcm0gPSB0aGlzLl9nZW5lcmF0ZUFib3ZlUGFnZVRyYW5zZm9ybSgwKTtcbiAgICAgICAgdmFyIGJlaGluZFN0eWxlID0gdGhpcy5fZ2VuZXJhdGVCZWhpbmRQYWdlU3R5bGUoMCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWFpblBhZ2VbMF0pXG4gICAgICAgICAgICAud2FpdChkZWxheSlcbiAgICAgICAgICAgIC5xdWV1ZSh7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogYWJvdmVUcmFuc2Zvcm1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICB0aW1pbmc6IHRoaXMudGltaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnF1ZXVlKHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnF1ZXVlKGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbWVudVBhZ2UuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgLnBsYXkoKTtcblxuICAgICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWVudVBhZ2VbMF0pXG4gICAgICAgICAgICAud2FpdChkZWxheSlcbiAgICAgICAgICAgIC5xdWV1ZShiZWhpbmRTdHlsZSwge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgIHRpbWluZzogdGhpcy50aW1pbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAucXVldWUoZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnBsYXkoKTtcblxuICAgICAgICB9LmJpbmQodGhpcyksIDEwMDAgLyA2MCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kaXN0YW5jZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4RGlzdGFuY2VcbiAgICAgICAqL1xuICAgICAgdHJhbnNsYXRlTWVudTogZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gICAgICAgIHRoaXMuX21lbnVQYWdlLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB0aGlzLl9ibGFja01hc2suY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICAgdmFyIGFib3ZlVHJhbnNmb3JtID0gdGhpcy5fZ2VuZXJhdGVBYm92ZVBhZ2VUcmFuc2Zvcm0oTWF0aC5taW4ob3B0aW9ucy5tYXhEaXN0YW5jZSwgb3B0aW9ucy5kaXN0YW5jZSkpO1xuICAgICAgICB2YXIgYmVoaW5kU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZUJlaGluZFBhZ2VTdHlsZShNYXRoLm1pbihvcHRpb25zLm1heERpc3RhbmNlLCBvcHRpb25zLmRpc3RhbmNlKSk7XG4gICAgICAgIGRlbGV0ZSBiZWhpbmRTdHlsZS5vcGFjaXR5O1xuXG4gICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWFpblBhZ2VbMF0pXG4gICAgICAgICAgLnF1ZXVlKHt0cmFuc2Zvcm06IGFib3ZlVHJhbnNmb3JtfSlcbiAgICAgICAgICAucGxheSgpO1xuXG4gICAgICAgIG9ucy5hbmltaXQodGhpcy5fbWVudVBhZ2VbMF0pXG4gICAgICAgICAgLnF1ZXVlKGJlaGluZFN0eWxlKVxuICAgICAgICAgIC5wbGF5KCk7XG4gICAgICB9LFxuXG4gICAgICBfZ2VuZXJhdGVBYm92ZVBhZ2VUcmFuc2Zvcm06IGZ1bmN0aW9uKGRpc3RhbmNlKSB7XG4gICAgICAgIHZhciB4ID0gdGhpcy5faXNSaWdodCA/IC1kaXN0YW5jZSA6IGRpc3RhbmNlO1xuICAgICAgICB2YXIgYWJvdmVUcmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAncHgsIDAsIDApJztcblxuICAgICAgICByZXR1cm4gYWJvdmVUcmFuc2Zvcm07XG4gICAgICB9LFxuXG4gICAgICBfZ2VuZXJhdGVCZWhpbmRQYWdlU3R5bGU6IGZ1bmN0aW9uKGRpc3RhbmNlKSB7XG4gICAgICAgIHZhciBtYXggPSB0aGlzLl9tZW51UGFnZVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcblxuICAgICAgICB2YXIgYmVoaW5kRGlzdGFuY2UgPSAoZGlzdGFuY2UgLSBtYXgpIC8gbWF4ICogMTA7XG4gICAgICAgIGJlaGluZERpc3RhbmNlID0gaXNOYU4oYmVoaW5kRGlzdGFuY2UpID8gMCA6IE1hdGgubWF4KE1hdGgubWluKGJlaGluZERpc3RhbmNlLCAwKSwgLTEwKTtcblxuICAgICAgICB2YXIgYmVoaW5kWCA9IHRoaXMuX2lzUmlnaHQgPyAtYmVoaW5kRGlzdGFuY2UgOiBiZWhpbmREaXN0YW5jZTtcbiAgICAgICAgdmFyIGJlaGluZFRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgYmVoaW5kWCArICclLCAwLCAwKSc7XG4gICAgICAgIHZhciBvcGFjaXR5ID0gMSArIGJlaGluZERpc3RhbmNlIC8gMTAwO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHJhbnNmb3JtOiBiZWhpbmRUcmFuc2Zvcm0sXG4gICAgICAgICAgb3BhY2l0eTogb3BhY2l0eVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgY29weTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmV2ZWFsU2xpZGluZ01lbnVBbmltYXRvcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFJldmVhbFNsaWRpbmdNZW51QW5pbWF0b3I7XG4gIH0pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtc2xpZGluZy1tZW51XG4gKiBAY2F0ZWdvcnkgbWVudVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1Db21wb25lbnQgZm9yIHNsaWRpbmcgVUkgd2hlcmUgb25lIHBhZ2UgaXMgb3ZlcmxheWVkIG92ZXIgYW5vdGhlciBwYWdlLiBUaGUgYWJvdmUgcGFnZSBjYW4gYmUgc2xpZGVkIGFzaWRlIHRvIHJldmVhbCB0aGUgcGFnZSBiZWhpbmQuWy9lbl1cbiAqICAgW2phXeOCueODqeOCpOODh+OCo+ODs+OCsOODoeODi+ODpeODvOOCkuihqOePvuOBmeOCi+OBn+OCgeOBruOCs+ODs+ODneODvOODjeODs+ODiOOBp+OAgeeJh+aWueOBruODmuODvOOCuOOBjOWIpeOBruODmuODvOOCuOOBruS4iuOBq+OCquODvOODkOODvOODrOOCpOOBp+ihqOekuuOBleOCjOOBvuOBmeOAgmFib3ZlLXBhZ2XjgafmjIflrprjgZXjgozjgZ/jg5rjg7zjgrjjga/jgIHmqKrjgYvjgonjgrnjg6njgqTjg4njgZfjgabooajnpLrjgZfjgb7jgZnjgIJbL2phXVxuICogQGNvZGVwZW4gSUR2RkpcbiAqIEBzZWVhbHNvIG9ucy1wYWdlXG4gKiAgIFtlbl1vbnMtcGFnZSBjb21wb25lbnRbL2VuXVxuICogICBbamFdb25zLXBhZ2XjgrPjg7Pjg53jg7zjg43jg7Pjg4hbL2phXVxuICogQGd1aWRlIFVzaW5nU2xpZGluZ01lbnVcbiAqICAgW2VuXVVzaW5nIHNsaWRpbmcgbWVudVsvZW5dXG4gKiAgIFtqYV3jgrnjg6njgqTjg4fjgqPjg7PjgrDjg6Hjg4vjg6Xjg7zjgpLkvb/jgYZbL2phXVxuICogQGd1aWRlIEV2ZW50SGFuZGxpbmdcbiAqICAgW2VuXVVzaW5nIGV2ZW50c1svZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjga7liKnnlKhbL2phXVxuICogQGd1aWRlIENhbGxpbmdDb21wb25lbnRBUElzZnJvbUphdmFTY3JpcHRcbiAqICAgW2VuXVVzaW5nIG5hdmlnYXRvciBmcm9tIEphdmFTY3JpcHRbL2VuXVxuICogICBbamFdSmF2YVNjcmlwdOOBi+OCieOCs+ODs+ODneODvOODjeODs+ODiOOCkuWRvOOBs+WHuuOBmVsvamFdXG4gKiBAZ3VpZGUgRGVmaW5pbmdNdWx0aXBsZVBhZ2VzaW5TaW5nbGVIVE1MXG4gKiAgIFtlbl1EZWZpbmluZyBtdWx0aXBsZSBwYWdlcyBpbiBzaW5nbGUgaHRtbFsvZW5dXG4gKiAgIFtqYV3opIfmlbDjga7jg5rjg7zjgrjjgpIx44Gk44GuSFRNTOOBq+iomOi/sOOBmeOCi1svamFdXG4gKiBAZXhhbXBsZVxuICogPG9ucy1zbGlkaW5nLW1lbnUgdmFyPVwiYXBwLm1lbnVcIiBtYWluLXBhZ2U9XCJwYWdlLmh0bWxcIiBtZW51LXBhZ2U9XCJtZW51Lmh0bWxcIiBtYXgtc2xpZGUtZGlzdGFuY2U9XCIyMDBweFwiIHR5cGU9XCJyZXZlYWxcIiBzaWRlPVwibGVmdFwiPlxuICogPC9vbnMtc2xpZGluZy1tZW51PlxuICpcbiAqIDxvbnMtdGVtcGxhdGUgaWQ9XCJwYWdlLmh0bWxcIj5cbiAqICAgPG9ucy1wYWdlPlxuICogICAgPHAgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIj5cbiAqICAgICAgPG9ucy1idXR0b24gbmctY2xpY2s9XCJhcHAubWVudS50b2dnbGVNZW51KClcIj5Ub2dnbGU8L29ucy1idXR0b24+XG4gKiAgICA8L3A+XG4gKiAgIDwvb25zLXBhZ2U+XG4gKiA8L29ucy10ZW1wbGF0ZT5cbiAqXG4gKiA8b25zLXRlbXBsYXRlIGlkPVwibWVudS5odG1sXCI+XG4gKiAgIDxvbnMtcGFnZT5cbiAqICAgICA8IS0tIG1lbnUgcGFnZSdzIGNvbnRlbnRzIC0tPlxuICogICA8L29ucy1wYWdlPlxuICogPC9vbnMtdGVtcGxhdGU+XG4gKlxuICovXG5cbi8qKlxuICogQGV2ZW50IHByZW9wZW5cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRmlyZWQganVzdCBiZWZvcmUgdGhlIHNsaWRpbmcgbWVudSBpcyBvcGVuZWQuWy9lbl1cbiAqICAgW2phXeOCueODqeOCpOODh+OCo+ODs+OCsOODoeODi+ODpeODvOOBjOmWi+OBj+WJjeOBq+eZuueBq+OBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAqICAgW2VuXUV2ZW50IG9iamVjdC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudC5zbGlkaW5nTWVudVxuICogICBbZW5dU2xpZGluZyBtZW51IHZpZXcgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ9TbGlkaW5nTWVudeOCquODluOCuOOCp+OCr+ODiOOBp+OBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAZXZlbnQgcG9zdG9wZW5cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRmlyZWQganVzdCBhZnRlciB0aGUgc2xpZGluZyBtZW51IGlzIG9wZW5lZC5bL2VuXVxuICogICBbamFd44K544Op44Kk44OH44Kj44Oz44Kw44Oh44OL44Ol44O844GM6ZaL44GN57WC44KP44Gj44Gf5b6M44Gr55m654Gr44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICogICBbZW5dRXZlbnQgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50LnNsaWRpbmdNZW51XG4gKiAgIFtlbl1TbGlkaW5nIG1lbnUgdmlldyBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn1NsaWRpbmdNZW5144Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBldmVudCBwcmVjbG9zZVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1GaXJlZCBqdXN0IGJlZm9yZSB0aGUgc2xpZGluZyBtZW51IGlzIGNsb3NlZC5bL2VuXVxuICogICBbamFd44K544Op44Kk44OH44Kj44Oz44Kw44Oh44OL44Ol44O844GM6ZaJ44GY44KL5YmN44Gr55m654Gr44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICogICBbZW5dRXZlbnQgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50LnNsaWRpbmdNZW51XG4gKiAgIFtlbl1TbGlkaW5nIG1lbnUgdmlldyBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn1NsaWRpbmdNZW5144Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBldmVudCBwb3N0Y2xvc2VcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRmlyZWQganVzdCBhZnRlciB0aGUgc2xpZGluZyBtZW51IGlzIGNsb3NlZC5bL2VuXVxuICogICBbamFd44K544Op44Kk44OH44Kj44Oz44Kw44Oh44OL44Ol44O844GM6ZaJ44GY57WC44KP44Gj44Gf5b6M44Gr55m654Gr44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICogICBbZW5dRXZlbnQgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50LnNsaWRpbmdNZW51XG4gKiAgIFtlbl1TbGlkaW5nIG1lbnUgdmlldyBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn1NsaWRpbmdNZW5144Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIHNsaWRpbmcgbWVudS5bL2VuXVxuICogIFtqYV3jgZPjga7jgrnjg6njgqTjg4fjgqPjg7PjgrDjg6Hjg4vjg6Xjg7zjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lkI3liY3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBtZW51LXBhZ2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVGhlIHVybCBvZiB0aGUgbWVudSBwYWdlLlsvZW5dXG4gKiAgIFtqYV3lt6bjgavkvY3nva7jgZnjgovjg6Hjg4vjg6Xjg7zjg5rjg7zjgrjjga5VUkzjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBtYWluLXBhZ2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVGhlIHVybCBvZiB0aGUgbWFpbiBwYWdlLlsvZW5dXG4gKiAgIFtqYV3lj7PjgavkvY3nva7jgZnjgovjg6HjgqTjg7Pjg5rjg7zjgrjjga5VUkzjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBzd2lwZWFibGVcbiAqIEBpbml0b25seVxuICogQHR5cGUge0Jvb2xlYW59XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVdoZXRoZXIgdG8gZW5hYmxlIHN3aXBlIGludGVyYWN0aW9uLlsvZW5dXG4gKiAgIFtqYV3jgrnjg6/jgqTjg5fmk43kvZzjgpLmnInlirnjgavjgZnjgovloLTlkIjjgavmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBzd2lwZS10YXJnZXQtd2lkdGhcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVGhlIHdpZHRoIG9mIHN3aXBlYWJsZSBhcmVhIGNhbGN1bGF0ZWQgZnJvbSB0aGUgbGVmdCAoaW4gcGl4ZWxzKS4gVXNlIHRoaXMgdG8gZW5hYmxlIHN3aXBlIG9ubHkgd2hlbiB0aGUgZmluZ2VyIHRvdWNoIG9uIHRoZSBzY3JlZW4gZWRnZS5bL2VuXVxuICogICBbamFd44K544Ov44Kk44OX44Gu5Yik5a6a6aCY5Z+f44KS44OU44Kv44K744Or5Y2Y5L2N44Gn5oyH5a6a44GX44G+44GZ44CC55S76Z2i44Gu56uv44GL44KJ5oyH5a6a44GX44Gf6Led6Zui44Gr6YGU44GZ44KL44Go44Oa44O844K444GM6KGo56S644GV44KM44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgbWF4LXNsaWRlLWRpc3RhbmNlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUhvdyBmYXIgdGhlIG1lbnUgcGFnZSB3aWxsIHNsaWRlIG9wZW4uIENhbiBzcGVjaWZ5IGJvdGggaW4gcHggYW5kICUuIGVnLiA5MCUsIDIwMHB4Wy9lbl1cbiAqICAgW2phXW1lbnUtcGFnZeOBp+aMh+WumuOBleOCjOOBn+ODmuODvOOCuOOBruihqOekuuW5heOCkuaMh+WumuOBl+OBvuOBmeOAguODlOOCr+OCu+ODq+OCguOBl+OBj+OBryXjga7kuKHmlrnjgafmjIflrprjgafjgY3jgb7jgZnvvIjkvos6IDkwJSwgMjAwcHjvvIlbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBzaWRlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVNwZWNpZnkgd2hpY2ggc2lkZSBvZiB0aGUgc2NyZWVuIHRoZSBtZW51IHBhZ2UgaXMgbG9jYXRlZCBvbi4gUG9zc2libGUgdmFsdWVzIGFyZSBcImxlZnRcIiBhbmQgXCJyaWdodFwiLlsvZW5dXG4gKiAgIFtqYV1tZW51LXBhZ2XjgafmjIflrprjgZXjgozjgZ/jg5rjg7zjgrjjgYznlLvpnaLjga7jganjgaHjgonlgbTjgYvjgonooajnpLrjgZXjgozjgovjgYvjgpLmjIflrprjgZfjgb7jgZnjgIJsZWZ044KC44GX44GP44GvcmlnaHTjga7jgYTjgZrjgozjgYvjgpLmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB0eXBlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVNsaWRpbmcgbWVudSBhbmltYXRvci4gUG9zc2libGUgdmFsdWVzIGFyZSByZXZlYWwgKGRlZmF1bHQpLCBwdXNoIGFuZCBvdmVybGF5LlsvZW5dXG4gKiAgIFtqYV3jgrnjg6njgqTjg4fjgqPjg7PjgrDjg6Hjg4vjg6Xjg7zjga7jgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgafjgZnjgIJcInJldmVhbFwi77yI44OH44OV44Kp44Or44OI77yJ44CBXCJwdXNoXCLjgIFcIm92ZXJsYXlcIuOBruOBhOOBmuOCjOOBi+OCkuaMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVvcGVuXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVvcGVuXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVvcGVuXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlY2xvc2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZWNsb3NlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVjbG9zZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RvcGVuXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0b3BlblwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdG9wZW5cIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0Y2xvc2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInBvc3RjbG9zZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdGNsb3NlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaW5pdFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJpbml0XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJpbml0XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtc2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJzaG93XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJkZXN0cm95XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJkZXN0cm95XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBzZXRNYWluUGFnZVxuICogQHNpZ25hdHVyZSBzZXRNYWluUGFnZShwYWdlVXJsLCBbb3B0aW9uc10pXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFnZVVybFxuICogICBbZW5dUGFnZSBVUkwuIENhbiBiZSBlaXRoZXIgYW4gSFRNTCBkb2N1bWVudCBvciBhbiA8Y29kZT4mbHQ7b25zLXRlbXBsYXRlJmd0OzwvY29kZT4uWy9lbl1cbiAqICAgW2phXXBhZ2Xjga5VUkzjgYvjgIFvbnMtdGVtcGxhdGXjgaflrqPoqIDjgZfjgZ/jg4bjg7Pjg5fjg6zjg7zjg4jjga5pZOWxnuaAp+OBruWApOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiAgIFtlbl1QYXJhbWV0ZXIgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqrjg5fjgrfjg6fjg7PjgpLmjIflrprjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4jjgIJbL2phXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jbG9zZU1lbnVdXG4gKiAgIFtlbl1JZiB0cnVlIHRoZSBtZW51IHdpbGwgYmUgY2xvc2VkLlsvZW5dXG4gKiAgIFtqYV10cnVl44KS5oyH5a6a44GZ44KL44Go44CB6ZaL44GE44Gm44GE44KL44Oh44OL44Ol44O844KS6ZaJ44GY44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmNhbGxiYWNrXVxuICogICBbZW5dRnVuY3Rpb24gdGhhdCBpcyBleGVjdXRlZCBhZnRlciB0aGUgcGFnZSBoYXMgYmVlbiBzZXQuWy9lbl1cbiAqICAgW2phXeODmuODvOOCuOOBjOiqreOBv+i+vOOBvuOCjOOBn+W+jOOBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVNob3cgdGhlIHBhZ2Ugc3BlY2lmaWVkIGluIHBhZ2VVcmwgaW4gdGhlIG1haW4gY29udGVudHMgcGFuZS5bL2VuXVxuICogICBbamFd5Lit5aSu6YOo5YiG44Gr6KGo56S644GV44KM44KL44Oa44O844K444KScGFnZVVybOOBq+aMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIHNldE1lbnVQYWdlXG4gKiBAc2lnbmF0dXJlIHNldE1lbnVQYWdlKHBhZ2VVcmwsIFtvcHRpb25zXSlcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYWdlVXJsXG4gKiAgIFtlbl1QYWdlIFVSTC4gQ2FuIGJlIGVpdGhlciBhbiBIVE1MIGRvY3VtZW50IG9yIGFuIDxjb2RlPiZsdDtvbnMtdGVtcGxhdGUmZ3Q7PC9jb2RlPi5bL2VuXVxuICogICBbamFdcGFnZeOBrlVSTOOBi+OAgW9ucy10ZW1wbGF0ZeOBp+Wuo+iogOOBl+OBn+ODhuODs+ODl+ODrOODvOODiOOBrmlk5bGe5oCn44Gu5YCk44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqICAgW2VuXVBhcmFtZXRlciBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCquODl+OCt+ODp+ODs+OCkuaMh+WumuOBmeOCi+OCquODluOCuOOCp+OCr+ODiOOAglsvamFdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNsb3NlTWVudV1cbiAqICAgW2VuXUlmIHRydWUgdGhlIG1lbnUgd2lsbCBiZSBjbG9zZWQgYWZ0ZXIgdGhlIG1lbnUgcGFnZSBoYXMgYmVlbiBzZXQuWy9lbl1cbiAqICAgW2phXXRydWXjgpLmjIflrprjgZnjgovjgajjgIHplovjgYTjgabjgYTjgovjg6Hjg4vjg6Xjg7zjgpLplonjgZjjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuY2FsbGJhY2tdXG4gKiAgIFtlbl1UaGlzIGZ1bmN0aW9uIHdpbGwgYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIG1lbnUgcGFnZSBoYXMgYmVlbiBzZXQuWy9lbl1cbiAqICAgW2phXeODoeODi+ODpeODvOODmuODvOOCuOOBjOiqreOBv+i+vOOBvuOCjOOBn+W+jOOBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVNob3cgdGhlIHBhZ2Ugc3BlY2lmaWVkIGluIHBhZ2VVcmwgaW4gdGhlIHNpZGUgbWVudSBwYW5lLlsvZW5dXG4gKiAgIFtqYV3jg6Hjg4vjg6Xjg7zpg6jliIbjgavooajnpLrjgZXjgozjgovjg5rjg7zjgrjjgpJwYWdlVXJs44Gr5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb3Blbk1lbnVcbiAqIEBzaWduYXR1cmUgb3Blbk1lbnUoW29wdGlvbnNdKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogICBbZW5dUGFyYW1ldGVyIG9iamVjdC5bL2VuXVxuICogICBbamFd44Kq44OX44K344On44Oz44KS5oyH5a6a44GZ44KL44Kq44OW44K444Kn44Kv44OI44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmNhbGxiYWNrXVxuICogICBbZW5dVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciB0aGUgbWVudSBoYXMgYmVlbiBvcGVuZWQuWy9lbl1cbiAqICAgW2phXeODoeODi+ODpeODvOOBjOmWi+OBhOOBn+W+jOOBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVNsaWRlIHRoZSBhYm92ZSBsYXllciB0byByZXZlYWwgdGhlIGxheWVyIGJlaGluZC5bL2VuXVxuICogICBbamFd44Oh44OL44Ol44O844Oa44O844K444KS6KGo56S644GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2QgY2xvc2VNZW51XG4gKiBAc2lnbmF0dXJlIGNsb3NlTWVudShbb3B0aW9uc10pXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiAgIFtlbl1QYXJhbWV0ZXIgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqrjg5fjgrfjg6fjg7PjgpLmjIflrprjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4jjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuY2FsbGJhY2tdXG4gKiAgIFtlbl1UaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHRoZSBtZW51IGhhcyBiZWVuIGNsb3NlZC5bL2VuXVxuICogICBbamFd44Oh44OL44Ol44O844GM6ZaJ44GY44KJ44KM44Gf5b6M44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dU2xpZGUgdGhlIGFib3ZlIGxheWVyIHRvIGhpZGUgdGhlIGxheWVyIGJlaGluZC5bL2VuXVxuICogICBbamFd44Oh44OL44Ol44O844Oa44O844K444KS6Z2e6KGo56S644Gr44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2QgdG9nZ2xlTWVudVxuICogQHNpZ25hdHVyZSB0b2dnbGVNZW51KFtvcHRpb25zXSlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqICAgW2VuXVBhcmFtZXRlciBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCquODl+OCt+ODp+ODs+OCkuaMh+WumuOBmeOCi+OCquODluOCuOOCp+OCr+ODiOOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5jYWxsYmFja11cbiAqICAgW2VuXVRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIG1lbnUgaGFzIGJlZW4gb3BlbmVkIG9yIGNsb3NlZC5bL2VuXVxuICogICBbamFd44Oh44OL44Ol44O844GM6ZaL44GN57WC44KP44Gj44Gf5b6M44GL44CB6ZaJ44GY57WC44KP44Gj44Gf5b6M44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dU2xpZGUgdGhlIGFib3ZlIGxheWVyIHRvIHJldmVhbCB0aGUgbGF5ZXIgYmVoaW5kIGlmIGl0IGlzIGN1cnJlbnRseSBoaWRkZW4sIG90aGVyd2lzZSwgaGlkZSB0aGUgbGF5ZXIgYmVoaW5kLlsvZW5dXG4gKiAgIFtqYV3nj77lnKjjga7nirbms4HjgavlkIjjgo/jgZvjgabjgIHjg6Hjg4vjg6Xjg7zjg5rjg7zjgrjjgpLooajnpLrjgoLjgZfjgY/jga/pnZ7ooajnpLrjgavjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBpc01lbnVPcGVuZWRcbiAqIEBzaWduYXR1cmUgaXNNZW51T3BlbmVkKClcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiAgIFtlbl10cnVlIGlmIHRoZSBtZW51IGlzIGN1cnJlbnRseSBvcGVuLlsvZW5dXG4gKiAgIFtqYV3jg6Hjg4vjg6Xjg7zjgYzplovjgYTjgabjgYTjgozjgbB0cnVl44Go44Gq44KK44G+44GZ44CCWy9qYV1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dUmV0dXJucyB0cnVlIGlmIHRoZSBtZW51IHBhZ2UgaXMgb3Blbiwgb3RoZXJ3aXNlIGZhbHNlLlsvZW5dXG4gKiAgIFtqYV3jg6Hjg4vjg6Xjg7zjg5rjg7zjgrjjgYzplovjgYTjgabjgYTjgovloLTlkIjjga90cnVl44CB44Gd44GG44Gn44Gq44GE5aC05ZCI44GvZmFsc2XjgpLov5TjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBnZXREZXZpY2VCYWNrQnV0dG9uSGFuZGxlclxuICogQHNpZ25hdHVyZSBnZXREZXZpY2VCYWNrQnV0dG9uSGFuZGxlcigpXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiAgIFtlbl1EZXZpY2UgYmFjayBidXR0b24gaGFuZGxlci5bL2VuXVxuICogICBbamFd44OH44OQ44Kk44K544Gu44OQ44OD44Kv44Oc44K/44Oz44OP44Oz44OJ44Op44KS6L+U44GX44G+44GZ44CCWy9qYV1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dUmV0cmlldmUgdGhlIGJhY2stYnV0dG9uIGhhbmRsZXIuWy9lbl1cbiAqICAgW2phXW9ucy1zbGlkaW5nLW1lbnXjgavntJDku5jjgYTjgabjgYTjgovjg5Djg4Pjgq/jg5zjgr/jg7Pjg4/jg7Pjg4njg6njgpLlj5blvpfjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBzZXRTd2lwZWFibGVcbiAqIEBzaWduYXR1cmUgc2V0U3dpcGVhYmxlKHN3aXBlYWJsZSlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc3dpcGVhYmxlXG4gKiAgIFtlbl1JZiB0cnVlIHRoZSBtZW51IHdpbGwgYmUgc3dpcGVhYmxlLlsvZW5dXG4gKiAgIFtqYV3jgrnjg6/jgqTjg5fjgafplovplonjgafjgY3jgovjgojjgYbjgavjgZnjgovloLTlkIjjgavjga90cnVl44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dU3BlY2lmeSBpZiB0aGUgbWVudSBzaG91bGQgYmUgc3dpcGVhYmxlIG9yIG5vdC5bL2VuXVxuICogICBbamFd44K544Ov44Kk44OX44Gn6ZaL6ZaJ44GZ44KL44GL44Gp44GG44GL44KS6Kit5a6a44GZ44KL44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25cbiAqIEBzaWduYXR1cmUgb24oZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOBk+OBruOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uY2VcbiAqIEBzaWduYXR1cmUgb25jZShldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lciB0aGF0J3Mgb25seSB0cmlnZ2VyZWQgb25jZS5bL2VuXVxuICogIFtqYV3kuIDluqbjgaDjgZHlkbzjgbPlh7rjgZXjgozjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9mZlxuICogQHNpZ25hdHVyZSBvZmYoZXZlbnROYW1lLCBbbGlzdGVuZXJdKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXVJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci4gSWYgdGhlIGxpc3RlbmVyIGlzIG5vdCBzcGVjaWZpZWQgYWxsIGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50IHR5cGUgd2lsbCBiZSByZW1vdmVkLlsvZW5dXG4gKiAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkuWJiumZpOOBl+OBvuOBmeOAguOCguOBl+OCpOODmeODs+ODiOODquOCueODiuODvOOCkuaMh+WumuOBl+OBquOBi+OBo+OBn+WgtOWQiOOBq+OBr+OAgeOBneOBruOCpOODmeODs+ODiOOBq+e0kOOBpeOBj+WFqOOBpuOBruOCpOODmeODs+ODiOODquOCueODiuODvOOBjOWJiumZpOOBleOCjOOBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd5YmK6Zmk44GZ44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIG1vZHVsZS5kaXJlY3RpdmUoJ29uc1NsaWRpbmdNZW51JywgZnVuY3Rpb24oJGNvbXBpbGUsIFNsaWRpbmdNZW51VmlldywgJG9uc2VuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcblxuICAgICAgLy8gTk9URTogVGhpcyBlbGVtZW50IG11c3QgY29leGlzdHMgd2l0aCBuZy1jb250cm9sbGVyLlxuICAgICAgLy8gRG8gbm90IHVzZSBpc29sYXRlZCBzY29wZSBhbmQgdGVtcGxhdGUncyBuZy10cmFuc2NsdWRlLlxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgICBzY29wZTogdHJ1ZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgb25zLl91dGlsLndhcm4oJ1xcJ29ucy1zbGlkaW5nLW1lbnVcXCcgY29tcG9uZW50IGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCByZWxlYXNlLiBQbGVhc2UgdXNlIFxcJ29ucy1zcGxpdHRlclxcJyBpbnN0ZWFkLicpO1xuXG4gICAgICAgIHZhciBtYWluID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcubWFpbicpLFxuICAgICAgICAgICAgbWVudSA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcblxuICAgICAgICBpZiAobWFpbikge1xuICAgICAgICAgIHZhciBtYWluSHRtbCA9IGFuZ3VsYXIuZWxlbWVudChtYWluKS5yZW1vdmUoKS5odG1sKCkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lbnUpIHtcbiAgICAgICAgICB2YXIgbWVudUh0bWwgPSBhbmd1bGFyLmVsZW1lbnQobWVudSkucmVtb3ZlKCkuaHRtbCgpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZChhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ29uc2VuLXNsaWRpbmctbWVudV9fbWVudScpKTtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZChhbmd1bGFyLmVsZW1lbnQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ29uc2VuLXNsaWRpbmctbWVudV9fbWFpbicpKTtcblxuICAgICAgICAgIHZhciBzbGlkaW5nTWVudSA9IG5ldyBTbGlkaW5nTWVudVZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgICRvbnNlbi5yZWdpc3RlckV2ZW50SGFuZGxlcnMoc2xpZGluZ01lbnUsICdwcmVvcGVuIHByZWNsb3NlIHBvc3RvcGVuIHBvc3RjbG9zZSBpbml0IHNob3cgaGlkZSBkZXN0cm95Jyk7XG5cbiAgICAgICAgICBpZiAobWFpbkh0bWwgJiYgIWF0dHJzLm1haW5QYWdlKSB7XG4gICAgICAgICAgICBzbGlkaW5nTWVudS5fYXBwZW5kTWFpblBhZ2UobnVsbCwgbWFpbkh0bWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtZW51SHRtbCAmJiAhYXR0cnMubWVudVBhZ2UpIHtcbiAgICAgICAgICAgIHNsaWRpbmdNZW51Ll9hcHBlbmRNZW51UGFnZShtZW51SHRtbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJG9uc2VuLmRlY2xhcmVWYXJBdHRyaWJ1dGUoYXR0cnMsIHNsaWRpbmdNZW51KTtcbiAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1zbGlkaW5nLW1lbnUnLCBzbGlkaW5nTWVudSk7XG5cbiAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNsaWRpbmdNZW51Ll9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1zbGlkaW5nLW1lbnUnLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmZhY3RvcnkoJ1NsaWRpbmdNZW51QW5pbWF0b3InLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ2xhc3MuZXh0ZW5kKHtcblxuICAgICAgZGVsYXk6IDAsXG4gICAgICBkdXJhdGlvbjogMC40LFxuICAgICAgdGltaW5nOiAnY3ViaWMtYmV6aWVyKC4xLCAuNywgLjEsIDEpJyxcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudGltaW5nXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kdXJhdGlvblxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZGVsYXlcbiAgICAgICAqL1xuICAgICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLnRpbWluZyA9IG9wdGlvbnMudGltaW5nIHx8IHRoaXMudGltaW5nO1xuICAgICAgICB0aGlzLmR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5kdXJhdGlvbiA6IHRoaXMuZHVyYXRpb247XG4gICAgICAgIHRoaXMuZGVsYXkgPSBvcHRpb25zLmRlbGF5ICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmRlbGF5IDogdGhpcy5kZWxheTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtqcUxpdGV9IGVsZW1lbnQgXCJvbnMtc2xpZGluZy1tZW51XCIgb3IgXCJvbnMtc3BsaXQtdmlld1wiIGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7anFMaXRlfSBtYWluUGFnZVxuICAgICAgICogQHBhcmFtIHtqcUxpdGV9IG1lbnVQYWdlXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMud2lkdGggXCJ3aWR0aFwiIHN0eWxlIHZhbHVlXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuaXNSaWdodFxuICAgICAgICovXG4gICAgICBzZXR1cDogZnVuY3Rpb24oZWxlbWVudCwgbWFpblBhZ2UsIG1lbnVQYWdlLCBvcHRpb25zKSB7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuaXNSaWdodFxuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLmlzT3BlbmVkXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy53aWR0aFxuICAgICAgICovXG4gICAgICBvblJlc2l6ZWQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAqL1xuICAgICAgb3Blbk1lbnU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICAgKi9cbiAgICAgIGNsb3NlQ2xvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqL1xuICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5kaXN0YW5jZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubWF4RGlzdGFuY2VcbiAgICAgICAqL1xuICAgICAgdHJhbnNsYXRlTWVudTogZnVuY3Rpb24obWFpblBhZ2UsIG1lbnVQYWdlLCBvcHRpb25zKSB7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge1NsaWRpbmdNZW51QW5pbWF0b3J9XG4gICAgICAgKi9cbiAgICAgIGNvcHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ092ZXJyaWRlIGNvcHkgbWV0aG9kLicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pKCk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1zcGVlZC1kaWFsXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIHZhclxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1WYXJpYWJsZSBuYW1lIHRvIHJlZmVyIHRoZSBzcGVlZCBkaWFsLlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jgrnjg5Tjg7zjg4njg4DjgqTjgqLjg6vjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lpInmlbDlkI3jgpLjgZfjgabjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtb3BlblxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwib3BlblwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwib3Blblwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWNsb3NlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJjbG9zZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiY2xvc2VcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uY2VcbiAqIEBzaWduYXR1cmUgb25jZShldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lciB0aGF0J3Mgb25seSB0cmlnZ2VyZWQgb25jZS5bL2VuXVxuICogIFtqYV3kuIDluqbjgaDjgZHlkbzjgbPlh7rjgZXjgozjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9mZlxuICogQHNpZ25hdHVyZSBvZmYoZXZlbnROYW1lLCBbbGlzdGVuZXJdKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXVJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci4gSWYgdGhlIGxpc3RlbmVyIGlzIG5vdCBzcGVjaWZpZWQgYWxsIGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50IHR5cGUgd2lsbCBiZSByZW1vdmVkLlsvZW5dXG4gKiAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkuWJiumZpOOBl+OBvuOBmeOAguOCguOBl+OCpOODmeODs+ODiOODquOCueODiuODvOOBjOaMh+WumuOBleOCjOOBquOBi+OBo+OBn+WgtOWQiOOBq+OBr+OAgeOBneOBruOCpOODmeODs+ODiOOBq+e0kOS7mOOBhOOBpuOBhOOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOBjOWFqOOBpuWJiumZpOOBleOCjOOBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25cbiAqIEBzaWduYXR1cmUgb24oZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIG1vZHVsZS5kaXJlY3RpdmUoJ29uc1NwZWVkRGlhbCcsIGZ1bmN0aW9uKCRvbnNlbiwgU3BlZWREaWFsVmlldykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICBzY29wZTogZmFsc2UsXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgdmFyIHNwZWVkRGlhbCA9IG5ldyBTcGVlZERpYWxWaWV3KHNjb3BlLCBlbGVtZW50LCBhdHRycyk7XG5cbiAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1zcGVlZC1kaWFsJywgc3BlZWREaWFsKTtcblxuICAgICAgICAgICRvbnNlbi5yZWdpc3RlckV2ZW50SGFuZGxlcnMoc3BlZWREaWFsLCAnb3BlbiBjbG9zZScpO1xuICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCBzcGVlZERpYWwpO1xuXG4gICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3BlZWREaWFsLl9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1zcGVlZC1kaWFsJywgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgIH07XG4gIH0pO1xuXG59KSgpO1xuXG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1zcGxpdC12aWV3XG4gKiBAY2F0ZWdvcnkgY29udHJvbFxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXURpdmlkZXMgdGhlIHNjcmVlbiBpbnRvIGEgbGVmdCBhbmQgcmlnaHQgc2VjdGlvbi5bL2VuXVxuICogIFtqYV3nlLvpnaLjgpLlt6blj7PjgavliIblibLjgZnjgovjgrPjg7Pjg53jg7zjg43jg7Pjg4jjgafjgZnjgIJbL2phXVxuICogQGNvZGVwZW4gbktxZnYge3dpZGV9XG4gKiBAZ3VpZGUgVXNpbmdvbnNzcGxpdHZpZXdjb21wb25lbnRcbiAqICAgW2VuXVVzaW5nIG9ucy1zcGxpdC12aWV3LlsvZW5dXG4gKiAgIFtqYV1vbnMtc3BsaXQtdmlld+OCs+ODs+ODneODvOODjeODs+ODiOOCkuS9v+OBhlsvamFdXG4gKiBAZ3VpZGUgQ2FsbGluZ0NvbXBvbmVudEFQSXNmcm9tSmF2YVNjcmlwdFxuICogICBbZW5dVXNpbmcgbmF2aWdhdG9yIGZyb20gSmF2YVNjcmlwdFsvZW5dXG4gKiAgIFtqYV1KYXZhU2NyaXB044GL44KJ44Kz44Oz44Od44O844ON44Oz44OI44KS5ZG844Gz5Ye644GZWy9qYV1cbiAqIEBleGFtcGxlXG4gKiA8b25zLXNwbGl0LXZpZXdcbiAqICAgc2Vjb25kYXJ5LXBhZ2U9XCJzZWNvbmRhcnkuaHRtbFwiXG4gKiAgIG1haW4tcGFnZT1cIm1haW4uaHRtbFwiXG4gKiAgIG1haW4tcGFnZS13aWR0aD1cIjcwJVwiXG4gKiAgIGNvbGxhcHNlPVwicG9ydHJhaXRcIj5cbiAqIDwvb25zLXNwbGl0LXZpZXc+XG4gKi9cblxuLyoqXG4gKiBAZXZlbnQgdXBkYXRlXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUZpcmVkIHdoZW4gdGhlIHNwbGl0IHZpZXcgaXMgdXBkYXRlZC5bL2VuXVxuICogICBbamFdc3BsaXQgdmlld+OBrueKtuaFi+OBjOabtOaWsOOBleOCjOOBn+mam+OBq+eZuueBq+OBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAqICAgW2VuXUV2ZW50IG9iamVjdC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudC5zcGxpdFZpZXdcbiAqICAgW2VuXVNwbGl0IHZpZXcgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ9TcGxpdFZpZXfjgqrjg5bjgrjjgqfjgq/jg4jjgafjgZnjgIJbL2phXVxuICogQHBhcmFtIHtCb29sZWFufSBldmVudC5zaG91bGRDb2xsYXBzZVxuICogICBbZW5dVHJ1ZSBpZiB0aGUgdmlldyBzaG91bGQgY29sbGFwc2UuWy9lbl1cbiAqICAgW2phXWNvbGxhcHNl54q25oWL44Gu5aC05ZCI44GrdHJ1ZeOBq+OBquOCiuOBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQuY3VycmVudE1vZGVcbiAqICAgW2VuXUN1cnJlbnQgbW9kZS5bL2VuXVxuICogICBbamFd54++5Zyo44Gu44Oi44O844OJ5ZCN44KS6L+U44GX44G+44GZ44CCXCJjb2xsYXBzZVwi44GLXCJzcGxpdFwi44GL44Gu44GE44Ga44KM44GL44Gn44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGV2ZW50LnNwbGl0XG4gKiAgIFtlbl1DYWxsIHRvIGZvcmNlIHNwbGl0LlsvZW5dXG4gKiAgIFtqYV3jgZPjga7plqLmlbDjgpLlkbzjgbPlh7rjgZnjgajlvLfliLbnmoTjgatzcGxpdOODouODvOODieOBq+OBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBldmVudC5jb2xsYXBzZVxuICogICBbZW5dQ2FsbCB0byBmb3JjZSBjb2xsYXBzZS5bL2VuXVxuICogICBbamFd44GT44Gu6Zai5pWw44KS5ZG844Gz5Ye644GZ44Go5by35Yi255qE44GrY29sbGFwc2Xjg6Ljg7zjg4njgavjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtOdW1iZXJ9IGV2ZW50LndpZHRoXG4gKiAgIFtlbl1DdXJyZW50IHdpZHRoLlsvZW5dXG4gKiAgIFtqYV3nj77lnKjjga5TcGxpdFZpZXfjga7luYXjgpLov5TjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50Lm9yaWVudGF0aW9uXG4gKiAgIFtlbl1DdXJyZW50IG9yaWVudGF0aW9uLlsvZW5dXG4gKiAgIFtqYV3nj77lnKjjga7nlLvpnaLjga7jgqrjg6rjgqjjg7Pjg4bjg7zjgrfjg6fjg7PjgpLov5TjgZfjgb7jgZnjgIJcInBvcnRyYWl0XCLjgYvjgoLjgZfjgY/jga9cImxhbmRzY2FwZVwi44Gn44GZ44CCIFsvamFdXG4gKi9cblxuLyoqXG4gKiBAZXZlbnQgcHJlc3BsaXRcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRmlyZWQganVzdCBiZWZvcmUgdGhlIHZpZXcgaXMgc3BsaXQuWy9lbl1cbiAqICAgW2phXXNwbGl054q25oWL44Gr44KL5YmN44Gr55m654Gr44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICogICBbZW5dRXZlbnQgb2JqZWN0LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4jjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50LnNwbGl0Vmlld1xuICogICBbZW5dU3BsaXQgdmlldyBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn1NwbGl0Vmlld+OCquODluOCuOOCp+OCr+ODiOOBp+OBmeOAglsvamFdXG4gKiBAcGFyYW0ge051bWJlcn0gZXZlbnQud2lkdGhcbiAqICAgW2VuXUN1cnJlbnQgd2lkdGguWy9lbl1cbiAqICAgW2phXeePvuWcqOOBrlNwbGl0Vmlld27jga7luYXjgafjgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50Lm9yaWVudGF0aW9uXG4gKiAgIFtlbl1DdXJyZW50IG9yaWVudGF0aW9uLlsvZW5dXG4gKiAgIFtqYV3nj77lnKjjga7nlLvpnaLjga7jgqrjg6rjgqjjg7Pjg4bjg7zjgrfjg6fjg7PjgpLov5TjgZfjgb7jgZnjgIJcInBvcnRyYWl0XCLjgoLjgZfjgY/jga9cImxhbmRzY2FwZVwi44Gn44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBldmVudCBwb3N0c3BsaXRcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRmlyZWQganVzdCBhZnRlciB0aGUgdmlldyBpcyBzcGxpdC5bL2VuXVxuICogICBbamFdc3BsaXTnirbmhYvjgavjgarjgaPjgZ/lvozjgavnmbrngavjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gKiAgIFtlbl1FdmVudCBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiOOAglsvamFdXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQuc3BsaXRWaWV3XG4gKiAgIFtlbl1TcGxpdCB2aWV3IG9iamVjdC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44GfU3BsaXRWaWV344Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBldmVudC53aWR0aFxuICogICBbZW5dQ3VycmVudCB3aWR0aC5bL2VuXVxuICogICBbamFd54++5Zyo44GuU3BsaXRWaWV3buOBruW5heOBp+OBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQub3JpZW50YXRpb25cbiAqICAgW2VuXUN1cnJlbnQgb3JpZW50YXRpb24uWy9lbl1cbiAqICAgW2phXeePvuWcqOOBrueUu+mdouOBruOCquODquOCqOODs+ODhuODvOOCt+ODp+ODs+OCkui/lOOBl+OBvuOBmeOAglwicG9ydHJhaXRcIuOCguOBl+OBj+OBr1wibGFuZHNjYXBlXCLjgafjgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGV2ZW50IHByZWNvbGxhcHNlXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUZpcmVkIGp1c3QgYmVmb3JlIHRoZSB2aWV3IGlzIGNvbGxhcHNlZC5bL2VuXVxuICogICBbamFdY29sbGFwc2XnirbmhYvjgavjgarjgovliY3jgavnmbrngavjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gKiAgIFtlbl1FdmVudCBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiOOAglsvamFdXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQuc3BsaXRWaWV3XG4gKiAgIFtlbl1TcGxpdCB2aWV3IG9iamVjdC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44GfU3BsaXRWaWV344Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBldmVudC53aWR0aFxuICogICBbZW5dQ3VycmVudCB3aWR0aC5bL2VuXVxuICogICBbamFd54++5Zyo44GuU3BsaXRWaWV3buOBruW5heOBp+OBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQub3JpZW50YXRpb25cbiAqICAgW2VuXUN1cnJlbnQgb3JpZW50YXRpb24uWy9lbl1cbiAqICAgW2phXeePvuWcqOOBrueUu+mdouOBruOCquODquOCqOODs+ODhuODvOOCt+ODp+ODs+OCkui/lOOBl+OBvuOBmeOAglwicG9ydHJhaXRcIuOCguOBl+OBj+OBr1wibGFuZHNjYXBlXCLjgafjgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGV2ZW50IHBvc3Rjb2xsYXBzZVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1GaXJlZCBqdXN0IGFmdGVyIHRoZSB2aWV3IGlzIGNvbGxhcHNlZC5bL2VuXVxuICogICBbamFdY29sbGFwc2XnirbmhYvjgavjgarjgaPjgZ/lvozjgavnmbrngavjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gKiAgIFtlbl1FdmVudCBvYmplY3QuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiOOAglsvamFdXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQuc3BsaXRWaWV3XG4gKiAgIFtlbl1TcGxpdCB2aWV3IG9iamVjdC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44GfU3BsaXRWaWV344Kq44OW44K444Kn44Kv44OI44Gn44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7TnVtYmVyfSBldmVudC53aWR0aFxuICogICBbZW5dQ3VycmVudCB3aWR0aC5bL2VuXVxuICogICBbamFd54++5Zyo44GuU3BsaXRWaWV3buOBruW5heOBp+OBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQub3JpZW50YXRpb25cbiAqICAgW2VuXUN1cnJlbnQgb3JpZW50YXRpb24uWy9lbl1cbiAqICAgW2phXeePvuWcqOOBrueUu+mdouOBruOCquODquOCqOODs+ODhuODvOOCt+ODp+ODs+OCkui/lOOBl+OBvuOBmeOAglwicG9ydHJhaXRcIuOCguOBl+OBj+OBr1wibGFuZHNjYXBlXCLjgafjgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB2YXJcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIHNwbGl0IHZpZXcuWy9lbl1cbiAqICAgW2phXeOBk+OBruOCueODl+ODquODg+ODiOODk+ODpeODvOOCs+ODs+ODneODvOODjeODs+ODiOOCkuWPgueFp+OBmeOCi+OBn+OCgeOBruWQjeWJjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG1haW4tcGFnZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1UaGUgdXJsIG9mIHRoZSBwYWdlIG9uIHRoZSByaWdodC5bL2VuXVxuICogICBbamFd5Y+z5YG044Gr6KGo56S644GZ44KL44Oa44O844K444GuVVJM44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgbWFpbi1wYWdlLXdpZHRoXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXU1haW4gcGFnZSB3aWR0aCBwZXJjZW50YWdlLiBUaGUgc2Vjb25kYXJ5IHBhZ2Ugd2lkdGggd2lsbCBiZSB0aGUgcmVtYWluaW5nIHBlcmNlbnRhZ2UuWy9lbl1cbiAqICAgW2phXeWPs+WBtOOBruODmuODvOOCuOOBruW5heOCkuODkeODvOOCu+ODs+ODiOWNmOS9jeOBp+aMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIHNlY29uZGFyeS1wYWdlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVRoZSB1cmwgb2YgdGhlIHBhZ2Ugb24gdGhlIGxlZnQuWy9lbl1cbiAqICAgW2phXeW3puWBtOOBq+ihqOekuuOBmeOCi+ODmuODvOOCuOOBrlVSTOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIGNvbGxhcHNlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVxuICogICAgIFNwZWNpZnkgdGhlIGNvbGxhcHNlIGJlaGF2aW9yLiBWYWxpZCB2YWx1ZXMgYXJlIHBvcnRyYWl0LCBsYW5kc2NhcGUsIHdpZHRoICNweCBvciBhIG1lZGlhIHF1ZXJ5LlxuICogICAgIFwicG9ydHJhaXRcIiBvciBcImxhbmRzY2FwZVwiIG1lYW5zIHRoZSB2aWV3IHdpbGwgY29sbGFwc2Ugd2hlbiBkZXZpY2UgaXMgaW4gbGFuZHNjYXBlIG9yIHBvcnRyYWl0IG9yaWVudGF0aW9uLlxuICogICAgIFwid2lkdGggI3B4XCIgbWVhbnMgdGhlIHZpZXcgd2lsbCBjb2xsYXBzZSB3aGVuIHRoZSB3aW5kb3cgd2lkdGggaXMgc21hbGxlciB0aGFuIHRoZSBzcGVjaWZpZWQgI3B4LlxuICogICAgIElmIHRoZSB2YWx1ZSBpcyBhIG1lZGlhIHF1ZXJ5LCB0aGUgdmlldyB3aWxsIGNvbGxhcHNlIHdoZW4gdGhlIG1lZGlhIHF1ZXJ5IGlzIHRydWUuXG4gKiAgIFsvZW5dXG4gKiAgIFtqYV1cbiAqICAgICDlt6blgbTjga7jg5rjg7zjgrjjgpLpnZ7ooajnpLrjgavjgZnjgovmnaHku7bjgpLmjIflrprjgZfjgb7jgZnjgIJwb3J0cmFpdCwgbGFuZHNjYXBl44CBd2lkdGggI3B444KC44GX44GP44Gv44Oh44OH44Kj44Ki44Kv44Ko44Oq44Gu5oyH5a6a44GM5Y+v6IO944Gn44GZ44CCXG4gKiAgICAgcG9ydHJhaXTjgoLjgZfjgY/jga9sYW5kc2NhcGXjgpLmjIflrprjgZnjgovjgajjgIHjg4fjg5DjgqTjgrnjga7nlLvpnaLjgYznuKblkJHjgY3jgoLjgZfjgY/jga/mqKrlkJHjgY3jgavjgarjgaPjgZ/mmYLjgavpgannlKjjgZXjgozjgb7jgZnjgIJcbiAqICAgICB3aWR0aCAjcHjjgpLmjIflrprjgZnjgovjgajjgIHnlLvpnaLjgYzmjIflrprjgZfjgZ/mqKrluYXjgojjgorjgoLnn63jgYTloLTlkIjjgavpgannlKjjgZXjgozjgb7jgZnjgIJcbiAqICAgICDjg6Hjg4fjgqPjgqLjgq/jgqjjg6rjgpLmjIflrprjgZnjgovjgajjgIHmjIflrprjgZfjgZ/jgq/jgqjjg6rjgavpganlkIjjgZfjgabjgYTjgovloLTlkIjjgavpgannlKjjgZXjgozjgb7jgZnjgIJcbiAqICAgWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXVwZGF0ZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwidXBkYXRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJ1cGRhdGVcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVzcGxpdFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicHJlc3BsaXRcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInByZXNwbGl0XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlY29sbGFwc2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZWNvbGxhcHNlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVjb2xsYXBzZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RzcGxpdFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicG9zdHNwbGl0XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwb3N0c3BsaXRcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0Y29sbGFwc2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInBvc3Rjb2xsYXBzZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdGNvbGxhcHNlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaW5pdFxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJpbml0XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJpbml0XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtc2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJzaG93XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaGlkZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJoaWRlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gYSBwYWdlJ3MgXCJkZXN0cm95XCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFd44Oa44O844K444GuXCJkZXN0cm95XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBzZXRNYWluUGFnZVxuICogQHNpZ25hdHVyZSBzZXRNYWluUGFnZShwYWdlVXJsKVxuICogQHBhcmFtIHtTdHJpbmd9IHBhZ2VVcmxcbiAqICAgW2VuXVBhZ2UgVVJMLiBDYW4gYmUgZWl0aGVyIGFuIEhUTUwgZG9jdW1lbnQgb3IgYW4gPG9ucy10ZW1wbGF0ZT4uWy9lbl1cbiAqICAgW2phXXBhZ2Xjga5VUkzjgYvjgIFvbnMtdGVtcGxhdGXjgaflrqPoqIDjgZfjgZ/jg4bjg7Pjg5fjg6zjg7zjg4jjga5pZOWxnuaAp+OBruWApOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVNob3cgdGhlIHBhZ2Ugc3BlY2lmaWVkIGluIHBhZ2VVcmwgaW4gdGhlIHJpZ2h0IHNlY3Rpb25bL2VuXVxuICogICBbamFd5oyH5a6a44GX44GfVVJM44KS44Oh44Kk44Oz44Oa44O844K444KS6Kqt44G/6L6844G/44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgc2V0U2Vjb25kYXJ5UGFnZVxuICogQHNpZ25hdHVyZSBzZXRTZWNvbmRhcnlQYWdlKHBhZ2VVcmwpXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFnZVVybFxuICogICBbZW5dUGFnZSBVUkwuIENhbiBiZSBlaXRoZXIgYW4gSFRNTCBkb2N1bWVudCBvciBhbiA8b25zLXRlbXBsYXRlPi5bL2VuXVxuICogICBbamFdcGFnZeOBrlVSTOOBi+OAgW9ucy10ZW1wbGF0ZeOBp+Wuo+iogOOBl+OBn+ODhuODs+ODl+ODrOODvOODiOOBrmlk5bGe5oCn44Gu5YCk44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dU2hvdyB0aGUgcGFnZSBzcGVjaWZpZWQgaW4gcGFnZVVybCBpbiB0aGUgbGVmdCBzZWN0aW9uWy9lbl1cbiAqICAgW2phXeaMh+WumuOBl+OBn1VSTOOCkuW3puOBruODmuODvOOCuOOBruiqreOBv+i+vOOBv+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIHVwZGF0ZVxuICogQHNpZ25hdHVyZSB1cGRhdGUoKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1UcmlnZ2VyIGFuICd1cGRhdGUnIGV2ZW50IGFuZCB0cnkgdG8gZGV0ZXJtaW5lIGlmIHRoZSBzcGxpdCBiZWhhdmlvciBzaG91bGQgYmUgY2hhbmdlZC5bL2VuXVxuICogICBbamFdc3BsaXTjg6Ljg7zjg4njgpLlpInjgYjjgovjgbnjgY3jgYvjganjgYbjgYvjgpLliKTmlq3jgZnjgovjgZ/jgoHjga4ndXBkYXRlJ+OCpOODmeODs+ODiOOCkueZuueBq+OBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uXG4gKiBAc2lnbmF0dXJlIG9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lci5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvbmNlXG4gKiBAc2lnbmF0dXJlIG9uY2UoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCdzIG9ubHkgdHJpZ2dlcmVkIG9uY2UuWy9lbl1cbiAqICBbamFd5LiA5bqm44Gg44GR5ZG844Gz5Ye644GV44KM44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvZmZcbiAqIEBzaWduYXR1cmUgb2ZmKGV2ZW50TmFtZSwgW2xpc3RlbmVyXSlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1SZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuIElmIHRoZSBsaXN0ZW5lciBpcyBub3Qgc3BlY2lmaWVkIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudCB0eXBlIHdpbGwgYmUgcmVtb3ZlZC5bL2VuXVxuICogIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLliYrpmaTjgZfjgb7jgZnjgILjgoLjgZfjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgarjgYvjgaPjgZ/loLTlkIjjgavjga/jgIHjgZ3jga7jgqTjg5njg7Pjg4jjgavntJDjgaXjgY/lhajjgabjga7jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzliYrpmaTjgZXjgozjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeWJiumZpOOBmeOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKTtcblxuICBtb2R1bGUuZGlyZWN0aXZlKCdvbnNTcGxpdFZpZXcnLCBmdW5jdGlvbigkY29tcGlsZSwgU3BsaXRWaWV3LCAkb25zZW4pIHtcblxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuXG4gICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuICAgICAgICBvbnMuX3V0aWwud2FybignXFwnb25zLXNwbGl0LXZpZXdcXCcgY29tcG9uZW50IGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCByZWxlYXNlLiBQbGVhc2UgdXNlIFxcJ29ucy1zcGxpdHRlclxcJyBpbnN0ZWFkLicpO1xuXG4gICAgICAgIHZhciBtYWluUGFnZSA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLm1haW4tcGFnZScpLFxuICAgICAgICAgICAgc2Vjb25kYXJ5UGFnZSA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLnNlY29uZGFyeS1wYWdlJyk7XG5cbiAgICAgICAgaWYgKG1haW5QYWdlKSB7XG4gICAgICAgICAgdmFyIG1haW5IdG1sID0gYW5ndWxhci5lbGVtZW50KG1haW5QYWdlKS5yZW1vdmUoKS5odG1sKCkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY29uZGFyeVBhZ2UpIHtcbiAgICAgICAgICB2YXIgc2Vjb25kYXJ5SHRtbCA9IGFuZ3VsYXIuZWxlbWVudChzZWNvbmRhcnlQYWdlKS5yZW1vdmUoKS5odG1sKCkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGFuZ3VsYXIuZWxlbWVudCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnb25zZW4tc3BsaXQtdmlld19fc2Vjb25kYXJ5IGZ1bGwtc2NyZWVuJykpO1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGFuZ3VsYXIuZWxlbWVudCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnb25zZW4tc3BsaXQtdmlld19fbWFpbiBmdWxsLXNjcmVlbicpKTtcblxuICAgICAgICAgIHZhciBzcGxpdFZpZXcgPSBuZXcgU3BsaXRWaWV3KHNjb3BlLCBlbGVtZW50LCBhdHRycyk7XG5cbiAgICAgICAgICBpZiAobWFpbkh0bWwgJiYgIWF0dHJzLm1haW5QYWdlKSB7XG4gICAgICAgICAgICBzcGxpdFZpZXcuX2FwcGVuZE1haW5QYWdlKG1haW5IdG1sKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2Vjb25kYXJ5SHRtbCAmJiAhYXR0cnMuc2Vjb25kYXJ5UGFnZSkge1xuICAgICAgICAgICAgc3BsaXRWaWV3Ll9hcHBlbmRTZWNvbmRQYWdlKHNlY29uZGFyeUh0bWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCBzcGxpdFZpZXcpO1xuICAgICAgICAgICRvbnNlbi5yZWdpc3RlckV2ZW50SGFuZGxlcnMoc3BsaXRWaWV3LCAndXBkYXRlIHByZXNwbGl0IHByZWNvbGxhcHNlIHBvc3RzcGxpdCBwb3N0Y29sbGFwc2UgaW5pdCBzaG93IGhpZGUgZGVzdHJveScpO1xuXG4gICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtc3BsaXQtdmlldycsIHNwbGl0Vmlldyk7XG5cbiAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzcGxpdFZpZXcuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLXNwbGl0LXZpZXcnLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5mYWN0b3J5KCdTcGxpdHRlckNvbnRlbnQnLCBmdW5jdGlvbigkb25zZW4sICRjb21waWxlKSB7XG5cbiAgICB2YXIgU3BsaXR0ZXJDb250ZW50ID0gQ2xhc3MuZXh0ZW5kKHtcblxuICAgICAgaW5pdDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLl9zY29wZSA9IHNjb3BlO1xuICAgICAgICB0aGlzLl9hdHRycyA9IGF0dHJzO1xuXG4gICAgICAgIHRoaXMubG9hZCA9IHRoaXMuX2VsZW1lbnRbMF0ubG9hZC5iaW5kKHRoaXMuX2VsZW1lbnRbMF0pO1xuICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgdGhpcy5fZGVzdHJveS5iaW5kKHRoaXMpKTtcbiAgICAgIH0sXG5cbiAgICAgIF9kZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZXN0cm95Jyk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLl9zY29wZSA9IHRoaXMuX2F0dHJzID0gdGhpcy5sb2FkID0gdGhpcy5fcGFnZVNjb3BlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIE1pY3JvRXZlbnQubWl4aW4oU3BsaXR0ZXJDb250ZW50KTtcbiAgICAkb25zZW4uZGVyaXZlUHJvcGVydGllc0Zyb21FbGVtZW50KFNwbGl0dGVyQ29udGVudCwgWydwYWdlJ10pO1xuXG4gICAgcmV0dXJuIFNwbGl0dGVyQ29udGVudDtcbiAgfSk7XG59KSgpO1xuIiwiLypcbkNvcHlyaWdodCAyMDEzLTIwMTUgQVNJQUwgQ09SUE9SQVRJT05cblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuKi9cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmZhY3RvcnkoJ1NwbGl0dGVyU2lkZScsIGZ1bmN0aW9uKCRvbnNlbiwgJGNvbXBpbGUpIHtcblxuICAgIHZhciBTcGxpdHRlclNpZGUgPSBDbGFzcy5leHRlbmQoe1xuXG4gICAgICBpbml0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuX3Njb3BlID0gc2NvcGU7XG4gICAgICAgIHRoaXMuX2F0dHJzID0gYXR0cnM7XG5cbiAgICAgICAgdGhpcy5fY2xlYXJEZXJpdmluZ01ldGhvZHMgPSAkb25zZW4uZGVyaXZlTWV0aG9kcyh0aGlzLCB0aGlzLl9lbGVtZW50WzBdLCBbXG4gICAgICAgICAgJ29wZW4nLCAnY2xvc2UnLCAndG9nZ2xlJywgJ2xvYWQnXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHRoaXMuX2NsZWFyRGVyaXZpbmdFdmVudHMgPSAkb25zZW4uZGVyaXZlRXZlbnRzKHRoaXMsIGVsZW1lbnRbMF0sIFtcbiAgICAgICAgICAnbW9kZWNoYW5nZScsICdwcmVvcGVuJywgJ3ByZWNsb3NlJywgJ3Bvc3RvcGVuJywgJ3Bvc3RjbG9zZSdcbiAgICAgICAgXSwgZGV0YWlsID0+IGRldGFpbC5zaWRlID8gYW5ndWxhci5leHRlbmQoZGV0YWlsLCB7c2lkZTogdGhpc30pIDogZGV0YWlsKTtcblxuICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgdGhpcy5fZGVzdHJveS5iaW5kKHRoaXMpKTtcbiAgICAgIH0sXG5cbiAgICAgIF9kZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkZXN0cm95Jyk7XG5cbiAgICAgICAgdGhpcy5fY2xlYXJEZXJpdmluZ01ldGhvZHMoKTtcbiAgICAgICAgdGhpcy5fY2xlYXJEZXJpdmluZ0V2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLl9zY29wZSA9IHRoaXMuX2F0dHJzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIE1pY3JvRXZlbnQubWl4aW4oU3BsaXR0ZXJTaWRlKTtcbiAgICAkb25zZW4uZGVyaXZlUHJvcGVydGllc0Zyb21FbGVtZW50KFNwbGl0dGVyU2lkZSwgWydwYWdlJywgJ21vZGUnLCAnaXNPcGVuJ10pO1xuXG4gICAgcmV0dXJuIFNwbGl0dGVyU2lkZTtcbiAgfSk7XG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtc3BsaXR0ZXJcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVZhcmlhYmxlIG5hbWUgdG8gcmVmZXIgdGhpcyBzcGxpdCB2aWV3LlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jgrnjg5fjg6rjg4Pjg4jjg5Pjg6Xjg7zjgrPjg7Pjg53jg7zjg43jg7Pjg4jjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lkI3liY3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwiZGVzdHJveVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiZGVzdHJveVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25cbiAqIEBzaWduYXR1cmUgb24oZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOBk+OBruOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uY2VcbiAqIEBzaWduYXR1cmUgb25jZShldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lciB0aGF0J3Mgb25seSB0cmlnZ2VyZWQgb25jZS5bL2VuXVxuICogIFtqYV3kuIDluqbjgaDjgZHlkbzjgbPlh7rjgZXjgozjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLov73liqDjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOOBjOeZuueBq+OBl+OBn+mam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9mZlxuICogQHNpZ25hdHVyZSBvZmYoZXZlbnROYW1lLCBbbGlzdGVuZXJdKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXVJlbW92ZSBhbiBldmVudCBsaXN0ZW5lci4gSWYgdGhlIGxpc3RlbmVyIGlzIG5vdCBzcGVjaWZpZWQgYWxsIGxpc3RlbmVycyBmb3IgdGhlIGV2ZW50IHR5cGUgd2lsbCBiZSByZW1vdmVkLlsvZW5dXG4gKiAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkuWJiumZpOOBl+OBvuOBmeOAguOCguOBl+OCpOODmeODs+ODiOODquOCueODiuODvOOCkuaMh+WumuOBl+OBquOBi+OBo+OBn+WgtOWQiOOBq+OBr+OAgeOBneOBruOCpOODmeODs+ODiOOBq+e0kOOBpeOBj+WFqOOBpuOBruOCpOODmeODs+ODiOODquOCueODiuODvOOBjOWJiumZpOOBleOCjOOBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd5YmK6Zmk44GZ44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc1NwbGl0dGVyJywgZnVuY3Rpb24oJGNvbXBpbGUsIFNwbGl0dGVyLCAkb25zZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHNjb3BlOiB0cnVlLFxuXG4gICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgIHZhciBzcGxpdHRlciA9IG5ldyBTcGxpdHRlcihzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgJG9uc2VuLmRlY2xhcmVWYXJBdHRyaWJ1dGUoYXR0cnMsIHNwbGl0dGVyKTtcbiAgICAgICAgICAkb25zZW4ucmVnaXN0ZXJFdmVudEhhbmRsZXJzKHNwbGl0dGVyLCAnZGVzdHJveScpO1xuXG4gICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtc3BsaXR0ZXInLCBzcGxpdHRlcik7XG5cbiAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzcGxpdHRlci5fZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtc3BsaXR0ZXInLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLXN3aXRjaFxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB2YXJcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIHN3aXRjaC5bL2VuXVxuICogICBbamFdSmF2YVNjcmlwdOOBi+OCieWPgueFp+OBmeOCi+OBn+OCgeOBruWkieaVsOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uXG4gKiBAc2lnbmF0dXJlIG9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lci5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvbmNlXG4gKiBAc2lnbmF0dXJlIG9uY2UoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCdzIG9ubHkgdHJpZ2dlcmVkIG9uY2UuWy9lbl1cbiAqICBbamFd5LiA5bqm44Gg44GR5ZG844Gz5Ye644GV44KM44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvZmZcbiAqIEBzaWduYXR1cmUgb2ZmKGV2ZW50TmFtZSwgW2xpc3RlbmVyXSlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1SZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuIElmIHRoZSBsaXN0ZW5lciBpcyBub3Qgc3BlY2lmaWVkIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudCB0eXBlIHdpbGwgYmUgcmVtb3ZlZC5bL2VuXVxuICogIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLliYrpmaTjgZfjgb7jgZnjgILjgoLjgZfjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgarjgYvjgaPjgZ/loLTlkIjjgavjga/jgIHjgZ3jga7jgqTjg5njg7Pjg4jjgavntJDjgaXjgY/lhajjgabjga7jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgYzliYrpmaTjgZXjgozjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogICBbZW5dTmFtZSBvZiB0aGUgZXZlbnQuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOWQjeOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICogICBbZW5dRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuWy9lbl1cbiAqICAgW2phXeWJiumZpOOBmeOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc1N3aXRjaCcsIGZ1bmN0aW9uKCRvbnNlbiwgU3dpdGNoVmlldykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICBzY29wZTogdHJ1ZSxcblxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgaWYgKGF0dHJzLm5nQ29udHJvbGxlcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBlbGVtZW50IGNhblxcJ3QgYWNjZXB0IG5nLWNvbnRyb2xsZXIgZGlyZWN0aXZlLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN3aXRjaFZpZXcgPSBuZXcgU3dpdGNoVmlldyhlbGVtZW50LCBzY29wZSwgYXR0cnMpO1xuICAgICAgICAkb25zZW4uYWRkTW9kaWZpZXJNZXRob2RzRm9yQ3VzdG9tRWxlbWVudHMoc3dpdGNoVmlldywgZWxlbWVudCk7XG5cbiAgICAgICAgJG9uc2VuLmRlY2xhcmVWYXJBdHRyaWJ1dGUoYXR0cnMsIHN3aXRjaFZpZXcpO1xuICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1zd2l0Y2gnLCBzd2l0Y2hWaWV3KTtcblxuICAgICAgICAkb25zZW4uY2xlYW5lci5vbkRlc3Ryb3koc2NvcGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHN3aXRjaFZpZXcuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAkb25zZW4ucmVtb3ZlTW9kaWZpZXJNZXRob2RzKHN3aXRjaFZpZXcpO1xuICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLXN3aXRjaCcsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgJG9uc2VuLmNsZWFyQ29tcG9uZW50KHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgICAgICBzY29wZTogc2NvcGUsXG4gICAgICAgICAgICBhdHRyczogYXR0cnNcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBlbGVtZW50ID0gYXR0cnMgPSBzY29wZSA9IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn0pKCk7XG4iLCIvKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLnZhbHVlKCdUYWJiYXJOb25lQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLlRhYmJhck5vbmVBbmltYXRvcik7XG4gIG1vZHVsZS52YWx1ZSgnVGFiYmFyRmFkZUFuaW1hdG9yJywgb25zLl9pbnRlcm5hbC5UYWJiYXJGYWRlQW5pbWF0b3IpO1xuICBtb2R1bGUudmFsdWUoJ1RhYmJhclNsaWRlQW5pbWF0b3InLCBvbnMuX2ludGVybmFsLlRhYmJhclNsaWRlQW5pbWF0b3IpO1xuXG4gIG1vZHVsZS5mYWN0b3J5KCdUYWJiYXJWaWV3JywgZnVuY3Rpb24oJG9uc2VuKSB7XG4gICAgdmFyIFRhYmJhclZpZXcgPSBDbGFzcy5leHRlbmQoe1xuXG4gICAgICBpbml0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYgKGVsZW1lbnRbMF0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ29ucy10YWJiYXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcImVsZW1lbnRcIiBwYXJhbWV0ZXIgbXVzdCBiZSBhIFwib25zLXRhYmJhclwiIGVsZW1lbnQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zY29wZSA9IHNjb3BlO1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5fYXR0cnMgPSBhdHRycztcbiAgICAgICAgdGhpcy5fbGFzdFBhZ2VFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGFzdFBhZ2VTY29wZSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fc2NvcGUuJG9uKCckZGVzdHJveScsIHRoaXMuX2Rlc3Ryb3kuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5fY2xlYXJEZXJpdmluZ0V2ZW50cyA9ICRvbnNlbi5kZXJpdmVFdmVudHModGhpcywgZWxlbWVudFswXSwgW1xuICAgICAgICAgICdyZWFjdGl2ZScsICdwb3N0Y2hhbmdlJywgJ3ByZWNoYW5nZScsICdpbml0JywgJ3Nob3cnLCAnaGlkZScsICdkZXN0cm95J1xuICAgICAgICBdKTtcblxuICAgICAgICB0aGlzLl9jbGVhckRlcml2aW5nTWV0aG9kcyA9ICRvbnNlbi5kZXJpdmVNZXRob2RzKHRoaXMsIGVsZW1lbnRbMF0sIFtcbiAgICAgICAgICAnc2V0QWN0aXZlVGFiJyxcbiAgICAgICAgICAnc2V0VGFiYmFyVmlzaWJpbGl0eScsXG4gICAgICAgICAgJ2dldEFjdGl2ZVRhYkluZGV4JyxcbiAgICAgICAgICAnbG9hZFBhZ2UnXG4gICAgICAgIF0pO1xuICAgICAgfSxcblxuICAgICAgX2Rlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2Rlc3Ryb3knKTtcblxuICAgICAgICB0aGlzLl9jbGVhckRlcml2aW5nRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuX2NsZWFyRGVyaXZpbmdNZXRob2RzKCk7XG5cbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IHRoaXMuX3Njb3BlID0gdGhpcy5fYXR0cnMgPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE1pY3JvRXZlbnQubWl4aW4oVGFiYmFyVmlldyk7XG5cbiAgICBUYWJiYXJWaWV3LnJlZ2lzdGVyQW5pbWF0b3IgPSBmdW5jdGlvbihuYW1lLCBBbmltYXRvcikge1xuICAgICAgcmV0dXJuIHdpbmRvdy5vbnMuVGFiYmFyRWxlbWVudC5yZWdpc3RlckFuaW1hdG9yKG5hbWUsIEFuaW1hdG9yKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRhYmJhclZpZXc7XG4gIH0pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtdG9hc3RcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIHRvYXN0IGRpYWxvZy5bL2VuXVxuICogIFtqYV3jgZPjga7jg4jjg7zjgrnjg4jjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lkI3liY3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlc2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicHJlc2hvd1wiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicHJlc2hvd1wi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXByZWhpZGVcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZWhpZGVcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInByZWhpZGVcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0c2hvd1xuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicG9zdHNob3dcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cInBvc3RzaG93XCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcG9zdGhpZGVcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInBvc3RoaWRlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwb3N0aGlkZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWRlc3Ryb3lcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcImRlc3Ryb3lcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cImRlc3Ryb3lcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kIG9uXG4gKiBAc2lnbmF0dXJlIG9uKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUFkZCBhbiBldmVudCBsaXN0ZW5lci5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq/jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvbmNlXG4gKiBAc2lnbmF0dXJlIG9uY2UoZXZlbnROYW1lLCBsaXN0ZW5lcilcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCdzIG9ubHkgdHJpZ2dlcmVkIG9uY2UuWy9lbl1cbiAqICBbamFd5LiA5bqm44Gg44GR5ZG844Gz5Ye644GV44KM44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844KS6L+95Yqg44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jjgYznmbrngavjgZfjgZ/pmpvjgavlkbzjgbPlh7rjgZXjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq/jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvZmZcbiAqIEBzaWduYXR1cmUgb2ZmKGV2ZW50TmFtZSwgW2xpc3RlbmVyXSlcbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1SZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuIElmIHRoZSBsaXN0ZW5lciBpcyBub3Qgc3BlY2lmaWVkIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBldmVudCB0eXBlIHdpbGwgYmUgcmVtb3ZlZC5bL2VuXVxuICogIFtqYV3jgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLliYrpmaTjgZfjgb7jgZnjgILjgoLjgZdsaXN0ZW5lcuODkeODqeODoeODvOOCv+OBjOaMh+WumuOBleOCjOOBquOBi+OBo+OBn+WgtOWQiOOAgeOBneOBruOCpOODmeODs+ODiOOBruODquOCueODiuODvOOBjOWFqOOBpuWJiumZpOOBleOCjOOBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd5YmK6Zmk44GZ44KL44Kk44OZ44Oz44OI44Oq44K544OK44O844Gu6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5rih44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogVG9hc3QgZGlyZWN0aXZlLlxuICAgKi9cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNUb2FzdCcsIGZ1bmN0aW9uKCRvbnNlbiwgVG9hc3RWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwcmU6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyIHRvYXN0ID0gbmV3IFRvYXN0VmlldyhzY29wZSwgZWxlbWVudCwgYXR0cnMpO1xuXG4gICAgICAgICAgICAkb25zZW4uZGVjbGFyZVZhckF0dHJpYnV0ZShhdHRycywgdG9hc3QpO1xuICAgICAgICAgICAgJG9uc2VuLnJlZ2lzdGVyRXZlbnRIYW5kbGVycyh0b2FzdCwgJ3ByZXNob3cgcHJlaGlkZSBwb3N0c2hvdyBwb3N0aGlkZSBkZXN0cm95Jyk7XG4gICAgICAgICAgICAkb25zZW4uYWRkTW9kaWZpZXJNZXRob2RzRm9yQ3VzdG9tRWxlbWVudHModG9hc3QsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy10b2FzdCcsIHRvYXN0KTtcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnX3Njb3BlJywgc2NvcGUpO1xuXG4gICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRvYXN0Ll9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICRvbnNlbi5yZW1vdmVNb2RpZmllck1ldGhvZHModG9hc3QpO1xuICAgICAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy10b2FzdCcsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zQWN0aW9uU2hlZXRCdXR0b24nLCBmdW5jdGlvbigkb25zZW4sIEdlbmVyaWNWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgR2VuZXJpY1ZpZXcucmVnaXN0ZXIoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB7dmlld0tleTogJ29ucy1hY3Rpb24tc2hlZXQtYnV0dG9uJ30pO1xuICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmRpcmVjdGl2ZSgnb25zQmFja0J1dHRvbicsIGZ1bmN0aW9uKCRvbnNlbiwgJGNvbXBpbGUsIEdlbmVyaWNWaWV3LCBDb21wb25lbnRDbGVhbmVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHByZTogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyLCB0cmFuc2NsdWRlKSB7XG4gICAgICAgICAgICB2YXIgYmFja0J1dHRvbiA9IEdlbmVyaWNWaWV3LnJlZ2lzdGVyKHNjb3BlLCBlbGVtZW50LCBhdHRycywge1xuICAgICAgICAgICAgICB2aWV3S2V5OiAnb25zLWJhY2stYnV0dG9uJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChhdHRycy5uZ0NsaWNrKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRbMF0ub25DbGljayA9IGFuZ3VsYXIubm9vcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBiYWNrQnV0dG9uLl9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICRvbnNlbi5yZW1vdmVNb2RpZmllck1ldGhvZHMoYmFja0J1dHRvbik7XG4gICAgICAgICAgICAgIGVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIENvbXBvbmVudENsZWFuZXIub25EZXN0cm95KHNjb3BlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgQ29tcG9uZW50Q2xlYW5lci5kZXN0cm95U2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgICBDb21wb25lbnRDbGVhbmVyLmRlc3Ryb3lBdHRyaWJ1dGVzKGF0dHJzKTtcbiAgICAgICAgICAgICAgZWxlbWVudCA9IHNjb3BlID0gYXR0cnMgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zQm90dG9tVG9vbGJhcicsIGZ1bmN0aW9uKCRvbnNlbiwgR2VuZXJpY1ZpZXcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIGxpbms6IHtcbiAgICAgICAgcHJlOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICBHZW5lcmljVmlldy5yZWdpc3RlcihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHtcbiAgICAgICAgICAgIHZpZXdLZXk6ICdvbnMtYm90dG9tVG9vbGJhcidcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxufSkoKTtcblxuIiwiXG4vKipcbiAqIEBlbGVtZW50IG9ucy1idXR0b25cbiAqL1xuXG4oZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zQnV0dG9uJywgZnVuY3Rpb24oJG9uc2VuLCBHZW5lcmljVmlldykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBidXR0b24gPSBHZW5lcmljVmlldy5yZWdpc3RlcihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHtcbiAgICAgICAgICB2aWV3S2V5OiAnb25zLWJ1dHRvbidcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGJ1dHRvbiwgJ2Rpc2FibGVkJywge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRbMF0uZGlzYWJsZWQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2VsZW1lbnRbMF0uZGlzYWJsZWQgPSB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuXG5cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKTtcblxuICBtb2R1bGUuZGlyZWN0aXZlKCdvbnNEdW1teUZvckluaXQnLCBmdW5jdGlvbigkcm9vdFNjb3BlKSB7XG4gICAgdmFyIGlzUmVhZHkgPSBmYWxzZTtcblxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG5cbiAgICAgIGxpbms6IHtcbiAgICAgICAgcG9zdDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICBpZiAoIWlzUmVhZHkpIHtcbiAgICAgICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckb25zLXJlYWR5Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBFVkVOVFMgPVxuICAgICgnZHJhZyBkcmFnbGVmdCBkcmFncmlnaHQgZHJhZ3VwIGRyYWdkb3duIGhvbGQgcmVsZWFzZSBzd2lwZSBzd2lwZWxlZnQgc3dpcGVyaWdodCAnICtcbiAgICAgICdzd2lwZXVwIHN3aXBlZG93biB0YXAgZG91YmxldGFwIHRvdWNoIHRyYW5zZm9ybSBwaW5jaCBwaW5jaGluIHBpbmNob3V0IHJvdGF0ZScpLnNwbGl0KC8gKy8pO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zR2VzdHVyZURldGVjdG9yJywgZnVuY3Rpb24oJG9uc2VuKSB7XG5cbiAgICB2YXIgc2NvcGVEZWYgPSBFVkVOVFMucmVkdWNlKGZ1bmN0aW9uKGRpY3QsIG5hbWUpIHtcbiAgICAgIGRpY3RbJ25nJyArIHRpdGxpemUobmFtZSldID0gJyYnO1xuICAgICAgcmV0dXJuIGRpY3Q7XG4gICAgfSwge30pO1xuXG4gICAgZnVuY3Rpb24gdGl0bGl6ZShzdHIpIHtcbiAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBzY29wZTogc2NvcGVEZWYsXG5cbiAgICAgIC8vIE5PVEU6IFRoaXMgZWxlbWVudCBtdXN0IGNvZXhpc3RzIHdpdGggbmctY29udHJvbGxlci5cbiAgICAgIC8vIERvIG5vdCB1c2UgaXNvbGF0ZWQgc2NvcGUgYW5kIHRlbXBsYXRlJ3MgbmctdHJhbnNjbHVkZS5cbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBfLCB0cmFuc2NsdWRlKSB7XG5cbiAgICAgICAgICB0cmFuc2NsdWRlKHNjb3BlLiRwYXJlbnQsIGZ1bmN0aW9uKGNsb25lZCkge1xuICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQoY2xvbmVkKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJ25nJyArIHRpdGxpemUoZXZlbnQudHlwZSk7XG5cbiAgICAgICAgICAgIGlmIChhdHRyIGluIHNjb3BlRGVmKSB7XG4gICAgICAgICAgICAgIHNjb3BlW2F0dHJdKHskZXZlbnQ6IGV2ZW50fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBnZXN0dXJlRGV0ZWN0b3I7XG5cbiAgICAgICAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBnZXN0dXJlRGV0ZWN0b3IgPSBlbGVtZW50WzBdLl9nZXN0dXJlRGV0ZWN0b3I7XG4gICAgICAgICAgICBnZXN0dXJlRGV0ZWN0b3Iub24oRVZFTlRTLmpvaW4oJyAnKSwgaGFuZGxlcik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkb25zZW4uY2xlYW5lci5vbkRlc3Ryb3koc2NvcGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZ2VzdHVyZURldGVjdG9yLm9mZihFVkVOVFMuam9pbignICcpLCBoYW5kbGVyKTtcbiAgICAgICAgICAgICRvbnNlbi5jbGVhckNvbXBvbmVudCh7XG4gICAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgICAgYXR0cnM6IGF0dHJzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGdlc3R1cmVEZXRlY3Rvci5lbGVtZW50ID0gc2NvcGUgPSBlbGVtZW50ID0gYXR0cnMgPSBudWxsO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcblxuIiwiXG4vKipcbiAqIEBlbGVtZW50IG9ucy1pY29uXG4gKi9cblxuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc0ljb24nLCBmdW5jdGlvbigkb25zZW4sIEdlbmVyaWNWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG5cbiAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgaWYgKGF0dHJzLmljb24uaW5kZXhPZigne3snKSAhPT0gLTEpIHtcbiAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnaWNvbicsICgpID0+IHtcbiAgICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiBlbGVtZW50WzBdLl91cGRhdGUoKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHNjb3BlLCBlbGVtZW50LCBhdHRycykgPT4ge1xuICAgICAgICAgIEdlbmVyaWNWaWV3LnJlZ2lzdGVyKHNjb3BlLCBlbGVtZW50LCBhdHRycywge1xuICAgICAgICAgICAgdmlld0tleTogJ29ucy1pY29uJ1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgICAgfTtcblxuICAgICAgfVxuXG4gICAgfTtcbiAgfSk7XG5cbn0pKCk7XG5cbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLWlmLW9yaWVudGF0aW9uXG4gKiBAY2F0ZWdvcnkgY29uZGl0aW9uYWxcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQ29uZGl0aW9uYWxseSBkaXNwbGF5IGNvbnRlbnQgZGVwZW5kaW5nIG9uIHNjcmVlbiBvcmllbnRhdGlvbi4gVmFsaWQgdmFsdWVzIGFyZSBwb3J0cmFpdCBhbmQgbGFuZHNjYXBlLiBEaWZmZXJlbnQgZnJvbSBvdGhlciBjb21wb25lbnRzLCB0aGlzIGNvbXBvbmVudCBpcyB1c2VkIGFzIGF0dHJpYnV0ZSBpbiBhbnkgZWxlbWVudC5bL2VuXVxuICogICBbamFd55S76Z2i44Gu5ZCR44GN44Gr5b+c44GY44Gm44Kz44Oz44OG44Oz44OE44Gu5Yi25b6h44KS6KGM44GE44G+44GZ44CCcG9ydHJhaXTjgoLjgZfjgY/jga9sYW5kc2NhcGXjgpLmjIflrprjgafjgY3jgb7jgZnjgILjgZnjgbnjgabjga7opoHntKDjga7lsZ7mgKfjgavkvb/nlKjjgafjgY3jgb7jgZnjgIJbL2phXVxuICogQHNlZWFsc28gb25zLWlmLXBsYXRmb3JtIFtlbl1vbnMtaWYtcGxhdGZvcm0gY29tcG9uZW50Wy9lbl1bamFdb25zLWlmLXBsYXRmb3Jt44Kz44Oz44Od44O844ON44Oz44OIWy9qYV1cbiAqIEBndWlkZSBVdGlsaXR5QVBJcyBbZW5dT3RoZXIgdXRpbGl0eSBBUElzWy9lbl1bamFd5LuW44Gu44Om44O844OG44Kj44Oq44OG44KjQVBJWy9qYV1cbiAqIEBleGFtcGxlXG4gKiA8ZGl2IG9ucy1pZi1vcmllbnRhdGlvbj1cInBvcnRyYWl0XCI+XG4gKiAgIDxwPlRoaXMgd2lsbCBvbmx5IGJlIHZpc2libGUgaW4gcG9ydHJhaXQgbW9kZS48L3A+XG4gKiA8L2Rpdj5cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWlmLW9yaWVudGF0aW9uXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXUVpdGhlciBcInBvcnRyYWl0XCIgb3IgXCJsYW5kc2NhcGVcIi5bL2VuXVxuICogICBbamFdcG9ydHJhaXTjgoLjgZfjgY/jga9sYW5kc2NhcGXjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIG1vZHVsZS5kaXJlY3RpdmUoJ29uc0lmT3JpZW50YXRpb24nLCBmdW5jdGlvbigkb25zZW4sICRvbnNHbG9iYWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuXG4gICAgICAvLyBOT1RFOiBUaGlzIGVsZW1lbnQgbXVzdCBjb2V4aXN0cyB3aXRoIG5nLWNvbnRyb2xsZXIuXG4gICAgICAvLyBEbyBub3QgdXNlIGlzb2xhdGVkIHNjb3BlIGFuZCB0ZW1wbGF0ZSdzIG5nLXRyYW5zY2x1ZGUuXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiBmYWxzZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmNzcygnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdvbnNJZk9yaWVudGF0aW9uJywgdXBkYXRlKTtcbiAgICAgICAgICAkb25zR2xvYmFsLm9yaWVudGF0aW9uLm9uKCdjaGFuZ2UnLCB1cGRhdGUpO1xuXG4gICAgICAgICAgdXBkYXRlKCk7XG5cbiAgICAgICAgICAkb25zZW4uY2xlYW5lci5vbkRlc3Ryb3koc2NvcGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJG9uc0dsb2JhbC5vcmllbnRhdGlvbi5vZmYoJ2NoYW5nZScsIHVwZGF0ZSk7XG5cbiAgICAgICAgICAgICRvbnNlbi5jbGVhckNvbXBvbmVudCh7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgYXR0cnM6IGF0dHJzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBzY29wZSA9IGF0dHJzID0gbnVsbDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHZhciB1c2VyT3JpZW50YXRpb24gPSAoJycgKyBhdHRycy5vbnNJZk9yaWVudGF0aW9uKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdmFyIG9yaWVudGF0aW9uID0gZ2V0TGFuZHNjYXBlT3JQb3J0cmFpdCgpO1xuXG4gICAgICAgICAgICBpZiAodXNlck9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnIHx8IHVzZXJPcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcbiAgICAgICAgICAgICAgaWYgKHVzZXJPcmllbnRhdGlvbiA9PT0gb3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmdW5jdGlvbiBnZXRMYW5kc2NhcGVPclBvcnRyYWl0KCkge1xuICAgICAgICAgICAgcmV0dXJuICRvbnNHbG9iYWwub3JpZW50YXRpb24uaXNQb3J0cmFpdCgpID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn0pKCk7XG5cbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLWlmLXBsYXRmb3JtXG4gKiBAY2F0ZWdvcnkgY29uZGl0aW9uYWxcbiAqIEBkZXNjcmlwdGlvblxuICogICAgW2VuXUNvbmRpdGlvbmFsbHkgZGlzcGxheSBjb250ZW50IGRlcGVuZGluZyBvbiB0aGUgcGxhdGZvcm0gLyBicm93c2VyLiBWYWxpZCB2YWx1ZXMgYXJlIFwib3BlcmFcIiwgXCJmaXJlZm94XCIsIFwic2FmYXJpXCIsIFwiY2hyb21lXCIsIFwiaWVcIiwgXCJlZGdlXCIsIFwiYW5kcm9pZFwiLCBcImJsYWNrYmVycnlcIiwgXCJpb3NcIiBhbmQgXCJ3cFwiLlsvZW5dXG4gKiAgICBbamFd44OX44Op44OD44OI44OV44Kp44O844Og44KE44OW44Op44Km44K244O844Gr5b+c44GY44Gm44Kz44Oz44OG44Oz44OE44Gu5Yi25b6h44KS44GK44GT44Gq44GE44G+44GZ44CCb3BlcmEsIGZpcmVmb3gsIHNhZmFyaSwgY2hyb21lLCBpZSwgZWRnZSwgYW5kcm9pZCwgYmxhY2tiZXJyeSwgaW9zLCB3cOOBruOBhOOBmuOCjOOBi+OBruWApOOCkuepuueZveWMuuWIh+OCiuOBp+ikh+aVsOaMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKiBAc2VlYWxzbyBvbnMtaWYtb3JpZW50YXRpb24gW2VuXW9ucy1pZi1vcmllbnRhdGlvbiBjb21wb25lbnRbL2VuXVtqYV1vbnMtaWYtb3JpZW50YXRpb27jgrPjg7Pjg53jg7zjg43jg7Pjg4hbL2phXVxuICogQGd1aWRlIFV0aWxpdHlBUElzIFtlbl1PdGhlciB1dGlsaXR5IEFQSXNbL2VuXVtqYV3ku5bjga7jg6bjg7zjg4bjgqPjg6rjg4bjgqNBUElbL2phXVxuICogQGV4YW1wbGVcbiAqIDxkaXYgb25zLWlmLXBsYXRmb3JtPVwiYW5kcm9pZFwiPlxuICogICAuLi5cbiAqIDwvZGl2PlxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtaWYtcGxhdGZvcm1cbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAaW5pdG9ubHlcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dT25lIG9yIG11bHRpcGxlIHNwYWNlIHNlcGFyYXRlZCB2YWx1ZXM6IFwib3BlcmFcIiwgXCJmaXJlZm94XCIsIFwic2FmYXJpXCIsIFwiY2hyb21lXCIsIFwiaWVcIiwgXCJlZGdlXCIsIFwiYW5kcm9pZFwiLCBcImJsYWNrYmVycnlcIiwgXCJpb3NcIiBvciBcIndwXCIuWy9lbl1cbiAqICAgW2phXVwib3BlcmFcIiwgXCJmaXJlZm94XCIsIFwic2FmYXJpXCIsIFwiY2hyb21lXCIsIFwiaWVcIiwgXCJlZGdlXCIsIFwiYW5kcm9pZFwiLCBcImJsYWNrYmVycnlcIiwgXCJpb3NcIiwgXCJ3cFwi44Gu44GE44Ga44KM44GL56m655m95Yy65YiH44KK44Gn6KSH5pWw5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmRpcmVjdGl2ZSgnb25zSWZQbGF0Zm9ybScsIGZ1bmN0aW9uKCRvbnNlbikge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG5cbiAgICAgIC8vIE5PVEU6IFRoaXMgZWxlbWVudCBtdXN0IGNvZXhpc3RzIHdpdGggbmctY29udHJvbGxlci5cbiAgICAgIC8vIERvIG5vdCB1c2UgaXNvbGF0ZWQgc2NvcGUgYW5kIHRlbXBsYXRlJ3MgbmctdHJhbnNjbHVkZS5cbiAgICAgIHRyYW5zY2x1ZGU6IGZhbHNlLFxuICAgICAgc2NvcGU6IGZhbHNlLFxuXG4gICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICB2YXIgcGxhdGZvcm0gPSBnZXRQbGF0Zm9ybVN0cmluZygpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnb25zSWZQbGF0Zm9ybScsIGZ1bmN0aW9uKHVzZXJQbGF0Zm9ybSkge1xuICAgICAgICAgICAgaWYgKHVzZXJQbGF0Zm9ybSkge1xuICAgICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgICAgJG9uc2VuLmNsZWFuZXIub25EZXN0cm95KHNjb3BlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRvbnNlbi5jbGVhckNvbXBvbmVudCh7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgYXR0cnM6IGF0dHJzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBzY29wZSA9IGF0dHJzID0gbnVsbDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHZhciB1c2VyUGxhdGZvcm1zID0gYXR0cnMub25zSWZQbGF0Zm9ybS50b0xvd2VyQ2FzZSgpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgaWYgKHVzZXJQbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtZW50LmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFBsYXRmb3JtU3RyaW5nKCkge1xuXG4gICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpKSB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvUklNIFRhYmxldCBPUy9pKSkgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JCMTAvaSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2JsYWNrYmVycnknO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmV8aVBhZHxpUG9kL2kpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1dpbmRvd3MgUGhvbmV8SUVNb2JpbGV8V1BEZXNrdG9wL2kpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dwJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPcGVyYSA4LjArIChVQSBkZXRlY3Rpb24gdG8gZGV0ZWN0IEJsaW5rL3Y4LXBvd2VyZWQgT3BlcmEpXG4gICAgICAgICAgdmFyIGlzT3BlcmEgPSAhIXdpbmRvdy5vcGVyYSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJyBPUFIvJykgPj0gMDtcbiAgICAgICAgICBpZiAoaXNPcGVyYSkge1xuICAgICAgICAgICAgcmV0dXJuICdvcGVyYSc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGlzRmlyZWZveCA9IHR5cGVvZiBJbnN0YWxsVHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCc7ICAgLy8gRmlyZWZveCAxLjArXG4gICAgICAgICAgaWYgKGlzRmlyZWZveCkge1xuICAgICAgICAgICAgcmV0dXJuICdmaXJlZm94JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaXNTYWZhcmkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwod2luZG93LkhUTUxFbGVtZW50KS5pbmRleE9mKCdDb25zdHJ1Y3RvcicpID4gMDtcbiAgICAgICAgICAvLyBBdCBsZWFzdCBTYWZhcmkgMys6IFwiW29iamVjdCBIVE1MRWxlbWVudENvbnN0cnVjdG9yXVwiXG4gICAgICAgICAgaWYgKGlzU2FmYXJpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3NhZmFyaSc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGlzRWRnZSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignIEVkZ2UvJykgPj0gMDtcbiAgICAgICAgICBpZiAoaXNFZGdlKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2VkZ2UnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpc0Nocm9tZSA9ICEhd2luZG93LmNocm9tZSAmJiAhaXNPcGVyYSAmJiAhaXNFZGdlOyAvLyBDaHJvbWUgMStcbiAgICAgICAgICBpZiAoaXNDaHJvbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2hyb21lJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaXNJRSA9IC8qQGNjX29uIUAqL2ZhbHNlIHx8ICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlOyAvLyBBdCBsZWFzdCBJRTZcbiAgICAgICAgICBpZiAoaXNJRSkge1xuICAgICAgICAgICAgcmV0dXJuICdpZSc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICd1bmtub3duJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQGlkIGlucHV0XG4gKiBAbmFtZSBvbnMtaW5wdXRcbiAqIEBjYXRlZ29yeSBmb3JtXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dSW5wdXQgY29tcG9uZW50LlsvZW5dXG4gKiAgW2phXWlucHV044Kz44Oz44Od4oCV44ON44Oz44OI44Gn44GZ44CCWy9qYV1cbiAqIEBjb2RlcGVuIG9qUXhMalxuICogQGd1aWRlIFVzaW5nRm9ybUNvbXBvbmVudHNcbiAqICAgW2VuXVVzaW5nIGZvcm0gY29tcG9uZW50c1svZW5dXG4gKiAgIFtqYV3jg5Xjgqnjg7zjg6DjgpLkvb/jgYZbL2phXVxuICogQGd1aWRlIEV2ZW50SGFuZGxpbmdcbiAqICAgW2VuXUV2ZW50IGhhbmRsaW5nIGRlc2NyaXB0aW9uc1svZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlh6bnkIbjga7kvb/jgYTmlrlbL2phXVxuICogQGV4YW1wbGVcbiAqIDxvbnMtaW5wdXQ+PC9vbnMtaW5wdXQ+XG4gKiA8b25zLWlucHV0IG1vZGlmaWVyPVwibWF0ZXJpYWxcIiBsYWJlbD1cIlVzZXJuYW1lXCI+PC9vbnMtaW5wdXQ+XG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgYXR0cmlidXRlXG4gKiBAbmFtZSBsYWJlbFxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVGV4dCBmb3IgYW5pbWF0ZWQgZmxvYXRpbmcgbGFiZWwuWy9lbl1cbiAqICAgW2phXeOCouODi+ODoeODvOOCt+ODp+ODs+OBleOBm+OCi+ODleODreODvOODhuOCo+ODs+OCsOODqeODmeODq+OBruODhuOCreOCueODiOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgYXR0cmlidXRlXG4gKiBAbmFtZSBmbG9hdFxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUlmIHRoaXMgYXR0cmlidXRlIGlzIHByZXNlbnQsIHRoZSBsYWJlbCB3aWxsIGJlIGFuaW1hdGVkLlsvZW5dXG4gKiAgW2phXeOBk+OBruWxnuaAp+OBjOioreWumuOBleOCjOOBn+aZguOAgeODqeODmeODq+OBr+OCouODi+ODoeODvOOCt+ODp+ODs+OBmeOCi+OCiOOBhuOBq+OBquOCiuOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAbmdkb2MgYXR0cmlidXRlXG4gKiBAbmFtZSBuZy1tb2RlbFxuICogQGV4dGVuc2lvbk9mIGFuZ3VsYXJcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQmluZCB0aGUgdmFsdWUgdG8gYSBtb2RlbC4gV29ya3MganVzdCBsaWtlIGZvciBub3JtYWwgaW5wdXQgZWxlbWVudHMuWy9lbl1cbiAqICAgW2phXeOBk+OBruimgee0oOOBruWApOOCkuODouODh+ODq+OBq+e0kOS7mOOBkeOBvuOBmeOAgumAmuW4uOOBrmlucHV06KaB57Sg44Gu5qeY44Gr5YuV5L2c44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBhdHRyaWJ1dGVcbiAqIEBuYW1lIG5nLWNoYW5nZVxuICogQGV4dGVuc2lvbk9mIGFuZ3VsYXJcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRXhlY3V0ZXMgYW4gZXhwcmVzc2lvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLiBXb3JrcyBqdXN0IGxpa2UgZm9yIG5vcm1hbCBpbnB1dCBlbGVtZW50cy5bL2VuXVxuICogICBbamFd5YCk44GM5aSJ44KP44Gj44Gf5pmC44Gr44GT44Gu5bGe5oCn44Gn5oyH5a6a44GX44GfZXhwcmVzc2lvbuOBjOWun+ihjOOBleOCjOOBvuOBmeOAgumAmuW4uOOBrmlucHV06KaB57Sg44Gu5qeY44Gr5YuV5L2c44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zSW5wdXQnLCBmdW5jdGlvbigkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgc2NvcGU6IGZhbHNlLFxuXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgbGV0IGVsID0gZWxlbWVudFswXTtcblxuICAgICAgICBjb25zdCBvbklucHV0ID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNldCA9ICRwYXJzZShhdHRycy5uZ01vZGVsKS5hc3NpZ247XG5cbiAgICAgICAgICBpZiAoZWwuX2lzVGV4dElucHV0KSB7XG4gICAgICAgICAgICBlbC50eXBlID09PSAnbnVtYmVyJyA/IHNldChzY29wZSwgTnVtYmVyKGVsLnZhbHVlKSkgOiBzZXQoc2NvcGUsIGVsLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJyAmJiBlbC5jaGVja2VkKSB7XG4gICAgICAgICAgICBzZXQoc2NvcGUsIGVsLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZXQoc2NvcGUsIGVsLmNoZWNrZWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhdHRycy5uZ0NoYW5nZSkge1xuICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0cnMubmdDaGFuZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNjb3BlLiRwYXJlbnQuJGV2YWxBc3luYygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChhdHRycy5uZ01vZGVsKSB7XG4gICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVsLl9pc1RleHRJbnB1dCkge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gZWwudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlID09PSBlbC52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVsLmNoZWNrZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGVsLl9pc1RleHRJbnB1dFxuICAgICAgICAgICAgPyBlbGVtZW50Lm9uKCdpbnB1dCcsIG9uSW5wdXQpXG4gICAgICAgICAgICA6IGVsZW1lbnQub24oJ2NoYW5nZScsIG9uSW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcbiAgICAgICAgICBlbC5faXNUZXh0SW5wdXRcbiAgICAgICAgICAgID8gZWxlbWVudC5vZmYoJ2lucHV0Jywgb25JbnB1dClcbiAgICAgICAgICAgIDogZWxlbWVudC5vZmYoJ2NoYW5nZScsIG9uSW5wdXQpO1xuXG4gICAgICAgICAgc2NvcGUgPSBlbGVtZW50ID0gYXR0cnMgPSBlbCA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLWtleWJvYXJkLWFjdGl2ZVxuICogQGNhdGVnb3J5IGZvcm1cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dXG4gKiAgICAgQ29uZGl0aW9uYWxseSBkaXNwbGF5IGNvbnRlbnQgZGVwZW5kaW5nIG9uIGlmIHRoZSBzb2Z0d2FyZSBrZXlib2FyZCBpcyB2aXNpYmxlIG9yIGhpZGRlbi5cbiAqICAgICBUaGlzIGNvbXBvbmVudCByZXF1aXJlcyBjb3Jkb3ZhIGFuZCB0aGF0IHRoZSBjb20uaW9uaWMua2V5Ym9hcmQgcGx1Z2luIGlzIGluc3RhbGxlZC5cbiAqICAgWy9lbl1cbiAqICAgW2phXVxuICogICAgIOOCveODleODiOOCpuOCp+OCouOCreODvOODnOODvOODieOBjOihqOekuuOBleOCjOOBpuOBhOOCi+OBi+OBqeOBhuOBi+OBp+OAgeOCs+ODs+ODhuODs+ODhOOCkuihqOekuuOBmeOCi+OBi+OBqeOBhuOBi+OCkuWIh+OCiuabv+OBiOOCi+OBk+OBqOOBjOWHuuadpeOBvuOBmeOAglxuICogICAgIOOBk+OBruOCs+ODs+ODneODvOODjeODs+ODiOOBr+OAgUNvcmRvdmHjgoRjb20uaW9uaWMua2V5Ym9hcmTjg5fjg6njgrDjgqTjg7PjgpLlv4XopoHjgajjgZfjgb7jgZnjgIJcbiAqICAgWy9qYV1cbiAqIEBndWlkZSBVdGlsaXR5QVBJc1xuICogICBbZW5dT3RoZXIgdXRpbGl0eSBBUElzWy9lbl1cbiAqICAgW2phXeS7luOBruODpuODvOODhuOCo+ODquODhuOCo0FQSVsvamFdXG4gKiBAZXhhbXBsZVxuICogPGRpdiBvbnMta2V5Ym9hcmQtYWN0aXZlPlxuICogICBUaGlzIHdpbGwgb25seSBiZSBkaXNwbGF5ZWQgaWYgdGhlIHNvZnR3YXJlIGtleWJvYXJkIGlzIG9wZW4uXG4gKiA8L2Rpdj5cbiAqIDxkaXYgb25zLWtleWJvYXJkLWluYWN0aXZlPlxuICogICBUaGVyZSBpcyBhbHNvIGEgY29tcG9uZW50IHRoYXQgZG9lcyB0aGUgb3Bwb3NpdGUuXG4gKiA8L2Rpdj5cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWtleWJvYXJkLWFjdGl2ZVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1UaGUgY29udGVudCBvZiB0YWdzIHdpdGggdGhpcyBhdHRyaWJ1dGUgd2lsbCBiZSB2aXNpYmxlIHdoZW4gdGhlIHNvZnR3YXJlIGtleWJvYXJkIGlzIG9wZW4uWy9lbl1cbiAqICAgW2phXeOBk+OBruWxnuaAp+OBjOOBpOOBhOOBn+imgee0oOOBr+OAgeOCveODleODiOOCpuOCp+OCouOCreODvOODnOODvOODieOBjOihqOekuuOBleOCjOOBn+aZguOBq+WIneOCgeOBpuihqOekuuOBleOCjOOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1rZXlib2FyZC1pbmFjdGl2ZVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1UaGUgY29udGVudCBvZiB0YWdzIHdpdGggdGhpcyBhdHRyaWJ1dGUgd2lsbCBiZSB2aXNpYmxlIHdoZW4gdGhlIHNvZnR3YXJlIGtleWJvYXJkIGlzIGhpZGRlbi5bL2VuXVxuICogICBbamFd44GT44Gu5bGe5oCn44GM44Gk44GE44Gf6KaB57Sg44Gv44CB44K944OV44OI44Km44Kn44Ki44Kt44O844Oc44O844OJ44GM6Zqg44KM44Gm44GE44KL5pmC44Gu44G/6KGo56S644GV44KM44G+44GZ44CCWy9qYV1cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgdmFyIGNvbXBpbGVGdW5jdGlvbiA9IGZ1bmN0aW9uKHNob3csICRvbnNlbikge1xuICAgIHJldHVybiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBkaXNwU2hvdyA9IHNob3cgPyAnYmxvY2snIDogJ25vbmUnLFxuICAgICAgICAgICAgZGlzcEhpZGUgPSBzaG93ID8gJ25vbmUnIDogJ2Jsb2NrJztcblxuICAgICAgICB2YXIgb25TaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZWxlbWVudC5jc3MoJ2Rpc3BsYXknLCBkaXNwU2hvdyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGVsZW1lbnQuY3NzKCdkaXNwbGF5JywgZGlzcEhpZGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBvbkluaXQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUudmlzaWJsZSkge1xuICAgICAgICAgICAgb25TaG93KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9uSGlkZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBvbnMuc29mdHdhcmVLZXlib2FyZC5vbignc2hvdycsIG9uU2hvdyk7XG4gICAgICAgIG9ucy5zb2Z0d2FyZUtleWJvYXJkLm9uKCdoaWRlJywgb25IaWRlKTtcbiAgICAgICAgb25zLnNvZnR3YXJlS2V5Ym9hcmQub24oJ2luaXQnLCBvbkluaXQpO1xuXG4gICAgICAgIGlmIChvbnMuc29mdHdhcmVLZXlib2FyZC5fdmlzaWJsZSkge1xuICAgICAgICAgIG9uU2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uSGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJG9uc2VuLmNsZWFuZXIub25EZXN0cm95KHNjb3BlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBvbnMuc29mdHdhcmVLZXlib2FyZC5vZmYoJ3Nob3cnLCBvblNob3cpO1xuICAgICAgICAgIG9ucy5zb2Z0d2FyZUtleWJvYXJkLm9mZignaGlkZScsIG9uSGlkZSk7XG4gICAgICAgICAgb25zLnNvZnR3YXJlS2V5Ym9hcmQub2ZmKCdpbml0Jywgb25Jbml0KTtcblxuICAgICAgICAgICRvbnNlbi5jbGVhckNvbXBvbmVudCh7XG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgc2NvcGU6IHNjb3BlLFxuICAgICAgICAgICAgYXR0cnM6IGF0dHJzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZWxlbWVudCA9IHNjb3BlID0gYXR0cnMgPSBudWxsO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICBtb2R1bGUuZGlyZWN0aXZlKCdvbnNLZXlib2FyZEFjdGl2ZScsIGZ1bmN0aW9uKCRvbnNlbikge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgIGNvbXBpbGU6IGNvbXBpbGVGdW5jdGlvbih0cnVlLCAkb25zZW4pXG4gICAgfTtcbiAgfSk7XG5cbiAgbW9kdWxlLmRpcmVjdGl2ZSgnb25zS2V5Ym9hcmRJbmFjdGl2ZScsIGZ1bmN0aW9uKCRvbnNlbikge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgIGNvbXBpbGU6IGNvbXBpbGVGdW5jdGlvbihmYWxzZSwgJG9uc2VuKVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zTGlzdCcsIGZ1bmN0aW9uKCRvbnNlbiwgR2VuZXJpY1ZpZXcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBHZW5lcmljVmlldy5yZWdpc3RlcihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHt2aWV3S2V5OiAnb25zLWxpc3QnfSk7XG4gICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zTGlzdEhlYWRlcicsIGZ1bmN0aW9uKCRvbnNlbiwgR2VuZXJpY1ZpZXcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBHZW5lcmljVmlldy5yZWdpc3RlcihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHt2aWV3S2V5OiAnb25zLWxpc3QtaGVhZGVyJ30pO1xuICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc0xpc3RJdGVtJywgZnVuY3Rpb24oJG9uc2VuLCBHZW5lcmljVmlldykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIEdlbmVyaWNWaWV3LnJlZ2lzdGVyKHNjb3BlLCBlbGVtZW50LCBhdHRycywge3ZpZXdLZXk6ICdvbnMtbGlzdC1pdGVtJ30pO1xuICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtbG9hZGluZy1wbGFjZWhvbGRlclxuICogQGNhdGVnb3J5IHV0aWxcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dRGlzcGxheSBhIHBsYWNlaG9sZGVyIHdoaWxlIHRoZSBjb250ZW50IGlzIGxvYWRpbmcuWy9lbl1cbiAqICAgW2phXU9uc2VuIFVJ44GM6Kqt44G/6L6844G+44KM44KL44G+44Gn44Gr6KGo56S644GZ44KL44OX44Os44O844K544Ob44Or44OA44O844KS6KGo54++44GX44G+44GZ44CCWy9qYV1cbiAqIEBndWlkZSBVdGlsaXR5QVBJcyBbZW5dT3RoZXIgdXRpbGl0eSBBUElzWy9lbl1bamFd5LuW44Gu44Om44O844OG44Kj44Oq44OG44KjQVBJWy9qYV1cbiAqIEBleGFtcGxlXG4gKiA8ZGl2IG9ucy1sb2FkaW5nLXBsYWNlaG9sZGVyPVwicGFnZS5odG1sXCI+XG4gKiAgIExvYWRpbmcuLi5cbiAqIDwvZGl2PlxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtbG9hZGluZy1wbGFjZWhvbGRlclxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1UaGUgdXJsIG9mIHRoZSBwYWdlIHRvIGxvYWQuWy9lbl1cbiAqICAgW2phXeiqreOBv+i+vOOCgOODmuODvOOCuOOBrlVSTOOCkuaMh+WumuOBl+OBvuOBmeOAglsvamFdXG4gKi9cblxuKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc0xvYWRpbmdQbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRycy5vbnNMb2FkaW5nUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICBvbnMuX3Jlc29sdmVMb2FkaW5nUGxhY2Vob2xkZXIoZWxlbWVudFswXSwgYXR0cnMub25zTG9hZGluZ1BsYWNlaG9sZGVyLCBmdW5jdGlvbihjb250ZW50RWxlbWVudCwgZG9uZSkge1xuICAgICAgICAgICAgb25zLmNvbXBpbGUoY29udGVudEVsZW1lbnQpO1xuICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKGRvbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn0pKCk7XG4iLCIiLCIoZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLmRpcmVjdGl2ZSgnb25zUmFuZ2UnLCBmdW5jdGlvbigkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgc2NvcGU6IGZhbHNlLFxuXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICBjb25zdCBvbklucHV0ID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNldCA9ICRwYXJzZShhdHRycy5uZ01vZGVsKS5hc3NpZ247XG5cbiAgICAgICAgICBzZXQoc2NvcGUsIGVsZW1lbnRbMF0udmFsdWUpO1xuICAgICAgICAgIGlmIChhdHRycy5uZ0NoYW5nZSkge1xuICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0cnMubmdDaGFuZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY29wZS4kcGFyZW50LiRldmFsQXN5bmMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoYXR0cnMubmdNb2RlbCkge1xuICAgICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5uZ01vZGVsLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGVsZW1lbnQub24oJ2lucHV0Jywgb25JbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQub2ZmKCdpbnB1dCcsIG9uSW5wdXQpO1xuICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJzID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNSaXBwbGUnLCBmdW5jdGlvbigkb25zZW4sIEdlbmVyaWNWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgR2VuZXJpY1ZpZXcucmVnaXN0ZXIoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB7dmlld0tleTogJ29ucy1yaXBwbGUnfSk7XG4gICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn0pKCk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy1zY29wZVxuICogQGNhdGVnb3J5IHV0aWxcbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dQWxsIGNoaWxkIGVsZW1lbnRzIHVzaW5nIHRoZSBcInZhclwiIGF0dHJpYnV0ZSB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoZSBzY29wZSBvZiB0aGlzIGVsZW1lbnQuWy9lbl1cbiAqICAgW2phXVwidmFyXCLlsZ7mgKfjgpLkvb/jgaPjgabjgYTjgovlhajjgabjga7lrZDopoHntKDjga52aWV344Kq44OW44K444Kn44Kv44OI44Gv44CB44GT44Gu6KaB57Sg44GuQW5ndWxhckpT44K544Kz44O844OX44Gr6L+95Yqg44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBleGFtcGxlXG4gKiA8b25zLWxpc3Q+XG4gKiAgIDxvbnMtbGlzdC1pdGVtIG9ucy1zY29wZSBuZy1yZXBlYXQ9XCJpdGVtIGluIGl0ZW1zXCI+XG4gKiAgICAgPG9ucy1jYXJvdXNlbCB2YXI9XCJjYXJvdXNlbFwiPlxuICogICAgICAgPG9ucy1jYXJvdXNlbC1pdGVtIG5nLWNsaWNrPVwiY2Fyb3VzZWwubmV4dCgpXCI+XG4gKiAgICAgICAgIHt7IGl0ZW0gfX1cbiAqICAgICAgIDwvb25zLWNhcm91c2VsLWl0ZW0+XG4gKiAgICAgICA8L29ucy1jYXJvdXNlbC1pdGVtIG5nLWNsaWNrPVwiY2Fyb3VzZWwucHJldigpXCI+XG4gKiAgICAgICAgIC4uLlxuICogICAgICAgPC9vbnMtY2Fyb3VzZWwtaXRlbT5cbiAqICAgICA8L29ucy1jYXJvdXNlbD5cbiAqICAgPC9vbnMtbGlzdC1pdGVtPlxuICogPC9vbnMtbGlzdD5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ29uc2VuJyk7XG5cbiAgbW9kdWxlLmRpcmVjdGl2ZSgnb25zU2NvcGUnLCBmdW5jdGlvbigkb25zZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgdHJhbnNjbHVkZTogZmFsc2UsXG4gICAgICBzY29wZTogZmFsc2UsXG5cbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuZGF0YSgnX3Njb3BlJywgc2NvcGUpO1xuXG4gICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbGVtZW50LmRhdGEoJ19zY29wZScsIHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLXNlbGVjdFxuICovXG5cbi8qKlxuICogQG1ldGhvZCBvblxuICogQHNpZ25hdHVyZSBvbihldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44GT44Gu44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25jZVxuICogQHNpZ25hdHVyZSBvbmNlKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQncyBvbmx5IHRyaWdnZXJlZCBvbmNlLlsvZW5dXG4gKiAgW2phXeS4gOW6puOBoOOBkeWRvOOBs+WHuuOBleOCjOOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb2ZmXG4gKiBAc2lnbmF0dXJlIG9mZihldmVudE5hbWUsIFtsaXN0ZW5lcl0pXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyLiBJZiB0aGUgbGlzdGVuZXIgaXMgbm90IHNwZWNpZmllZCBhbGwgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuWy9lbl1cbiAqICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5YmK6Zmk44GX44G+44GZ44CC44KC44GX44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5oyH5a6a44GX44Gq44GL44Gj44Gf5aC05ZCI44Gr44Gv44CB44Gd44Gu44Kk44OZ44Oz44OI44Gr57SQ44Gl44GP5YWo44Gm44Gu44Kk44OZ44Oz44OI44Oq44K544OK44O844GM5YmK6Zmk44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3liYrpmaTjgZnjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKVxuICAuZGlyZWN0aXZlKCdvbnNTZWxlY3QnLCBmdW5jdGlvbiAoJHBhcnNlLCAkb25zZW4sIEdlbmVyaWNWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiBmYWxzZSxcblxuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBjb25zdCBvbklucHV0ID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNldCA9ICRwYXJzZShhdHRycy5uZ01vZGVsKS5hc3NpZ247XG5cbiAgICAgICAgICBzZXQoc2NvcGUsIGVsZW1lbnRbMF0udmFsdWUpO1xuICAgICAgICAgIGlmIChhdHRycy5uZ0NoYW5nZSkge1xuICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0cnMubmdDaGFuZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY29wZS4kcGFyZW50LiRldmFsQXN5bmMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoYXR0cnMubmdNb2RlbCkge1xuICAgICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5uZ01vZGVsLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnRbMF0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGVsZW1lbnQub24oJ2lucHV0Jywgb25JbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQub2ZmKCdpbnB1dCcsIG9uSW5wdXQpO1xuICAgICAgICAgIHNjb3BlID0gZWxlbWVudCA9IGF0dHJzID0gbnVsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgR2VuZXJpY1ZpZXcucmVnaXN0ZXIoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB7IHZpZXdLZXk6ICdvbnMtc2VsZWN0JyB9KTtcbiAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgfVxuICAgIH07XG4gIH0pXG59KSgpO1xuIiwiLyoqXG4gKiBAZWxlbWVudCBvbnMtc3BsaXR0ZXItY29udGVudFxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtZGVzdHJveVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwiZGVzdHJveVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwiZGVzdHJveVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGxhc3RSZWFkeSA9IHdpbmRvdy5vbnMuU3BsaXR0ZXJDb250ZW50RWxlbWVudC5yZXdyaXRhYmxlcy5yZWFkeTtcbiAgd2luZG93Lm9ucy5TcGxpdHRlckNvbnRlbnRFbGVtZW50LnJld3JpdGFibGVzLnJlYWR5ID0gb25zLl93YWl0RGlyZXRpdmVJbml0KCdvbnMtc3BsaXR0ZXItY29udGVudCcsIGxhc3RSZWFkeSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNTcGxpdHRlckNvbnRlbnQnLCBmdW5jdGlvbigkY29tcGlsZSwgU3BsaXR0ZXJDb250ZW50LCAkb25zZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgICB2YXIgdmlldyA9IG5ldyBTcGxpdHRlckNvbnRlbnQoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCB2aWV3KTtcbiAgICAgICAgICAkb25zZW4ucmVnaXN0ZXJFdmVudEhhbmRsZXJzKHZpZXcsICdkZXN0cm95Jyk7XG5cbiAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy1zcGxpdHRlci1jb250ZW50Jywgdmlldyk7XG5cbiAgICAgICAgICBlbGVtZW50WzBdLnBhZ2VMb2FkZXIgPSAkb25zZW4uY3JlYXRlUGFnZUxvYWRlcih2aWV3KTtcblxuICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZpZXcuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLXNwbGl0dGVyLWNvbnRlbnQnLCB1bmRlZmluZWQpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLXNwbGl0dGVyLXNpZGVcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWRlc3Ryb3lcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcImRlc3Ryb3lcIiBldmVudCBpcyBmaXJlZC5bL2VuXVxuICogIFtqYV1cImRlc3Ryb3lcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVvcGVuXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwcmVvcGVuXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVvcGVuXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcHJlY2xvc2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZWNsb3NlXCIgZXZlbnQgaXMgZmlyZWQuWy9lbl1cbiAqICBbamFdXCJwcmVjbG9zZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXBvc3RvcGVuXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJwb3N0b3BlblwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdG9wZW5cIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wb3N0Y2xvc2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInBvc3RjbG9zZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdGNsb3NlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtbW9kZWNoYW5nZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwibW9kZWNoYW5nZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwibW9kZWNoYW5nZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGxhc3RSZWFkeSA9IHdpbmRvdy5vbnMuU3BsaXR0ZXJTaWRlRWxlbWVudC5yZXdyaXRhYmxlcy5yZWFkeTtcbiAgd2luZG93Lm9ucy5TcGxpdHRlclNpZGVFbGVtZW50LnJld3JpdGFibGVzLnJlYWR5ID0gb25zLl93YWl0RGlyZXRpdmVJbml0KCdvbnMtc3BsaXR0ZXItc2lkZScsIGxhc3RSZWFkeSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNTcGxpdHRlclNpZGUnLCBmdW5jdGlvbigkY29tcGlsZSwgU3BsaXR0ZXJTaWRlLCAkb25zZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgICB2YXIgdmlldyA9IG5ldyBTcGxpdHRlclNpZGUoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcblxuICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCB2aWV3KTtcbiAgICAgICAgICAkb25zZW4ucmVnaXN0ZXJFdmVudEhhbmRsZXJzKHZpZXcsICdkZXN0cm95IHByZW9wZW4gcHJlY2xvc2UgcG9zdG9wZW4gcG9zdGNsb3NlIG1vZGVjaGFuZ2UnKTtcblxuICAgICAgICAgIGVsZW1lbnQuZGF0YSgnb25zLXNwbGl0dGVyLXNpZGUnLCB2aWV3KTtcblxuICAgICAgICAgIGVsZW1lbnRbMF0ucGFnZUxvYWRlciA9ICRvbnNlbi5jcmVhdGVQYWdlTG9hZGVyKHZpZXcpO1xuXG4gICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmlldy5fZXZlbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtc3BsaXR0ZXItc2lkZScsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJylcbiAgICAuZGlyZWN0aXZlKCdvbnNUYWInLCB0YWIpXG4gICAgLmRpcmVjdGl2ZSgnb25zVGFiYmFySXRlbScsIHRhYik7IC8vIGZvciBCQ1xuXG4gIGZ1bmN0aW9uIHRhYigkb25zZW4sIEdlbmVyaWNWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIHZpZXcgPSBuZXcgR2VuZXJpY1ZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcbiAgICAgICAgZWxlbWVudFswXS5wYWdlTG9hZGVyID0gJG9uc2VuLmNyZWF0ZVBhZ2VMb2FkZXIodmlldyk7XG5cbiAgICAgICAgJG9uc2VuLmZpcmVDb21wb25lbnRFdmVudChlbGVtZW50WzBdLCAnaW5pdCcpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn0pKCk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy10YWJiYXJcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICAgW2VuXVZhcmlhYmxlIG5hbWUgdG8gcmVmZXIgdGhpcyB0YWIgYmFyLlsvZW5dXG4gKiAgIFtqYV3jgZPjga7jgr/jg5bjg5Djg7zjgpLlj4LnhafjgZnjgovjgZ/jgoHjga7lkI3liY3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBoaWRlLXRhYnNcbiAqIEBpbml0b25seVxuICogQHR5cGUge0Jvb2xlYW59XG4gKiBAZGVmYXVsdCBmYWxzZVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1XaGV0aGVyIHRvIGhpZGUgdGhlIHRhYnMuIFZhbGlkIHZhbHVlcyBhcmUgdHJ1ZS9mYWxzZS5bL2VuXVxuICogICBbamFd44K/44OW44KS6Z2e6KGo56S644Gr44GZ44KL5aC05ZCI44Gr5oyH5a6a44GX44G+44GZ44CCdHJ1ZeOCguOBl+OBj+OBr2ZhbHNl44KS5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXJlYWN0aXZlXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtFeHByZXNzaW9ufVxuICogQGRlc2NyaXB0aW9uXG4gKiAgW2VuXUFsbG93cyB5b3UgdG8gc3BlY2lmeSBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgXCJyZWFjdGl2ZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicmVhY3RpdmVcIuOCpOODmeODs+ODiOOBjOeZuueBq+OBleOCjOOBn+aZguOBruaMmeWLleOCkueLrOiHquOBq+aMh+WumuOBp+OBjeOBvuOBmeOAglsvamFdXG4gKi9cblxuLyoqXG4gKiBAYXR0cmlidXRlIG9ucy1wcmVjaGFuZ2VcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSBcInByZWNoYW5nZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicHJlY2hhbmdlXCLjgqTjg5njg7Pjg4jjgYznmbrngavjgZXjgozjgZ/mmYLjga7mjJnli5XjgpLni6zoh6rjgavmjIflrprjgafjgY3jgb7jgZnjgIJbL2phXVxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSBvbnMtcG9zdGNoYW5nZVxuICogQGluaXRvbmx5XG4gKiBAdHlwZSB7RXhwcmVzc2lvbn1cbiAqIEBkZXNjcmlwdGlvblxuICogIFtlbl1BbGxvd3MgeW91IHRvIHNwZWNpZnkgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIFwicG9zdGNoYW5nZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXVwicG9zdGNoYW5nZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWluaXRcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIGEgcGFnZSdzIFwiaW5pdFwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXeODmuODvOOCuOOBrlwiaW5pdFwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLXNob3dcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIGEgcGFnZSdzIFwic2hvd1wiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXeODmuODvOOCuOOBrlwic2hvd1wi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWhpZGVcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIGEgcGFnZSdzIFwiaGlkZVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXeODmuODvOOCuOOBrlwiaGlkZVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgb25zLWRlc3Ryb3lcbiAqIEBpbml0b25seVxuICogQHR5cGUge0V4cHJlc3Npb259XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWxsb3dzIHlvdSB0byBzcGVjaWZ5IGN1c3RvbSBiZWhhdmlvciB3aGVuIGEgcGFnZSdzIFwiZGVzdHJveVwiIGV2ZW50IGlzIGZpcmVkLlsvZW5dXG4gKiAgW2phXeODmuODvOOCuOOBrlwiZGVzdHJveVwi44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf5pmC44Gu5oyZ5YuV44KS54us6Ieq44Gr5oyH5a6a44Gn44GN44G+44GZ44CCWy9qYV1cbiAqL1xuXG5cbi8qKlxuICogQG1ldGhvZCBvblxuICogQHNpZ25hdHVyZSBvbihldmVudE5hbWUsIGxpc3RlbmVyKVxuICogQGRlc2NyaXB0aW9uXG4gKiAgIFtlbl1BZGQgYW4gZXZlbnQgbGlzdGVuZXIuWy9lbl1cbiAqICAgW2phXeOCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44GT44Gu44Kk44OZ44Oz44OI44GM55m654Gr44GV44KM44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb25jZVxuICogQHNpZ25hdHVyZSBvbmNlKGV2ZW50TmFtZSwgbGlzdGVuZXIpXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQncyBvbmx5IHRyaWdnZXJlZCBvbmNlLlsvZW5dXG4gKiAgW2phXeS4gOW6puOBoOOBkeWRvOOBs+WHuuOBleOCjOOCi+OCpOODmeODs+ODiOODquOCueODiuODvOOCkui/veWKoOOBl+OBvuOBmeOAglsvamFdXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiAgIFtlbl1OYW1lIG9mIHRoZSBldmVudC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI5ZCN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gKiAgIFtlbl1GdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5bL2VuXVxuICogICBbamFd44Kk44OZ44Oz44OI44GM55m654Gr44GX44Gf6Zqb44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44Kq44OW44K444Kn44Kv44OI44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuXG4vKipcbiAqIEBtZXRob2Qgb2ZmXG4gKiBAc2lnbmF0dXJlIG9mZihldmVudE5hbWUsIFtsaXN0ZW5lcl0pXG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyLiBJZiB0aGUgbGlzdGVuZXIgaXMgbm90IHNwZWNpZmllZCBhbGwgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQgdHlwZSB3aWxsIGJlIHJlbW92ZWQuWy9lbl1cbiAqICBbamFd44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5YmK6Zmk44GX44G+44GZ44CC44KC44GX44Kk44OZ44Oz44OI44Oq44K544OK44O844KS5oyH5a6a44GX44Gq44GL44Gj44Gf5aC05ZCI44Gr44Gv44CB44Gd44Gu44Kk44OZ44Oz44OI44Gr57SQ44Gl44GP5YWo44Gm44Gu44Kk44OZ44Oz44OI44Oq44K544OK44O844GM5YmK6Zmk44GV44KM44G+44GZ44CCWy9qYV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAqICAgW2VuXU5hbWUgb2YgdGhlIGV2ZW50LlsvZW5dXG4gKiAgIFtqYV3jgqTjg5njg7Pjg4jlkI3jgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAqICAgW2VuXUZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlsvZW5dXG4gKiAgIFtqYV3liYrpmaTjgZnjgovjgqTjg5njg7Pjg4jjg6rjgrnjg4rjg7zjgpLmjIflrprjgZfjgb7jgZnjgIJbL2phXVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBsYXN0UmVhZHkgPSB3aW5kb3cub25zLlRhYmJhckVsZW1lbnQucmV3cml0YWJsZXMucmVhZHk7XG4gIHdpbmRvdy5vbnMuVGFiYmFyRWxlbWVudC5yZXdyaXRhYmxlcy5yZWFkeSA9IG9ucy5fd2FpdERpcmV0aXZlSW5pdCgnb25zLXRhYmJhcicsIGxhc3RSZWFkeSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNUYWJiYXInLCBmdW5jdGlvbigkb25zZW4sICRjb21waWxlLCAkcGFyc2UsIFRhYmJhclZpZXcpIHtcblxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuXG4gICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIHtcblxuXG4gICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5oaWRlVGFicywgZnVuY3Rpb24oaGlkZSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgaGlkZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGhpZGUgPSBoaWRlID09PSAndHJ1ZSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnRbMF0uc2V0VGFiYmFyVmlzaWJpbGl0eSghaGlkZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0YWJiYXJWaWV3ID0gbmV3IFRhYmJhclZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcbiAgICAgICAgJG9uc2VuLmFkZE1vZGlmaWVyTWV0aG9kc0ZvckN1c3RvbUVsZW1lbnRzKHRhYmJhclZpZXcsIGVsZW1lbnQpO1xuXG4gICAgICAgICRvbnNlbi5yZWdpc3RlckV2ZW50SGFuZGxlcnModGFiYmFyVmlldywgJ3JlYWN0aXZlIHByZWNoYW5nZSBwb3N0Y2hhbmdlIGluaXQgc2hvdyBoaWRlIGRlc3Ryb3knKTtcblxuICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy10YWJiYXInLCB0YWJiYXJWaWV3KTtcbiAgICAgICAgJG9uc2VuLmRlY2xhcmVWYXJBdHRyaWJ1dGUoYXR0cnMsIHRhYmJhclZpZXcpO1xuXG4gICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0YWJiYXJWaWV3Ll9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgJG9uc2VuLnJlbW92ZU1vZGlmaWVyTWV0aG9kcyh0YWJiYXJWaWV3KTtcbiAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy10YWJiYXInLCB1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkb25zZW4uZmlyZUNvbXBvbmVudEV2ZW50KGVsZW1lbnRbMF0sICdpbml0Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnb25zZW4nKS5kaXJlY3RpdmUoJ29uc1RlbXBsYXRlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB2YXIgY29udGVudCA9IGVsZW1lbnRbMF0udGVtcGxhdGUgfHwgZWxlbWVudC5odG1sKCk7XG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChlbGVtZW50LmF0dHIoJ2lkJyksIGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGVsZW1lbnQgb25zLXRvb2xiYXJcbiAqL1xuXG4vKipcbiAqIEBhdHRyaWJ1dGUgdmFyXG4gKiBAaW5pdG9ubHlcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKiBAZGVzY3JpcHRpb25cbiAqICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIHRvb2xiYXIuWy9lbl1cbiAqICBbamFd44GT44Gu44OE44O844Or44OQ44O844KS5Y+C54Wn44GZ44KL44Gf44KB44Gu5ZCN5YmN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ29uc2VuJykuZGlyZWN0aXZlKCdvbnNUb29sYmFyJywgZnVuY3Rpb24oJG9uc2VuLCBHZW5lcmljVmlldykge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuXG4gICAgICAvLyBOT1RFOiBUaGlzIGVsZW1lbnQgbXVzdCBjb2V4aXN0cyB3aXRoIG5nLWNvbnRyb2xsZXIuXG4gICAgICAvLyBEbyBub3QgdXNlIGlzb2xhdGVkIHNjb3BlIGFuZCB0ZW1wbGF0ZSdzIG5nLXRyYW5zY2x1ZGUuXG4gICAgICBzY29wZTogZmFsc2UsXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcblxuICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHByZTogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBkaXJ0eSBmaXghXG4gICAgICAgICAgICBpZiAoZWxlbWVudFswXS5ub2RlTmFtZSA9PT0gJ29ucy10b29sYmFyJykge1xuICAgICAgICAgICAgICBHZW5lcmljVmlldy5yZWdpc3RlcihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHt2aWV3S2V5OiAnb25zLXRvb2xiYXInfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb3N0OiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIEBlbGVtZW50IG9ucy10b29sYmFyLWJ1dHRvblxuICovXG5cbi8qKlxuICogQGF0dHJpYnV0ZSB2YXJcbiAqIEBpbml0b25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBkZXNjcmlwdGlvblxuICogICBbZW5dVmFyaWFibGUgbmFtZSB0byByZWZlciB0aGlzIGJ1dHRvbi5bL2VuXVxuICogICBbamFd44GT44Gu44Oc44K/44Oz44KS5Y+C54Wn44GZ44KL44Gf44KB44Gu5ZCN5YmN44KS5oyH5a6a44GX44G+44GZ44CCWy9qYV1cbiAqL1xuKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIG1vZHVsZS5kaXJlY3RpdmUoJ29uc1Rvb2xiYXJCdXR0b24nLCBmdW5jdGlvbigkb25zZW4sIEdlbmVyaWNWaWV3KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBzY29wZTogZmFsc2UsXG4gICAgICBsaW5rOiB7XG4gICAgICAgIHByZTogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgdmFyIHRvb2xiYXJCdXR0b24gPSBuZXcgR2VuZXJpY1ZpZXcoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKTtcbiAgICAgICAgICBlbGVtZW50LmRhdGEoJ29ucy10b29sYmFyLWJ1dHRvbicsIHRvb2xiYXJCdXR0b24pO1xuICAgICAgICAgICRvbnNlbi5kZWNsYXJlVmFyQXR0cmlidXRlKGF0dHJzLCB0b29sYmFyQnV0dG9uKTtcblxuICAgICAgICAgICRvbnNlbi5hZGRNb2RpZmllck1ldGhvZHNGb3JDdXN0b21FbGVtZW50cyh0b29sYmFyQnV0dG9uLCBlbGVtZW50KTtcblxuICAgICAgICAgICRvbnNlbi5jbGVhbmVyLm9uRGVzdHJveShzY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0b29sYmFyQnV0dG9uLl9ldmVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkb25zZW4ucmVtb3ZlTW9kaWZpZXJNZXRob2RzKHRvb2xiYXJCdXR0b24pO1xuICAgICAgICAgICAgZWxlbWVudC5kYXRhKCdvbnMtdG9vbGJhci1idXR0b24nLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgZWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgICAgICRvbnNlbi5jbGVhckNvbXBvbmVudCh7XG4gICAgICAgICAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgICAgICAgICAgYXR0cnM6IGF0dHJzLFxuICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzY29wZSA9IGVsZW1lbnQgPSBhdHRycyA9IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBvc3Q6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICRvbnNlbi5maXJlQ29tcG9uZW50RXZlbnQoZWxlbWVudFswXSwgJ2luaXQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkoKTtcbiIsIi8qXG5Db3B5cmlnaHQgMjAxMy0yMDE1IEFTSUFMIENPUlBPUkFUSU9OXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbiovXG5cbihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpO1xuXG4gIHZhciBDb21wb25lbnRDbGVhbmVyID0ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7anFMaXRlfSBlbGVtZW50XG4gICAgICovXG4gICAgZGVjb21wb3NlTm9kZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gZWxlbWVudC5yZW1vdmUoKS5jaGlsZHJlbigpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBDb21wb25lbnRDbGVhbmVyLmRlY29tcG9zZU5vZGUoYW5ndWxhci5lbGVtZW50KGNoaWxkcmVuW2ldKSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7QXR0cmlidXRlc30gYXR0cnNcbiAgICAgKi9cbiAgICBkZXN0cm95QXR0cmlidXRlczogZnVuY3Rpb24oYXR0cnMpIHtcbiAgICAgIGF0dHJzLiQkZWxlbWVudCA9IG51bGw7XG4gICAgICBhdHRycy4kJG9ic2VydmVycyA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7anFMaXRlfSBlbGVtZW50XG4gICAgICovXG4gICAgZGVzdHJveUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7U2NvcGV9IHNjb3BlXG4gICAgICovXG4gICAgZGVzdHJveVNjb3BlOiBmdW5jdGlvbihzY29wZSkge1xuICAgICAgc2NvcGUuJCRsaXN0ZW5lcnMgPSB7fTtcbiAgICAgIHNjb3BlLiQkd2F0Y2hlcnMgPSBudWxsO1xuICAgICAgc2NvcGUgPSBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1Njb3BlfSBzY29wZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICovXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbihzY29wZSwgZm4pIHtcbiAgICAgIHZhciBjbGVhciA9IHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXIoKTtcbiAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZmFjdG9yeSgnQ29tcG9uZW50Q2xlYW5lcicsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDb21wb25lbnRDbGVhbmVyO1xuICB9KTtcblxuICAvLyBvdmVycmlkZSBidWlsdGluIG5nLShldmVudG5hbWUpIGRpcmVjdGl2ZXNcbiAgKGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZ0V2ZW50RGlyZWN0aXZlcyA9IHt9O1xuICAgICdjbGljayBkYmxjbGljayBtb3VzZWRvd24gbW91c2V1cCBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2Vtb3ZlIG1vdXNlZW50ZXIgbW91c2VsZWF2ZSBrZXlkb3duIGtleXVwIGtleXByZXNzIHN1Ym1pdCBmb2N1cyBibHVyIGNvcHkgY3V0IHBhc3RlJy5zcGxpdCgnICcpLmZvckVhY2goXG4gICAgICBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmVOYW1lID0gZGlyZWN0aXZlTm9ybWFsaXplKCduZy0nICsgbmFtZSk7XG4gICAgICAgIG5nRXZlbnREaXJlY3RpdmVzW2RpcmVjdGl2ZU5hbWVdID0gWyckcGFyc2UnLCBmdW5jdGlvbigkcGFyc2UpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oJGVsZW1lbnQsIGF0dHIpIHtcbiAgICAgICAgICAgICAgdmFyIGZuID0gJHBhcnNlKGF0dHJbZGlyZWN0aXZlTmFtZV0pO1xuICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBmbihzY29wZSwgeyRldmVudDogZXZlbnR9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbihuYW1lLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBDb21wb25lbnRDbGVhbmVyLm9uRGVzdHJveShzY29wZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50Lm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgQ29tcG9uZW50Q2xlYW5lci5kZXN0cm95U2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgc2NvcGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICBDb21wb25lbnRDbGVhbmVyLmRlc3Ryb3lBdHRyaWJ1dGVzKGF0dHIpO1xuICAgICAgICAgICAgICAgICAgYXR0ciA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfV07XG5cbiAgICAgICAgZnVuY3Rpb24gZGlyZWN0aXZlTm9ybWFsaXplKG5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gbmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbihtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgICBtb2R1bGUuY29uZmlnKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICB2YXIgc2hpZnQgPSBmdW5jdGlvbigkZGVsZWdhdGUpIHtcbiAgICAgICAgJGRlbGVnYXRlLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiAkZGVsZWdhdGU7XG4gICAgICB9O1xuICAgICAgT2JqZWN0LmtleXMobmdFdmVudERpcmVjdGl2ZXMpLmZvckVhY2goZnVuY3Rpb24oZGlyZWN0aXZlTmFtZSkge1xuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoZGlyZWN0aXZlTmFtZSArICdEaXJlY3RpdmUnLCBbJyRkZWxlZ2F0ZScsIHNoaWZ0XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBPYmplY3Qua2V5cyhuZ0V2ZW50RGlyZWN0aXZlcykuZm9yRWFjaChmdW5jdGlvbihkaXJlY3RpdmVOYW1lKSB7XG4gICAgICBtb2R1bGUuZGlyZWN0aXZlKGRpcmVjdGl2ZU5hbWUsIG5nRXZlbnREaXJlY3RpdmVzW2RpcmVjdGl2ZU5hbWVdKTtcbiAgICB9KTtcbiAgfSkoKTtcbn0pKCk7XG4iLCIvKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG5PYmplY3Qua2V5cyhvbnMubm90aWZpY2F0aW9uKS5maWx0ZXIobmFtZSA9PiAhL15fLy50ZXN0KG5hbWUpKS5mb3JFYWNoKG5hbWUgPT4ge1xuICBjb25zdCBvcmlnaW5hbE5vdGlmaWNhdGlvbiA9IG9ucy5ub3RpZmljYXRpb25bbmFtZV07XG5cbiAgb25zLm5vdGlmaWNhdGlvbltuYW1lXSA9IChtZXNzYWdlLCBvcHRpb25zID0ge30pID0+IHtcbiAgICB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgPyAob3B0aW9ucy5tZXNzYWdlID0gbWVzc2FnZSkgOiAob3B0aW9ucyA9IG1lc3NhZ2UpO1xuXG4gICAgY29uc3QgY29tcGlsZSA9IG9wdGlvbnMuY29tcGlsZTtcbiAgICBsZXQgJGVsZW1lbnQ7XG5cbiAgICBvcHRpb25zLmNvbXBpbGUgPSBlbGVtZW50ID0+IHtcbiAgICAgICRlbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGNvbXBpbGUgPyBjb21waWxlKGVsZW1lbnQpIDogZWxlbWVudCk7XG4gICAgICByZXR1cm4gb25zLiRjb21waWxlKCRlbGVtZW50KSgkZWxlbWVudC5pbmplY3RvcigpLmdldCgnJHJvb3RTY29wZScpKTtcbiAgICB9O1xuXG4gICAgb3B0aW9ucy5kZXN0cm95ID0gKCkgPT4ge1xuICAgICAgJGVsZW1lbnQuZGF0YSgnX3Njb3BlJykuJGRlc3Ryb3koKTtcbiAgICAgICRlbGVtZW50ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9yaWdpbmFsTm90aWZpY2F0aW9uKG9wdGlvbnMpO1xuICB9O1xufSk7XG4iLCIvLyBjb25maXJtIHRvIHVzZSBqcUxpdGVcbmlmICh3aW5kb3cualF1ZXJ5ICYmIGFuZ3VsYXIuZWxlbWVudCA9PT0gd2luZG93LmpRdWVyeSkge1xuICBjb25zb2xlLndhcm4oJ09uc2VuIFVJIHJlcXVpcmUganFMaXRlLiBMb2FkIGpRdWVyeSBhZnRlciBsb2FkaW5nIEFuZ3VsYXJKUyB0byBmaXggdGhpcyBlcnJvci4galF1ZXJ5IG1heSBicmVhayBPbnNlbiBVSSBiZWhhdmlvci4nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG59XG4iLCIvKlxuQ29weXJpZ2h0IDIwMTMtMjAxNSBBU0lBTCBDT1JQT1JBVElPTlxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4qL1xuXG4oZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdvbnNlbicpLnJ1bihmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgIHZhciB0ZW1wbGF0ZXMgPSB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29ucy10ZW1wbGF0ZVwiXScpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGFuZ3VsYXIuZWxlbWVudCh0ZW1wbGF0ZXNbaV0pO1xuICAgICAgdmFyIGlkID0gdGVtcGxhdGUuYXR0cignaWQnKTtcbiAgICAgIGlmICh0eXBlb2YgaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChpZCwgdGVtcGxhdGUudGV4dCgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG59KSgpO1xuIl19
