/**
 * 组合compose
 */

var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  }
}

// f 和 g都是函数，x是在它们之间通过“管道”传输的值.
// 组合看起来像是在饲养函数。你就是饲养员，选择两个有特点又遭你喜欢的函数，让它们结合，产下一个崭新的函数。组合的用法如下。

const _ = require('lodash');

const reduce = _.curry(function(fn, x, arr) {
  return arr.reduce(fn, x);
})

var toUpperCase = function(x) { return x.toUpperCase() }
var exclaim = function(x) { return x + '!'; }
var shout = compose(exclaim, toUpperCase);

shout('send in the clowns');
// SEND IN THE CLOWNS!

/**
 * 两个函数组合之后返回了一个新函数是完全讲得通的：组合某种类型（本例中是函数）的两个元素本就该生成一个该类型的元素。
 * 把两个乐高积木组合起来绝不可能得到一个林肯积木。所以这是有道理的，我们将在适当到时候探讨这方面的一些底层理论。
 * 
 * 在compose的定义中，g将先于f执行，因此就创建了一个从右到左的数据流。
 * 这样做的可读性远远高于嵌套一大堆的函数调用，如果不用组合，shout函数将会是这样的。
 */

var shout = function(x) {
  return exclaim(toUpperCase(x));
}

// 让代码从右向左运行，而不是由内向外运行，我觉得可以称之为“左倾”。我们来看一个顺序很重要的例子。

var head = function(x) { return x[0] };
var reverse = reduce(function(acc, x) { return [x].concat(acc); }, []);
var last = compose(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);
//=> 'uppercut'

/**
 * reverse 反转列表，head 取列表中的第一个元素；
 * 所以结果就是得到了一个 last 函数（译者注：即取列表的最后一个元素），
 * 虽然它性能不高。这个组合中函数的执行顺序应该是显而易见的。尽管我们可以定义一个从左向右的版本，
 * 但是从右向左执行更加能够反映数学上的含义——是的，组合的概念直接来自于数学课本。
 * 实际上，现在是时候去看看所有的组合都有的一个特性了。
 */

// 结合律
// var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
// true

// 这个特性就是结合律，符合结合律意味着不管你是把g和h分到一组，还是把f和g分到一组都不重要

compose(toUpperCase, compose(head, reverse));

// or
compose(compose(toUpperCase, head), reverse);

// 因为如何为compose的调用分组不重要，所以结果都是一样的。这也让我们有能力写一个可变的组合。

/**
 * 前面的例子中我们必须要写两个组合才行，但是既然组合是符合结合律的，我们就可以只写一个，
 * 而且相传多少个函数就传给它多少个，然后让它决定如何分组。
 */

var lastUpper = compose(toUpperCase, head, reverse);

lastUpper(['jumpkick', 'roundhose', 'uppercut'])
// => 'UPPERCUT';

var loudLastUpper = compose(exclaim, toUpperCase, head, reverse)

loudLastUpper(['jumpkick', 'roundhouse', 'uppercut'])
// => 'UPPERCUT!'

/**
 * 关于如何组合，并没有标准的答案——我们只是以自己喜欢的方式搭乐高积木罢了。
 * 通常来说，最佳实践是让组合可重用，就像 last 和 angry 那样。
 * 如果熟悉 Fowler 的《重构》一书的话，你可能会认识到这个过程叫做 “extract method”——只不过不需要关心对象的状态。
 */