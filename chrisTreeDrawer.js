(function( $, _, d3, ChrisTree ) {

  $.fn.drawChrisTree = function( userSettings ) {
    var self = this;

    // After defining default settings, call the helper function to draw the actual tree
    self.customTree = new ChrisTree(userSettings);
    self.customTree.refreshTree();

    return self;
  };
}(jQuery, _, d3, ChrisTree ));