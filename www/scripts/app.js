        ons.bootstrap()
            .controller('AppController', function($scope) {
                this.load = function(page) {
                    $scope.splitter.content.load(page);
                    $scope.splitter.left.close();
                    $scope.splitter.right.close();
                };
                this.clos = function() {
                    $scope.splitter.right.close();
                };
                this.toggle = function() {
                    $scope.splitter.left.toggle();
                };
                this.toggle = function() {
                    $scope.splitter.right.toggle();
                };
                // Inside MyApp controller
                $scope.handler = function($event) {};
          });

        ons.ready(function() {

            console.log("Onsen UI is ready!");
////////////////////////////////////////////////
            // Hide Page
            document.addEventListener('hide', function(event) {
              document.getElementById('navi').classList.add('blur');
              document.getElementById('navi').classList.add('navi-hide');
              document.getElementById('navi').classList.remove('navi-show');
              document.getElementById('navi').classList.add('filter');

                console.log('hide');
            });
            // Init Page
            document.addEventListener('init', function(event) {
                document.getElementById('navi').classList.add('navi-init');
                document.getElementById('navi').classList.remove('navi-hide');
//              document.getElementById('modal').classList.remove('modal-hide');
                console.log('init');
            });
            // Destroy Page
            document.addEventListener('destroy', function(event) {
                document.getElementById('navi').classList.remove('navi-init');
                document.getElementById('navi').classList.add('navi-destroy');
                console.log('destroy');
            });
            // Show Page
            document.addEventListener('show', function(event) {
                document.getElementById('navi').classList.remove('blur');
                document.getElementById('navi').classList.add('navi-show');
                document.getElementById('navi').classList.remove('navi-destroy');
                document.getElementById('navi').classList.remove('filter');
//                document.getElementById('modal').classList.add('modal-hide');
                console.log('show');
            });
////////////////////////////////////////////////
            // Menu Left
            document.querySelector('ons-splitter-side')
                .addEventListener('preopen', function(e) {
                    document.getElementById('navi').classList.add('filter');
                    document.getElementById('navi').classList.add('blur');
                    document.getElementById('navi').classList.add('menu-left-open');
                    document.getElementById('menu-left').classList.add('ons-splitter-shadow-menu');
                });
            document.querySelector('ons-splitter-side')
                .addEventListener('postopen', function(e) {
                });
            document.querySelector('ons-splitter-side')
                .addEventListener('preclose', function(e) {
                    document.getElementById('navi').classList.remove('menu-left-open');
                    document.getElementById('navi').classList.add('menu-left-close');
                });
            document.querySelector('ons-splitter-side')
                .addEventListener('postclose', function(e) {
                    document.getElementById('menu-left').classList.remove('ons-splitter-shadow-menu');
                    document.getElementById('navi').classList.remove('menu-left-close');
                    document.getElementById('navi').classList.remove('blur');
                    document.getElementById('navi').classList.remove('filter');
                });
            // Menu Right
            document.querySelector("ons-splitter-side#menur")
                .addEventListener('preopen', function(e) {
                    document.getElementById('menu-right').classList.add("ons-splitter-shadow-menur");
                    document.getElementById('navi').classList.add("menu-right-open");
                    document.getElementById('navi').classList.add("blur");
                });
            document.querySelector("ons-splitter-side#menur")
                .addEventListener('postopen', function(e) {});
            document.querySelector("ons-splitter-side#menur")
                .addEventListener('preclose', function(e) {
                    document.getElementById('navi').classList.add("menu-right-close");
                    document.getElementById('menu-right').classList.remove("ons-splitter-shadow-menur");
                    document.getElementById('navi').classList.remove("menu-right-open");
                });
            document.querySelector("ons-splitter-side#menur")
                .addEventListener('postclose', function(e) {
                    document.getElementById('navi').classList.remove("menu-right-close");
                    document.getElementById('navi').classList.remove("blur");
                });
            navigator.splashscreen.hide();
        });
