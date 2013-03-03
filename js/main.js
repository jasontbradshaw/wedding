define(['jquery', 'scroller'], function ($, Scroller) {

  $(function () {
    var scroller = new Scroller('#carousel .scroller', 880, 1);

    var updatePosition = function () {
      scroller.position($(this).index());
    };

    // inject the image picker items into the carousel
    for (var i = 0; i < $('#carousel .scroller').children().length; i++) {
      var $picker = $('<li>');
      $('#carousel .index-picker').append($picker);
      if (i === 0) {
        $picker.addClass('selected');
      }

      $picker.click(updatePosition);
    }

    scroller.bind('position', function (i) {
      // select the current image picker
      $('#carousel .index-picker').children().removeClass('selected')
          .filter(':eq(' + scroller.position() + ')').addClass('selected');
    });

    var scrollerInterval = setInterval(function () {
      // reset if we were at the end
      if (scroller.atRightEdge()) {
        scroller.position(0);
      } else {
        // otherwise, go to the next image
        scroller.right();
      }
    }, 10 * 1000);
  });

});
