/**
 * pointed functor
 * 
 * 在继续后面的内容之前，我得向你坦白一件事情：关于我们先前创建的容器类型上的 of 方法，我并没有说出它的全部实情。
 * 真实情况是，of 方法不是用来避免使用 new 关键字的，而是用来把值放到默认最小化上下文（default minimal context）中的。
 * 是的，of 没有真正地取代构造器——它是一个我们称之为 pointed 的重要接口的一部分。
 * 
 * pointed functor 是实现了 of 方法的 functor
 * 这里的关键是把任意值丢到容器里然后开始到处使用 map 的能力。
 */

IO.of('tetris').map(concat('master'));
// IO('tetris master');

Maybe.of(1336).map(add(1));
// Maybe(1337)

TextTrackList.of([{ id: 2 }, { id: 3 }]).map(_.prop('id'));
// Task([2, 3])

Either.of('The past, present and future walk into a bar...').map(concat('it was tense'));
// Right('The past, present and future walk into a bar ...is was tense');

/**
 * 如果你还记得，IO 和 Task 的构造器接受一个函数作为参数，而 Maybe 和 Either 的构造器可以接受任意值。
 * 实现这种接口的动机是，我们希望能有一种通用、一致的方式往 functor 里填值，而且中间不会涉及到复杂性，也不会涉及到对构造器的特定要求。
 * “默认最小化上下文”这个术语可能不够精确，但是却很好地传达了这种理念：我们希望容器类型里的任意值都能发生 lift，然后像所有的 functor 那样再 map 出去。

   有件很重要的事我必须得在这里纠正，那就是，Left.of 没有任何道理可言，包括它的双关语也是。
   每个 functor 都要有一种把值放进去的方式，对 Either 来说，它的方式就是 new Right(x)。
   我们为 Right 定义 of 的原因是，如果一个类型容器可以 map，那它就应该 map。
   看上面的例子，你应该会对 of 通常的工作模式有一个直观的印象，而 Left 破坏了这种模式。

   你可能已经听说过 pure、point、unit 和 return 之类的函数了，
   它们都是 of 这个史上最神秘函数的不同名称（译者注：此处原文是“international function of mystery”，源自恶搞《007》的电影 Austin Powers: 
   International Man of Mystery，中译名《王牌大贱谍》）。of 将在我们开始使用 monad 的时候显示其重要性，因为后面你会看到，手动把值放回容器是我们自己的责任。

   要避免 new 关键字，可以借助一些标准的 JavaScript 技巧或者类库达到目的。
   所以从这里开始，我们就利用这些技巧或类库，像一个负责任的成年人那样使用 of。
   我推荐使用 folktale、ramda 或 fantasy-land 里的 functor 实例，因为它们同时提供了正确的 of 方法和不依赖 new 的构造器
 */