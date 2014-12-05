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
  var htmlString = '';

  /* Build Basic Template String */
  htmlString = htmlString + '&ltdiv class&equals&quotfirst-data&quot&gt' + node.data.dataValue1 + '&lt/div&gt';
  htmlString = htmlString + '&ltdiv class&equals&quotsecond-data&quot&gt' + node.data.dataValue2 + '&lt/div&gt';

  return htmlString;
};
    
TreeDemoSite.demoFunctions.tableDemoFunction = function(node) {
  'use strict';
  var htmlString = '' + node;

  /* Build Table Template String */

  return htmlString;
};

TreeDemoSite.demoFunctions.buttonDemoFunction = function(node) {
  'use strict';
  var htmlString = '' + node;

  /* Build Button Template String */

  return htmlString;
};
