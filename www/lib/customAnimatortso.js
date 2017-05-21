/**
 * @Kingpin0509 - Michael Humann - West Weedtze Development
 * Copyright (c) 2017 (ae)Deutsche Mitte - http://deutschemitte.daskonstrukt.xyz
 * Custom Changes an der onsenui v2.1.0 - 2017-02-01
 */
// CUSTOM ANIMATOR
(function() {
    'use strict;';
    var module = angular.module('onsen');
    module.factory('customDropAnimation', function(NavigatorTransitionAnimator) {
        var customDropAnimation = NavigatorTransitionAnimator.extend({
            backgroundMask: angular.element(
                '<div style="position: absolute; width: 100%;' +
                'height: 100%; background-color: #ffffff;"></div>'
            ),
            push: function(enterPage, leavePage, callback) {
                var mask = this.backgroundMask.remove();
                leavePage.element[0].parentNode.insertBefore(mask[0], leavePage.element[0]);
                var maskClear = animit(mask[0])
                    .wait(0.6)
                    .queue(function(done) {
                        mask.remove();
                        done();
                    });
                animit.runAll(
                    maskClear,
                    animit(enterPage.element[0])
                    .queue({
                        css: {
                            transform: 'translate3D(0, -100%, 0)',
                        },
                        duration: 0
                    })
                    .queue({
                        css: {
                            transform: 'translate3D(0, 0, 0)',
                        },
                        duration: 0.4,
                        timing: 'cubic-bezier(.47,0,.47,1)'
                    })
                    // .wait(0.2) -> causes flicker sometimes
                    .resetStyle()
                    .queue(function(done) {
                        callback();
                        done();
                    }),
                    // dont move leaving page
                    animit(leavePage.element[0])
                );
            },
            pop: function(enterPage, leavePage, callback) {
                var mask = this.backgroundMask.remove();
                enterPage.element[0].parentNode.insertBefore(mask[0], enterPage.element[0]);
                animit.runAll(
                    animit(mask[0])
                    .wait(0.4)
                    .queue(function(done) {
                        mask.remove();
                        done();
                    }),
                    // dont move entering page
                    animit(enterPage.element[0]),
                    animit(leavePage.element[0])
                    .queue({
                        css: {
                            transform: 'translate3D(0, 0, 0)'
                        },
                        duration: 0
                    })
                    .queue({
                        css: {
                            transform: 'translate3D(0, -100%, 0)'
                        },
                        duration: 0.4,
                        timing: 'cubic-bezier(.1, .7, .1, 1)'
                    })
                    .wait(0.2)
                    .resetStyle()
                    .queue(function(done) {
                        callback();
                        done();
                    })
                );
            }
        });
        return customDropAnimation;
    });
})();

//
//var customAnimator = function(options) {
//    options = options || {};
//    this.timing = options.timing || 'ease';
//    this.duration = options.duration || 0.35;
//    this.delay = options.delay || 0.0;
//    this.delay0 = options.delay || 0.0;
//    this.delay1 = options.delay || 0.00;
//
//    var div = document.createElement('div');
//    div.innerHTML = '<div style="position: absolute; width: 100%; height: 100%; background-color: black; z-index: 2; background-image: url(../images/pictures_vertical/bg1.jpg) cover; opacity: 1;"></div>';
//    this.backgroundMask = div.firstChild;
//    this.blackMaskOpacity = 0.95;
//};
//
//customAnimator.prototype = Object.create(ons.NavigatorElement.NavigatorTransitionAnimator.prototype);
//
//customAnimator.prototype.push = function(enterPage, leavePage, done) {
//    this.backgroundMask.remove();
//    enterPage.parentNode.insertBefore(this.backgroundMask, enterPage.nextSibling);
//
//    ons.animit.runAll(
//
//        ons.animit(this.backgroundMask)
//        .saveStyle()
//        .queue({
//            opacity: this.blackMaskOpacity,
//            transform: 'translate3d(0, 0, 0)'
//        })
//        .wait(this.delay)
//        .queue({
//            opacity: 0.15
//        }, {
//            duration: this.duration,
//            timing: this.timing
//        })
//        .restoreStyle()
//        .queue(done => {
//            this.backgroundMask.remove();
//            done();
//        }),
//        ons.animit(enterPage)
//        .saveStyle()
//        .queue({
//            css: {
//                transform: 'translate3D(0%, 220px, 0px)',
//                height: '5%',
//                width: '100%',
//                opacity: 0.5
//            },
//            duration: 1
//        })
//        .wait(this.delay1)
//        .queue({
//            css: {
//                transform: 'translate3D(0px, 0px, 0px)',
//                height: '100%',
//                width: '100%',
//                opacity: 1
//            },
//            duration: this.duration,
//            timing: this.timing
//        })
//        .restoreStyle(),
//        ons.animit(leavePage)
//        .queue({
//            css: {
//                transform: 'translate3D(0px, 0px, 0px)',
//                height: '100%',
//                width: '100%',
//                display: 'block',
//                opacity: 0.9
//            },
//            duration: 1
//        })
//        .wait(this.delay0)
//        .queue({
//            css: {
//                opacity: 0.1,
//                height: '4%',
//                width: '100%',
//                transform: 'translate3D(0%,230px, 0px)',
//            },
//            duration: this.duration,
//            timing: this.timing
//        })
//        .wait(0.1)
//        .queue(function(finish) {
//            done();
//            finish();
//        })
//    );
//};
//
//ons.NavigatorElement.registerAnimator('customAnimator', customAnimator);