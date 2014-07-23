(function( $ ) {

  $.fn.drawTree = function(userOptions) {
    var self = this;

    var defaultOptions = {
      treeContainerId: '#tree-container',
      orientation: 90,
      nodeSizing: {
        width: 300,
        height: 100
      },
      nodeSpacing: {
        level: 25,
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
            dataValue: '5',
            node: {
              dataValue: '8'
            }
          }, {
            dataValue: '6'
          }, {
            dataValue: '7'
          }]
        }]
      },
      nodeClasses: ['node-html-container'],
      linkClasses: ['link-html-container'],
      arrowClasses: ['arrow-html-container'],
      notSupportedMessage: 'Sorry, d3 html templates are not supported by your browser.'
    };

    // We can use the extend method to merge options/settings as usual:
    // But with the added first parameter of TRUE to signify a DEEP COPY:
    var mergedOptions = $.extend( {}, defaultOptions, userOptions );
    _drawTree(mergedOptions);

    return self;
  };


  /**************** Generic Tree Drawing Function ******************/
  var _drawTree = function (options) {

    /******************* Tree Layout Constants *******************/
    var DATA_ROOT_NODE            = options.node;                     // The Javascript object representing the root node of the tree
    var TREE_CONTAINER_ID         = options.treeContainerId;          // ID of the element the tree will be appended to
    var CHILD_NODE_NAME           = options.childNodeName;            // Property name of the node container JSON property
    var NODE_WIDTH                = options.nodeSizing.width;         // Width of each node
    var NODE_HEIGHT               = options.nodeSizing.height;        // Height of each node
    var NODE_DEPTH_SPACING        = options.nodeSpacing.level;        // Depth-wise spacing in pixels between each level of the tree
    var NODE_SPAN_SPACING         = options.nodeSpacing.span;         // Span-wise spacing in pixels between each sibling/cousin of the tree
    var G_EL_TREE_PADDING         = 8;                                // Needs at least a slight padding offset, likely because of node borders
    var HTML_TEMPLATE             = options.nodeHTMLTemplate;         // Function that returns the compiled HTML template string appended to each node's foreignObject element
    var NODE_CSS_CLASSES          = options.nodeClasses;              // Any classes to be added onto the root HTML template of each node
    var LINK_CSS_CLASSES          = options.linkClasses;              // Any classes to be added onto the links between each pair of nodes
    var ARROW_CSS_CLASSES         = options.arrowClasses;             // Any classes to be added onto the link arrows at the end of each link
    var D3_NOT_SUPPORTED_MESSAGE  = options.notSupportedMessage;      // Message to be displayed when d3 is not supported by the user's browser

    /******************* Tree Layout Calcualted Fields *******************/
    // Calculates the rotation angle in radians for the tree, with an angle of 0 having a downward direction
    var ROTATION                  = options.orientation * (Math.PI / 180);

    // Calculates the sin and cos of the rotation angle for various projection calculations throughout the function
    var SIN_R                     = Math.round(Math.sin(ROTATION));
    var COS_R                     = Math.round(Math.cos(ROTATION));

    // The H/W ratio via H_W_RATIO scales so that it always results in d3ParsedNodes being adjacent when horizontal spacing is 0.
    var H_W_RATIO = (NODE_HEIGHT / NODE_WIDTH);

    // Helper field that calcualtes the actual number of pixels that need to be between the 
    var BASE_ZERO_SPAN_SPACING = H_W_RATIO * Math.abs(SIN_R) + (1) * Math.abs(COS_R);

    // A decimal percent specifying the spacing between sibling and cousin elements - Used with the separation function on the layout
    // Use NODE_WIDTH if tree is vertical, NODE_HEIGHT if tree is horizontal
    var NODE_SPAN_SPACING_PCT = (1 / NODE_WIDTH) * ( (NODE_HEIGHT * Math.abs(SIN_R)) + (NODE_WIDTH * Math.abs(COS_R)) + NODE_SPAN_SPACING );
    console.log(NODE_SPAN_SPACING_PCT);
    /********************* End Of Tree Layout Constants Initialization *******************/
    // Create all the basic options here for passing through to helper functions. 
    // This object will be enriched throughout the tree-drawing process,
    //    as more parameters are calculated and initialized.
    var factoryOptions = {
      'NODE_WIDTH': NODE_WIDTH,
      'NODE_HEIGHT': NODE_HEIGHT,
      'ROTATION': ROTATION,
      'SIN_R': SIN_R,
      'COS_R': COS_R,
      'NODE_SPAN_SPACING_PCT': NODE_SPAN_SPACING_PCT,
      'CHILD_NODE_NAME': CHILD_NODE_NAME,
      'NODE_DEPTH_SPACING': NODE_DEPTH_SPACING,
      'DATA_ROOT_NODE': DATA_ROOT_NODE,
    };

    /****************** Tree Layout Initialization *********************/

    // Generate the basic tree layout, given its logical structure
    var newTree = _treeLayoutFactory(factoryOptions);
    var treeLayout = newTree.layout;
    var treeNodes = newTree.nodes;
    var treeLinks = newTree.links;

    // Calculate the min and max values of the tree layout, giving you a bounding box with which a tree container element can be created
    var MIN_X_COORDS = _.min(treeNodes, function (node) { return node.x; });
    var MAX_X_COORDS = _.max(treeNodes, function (node) { return node.x; });
    var MIN_Y_COORDS = _.min(treeNodes, function (node) { return node.y; });
    var MAX_Y_COORDS = _.max(treeNodes, function (node) { return node.y; });
    console.log('Min X: ' + Math.round(MIN_X_COORDS.x) + ' | Max X: ' + Math.round(MAX_X_COORDS.x));
    console.log('Min Y: ' + Math.round(MIN_Y_COORDS.y) + ' | Max Y: ' + Math.round(MAX_Y_COORDS.y));


    // Not currently used for any specific purpose
    // Calculate the maximum depth and span of the Tree (requires the d3 extracted treeNodes to do so)
    var MAX_DEPTH   = d3.max(treeNodes, function (x) { return x.depth; }) + 1;
    var MAX_SPAN    = _.max(_.countBy(treeNodes, function (x) { return x.depth; }));
    console.log('Max Depth: ' + MAX_DEPTH + ' | Max Span: ' + MAX_SPAN);

    // Calculate the container element width and height, based on depth/span spacing, orientation, and node size
    var TREE_CONTAINER_HEIGHT = Math.abs(SIN_R) * (MAX_X_COORDS.x - MIN_X_COORDS.x + NODE_HEIGHT)
                              + Math.abs(COS_R) * (MAX_Y_COORDS.y - MIN_Y_COORDS.y + NODE_HEIGHT);
    var TREE_CONTAINER_WIDTH =  Math.abs(SIN_R) * (MAX_Y_COORDS.y - MIN_Y_COORDS.y + NODE_WIDTH)
                              + Math.abs(COS_R) * (MAX_X_COORDS.x - MIN_X_COORDS.x + NODE_WIDTH);
    console.log('Container Width: ' + Math.round(TREE_CONTAINER_WIDTH) + ' | Container Height: ' + Math.round(TREE_CONTAINER_HEIGHT));

    // Calculate the offset of the root node of the tree, based on the overall dimensions and spacing of the tree nodes
    factoryOptions['G_EL_TREE_PADDING'] = G_EL_TREE_PADDING;
    factoryOptions['MIN_X_COORDS'] = MIN_X_COORDS;
    factoryOptions['MAX_X_COORDS'] = MAX_X_COORDS;
    factoryOptions['MIN_Y_COORDS'] = MIN_Y_COORDS;
    factoryOptions['MAX_Y_COORDS'] = MAX_Y_COORDS;
    var offsets = _calculateTreeRootNodeOffset(factoryOptions);
    var ROOT_X_OFFSET = offsets.ROOT_X_OFFSET;
    var ROOT_Y_OFFSET = offsets.ROOT_Y_OFFSET;

    // Generate the two different link types we can use for between nodes
    factoryOptions['ROOT_X_OFFSET'] = ROOT_X_OFFSET;
    factoryOptions['ROOT_Y_OFFSET'] = ROOT_Y_OFFSET;
    var diagonal = _svgDiagonalFactory(factoryOptions);
    var elbow = _svgElbowFactory(factoryOptions);

    // Generate the SVG element that will serve as a container for the SVG representation of the tree
    factoryOptions['TREE_CONTAINER_ID'] = TREE_CONTAINER_ID;
    factoryOptions['TREE_CONTAINER_WIDTH'] = TREE_CONTAINER_WIDTH;
    factoryOptions['TREE_CONTAINER_HEIGHT'] = TREE_CONTAINER_HEIGHT;
    var svg = _svgTreeContainerFactory(factoryOptions);
    
    // Initialize the SVG nodes - defines their depth, gives each node an ID, and applies any necessary transformations
    var svgInitializedNodes = _svgNodeFactory(svg, treeNodes, factoryOptions);

    // Check to make sure the browser supports the ForeignObject feature of SVG
    var foreignObjectSupported = document.implementation.hasFeature('w3.org/TR/SVG11/feature#Extensibility', '1.1');

    // If the foreignObject feature is supported, append the HTML Template. Otherwise, append a not-supported message
    factoryOptions['HTML_TEMPLATE'] = HTML_TEMPLATE;
    factoryOptions['NODE_CSS_CLASSES'] = NODE_CSS_CLASSES;
    factoryOptions['D3_NOT_SUPPORTED_MESSAGE'] = D3_NOT_SUPPORTED_MESSAGE;
    if (foreignObjectSupported) {
      _svgAppendHTMLTemplate(svgInitializedNodes, factoryOptions);
    } else {
      _svgAppendForeignObjectNotSupported(svgInitializedNodes, factoryOptions);
    }

    // Define the basic properties of the Link Markers, which will be used for a custom marker during link creation
    factoryOptions['ARROW_CSS_CLASSES'] = ARROW_CSS_CLASSES;
    _svgDefineLinkMarkers(svg, factoryOptions);
    
    // Finally, append the links to the tree
    factoryOptions['LINK_CSS_CLASSES'] = LINK_CSS_CLASSES;
    factoryOptions['ELBOW_LINK_FUNCTION'] = elbow;
    var svgInitializedLinks = _svgLinkFactory(svg, treeLinks, factoryOptions);
  };

  /**************************** HELPER FUNCTIONS ***********************************/

  function _svgAppendForeignObjectNotFound (nodes, options) {
    // If foreignObjects are not supported, add a node with a default not-supported message
    nodes.append('rect')
      .attr('width', options.NODE_WIDTH)
      .attr('height', options.NODE_HEIGHT - 1);

    // Append a simple not-supported message in the middle of the box
    nodes.append('g')
      .attr('class', 'd3-not-supported-template')
      .attr('transform', 'translate(' + 0 + ',' + (options.G_EL_TREE_PADDING * 3) + ')')
      .append('text')
      .attr('dy', '.72em') // .72em === 11px --- Transformations below are in em's 
      .attr('dx', options.NODE_WIDTH / 2)
      .text(options.D3_NOT_SUPPORTED_MESSAGE)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px');

    //If the text is too long for the width of the element, wrap the text using the custom text wrapping function below
    var textNodes = nodes.selectAll('.d3-not-supported-template text');
    textNodes.call(wrap, (options.NODE_WIDTH - (options.G_EL_TREE_PADDING * 2)));

    console.log('textNodes: ');
    console.log(textNodes);
  }

  function _svgAppendHTMLTemplate (nodes, options) {
    // Background rectangle for each node. Can be styled with the class .node-background
    nodes.append('rect')
      .attr('width', options.NODE_WIDTH)
      .attr('height', options.NODE_HEIGHT)
      .attr('class', 'node-background');

    // The foreignObject which allows the user to inject HTML templates into the tree node
    // Appends the requiredFeatures property as a further guard to make sure d3 is supported
    // Then appends the XHTML object and the HTML template onto that
    nodes.append('foreignObject')
      .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
      .attr('width', options.NODE_WIDTH)
      .attr('height', options.NODE_HEIGHT)
      .append('xhtml:div')
      .attr('class', function(d, i) { return options.NODE_CSS_CLASSES.join(' '); })
      .html(function(d) {
        return options.HTML_TEMPLATE(d);
      });
  }

  function _svgDefineLinkMarkers (svg, options) {
    // Define the markers to be added at the end of the treeLinks
    svg.append('defs')
      .append('marker')
        .attr('id', 'end-arrow')
        .attr('class', function(d, i) { return options.ARROW_CSS_CLASSES.join(' '); })
        //.attr('viewBox', '-5 -5 10 10') //Shrinks the size of the arrow via a transformation of the viewBox
        .attr('refY', 2)
        .attr('refX', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 20)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M0,0 L4,2 0,4');  //SVG definition of the arrow shaped link marker
  }

  function _svgElbowFactory (options) {
    // If you want to switch to a standard elbow connector, use this instead of the diagonal
    return function elbow(d, i) {
      //elbow link source base offset
      var x_source_base = Math.abs(options.SIN_R) *  (options.SIN_R * (options.NODE_HEIGHT / 2)) +
                          Math.abs(options.COS_R) *  (options.COS_R * (options.NODE_WIDTH / 2));
      var y_source_base = Math.abs(options.SIN_R) * ((options.SIN_R * (options.NODE_WIDTH / 2))  + (options.NODE_WIDTH / 2)) +
                          Math.abs(options.COS_R) * ((options.COS_R * (options.NODE_HEIGHT / 2)) + (options.NODE_HEIGHT / 2));

      //elbow link target base offset
      var x_target_base = Math.abs(options.SIN_R) *  (options.SIN_R * (options.NODE_HEIGHT / 2)) +
                          Math.abs(options.COS_R) *  (options.COS_R * (options.NODE_WIDTH / 2));
      var y_target_base = Math.abs(options.SIN_R) * ((options.SIN_R * (options.NODE_WIDTH / 2))  + -1 * (options.NODE_WIDTH / 2)) +
                          Math.abs(options.COS_R) * ((options.COS_R * (options.NODE_HEIGHT / 2)) + -1 * (options.NODE_HEIGHT / 2));

      //elbow link source calculated offset
      var x_source_calc = options.SIN_R * (d.source.x + x_source_base + options.ROOT_X_OFFSET) +
                          options.COS_R * (d.source.y + y_source_base + options.ROOT_Y_OFFSET);
      var y_source_calc = options.SIN_R * (d.source.y + y_source_base + options.ROOT_Y_OFFSET) + 
                          options.COS_R * (d.source.x + x_source_base + options.ROOT_X_OFFSET);

      //elbow link target calculcated offset
      var x_target_calc = options.SIN_R * (d.target.x + x_target_base + options.ROOT_X_OFFSET) +
                          options.COS_R * (d.target.y + y_target_base + options.ROOT_Y_OFFSET);
      var y_target_calc = options.SIN_R * (d.target.y + y_target_base + options.ROOT_Y_OFFSET) +
                          options.COS_R * (d.target.x + x_target_base + options.ROOT_X_OFFSET);

      var hy = (y_target_calc - y_source_calc) / 4;
      var hx = (x_target_calc - x_source_calc) / 4;

      if (options.SIN_R < 0) {
        return 'M' + (y_target_calc) + ',' + (x_target_calc)    //Custom link drawer to always have link arrows pointing to the right
            + 'H' + (y_target_calc - hy)
            + 'V' + (x_source_calc) + 'H' + (y_source_calc);
      } if (options.SIN_R > 0) {
        return 'M' + (y_source_calc) + ',' + (x_source_calc)
            + 'H' + (y_source_calc + hy)
            + 'V' + (x_target_calc) + 'H' + (y_target_calc);
      } else {
        return 'M' + (y_source_calc) + ',' + (x_source_calc)
            + 'V' + (x_source_calc + hx)
            + 'H' + (y_target_calc) + 'V' + (x_target_calc);
      }
    };
  };

  // Diagonal = SVG line type with curvature - currently unused but can incorporate into an option
  function _svgDiagonalFactory (options) {
    return d3.svg.diagonal()
      // PROJECTION: Used to map X and Y into a rotated plane by a specified multiple of 90 degrees
      //              To map from a vertical to horizontal orientation, map (x,y) -> (y,x)
      .projection(function (d) {
        var x_oriented =    options.SIN_R * (d.y + options.ROOT_Y_OFFSET) +
                            options.COS_R * (d.x + options.ROOT_X_OFFSET);
        var y_oriented =    options.SIN_R * (d.x + options.ROOT_X_OFFSET) +
                            options.COS_R * (d.y + options.ROOT_Y_OFFSET);
        return [x_oriented, y_oriented];
      })
      // A positive value for x_anchor offsets in the direction of increasing depth
      // A positive value for y_anchor offsets to the right when depth is viewed as increasing downward
      // Link Source, Link Target, Unmutated Location - Top Left of Node
      .source(function (d) {
        // Link Source, 0 Degrees   - Bottom Middle of Node
        // Link Source, 90 Degrees  - Right Middle of Node
        // Link Source, 180 Degrees - Top Middle of Node
        // Link Source, 270 Degrees - Left Middle of Node
        var x_anchor =  Math.abs(options.SIN_R) * (options.SIN_R * (options.NODE_HEIGHT / 2)) + 
                        Math.abs(options.COS_R) * (options.COS_R * (options.NODE_WIDTH  / 2));
        var y_anchor =  Math.abs(options.SIN_R) * ((options.NODE_WIDTH  / 2) + (options.SIN_R * (options.NODE_WIDTH  / 2))) +
                        Math.abs(options.COS_R) * ((options.NODE_HEIGHT / 2) + (options.COS_R * (options.NODE_HEIGHT / 2)));
        return { x: (d.source.x + x_anchor), y: (d.source.y + y_anchor) };
      })
      .target(function (d) {
        // Link Target, 0 Degrees   - Top Middle of Node
        // Link Target, 90 Degrees  - Left Middle of Node
        // Link Target, 180 Degrees - Bottom Middle of Node
        // Link Target, 270 Degrees - Right Middle of Node
        var x_anchor =  Math.abs(options.SIN_R) * (options.SIN_R * (options.NODE_HEIGHT / 2)) + 
                        Math.abs(options.COS_R) * (options.COS_R * (options.NODE_WIDTH  / 2));
        var y_anchor =  Math.abs(options.SIN_R) * (-1 * (options.NODE_WIDTH  / 2) + (options.SIN_R * (options.NODE_WIDTH  / 2))) +
                        Math.abs(options.COS_R) * (-1 * (options.NODE_HEIGHT / 2) + (options.COS_R * (options.NODE_HEIGHT / 2)));
        return { x: (d.target.x + x_anchor), y: (d.target.y + y_anchor) };
      });
  }

  function _svgNodeFactory(svg, nodes, options) {
    var SIN_R = options.SIN_R;
    var COS_R = options.COS_R;

    // Give each node a fixed-spacing between levels
    nodes.forEach(function (d) {
        //Depth is always a positive value, since it's applied before the node transformation, so take the abs value of sin and cos
        var node_depth = Math.abs(SIN_R) * options.NODE_WIDTH
                       + Math.abs(COS_R) * options.NODE_HEIGHT;
        d.y = d.depth * (node_depth + options.NODE_DEPTH_SPACING);
    });

    var nodeData = svg.selectAll("g.node")
        .data(nodes, function (d, i) {
            return d.id || (d.id = ++i);
        });

    var svgInitializedNodes = nodeData.enter()
    .append('g')
    .attr('class', 'node')
    // Append the root-node attribute to the root of the tree
    .each(function (d) {
      var mynode = d3.select(this);
      if (d.depth == 0) {
          mynode.classed('root-node', true);
      }
    })
    // Gives the treeNodes the initial offset to start at on initialization (location of root node)
    .attr('transform', function (d) {
      var x_oriented = SIN_R * (d.y + options.ROOT_Y_OFFSET) +
                       COS_R * (d.x + options.ROOT_X_OFFSET);
      var y_oriented = SIN_R * (d.x + options.ROOT_X_OFFSET) +
                       COS_R * (d.y + options.ROOT_Y_OFFSET);

      return 'translate(' + x_oriented + ',' + y_oriented + ')';
    });

    return svgInitializedNodes;
  };

  function _svgLinkFactory(svg, links, options) {
    // This block specifically selects all the treeLinks and adds an ID to each of them
    var svgInitializedLinks = svg.selectAll('path.link')
      .data(links, function (d) {
          return d.target.id;
      });

    svgInitializedLinks.enter().insert('path', 'g')
      .attr('class', function(d, i) { return options.LINK_CSS_CLASSES.join(' '); })
      .attr('marker-end', 'url(#end-arrow)')
      .attr('stroke-width', 1)
      .attr('d', options.ELBOW_LINK_FUNCTION);

    return svgInitializedLinks;
  }

  function _svgTreeContainerFactory(options) {
    // Define the spatial container that the tree will be laid out in
    var svgContainer = d3.select(options.TREE_CONTAINER_ID)
      .append('svg')
        // The SVG element is consistently 4 pixels larger on all sides than the G element
        // Add on 4 extra pixels in either direction for padding...could be due to borders?
        .attr('width', options.TREE_CONTAINER_WIDTH + options.G_EL_TREE_PADDING)
        .attr('height', options.TREE_CONTAINER_HEIGHT + options.G_EL_TREE_PADDING)
      .append('g')
        .attr('id', 'tree-container');

    return svgContainer;
  }

  function _treeLayoutFactory(options) {
    var d3Tree = d3.layout.tree()
      .size(null)
      .nodeSize([options.NODE_WIDTH, options.NODE_HEIGHT])  // Set this width and height of a rectangular node
      .separation(function separation(a, b) {         // Set the spacing between 2 nodes in the tree - d3 default is 1 : 2
        return a.parent === b.parent ? options.NODE_SPAN_SPACING_PCT : options.NODE_SPAN_SPACING_PCT;
      })
      .children(function (d) {                        // Custom define the children element names
        return (!d[options.CHILD_NODE_NAME] || d[options.CHILD_NODE_NAME].length === 0) ? null : d[options.CHILD_NODE_NAME];
      });

    // Extract d3ParsedNodes and d3ParsedLinks from the root node via the specifications of the Tree Layout (d3.layout.tree())
    var d3ParsedNodes = d3Tree.nodes(options.DATA_ROOT_NODE).reverse();
    var d3ParsedLinks = d3Tree.links(d3ParsedNodes);

    // Modify each node to add the desired spacing between depth levels of the tree
    d3ParsedNodes.forEach(function (d) {
      // Find the depth of 1 node, whether it be width for vertical trees or height for horizontal trees
      // Depth is always a positive value, since it's applied before the node transformation, so take the abs value of sin and cosine
      var node_depth_size = Math.abs(options.SIN_R) * options.NODE_WIDTH
                          + Math.abs(options.COS_R) * options.NODE_HEIGHT;

      // Find the total depth of this particular node by multiplying its depth level by the sum of its depth size + depth spacing
      d.y = d.depth * (node_depth_size + options.NODE_DEPTH_SPACING);
    });

    return {'tree': d3Tree, 'nodes': d3ParsedNodes, 'links': d3ParsedLinks};
  }

  function _calculateTreeRootNodeOffset(options) {
    var SIN_R = options.SIN_R;
    var COS_R = options.COS_R;

    // Calculate the root node X offset based on the min and max layout positionings, along with offsets based on orientation
    // The X offset is always the offset of the tree in the SPAN (horizontal) direction
    var ROOT_X_OFFSET = 0;    // By default no X offset
    if (SIN_R == 1 || COS_R == 1) {
      ROOT_X_OFFSET = SIN_R * ((-1 * options.MIN_X_COORDS.x) + (options.G_EL_TREE_PADDING / 2))
                    + COS_R * ((-1 * options.MIN_X_COORDS.x) + (options.G_EL_TREE_PADDING / 2));
    } else if (SIN_R === -1 || COS_R === -1) {
      ROOT_X_OFFSET = SIN_R * (options.MAX_X_COORDS.x + (options.G_EL_TREE_PADDING / 2))
                    + COS_R * (options.MAX_X_COORDS.x + (options.G_EL_TREE_PADDING / 2));
    }

    // If necessary, calculate the root node Y offset based on the size of the calculated tree container
    // The Y offset is always the offset of the root node in the DEPTH (vertical) direction
    // The Y offset is only necessary when the tree is rotated 180 or 270 degrees (How do you write a function that is 1 for 180/270, but 0 for 0/90?)
    var ROOT_Y_OFFSET = (options.G_EL_TREE_PADDING / 2);    // By default Y offset should be half the tree padding
    if (SIN_R == -1 || COS_R == -1)
      ROOT_Y_OFFSET = -1 * (options.MAX_Y_COORDS.y - options.MIN_Y_COORDS.y + (options.G_EL_TREE_PADDING / 2));

    console.log('Root X Offset: ' + Math.round(ROOT_X_OFFSET) + ' | Root Y Offset: ' + Math.round(ROOT_Y_OFFSET));

    return { 'ROOT_X_OFFSET': ROOT_X_OFFSET, 'ROOT_Y_OFFSET': ROOT_Y_OFFSET };
  }

  //Text wrapping backwards-compatibility function found at: http://bl.ocks.org/mbostock/7555321
  //Enables wrapping of a d3-not-supported message within the node bounds 
  function wrap(text, width) {
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

}(jQuery));