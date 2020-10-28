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

    var url = function (term) {
      return 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + term + '&format=json&jsoncallback=?';
    };

    var img = function(url) {
      return $('<img />', { src: url });
    }

    var app = _.compose(Impure.getJSON(trace("response")), url);

    var mediaUrl = _.compose(_.prop('m'), _.prop('media'));
    // var srcs = _.compose(_.map(mediaUrl), _.prop('items'));
    // var images = _.compose(_.map(img), srcs);

    /**
     * 上面可以根据map的组合率（这个率是函数式变成中的一个规律）
     * var law = compose(map(f), map(g)) == map(compose(f, g));
     * 
     * 感谢等式推导（equational reasoning）及纯函数的特性，我们可以内联调用srcs和images，也就是把map调用排列起来。
     */

    // 1、 var images = _.compose(_.map(img), _.map(mediaUrl), _.prop('items'));

    // 2、 var images = _.compose(_.map(_.compose(img, mediaUrl)), _.prop('items'));

    // 现在只需要循环一次就可以把每一个对象都转为 img 标签了。我们把 map 调用的 compose 取出来放到外面，提高一下可读性。

    var mediaToImg = _.compose(img, mediaUrl);

    var images = _.compose(_.map(mediaToImg), _.prop('items'));

    var renderImages = _.compose(Impure.setHtml("body"), images);

    var app = _.compose(Impure.getJSON(renderImages), url);

    app('cats');

    // 优雅
  }
);

/**
 * 我们已经见识到了如何在一个小而不是真实的应用中运用新技能了，也已经使用过函数式这个“数学框架”来推导和重构代码了
 * 但是异常处理及代码分支呢？如何让整个应用都是函数式的，而不仅仅是把破坏性的函数放到命名空间下？
 * 如何让应用更安全更富有表现力？
 */