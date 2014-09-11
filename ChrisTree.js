function ChrisTree(options) {
  'use strict';
  var self = this;

  self.treePadding = 8;

  self.containerId = options.containerId;

  self.nodeDataName = options.nodeDataName;
  self.nodeChildName = options.nodeChildName;
  self.nodeHTMLTemplate = options.nodeHTMLTemplate;

  self.nodeType = options.nodeType;
  self.linkType = options.linkType;

  self.treeOrientation = options.treeOrientation;
  self.linkOrientation = options.linkOrientation;

  self.nodeWidth = options.nodeWidth;
  self.nodeHeight = options.nodeHeight;
 
  self.depthSpacing = options.depthSpacing;
  self.widthSpacing = options.widthSpacing;

  self.notSupportedMsg = options.notSupportedMsg;

  self.linkClasses = options.linkClasses;              // Any classes to be added onto the links between each pair of nodes
  self.nodeTmplClasses = options.nodeTmplClasses;          // Any classes to be added onto the root HTML template element of each node
  self.nodeBkndClasses = options.nodeBkndClasses;          // Any classes to be added onto the rect SVG element of each node
  
  // Declare calc'ed values - Unnecessary, but useful to lay them all out
  self.linkStrategy = '';
  self.linkFunction = '';
  self.treeOrientationRad = '';
  self.sinR = '';
  self.cosR = '';
  self.nodeAnchorX = '';
  self.nodeSourceAnchorY = '';
  self.nodeTargetAnchorY = '';
  self.hwRatio = '';
  self.rawSpanSpacingPxls = '';
  self.nodeSpanSpacingPct = '';
  self.rootOffsetX = '';
  self.rootOffsetY = '';
  self.treeContainerHeight = '';
  self.treeContainerWidth = '';

  self.refreshTree();

}

// Recalculate tree layout and coordinates, then redraw tree
ChrisTree.prototype.refreshTree = function() {
  'use strict';

  self.calcTree();
  self.drawTree();
};

// Replace the root element with a newly drawn tree
ChrisTree.prototype.drawTree = function() {
  'use strict';

  self.drawContainer();
  self.drawNodes();
  self.drawLinks();
};

// Recalculate the layout and coordinates of the tree - does not redraw
ChrisTree.prototype.calcTree = function() {
  'use strict';

  self.calcVars();
  self.calcLayout();
  self.calcMinMax();
};

// Calculate all dependent variables necessary to determine layout and coordinates of tree
ChrisTree.prototype.calcVars = function() {
  'use strict';

  // Calculates the rotation angle in radians for the tree, with an angle of 0 having a downward direction
  self.treeOrientationRad = self.toRad(self.treeOrientation);

  // Calculates the sin and cos of the rotation angle for various projection calculations throughout the function
  self.sinR = Math.round(Math.sin(self.treeOrientationRad));
  self.cosR = Math.round(Math.cos(self.treeOrientationRad));

  self.nodeAnchorX  = Math.abs(self.sinR) * (self.sinR * (self.nodeHeight / 2)) +
                              Math.abs(self.cosR) * (self.cosR * (self.nodeWidth  / 2));

  self.nodeSourceAnchorY  = Math.abs(self.sinR) * ( (self.nodeWidth  / 2) + (self.sinR * (self.nodeWidth  / 2)) ) +
                              Math.abs(self.cosR) * ( (self.nodeHeight / 2) + (self.cosR * (self.nodeHeight / 2)) );

  self.nodeTargetAnchorY  = Math.abs(self.sinR) * ( -1 * (self.nodeWidth  / 2) + (self.sinR * (self.nodeWidth  / 2)) ) +
                              Math.abs(self.cosR) * ( -1 * (self.nodeHeight / 2) + (self.cosR * (self.nodeHeight / 2)) );

  // The H/W ratio via hwRatio scales so that it always results in d3ParsedNodes being adjacent when horizontal spacing is 0.
  self.hwRatio = (self.nodeHeight / self.nodeWidth);

  // Helper field that calcualtes the actual number of pixels that need to be between the 
  self.rawSpanSpacingPxls = self.hwRatio * Math.abs(self.sinR) + (1) * Math.abs(self.cosR);

  // A decimal percent specifying the spacing between sibling and cousin elements - Used with the separation function on the layout
  // Use nodeWidth if tree is vertically orientated, nodeHeight if tree is horizontal
  self.nodeSpanSpacingPct = (1 / self.nodeWidth) * ( (self.nodeHeight * Math.abs(self.sinR)) + (self.nodeWidth * Math.abs(self.cosR)) + self.widthSpacing );
  
  // Calculate the root node X offset based on the min and max layout positionings, along with offsets based on orientation
  // The X offset is always the offset of the tree in the SPAN (horizontal) direction
  self.rootOffsetX = 0;    // By default no X offset
  if (self.sinR === 1 || self.cosR === 1) {
    self.rootOffsetX = self.sinR * ((-1 * settings.minX) + (self.treePadding / 2)) +
                    self.cosR * ((-1 * settings.minX) + (self.treePadding / 2));
  } else if (self.sinR === -1 || self.cosR === -1) {
    self.rootOffsetX = self.sinR * (settings.maxX + (self.treePadding / 2)) +
                    self.cosR * (settings.maxX + (self.treePadding / 2));
  }

  // If necessary, calculate the root node Y offset based on the size of the calculated tree container
  // The Y offset is always the offset of the root node in the DEPTH (vertical) direction
  // The Y offset is only necessary when the tree is rotated 180 or 270 degrees (How do you write a function that is 1 for 180/270, but 0 for 0/90?)
  self.rootOffsetY = (self.treePadding / 2);    // By default Y offset should be half the tree padding
  if (self.sinR === -1 || self.cosR === -1) {
    self.rootOffsetY = -1 * (settings.maxY - settings.minY + (self.treePadding / 2));
  }

  // Calculate the container element width and height, based on depth/span spacing, orientation, and node size
  self.treeContainerHeight = Math.abs(self.sinR) * (settings.maxX - settings.minX + self.nodeHeight) +
                                      Math.abs(self.cosR) * (settings.maxY - settings.minY + self.nodeHeight);
  self.treeContainerWidth =  Math.abs(self.sinR) * (settings.maxY - settings.minY + self.nodeHeight) +
                                      Math.abs(self.cosR) * (settings.maxX - settings.minX + self.nodeWidth);

  // Generate the different link types we can use for drawing links between nodes
  switch(self.linkStrategy) {
  case 'diagonal':
    self.linkFunction = self.diagonalLinkStrategy();
    break;
  case 'elbow':
    self.linkFunction = self.elbowLinkStrategy();
    break;
  }
};

