// Define various onClick events for expand/collapse and adding rows
var TreeDemoSite = TreeDemoSite || {};

TreeDemoSite.App = TreeDemoSite.App || {};

TreeDemoSite.App.Initialize = function() {
  'use strict';
  var self = this;

  // Declare state variables
  self.userSettings = {};
  self.mergedSettings = {};
  self.outputPanelsClosed = false;
  self.settingsPanelsClosed = false;

  // Initialize expand / collapse modules to an expanded state
  $(function () {
    $('.output-panel-body').collapse({ toggle: false });
  });
  $(function () {
    $('.settings-panel-body').collapse({ toggle: false });
  });

  // Initialize default settings to be used for all layout calculations (basically same as class prototype)
  TreeDemoSite.App.renderJSONText('#default-formatted-settings', CSSTree.defaultSettings, true);

  TreeDemoSite.Events();
};

TreeDemoSite.App.addClassesToSettingsObject = function() {
  'use strict';
  var self = this;
  
  // Build class lists from groups of list entries 
  var classList = {};
  classList.tempNodeBkndClasses = TreeDemoSite.App.buildArrayFromList('option-node-background-classes');
  classList.tempNodeHTMLClasses = TreeDemoSite.App.buildArrayFromList('option-node-html-classes');
  classList.tempLinkClasses = TreeDemoSite.App.buildArrayFromList('option-link-body-classes');
  classList.tempArrowClasses = TreeDemoSite.App.buildArrayFromList('option-link-arrow-classes');

  if (classList.tempNodeBkndClasses !== null) {
    self.mergedSettings.nodeBkndClasses = classList.tempNodeBkndClasses;
  }
  if (classList.tempNodeHTMLClasses !== null) {
    self.mergedSettings.nodeHTMLClasses = classList.tempNodeHTMLClasses;
  }
  if (classList.tempLinkClasses !== null) {
    self.mergedSettings.linkClasses = classList.tempLinkClasses;
  }
  if (classList.tempArrowClasses !== null) {
    self.mergedSettings.arrowClasses = classList.tempArrowClasses;
  }
  return self;
};

// Define a function to refresh a given element with specific data
TreeDemoSite.App.renderJSONText = function(el, data, formatted) {
  'use strict';
  var self = this;
  $(el).html('');

  // If the text should be formatted, define size of indentation
  if(formatted) {
    $(el).html(JSON.stringify(data, null, 2));
  } else {
    $(el).html(JSON.stringify(data));
  }
};

// Display formatted/unformatted user settings in modules
//      Show default (in initialization), user, and compiled settings in formatted JSON
TreeDemoSite.App.refreshSettingsPanels = function() {
  'use strict';
  var self = this;
  var mergedSettings = CSSTree.extend(CSSTree.defaultSettings, self.userSettings);

  TreeDemoSite.App.renderJSONText('#user-unformatted-settings', self.userSettings, false);
  TreeDemoSite.App.renderJSONText('#user-formatted-settings', self.userSettings, true);
  TreeDemoSite.App.renderJSONText('#compiled-formatted-settings', mergedSettings, true);
};

// Builds settings and refreshes tree, redrawing on default root tree element
// Reset content of the root tree element before redrawing
TreeDemoSite.App.refreshSettingsAndTree = function() {
  'use strict';
  var self = this;

  //Refresh Settings
  if ($('input:radio[name="settings-source"]:checked').val() === 'user') {
    self.refreshUserSettings();
    self.addClassesToSettingsObject();
  } else {
    self.userSettings = '';
  }

  self.refreshSettingsPanels();

  // Refresh Tree
  var newTreeContainerId = $.trim($('#option-tree-container-id').val());
  self.currentContainerId  = newTreeContainerId || '#tree-container';

  self.tree = new CSSTree(self.userSettings);
  self.tree.refreshTreeLayout();
};

