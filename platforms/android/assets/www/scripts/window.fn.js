window.fn = {};
window.fn.open = function() {
  var menu = document.getElementById("menu");
  menu.open();
};
window.fn.openr = function() {
  var menur = document.getElementById("menur");
  menur.open();
};
window.fn.close = function() {
  var menu = document.getElementById("menu");
  menu.close();
};
window.fn.closesplitter = function() {
  splitter.right.close();
};
window.fn.load = function(page) {
  var navi = document.getElementById("navi");
  navi.resetToPage(page, {
    animation: "slide"
  });
  splitter.left.close();
  splitter.right.close();
};
window.fn.push = function(page) {
  var navi = document.getElementById("navi");
  navi.pushPage(page, {
    animation: "slide"
  });
};
window.fn.replace = function(page) {
  var navi = document.getElementById("navi");
  navi.replacePage(page, {
    animation: "fade"
  });
};

window.fn.toggle = function(el) {
  el.classList.toggle("active-item");
  el.nextElementSibling.classList.toggle("show");
};

window.fn.togglemenu = function(el) {
  var btns = document.querySelectorAll(".panel");
  Array.prototype.forEach.call(btns, function(el) {
    el.classList.remove("show");
  });
  el.nextElementSibling.classList.toggle("show");
};
window.fn.togglepanels = function(el) {
  var btns = document.querySelectorAll(".panel");
  Array.prototype.forEach.call(btns, function(el) {
    el.classList.remove("show");
  });
};
window.fn.active = function(el) {
  var btns = document.querySelectorAll(".active-item");
  Array.prototype.forEach.call(btns, function(el) {
    el.classList.remove("active-item");
  });
  var btns1 = document.querySelectorAll("panel");
  Array.prototype.forEach.call(btns1, function(el) {
    el.classList.remove("show");
  });
  el.classList.add("active-item");
};
window.fn.activemenu = function(el) {
  var btns = document.querySelectorAll("ons-list-header.list-header");
  Array.prototype.forEach.call(btns, function(el) {
    el.classList.remove("active-item");
  });
  el.classList.add("active-item");
};
window.fn.activesub = function(el) {
  var btns = document.querySelectorAll(".active-item");
  Array.prototype.forEach.call(btns, function(el) {
    el.classList.remove("active-item");
  });
  el.classList.add("active-item");
};
