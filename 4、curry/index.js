/**
 * 不可或缺的curry
 * 
 * （译者注：原标题是“Can't live if livin' is without you”，为英国乐队 Badfinger 歌曲 Without You 中歌词。）
 * 
 * 我父亲以前跟我说过，有些事物在你得到之前是无足轻重的，得到之后就不可或缺了。
 * 微波炉是这样，智能手机是这样，互联网也是这样——老人们在没有互联网的时候过得也很充实。
 * 对我来说，函数的柯里化（curry）也是这样。
 * 
 * curry 的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。
 */

var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2);
// 3

addTen(2);
// 12