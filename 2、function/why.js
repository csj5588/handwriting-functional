/**
 * 为何钟爱一等公民
 * 
 * 好了，现在我们来看看钟爱一等公民的原因是什么。前面 getServerStuff 和 BlogController 两个例子你也都看到了，
 * 虽说添加一些没有实际用处的间接层实现起来很容易，但这样做除了徒增代码量，提高维护和检索代码的成本外，没有任何用处。
 * 另外，如果一个函数被不必要地包裹起来了，而且发生了改动，那么包裹它的那个函数也要做相应的变更。
 */

httpGet('/post/2', json => renderPost(json));
// 如果 httpGet 要改成可以抛出一个可能出现的 err 异常，那我们还要回过头去把“胶水”函数也改了。

// 把整个应用里的所有 httpGet 调用都改成这样，可以传递 err 参数。
httpGet('/post/2', (json, err) => renderPost(json, err));
// 写成一等公民函数的形式，要做的改动将会少得多：

httpGet('/post/2', renderPost);  // renderPost 将会在 httpGet 中调用，想要多少参数都行

/**
 * 除了删除不必要的函数，正确地为参数命名也必不可少。当然命名不是什么大问题，但还是有可能存在一些不当的命名，尤其随着代码量的增长以及需求的变更，这种可能性也会增加。
 * 项目中常见的一种造成混淆的原因是，针对同一个概念使用不同的命名。还有通用代码的问题。比如，下面这两个函数做的事情一模一样，但后一个就显得更加通用，可重用性也更高：
 */

// 只针对当前的博客
const validArticles = articles => articles.filter(articles => articles !== null && articles !== undefined);

// 对未来更友好
const compact = xs => xs.filter(x => x !== null && x !== undefined);