// Calculate the layout of the tree based on current properties
ChrisTree.prototype.calcLayout = function() {
  'use strict';

  var d3Tree = d3.layout.tree()
    .size(null)
    .nodeSize([self.nodeWidth, self.nodeHeight])  // Set this width and height of a rectangular node
    .separation(function separation(a, b) {         // Set the spacing between 2 nodes in the tree - d3 default is 1 : 2
      return a.parent === b.parent ? self.nodeSpanSpacingPct : self.nodeSpanSpacingPct;
    })
    .children(function (d) {                        // Custom define the children element names
      return (!d[self.nodeChildName] || d[self.nodeChildName].length === 0) ? null : d[self.nodeChildName];
    });

  // Extract d3ParsedNodes and d3ParsedLinks from the root node via the specifications of the Tree Layout (d3.layout.tree())
  self.nodes = d3Tree.nodes(self.nodeData).reverse();
  sef.links = d3Tree.links(self.nodes);

  // Modify each node to add the desired spacing between depth levels of the tree
  self.nodes.forEach(function (d) {
    // Find the depth of 1 node, whether it be width for vertical trees or height for horizontal trees
    // Depth is always a positive value, since it's applied before the node transformation, so take the abs value of sin and cosine
    var nodeDepthSize = Math.abs(self.sinR) * self.nodeWidth +
                        Math.abs(self.cosR) * self.nodeHeight;

    // Find the total depth of this particular node by multiplying its depth level by the sum of its depth size + depth spacing
    d.y = d.depth * (nodeDepthSize + settings.NODE_DEPTH_SPACING);
  });

};

// Draw the SVG container element on the root tree node
ChrisTree.prototype.drawContainer = function() {
  'use strict';

  // Define the spatial container that the tree will be laid out in
  var svgContainer = d3.select(self.treeContainer)
    .append('svg')
      // The SVG element is consistently 4 pixels larger on all sides than the G element
      // Add on 4 extra pixels in either direction for padding...could be due to borders?
      .attr('width', self.treeContainerWidth + self.treePadding)
      .attr('height', self.treeContainerHeight + self.treePadding)
    .append('g')
      .attr('id', 'tree-container-g');

  return svgContainer;
};

