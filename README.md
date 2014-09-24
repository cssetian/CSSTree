Generic Tree-Drawer
===================
This Object is designed to take a JSON based tree-structure of data and create a visual representation of it using a number of configurable parameters and the CSSTree custom object class leveraging d3.js. 

The benefit of this particular implementation is that it

1.  Allows each node to be supplied an HTML template that utilizes data found on each node to populate variables
2.  Is highly visually configurable using a number of different basic geometric and visual properties, coupled with CSS classes that can be added to various elements of the tree

The Demo Site included gives users the ability to configure speicfic settings and customize the tree. The user can define a root HTML element, height, width, and template for each node of the tree, and additionally include any number of classes to customize the node backgrounds, node templates, link body elements, and link arrow elements. This plugin will then compile these options and display both a formatted and unformatted JSON object for viewing and copying. The plugin then draws a d3 layout and SVG styled representation of the tree, appends it to the supplied element, and applies all user-specified settings. The element container will automatically expand to a size that is determined by an aggregation of the node size, node spacing, and general structure of the data tree. 

By default, d3.js builds a tree layout where each node has a size of 0x0px in its layout coordinate space, and any data relevant to a specific node is displayed in a caption or a separate, dynamically populated element. In this plugin, we instead define what we want the visual characteristics of the nodes to be and aggregate the dimensional characteristics into a coordinate space and the appropriate layout to use with SVG. With this abstraction and the ability to customize the HTML templates, node backgrounds, and link object classes, generated trees can be highly customized with complex class and css property combinations.

DEPRECIATED FILES
-----------------
* tree-drawer-plugin.js - Contains a scripted, straightforward implementation of the tree drawing object, contained within a jquery plugin
* cssTreeDrawer.js - Contains an updated jQuery plugin that creates a CSSTree and executes its refresh function, simply wrapping the CSSTree functionality into a jQuery function that can easily be called on a particular DOM element


REQUIRED DEPENDENCIES
---------------------
* d3.js
* jQuery

USAGE
-----
* Reference jQuery and d3 dependencies first
* Reference CSSTree.js
* Define JSON options either by 
* 1. Using the demo site, completing your desired customized inputs, and copying the compiled JSON string
* 2. Look at the defaults in the source file and write the options on your own using similar properties
* Create a CSSTree object, supplying the user-defined settings
* Call the tree drawing method CSSTree.refreshTreeLayout, which recalculates calculated variables based on any changes to primitive variables, and then draws the tree on the specified root element

STILL TODO
------------
* Add more useful prototype methods to CSSTree class
* Add more link types
* With the diagonal link type, define the link arrow header markers such that they are aligned to the angle of the diagonal
* Support for different node shapes?
* Add an option for orientation of the HTML template (currently always oriented such that text is human-readable)
