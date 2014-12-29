/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2014 OA Wu Design
 */



  var player = null,
      $silders = null,
      s = null,
      tag = document.createElement ('script'),
      firstScriptTag = document.getElementsByTagName ('script')[0]
      ;

      tag.src = "https://www.youtube.com/iframe_api";
      firstScriptTag.parentNode.insertBefore (tag, firstScriptTag);

  var save = function () {
    if ((typeof (Storage) !== 'undefined'))
      localStorage.setItem ('u2', JSON.stringify (s));
  }
  var initData = function () {
    if ((typeof (Storage) !== 'undefined') && (s = localStorage.getItem ('u2'))) {
      s = JSON.parse (s);
    } else {
      s = { l: [],
            a: $('#isAuto').prop ("checked"),
            p: $('#isLoopAll').prop ("checked"),
            o: $('#isLoopOne').prop ("checked"),
            t: null,
            v: 50
          };
    }
  }
  var initUi = function () {
    
    $silders = $('<div />').addClass ('silders').append (s.l.map (function (t) {
      return $('<div />').addClass ('silder').data ('id', t).append (
          $('<div />').addClass ('delete').text ('x')
        ).append (
          $('<img />').attr ('src', 'http://img.youtube.com/vi/' + t + '/default.jpg')
        );
    })).appendTo ('.bottom');
    
    $silders.OAscrollSliderView ({
        silder: {
          width: '160px',
          height: '90px'
        }
      }).find ('.silder').imgLiquid ();

    if (s.a)
      $('#isAuto').attr ('checked', true);
    if (s.p)
      $('#isLoopAll').attr ('checked', true);
    if (s.o)
      $('#isLoopOne').attr ('checked', true);

  }
  var youtubeParser = function (url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match (regExp);
    return match && (match[7].length == 11) ? match[7] : null;
  }
  var addVideo = function () {
    var id = null;
    if (id = youtubeParser ($('#input').val ().trim ())) {
      s.l.push (id);
      s.l = _.uniq (s.l);
      save ();
      
      $('#input').val ('');
      setTimeout (function () {
        location.reload ();
      }, 100)
    }
  }

  var stop = function () {
    if (player.getPlayerState () == 1)  player.pauseVideo ();
    else player.playVideo ();
  }
  var next = function () {
    var $silder = $silders.find ('.silder');
    var $active = $silder.filter ('.active');

    if ($silder.filter ('.active').index () >= $silder.length - 1) $silder.first ().click ();
    else $active.next ().click ();
  }
  var prev = function () {
    var $silder = $silders.find ('.silder');
    var $active = $silder.filter ('.active');

    if ($silder.filter ('.active').index () <= 0) $silder.last ().click ();
    else $active.prev ().click ();
  }
  var add = function () {
    s.v = (s.v = player.getVolume () + 10) > 100 ? 100 : s.v;
    player.setVolume (s.v);
    save ();
  }
  var sub = function () {
    s.v = (s.v = player.getVolume () - 10) < 0 ? 0 : s.v;
    player.setVolume (s.v);
    save ();
  }
  var initEvent = function () {
    $('#input').keypress (function (e) {
      if (e.keyCode == 13) addVideo ();
    });
    $('#addInput').click (function () {
      addVideo ();
    });
    $('#isAuto').change (function () {
      s.a = $(this).prop ("checked");
      save ();
    });
    $('#isLoopAll').change (function () {
      s.p = $(this).prop ("checked");
      save ();
    });
    $('#isLoopOne').change (function () {
      s.o = $(this).prop ("checked");
      save ();
    });
    $('#clean').click (function () {
      s.l = [];
      save ();
    });
    $('#addPlaybackRate').click (function () {
      var rate = player.getPlaybackRate () + 0.5;
      player.setPlaybackRate (rate > 2 ? 2 : rate);
    });
    $('#subPlaybackRate').click (function () {
      var rate = player.getPlaybackRate () - 0.5;
      player.setPlaybackRate (rate < 0.5 ? 0.5 : rate);
    });
    $('#add').click (add);
    $('#sub').click (sub);
    $('#next').click (next);
    $('#prev').click (prev);
    $('#stop').click (stop);

    $silders.find ('.silder').click (function (e) {
      if (!$(this).hasClass ('active')) {
        $(this).addClass ('active').siblings ().removeClass ('active');
        player.loadVideoById ($(this).data ('id'));
      }
    });
    $silders.find ('.delete').click (function (e) {
      var $silder = $(this).parents ('.silder');

      s.l.splice (s.l.indexOf ($silder.data ('id')), 1);
      save ();
      $silder.remove ();
      
      setTimeout (function () {
        location.reload ();
      }, 100)
    });

    if (s.l.length)
      $silders.find ('.silder').first ().addClass ('active');

    $(window).on ('keydown', function (e) {
      if (e.keyCode == 32) stop ();
      if (e.keyCode == 38) add ();
      if (e.keyCode == 40) sub ();
      if (e.keyCode == 37) prev ();
      if (e.keyCode == 39) next ();
    })
  }

  window.onYouTubePlayerAPIReady = function () {
    initData.apply ();
    initUi.apply ();

    var id = s.t ? s.t : (s.l.length ? s.l[0] : 'uNXS9y-QY04');
  
    if (id) {
      player = new YT.Player(
        'player', {
          videoId: id,
          playerVars: {
            rel: 1,
            autoplay: s.a,
            disablekb: 0,
            showsearch: 0,
            showinfo: 0,
            controls: 1,
            wmode: 'opaque',
            hd: 1,
            html5: 1,
            iv_load_policy: 3
          },
          events: {
            'onReady'        : function () {
              player.setVolume (s.v);
              initEvent ();
              $('#loading').fadeOut (function () {
                $(this).remove ();
              });
            },
            'onStateChange'  : function (e) {
              if (e.data == YT.PlayerState.ENDED) {
                next.apply ();
              }
            },
            'onError'        : function () {},
          }
        }
      );
    }
    
  }

