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

// Helper function to add the custom tree classes to the settings 
//    object if the tree settings classes are supplied.
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
    self.userSettings.nodeBkndClasses = classList.tempNodeBkndClasses;
  }
  if (classList.tempNodeHTMLClasses !== null) {
    self.userSettings.nodeHTMLClasses = classList.tempNodeHTMLClasses;
  }
  if (classList.tempLinkClasses !== null) {
    self.userSettings.linkClasses = classList.tempLinkClasses;
  }
  if (classList.tempArrowClasses !== null) {
    self.userSettings.arrowClasses = classList.tempArrowClasses;
  }
  return self;
};

// Define a function to refresh a given panel element with specific settings data.
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

// Refreshes displays with formatted/unformatted user settings in module panels
//    Show default, user, and compiled settings in formatted JSON.
TreeDemoSite.App.refreshSettingsPanels = function() {
  'use strict';
  var self = this;

  TreeDemoSite.App.renderJSONText('#user-unformatted-settings', self.userSettings, false);
  TreeDemoSite.App.renderJSONText('#user-formatted-settings', self.userSettings, true);
  TreeDemoSite.App.renderJSONText('#compiled-formatted-settings', self.mergedSettings, true);
  TreeDemoSite.App.renderJSONText('#default-formatted-settings', CSSTree.defaultSettings, true);
};

// Builds settings and refreshes tree, redrawing SVG representation on the
//    default root tree element. First resets root el HTML before redrawing.
TreeDemoSite.App.refreshSettingsAndTree = function() {
  'use strict';
  var self = this;

  //Refresh Settings
  if ($('input:radio[name="settings-source"]:checked').val() === 'user') {
    self.refreshUserSettings();
  } else {
    self.userSettings = {};
  }
  self.refreshMergedSettings();

  self.refreshSettingsPanels();

  // Refresh Tree
  var newTreeContainerId = $.trim($('#option-tree-container-id').val());
  self.currentContainerId  = newTreeContainerId || '#tree-container';

  self.tree = new CSSTree(self.userSettings);
  self.tree.refreshTreeLayout();
};

// Rebuild merged settings, in this case only for display purposes in panels.
TreeDemoSite.App.refreshMergedSettings = function() {
  'use strict';
  var self = this;
  console.log('getting defaults from app.js', CSSTree.defaultSettings);
  self.mergedSettings = $.extend({}, CSSTree.defaultSettings, self.userSettings);
};

// Parse all settings variables from form inputs to userSettings.
TreeDemoSite.App.refreshUserSettings = function() {
  'use strict';
  var self = this;
  self.userSettings = {};

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

// Builds an array of strings given the ID of an html list element.
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