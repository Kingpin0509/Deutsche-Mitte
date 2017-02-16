// This is a JavaScript file

/**
 * @Kingpin0509 - Michael Humann - West Weedtze Development
 * Copyright (c) 2017 (ae)Deutsche Mitte - http://deutschemitte.daskonstrukt.xyz
 * Custom Changes an der onsenui v2.1.0 - 2017-02-01
 */

//Window.fn
window.fn = {};
window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};
window.fn.load = function(page) {
  var menu = document.getElementById('menu');
  var navi = document.getElementById('navi');
  menu.close();
  navi.resetToPage(page, { animation: 'fade' });
};
window.fn.load = function(page) {
  var menu = document.getElementById('menu');
  var navi = document.getElementById('navi');
  menu.close();
  navi.bringPageTop(page, { animation: 'fade' });
};

//carousel
var prev = function() {
  var carousel = document.getElementById('carousel');
  carousel.prev();
};
var next = function() {
  var carousel = document.getElementById('carousel');
  carousel.next();
};
ons.ready(function() {
  var carousel = document.addEventListener('postchange', function(event) {
    console.log('Changed to ' + event.activeIndex)
  });
});


// CUSTOM ANIMATOR

var customAnimator = function(options) {
  options = options || {};

  this.timing = options.timing || 'ease';
  this.duration = options.duration || 0.4;
  this.delay = options.delay || 0;

  var div = document.createElement('div');
  div.innerHTML = '<div style="position: absolute; width: 100%; height: 100%; z-index: 2; background-color: black; opacity: 0;"></div>';
  this.backgroundMask = div.firstChild;
  this.blackMaskOpacity = 0.4;
};

customAnimator.prototype = Object.create(ons.NavigatorElement.NavigatorTransitionAnimator.prototype);

customAnimator.prototype.push = function(enterPage, leavePage, done) {
  this.backgroundMask.remove();
  enterPage.parentNode.insertBefore(this.backgroundMask, enterPage.nextSibling);

  ons.animit.runAll(

    ons.animit(this.backgroundMask)
      .saveStyle()
      .queue({
        opacity: this.blackMaskOpacity,
        transform: 'translate3d(0, 0, 0)'
      })
      .wait(this.delay)
      .queue({
        opacity: 0
      }, {
        duration: this.duration,
        timing: this.timing
      })
      .restoreStyle()
      .queue(done => {
        this.backgroundMask.remove();
        done();
      }),

    ons.animit(enterPage)
      .saveStyle()
      .queue({
        css: {
          transform: 'translate3D(-45%, 0px, 0px)',
          opacity: 0.9
        },
        duration: 0
      })
      .wait(this.delay)
      .queue({
        css: {
          transform: 'translate3D(0px, 0px, 0px)',
          opacity: 1.0
        },
        duration: this.duration,
        timing: this.timing
      })
      .restoreStyle(),

    ons.animit(leavePage)
      .queue({
        css: {
          transform: 'translate3D(0px, 0px, 0px)',
          zIndex: 10000,
          display: 'block'
        },
        duration: 0
      })
      .wait(this.delay)
      .queue({
        css: {
          transform: 'translate3D(100%, 0px, 0px)'
        },
        duration: this.duration,
        timing: this.timing
      })
      .wait(0.2)
      .queue(function(finish) {
        done();
        finish();
      })
  );
};

ons.NavigatorElement.registerAnimator('customAnimator', customAnimator);
;


// ons.bootstrap();
angular.module('myApp', ['onsen', 'ngAnimate']).controller('MyCtrl', function($scope) {
  $scope.groups = [];
  for (var i = 0; i < 10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j = 0; j < 3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

});