// Draw the background and HTML templates for each node
ChrisTree.prototype.drawNodes = function() {
  'use strict';

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
  // Gives the nodes the initial offset to start at on initialization (location of root node)
  .attr('transform', function (d) {
    var xOriented = self.sinR * (d.y + self.rootOffsetY) +
                     self.cosR * (d.x + self.rootOffsetX);
    var yOriented = self.sinR * (d.x + self.rootOffsetX) +
                     self.cosR * (d.y + self.rootOffsetY);

    return 'translate(' + xOriented + ',' + yOriented + ')';
  });

  // Background rectangle for each node. Can be styled with the class .node-background
  var svgTemplatedNodes = svgInitializedNodes.append('rect')
    .attr('width', self.nodeWidth)
    .attr('height', self.nodeHeight)
    .attr('class', function(d, i) { return self.nodeBkndClasses.join(' '); });

  // The foreignObject which allows the user to inject HTML templates into the tree node
  // Appends the requiredFeatures property as a further guard to make sure d3 is supported
  // Then appends the XHTML object and the HTML template onto that
  svgTemplatedNodes.append('foreignObject')
    .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
    .attr('width', self.nodeWidth)
    .attr('height', self.nodeHeight)
    .append('xhtml:div')
    .attr('class', function(d, i) { return self.nodeTmplClasses.join(' '); })
    .html(function(d) {
      return self.nodeHTMLTemplate(d);
    });

  return svgTemplatedNodes;
};

// Draw the SVG links connecting each node
ChrisTree.prototype.drawLinks = function() {
  'use strict';

  // This block specifically selects all the treeLinks and adds an ID to each of them
  var svgInitializedLinks = svg.selectAll('path.link')
    .data(links, function (d) {
      return d.target.id;
    });

  svgInitializedLinks.enter().insert('path', 'g')
    .attr('class', function(d, i) { return self.linkClasses.join(' '); })
    .attr('marker-end', 'url(#end-arrow)')
    .attr('stroke-width', 1)
    .attr('d', self.linkFunction);

  return svgInitializedLinks;
};

// Returns a function that is used to draw the links as curved SVG paths between nodes
ChrisTree.prototype.diagonalLinkStrategy = function() {
  'use strict';

  return d3.svg.diagonal()
    // PROJECTION: Used to map X and Y into a rotated plane by a specified multiple of 90 degrees
    //              To map from a vertical to horizontal orientation, map (x,y) -> (y,x)
    .projection(function (d) {
      var xOriented =    self.sinR * (d.y + self.rootOffsetY) +
                          self.cosR * (d.x + self.rootOffsetX);
      var yOriented =    self.sinR * (d.x + self.rootOffsetX) +
                          self.cosR * (d.y + self.rootOffsetY);
      return [xOriented, yOriented];
    })
    // A positive value for xAnchor offsets in the direction of increasing depth
    // A positive value for yAnchor offsets to the right when depth is viewed as increasing downward
    // Link Source, Link Target, Unmutated Location - Top Left of Node
    .source(function (d) {
      if(self.linkOrientation === 'down') {
        return { x: (d.source.x + self.nodeAnchorX), y: (d.source.y + self.nodeSourceAnchorY) };
      } else {
        return { x: (d.target.x + self.nodeAnchorX), y: (d.target.y + self.nodeTargetAnchorY) };
      }
      
    })
    .target(function (d) {
      if(self.linkOrientation === 'down') {
        return { x: (d.target.x + self.nodeAnchorX), y: (d.target.y + self.nodeTargetAnchorY) };
      } else {
        return { x: (d.source.x + self.nodeAnchorX), y: (d.source.y + self.nodeSourceAnchorY) };
      }
    });
};

