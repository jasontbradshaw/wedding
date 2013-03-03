define(['jquery'], function ($) {

  // using some 'this', call the list of functions with the subsequent arguments
  var callList = function (thisArg, callbacks) {
    var args = $.makeArray(arguments).slice(2);
    for (i = 0; i < callbacks.length; i++) {
      callbacks[i].apply(thisArg, args);
    }
  };

  // selector is for the element that will be scrolled. scrollAmount is the
  // number of pixels to scroll by at a time. wrapperSelector is the selector to
  // use for the wrapper element the scroller lives in, but defaults to the
  // parent of the scroller element.
  //
  // this class assumes the markup for a scroller looks something like this:
  // <div class="wrapper">
  //   <div class="scroller"></div> <!-- element to be scrolled -->
  // </div>
  // the outer element should have 'overflow: hidden', and the inner should be
  // the appropriate height for the content. it changes the left margin of the
  // inner element to move its content in and out of the visible area
  var Scroller = function (selector, scrollAmount, windowSize) {
    // the marker for current scroll position
    this._position = 0;

    // the scroller element
    this._$scroller = $(selector);

    // the number of visible items in the scroller (defaults to unspecified)
    this.windowSize = windowSize;

    // make the scroller element enormously wide to prevent content overflow
    this._$scroller.css('width', 100000 + 'px');

    // the amount of pixels that the scroller window will be scrolled by
    this.scrollAmount = scrollAmount;

    // callbacks for events (user can override). all have 'this' bound to the
    // Scoller.
    this._callbacks = {
      // receive no arguments
      left: [],
      right: [],
      position: [],

      // before/after insert receive the item as-given as their only argument
      beforeinsert: [],
      afterinsert: []
    };
  };

  // get or set the current scroller position
  Scroller.prototype.position = function (n) {
    // default to returning the value, not updating it
    if (typeof n === 'undefined') {
      return this._position;
    }

    var i;

    // constrain lower and upper bounds
    n = Math.max(0, n);
    if (this.windowSize) {
      n = Math.min(this._$scroller.children().length - this.windowSize, n);
    }

    // update the position marker
    this._position = n;

    // change the margin on the scroller element
    this._$scroller.css('margin-left', this._position * -this.scrollAmount + 'px');

    // trigger position change events
    for (i = 0; i < this._callbacks.position.length; i++) {
      this._callbacks.position[i].call(this, i);
    }

    // trigger position change events
    if (this.atLeftEdge()) {
      callList(this, this._callbacks.left);
    } else if (this.atRightEdge()) {
      // a window size has been specified and we're now at the end of scrolling
      callList(this, this._callbacks.right);
    }
  };

  // return whether the scroller is at the right edge (only true if windowSize
  // was specified). also returns true if there aren't enough items to fill the
  // viewable area.
  Scroller.prototype.atRightEdge = function () {
    return (this.windowSize &&
        this._position + this.windowSize >= this._$scroller.children().length);
  };

  // return whether the scroller is at the left edge
  Scroller.prototype.atLeftEdge = function () {
    return this._position === 0;
  };

  // scroll left by one position
  Scroller.prototype.left = function () {
    this.position(this.position() - 1);
  };

  // scroll right by one position
  Scroller.prototype.right = function (n) {
    this.position(this.position() + 1);
  };

  // bind to a callback function (possibilities are defined in _callbacks)
  Scroller.prototype.bind = function (eventName, callback) {
    this._callbacks[eventName].push(callback);
  };

  // trigger an event using the specified arguments, if supplied
  Scroller.prototype.trigger = function (eventName) {
    callList(this, this._callbacks[eventName] || [],
        $.makeArray(arguments).slice(1));
  };

  // add an item to the scroller element
  Scroller.prototype._add = function (addFun, item) {
    var i;

    // call the 'before insert' events with the item
    callList(this, this._callbacks.beforeinsert, item);

    // add the item using the specified function
    this._$scroller[addFun](item);

    // call the 'after insert' events with the item
    callList(this, this._callbacks.afterinsert, item);

    // call the right event if we've reached the right edge (or aren't full yet)
    if (this.atRightEdge()) {
      callList(this, this._callbacks.right);
    }
  };

  // append an item to the scroller element
  Scroller.prototype.append = function (item) {
    this._add('append', item);
  };

  // prepend an item to the scroller element
  Scroller.prototype.prepend = function (item) {
    this._add('prepend', item);
  };

  return Scroller;
});
