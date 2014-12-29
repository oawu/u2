/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2014 OA Wu Design
 */

(function( factory ) {
  if ((typeof define === 'function') && define.amd) define (['jquery'], factory);
  else factory (jQuery);
}(function ($) {

  $.fn.extend ({
    OAimgLiquid: function (opt) {
      var d4Opt = {
        defaultSrcDatakey: 'src',
        dataPositionName: 'position',
        dataOverflowName: 'overflow',
        position: '=', // -, =, +, number, percent
        agreeOverflow: false
      },
      ImgLoad = function ($obj, callback, count, maxCount) {
        if (!$obj.get (0).complete)
          $obj.load (function () {
            callback ();
          }).error (function () {
            if ((count++ < maxCount) && $obj.data (opt.defaultSrcDatakey)) {
              ImgLoad ($obj.attr ('src',$obj.data (opt.defaultSrcDatakey)), callback, count, maxCount);
            }
          });
        else
          callback ();
      },
      calcHeight = function (i, p) {
        return {w: Math.ceil (i.w * Math.ceil (100 * p.h / i.h) / 100), h: p.h};
      },
      calcWidth  = function (i, p) {
        return {w: p.w, h: Math.ceil (i.h * Math.ceil (100 * p.w / i.w) / 100)};
      },
      calcImageSizeStrict = function (i, p) {
        var n  = {w: p.w, h: p.h};

        if (p.w >= p.h) {
          if (i.w > i.h)  {
            n = calcHeight (i, p);
            n = n.w < p.w ? calcWidth (i, p) : n;
          } else if (i.h >= i.w) {
            n = calcWidth (i, p);
            n = n.h < p.h ? calcHeight (i, p) : n;
          }
        } else if (p.h > p.w) {
          if (i.w >= i.h) {
            n = calcWidth (i, p);
            n = n.h < p.h ? calcHeight (i, p) : n;
          } else if (i.h > i.w) {
            n = calcHeight (i, p);
            n = n.w < p.w ? calcWidth (i, p) : n;
          }
        }
        return n;
      };
      
      opt = $.extend (true, d4Opt, opt);

      return $(this).each (function () {
        if ($(this).data (opt.dataPositionName))
          opt = $.extend ({}, opt, {position: $(this).data (opt.dataPositionName)});
        
        if ($(this).data (opt.dataOverflowName))
          opt = $.extend ({}, opt, {agreeOverflow: $(this).data (opt.dataOverflowName)});

        p = {w: parseFloat ($(this).css ('width')), h: parseFloat ($(this).css ('height'))}
        $img = $(this).children ('img');

        if (!($.isNumeric(p.h) && $.isNumeric(p.w) && (p.w > 0) && (p.h > 0) && $img.length && (($(this).css ('position') == 'absolute') || ($(this).css ('position') == 'relative'))))
          return ;

        $(this).css ({'overflow': 'hidden'});

        ImgLoad ($img, function (opt, $obj) {
          var i = {w: parseFloat ($obj.css ('width')), h: parseFloat ($obj.css ('height'))};

          if (!($.isNumeric(i.h) && $.isNumeric(i.w) && (i.w > 0) && (i.h > 0)))
            return ;

          var p = {w: parseFloat ($(this).css ('width')), h: parseFloat ($(this).css ('height'))}
          var n = calcImageSizeStrict (i, p);

          $obj.css ({'position': 'absolute', 'width': n.w, 'height': n.h});
          var ms = (opt.position + '').match (/(^\s*\d+\.?\d*)(%)\s*$/);
          if (ms) opt.position = (n.h > p.h ? (n.h - p.h) : (n.w - p.w)) * (ms[1] / 100);

          ms = (opt.position + '').match (/(^\s*?\-?\d+\.?\d*)(px)\s*$/);
          if (ms) opt.position = ms[1];

          if (n.h > p.h) $obj.css ({'left': '0', 'top': $.isNumeric (opt.position) ? (!opt.agreeOverflow && opt.position > Math.abs (n.h - p.h) ? ((0 - Math.abs (n.h - p.h)) + 'px') : (!opt.agreeOverflow && opt.position < 0 ? 0 : ((0 - opt.position) + 'px'))) : (opt.position == '-' ? 0 : (opt.position == '+' ? ((0 - Math.abs (n.h - p.h)) + 'px') : ((0 - (Math.abs (n.h - p.h) / 2)) + 'px')))});
          else $obj.css ({'top': '0', 'left': $.isNumeric (opt.position) ? (!opt.agreeOverflow && opt.position > Math.abs (n.w - p.w) ? ((0 - Math.abs (n.w - p.w)) + 'px') : (!opt.agreeOverflow && opt.position < 0 ? 0 : ((0 - opt.position) + 'px'))) : (opt.position == '-' ? 0 : (opt.position == '+' ? ((0 - Math.abs (n.w - p.w)) + 'px') : ((0 - (Math.abs (n.w - p.w) / 2)) + 'px')))});

        }.bind ($(this), opt, $img), 0, 3);
      });
    }
  });
}));