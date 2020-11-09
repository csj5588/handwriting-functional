/**
 * 这种容器编程风格有时也能造成困惑，我们不得不努力理解一个值到底嵌套了几层容器，
 * 或者需要用 map 还是 chain（很快我们就会认识更多的容器类型）。使用一些技巧，比如重写 inspect 方法之类，
 * 能够大幅提高 debug 的效率。后面我们也会学习如何创建一个“栈”，使之能够处理任何丢给它的作用（effects）。不过，有时候也需要权衡一下是否值得这样做。

   我很乐意挥起 monad 之剑，向你展示这种编程风格的力量。就以读一个文件，然后就把它直接上传为例吧：
 */

// readFile :: Filename -> Either String (Future Error String)
// httpPost :: String -> Future Error JSON

//  upload :: String -> Either String (Future Error JSON)
var upload = compose(map(chain(httpPost('/uploads'))), readFile);

/**
 * 这里，代码不止一次在不同的分支执行。从类型签名可以看出，我们预防了三个错误——readFile 使用 Either 来验证输入（或许还有确保文件名存在）；
 * readFile 在读取文件的时候可能会出错，错误通过 readFile 的 Future 表示；文件上传可能会因为各种各样的原因出错，错误通过 httpPost 的 Future 表示。
 * 我们就这么随意地使用 chain 实现了两个嵌套的、有序的异步执行动作。

   所有这些操作都是在一个从左到右的线性流中完成的，是完完全全纯的、声明式的代码，
   是可以等式推导（equational reasoning）并拥有可靠特性（reliable properties）的代码。
   我们没有被迫使用不必要甚至令人困惑的变量名，我们的 upload 函数符合通用接口而不是特定的一次性接口。这些都是在一行代码中完成的啊！

   让我们来跟标准的命令式的实现对比一下：
 */

//  upload :: String -> (String -> a) -> Void
var upload = function(filename, callback) {
  if(!filename) {
    throw "You need a filename!";
  } else {
    readFile(filename, function(err, contents) {
      if(err) throw err;
      httpPost(contents, function(err, json) {
        if(err) throw err;
        callback(json);
      });
    });
  }
}