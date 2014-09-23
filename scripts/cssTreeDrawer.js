(function( $, d3, CSSTree ) {

  $.fn.drawCSSTree = function( userSettings ) {
    var self = this;

    // After defining default settings, call the helper function to draw the actual tree
    self.customTree = new CSSTree(userSettings);
    self.customTree.refreshTreeLayout();

    return self;
  };
}(jQuery, d3, CSSTree ));