// Parse all settings variables from form inputs to userSettings
TreeDemoSite.App.refreshUserSettings = function() {
  'use strict';
  var self = this;

  self.userSettings = self.userSettings || {};

  // Define the tree container ID and padding
  if ($.trim($('#option-tree-container-id').val()) !== '') {
    self.userSettings.treeContainerId = $.trim($('#option-tree-container-id').val());
  }
  if ($.trim($('#option-tree-container-padding').val()) !== '') {
    self.userSettings.treeContainerPadding = parseInt($.trim($('#option-tree-container-padding').val()), 0);
  }

  // Define the json property name of the data nodes and child nodes
  if ($.trim($('#option-node-child-name').val()) !== '') {
    self.userSettings.nodeChildName = $.trim($('#option-node-child-name').val());
  }
  if ($.trim($('#option-node-data-name').val()) !== '') {
    self.userSettings.nodeDataName = $.trim($('#option-node-data-name').val());
  }

  // Translate the tree orientation from text to angle in degrees
  if ($('input:radio[name="tree-orientation"]:checked').val()) {
    self.userSettings.treeOrientation = $('input:radio[name="tree-orientation"]:checked').val();
    switch(self.userSettings.treeOrientation) {
    case 'down':
      self.userSettings.treeOrientation = 0;
      break;
    case 'right':
      self.userSettings.treeOrientation = 90;
      break;
    case 'up':
      self.userSettings.treeOrientation = 180;
      break;
    case 'left':
      self.userSettings.treeOrientation = 270;
      break;
    }
  }

  // Tree link properties
  if ($('input:radio[name="link-orientation"]:checked').val()) {
    self.userSettings.linkOrientation = $('input:radio[name="link-orientation"]:checked').val();
  }
  if ($('input:radio[name="option-link-strategy"]:checked').val()) {
    self.userSettings.linkType = $('input:radio[name="option-link-strategy"]:checked').val();
  }
  
  // Tree spacing properties
  if ($.trim($('#option-node-width').val()) !== '') {
    self.userSettings.nodeWidth = parseInt($.trim($('#option-node-width').val()), 0);
  }
  if ($.trim($('#option-node-height').val()) !== '' ) {
    self.userSettings.nodeHeight = parseInt($.trim($('#option-node-height').val()), 0);
  }
  if ( $.trim($('#option-node-depth-spacing').val()) !== '' ) {
    self.userSettings.depthSpacing = parseInt($.trim($('#option-node-depth-spacing').val()), 0);
  }
  if ( $.trim($('#option-node-width-spacing').val()) !== '' ) {
    self.userSettings.widthSpacing = parseInt($.trim($('#option-node-width-spacing').val()), 0);
  }

  // HTML Template / foreign object inputs
  if ($.trim($('#option-forobj-not-supported').val()) !== '') {
    self.userSettings.notSupportedMessage = $.trim($('#option-forobj-not-supported').val());
  }
  if ($('#node-html-template').val() !== '') {
    var baseFunction = $('#node-html-template').val();
    var augmentedFunction = 'new function() { return ' + baseFunction + '; }';
    self.userSettings.nodeHTMLTemplate = eval(augmentedFunction);
  }
  if ($('#node-data-input').val() !== '') {
    self.userSettings.nodeData = JSON.parse($('#node-data-input').val());
  }

  self.addClassesToSettingsObject();
};


// Builds an array of strings given the ID of an html list element
TreeDemoSite.App.buildArrayFromList = function(listId) {
  'use strict';

  var listItemsEl = document.getElementById(listId).getElementsByTagName('li');
  var outputList = [];
  for(var i = 0; i < listItemsEl.length; i++) {
    var listItemEl = listItemsEl[i];
    var itemInputEl = listItemEl.getElementsByTagName('input')[0];
    var listItemValue = $.trim(itemInputEl.value);
    if(listItemValue !== '') {
      outputList.push(listItemValue);
    }
  }
  if( outputList.length > 0) { 
    return outputList;
  } else {
    return null;
  }
};