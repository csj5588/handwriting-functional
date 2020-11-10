/**
 * 我们尚未对衍生函数（derived function）着墨过多。
 * 不过看到本书介绍的所有这些接口都互相依赖并遵守一些定律，那么我们就可以根据一些强接口来定义一些弱接口了。

   比如，我们知道一个 applicative 首先是一个 functor，所以如果已经有一个 applicative 实例的话，毫无疑问可以依此定义一个 functor。

   这种完美的计算上的大和谐（computational harmony）之所以存在，是因为我们在跟一个数学“框架”打交道。
   哪怕是莫扎特在小时候就下载了 ableton（译者注：一款专业的音乐制作软件），他的钢琴也不可能弹得更好。

   前面提到过，of/ap 等价于 map，那么我们就可以利用这点来定义 map：
 */

// 从 of/ap 衍生出的 map
X.prototype.map = function (f) {
  return this.constructor.of(f).ap(this);
}

/**
 * monad 可以说是处在食物链的顶端，因此如果已经有了一个 chain 函数，那么就可以免费得到 functor 和 applicative：
 */

// 从 chain 衍生出的 map
X.prototype.map = function(f) {
  var m = this;
  return m.chain(function(a) {
    return m.constructor.of(f(a));
  });
}

// 从 chain/map 衍生出的 ap
X.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
};

/**
 * 定义一个 monad，就既能得到 applicative 也能得到 functor。这一点非常强大，
 * 相当于这些“开瓶器”全都是免费的！我们甚至可以审查一个数据类型，然后自动化这个过程。

   应该要指出来的一点是，ap 的魅力有一部分就来自于并行的能力，所以通过 chain 来定义它就失去了这种优化。
   即便如此，开发者在设计出最佳实现的过程中就能有一个立即可用的接口，也是很好的。

   为啥不直接使用 monad？因为最好用合适的力量来解决合适的问题，一分不多，一分不少。
   这样就能通过排除可能的功能性来做到最小化认知负荷。因为这个原因，相比 monad，我们更倾向于使用 applicative。

   向下的嵌套结构使得 monad 拥有串行计算、变量赋值和暂缓后续执行等独特的能力。
   不过见识到 applicative 的实际用例之后，你就不必再考虑上面这些问题了。

   下面，来看看理论知识。
 */