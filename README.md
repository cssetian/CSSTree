Generic Tree-Drawer
===================
This plugin is designed to take a JSON formatted tree and create a visual representation using d3.js and its tree layout function. 

The benefit of this particular implementation is that, along with a number of other tree options that have been extracted into generic settings, this plugin allows the user to inject a generic HTML template into each node, populating it with any desired data and styling. After defining a root HTML element and supplying a height, width, and template for each node of the tree, this plugin will build a d3 layout and SVG representation of the tree, append it to the supplied element, and apply all user-specified settings to it. The element will automatically expand to a size that is determined by a combination of the node size, node spacing, and complexity of the data tree. 

By default, d3.js builds a tree layout where each node has a size of 0px and any data relevant to a specific node is displayed in a caption or a separate, dynamically populated element, and so one cannot easily size the tree nodes in a reconfigurable way while supplying an HTML template to display data in a styled manner.

REQUIRED DEPENDENCIES
---------------------
* d3.js
* jQuery
* underscore.js

USAGE
-----
* Include all dependencies in your page
* Include the treedrawerplugin.js file in your page
* Define desired customization options
* Call the tree drawing function on an HTML container element
  * Example: $("#my-container-el").drawTree(options);

STILL TODO
------------
* Better reduce the CSS class specifications into a number of descriptive, necessary classes that encompass all use cases
* Add more link types
* With the diagonal link type, define the link arrow header markers such that they are aligned to the angle of the diagonal
* Support for different node shapes?
* Add an option for orientation of the HTML template (currently always oriented such that text is human-readable)
* Remove underscore dependency for fewer library dependencies
