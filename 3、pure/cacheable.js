/**
 * 可缓存性
 * 
 * 首先，纯函数总能够根据输入来做缓存。实现缓存的一种典型方式是memoize技术：
 */

var memoize = function(f) {
  var cache = {};

  return function() {
    var arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
    return cache[arg_str];
  };
};

var squareNumber = memoize(function(x) { return x * x });

squareNumber(4);
//=> 16

squareNumber(4); // 从缓存中读取输入值为 4 的结果
//=> 16

squareNumber(5);
//=> 25

squareNumber(5); // 从缓存中读取输入值为 5 的结果
//=> 25

// 值得注意的一点是，可以通过**延迟执行**的方式把不纯的函数转换为纯函数：

var pureHttpCall = memoize(function(url, params){
  return function() { return $.getJSON(url, params); }
});

/**
 * 这里有趣的地方在于我们并没有真正发送 http 请求——只是返回了一个函数，当调用它的时候才会发请求。这个函数之所以有资格成为纯函数，
 * 是因为它总是会根据相同的输入返回相同的输出：给定了 url 和 params 之后，它就只会返回同一个发送 http 请求的函数。

    我们的 memoize 函数工作起来没有任何问题，虽然它缓存的并不是 http 请求所返回的结果，而是生成的函数。

    现在来看这种方式意义不大，不过很快我们就会学习一些技巧来发掘它的用处。重点是我们可以缓存任意一个函数，不管它们看起来多么具有破坏性。
 */