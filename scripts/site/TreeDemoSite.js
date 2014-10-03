function TreeDemoSite() {
  'use strict';
  var self = this;

  self.initialize = function() {

    // Declare state variables
    self.userSettings = {};
    self.mergedSettings = {};
    self.outputPanelsClosed = false;
    self.settingsPanelsClosed = false;

    // Initialize expand / collapse modules to an expanded state
    $(function () { $('.output-panel-body').collapse({
      toggle: false
    })});
    $(function () { $('.settings-panel-body').collapse({
      toggle: false
    })});

    // Initialize default settings to be used for all layout calculations (basically same as class prototype)
    self.refreshPanelText('#default-formatted-settings', new CSSTree().defaultSettings, true);

    TreeDemoSite.events.setupClickEvents();
  };

  // We can use the extend method to merge userSettings with defaultSettings:
  // But with the added first parameter of TRUE to signify a DEEP COPY:
  self.buildMergedSettings = function(userSettings) {
    self.mergedSettings = $.extend( true, new CSSTree().defaultSettings, userSettings );
    self.addClassArraysToMergedSettings(userSettings);
    return self.mergedSettings;
  };

  self.addClassArraysToMergedSettings = function(userSettings) {
    if (userSettings.nodeBkndClasses != null) {
      self.mergedSettings.nodeBkndClasses = userSettings.nodeBkndClasses;
    }
    if (userSettings.nodeHTMLClasses != null) {
    self.mergedSettings.nodeHTMLClasses = userSettings.nodeHTMLClasses;
    }
    if (userSettings.linkClasses != null) {
      self.mergedSettings.linkClasses = userSettings.linkClasses;
    }
    if (userSettings.arrowClasses != null) {
      self.mergedSettings.arrowClasses = userSettings.arrowClasses;
    }
  };

  self.buildUserSettings = function() {
    if($("input:radio[name='settings-source']:checked").val() === "user") {
      self.userSettings = self.buildUserSettings();
    }
    return self.userSettings;
  };

  // Define a function to refresh a given element with specific data
  self.refreshPanelText = function(el, data, formatted) {
    $(el).html('');

    // If the text should be formatted, define size of indentation
    if(formatted) {
      $(el).html(JSON.stringify(data, undefined, 2));
    } else {
      $(el).html(JSON.stringify(data));
    }
  };

  self.refreshSettingsPanels = function() {
    self.refreshPanelText('#user-unformatted-settings', self.userSettings, false);
    self.refreshPanelText('#user-formatted-settings', self.userSettings, true);
    self.refreshPanelText('#compiled-formatted-settings', self.mergedSettings, true);
  };

  // Builds settings and refreshes tree, redrawing on default root tree element
  // Reset content of the root tree element before redrawing
  self.buildAndRefreshTree = function() {
    self.buildAndRefreshSettings();

    if ($("input:radio[name='data-source']:checked").val() === "user" && $("#node-data-input").val() !== "") {
      self.userSettings.nodeData = $("#node-data-input").val();
    }

    var newTreeContainerId = $.trim($("#option-tree-container-id").val()); 
    self.currentContainerId  = newTreeContainerId || "#tree-container";

    $(self.currentContainerId).text('');
    $(self.currentContainerId).drawCSSTree(self.userSettings);
  };


  // Parse all settings variables from form inputs to userSettings
  self.buildUserSettings = function() {
    var self = this;

    self.userSettings = self.userSettings || {};

    // Define the tree container ID and padding
    if ($.trim($("#option-tree-container-id").val()) !== "") { 
      self.userSettings.treeContainerId = $.trim($("#option-tree-container-id").val()); 
    }
    if ($.trim($("#option-tree-container-padding").val()) !== "") { 
      self.userSettings.treeContainerPadding = $.trim($("#option-tree-container-padding").val()); 
    }

    // Define the json property name of the data nodes and child nodes
    if ($.trim($("#option-node-child-name").val()) !== "") { 
      self.userSettings.nodeChildName = $.trim($("#option-node-child-name").val()); 
    }
    if ($.trim($("#option-node-data-name").val()) !== "") { 
      self.userSettings.nodeDataName = $.trim($("#option-node-data-name").val()); 
    }

    // Translate the tree orientation from text to angle in degrees
    if ($("input:radio[name='tree-orientation']:checked").val()) { 
      self.userSettings.treeOrientation = $("input:radio[name='tree-orientation']:checked").val(); 
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
    if ($("input:radio[name='link-orientation']:checked").val()) { 
      self.userSettings.linkOrientation = $("input:radio[name='link-orientation']:checked").val(); 
    }
    if ($("input:radio[name='option-link-strategy']:checked").val()) { 
      self.userSettings.linkType = $("input:radio[name='option-link-strategy']:checked").val(); 
    }
    
    // Tree spacing properties
    if ($.trim($("#option-node-width").val()) !== "") {
      self.userSettings.nodeWidth = parseInt($.trim($("#option-node-width").val()));
    }
    if ($.trim($("#option-node-height").val()) !== "" ) {
      self.userSettings.nodeHeight = parseInt($.trim($("#option-node-height").val()));
    }
    if ( $.trim($("#option-node-depth-spacing").val()) !== "" ) {
      self.userSettings.depthSpacing = parseInt($.trim($("#option-node-depth-spacing").val()));
    }
    if ( $.trim($("#option-node-width-spacing").val()) !== "" ) {
      self.userSettings.widthSpacing = parseInt($.trim($("#option-node-width-spacing").val()));
    }

    // HTML Template / foreign object inputs
    if ($.trim($("#option-forobj-not-supported").val()) !== "") { 
      self.userSettings.notSupportedMessage = $.trim($("#option-forobj-not-supported").val()); 
    }
    if ($.trim($("#node-html-template").val()) !== "") { 
      self.userSettings.nodeHTMLTemplate = eval($("#node-html-template").value); 
    }

    // Build class lists from groups of list entries 
    var classSettings = {};
    classSettings.tempNodeBkndClasses = self.buildArrayFromList("option-node-background-classes");
    classSettings.tempNodeHTMLClasses = self.buildArrayFromList("option-node-html-classes");
    classSettings.tempLinkClasses = self.buildArrayFromList("option-link-body-classes");
    classSettings.tempArrowClasses = self.buildArrayFromList("option-link-arrow-classes");

    self.addClassArraysToMergedSettings(classSettings);

    return self.userSettings;
  };

  // Builds compiled settings to use and display in formatted output.
  // First build default settings
  // Then merge with user input overridden settings, 
  // Display formatted/unformatted output in grid
  //      for default, user, and merged settings
  // Settings don't need to be merged w default settings because
  //      prototype object has defaults, but this allows for easy 
  //      display of merged settings on the page.
  self.buildAndRefreshSettings = function() {
    var userSettings = self.buildUserSettings();
    self.buildMergedSettings(userSettings);
    self.refreshSettingsPanels();
  };

  // Builds an array of strings given the ID of an html list element
  self.buildArrayFromList = function(listId) {
    var listItemsEl = document.getElementById(listId).getElementsByTagName('li');
    var outputList = [];
    for(var i = 0; i < listItemsEl.length; i++) {
      var listItemEl = listItemsEl[i];
      var itemInputEl = listItemEl.getElementsByTagName('input')[0];
      var listItemValue = $.trim(itemInputEl.value);
      if(listItemValue !== "") {
        outputList.push(listItemValue);
      }
    }
    if( outputList.length > 0) { 
      return outputList;
    } else {
      return null;
    }
  };

  return self;
};