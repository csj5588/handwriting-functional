/**
 * 问题 1: 通过局部调用 移除所有参数
 */

// 答案start：
const _  = require('lodash');

const split = _.curry(function (what, target) {
  return target.split(what).join('');
})

const splitSpaces = split(' ');

// 答案end：

var words = function(str) {
  return splitSpaces(str);
}

// output
const str = 'ab c';
console.log(words(str));

/**
 * 问题 2: 使用 `map` 创建一个新的 `words` 函数，使之能够操作字符串数组
 */

// 答案start：

const map = _.curry(function (fn, arr) {
  return arr.map(fn);
})

const sentences = function(arr) {
  return map(splitSpaces, arr)
}
// 答案end：


// output
const strArr = ['ab c', 'b cd'];


console.log(sentences(strArr));

/**
 * 问题 3：通过局部调用移除所有参数。
 */

const filter = _.curry(function(fn, arr) {
  return arr.filter(fn);
})

const match = _.curry(function(what, str) {
  return str.match(what);
})


const matchQs = match(/q/i);

var filterQs = function(xs) {
  return filter(matchQs, xs);
};

console.log(filterQs(['qqqqqxx', 'aaa']))

/**
 * 问题 4: 使用帮助函数 _keepHighest 重构 max 使之成为curry函数
 */

var _keepHighest = function(x, y) { return x >= y ? x : y; };

var max = function(xs) {
  return reduce(function(acc, x) {
    return _keepHighest(acc, x);
  }, -Infinity, xs);
};
// ??