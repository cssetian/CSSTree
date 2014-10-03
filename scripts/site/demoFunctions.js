/**
* Created with CSSTreeDrawer.
* User: cssetian
* Date: 2014-10-02
* Time: 11:37 PM
* To change this template use Tools | Templates.
*/
var TreeDemoSite = TreeDemoSite || {};

TreeDemoSite.demoFunctions = TreeDemoSite.demoFunctions || {};

TreeDemoSite.demoFunctions = (function() {
  'use strict'

  squareDemoFunction = function(node) { 
    var htmlString = "";

    /* Build Basic Template String */ 
    htmlString = htmlString + "&ltdiv&gt" + node.data.dataValue1 + "&lt/div&gt";
    htmlString = htmlString + "&ltdiv&gt" + node.data.dataValue2 + "&lt/div&gt";

    return htmlString; 
  };
    
  tableDemoFunction = function(node) { 
      var htmlString = "";

      /* Build Table Template String */ 

      return htmlString; 
    };
    
    buttonDemoFunction = function(node) { 
      var htmlString = "";

      /* Build Button Template String */ 

      return htmlString; 
    };
  
  
  return {
    squareDemoFunction: squareDemoFunction,
    tableDemoFunction: tableDemoFunction,
    buttonDemoFunction: buttonDemoFunction
  };
});