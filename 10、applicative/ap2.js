/**
 * 手写 串起来 联系
 */
var _ = require('ramda');

// 辅助函数start
var add = _.curry(function(a, b) {
  return a + b;
})
// 辅助函数end

var Container = function(x) {
  this._value = x;
}

Container.of = function(x) {
  return new Container(x);
}

Container.prototype.map = function(fn) {
  return Container.of(fn(this._value));
}

Container.prototype.ap = function(other_container) {
  return other_container.map(this._value)
}

// realize
var f1 = Container.of(2).map(add).ap(Container.of(3));
console.log(f1)
var f2 = Container.of(add(2)).ap(Container.of(3));
console.log(f2)

// next
var f3 = Container.of(add).ap(Container.of(2)).ap(Container.of(3));
console.log(f3)