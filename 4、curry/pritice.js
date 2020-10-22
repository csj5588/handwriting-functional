// 通过局部调用 移除所有参数

var words = function(str) {
  return split(' ', str);
}

const flg = '12 3';
words(flg);
console.log(flg);