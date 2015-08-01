/*********************************************************************
* Author: Matias Grioni
* Created: 7/9/2015
*
* Originally created by nhoening, modified to fit needs other than a
* hover popup. This popup must be supplied an anchor id, and no
* other DOM elements should have the class popup to minimize conflicts
*********************************************************************/

// Create a jQuery alias to avoid any conflicts between libraries.
var $jq = jQuery;

/*********************************************************************
* A constructor for the Popup that requires the view id and anchor id.
* The DOM element that is to be popped, is automatically given the
* popup class if not already present.
*
* @param id - The id of the div that defines the popup layout.
* @param anchorId - The id of the DOM element that the popup will be
*   anchored to.
* @return - A popup object that can be shown, hidden, etc.
*********************************************************************/
var Popup = function(id, anchorId) {
    this.id = id;
    this.container = $jq("#" + id);

    this.anchorId = anchorId;
    this.anchor = $jq("#" + anchor);

    if (!this.container.hasClass("popup"))
        this.container.addClass("popup");
    
    this.dx = 0;
    this.dy = 0;
}

/*********************************************************************
* Set the offset of the top left corner of the popup
*
* @param dx - The x offset for the top left corner of the popup.
* @param dy - The y offset for the top left corner of the popup.
*********************************************************************/
Popup.prototype.setOffset = function(dx, dy) {
    this.dx = dx;
    this.dy = dy;
}

/*********************************************************************
* Show the popup. The top left corner is anchored at the anchorId
* element. The popup is automatically closed when there is a mousedown
* event outside of the popup element.
*********************************************************************/
Popup.prototype.popup = function() {
    this._position(this.anchor.offset().left + this.dx,
        this.anchor.offset().top + this.dy);
    
    this.container.show("fast");
    
    // Hide the popup if there is a click outside of the popup
    var that = this;
    $jq(document).on("mousedown", function(event) {
        if($jq(event.target).closest(".popup").length == 0) {
            that.container.hide("fast");
            event.stopPropagation();
        }
    });
}

/*********************************************************************
* Force close the popup. Useful to close the popup on an event that
* is not a click outside of the popup, which causes it to close
* automatically.
*********************************************************************/
Popup.prototype.close = function() {
    this.container.hide("fast");
}

/*********************************************************************
* Set this popup element to the desired position.
*
* @param x - The x position of the top left corner of the popup.
* @param y - The y position of the top left corner of the popup.
*********************************************************************/
Popup.prototype._position = function(x, y) {
    // Call nudge to avoid edge overflow. Important tweak: x+10, because if
    //  the popup is where the mouse is, the hoverOver/hoverOut events flicker
    var pos = this._overflow(x, y);
    // remember: the popup is still hidden
    this.container.css("left", pos[0] + 'px')
                  .css("top", pos[1] + 'px');
}

/*********************************************************************
* Check if this popup would overflow to the right or down given this
* (x, y) position and the offsets provided.
*
* @param x - The requested x position for the popup.
* @param y - The requested y position for the popup.
* @return - A list of the calculated position if there was any
*   overflow. The list is in the form [x, y], where at these positions
*   the popup will not pass the borders of the window.
*********************************************************************/
Popup.prototype._overflow = function(x,y) {
    var win = $jq(window);

    // If the left corner of the popup is too far to the right, adjust it.
    // This way the top right corner will be at the anchor.
    var xtreme = win.width() - (this.container.width() + this.dx);
    if(x > xtreme)
        x -= (this.container.width() + this.dx);

    // If the top edge is too low, set the bottom edge to anchor.
    var ytreme = win.height() - (this.container.height() + this.dy);
    if(y > ytreme)
        y -= (this.container.height() + this.dy);

    return [x, y];
}
