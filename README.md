# handwriting functional
  记录函数式编程知识点，手写所有语法原理及例子。

## 函数式编程开发辅助工具

- [Ramda](https://github.com/ramda/ramda) 简介：A practical functional library for JavaScript programmers.
- [Ramda 函数库参考教程](http://www.ruanyifeng.com/blog/2017/03/ramda.html) 简介：这是一个很重要的库，提供了许多有用的方法，每个 JavaScript 程序员都应该掌握这个工具。
- [lodash-fp](https://github.com/lodash-archive/lodash-fp) 简介：柯里化的lodash
- [Hoogle](https://hoogle.haskell.org/) 简介：它允许您按函数名或近似类型签名搜索堆栈上的Haskell库
- [folktale](https://folktale.origamitower.com/docs/v2.3.0/overview/) 简介：Folktale是一个库，用于支持JavaScript编程的功能样式。在其最新版本中，Folktale提供了用于组合功能， 转换对象，建模数据，处理错误和并发的实用程序。
- [fantasy-land](https://github.com/fantasyland/fantasy-land) 简介：代数Javascript规范
  
## 目录结构
```
|-- github
    |-- .gitignore
    |-- MathInFunctional.md
    |-- README.md
    |-- directoryList.md
    |-- introduce.md
    |-- package-lock.json
    |-- package.json
    |-- 1、introduction
    |   |-- better.js
    |   |-- better.rename.js
    |   |-- index.js
    |-- 2、function
    |   |-- index.js
    |   |-- why.js
    |-- 3、pure
    |   |-- cacheable.js
    |   |-- index.js
    |   |-- math.js
    |   |-- parallel.js
    |   |-- portable.js
    |   |-- reasonable.js
    |   |-- side.effect.js
    |   |-- testable.js
    |-- 4、curry
    |   |-- enjoyment.js
    |   |-- extend.js
    |   |-- index.js
    |   |-- lodash_curry.js
    |   |-- pritice.js
    |-- 5、compose
    |   |-- category.js
    |   |-- debug.js
    |   |-- hand.js
    |   |-- index.js
    |   |-- pointfree.js
    |   |-- pritice.js
    |-- 6、declare
    |   |-- flickr.js
    |   |-- index.js
    |   |-- flickr
    |       |-- better.js
    |       |-- flickr.js
    |       |-- index.html
    |-- 7、Hindley-Milner
    |   |-- free.theorems.js
    |   |-- index.js
    |   |-- interface.js
    |   |-- parametricity.js
    |-- 8、contianer
    |   |-- async.js
    |   |-- either.js
    |   |-- functor.js
    |   |-- index.js
    |   |-- io.js
    |   |-- maybe.js
    |   |-- release.js
    |-- 9、monad
        |-- index.js
        |-- monad.js

```
## 如何生成目录结构

```shell
  npx mddir "./"
```
