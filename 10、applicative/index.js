/**
 * applicative
 * 
 * 让不同的functor相互应用的事？相互应用到底是个什么意思
 * 
 * 要回答这些问题，我们可以从下面这个场景讲起，可能你已经碰到过这种场景了。
 * 假设有两个同类型的 functor，我们想把这两者作为一个函数的两个参数传递过去来调用这个函数。
 * 简单的例子比如让两个 Container 的值相加：
 */

// 这样是行不通的，因为 2 和 3 都藏在瓶子里。
add(Container.of(2), Container.of(3));
//NaN

// 使用可靠的map函数试一下
var container_of_add_2 = map(add, Container.of(2));
// Container(add(2));

/**
 * 这时候我们创建了一个Container，它的内部的值是一个局部调用的（partially applied）的函数。
 * 确切点讲就是，我们想让 Container(add(2)) 中的 add(2) 应用到 Container(3) 中的 3 上来完成调用。
 * 也就是说，我们想把一个 functor 应用到另一个上。
 * 
 * 巧的是，完成这种任务的工具已经存在了，即 chain 函数。
 * 我们可以先 chain 然后再 map 那个局部调用的 add(2)，就像这样：
 */

Container.of(2).chain(function(two) {
  return Container.of(3).map(add(two));
});

/**
 * 只不过，这种方式有一个问题，那就是monad的顺序执行问题：所有的代码都只会在前一个monad执行完毕之后才执行。
 * 想想看，我们的这两个值足够强健且相互独立，如果仅仅为了满足monad的顺序要求而延迟Container(3)的创建，
 * 我觉得是非常没有必要的。
 * 
 * 事实上，当遇到这种问题的时候，要是能够无需借助这些不必要的函数和变量，以一种简明扼要的方式把一个functor的值应用到另一个应用上就好了。
 */