function curry(fn) { // 形参是fn应该有的参数 在这里就是getSum中的(a,b,c)3个
  // 此处返回的是函数声明而非匿名函数 为的是在传参不足的时候 递归调用自己
  return function curriedFn(...args1) { // 实参是调用时候真正传的参数 有可能是1个 2个或者3个
    console.log(args1);
    // 判断实参和形参的个数
    if (args1.length < fn.length) { // 如果参数不够 返回一个匿名函数出去 当这个匿名函数再次调用的时候 
      // 会将再次调用传的参数和上次调用传的参数合并后再调用函数声明 
      return function (...args2) {
        // 由于这里的args1是匿名函数外的数据 形成了一个闭包 所以匿名函数在执行时args1都是独立的 不会互相影响
        console.log(args1);
        console.log(args2);
        return curriedFn(...args1, ...args2); // 将此次和上次的参数合并再次递归 curriedFn 结果作为返回值
        // 如果args1和args2的长度已经>=形参数 显然再次递归的时候 返回值是 fn(合并后的参数) 也就是fn执行结果作为返回值
        // 如果args1和args2的长度还是<形参的长度 就再返回一个匿名函数作为返回值等待更多的参数传入
      }
    }
    return fn(...args1);
  }
}

function curry(fn) {
  return function curriedFn(...args1) {
    if (args1.length < fn.length) {
      return function(...args2) {
        return curriedFn(...args1, ...args2);
      }
    }
    return fn(...args1);
  }
}

function getSum(a, b, c) {
  return a + b + c;
}

let curried = curry(getSum);

b = curried(1); // 执行完curried(1) 打印第4行的 args1 = [1]  返回的是匿名函数 function (...args2) {...}

c = b(2); // 再执行b 也就是function (...args2) {...} 
// 先后打印 10 11行的 args1 = [1] args2 = [2] 然后合并执行curriedFn 打印第三行的args1：[1, 2]
// if 判断 还不满足 再将匿名函数当作此次curriedFn的返回值 在第9行 返回给c

let sum1 = c(3); // 执行c时， 打印第10行的 args1 = [1, 2] 打印第11行的 args2 = [3]
// 组合后再调用 curriedFn 打印第4行的args1 = [1,2,3] if判断已经不满足
// 执行fn(...[1,2,3])作为此次curriedFn的结果 在第9行ruturn出去 也就是最后的结果 

d = b(5); // 每次执行都是一个闭包 其中的args1 都是互不影响的
let sum2 = d(4);
console.log(sum1); // 6 1+2+3
console.log(sum2); // 10 1+5+4d