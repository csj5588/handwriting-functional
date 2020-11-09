/**
 * chain 函数
 * 
 * 你可能已经从上面的例子中注意到这种模式了：我们总是在紧跟着 map 的后面调用 join。让我们把这个行为抽象到一个叫做 chain 的函数里。
 */

//  chain :: Monad m => (a -> m b) -> m a -> m b
var chain = curry(function(f, m){
  return m.map(f).join(); // 或者 compose(join, map(f))(m)
});

/**
 * 这里仅仅是把 map/join 套餐打包到一个单独的函数中。如果你之前了解过 monad，那你可能已经看出来 chain 叫做 >>=（读作 bind）或者 flatMap；
 * 都是同一个概念的不同名称罢了。我个人认为 flatMap 是最准确的名称，但本书还是坚持使用 chain，
 * 因为它是 JS 里接受程度最高的一个。我们用 chain 重构下上面两个例子：
 */

// map/join
var firstAddressStreet = compose(
  join, map(safeProp('street')), join, map(safeHead), safeProp('addresses')
);

// chain
var firstAddressStreet = compose(
  chain(safeProp('street')), chain(safeHead), safeProp('addresses')
);

// map/join
var applyPreferences = compose(
  join, map(setStyle('#main')), join, map(log), map(JSON.parse), getItem
);

// chain
var applyPreferences = compose(
  chain(setStyle('#main')), chain(log), map(JSON.parse), getItem
);

/**
 * 我把所有的 map/join 都替换为了 chain，这样代码就显得整洁了些。
 * 整洁固然是好事，但 chain 的能力却不止于此——它更多的是龙卷风而不是吸尘器。
 * 因为 chain 可以轻松地嵌套多个作用，因此我们就能以一种纯函数式的方式来表示 序列（sequence） 和 变量赋值（variable assignment）。
 */

// getJSON :: Url -> Params -> Task JSON
// querySelector :: Selector -> IO DOM


getJSON('/authenticate', {username: 'stale', password: 'crackers'})
  .chain(function(user) {
    return getJSON('/friends', {user_id: user.id});
});
// Task([{name: 'Seimith', id: 14}, {name: 'Ric', id: 39}]);


querySelector("input.username").chain(function(uname) {
  return querySelector("input.email").chain(function(email) {
    return IO.of(
      "Welcome " + uname.value + " " + "prepare for spam at " + email.value
    );
  });
});
// IO("Welcome Olivia prepare for spam at olivia@tremorcontrol.net");


Maybe.of(3).chain(function(three) {
  return Maybe.of(2).map(add(three));
});
// Maybe(5);


Maybe.of(null).chain(safeProp('address')).chain(safeProp('street'));
// Maybe(null);

/**
 * 本来我们可以用 compose 写上面的例子，但这将需要几个帮助函数，而且这种风格怎么说都要通过闭包进行明确的变量赋值。
 * 相反，我们使用了插入式的 chain。顺便说一下，chain 可以自动从任意类型的 map 和 join 衍生出来，就像这样：t.prototype.chain = function(f) { return this.map(f).join(); }。
 * 如果手动定义 chain 能让你觉得性能会好点的话（实际上并不会），我们也可以手动定义它，尽管还必须要费力保证函数功能的正确性——也就是说，
 * 它必须与紧接着后面有 join 的 map 相等。如果 chain 是简单地通过结束调用 of 后把值放回容器这种方式定义的，
 * 那么就会造成一个有趣的后果，即可以从 chain 那里衍生出一个 map。同样地，我们还可以用 chain(id) 定义 join。
 * 听起来好像是在跟魔术师玩德州扑克，魔术师想要什么牌就有什么牌；但是就像大部分的数学理论一样，所有这些原则性的结构都是相互关联的。
 * fantasyland 仓库中提到了许多上述衍生概念，这个仓库也是 JavaScript 官方的代数数据结构（algebraic data types）标准。

   好了，我们来看上面的例子。第一个例子中，可以看到两个 Task 通过 chain 连接形成了一个异步操作的序列——它先获取 user，
   然后用 user.id 查找 user 的 friends。chain 避免了 Task(Task([Friend])) 这种情况。

   第二个例子是用 querySelector 查找几个 input 然后创建一条欢迎信息。注意看我们是如何在最内层的函数里访问 uname 和 email 的——这是函数式变量赋值的绝佳表现。
   因为 IO 大方地把它的值借给了我们，我们也要负起以同样方式把值放回去的责任——不能辜负它的信任（还有整个程序的信任）。
   IO.of 非常适合做这件事，同时它也解释了为何 pointed 这一特性是 monad 接口得以存在的重要前提。不过，map 也能返回正确的类型：
 */

querySelector("input.username").chain(function(uname) {
  return querySelector("input.email").map(function(email) {
    return "Welcome " + uname.value + " prepare for spam at " + email.value;
  });
});
// IO("Welcome Olivia prepare for spam at olivia@tremorcontrol.net");

/**
 * 最后两个例子用了 Maybe。因为 chain 其实是在底层调用了 map，所以如果遇到 null，代码就会立刻停止运行。

   如果觉得这些例子不太容易理解，你也不必担心。多跑跑代码，多琢磨琢磨，把代码拆开来研究研究，再把它们拼起来看看。
   总之记住，返回的如果是“普通”值就用 map，如果是 functor 就用 chain。

   这里我得提醒一下，上述方式对两个不同类型的嵌套容器是不适用的。
   functor 组合，以及后面会讲到的 monad transformer 可以帮助我们应对这种情况。
 */