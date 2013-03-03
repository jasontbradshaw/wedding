define(['jquery', 'scroller'], function ($, Scroller) {

  $(function () {
    var $carousel = $('#carousel');
    var $scroller = $carousel.find('.scroller');
    var $thumbnails = $carousel.find('.thumbnails');

    var scroller = new Scroller($scroller, 880, 1);

    var updatePosition = function () {
      scroller.position($(this).index());
    };

    // fill the image picker with clones of the carousel images
    $scroller.children().each(function (i) {
      // clone the current carousel image as a thumbnail
      var $thumbnail = $(this).clone(false);
      $thumbnail.click(updatePosition);
      $thumbnails.append($thumbnail);
    });

    // select the currently thumbnail every time we change images
    scroller.bind('position', function (i) {
      $thumbnails.children().removeClass('selected')
          .filter(':eq(' + scroller.position() + ')').addClass('selected');
    });

    // change to the next image unless disabled
    var shouldScroll = true;
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

    // switched for scrolling
    var startScrolling = function () { shouldScroll = true; };
    var stopScrolling = function () { shouldScroll = false; };

    // only scroll when the mouse isn't on the carousel
    $carousel.bind('mouseenter', stopScrolling);
    $carousel.bind('mouseleave', startScrolling);

    // kick off the scroller
    setInterval(nextImage, 10 * 1000);
    scroller.position(0);
  });

});
