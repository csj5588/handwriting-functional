/**
 * 协调与激励
 */

// Http.get :: String -> Task Error HTML
var renderPage = curry(function(destinations, events) { /** render page */ })

Task.of(renderPage).ap(Http.get('/destinations')).ap(Http.get('/events'))
// Task("<div>some page with dest and events</div>")

/**
 * 两个请求将会同时立即执行，当两者的响应都返回之后，renderPage 就会被调用。
 * 这与 monad 版本的那种必须等待前一个任务完成才能继续执行后面的操作完全不同。
 * 本来我们就无需根据目的地来获取事件，因此也就不需要依赖顺序执行。

   再次强调，因为我们是使用局部调用的函数来达成上述结果的，所以必须要保证 renderpage 是 curry 函数，
   否则它就不会一直等到两个 Task 都完成。而且如果你碰巧自己做过类似的事，那你一定会感激 applicative functor 这个异常简洁的接口的。
   这就是那种能够让我们离“奇点”（singularity）更近一步的优美代码。

   再来看另外一个例子。
 */

// 帮助函数：
// ==============
//  $ :: String -> IO DOM
var $ = function(selector) {
  return new IO(function() { return document.querySelector(selector) });
}

// getVal :: String -> IO String
var getVal = compose(map(_.prop('value')), $);

// Example:
// ========
// signIn :: String -> String -> Bool -> User
var signIn = curry(function(username, password, remember_me) { /* signing in */ } )

IO.of(signIn).ap(getVal('#email')).ap(getVal('#password')).ap(IO.of(false));

/**
 * signIn 是一个接收 3 个参数的 curry 函数，因此我们需要调用 ap 3 次。
 * 在每一次的 ap 调用中，signIn 就收到一个参数然后运行，直到所有的参数都传进来，它也就执行完毕了。
 * 我们可以继续扩展这种模式，处理任意多的参数。另外，左边两个参数在使用 getVal 调用后自然而然地成为了一个 IO，
 * 但是最右边的那个却需要手动 lift，然后变成一个 IO，这是因为 ap 需要调用者及其参数都属于同一类型。
 */