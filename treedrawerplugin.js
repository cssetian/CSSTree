(function( $, _, d3 ) {

  $.fn.drawTree = function( userSettings ) {
    var self = this;

    // Define default settings to be used for each setting the user doesn't specify 
    var defaultSettings = {
      treeContainerId: '#tree-container',
      orientation: 0,
      nodeSizing: {
        width: 200,
        height: 100
      },
      linkStrategy: 'elbow',
      nodeSpacing: {
        level: 100,
        span: 10
      },
      childNodeName: 'node',
      nodeHTMLTemplate: function (d) {
        return '<div id="node-template">' + d.dataValue + '</div>';
      },
      node: {
        dataValue: '1',
        node: [{
          dataValue: '2',
          node: [{
            dataValue: '5'
          }, {
            dataValue: '6'
          }]
        }, {
          dataValue: '3'
        }, {
          dataValue: '4',
          node: [{
            dataValue: '7',
            node: [{
              dataValue: '10'
            }]
          }, {
            dataValue: '8'
          }, {
            dataValue: '9'
          }]
        }]
      },
      nodeBkndClasses: ['node-background'],
      nodeHTMLClasses: ['node-html-container'],
      linkClasses: ['link-html-container'],
      arrowClasses: ['arrow-html-container'],
      notSupportedMessage: 'Sorry, d3 html templates are not supported by your browser.'
    };

    // We can use the extend method to merge settings as usual:
    // But with the added first parameter of TRUE to signify a DEEP COPY:
    var mergedSettings = $.extend( {}, defaultSettings, userSettings );

    // After defining default settings, call the helper function to draw the actual tree
    _drawTree(mergedSettings);

    return self;
  };


  /*************************** Generic Tree Drawing Function ****************************/
  var _drawTree = function (settings) {
    var treeSettings = {};

    /**************************** Tree Layout Constants *********************************/
    treeSettings.DATA_ROOT_NODE            = settings.node;                     // The Javascript object representing the root node of the tree
    treeSettings.TREE_CONTAINER_ID         = settings.treeContainerId;          // ID of the element the tree will be appended to
    treeSettings.CHILD_NODE_NAME           = settings.childNodeName;            // Property name of the node container JSON property
    treeSettings.NODE_WIDTH                = settings.nodeSizing.width;         // Width of each node
    treeSettings.NODE_HEIGHT               = settings.nodeSizing.height;        // Height of each node
    treeSettings.NODE_DEPTH_SPACING        = settings.nodeSpacing.level;        // Depth-wise spacing in pixels between each level of the tree
    treeSettings.NODE_SPAN_SPACING         = settings.nodeSpacing.span;         // Span-wise spacing in pixels between each sibling/cousin of the tree
    treeSettings.G_EL_TREE_PADDING         = 8;                                // Needs at least a slight padding offset, likely because of node borders
    treeSettings.HTML_TEMPLATE             = settings.nodeHTMLTemplate;         // Function that returns the compiled HTML template string appended to each node's foreignObject element
    treeSettings.NODE_CSS_CLASSES          = settings.nodeHTMLClasses;          // Any classes to be added onto the root HTML template element of each node
    treeSettings.NODE_BKND_CSS_CLASSES     = settings.nodeBkndClasses;          // Any classes to be added onto the rect SVG element of each node
    treeSettings.LINK_CSS_CLASSES          = settings.linkClasses;              // Any classes to be added onto the links between each pair of nodes
    treeSettings.ARROW_CSS_CLASSES         = settings.arrowClasses;             // Any classes to be added onto the link arrows at the end of each link
    treeSettings.D3_NOT_SUPPORTED_MSG      = settings.notSupportedMessage;      // Message to be displayed when d3 is not supported by the user's browser
    treeSettings.ROTATION_ANGLE_DEGREES    = settings.orientation;
    treeSettings.LINK_STRATEGY             = settings.linkStrategy;

    /************************* Tree Layout Calcualted Fields *****************************/
    // Calculates the rotation angle in radians for the tree, with an angle of 0 having a downward direction
    treeSettings.ROTATION_ANGLE_RADIANS    = treeSettings.ROTATION_ANGLE_DEGREES * (Math.PI / 180);

    // Calculates the sin and cos of the rotation angle for various projection calculations throughout the function
    treeSettings.SIN_R                     = Math.round(Math.sin(treeSettings.ROTATION_ANGLE_RADIANS));
    treeSettings.COS_R                     = Math.round(Math.cos(treeSettings.ROTATION_ANGLE_RADIANS));

    // The H/W ratio via H_W_RATIO scales so that it always results in d3ParsedNodes being adjacent when horizontal spacing is 0.
    treeSettings.H_W_RATIO = (treeSettings.NODE_HEIGHT / treeSettings.NODE_WIDTH);

    // Helper field that calcualtes the actual number of pixels that need to be between the 
    treeSettings.BASE_ZERO_SPAN_SPACING = treeSettings.H_W_RATIO * Math.abs(treeSettings.SIN_R) + (1) * Math.abs(treeSettings.COS_R);

    // A decimal percent specifying the spacing between sibling and cousin elements - Used with the separation function on the layout
    // Use NODE_WIDTH if tree is vertical, NODE_HEIGHT if tree is horizontal
    treeSettings.NODE_SPAN_SPACING_PCT = (1 / treeSettings.NODE_WIDTH) * ( (treeSettings.NODE_HEIGHT * Math.abs(treeSettings.SIN_R)) + (treeSettings.NODE_WIDTH * Math.abs(treeSettings.COS_R)) + treeSettings.NODE_SPAN_SPACING );

    /*************************** Tree Layout Initialization ******************************/
    // Generate the basic tree layout, given its logical structure - extract the nodes and links to feed into and calculate the display
    var d3TreeLayout = helpers.d3TreeLayoutBuilder(treeSettings);
    var treeLayout = d3TreeLayout.layout; // Never used
    var treeNodes = d3TreeLayout.nodes;
    var treeLinks = d3TreeLayout.links;

    // Calculate the layout boundaries because the tree is centered at (0,0) and needs to be offset to be entirely in the container
    var minMaxCoords = helpers.calculateMinMaxCoords(treeNodes);
    treeSettings.MIN_X = minMaxCoords.MIN_X;
    treeSettings.MIN_Y = minMaxCoords.MIN_Y;
    treeSettings.MAX_X = minMaxCoords.MAX_X;
    treeSettings.MAX_Y = minMaxCoords.MAX_Y;

    // Calculate the offset of the root node of the tree, based on the overall dimensions and spacing of the tree nodes
    var offsets = helpers.calculateTreeRootNodeOffset(treeSettings);
    treeSettings.ROOT_X_OFFSET = offsets.ROOT_X_OFFSET;
    treeSettings.ROOT_Y_OFFSET = offsets.ROOT_Y_OFFSET;

    // Calculate the height and width of the container that will hold the tree
    var heightAndWidth = helpers.calculateHeightAndWidth(treeSettings, treeNodes);
    treeSettings.TREE_CONTAINER_HEIGHT = heightAndWidth.TREE_CONTAINER_HEIGHT;
    treeSettings.TREE_CONTAINER_WIDTH = heightAndWidth.TREE_CONTAINER_WIDTH;

    // Generate the different link types we can use for drawing links between nodes
    switch(treeSettings.LINK_STRATEGY) {
    case 'diagonal':
      treeSettings.LINK_FUNCTION = helpers.diagonalLinkStrategy(treeSettings);
      break;
    case 'elbow':
      treeSettings.LINK_FUNCTION = helpers.elbowLinkStrategy(treeSettings);
      break;
    }

    /********************** DRAW TREE WITH HELPER FUNCTIONS *************************/
    // Generate the SVG element that will serve as a container for the SVG representation of the tree
    var svgTreeObject = helpers.svgContainerElBuilder(treeSettings);
    
    // Initialize the SVG nodes - defines their depth, gives each node an ID, and applies any necessary transformations
    var svgInitializedNodes = helpers.svgNodeBuilder(treeSettings, svgTreeObject, treeNodes);

    // Check to make sure the browser supports the ForeignObject feature of SVG
    var foreignObjectIsSupported = document.implementation.hasFeature('w3.org/TR/SVG11/feature#Extensibility', '1.1');

    // If the foreignObject feature is supported, append the HTML Template. Otherwise, append a not-supported message
    if (foreignObjectIsSupported) {
      helpers.svgForeignObjTemplate(treeSettings, svgInitializedNodes);
    } else {
      helpers.svgForeignObjNotSupportedTemplate(treeSettings, svgInitializedNodes);
    }

    // Define the basic properties of the Link Markers, which will be used for a custom marker during link creation
    helpers.svgDefineFixedMarkerArrows(treeSettings, svgTreeObject);
    
    // Finally, append the links to the tree
    helpers.svgLinkBuilder(treeSettings, svgTreeObject, treeLinks);
  };

  /*----------------------------- HELPER FUNCTIONS ---------------------------------*/
  var helpers = {

    /*********************** Calculate Computed Properties **************************/
    // Calculate the min and max coords of the calculated tree layout for centering
    calculateMinMaxCoords: function(treeNodes) {
      // Calculate the min and max values of the tree layout, giving you a bounding box with which a tree container element can be created
      var MIN_X_COORDS = _.min(treeNodes, function (node) { return node.x; });
      var MAX_X_COORDS = _.max(treeNodes, function (node) { return node.x; });
      var MIN_Y_COORDS = _.min(treeNodes, function (node) { return node.y; });
      var MAX_Y_COORDS = _.max(treeNodes, function (node) { return node.y; });
      console.log('Min X: ' + Math.round(MIN_X_COORDS.x) + ' | Max X: ' + Math.round(MAX_X_COORDS.x));
      console.log('Min Y: ' + Math.round(MIN_Y_COORDS.y) + ' | Max Y: ' + Math.round(MAX_Y_COORDS.y));

      return {
        MIN_X: MIN_X_COORDS.x,
        MIN_Y: MIN_Y_COORDS.y,
        MAX_X: MAX_X_COORDS.x,
        MAX_Y: MAX_Y_COORDS.y
      };
    },

    // Calculate the tree root node offsets, so it can be centered in the containing el
    calculateTreeRootNodeOffset: function(settings) {
      var SIN_R = settings.SIN_R;
      var COS_R = settings.COS_R;

      // Calculate the root node X offset based on the min and max layout positionings, along with offsets based on orientation
      // The X offset is always the offset of the tree in the SPAN (horizontal) direction
      var ROOT_X_OFFSET = 0;    // By default no X offset
      if (SIN_R === 1 || COS_R === 1) {
        ROOT_X_OFFSET = SIN_R * ((-1 * settings.MIN_X) + (settings.G_EL_TREE_PADDING / 2)) +
                        COS_R * ((-1 * settings.MIN_X) + (settings.G_EL_TREE_PADDING / 2));
      } else if (SIN_R === -1 || COS_R === -1) {
        ROOT_X_OFFSET = SIN_R * (settings.MAX_X + (settings.G_EL_TREE_PADDING / 2)) +
                        COS_R * (settings.MAX_X + (settings.G_EL_TREE_PADDING / 2));
      }

      // If necessary, calculate the root node Y offset based on the size of the calculated tree container
      // The Y offset is always the offset of the root node in the DEPTH (vertical) direction
      // The Y offset is only necessary when the tree is rotated 180 or 270 degrees (How do you write a function that is 1 for 180/270, but 0 for 0/90?)
      var ROOT_Y_OFFSET = (settings.G_EL_TREE_PADDING / 2);    // By default Y offset should be half the tree padding
      if (SIN_R === -1 || COS_R === -1) {
        ROOT_Y_OFFSET = -1 * (settings.MAX_Y - settings.MIN_Y + (settings.G_EL_TREE_PADDING / 2));
      }

      console.log('Root X Offset: ' + Math.round(ROOT_X_OFFSET) + ' | Root Y Offset: ' + Math.round(ROOT_Y_OFFSET));

      return { 'ROOT_X_OFFSET': ROOT_X_OFFSET, 'ROOT_Y_OFFSET': ROOT_Y_OFFSET };
    },

    // Calculate the 
    calculateHeightAndWidth: function(settings, treeNodes) {
      var SIN_R = settings.SIN_R;
      var COS_R = settings.COS_R;

      // Not currently used for any specific purpose
      // Calculate the maximum depth and span of the Tree (requires the d3 extracted treeNodes to do so)
      var MAX_DEPTH   = d3.max(treeNodes, function (x) { return x.depth; }) + 1;
      var MAX_SPAN    = _.max(_.countBy(treeNodes, function (x) { return x.depth; }));
      console.log('Max Depth: ' + MAX_DEPTH + ' | Max Span: ' + MAX_SPAN);

      // Calculate the container element width and height, based on depth/span spacing, orientation, and node size
      var TREE_CONTAINER_HEIGHT = Math.abs(SIN_R) * (settings.MAX_X - settings.MIN_X + settings.NODE_HEIGHT) +
                                          Math.abs(COS_R) * (settings.MAX_Y - settings.MIN_Y + settings.NODE_HEIGHT);
      var TREE_CONTAINER_WIDTH =  Math.abs(SIN_R) * (settings.MAX_Y - settings.MIN_Y + settings.NODE_WIDTH) +
                                          Math.abs(COS_R) * (settings.MAX_X - settings.MIN_X + settings.NODE_WIDTH);
      console.log('Container Width: ' + Math.round(settings.TREE_CONTAINER_WIDTH) + ' | Container Height: ' + Math.round(settings.TREE_CONTAINER_HEIGHT));
      
      return {
        TREE_CONTAINER_HEIGHT: TREE_CONTAINER_HEIGHT,
        TREE_CONTAINER_WIDTH: TREE_CONTAINER_WIDTH
      };
    },
    /*********************************************************************************/

    /**************************** d3 Tree Layout Builder *****************************/
    // Build the layout of the tree, based on the structure of the JSON
    d3TreeLayoutBuilder: function(settings) {
      var d3Tree = d3.layout.tree()
        .size(null)
        .nodeSize([settings.NODE_WIDTH, settings.NODE_HEIGHT])  // Set this width and height of a rectangular node
        .separation(function separation(a, b) {         // Set the spacing between 2 nodes in the tree - d3 default is 1 : 2
          return a.parent === b.parent ? settings.NODE_SPAN_SPACING_PCT : settings.NODE_SPAN_SPACING_PCT;
        })
        .children(function (d) {                        // Custom define the children element names
          return (!d[settings.CHILD_NODE_NAME] || d[settings.CHILD_NODE_NAME].length === 0) ? null : d[settings.CHILD_NODE_NAME];
        });

      // Extract d3ParsedNodes and d3ParsedLinks from the root node via the specifications of the Tree Layout (d3.layout.tree())
      var d3ParsedNodes = d3Tree.nodes(settings.DATA_ROOT_NODE).reverse();
      var d3ParsedLinks = d3Tree.links(d3ParsedNodes);

      // Modify each node to add the desired spacing between depth levels of the tree
      d3ParsedNodes.forEach(function (d) {
        // Find the depth of 1 node, whether it be width for vertical trees or height for horizontal trees
        // Depth is always a positive value, since it's applied before the node transformation, so take the abs value of sin and cosine
        var nodeDepthSize = Math.abs(settings.SIN_R) * settings.NODE_WIDTH +
                            Math.abs(settings.COS_R) * settings.NODE_HEIGHT;

        // Find the total depth of this particular node by multiplying its depth level by the sum of its depth size + depth spacing
        d.y = d.depth * (nodeDepthSize + settings.NODE_DEPTH_SPACING);
      });

      return {'tree': d3Tree, 'nodes': d3ParsedNodes, 'links': d3ParsedLinks};
    },
    /*********************************************************************************/

    /*************************** SVG Helper Functions ********************************/
    // Use supplied HTML template to create content when SVG's foreignObject is supported
    svgForeignObjTemplate: function(settings, nodes) {
      // Background rectangle for each node. Can be styled with the class .node-background
      nodes.append('rect')
        .attr('width', settings.NODE_WIDTH)
        .attr('height', settings.NODE_HEIGHT)
        .attr('class', function(d, i) { return settings.NODE_BKND_CSS_CLASSES.join(' '); });

      // The foreignObject which allows the user to inject HTML templates into the tree node
      // Appends the requiredFeatures property as a further guard to make sure d3 is supported
      // Then appends the XHTML object and the HTML template onto that
      nodes.append('foreignObject')
        .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
        .attr('width', settings.NODE_WIDTH)
        .attr('height', settings.NODE_HEIGHT)
        .append('xhtml:div')
        .attr('class', function(d, i) { return settings.NODE_CSS_CLASSES.join(' '); })
        .html(function(d) {
          return settings.HTML_TEMPLATE(d);
        });
    },

    // Wrap the text data line to line in each node when SVG's foreignObject is not supported
    svgForeignObjNotSupportedTemplate: function(settings, nodes) {
      // If foreignObjects are not supported, add a node with a default not-supported message
      nodes.append('rect')
        .attr('width', settings.NODE_WIDTH)
        .attr('height', settings.NODE_HEIGHT - 1);

      // Append a simple not-supported message in the middle of the box
      nodes.append('g')
        .attr('class', 'd3-not-supported-template')
        .attr('transform', 'translate(' + 0 + ',' + (settings.G_EL_TREE_PADDING * 3) + ')')
        .append('text')
        .attr('dy', '.72em') // .72em === 11px --- Transformations below are in em's 
        .attr('dx', settings.NODE_WIDTH / 2)
        .text(settings.D3_NOT_SUPPORTED_MSG)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px');

      //If the text is too long for the width of the element, wrap the text using the custom text wrapping function below
      var textNodes = nodes.selectAll('.d3-not-supported-template text');
      textNodes.call(helpers.wrap, (settings.NODE_WIDTH - (settings.G_EL_TREE_PADDING * 2)));

      console.log('textNodes: ');
      console.log(textNodes);
    },

    // Define the markers at the end of each link pointing at the next node as an arrow
    svgDefineFixedMarkerArrows: function(settings, svg) {
      // Define the markers to be added at the end of the treeLinks
      svg.append('defs')
        .append('marker')
          .attr('id', 'end-arrow')
          .attr('class', function(d, i) { return settings.ARROW_CSS_CLASSES.join(' '); })
          //.attr('viewBox', '-5 -5 10 10') //Shrinks the size of the arrow via a transformation of the viewBox
          .attr('refY', 2)
          .attr('refX', 5)
          .attr('markerWidth', 6)
          .attr('markerHeight', 20)
          .attr('orient', 'auto')
        .append('path')
          .attr('d', 'M0,0 L4,2 0,4');  //SVG definition of the arrow shaped link marker
    },
    /**********************************************************************************/

    /********************************* d3 Link Strategies *****************************/
    // Elbow = Links that are at right angles and kink at a specified pct of distance btwn nodes
    elbowLinkStrategy: function(settings) {
      // If you want to switch to a standard elbow connector, use this instead of the diagonal
      return function elbow(d, i) {
        //elbow link source base offset
        var xSourceBaseCoord = Math.abs(settings.SIN_R) *  (settings.SIN_R * (settings.NODE_HEIGHT / 2)) +
                                Math.abs(settings.COS_R) *  (settings.COS_R * (settings.NODE_WIDTH / 2));
        var ySourceBaseCoord = Math.abs(settings.SIN_R) * ((settings.SIN_R * (settings.NODE_WIDTH / 2))  + (settings.NODE_WIDTH / 2)) +
                                Math.abs(settings.COS_R) * ((settings.COS_R * (settings.NODE_HEIGHT / 2)) + (settings.NODE_HEIGHT / 2));

        //elbow link target base offset
        var xTargetBaseCoord = Math.abs(settings.SIN_R) *  (settings.SIN_R * (settings.NODE_HEIGHT / 2)) +
                                Math.abs(settings.COS_R) *  (settings.COS_R * (settings.NODE_WIDTH / 2));
        var yTargetBaseCoord = Math.abs(settings.SIN_R) * ((settings.SIN_R * (settings.NODE_WIDTH / 2))  + -1 * (settings.NODE_WIDTH / 2)) +
                                Math.abs(settings.COS_R) * ((settings.COS_R * (settings.NODE_HEIGHT / 2)) + -1 * (settings.NODE_HEIGHT / 2));

        //elbow link source calculated offset
        var xSourceCalcCoord = settings.SIN_R * (d.source.x + xSourceBaseCoord + settings.ROOT_X_OFFSET) +
                                settings.COS_R * (d.source.y + ySourceBaseCoord + settings.ROOT_Y_OFFSET);
        var ySourceCalcCoord = settings.SIN_R * (d.source.y + ySourceBaseCoord + settings.ROOT_Y_OFFSET) +
                                settings.COS_R * (d.source.x + xSourceBaseCoord + settings.ROOT_X_OFFSET);

        //elbow link target calculcated offset
        var xTargetCalcCoord = settings.SIN_R * (d.target.x + xTargetBaseCoord + settings.ROOT_X_OFFSET) +
                                settings.COS_R * (d.target.y + yTargetBaseCoord + settings.ROOT_Y_OFFSET);
        var yTargetCalcCoord = settings.SIN_R * (d.target.y + yTargetBaseCoord + settings.ROOT_Y_OFFSET) +
                                settings.COS_R * (d.target.x + xTargetBaseCoord + settings.ROOT_X_OFFSET);

        var hy = (yTargetCalcCoord - ySourceCalcCoord) / 4;
        var hx = (xTargetCalcCoord - xSourceCalcCoord) / 4;

        //Custom link drawing logic so link arrows are always pointing to the right
        if (settings.SIN_R < 0) {
          return 'M' + (yTargetCalcCoord) + ',' + (xTargetCalcCoord) +
                  'H' + (yTargetCalcCoord - hy) +
                  'V' + (xSourceCalcCoord) + 'H' + (ySourceCalcCoord);
        } else if (settings.SIN_R > 0) {
          return 'M' + (ySourceCalcCoord) + ',' + (xSourceCalcCoord) +
                  'H' + (ySourceCalcCoord + hy) +
                  'V' + (xTargetCalcCoord) + 'H' + (yTargetCalcCoord);
        } else {
          return 'M' + (ySourceCalcCoord) + ',' + (xSourceCalcCoord) +
                  'V' + (xSourceCalcCoord + hx) +
                  'H' + (yTargetCalcCoord) + 'V' + (xTargetCalcCoord);
        }
      };
    },

    // Diagonal = Links that have curvature and arc from one node to another
    diagonalLinkStrategy: function(settings) {
      return d3.svg.diagonal()
        // PROJECTION: Used to map X and Y into a rotated plane by a specified multiple of 90 degrees
        //              To map from a vertical to horizontal orientation, map (x,y) -> (y,x)
        .projection(function (d) {
          var xOriented =    settings.SIN_R * (d.y + settings.ROOT_Y_OFFSET) +
                              settings.COS_R * (d.x + settings.ROOT_X_OFFSET);
          var yOriented =    settings.SIN_R * (d.x + settings.ROOT_X_OFFSET) +
                              settings.COS_R * (d.y + settings.ROOT_Y_OFFSET);
          return [xOriented, yOriented];
        })
        // A positive value for xAnchor offsets in the direction of increasing depth
        // A positive value for yAnchor offsets to the right when depth is viewed as increasing downward
        // Link Source, Link Target, Unmutated Location - Top Left of Node
        .source(function (d) {
          // Link Source, 0 Degrees   - Bottom Middle of Node
          // Link Source, 90 Degrees  - Right Middle of Node
          // Link Source, 180 Degrees - Top Middle of Node
          // Link Source, 270 Degrees - Left Middle of Node
          var xAnchor =  Math.abs(settings.SIN_R) * (settings.SIN_R * (settings.NODE_HEIGHT / 2)) +
                          Math.abs(settings.COS_R) * (settings.COS_R * (settings.NODE_WIDTH  / 2));
          var yAnchor =  Math.abs(settings.SIN_R) * ((settings.NODE_WIDTH  / 2) + (settings.SIN_R * (settings.NODE_WIDTH  / 2))) +
                          Math.abs(settings.COS_R) * ((settings.NODE_HEIGHT / 2) + (settings.COS_R * (settings.NODE_HEIGHT / 2)));
          return { x: (d.source.x + xAnchor), y: (d.source.y + yAnchor) };
        })
        .target(function (d) {
          // Link Target, 0 Degrees   - Top Middle of Node
          // Link Target, 90 Degrees  - Left Middle of Node
          // Link Target, 180 Degrees - Bottom Middle of Node
          // Link Target, 270 Degrees - Right Middle of Node
          var xAnchor =  Math.abs(settings.SIN_R) * (settings.SIN_R * (settings.NODE_HEIGHT / 2)) +
                          Math.abs(settings.COS_R) * (settings.COS_R * (settings.NODE_WIDTH  / 2));
          var yAnchor =  Math.abs(settings.SIN_R) * (-1 * (settings.NODE_WIDTH  / 2) + (settings.SIN_R * (settings.NODE_WIDTH  / 2))) +
                          Math.abs(settings.COS_R) * (-1 * (settings.NODE_HEIGHT / 2) + (settings.COS_R * (settings.NODE_HEIGHT / 2)));
          return { x: (d.target.x + xAnchor), y: (d.target.y + yAnchor) };
        });
    },
    /***********************************************************************************/

    /********************************* SVG Builders ************************************/
    // Build the container SVG element that the node and link SVG elements will be appended within 
    svgContainerElBuilder: function(settings) {
      // Define the spatial container that the tree will be laid out in
      var svgContainer = d3.select(settings.TREE_CONTAINER_ID)
        .append('svg')
          // The SVG element is consistently 4 pixels larger on all sides than the G element
          // Add on 4 extra pixels in either direction for padding...could be due to borders?
          .attr('width', settings.TREE_CONTAINER_WIDTH + settings.G_EL_TREE_PADDING)
          .attr('height', settings.TREE_CONTAINER_HEIGHT + settings.G_EL_TREE_PADDING)
        .append('g')
          .attr('id', 'tree-container');

      return svgContainer;
    },

    // Build the SVG node elements of the tree from the layout and current SVG object
    svgNodeBuilder: function(settings, svg, nodes) {
      var SIN_R = settings.SIN_R;
      var COS_R = settings.COS_R;

      // Give each node a fixed-spacing between levels
      nodes.forEach(function (d) {
        //Depth is always a positive value, since it's applied before the node transformation, so take the abs value of sin and cos
        var nodeDepth = Math.abs(SIN_R) * settings.NODE_WIDTH +
                          Math.abs(COS_R) * settings.NODE_HEIGHT;
        d.y = d.depth * (nodeDepth + settings.NODE_DEPTH_SPACING);
      });

      var nodeData = svg.selectAll('g.node')
        .data(nodes, function (d, i) {
          return d.id || (d.id = ++i);
        });

      var svgInitializedNodes = nodeData.enter()
      .append('g')
      .attr('class', 'node')
      // Append the root-node attribute to the root of the tree
      .each(function (d) {
        var mynode = d3.select(this);
        if (d.depth === 0) {
          mynode.classed('root-node', true);
        }
      })
      // Gives the treeNodes the initial offset to start at on initialization (location of root node)
      .attr('transform', function (d) {
        var xOriented = SIN_R * (d.y + settings.ROOT_Y_OFFSET) +
                         COS_R * (d.x + settings.ROOT_X_OFFSET);
        var yOriented = SIN_R * (d.x + settings.ROOT_X_OFFSET) +
                         COS_R * (d.y + settings.ROOT_Y_OFFSET);

        return 'translate(' + xOriented + ',' + yOriented + ')';
      });

      return svgInitializedNodes;
    },
    // Build the SVG link elements of the tree from the layout and current SVG object
    svgLinkBuilder: function(settings, svg, links) {
      // This block specifically selects all the treeLinks and adds an ID to each of them
      var svgInitializedLinks = svg.selectAll('path.link')
        .data(links, function (d) {
          return d.target.id;
        });

      svgInitializedLinks.enter().insert('path', 'g')
        .attr('class', function(d, i) { return settings.LINK_CSS_CLASSES.join(' '); })
        .attr('marker-end', 'url(#end-arrow)')
        .attr('stroke-width', 1)
        .attr('d', settings.LINK_FUNCTION);

      return svgInitializedLinks;
    },
    /************************************************************************************/

    //Text wrapping backwards-compatibility function found at: http://bl.ocks.org/mbostock/7555321
    //Enables wrapping of a d3-not-supported message within the node bounds 
    wrap: function(text, width) {
      console.log('Hit wrap function!! Value of text: ' + text + ' | Value of width: ' + width);
      text.each(function () {
        console.log('Hit the foreach loop!! Value of text: ' + text + ' | Value of element: ' + this);
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          dx = parseFloat(text.attr('dx')),
          tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em').attr('dx', dx + 'px');
          tspan.style('font-weight', 'bold');

        console.log('text');
        console.log(text);
        console.log('words');
        console.log(words);

        while (word = words.pop()) {
          if (word !== '|') {
            line.push(word);                                            // If the current word is not a pipe, denoting a new line, add it to the array of words
            tspan.text(line.join(' '));                                 // Update the current tspan with the current full text string to test the width
            if (tspan.node().getComputedTextLength() > width) {         // The length of the current span is wider than the alloted width. start a new line
              line.pop();                                             // Pop off the element that just put the span over the width limit
              tspan.text(line.join(' '));                             // Join the rest of the array together into a single string that will fit in the 
              line = [word];                                          // Reset the word array, initializing it with the value that put it over the width limit

              tspan = text.append('tspan')                            // Start a new line of text with the word that put the previous line over the length limit
                          .attr('x', 0).attr('y', y)                  // y value increments each line, so just need dy to keep pushing the line down from each previous line's y location
                          .attr('dy', lineHeight + dy + 'em').attr('dx', dx + 'px')
                          .text(word);
            }
          } else {
            // If the current word is a pipe, join the array into a string and append the element to the current text

            tspan.text(line.join(' '));
            line = [];

            // Keep a bold font if the line number is still 0 (i.e. the entity of each cell)
            if (lineNumber === 0) {
              tspan.style('font-weight', 'bold');
            }
            tspan = text.append('tspan')
                        .attr('x', 0).attr('y', y)
                        .attr('dy', lineHeight + dy + 'em').attr('dx', dx + 'px');

            // Increment the line number because we just hit a pipe, denoting a new line
            // lineNumber does not incremement for continuations of lines that are too long, preserving the bold weight
            lineNumber++;
          }
        }
      });
    }
  };

}(jQuery, _, d3 ));