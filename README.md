# CSSTree Generic Tree-Drawer
<table>
<tr><th>Class Name</th><th>File Location</th></tr>
<tr><td>CSSTree</td><td>scripts/CSSTree.js</td></tr>
</table>
## Background
This is a d3-based class designed to take as inputs JSON-formatted tree data and a number of configurable parameters. The class then calculates a visual layout of the tree using d3 and constructs the HTML elements to draw it using SVG. The class is constructed with user settings as an optional parameter, and if any are specified, they are merged into the default settings. Basic settings can also be changed after creation, with a refresh function that recalculates both depenedent variables and the layout.

The benefit of this particular implementation is that it

1.  Allows each node to be supplied an HTML template that utilizes the tree data to programmatically populate specific data
2.  Is highly visually configurable using a number of different properties, coupled with CSS classes that can be added for user customization of the tree

## Demo Site
The [demo site](cssairportmaps.appspot.com) gives users a graphical web interface through which they have the ability to configure speicfic settings and customize the tree, while observing the resulting visual output in real time. 
### Refreshing Tree Layout
Upon updating specific variables of the modules, after which the user will press the refreshTree button. On refresh, the tree object will then recalculate all dependent variables, the tree layout, and redraw the tree in an output module. The page will then refresh the various read-only display modules.
*The default settings are not necessary to input as settings when creating a tree, they are simply fallbacks for when those properties aren't specified*. 
### Drawing The Tree
The plugin then draws a d3 layout and SVG styled representation of the tree, appends it to the supplied element, and applies all user-specified settings. The element container will automatically expand to a size that is determined by an aggregation of the node size, node spacing, and general structure of the data tree. 

## IMPORTANT FILES
<dl>
  <dt>scripts/CSSTree.js</dt>
  <dd>
    The real deal, a prototype-based implementation of the tree drawing concept
  </dd>
  <dt>index.html</dt>
  <dd>
    Contains a test site for playing around with settings, drawing sample trees, and then extracting those settings into javascript objects that can be passed into a function call to yield the same result
  </dd>
  <dt>styles/index.css</dt>
  <dd>
    Contains the CSS classes for the entire demo site page, as well as styles for the demo tree layout and template at the bottom of the file
  </dd>
</dl>

## DEPRECIATED FILES
<dl>
  <dt>tree-drawer-plugin.js</dt>
  <dd>Contains a scripted, straightforward implementation of the tree drawing concept, contained within a jquery plugin that creates a tree on an element with the specified input settings when invoked on an element with specific data.
  </dd>
  <dt>cssTreeDrawer.js</dt>
  <dd>Contains an second version of the jQuery plugin that creates a CSSTree object and executes its refresh function, simply wrapping the CSSTree functionality into a jQuery function that can easily be called on a particular DOM element
  </dd>


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
