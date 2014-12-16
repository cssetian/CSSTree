/**
* Created with CSSTreeDrawer.
* User: cssetian
* Date: 2014-10-02
* Time: 11:37 PM
* To change this template use Tools | Templates.
*/
var TreeDemoSite = TreeDemoSite || {};
TreeDemoSite.demoFunctions = TreeDemoSite.demoFunctions || {};

TreeDemoSite.demoFunctions.squareDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '';

  /* Build Basic Template String */
  htmlTemplate = htmlTemplate + '<div class=\"square-demo-container\">';
  htmlTemplate = htmlTemplate + '<div class=\"first-data\">' + node.dataValue1 + '</div>';
  htmlTemplate = htmlTemplate + '<div class=\"second-data\">' + node.dataValue2 + '</div>';
  htmlTemplate = htmlTemplate + '</div>';

  return htmlTemplate;
};
    
TreeDemoSite.demoFunctions.tableDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '';

  /* Build Table Template String */
  htmlTemplate = htmlTemplate + '<table class=\"table-demo-template\"><tr>';
  htmlTemplate = htmlTemplate + '<td class=\"first-data\">' + node.dataValue1 + '</td>';
  htmlTemplate = htmlTemplate + '<td class=\"second-data\">' + node.dataValue2 + '</td>';
  htmlTemplate = htmlTemplate + '</tr></table>';

  return htmlTemplate;
};

TreeDemoSite.demoFunctions.buttonDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '';

  /* Build Button Template String */
  htmlTemplate = htmlTemplate + '<div class=\"button-demo-container\">';
  htmlTemplate = htmlTemplate + '<div class=\"first-data\">' + node.dataValue1 + '</div>';
  htmlTemplate = htmlTemplate + '<button type=\"button\" class=\"second-data\" onClick=\"javascript: alert(\' Thanks for clicking! Here\\\'s some data: ' + node.dataValue2 + '\') \">Click!</button>';
  htmlTemplate = htmlTemplate + '</div>';

  return htmlTemplate;
};

TreeDemoSite.demoFunctions.defaultDemoFunction = function (d) {
  'use strict';
  return '<div class="node-template">' + d.data + '</div>';
};

TreeDemoSite.demoFunctions.userDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '';

  /* Edit this and build your own HTML template here! */

  return htmlTemplate;
};
