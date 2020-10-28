requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min',
    jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1-rc2/jquery.min'
  }
});

require([
  'ramda',
  'jquery'
],
  function (_, $) {
    var trace = _.curry(function (tag, x) {
      console.log(tag, x);
      return x;
    });
    // app goes here
    var Impure = {
      getJSON: _.curry(function (callback, url) {
        return new Promise(function(resolve, reject) {
          setTimeout(() => {
            const responseObj = {
              items: [
                { media: { m: 'https://s1.ax1x.com/2020/10/20/BpkmwQ.png' } },
                { media: { m: 'https://s1.ax1x.com/2020/10/20/BpFodJ.png' } },
              ]
            }
            resolve(callback(responseObj));
          }, 2000)
        })
      }),
    
      setHtml: _.curry(function (sel, html) {
        $(sel).html(html);
      })
    };

    /**
     * 这里只是简单地包装了一下 jQuery 的 getJSON 方法，把它变为一个 curry 函数，
     * 还有就是把参数位置也调换了下。这些方法都在 Impure 命名空间下，
     * 这样我们就知道它们都是危险函数。在后面的例子中，我们会把这两个函数变纯。
     * 下一步是构造 url 传给 Impure.getJSON 函数。
     */
    
    var url = function (term) {
      return 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + term + '&format=json&jsoncallback=?';
    };
    
    /**
     * 借助monoid或者combinator，我们可以使用一些奇技淫巧来让url函数变为pointfree函数，
     * 但是为了可读性，我们还是选择以普通的非pointfree的方式拼接字符串。
     * 
     * 让我们写一个app函数发送请求并把内容放置到屏幕上。
     */
    
    var app = _.compose(Impure.getJSON(trace("response")), url);

    /**
     * 这会调用 url 函数，然后把字符串传给 getJSON 函数。getJSON 已经局部应用了 trace，加载这个应用将会把请求的响应显示在 console 里。
     * 
     * 我们想要从这个 json 里构造图片，看起来 src 都在 items 数组中的每个 media 对象的 m 属性上。
       不管怎样，我们可以使用 ramda 的一个通用 getter 函数 _.prop() 来获取这些嵌套的属性。
       不过为了让你明白这个函数做了什么事情，我们自己实现一个 prop 看看：
     */

    var prop = _.curry(function(property, object) {
      return object[property];
    });

    // 实际上这有点傻，仅仅是用 [] 来获取一个对象的属性而已。让我们利用这个函数获取图片的 src。

    var mediaUrl = _.compose(_.prop('m'), _.prop('media'));

    var srcs = _.compose(_.map(mediaUrl), _.prop('items'));

    // 一旦得到了items，就必须使用map来分解每一个url
    // 这样就得到了一个包含所有src 的数组。把它和app连结起来，打印结果看看。
    // var renderImages = _.compose(Impure.setHtml('body'), srcs);
    // var app = _.compose(Impure.getJSON(renderImages), url);

    /**
     * 最后一步是把这些 src 变为真正的图片。对大型点的应用来说，是应该使用类似 Handlebars 或者 React 这样的 template/dom 库来做这件事的。
     * 但我们这个应用太小了，只需要一个 img 标签，所以用 jQuery 就好了。
     */

    var img = function(url) {
      return $('<img />', { src: url });
    }

    var images = _.compose(_.map(img), srcs);

    var renderImages = _.compose(Impure.setHtml("body"), images);

    var app = _.compose(Impure.getJSON(renderImages), url);

    app('cats');

    /**
     * 多么美妙的声明式规范啊，只说做什么，不说怎么做。
     * 现在我们可以把每一行代码都视作一个等式，变量名所代表的属性就是等式的含义。
     * 我们可以利用这些属性去推导分析和重构这个应用。
     */
  }
);