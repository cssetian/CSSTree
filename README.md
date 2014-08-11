Generic Tree-Drawer
===================
This plugin is designed to take a JSON formatted tree of data and create a visual representation using a customization of the tree layout in d3.js. 

The benefit of this particular implementation is that it: 
1 Extracted a number of different options into configurable settings
2 Allows the user to inject a generic HTML template into each node
3 The HTML template function is passed the JSON data object for each node in the tree as a parameter, and is used to inject the unique data into the template of each node.

The Demo Site included gives users the ability to configure speicfic settings and customize the tree. The user can define a root HTML element, height, width, and template for each node of the tree, and additionally include any number of classes to customize the node backgrounds, node templates, link body elements, and link arrow elements. This plugin will then compile these options and display both a formatted and unformatted JSON object for viewing and copying. The plugin then draws a d3 layout and SVG styled representation of the tree, appends it to the supplied element, and applies all user-specified settings. The element container will automatically expand to a size that is determined by an aggregation of the node size, node spacing, and general structure of the data tree. 

By default, d3.js builds a tree layout where each node has a size of 0x0px in its layout coordinate space, and any data relevant to a specific node is displayed in a caption or a separate, dynamically populated element. In this plugin, we instead define what we want the visual characteristics of the nodes to be and aggregate the dimensional characteristics into a coordinate space and the appropriate layout to use with SVG. With this abstraction and the ability to customize the HTML templates, node backgrounds, and link object classes, generated trees can be highly customized with complex class and css property combinations.

REQUIRED DEPENDENCIES
---------------------
* d3.js
* jQuery
* underscore.js

USAGE
-----
* Reference dependencies first
* Reference treedrawerplugin.js
* Define JSON options either by 
* 1. Using the demo site, completing your desired customized inputs, and copying the compiled JSON string
* 2. Look at the defaults in the source file and write the options on your own using similar properties
* Call the tree drawing function on an HTML container element, passing your options into the function
  * Example: $("#my-container-el").drawTree(options);

STILL TODO
------------
* Add more link types
* With the diagonal link type, define the link arrow header markers such that they are aligned to the angle of the diagonal
* Support for different node shapes?
* Add an option for orientation of the HTML template (currently always oriented such that text is human-readable)
* Remove underscore dependency for fewer library dependencies
