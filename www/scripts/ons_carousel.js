var prev = function() {
  var carousel = document.getElementById("carousel");
  carousel.prev();
};
var next = function() {
  var carousel = document.getElementById("carousel");
  carousel.next();
};
ons.ready(function() {
  var carousel = document.addEventListener("postchange", function(event) {
    console.log("Changed to " + event.activeIndex);
  });
});

var prev1 = function() {
  var carousel1 = document.getElementById("carousel1");
  carousel1.prev();
};
var next1 = function() {
  var carousel1 = document.getElementById("carousel1");
  carousel1.next();
};
ons.ready(function() {
  var carousel1 = document.addEventListener("postchange", function(event) {
    console.log("Changed to " + event.activeIndex);
  });
});

var prev2 = function() {
  var carousel2 = document.getElementById("carousel2");
  carousel2.prev();
};
var next2 = function() {
  var carousel2 = document.getElementById("carousel2");
  carousel2.next();
};
ons.ready(function() {
  var carousel2 = document.addEventListener("postchange", function(event) {
    console.log("Changed to " + event.activeIndex);
  });
});

var prevbeitrag = function() {
  var carouselbeitrag = document.getElementById("carouselbeitrag");
  carouselbeitrag.prev();
};
var nextbeitrag = function() {
  var carouselbeitrag = document.getElementById("carouselbeitrag");
  carouselbeitrag.next();
};
ons.ready(function() {
  var carouselbeitrag = document.addEventListener("postchange", function(
    event
  ) {
    console.log("Changed to " + event.activeIndex);
  });
});
