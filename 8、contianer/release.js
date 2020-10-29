/**
 * 释放容器里的值
   人们经常忽略的一个事实是：任何事物都有个最终尽头。那些会产生作用的函数，不管它们是发送 JSON 数据，还是在屏幕上打印东西，
   还是更改文件系统，还是别的什么，都要有一个结束。但是我们无法通过 return 把输出传递到外部世界，
   必须要运行这样或那样的函数才能传递出去。关于这一点，可以借用禅宗公案的口吻来叙述：“如果一个程序运行之后没有可观察到的作用，那它到底运行了没有？”。
   或者，运行之后达到自身的目的了没有？有可能它只是浪费了几个 CPU 周期然后就去睡觉了...

   应用程序所做的工作就是获取、更改和保存数据直到不再需要它们，对数据做这些操作的函数有可能被 map 调用，
   这样的话数据就可以不用离开它温暖舒适的容器。讽刺的是，有一种常见的错误就是试图以各种方法删除 Maybe 里的值，
   好像这个不确定的值是魔鬼，删除它就能让它突然显形，然后一切罪恶都会得到宽恕似的（译者注：此处原文应该是源自圣经）。
   要知道，我们的值没有完成它的使命，很有可能是其他代码分支造成的。我们的代码，就像薛定谔的猫一样，在某个特定的时间点有两种状态，
   而且应该保持这种状况不变直到最后一个函数为止。这样，哪怕代码有很多逻辑性的分支，也能保证一种线性的工作流。

   不过，对容器里的值来说，还是有个逃生口可以出去。也就是说，如果我们想返回一个自定义的值然后还能继续执行后面的代码的话，
   是可以做到的；要达到这一目的，可以借助一个帮助函数 maybe：

   //  maybe :: b -> (a -> b) -> Maybe a -> b
   var maybe = curry(function(x, f, m) {
    return m.isNothing() ? x : f(m.__value);
   });

   //  getTwenty :: Account -> String
   var getTwenty = compose(
     maybe("You're broke!", finishTransaction), withdraw(20)
   );


  getTwenty({ balance: 200.00});
  // "Your balance is $180.00"

  getTwenty({ balance: 10.00});
  // "You're broke!"
  这样就可以要么返回一个静态值（与 finishTransaction 返回值的类型一致），要么继续愉快地在没有 Maybe 的情况下完成交易。
  maybe 使我们得以避免普通 map 那种命令式的 if/else 语句：if(x !== null) { return f(x) }。

  引入 Maybe 可能会在初期造成一些不适。Swift 和 Scala 用户知道我在说什么，因为这两门语言的核心库里就有 Maybe 的概念，
  只不过伪装成 Option(al) 罢了。被迫在任何情况下都进行空值检查（甚至有些时候我们可以确定某个值不会为空），的确让大部分人头疼不已。
  然而随着时间推移，空值检查会成为第二本能，说不定你还会感激它提供的安全性呢。不管怎么说，空值检查大多数时候都能防止在代码逻辑上偷工减料，让我们脱离危险。

  编写不安全的软件就像用蜡笔小心翼翼地画彩蛋，画完之后把它们扔到大街上一样（译者注：意思是彩蛋非常易于寻找。
  来源于复活节习俗，人们会藏起一些彩蛋让孩子寻找），或者像用三只小猪警告过的材料盖个养老院一样（译者注：来源于“三只小猪”童话故事）。
  Maybe 能够非常有效地帮助我们增加函数的安全性。

  有一点我必须要提及，否则就太不负责任了，那就是 Maybe 的“真正”实现会把它分为两种类型：一种是非空值，另一种是空值。
  这种实现允许我们遵守 map 的 parametricity 特性，因此 null 和 undefined 能够依然被 map 调用，
  functor 里的值所需的那种普遍性条件也能得到满足。所以你会经常看到 Some(x) / None 或者 Just(x) / Nothing 这样的容器类型在做空值检查，而不是 Maybe
 */