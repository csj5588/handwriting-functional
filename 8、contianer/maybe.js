/**
 * 薛定谔的猫
 */

var Maybe = function (x) {
  this._value = x;
}

Maybe.of = function (x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function () {
  return (this._value === null || this._value === undefined);
}

Maybe.prototype.map = function (f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._value));
}

/**
 * Maybe 看起来跟 Container 非常类似，但是有一点不同：Maybe 会先检查自己的值是否为空，
 * 然后才调用传进来的函数。这样我们在使用 map 的时候就能避免恼人的空值了（注意这个实现出于教学目的做了简化）。
 */

Maybe.of("Malkovich Malkovich").map(match(/a/ig));
//=> Maybe(['a', 'a'])

Maybe.of(null).map(match(/a/ig));
//=> Maybe(null)

Maybe.of({ name: "Boris" }).map(_.prop("age")).map(add(10));
//=> Maybe(null)

Maybe.of({ name: "Dinah", age: 14 }).map(_.prop("age")).map(add(10));
//=> Maybe(24)

/**
 * 注意看，当传给 map 的值是 null 时，代码并没有爆出错误。
 * 这是因为每一次 Maybe 要调用函数的时候，都会先检查它自己的值是否为空。

   这种点记法（dot notation syntax）已经足够函数式了，但是正如在第 1 部分指出的那样，我们更想保持一种 pointfree 的风格。
   碰巧的是，map 完全有能力以 curry 函数的方式来“代理”任何 functor：
 */

// map :: Functor f => (a -> b) -> f a -> fb

var map = curry(function (f, any_functor_at_all) {
  return any_functor_at_all.map(f);
})

/**
 * 这样我们就可以像平常一样使用组合，同时也能正常使用 map 了，非常振奋人心。ramda 的 map 也是这样。
 * 后面的章节中，我们将在点记法更有教育意义的时候使用点记法，在方便使用 pointfree 模式的时候就用 pointfree。你注意到了么？
 * 我在类型标签中偷偷引入了一个额外的标记：Functor f =>。这个标记告诉我们 f 必须是一个 functor。没什么复杂的，但我觉得有必要提一下。
 */

// 用例
// 实例当中，Maybe最常用在哪些可能会无法成功返回结果的函数中。

// safeHead :: [a] -> Maybe(a)
var safeHead = function (xs) {
  return Maybe.of(xs[0]);
}

var streetName = compose(map(_.prop('street')), safeHead, _.prop('addresses'));

streetName({ addresses: [] });
// Maybe(null)

streetName({ addresses: [{ street: "Shady Ln.", number: 4201 }] });
// Maybe("Shady Ln.")

/**
 * safeHead 与一般的 _.head 类似，但是增加了类型安全保证。引入 Maybe 会发生一件非常有意思的事情，那就是我们被迫要与狡猾的 null 打交道了。
 * safeHead 函数能够诚实地预告它可能的失败——失败真没什么可耻的——然后返回一个 Maybe 来通知我们相关信息。实际上不仅仅是通知，
 * 因为毕竟我们想要的值深藏在 Maybe 对象中，而且只能通过 map 来操作它。本质上，这是一种由 safeHead 强制执行的空值检查。
 * 有了这种检查，我们才能在夜里安然入睡，因为我们知道最不受人待见的 null 不会突然出现。
 * 类似这样的 API 能够把一个像纸糊起来的、脆弱的应用升级为实实在在的、健壮的应用，这样的 API 保证了更加安全的软件。
 * 
 * 有时候函数可以明确的返回一个（Maybe（null））来表明失败。例如：
 */

// withdraw :: Number -> Account -> Maybe(Account)
var withdraw = curry(function (amount, account) {
  return account.balance >= amount ?
    Maybe.of({ balance: account.balance - amount }) :
    Maybe.of(null);
})

// finishTransaction :: Account -> String
var finishTransaction = compose(remainingBalance, updateLedger); // <- 假定这两个函数已经在别处定义好了。

// getTwenty ::Account -> Maybe(String)
var getTwenty = compose(map(finishTransaction), withdraw(20));

getTwenty({ balance: 200.00 });
// Maybe("your balance is $180.00")

getTwenty({ balance: 10.00 });
// Maybe(null)

/**
 * 要是钱不够，withdraw 就会对我们嗤之以鼻然后返回一个 Maybe(null)。withdraw 也显示出了它的多变性，使得我们后续的操作只能用 map 来进行。
 * 这个例子与前面例子不同的地方在于，这里的 null 是有意的。我们不用 Maybe(String) ，而是用 Maybe(null) 来发送失败的信号，这样程序在收到信号后就能立刻停止执行。
 * 这一点很重要：如果 withdraw 失败了，map 就会切断后续代码的执行，因为它根本就不会运行传递给它的函数，即 finishTransaction。
 * 这正是预期的效果：如果取款失败，我们并不想更新或者显示账户余额
 */