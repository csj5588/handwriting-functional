/**
 * 我们从一个愚蠢的例子开始。下面是一个海鸥程序，鸟群合并则变成来一个更大的鸟群，繁殖则增加了鸟群的数量，
 * 增加的数量就是它们繁殖出来的海鸥数量。注意这个程序并不是面向对象的良好实践，它只是强调当前这种变量赋值方式的一些弊端。
 */

var Flock = function(n) {
  this.seagulls = n;
}

Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
}

Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
}

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;
console.log('wrong', result)
// => 32

// 代码内部非常难以追踪，而且，最终答案还是错的，正确答案是16，但是因为flock_a在运算过程中永久的变了，所以得出了错误的结果。

