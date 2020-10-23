/**
 * pointfree模式是指，永远不必说出你的数据。
 * 咳咳对不起（译者注：此处原文是“Pointfree style means never having to say your data”，
 * 源自 1970 年的电影 Love Story 里的一句著名台词“Love means never having to say you're sorry”。
 * 紧接着作者又说了一句“Excuse me”，大概是一种幽默）。
 * 它的意思是说，函数无须提及将要操作的数据是什么样的。
 * 一等公民的函数、柯里化（curry）以及组合协作起来非常有助于实现这种模式。
 */

// 辅助函数end
const { curry } = require('lodash')

var compose = function(f, g) {
  return function(x) {
    return f(g(x))
  }
}

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var toLowerCase = function(x) {
  return x.toLowerCase();
}

// 辅助函数end

// 非pointfree
var snake = function(word) {
  return word.toLowerCase().replace(/\s+/ig, '_');
}

// pointfree
var snake = compose(replace(/\s/ig, '_'), toLowerCase);

console.log(snake('lalall_sss'))

/**
 * 看到 replace 是如何被局部调用的了么？
 * 这里所做的事情就是通过管道把数据在接受单个参数的函数间传递。
 * 利用 curry，我们能够做到让每个函数都先接收数据，然后操作数据，
 * 最后再把数据传递到下一个函数那里去。另外注意在 pointfree 版本中，
 * 不需要 word 参数就能构造函数；而在非 pointfree 的版本中，必须要有 word 才能进行一切操作。
 * 
 * 再来看一个例子
 */

var toUpperCase = function(x) { return x.toUpperCase() }

// 非pointfree，因为提到了数据name
var initials = function(name) {
  return name.split(' ').map(compose(toUpperCase, head)).join('. ');
};

// pointfree
var initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '));

initials("hunter stockton thompson");
// 'H. S. T'

/**
 * 另外，pointfree模式能够帮助我们减少不必要的命名，让代码保持简洁和通用。
 * 对函数式代码来说，pointfree是非常好对石蕊实验，因为它能告诉我们一个函数是否是接受输入返回输出的小函数。
 * 比如while循环是不能组合的。不过你也要警惕，pointfree就像是一把双刃剑，有时候也能混淆视听。
 * 并非所有的函数式代码都是pointfree的，不过这没关系。可以使用它的时候就使用，不能使用的时候就用普通函数。
 * 
 * 石蕊实验：https://baike.baidu.com/item/%E7%9F%B3%E8%95%8A%E8%AF%95%E6%B6%B2/3887373?fr=aladdin
 */

