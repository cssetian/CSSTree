# CSSTree Generic Tree-Drawing Class

## Class Specifics
<table>
<tr><th>Class Name</th><th>Description</th><th>File Location</th></tr>
<tr><td>CSSTree</td><td>Tree-drawing class</th><td>scripts/CSSTree.js</td></tr>
</table>

## Required Dependencies
* [d3.js](https://github.com/mbostock/d3)
* [jQuery](https://github.com/jquery/jquery)

## Background
This is a d3-based tree-drawing class, designed to configure and draw an SVG representation of tree-based data that renders each node's specific data into a user-supplied HTML template. The constructor takes in a settings variable that can be used to configure a number of useful visual characteristics of the tree.

##### Calculating The Layout
The class first calculates a geometric layout of the json tree structure using d3. Next, it injects the json data of each node into the HTML template - The template can use any data-tree structure for its data properties within the node data, so long as the HTML template reflects that corresponding strategy and layout of data properties. 
*The default settings do not need to be supplied and are used as fallbacks for when specific properties aren't specified by the user*. 

##### Drawing The Tree
The plugin then creates an SVG representation of the tree, appends it to the specified container element, and applies all user-specified classes. The container element (assuming a \<div\>) will automatically expand to the size that the calculations determine are the dimensions of the tree.

User settings are an optional parameter, and if any are specified, they are merged into the default settings, where each user specified property overrides its corresponding default property. Basic settings can also be changed after creation, and a refresh function can be called to recalculate depenedent variables and tree layout.

## Benefits
The biggest benefits to this particular implementation are that it:

1.  Allows each node to be supplied a customized HTML template, and can be user-styled and populated with node-specific data. It then recalculates the geometry of the tree layout based on the dimensions of the resulting template, and the various dimension-specific basic options.
2.  Is highly visually configurable, using a number of different properties, coupled with CSS classes that can be added for further user customization of the tree.

## Important Files
<dl>
  <dt>scripts/src/CSSTree.js</dt>
  <dd>The real deal, a prototype-based implementation of the tree drawing concept. Just include the file in your project, and make sure to reference the most recent version of d3 and jQuery first.</dd>
  <dt>index.html</dt>
  <dd>A test site for playing around with the library and various settings. It also draws sample trees based on user-input settings. In addition to drawing the tree, it also displays the default, user-input, and compiled settings in different modules for easy comparison and copy/paste into your pown project.</dd>
  <dt>styles/index.css</dt>
  <dd>This file contains the CSS classes for the demo site, styled with responsive design in mind for its layout to best suit any given viewport or re-size. It additionally contains basic styles for the default HTML template of each node.</dd>
</dl>

## Depreciated Files
<dl>
  <dt>scripts/src/cssTreeDrawer.js</dt>
  <dd>A second version of the jQuery plugin basically just creates a CSSTree object and executes its refresh function, drawing it on the page, but without setting up the prototype. It essentially just wraps the CSSTree functionality into a jQuery function that can easily be called on a specific DOM element. Not particularly depreciated, but kind of an unnecessary wrapper considering it only has 2 lines.
  </dd>
</dl>

## Demo Site
The [demo site](csstreedrawer.appspot.com), hosted on Google App Engine, gives users a graphical web interface through which they have the ability to configure speicfic settings and customize the tree. Any changes can be observes unpon hitting the 'Draw Tree' button that is statically placed at the top of the page. It takes advantage of responsive design, and should work on a variety of devices. The actaul HTML is included in the github project.

## Instructions For Incorporating Into Your Own App
* Reference jQuery
* Reference d3
* Reference CSSTree.js
* Define JSON options using one of the following options:
* 1. Download or Navigate to the [demo site](csstreedrawer.appspot.com) and select your desired customized inputs, copying the compiled JSON output string to a variable in your javascript file
* 2. Look at the defaults in the source CSSTree.js file and just hand-write the options on your own using similar properties
* Instantiate a new CSSTree object in your code, passing in a JSON object settings parameter
* Call the tree drawing method `CSSTree.refreshTreeLayout()', which recomputes the calculated variables based on any changes to basic property variables, and then draws the new tree on the specified root element property

## Future Enhancements

##### CSSTree Future Enhancements
* Add more link types
* With the diagonal link type, fix the link arrow header markers so that they are aligned to the angle of the diagonal
* Support for different node shapes?
* Add an option for orientation of the HTML template (currently always oriented such that text is human-readable)

##### Demo Site Future Enhancements
* Allow for the tree to always be visible on-screen, even while scrolling through settings and output (may only be feasiible on larger viewports).
* Auto-update tree display when changing properties in the Basic Properties module
* Apply validation to numeric inputs and prevent refresh on invalid inputs
* Auto-populate default values on page load and remove user/default settings values, allow users to reset to default settings by using reset to defaults button in each module
