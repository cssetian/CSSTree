/**
* Created with CSSTreeDrawer.
* User: cssetian
* Date: 2014-10-02
* Time: 11:37 PM
* To change this template use Tools | Templates.
*/
var TreeDemoSite = TreeDemoSite || {};
TreeDemoSite.demoData = TreeDemoSite.demoData || {};

TreeDemoSite.demoData.defaultDemoData = {
  data: '1',
  node: [{
    data: '2',
    node: [{
      data: '5'
    }, {
      data: '6'
    }]
  }, {
    data: '3'
  }, {
    data: '4',
    node: [{
      data: '7',
      node: [{
        data: '10'
      }]
    }, {
      data: '8'
    }, {
      data: '9'
    }]
  }]
};

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
    
TreeDemoSite.demoData.tableDemoData = {
  dataValue1: 'N1|',
  dataValue2: 'A',
  node: [{
    dataValue1: 'N2|',
    dataValue2: 'B',
    node: [{
      dataValue1: 'N5|',
      dataValue2: 'E'
    }, {
      dataValue1: 'N6|',
      dataValue2: 'F'
    }]
  }, {
    dataValue1: 'N3|',
    dataValue2: 'C'
  }, {
    dataValue1: 'N4|',
    dataValue2: 'D',
    node: [{
      dataValue1: 'N7|',
      dataValue2: 'G',
      node: [{
        dataValue1: 'N10|',
        dataValue2: 'J',
      }]
    }, {
      dataValue1: 'N8|',
      dataValue2: 'H',
    }, {
      dataValue1: 'N9|',
      dataValue2: 'I'
    }]
  }]
};

TreeDemoSite.demoData.buttonDemoData = function(node) {
  'use strict';
  var htmlString = '' + node;

  /* Build Button Template String */

  return htmlString;
};