// Returns a an elbow link function that is used to draw right-angled SVG paths between nodes
ChrisTree.prototype.elbowLinkStrategy = function() {
  'use strict';

  return function elbow(d, i) {
    var containerWidth = self.treeContainerWidth;
    var containerHeight = self.treeContainerHeight;
    var w = self.nodeWidth;
    var h = self.nodeHeight;
    var dS = self.treeOrientation;
    var dT = dS + 180;

    var xRootOffset = self.rootOffsetX;
    var yRootOffset = self.rootOffsetY;

    var toRad = function (d) { return d * Math.PI / 180; };
    var sinD = function (d) { return Math.round(Math.sin(toRad(d))); };
    var cosD = function (d) { return Math.round(Math.cos(toRad(d))); };

    var rotateX = function (x, y, d) {
      return (x * cosD(d) + y * sinD(d));
    };
    var rotateY = function (x, y, d) {
      return (x * sinD(d) + y * cosD(d));
    };
    var translate = function (x, t) {
      return x + t;
    };

    // x,y start at upper left of node box for both source and target
    // This offset will center the coordinate within the bounds of the box
    var xSourceBoxOffset = 0.5 * w * sinD(dS);
    var ySourceBoxOffset = 0.5 * h * cosD(dS);
    var xTargetBoxOffset = 0.5 * w * sinD(dT);
    var yTargetBoxOffset = 0.5 * h * cosD(dT);

    // Source and target coordinates originate at the top left corner of each node
    var xS = d.source.x;
    var yS = d.source.y;
    var xT = d.target.x;
    var yT = d.target.y;

    // Translate the coordinates first to center within the container element
    var xSFramed = translate(xS, xRootOffset);
    var ySFramed = translate(yS, yRootOffset);
    var xTFramed = translate(xT, xRootOffset);
    var yTFramed = translate(yT, yRootOffset);

    // Rotate coordinate space so that links are oriented in direction of the angle of rotation
    var xSRotated = rotateX(xSFramed, ySFramed, dS);
    var ySRotated = rotateY(xSFramed, ySFramed, dS);
    var xTRotated = rotateX(xTFramed, yTFramed, dS);
    var yTRotated = rotateY(xTFramed, yTFramed, dS);

    // Center the coordinates from top left to center of node
    // Nodes always have 1 orientation for readability so centering offset is static
    var xSNodeCentered = translate(xSRotated, 0.5 * w);
    var ySNodeCentered = translate(ySRotated, 0.5 * h);
    var xTNodeCentered = translate(xTRotated, 0.5 * w);
    var yTNodeCentered = translate(yTRotated, 0.5 * h);

    // Translate each coordinate to the edge of the node based on angle of rotation
    // Source and target inner box offsets are 180 degrees offset (i.e. opposite edges)
    var xSNodeEdgePositioned = translate(xSNodeCentered, xSourceBoxOffset);
    var ySNodeEdgePositioned = translate(ySNodeCentered, ySourceBoxOffset);
    var xTNodeEdgePositioned = translate(xTNodeCentered, xTargetBoxOffset);
    var yTNodeEdgePositioned = translate(yTNodeCentered, yTargetBoxOffset);

    var kinkY = (yTNodeEdgePositioned - ySNodeEdgePositioned) / 4;
    var kinkX = (xTNodeEdgePositioned - xSNodeEdgePositioned) / 4;

    if (sinD(dS) !== 0 && self.linkOrientation === 'down') {
        return "M" + (xSNodeEdgePositioned) + "," + (ySNodeEdgePositioned)
            + "H" + (xSNodeEdgePositioned + kinkX)
            + "V" + (yTNodeEdgePositioned) + "H" + (xTNodeEdgePositioned);

    } else if (cosD(dS) !== 0 && self.linkOrientation === 'down') {
        return "M" + (xSNodeEdgePositioned) + "," + (ySNodeEdgePositioned)
            + "V" + (ySNodeEdgePositioned + kinkY)
            + "H" + (xTNodeEdgePositioned) + "V" + (yTNodeEdgePositioned);
    }
    else if (sinD(dS) !== 0 && self.linkOrientation === 'up') {
        return "M" + (xTNodeEdgePositioned) + "," + (yTNodeEdgePositioned)
            + "H" + (xTNodeEdgePositioned - kinkX)
            + "V" + (ySNodeEdgePositioned) + "H" + (xSNodeEdgePositioned);

    } else if (cosD(dS) !== 0 && self.linkOrientation === 'up') {
        return "M" + (xTNodeEdgePositioned) + "," + (yTNodeEdgePositioned)
            + "V" + (yTNodeEdgePositioned - kinkY)
            + "H" + (xSNodeEdgePositioned) + "V" + (ySNodeEdgePositioned);
    }
  };
};

// Calculate the min and max values of the tree layout, giving you a bounding box with which a tree container element can be created
ChrisTree.prototype.calcMinMax = function() {
  'use strict';
  self.minX = d3.min(self.nodes, function (node) { return node.x; });
  self.maxX = d3.max(self.nodes, function (node) { return node.x; });
  self.minY = d3.min(self.nodes, function (node) { return node.y; });
  self.maxY = d3.max(self.nodes, function (node) { return node.y; });
};

// Convert an angle from degrees to radians
ChrisTree.prototype.toRad = function(degAngle) {
  'use strict';
  return degAngle * (Math.PI / 180);
};

// Redraw tree at specified orientation
ChrisTree.prototype.setOrientation = function(newAngle) {
  'use strict';
  self.treeOrientation = newAngle;
  self.refreshTree();
};

// Redraw links with new specified link type
ChrisTree.prototype.setLinkType = function(newLinkType) {
  'use strict';
  self.linkStrategy = newLinkType;
  self.calcVars();
  self.drawLinks();
};

// Refresh the node JSON data and then redraw the nodes
ChrisTree.prototype.updateJSON = function(newNodeData) {
  'use strict';
  self.nodeData = newNodeData;
  self.calcLayout();
  self.drawNodes();
};

