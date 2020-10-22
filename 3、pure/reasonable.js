/**
 * 合理性（引用透明）
 * 很多人相信使用纯函数的最大好处就是 引用透明性。
 * 如果一段代码可以替换成它执行所得的结果，而且是在不改变整个程序行为的前提下替换的。
 * 那么我们就说这段代码是引用透明的。
 * 
 * 由于纯函数总是能够根据相同的输入返回相同的输出，所以它们就能够保证总是返回同一个结果，
 * 这也就保证了引用透明
 */

var Immutable = require('immutable');

var decrementHP = function(player) {
  return player.set("hp", player.hp - 1);
}

var isSameTeam = function(player1, player2) {
  return player1.team === player2.team;
};

var punch = function(player, target) {
  if(isSameTeam(player, target)) {
    return target;
  } else {
    return decrementHP(target);
  }
};

var jobe = Immutable.Map({name:"Jobe", hp:20, team: "red"});
var michael = Immutable.Map({name:"Michael", hp:20, team: "green"});

punch(jobe, michael);
//=> Immutable.Map({name:"Michael", hp:19, team: "green"})

// decrementHP、isSameTeam 和 punch 都是纯函数，所以是引用透明的。
// 我们可以使用一种叫做“等式推导”（equational reasoning）的技术来分析代码。
// 所谓“等式推导”就是“一对一”替换，有点像在不考虑程序性执行的怪异行为（quirks of programmatic evaluation）的情况下，
// 手动执行相关代码。我们借助引用透明性来剖析一下这段代码。

// 首先内联 isSameTeam 函数：

var punch = function(player, target) {
  if(player.team === target.team) {
    return target;
  } else {
    return decrementHP(target);
  }
};
// 因为是不可变数据，我们可以直接把 team 替换为实际值：

var punch = function(player, target) {
  if("red" === "green") {
    return target;
  } else {
    return decrementHP(target);
  }
};
// if 语句执行结果为 false，所以可以把整个 if 语句都删掉：

var punch = function(player, target) {
  return decrementHP(target);
};
// 如果再内联 decrementHP，我们会发现这种情况下，punch 变成了一个让 hp 的值减 1 的调用：

var punch = function(player, target) {
  return target.set("hp", target.hp-1);
};
// 总之，等式推导带来的分析代码的能力对重构和理解代码非常重要。事实上，我们重构海鸥程序使用的正是这项技术：利用加和乘的特性。对这些技术的使用将会贯穿本书，真的。