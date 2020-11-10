/**
 * 我们来试试以一种 pointfree 的方式调用 applicative functor。因为 map 等价于 of/ap，那么我们就可以定义无数个能够 ap 通用函数。
 */

var liftA2 = curry(function(f, functor1, functor2) {
  return functor1.map(f).ap(functor2);
})

var liftA3 = curry(function(f, functor1, functor2, functor3) {
  return functor1.map(f).ap(functor2).ap(functor3);
})

// liftA4, etc

/**
 * liftA2 是个奇怪的名字，听起来像是破败工厂里挑剔的货运电梯，或者伪豪华汽车公司的个性车牌。
 * 不过你要是真正理解了，那么它的含义也就不证自明了：让那些小代码块发生 lift，成为 applicative functor 中的一员。

   刚开始我也觉得这种 2-3-4 的写法没什么意义，看起来又丑又没有必要，毕竟我们可以在 JavaScript 中检查函数的参数数量然后再动态地构造这样的函数。
   不过，局部调用（partially apply）liftA(N) 本身，有时也能发挥它的用处，这样的话，参数数量就固定了。

   来看看实际用例：
 */

// checkEmail :: User -> Either String Email
// checkName :: User -> Either String String

// createUser :: Email -> String -> IO User
var createUser = curry(function(email, name) { /* creating... */ });

Either.of(createUser).ap(checkEmail(user)).ap(checkName(user));
// Left("invalid email")

liftA2(createUser, checkEmail(user), checkName(user));
// Left("invalid email")

/**
 * createUser 接收两个参数，因此我们使用的是 liftA2。
 * 上述两个语句是等价的，但是使用了 liftA2 的版本没有提到 Either，
 * 这就使得它更加通用灵活，因为不必与特定的数据类型耦合在一起。

   我们试试以这种方式重写前一个例子：
 */

liftA2(add, Maybe.of(2), Maybe.of(3));
// Maybe(5);

liftA2(renderPage, Http.get('/destinations'), Http.get('/events'))
// Task("<div>some page with dest and events</div>")

liftA3(signIn, getVal('#email'), getVal('#password'), IO.of(false));
// IO({id: 3, email: "gg@allin.com"})