//   var player;
//   var index = 0;
//   var list = [];

//   var initData = function () {
//     if (typeof (Storage) !== 'undefined') {
//       var u2 = JSON.parse (localStorage.getItem ('u2'));
//       if (u2) {
//         list = u2.l;
//       } else {
//         list = ['r07tX5x5Oyc', 'wdxGJf21PW0', 'r07tX5x5Oyc', 'wdxGJf21PW0'];
//       }
//       return true;
//     } else {
//       return false;
//     }

//     // list = ['r07tX5x5Oyc', 'wdxGJf21PW0', 'r07tX5x5Oyc'];
// // JSON.parse
// // JSON.stringify
//   }

//   var initUi = function () {
//     if (list.length) {
//       $silders = $('<div />').addClass ('silders').append (list.map (function (t, i) {
//         return $('<div />').data ('id', t).addClass ('silder').append ($('<img />').attr ('src', 'http://img.youtube.com/vi/' + t + '/default.jpg')).append (
//           $('<div />').addClass ('delete').html ('x').click (function (e) {
//             e.stopPropagation();

//             console.info ('1');
//           })
//           );
//       })).appendTo ('.playlist').OAscrollSliderView ({
//         silder: {
//           width: '100px',
//           height: '65px'
//         }
//       });
//       $silders.find ('div.silder').imgLiquid ().click (function (e) {
//         if (!$(this).hasClass ('active')) {
//           $(this).addClass ('active').siblings ().removeClass ('active');
//           player.loadVideoById ($(this).data ('id'));
//         }
//       });
//     }
//     return 1;
//   }

//   var next = function () {
//     var $silder = $silders.find ('.silder');
//     var $active = $silder.filter ('.active');

//     if ($silder.filter ('.active').index () >= $silder.length - 1) $silder.first ().click ();
//     else $active.next ().click ();
//   }

//  window.onYouTubePlayerAPIReady = function () {
//     // if (initData () && initUi ()) {

//     // }
//     return;

//     initData ();
//     initUi ();
//     player = new YT.Player(
//       'player', {
//         videoId: list[index++],
//         playerVars: {
//           rel: 1,
//           autoplay: 0,
//           disablekb: 0,
//           showsearch: 0,
//           showinfo: 0,
//           controls: 1,
//           wmode: 'opaque',
//           hd: 1,
//           html5: 1,
//           iv_load_policy: 3
//         },
//         events: {
//           'onReady'        : function () {
//             // $silders.find ('.silder').first ().click ();
//           },
//           'onStateChange'  : function (e) {
//             if (e.data == YT.PlayerState.ENDED) {
//               next.apply ();
//             }
//           },
//           'onError'        : function () {},
//         }
//       });
//   }

//   var prev = function () {
//     var id = list[index--] || ((index = list.length - 1) || !index) && list[index--];
//     player.loadVideoById (id);
//   }

// $(function () {
//   $('#next').click (function () {
//     next ();
//   });
//   $('.oa-btn').OAripple ().OAjelly ();
//   // $('#prev').click (function () {
//   //   prev ();
//   // });

//     $('.silders').OAscrollSliderView ({
//         silder: {
//           width: '160px',
//           height: '90px'
//         }
//       })
//     $('.silder').imgLiquid ();
// });