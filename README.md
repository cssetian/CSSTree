# CSSTree Generic Tree-Drawer

## Background
This is a d3-based class designed to take as inputs JSON-formatted tree data and a number of configurable parameters. The class then calculates a visual layout of the tree using d3 and constructs the HTML elements to draw it using SVG. The class is constructed with user settings as an optional parameter, and if any are specified, they are merged into the default settings. Basic settings can also be changed after creation, with a refresh function that recalculates both depenedent variables and the layout.

The benefit of this particular implementation is that it:

1.  Allows each node to be supplied an HTML template that utilizes the tree data to programmatically populate specific data
2.  Is highly visually configurable using a number of different properties, coupled with CSS classes that can be added for user customization of the tree

<table>
<tr><th>Class Name</th><th>File Location</th></tr>
<tr><td>CSSTree</td><td>scripts/CSSTree.js</td></tr>
</table>

## Required Dependencies
* [d3.js](https://github.com/mbostock/d3)
* [jQuery](https://github.com/jquery/jquery)

## Important Files
<dl>
  <dt>scripts/CSSTree.js</dt>
  <dd>The real deal, a prototype-based implementation of the tree drawing concept</dd>
  <dt>index.html</dt>
  <dd>Contains a test site for playing around with settings, drawing sample trees, and then extracting those settings into javascript objects that can be passed into a function call to yield the same result</dd>
  <dt>styles/index.css</dt>
  <dd>Contains the CSS classes for the entire demo site page, as well as styles for the demo tree layout and template at the bottom of the file</dd>
</dl>

## DEPRECIATED FILES
<dl>
  <dt>scripts/tree-drawer-plugin.js</dt>
  <dd>Contains a scripted, straightforward implementation of the tree drawing concept, contained within a jquery plugin that creates a tree on an element with the specified input settings when invoked on an element with specific data.
  </dd>
  <dt>scripts/cssTreeDrawer.js</dt>
  <dd>Contains an second version of the jQuery plugin that creates a CSSTree object and executes its refresh function, simply wrapping the CSSTree functionality into a jQuery function that can easily be called on a particular DOM element
  </dd>
</dl>

## Demo Site
The [demo site](cssairportmaps.appspot.com), hosted on Google App Engine, gives users a graphical web interface through which they have the ability to configure speicfic settings and customize the tree, while observing the resulting visual output in real time. 
### Calculating Tree Layout
Upon updating specific variables of the modules, after which the user will press the refreshTree button. On refresh, the tree object will then recalculate all dependent variables, the tree layout, and redraw the tree in an output module. The page will then refresh the various read-only display modules.
*The default settings are not necessary to input as settings when creating a tree, they are simply fallbacks for when those properties aren't specified*. 
### Drawing The Tree
The plugin then draws a d3 layout and SVG styled representation of the tree, appends it to the supplied element, and applies all user-specified settings. The element container will automatically expand to a size that is determined by an aggregation of the node size, node spacing, and general structure of the data tree. 

## Instructions
* Reference jQuery dependency
* Reference d3 dependency
* Reference CSSTree.js
* Define JSON options using one of the following options:
* 1. Download or Navigate to the [demo site](cssairportmaps.appspot.com) and select your desired customized inputs, copying the compiled JSON output string to a variable in your javascript file
* 2. Look at the defaults in the source CSSTree.js file and just hand-write the options on your own using similar properties
* Instantiate a new CSSTree object in your code, passing in a JSON object settings parameter
* Call the tree drawing method `CSSTree.refreshTreeLayout()', which recomputes the calculated variables based on any changes to basic property variables, and then draws the new tree on the specified root element property

## STILL TODO
### Bugs
* Disable treeContainerId input but keep the default value filled in since user isn't going to change the Demo Site's container element ID
* With the diagonal link type, fix the link arrow header markers such that they are aligned to the angle of the diagonal

### CSSTree Features
* Add more useful prototype methods to CSSTree class
* Add more link types
* Support for different node shapes?
* Add an option for orientation of the HTML template (currently always oriented such that text is human-readable)

### Demo Site Features
* Allow for the tree to always be visible on-screen while scrolling through settings and output (may only be feasiible on larger viewports)
* Auto-update displayed tree on changing basic properties. Remove static-ly positioned 'Draw Tree' button and 
* Separate properties into modules:
** Basic Properties
** CSS Styling
** Node HTML Template
** Tree Data
* Auto-update tree display when changing properties in the Basic Properties module
* Add buttons to Apply properties in each of the complex properties modules
* Add button to each module to reset to default values and apply to tree
* Apply validation to numeric inputs and prevent refresh on invalid inputs
* Auto-populate default values on page load and remove user/default settings values, allow users to reset to default settings by using reset to defaults button in each module
* Possibly have 1 reset all to defaults button at top of page
* 
