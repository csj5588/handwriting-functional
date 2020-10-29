var Container = function(x) {
  this._value = x;
}

Container.of = function(x) { return new Container(x) }

/**
 * 这是本书的第一个容器，我们贴心地把它命名为 Container。
 * 我们将使用 Container.of 作为构造器（constructor），这样就不用到处去写糟糕的 new 关键字了，非常省心。
 * 实际上不能这么简单地看待 of 函数，但暂时先认为它是把值放到容器里的一种方式。

   我们来检验下这个崭新的盒子
 */

Container.of(3) // => Container(3)
Container.of("hotdogs") // => Container("hotdogs")
Container.of(Container.of({name: "yoda"})) // => Container(Container({name: "yoda" }))

/**
 * 如果用的是 node，那么你会看到打印出来的是 {__value: x}，而不是实际值 Container(x)；Chrome 打印出来的是正确的。
 * 不过这并不重要，只要你理解 Container 是什么样的就行了。有些环境下，你也可以重写 inspect 方法，但我们不打算涉及这方面的知识。
 * 在本书中，出于教学和美学上的考虑，我们将把概念性的输出都写成好像 inspect 被重写了的样子，因为这样写的教育意义将远远大于 {__value: x}。

   在继续后面的内容之前，先澄清几点：

   Container 是个只有一个属性的对象。尽管容器可以有不止一个的属性，但大多数容器还是只有一个。我们很随意地把 Container 的这个属性命名为 __value。
   __value 不能是某个特定的类型，不然 Container 就对不起它这个名字了。
   数据一旦存放到 Container，就会一直待在那儿。我们可以用 .__value 获取到数据，但这样做有悖初衷。
   如果把容器想象成玻璃罐的话，上面这三条陈述的理由就会比较清晰了。但是暂时，请先保持耐心。
 */