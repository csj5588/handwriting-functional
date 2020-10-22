/**
 * 可移植性 / 自文档化
 * 
 * 纯函数是完全自给自足的，它需要的所有东西都能轻易获得。仔细思考这一点。。这种自给自足的好处是什么呢？
 * 首先，纯函数的依赖很明显，因此更易于观察和理解--没有偷偷摸摸的小动作。
 */

// 不纯的
var signUp = function(attrs) {
  var user = saveUser(attrs);
  welcomeUser(user);
}

var saveUser = function(attrs) {
  var user = Db.save(attrs);
};

var welcomeUser = function(user) {
  // Email(user, ...);
}

// 纯的
var signUp = function(Db, Email, attrs) {
  return function() {
    var user = saveUser(Db, attrs);
    welcomeUser(Email, user);
  }
}

var saveUser = function(Db, attrs) {
  // ...
};

var welcomeUser = function(Email, user) {
  // ...
};


/**
 * 这个例子表明，纯函数对于其依赖必须要诚实，这样我们就能知道它的目的。仅从纯函数版本的 signUp 的签名就可以看出，它将要用到 Db、Email 和 attrs，这在最小程度上给了我们足够多的信息。

  后面我们会学习如何不通过这种仅仅是延迟执行的方式来让一个函数变纯，不过这里的重点应该很清楚，那就是相比不纯的函数，纯函数能够提供多得多的信息；前者天知道它们暗地里都干了些什么。
  其次，通过强迫“注入”依赖，或者把它们当作参数传递，
  我们的应用也更加灵活；因为数据库或者邮件客户端等等都参数化了（别担心，我们有办法让这种方式不那么单调乏味）。
  如果要使用另一个 Db，只需把它传给函数就行了。如果想在一个新应用中使用这个可靠的函数，尽管把新的 Db 和 Email 传递过去就好了，非常简单。

  在 JavaScript 的设定中，可移植性可以意味着把函数序列化（serializing）并通过 socket 发送。
  也可以意味着代码能够在 web workers 中运行。总之，可移植性是一个非常强大的特性。

  命令式编程中“典型”的方法和过程都深深地根植于它们所在的环境中，通过状态、依赖和有效作用（available effects）达成；
  纯函数与此相反，它与环境无关，只要我们愿意，可以在任何地方运行它。

  你上一次把某个类方法拷贝到新的应用中是什么时候？我最喜欢的名言之一是 Erlang 语言的作者 Joe Armstrong 说的这句话：
  “面向对象语言的问题是，它们永远都要随身携带那些隐式的环境。你只需要一个香蕉，但却得到一个拿着香蕉的大猩猩...以及整个丛林”。

 */
