var add = function(x, y) { return x + y };
var multiply = function(x, y) { return x * y };

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));
//=>16

// 这么以来，你会发现我们不过是在运用古人早已经获得的知识

// 结合律
add(add(x, y), z) == add(x, add(y, z));

// 交换律
add(x, y) == add(y, x)

// 同一律
add(x, 0) == x;

// 分配律
multiply(x, add(y, z)) == add(multiply(x, y), multiply(x, z));

// 是的，这些经典的数学定律迟早会派上用场。不过如果你一时想不起来也没关系，多数人已经很久没复习过这些数学知识了。我们来看看能否运用这些定律简化这个海鸥小程序。

// 原有代码
add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));

// 应用同一律，去掉多余的加法操作（add(flock_a, flock_c) == flock_a）
add(multiply(flock_b, flock_a), multiply(flock_a, flock_b));

// 再应用分配律
multiply(flock_b, add(flock_a, flock_a));