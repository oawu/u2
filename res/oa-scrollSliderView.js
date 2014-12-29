/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2014 OA Wu Design
 */

(function( factory ) {
  if ((typeof define === 'function') && define.amd) define (['jquery'], factory);
  else factory (jQuery);
}(function ($) {

  $.fn.extend ({
    OAscrollSliderView: function (opt) {
      var d4Opt = {
        selector: '.silder',
        maxCount: 0,
        sildersWidth: '100%',
        arrow: {
          width: '40px',
          leftSvg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="28" viewBox="0 0 20 28"><g id="icomoon-ignore"></g><path d="M18.297 4.703l-8.297 8.297 8.297 8.297q0.297 0.297 0.297 0.703t-0.297 0.703l-2.594 2.594q-0.297 0.297-0.703 0.297t-0.703-0.297l-11.594-11.594q-0.297-0.297-0.297-0.703t0.297-0.703l11.594-11.594q0.297-0.297 0.703-0.297t0.703 0.297l2.594 2.594q0.297 0.297 0.297 0.703t-0.297 0.703z" fill="#000000"></path></svg>',
          rightSvg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="28" viewBox="0 0 20 28"><g id="icomoon-ignore"></g><path d="M17.297 13.703l-11.594 11.594q-0.297 0.297-0.703 0.297t-0.703-0.297l-2.594-2.594q-0.297-0.297-0.297-0.703t0.297-0.703l8.297-8.297-8.297-8.297q-0.297-0.297-0.297-0.703t0.297-0.703l2.594-2.594q0.297-0.297 0.703-0.297t0.703 0.297l11.594 11.594q0.297 0.297 0.297 0.703t-0.297 0.703z" fill="#000000"></path></svg>'
        },
        silder: {
          width: '160px',
          height: '100px',
          marginTop: '20px',
          marginBottom: '20px',
          marginRight: '10px',
          marginLeft: '10px'
        }
      },
      init = function (opt) {

        var timer = null,
            w = $(this).data ('silder_width') ? $(this).data ('silder_width') : opt.silder.width,
            h = $(this).data ('silder_height') ? $(this).data ('silder_height') : opt.silder.height,
            mt = $(this).attr ('data-silder_marginTop') ? $(this).attr ('data-silder_marginTop') : opt.silder.marginTop,
            mb = $(this).attr ('data-silder_marginBottom') ? $(this).attr ('data-silder_marginBottom') : opt.silder.marginBottom,
            mr = $(this).attr ('data-silder_marginRight') ? $(this).attr ('data-silder_marginRight') : opt.silder.marginRight,
            ml = $(this).attr ('data-silder_marginLeft') ? $(this).attr ('data-silder_marginLeft') : opt.silder.marginLeft,
            $silder = $(this).hide ().addClass ('oa-scrollSliderView').addClass ('oa-scrollSliderView-hide').data ('count', 0).css ({'width': $(this).attr ('data-sildersWidth') ? $(this).attr ('data-sildersWidth') : opt.sildersWidth, 'height': parseFloat (h) + parseFloat (mt) + parseFloat (mb) + 'px'}).children ($(this).data ('selector') ? $(this).data ('selector') : opt.selector).clone (true, true).map (function () { return $(this).addClass ('oa-scrollSliderView-silder').css ({'width': parseFloat (w) + 'px', 'height': 'calc(100% - ' + parseFloat (mt) + 'px' + ' - ' + parseFloat (mb) + 'px' + ')', 'margin': mt + ' ' + mr + ' ' + mb + ' ' + ml}); }),
            $silders = $('<div />').addClass ('oa-scrollSliderView-silders').append ($silder.map (function () { return $(this).get (0); })),
            $container = $('<div />').addClass ('oa-scrollSliderView-container').css ({'width': 'calc(100% - ' + (parseFloat ($(this).data ('arrow_width') ? $(this).data ('arrow_width') : opt.arrow.width) * 2) + 'px' + ')'}).append ($silders),
            $leftArrow = $('<div />').addClass ('oa-scrollSliderView-arrow-left').css ({'width': (parseFloat ($(this).data ('arrow_width') ? $(this).data ('arrow_width') : opt.arrow.width) - 1) + 'px', 'line-height': parseFloat (h) + 40 + 'px'}).append ($(this).attr ('data-arrow_leftSvg') ? $(this).attr ('data-arrow_leftSvg') : opt.arrow.leftSvg).hide (),
            $rightArrow = $('<div />').addClass ('oa-scrollSliderView-arrow-right').css ({'width': (parseFloat ($(this).data ('arrow_width') ? $(this).data ('arrow_width') : opt.arrow.width) - 1) + 'px', 'line-height': parseFloat (h) + 40 + 'px'}).append ($(this).attr ('data-arrow_rightSvg') ? $(this).attr ('data-arrow_rightSvg') : opt.arrow.rightSvg).hide ();

        $(this).empty ().append ($leftArrow).append ($rightArrow).append ($container).show ();

        opt.maxCount = $(this).attr ('data-maxCount') ? $(this).attr ('data-maxCount') : opt.maxCount;
        var silderCount = opt.maxCount && $silder.length > opt.maxCount ? opt.maxCount : $silder.length;
        var silderWidth = $silder[0] ? (parseFloat ($silder[0].css ('width')) + parseFloat ($silder[0].css ('margin-left')) + parseFloat ($silder[0].css ('margin-right'))) : 0,
            scrollTo = function (to, duration) {
                var start = $container.scrollLeft (),
                    change = to - start,
                    currentTime = 0,
                    increment = 20,
                    animateScroll = function () {
                      currentTime += increment;
                      $container.scrollLeft (easeInOutQuad (currentTime, start, change, duration));
                      if(currentTime < duration) timer = setTimeout (animateScroll, increment);
                    };

                clearTimeout (timer);
                animateScroll ();
            },
            easeInOutQuad = function (t, b, c, d) { return (t /= d / 2) < 1 ? (c / 2 * t * t + b) : (-c / 2 * (--t * (t - 2) - 1) + b); }

        $silders.css ({'width': (silderCount * silderWidth) + 'px' });
        if ((silderWidth * $(this).data ('count') + $container.width ()) < $silders.width ())
          $rightArrow.show ();

        $leftArrow.click (function () {
          if (!silderWidth) return;

          var count = Math.floor ($container.scrollLeft () / silderWidth);
          $(this).data ('count', --count < 0 ? 0 : count);

          if ((silderWidth * $(this).data ('count') + $container.width ()) > $silders.width ()) $rightArrow.hide ();
          if (!$(this).data ('count')) $leftArrow.fadeOut ();
          if (!$rightArrow.is (':visible') && ((silderWidth * $(this).data ('count') + $container.width ()) < $silders.width ())) $rightArrow.fadeIn ();

          scrollTo (silderWidth * count, 300);
        }.bind ($(this)));

        $rightArrow.click (function () {
          if (!silderWidth) return;
          var count = Math.floor ($container.scrollLeft () / silderWidth);
          $(this).data ('count', ++count < 0 ? 0 : count);

          if ((silderWidth * $(this).data ('count') + $container.width ()) > $silders.width ()) $rightArrow.fadeOut ();
          if (!$leftArrow.is (':visible')) $leftArrow.fadeIn ();

          scrollTo (silderWidth * $(this).data ('count'), 300);
        }.bind ($(this)));

        $(this).removeClass ('oa-scrollSliderView-hide');
      }

      opt = $.extend (true, d4Opt, opt);

      return $(this).each (function () {
        init.bind ($(this), opt).apply ();
      });
    }
  });
}));
