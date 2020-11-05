
/**
 * 你看，除了太空墨西哥卷（如果你听说过这个传言的话）（译者注：此处的传言似乎是说一个叫 Chris Hadfield 的宇航员在国际空间站做墨西哥卷的事，视频链接），
 * monad 还被喻为洋葱。让我以一个常见的场景来说明这点：
 */

// Support
// ===========================
var fs = require('fs');

// readFile :: String -> IO String
var readFile = function(filename) {
  return new IO(function() {
    return fs.readFileSync(filename, 'utf-8');
  })
}

// print :: String -> IO String
var print = function(x) {
  return new IO(function() {
    console.log(x);
    return x;
  })
}

// Example
// ==========
// cat :: IO(IO String)
var cat = compose(map(print), readFile);

// 拆一下 ：：：：

compose(map(print), new IO(function() { return '[core]\nrepositoryformatversion = 0\n' }));

compose(
  function(print) {
    return new IO(print, function() { return '[core]\nrepositoryformatversion = 0\n' })
  }
)

compose(
  function() {
    return new IO(new IO('[core]\nrepositoryformatversion = 0\n'))
  }
)

cat('.git/config');
// IO(IO("[core]\nrepositoryformatversion = 0\n"))

/**
 * 这里我们得到的是一个 IO，只不过它陷进了另一个 IO。要想使用它，
 * 我们必须这样调用： map(map(f))；要想观察它的作用，必须这样： unsafePerformIO().unsafePerformIO()。
 */

//  cat :: String -> IO (IO String)
var cat = compose(map(print), readFile);

//  catFirstChar :: String -> IO (IO String)
var catFirstChar = compose(map(map(head)), cat);

catFirstChar(".git/config")
// IO(IO("["))

/**
 * 尽管在应用中把这两个作用打包在一起没什么不好的，但是总觉得像是穿着两套防护服工作，
 * 结果就形成一个稀奇古怪的API，再来看另一种情况。
 */

// safeProp :: Key -> { Key: a } -> Maybe a
var safeProp = curry(function(x, obj) {
  return new Maybe(obj[x]);
})

// safeHead :: [a] -> Maybe a
var safeHead = safeProp(0);

// firstAddressStreet :: User -> Maybe(Maybe(Maybe Street))
var firstAddressStreet = compose(
  map(map(safeProp('street'))),
  map(safeHead),
  safeProp('addresses')
)

firstAddressStreet(
  { addresses: [{ street: { name: 'Mulburry', number: 4923 }, postCode: 'WC2N' }] }
);

Maybe(Maybe(Maybe({ name: 'Mulburry', number: 4923 })));

/**
 * 这里的functor同样是嵌套的，函数中这三个可能的失败都用了Maybe做预防也很干净整洁，但是要让最后的调用者调用三次map才能取到值未免也太无礼了点
 * 这种嵌套functor的模式会时不时的出现，而且是momad的主要使用场景。
 * 
 * 我说过monad像洋葱，那是因为当我们用map拨开嵌套的functor以获取它里面的值的时候，就像剥洋葱一样让人忍不住想哭。
 * 不过我们可以擦干眼泪，做个深呼吸，然后使用一个叫做join的方法。
 */

var mmo = Maybe.of(Maybe.of('nunchucks'));
// Maybe(Maybe('nunchucks'))

mmo.join();
// Maybe('nunchucks');

var ioio = IO.of(IO.of('pizza'));
// IO(IO('pizza'));

ioio.join()
// IO('pizza');

var ttt = Task.of(Task.of(Task.of('sewers')));
// Task(Task(Task("sewers")));

ttt.join()
// Task(Task("sewers"))

/**
 * 如果有两层相同类型的嵌套，那么就可以用join把它们压扁到一块去。
 * 这种结合能力，functor之间的联姻，就是monad之所以成为monad的原因，
 * 定义
 * 
 * monad是可以变扁(flatten)的 pointed functor。
 * 
 * 一个functor，只要它定义了一个join方法和一个of方法，并遵守一些定律，那么它就是一个monad
 * join的实现并不太复杂，我们来为Maybe定一个
 */

Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this._value;
}

/**
 * 如果有一个Maybe(Maybe(x)), 那么_value将会移除多余的一层 ，
 * 然后我们就能安心地进行map，要不然我们就将会只有一个Maybe，
 * 因为从一开始就没有任何东西被map调用。
 * 
 * 既然已经有了join方法，我们把monad魔法作用到firstAddressStreet例子上，看看它的实际作用。
 */

// join :: Monad m => m (m a) -> m a
var join = function(mma) { return mma.join(); }

//  firstAddressStreet :: User -> Maybe Street
var firstAddressStreet = compose(
  join,
  map(safeProp('street')),
  join,
  map(safeHead),
  safeProp('addresses')
)

firstAddressStreet(
  {addresses: [{street: {name: 'Mulburry', number: 8402}, postcode: "WC2N" }]}
);
// Maybe({name: 'Mulburry', number: 8402})

/**
 * 只要遇到嵌套的Maybe 就加一个join，防止它们从手中溜走。
 * 我们对IO也这么做试试看，感受下这种感觉。
 */

IO.prototype.join = function() {
  return this.unsafePerformIO();
}

/**
 * 同样是简单地移除了一层容器，
 * 注意，我们还没有提及纯粹性的问题，仅仅是移除过渡紧缩的包裹中的一层而已
 */

// log :: a -> IO a
var log = function(x) {
  return new IO(function() { console.log(x); return x });
}

// setStyle :: Selector -> CSSProps -> IO DOM
var setStyle = curry(function(sel, props) {
  return new IO(function() { return JQuery(sel).css(props) })
});

// getItem :: String -> IO String
var getItem = function(key) {
  return new IO(function() { return localStorage.getItem(key) })
}

// applyPreferences :: String -> IO DOM
var applyPreferences = compose(
  join,
  map(setStyle('#main')),
  join,
  map(log),
  map(JSON.parse),
  getItem,
)

applyPreferences('preferences').unsafePerformIO();
// Object {backgroundColor: "green"}
// <div style="background-color: 'green'"/>

/**
 * getItem 返回了一个 IO String，所以可以直接用 map 来解析它。log 和 setStyle 返回的都是 IO，所以必须要使用 join 来保证这里边的嵌套处于控制之中。
 */