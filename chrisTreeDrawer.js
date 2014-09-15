(function( $, _, d3, ChrisTree ) {

  $.fn.drawTree = function( userSettings ) {
    var self = this;

    // Define default settings to be used for each setting the user doesn't specify 
    self.defaultSettings = {
      treeContainer: '#tree-container',
      treeContainerPadding: 8,
      treeOrientation: 0,
      linkOrientation: 'down',
      nodeChildName: 'node',
      nodeDataName: 'data',
      nodeType: '',
      linkType: 'elbow',
      nodeWidth: 20,
      nodeHeight: 20,
      depthSpacing: 20,
      widthSpacing: 20,
      nodeBkndClasses: ['node-background'],
      nodeTmplClasses: ['node-html-container'],
      linkClasses: ['link-html-container'],
      arrowClasses: ['arrow-html-container'],
      notSupportedMsg: 'Sorry, d3 html templates are not supported by your browser.',
      nodeHTMLTemplate: function (d) {
        return '<div id="node-template">' + d.data + '</div>';
      },
      nodeData: {
        data: '1',
        node: [{
          data: '2',
          node: [{
            data: '5'
          }, {
            data: '6'
          }]
        }, {
          data: '3'
        }, {
          data: '4',
          node: [{
            data: '7',
            node: [{
              data: '10'
            }]
          }, {
            data: '8'
          }, {
            data: '9'
          }]
        }]
      }
    };

    // We can use the extend method to merge settings as usual:
    // But with the added first parameter of TRUE to signify a DEEP COPY:
    self.mergedSettings = $.extend( true, self.defaultSettings, userSettings );

    // After defining default settings, call the helper function to draw the actual tree
    self.customTree = new ChrisTree(userSettings);

    return self;
  };
}(jQuery, _, d3, ChrisTree ));