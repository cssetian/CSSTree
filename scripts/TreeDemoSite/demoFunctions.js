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
  htmlTemplate = htmlTemplate + '<div class=&quotfirst-data&quot>' + node.dataValue1 + '</div>';
  htmlTemplate = htmlTemplate + '<div class=&quotsecond-data&quot>' + node.dataValue2 + '</div>';

  return htmlTemplate;
};
    
TreeDemoSite.demoFunctions.tableDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '' + node;

  /* Build Table Template String */

  return htmlTemplate;
};

TreeDemoSite.demoFunctions.buttonDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '' + node;

  /* Build Button Template String */

  return htmlTemplate;
};

TreeDemoSite.demoFunctions.userDemoFunction = function(node) {
  'use strict';
  var htmlTemplate = '';

  /* Build Your HTML Template Here */

  return htmlTemplate;
};