////////////////////////////////////////////////

        function setColor(id) {
            // Menu Left
            // Programm
            document.getElementById('ubersicht').style.color = "white";
            document.getElementById('flyer').style.color = "white";
            document.getElementById('flugblatt').style.color = "white";
            document.getElementById('kurzprogrammsub').style.color = "white";
            document.getElementById('videos').style.color = "white";
            // Politik
            document.getElementById('freundschaftderu').style.color = "white";
            document.getElementById('nahost').style.color = "white";
            document.getElementById('finanzierung').style.color = "white";
            // Partei
            document.getElementById('merkmale').style.color = "white";
            document.getElementById('grundlegendes').style.color = "white";
            document.getElementById('fuhrungskrafte').style.color = "white";
            document.getElementById('beitrag').style.color = "white";
            document.getElementById('spenden').style.color = "white";
            // App
            document.getElementById('splashscreen').style.color = "white";
            document.getElementById('wahl2017').style.color = "white";
            document.getElementById('sitemap').style.color = "white";
            // Last Items
            document.getElementById('faq').style.color = "white";
            document.getElementById('kontakt').style.color = "white";
            // Menu Right
            document.getElementById('aussenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('innenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('finanzpolitik').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('wirtschaft').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('arbeit').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('verteidigung').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('bildung').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('familie').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('gesundheit').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('umwelt').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('ernahrung').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('verkehr').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('zusammenarbeit').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('justiz').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('programm').style.color = "white";
            document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('politik').style.color = "white";
            document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('partei').style.color = "white";
            document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('app').style.color = "white";
            document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
            // Active Link
            document.getElementById(id).style.color = "rgba(250, 125, 9, 0.6)";
            // First Items
            document.getElementById('willkommen').style.color = "white";
            document.getElementById('kurzprogramm').style.color = "white";
            document.getElementById('ytvideos').style.color = "white";
        };

        function setColorleftmain(id) {
            // Menu Left
            // Programm
            document.getElementById('ubersicht').style.color = "white";
            document.getElementById('flyer').style.color = "white";
            document.getElementById('flugblatt').style.color = "white";
            document.getElementById('kurzprogrammsub').style.color = "white";
            document.getElementById('videos').style.color = "white";
            // Politik
            document.getElementById('freundschaftderu').style.color = "white";
            document.getElementById('nahost').style.color = "white";
            document.getElementById('finanzierung').style.color = "white";
            // Partei
            document.getElementById('merkmale').style.color = "white";
            document.getElementById('grundlegendes').style.color = "white";
            document.getElementById('fuhrungskrafte').style.color = "white";
            document.getElementById('beitrag').style.color = "white";
            document.getElementById('spenden').style.color = "white";
            // App
            document.getElementById('splashscreen').style.color = "white";
            document.getElementById('wahl2017').style.color = "white";
            document.getElementById('sitemap').style.color = "white";
            // Last Items
            document.getElementById('faq').style.color = "white";
            document.getElementById('kontakt').style.color = "white";
            // Menu Right
            document.getElementById('aussenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('innenpolitik').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('finanzpolitik').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('wirtschaft').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('arbeit').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('verteidigung').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('bildung').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('familie').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('gesundheit').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('umwelt').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('ernahrung').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('verkehr').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('zusammenarbeit').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('justiz').style.color = "rgba(0, 83, 151, 0.8)";
            document.getElementById('programm').style.color = "white";
            document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('politik').style.color = "white";
            document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('partei').style.color = "white";
            document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('app').style.color = "white";
            document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
            // Active Link
            //document.getElementById(id).style.backgroundColor = "rgba(0, 73, 138,0.2)";
            // First Items
            document.getElementById('willkommen').style.color = "white";
            document.getElementById('kurzprogramm').style.color = "white";
            document.getElementById('ytvideos').style.color = "white";

            document.getElementById('programm').style.color = "white";
            document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('politik').style.color = "white";
            document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('partei').style.color = "white";
            document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('app').style.color = "white";
            document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
        };

        function setColorleft(id) {
            document.getElementById('programm').style.color = "white";
            document.getElementById('programm').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('politik').style.color = "white";
            document.getElementById('politik').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('partei').style.color = "white";
            document.getElementById('partei').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById('app').style.color = "white";
            document.getElementById('app').style.backgroundColor = "rgb(0, 73, 138)";
            document.getElementById(id).style.color = "white";
            document.getElementById(id).style.backgroundColor = "rgba(210, 115, 39, 1)";
        };
        
var showPopover = function(target) {
  document
    .getElementById('popover')
    .show(target);
};
var hidePopover = function() {
  document
    .getElementById('popover')
    .hide();
};

var showPopover1 = function(target) {
  document
    .getElementById('popover1')
    .show(target);
};
var hidePopover1 = function() {
  document
    .getElementById('popover1')
    .hide();
};




         //  ngModule.animation('.fold-animation', ['$animateCss', function($animateCss) {
         //     return {
         //       enter: function(element, doneFn) {
         //          var height = element[0].offsetHeight;
         //      return $animateCss(element, {
         //         from: { height:'0px' },
         //          to: { height:height + 'px' },
         //          duration: 1 // one second
         //        });
         //       }
         //     };
         //  }]);
         // * `$animateCss` is very versatile and intelligent when it comes to figuring out what configurations to apply to the element to ensure the animation
         // * works with the options provided. Say for example we were adding a class that contained a keyframe value and we wanted to also animate some inline
         // * styles using the `from` and `to` properties.
         // *
         // * ```js
         // var animator = $animateCss(element, {
         //   from: { background:'red' },
         //   to: { background:'blue' }
         // });
         // animator.start();
         // ```
         // * ```js
         // var animator = $animateCss(element, { ... });
         // * ```
         // *
         // * Now what do the contents of our `animator` variable look like:
         // *
         // * ```js
         // * {
         // *   // starts the animation
         // *   start: Function,
         // *
         // *   // ends (aborts) the animation
         // *   end: Function
         // * }
         // * ```
         //
         //angular.module('onsen');
         //angular.module('.fade', [
         //  'ngAnimate'
         //]);
         //ons.ready(function() {
         //   ngModule.animation('.fade', ['$animateCss', function($animateCss) {
         //   return {
         //     enter: function(element, doneFn) {
         //       var height = element[0].offsetHeight;
         //       return $animateCss(element, {
         //         addClass: 'red large-text pulse-twice',
         //         easing: 'ease-out',
         //         from: { height:'0px' },
         //         to: { height:height + 'px' },
         //         duration: 2 // one second
         //       });
         //     }
         //   };
         // }]);
         //});     
         //ons.bootstrap('myApp', ['ngAnimate']);
         //
         //var fade = $animateCss(element, {
         //from: { background:'red' },
         //to: { background:'blue' }
         //});
         //animator.start();
         //angular.module('myApp').controller("AppController", function($scope) {});