/**
* Created with CSSTreeDrawer.
* User: cssetian
* Date: 2014-10-02
* Time: 11:37 PM
* To change this template use Tools | Templates.
*/
var TreeDemoSite = TreeDemoSite || {};
TreeDemoSite.demoData = TreeDemoSite.demoData || {};

TreeDemoSite.demoData.squareDemoData = {
  dataValue1: '1',
  dataValue2: 'Node1',
  node: [{
    dataValue1: '2',
    dataValue2: 'Node2',
    node: [{
      dataValue1: '5',
      dataValue2: 'Node5'
    }, {
      dataValue1: '6',
      dataValue2: 'Node6'
    }]
  }, {
    dataValue1: '3',
    dataValue2: 'Node3'
  }, {
    dataValue1: '4',
    dataValue2: 'Node4',
    node: [{
      dataValue1: '7',
      dataValue2: 'Node7',
      node: [{
        dataValue1: '10',
        dataValue2: 'Node10',
      }]
    }, {
      dataValue1: '8',
      dataValue2: 'Node8',
    }, {
      dataValue1: '9',
      dataValue2: 'Node9'
    }]
  }]
};
    
TreeDemoSite.demoData.tableDemoData = function(node) {
  'use strict';
  var htmlString = '' + node;

  /* Build Table Template String */

  return htmlString;
};

TreeDemoSite.demoData.buttonDemoData = function(node) {
  'use strict';
  var htmlString = '' + node;

  /* Build Button Template String */

  return htmlString;
};
