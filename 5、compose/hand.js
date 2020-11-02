var _ = require('ramda');

// 左倾
var compose = function () {
  let fns = Array.from(arguments)
  return function (data) {
    return fns.reverse().reduce(function (pre, item) {
      return item(pre)
    }, data)
  }
}

var add = function (x, y) {
  return x + y;
}

var mul = function (x, y) {
  return x * y;
}

var result = compose(_.curry(add)(1), _.curry(mul)(2));

console.log(result(3));


// first
// var compose = function () {
//   let fns = Array.from(arguments)
//   return function (data) {
//     return fns.reverse().reduce(function (pre, item) {
//       return item(pre);
//     }, data)
//   }
// }

// // two
// var compose = function () {
//   let fns = Array.from(arguments);
//   return function (data) {
//     return fns.reverse().reduce(function (pre, item) {
//       return item(pre);
//     }, data)
//   }
// }

// // three
// var compose = function() {
//   let fns = Array.from(arguments);
//   return function(data) {
//     return fns.reverse().reduce(function(pre, item) {
//       return item(pre);
//     }, data);
//   }
// }

// // four
// var compose = function() {
//   let fns = Array.from(arguments);
//   return function(data) {
//     return fns.reverse().reduce(function(pre, item) {
//       return item(pre);
//     }, data);
//   }
// }

// mission complete