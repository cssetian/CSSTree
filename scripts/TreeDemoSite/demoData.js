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
  node: [
    {
      data: '2',
      node: [
        { data: '5' },
        { data: '6' }
      ]
    },
    { data: '3' },
    {
      data: '4',
      node: [
        {
          data: '7',
          node: { data: '10' }
        },
        { data: '8' },
        { data: '9'}
      ]
    }
  ]
};

TreeDemoSite.demoData.squareDemoData = {
  dataValue1: '1',
  dataValue2: 'Sq.DV2.',
  node: [
    {
      dataValue1: '2',
      dataValue2: 'Sq.DV2.',
      node: [
        {
          dataValue1: '5',
          dataValue2: 'Sq.DV2.'
        }, {
          dataValue1: '6',
          dataValue2: 'Sq.DV2.'
        }
      ]
    }, {
      dataValue1: '3',
      dataValue2: 'Sq.DV2.'
    }, {
      dataValue1: '4',
      dataValue2: 'Sq.DV2.',
      node: [
        {
          dataValue1: '7',
          dataValue2: 'Sq.DV2.',
          node: {
            dataValue1: '10',
            dataValue2: 'Sq.DV2.',
          }
        }, {
          dataValue1: '8',
          dataValue2: 'Sq.DV2.',
        }, {
          dataValue1: '9',
          dataValue2: 'Sq.N9.DV2.'
        }
      ]
    }
  ]
};
    
TreeDemoSite.demoData.tableDemoData = {
  dataValue1: 'N1.T.',
  dataValue2: 'A',
  node: [
    {
      dataValue1: 'N2.T.',
      dataValue2: 'B',
      node: [
        {
          dataValue1: 'N5.T.',
          dataValue2: 'E'
        }, {
          dataValue1: 'N6.T.',
          dataValue2: 'F'
        }
      ]
    }, {
      dataValue1: 'N3.T.',
      dataValue2: 'C'
    }, {
      dataValue1: 'N4.T.',
      dataValue2: 'D',
      node: [
        {
          dataValue1: 'N7.T.',
          dataValue2: 'G',
          node: {
            dataValue1: 'N10.T.',
            dataValue2: 'J'
          }
        }, {
          dataValue1: 'N8.T.',
          dataValue2: 'H',
        }, {
          dataValue1: 'N9.T.',
          dataValue2: 'I'
        }
      ]
    }
  ]
};
    
TreeDemoSite.demoData.buttonDemoData = {
  dataValue1: 'B1',
  dataValue2: '(Node 1 | DataValue2)',
  node: [
    {
      dataValue1: 'B2',
      dataValue2: '( Node 2 | DataValue2)',
      node: [
        {
          dataValue1: 'B5',
          dataValue2: '(Node 5 | DataValue2)'
        }, {
          dataValue1: 'B6|',
          dataValue2: '(Node 6 | DataValue2)'
        }
      ]
    }, {
      dataValue1: 'B3',
      dataValue2: '(Node 3 | DataValue2)'
    }, {
      dataValue1: 'B4',
      dataValue2: '(Node 4 | DataValue2)',
      node: [
        {
          dataValue1: 'B7',
          dataValue2: '(Node 7 | DataValue2)',
          node: {
            dataValue1: 'B10',
            dataValue2: '(Node 10 | DataValue2)'
          }
        }, {
          dataValue1: 'B8',
          dataValue2: '(Node 8 | DataValue2)',
        }, {
          dataValue1: 'B9',
          dataValue2: '(Node 9 | DataValue2)'
        }
      ]
    }
  ]
};

TreeDemoSite.demoData.userDemoData = {
};
