// Define various onClick events for expand/collapse and adding rows
var TreeDemoSite = TreeDemoSite || {};

// Basically like a static function
TreeDemoSite.Events = function() {
  'use strict';
  var self = this;

  // Expand / Collapse - all when button under section heading is selected
  $('#toggle-settings-modules').click(function(e) {
    if(self.settingsPanelsClosed) {
      $('#html-template-collapse').collapse('show');
      $('#json-tree-data-collapse').collapse('show');
      $('#tree-settings-collapse').collapse('show');
      self.settingsPanelsClosed = false;
    } else {
      $('#html-template-collapse').collapse('hide');
      $('#json-tree-data-collapse').collapse('hide');
      $('#tree-settings-collapse').collapse('hide');
      self.settingsPanelsClosed = true;
    }
  });

  // Expand / Collapse - all when button under section heading is selected
  $('#toggle-output-modules').click(function(e) {
    if(self.outputPanelsClosed) {
      $('#default-formatted-collapse').collapse('show');
      $('#compiled-formatted-collapse').collapse('show');
      $('#user-unformatted-collapse').collapse('show');
      $('#user-formatted-collapse').collapse('show');
      self.outputPanelsClosed = false;
    } else {
      $('#default-formatted-collapse').collapse('hide');
      $('#compiled-formatted-collapse').collapse('hide');
      $('#user-unformatted-collapse').collapse('hide');
      $('#user-formatted-collapse').collapse('hide');
      self.outputPanelsClosed = true;
    }
  });
  
  // Add a click event to each addRow button:
  //    - Adds a new element to the text input list
  //    - Each item in group included when compiling settings
  //    - When options are compiled, all empty boxes are ignored
  $('.add-row').click(function(e) {
    'use strict';
    var self = this;
      
    var ul = $(self.dataset.listid);

    var li = document.createElement('li');
    li.className = 'option-list-item';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'option-list-item-input';

    li.appendChild(input);
    ul.append(li);
  });
  
  
  $('#node-html-ex-sq').click(function(e) {
    console.log('fired!');
    console.log(TreeDemoSite.demoFunctions.squareDemoFunction);
    var squareFuncString = String(TreeDemoSite.demoFunctions.squareDemoFunction);
    console.log(squareFuncString);
    $('#node-html-template').val('');
    $('#node-html-template').val(squareFuncString);
  });
};