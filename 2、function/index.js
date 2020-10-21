/**
 * “一等公民”函数，
 */

const hi = name => `Hi ${name}`;
const greeting = name => hi(name);
// 这里 greeting 指向的那个把 hi 包了一层的包裹函数完全是多余的。为什么？因为 JavaScript 的函数是可调用的，当 hi 后面紧跟 () 
// 的时候就会运行并返回一个值；如果没有 ()，hi 就简单地返回存到这个变量里的函数。我们来确认一下：

console.log(hi); // name => `Hi ${name}`
hi("jonas"); // "Hi jonas"
// greeting 只不过是转了个身然后以相同的参数调用了 hi 函数而已，因此我们可以这么写：

const greeting = hi;
greeting("times"); // "Hi times"

// 用一个函数把另一个函数包裹起来，目的仅仅是延迟执行，真的是非常糟糕的编程习惯。跟可维护性密切相关。

// 太傻了
const getServerStuff = callback => ajaxCall(json => callback(json));

// 这才像样
const getServerStuff = ajaxCall;

// 世界上到处都充斥着这样的垃圾 ajax 代码。以下是上述两种写法等价的原因：

// 这行
ajaxCall(json => callback(json));

// 等价于这行
ajaxCall(callback);

// 那么，重构下 getServerStuff
const getServerStuff = callback => ajaxCall(callback);

// ...就等于
const getServerStuff = ajaxCall // <-- 看，没有括号哦

/**
 * 控制器
 */

const BlogController = {
  index(posts) { return Views.index(posts); },
  show(post) { return Views.show(post); },
  create(attrs) { return Db.create(attrs); },
  update(post, attrs) { return Db.update(post, attrs); },
  destroy(post) { return Db.destroy(post); },
};

// 这个可笑的控制器（controller）99% 的代码都是垃圾。我们可以把它重写成这样：

const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};

// ...或者直接全部删掉，因为它的作用仅仅就是把视图（Views）和数据库（Db）打包在一起而已。