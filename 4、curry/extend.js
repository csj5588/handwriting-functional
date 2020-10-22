/**
 * curry的用处非常广泛，就像上面说的那样，只需要传给函数一些参数，就能得到一个新的函数。
 * 
 * 用map简单地把参数是单个元素的函数包裹一下，就能把它转换成参数为数组的函数。
 */

var getChildren = function(x) {
  return x.childNodes;
}

var allTheChildren = map(getChildren);

/**
 * 只传给函数一部分参数通常也叫做局部调用（partial application）,能够大量减少样板文件代码。
 * 考虑上面的allTheChildren函数，如果用lodash的普通map来写会是什么样的？
 */

var allTheChildren = function(elements) {
  return _.map(elements, getChildren);
}

/**
 * 通常我们不定义直接操作数组的函数，因为只需内联调用 map(getChildren) 就能达到目的。
 * 这一点同样适用于 sort、filter 以及其他的高阶函数（higher order function）（高阶函数：参数或返回值为函数的函数）。

  当我们谈论纯函数的时候，我们说它们接受一个输入返回一个输出。
  curry 函数所做的正是这样：每传递一个参数调用函数，就返回一个新函数处理剩余的参数。这就是一个输入对应一个输出啊。

  哪怕输出是另一个函数，它也是纯函数。当然 curry 函数也允许一次传递多个参数，但这只是出于减少 () 的方便。
 */