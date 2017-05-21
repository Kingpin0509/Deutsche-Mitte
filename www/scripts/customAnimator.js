(function () {
    'use strict;';
    var module = angular.module('onsen');
    module.factory('customDropAnimation', function (NavigatorTransitionAnimator) {
        var customDropAnimation = NavigatorTransitionAnimator.extend({
            backgroundMask: angular.element('<div style="position: absolute; width: 100%;' + 'height: 100%; background-color: #ffffff;"></div>'),
            push: function (enterPage, leavePage, callback) {
                var mask = this.backgroundMask.remove();
                leavePage.element[0].parentNode.insertBefore(mask[0], leavePage.element[0]);
                var maskClear = animit(mask[0]).wait(0.6).queue(function (done) {
                    mask.remove();
                    done();
                });
                animit.runAll(maskClear, animit(enterPage.element[0]).queue({
                    css: {
                        transform: 'translate3D(0, -100%, 0)'
                    },
                    duration: 0
                }).queue({
                    css: {
                        transform: 'translate3D(0, 0, 0)'
                    },
                    duration: 0.4,
                    timing: 'cubic-bezier(.47,0,.47,1)'
                }).resetStyle().queue(function (done) {
                    callback();
                    done();
                }), animit(leavePage.element[0]));
            },
            pop: function (enterPage, leavePage, callback) {
                var mask = this.backgroundMask.remove();
                enterPage.element[0].parentNode.insertBefore(mask[0], enterPage.element[0]);
                animit.runAll(animit(mask[0]).wait(0.4).queue(function (done) {
                    mask.remove();
                    done();
                }), animit(enterPage.element[0]), animit(leavePage.element[0]).queue({
                    css: {
                        transform: 'translate3D(0, 0, 0)'
                    },
                    duration: 0
                }).queue({
                    css: {
                        transform: 'translate3D(0, -100%, 0)'
                    },
                    duration: 0.4,
                    timing: 'cubic-bezier(.1, .7, .1, 1)'
                }).wait(0.2).resetStyle().queue(function (done) {
                    callback();
                    done();
                }));
            }
        });
        return customDropAnimation;
    });
})();
