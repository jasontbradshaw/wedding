define(['jquery', 'scroller'], function ($, Scroller) {

  var buildCarousel = function (selector, scrollIntervalSeconds) {
    var $carousel = $(selector);
    var $scroller = $carousel.find('.scroller');
    var $thumbnails = $carousel.find('.thumbnails');

    var selectedClass = 'selected';
    var scrollAmount = $carousel.innerWidth();

    var scroller = new Scroller($scroller, scrollAmount, 1);

    $scroller.children().each(function (i) {
      // fill the image picker with clones of the carousel's images
      var $thumbnail = $(this).clone(false);
      $thumbnails.append($thumbnail);
    });

    // select the appropriate thumbnail every time we change images
    scroller.bind('position', function (i) {
      $thumbnails.children().removeClass(selectedClass)
          .filter(':eq(' + scroller.position() + ')').addClass(selectedClass);
    });

    // switched for scrolling
    var shouldScroll = true;
    var startScrolling = function () { shouldScroll = true; };
    var stopScrolling = function () { shouldScroll = false; };

    // change to the next image unless disabled
    var nextImage = function () {
      // only scroll if we should scroll at all
      if (shouldScroll) {
        // reset if we were at the end
        if (scroller.atRightEdge()) {
          scroller.position(0);
        } else {
          // otherwise, go to the next image
          scroller.right();
        }
      }
    };

    // only scroll when the mouse isn't on the carousel
    $carousel.bind('mouseenter', stopScrolling);
    $carousel.bind('mouseleave', startScrolling);

    // change position on thumbnail click
    $thumbnails.live('click', function (event) {
      var $target = $(event.target);
      if ($target.is('.carousel-image')) {
        scroller.position($target.index());
      }
    });

    // kick off the scroller
    setInterval(nextImage, scrollIntervalSeconds * 1000);
    scroller.position(0);

    return scroller;
  };

  buildCarousel('.carousel', 10);

});
