/**
 * ap，能够把一个functor的函数值应用到另一个functor的值上。
 */

// 实现

Container.of(add(2)).ap(Container.of(3));
// Container(5)

// all together now
Container.of(2).map(add).ap(Container.of(3));
// Container(5)

/**
 * 这样就大功告成了，而且代码干净整洁。可以看到，Container(3) 从嵌套的 monad 函数的牢笼中释放了出来。
 * 需要再次强调的是，本例中的 add 是被 map 所局部调用（partially apply）的，所以 add 必须是一个 curry 函数。
 * 
 * 可以这样定义一个 ap 函数：
 */

Container.prototype.ap = function(other_container) {
  return other_container.map(this._value);
}

/**
 * 记住，this.__value 是一个函数，将会接收另一个 functor 作为参数，所以我们只需 map 它。由此我们可以得出 applicative functor 的定义：

   applicative functor 是实现了 ap 方法的 pointed functor

   注意 pointed 这个前提，这是非常重要的一个前提，下面的例子会说明这一点。

   讲到这里，我已经感受到你的疑虑了（也或者是困惑和恐惧）；心态开放点嘛，ap 还是很有用的。在深入理解这个概念之前，我们先来探索一个特性。

   F.of(x).map(f) == F.of(f).ap(F.of(x))

   这行代码翻译成人类语言就是，map 一个 f 等价于 ap 一个值为 f 的 functor。
   或者更好的译法是，你既可以把 x 放到容器里然后调用 map(f)，也可以同时让 f 和 x 发生 lift（参看第 8 章），然后对他们调用 ap。
   这让我们能够以一种从左到右的方式编写代码：
 */

Maybe.of(add).ap(Maybe.of(2)).ap(Maybe.of(3));
// Maybe(5)

Task.of(add).ap(Task.of(2)).ap(Task.of(3));
// Task(5)

/**
 * 细心的读者可能发现了，上述代码中隐约有普通函数调用的影子。没关系，我们稍后会学习 ap 的 pointfree 版本；
 * 暂时先把这当作此类代码的推荐写法。通过使用 of，每一个值都被输送到了各个容器里的奇幻之地，
 * 就像是在另一个平行世界里，每个程序都可以是异步的或者是 null 或者随便什么值，
 * 而且不管是什么，ap 都能在这个平行世界里针对这些值应用各种各样的函数。这就像是在一个瓶子中造船。

   你注意到没？上例中我们使用了 Task，这是 applicative functor 主要的用武之地。现在我们来看一个更深入的例子。
 */
