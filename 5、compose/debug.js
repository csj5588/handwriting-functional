/**
 * 组合的一个常见错误是，在没有局部调用之前，就组合类似map这样接受两个参数的函数。
 */

// 错误做法：我们传给了angry一个数组，根本不知道最后传给map的是什么东西。
var latin = compose(map, angry, reverse);

latin(['frog', 'eyes']);
// error

// 正确做法：每个函数都接受一个实际参数。
var latin = compose(map(angry), reverse);

latin(['frog', 'eyes']);
// ["EYES!", "FROG!"])

// 如果在debug组合的时候遇到了困难，那么可以使用下面这个使用的，但是不纯的trace函数来追踪代码的执行情况。

var trace = curry(function(tag, x) {
  console.log(tag, x);
  return x;
})

var dasherize = compose(join('-'), toLower, split(' '), replace('/\s{2,}/ig', ' '));

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined

// 这里报错了，来trace下：

var dasherize = compose(join('-'), toLower, trace("after split"), split(' '), replace('/\s{2,}/ig', ' '));

// after split [ 'The', 'world', 'is', 'a', 'vampire' ]

// 啊！toLower 的参数是一个数组，所以需要先用 map 调用一下它。

var dasherize = compose(join('-'), map(toLower), split(' '), replace(/\s{2,}/ig, ' '));

dasherize('The world is a vampire');

// 'the-world-is-a-vampire'

/**
 * trace函数允许我们在某个特定的点观察数据以便debug。像haskell和purescript之类的语言出于开发的方便
 * 也都提供了类似的函数。
 * 
 * 组合将成为我们构造程序的工具，而且幸运的是，它背后是有一个强大的理论做支撑的。
 * 让我们研究研究这个理论 - 范畴学。
 */