/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2014 OA Wu Design
 */

  var tag = document.createElement ('script');
      tag.src = "https://www.youtube.com/iframe_api";

  var firstScriptTag = document.getElementsByTagName ('script')[0];
      firstScriptTag.parentNode.insertBefore (tag, firstScriptTag);

  var player;
  var index = 0;
  var list = [];
  var $silders = null;

  var initData = function () {
    if (typeof (Storage) !== 'undefined') {
      var u2 = JSON.parse (localStorage.getItem ('u2'));
      if (u2) {
        list = u2.l;
      } else {
        list = ['r07tX5x5Oyc', 'wdxGJf21PW0', 'r07tX5x5Oyc', 'wdxGJf21PW0'];
      }
      return true;
    } else {
      return false;
    }

    // list = ['r07tX5x5Oyc', 'wdxGJf21PW0', 'r07tX5x5Oyc'];
// JSON.parse
// JSON.stringify
  }

  var initUi = function () {
    if (list.length) {
      $silders = $('<div />').addClass ('silders').append (list.map (function (t, i) {
        return $('<div />').data ('id', t).addClass ('silder').append ($('<img />').attr ('src', 'http://img.youtube.com/vi/' + t + '/default.jpg')).append (
          $('<div />').addClass ('delete').html ('x').click (function (e) {
            e.stopPropagation();

            console.info ('1');
          })
          );
      })).appendTo ('.playlist').OAscrollSliderView ({
        silder: {
          width: '100px',
          height: '65px'
        }
      });
      $silders.find ('div.silder').imgLiquid ().click (function (e) {
        if (!$(this).hasClass ('active')) {
          $(this).addClass ('active').siblings ().removeClass ('active');
          player.loadVideoById ($(this).data ('id'));
        }
      });
    }
    return 1;
  }

  var next = function () {
    var $silder = $silders.find ('.silder');
    var $active = $silder.filter ('.active');

    if ($silder.filter ('.active').index () >= $silder.length - 1) $silder.first ().click ();
    else $active.next ().click ();
  }

 window.onYouTubePlayerAPIReady = function () {
    // if (initData () && initUi ()) {

    // }

    initData ();
    initUi ();
    player = new YT.Player(
      'player', {
        videoId: list[index++],
        playerVars: {
          rel: 1,
          autoplay: 0,
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
            // $silders.find ('.silder').first ().click ();
          },
          'onStateChange'  : function (e) {
            if (e.data == YT.PlayerState.ENDED) {
              next.apply ();
            }
          },
          'onError'        : function () {},
        }
      });
  }

  var prev = function () {
    var id = list[index--] || ((index = list.length - 1) || !index) && list[index--];
    player.loadVideoById (id);
  }

$(function () {
  $('#next').click (function () {
    next ();
  });
  $('.oa-btn').OAripple ().OAjelly ();
  // $('#prev').click (function () {
  //   prev ();
  // });

    // $('.silders').OAscrollSliderView ();
  // $('.silder').OAimgLiquid ();
});