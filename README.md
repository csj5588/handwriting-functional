# handwriting functional
  记录函数式编程知识点，手写所有语法原理及例子。

## 函数式编程开发辅助工具

- [Ramda](https://github.com/ramda/ramda) 简介：A practical functional library for JavaScript programmers.
- [Ramda 函数库参考教程](http://www.ruanyifeng.com/blog/2017/03/ramda.html) 简介：这是一个很重要的库，提供了许多有用的方法，每个 JavaScript 程序员都应该掌握这个工具。
- [lodash-fp](https://github.com/lodash-archive/lodash-fp) 简介：柯里化的lodash
  
## 目录结构
```
|-- github
    |-- .gitignore
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
        |-- category.js
        |-- debug.js
        |-- index.js
        |-- pointfree.js

```
## 如何生成目录结构

```shell
  npx mddir "./"
```
