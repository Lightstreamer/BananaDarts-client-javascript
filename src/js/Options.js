define(["./Constants"],function(Constants) {

  var CAN_SAVE = typeof localStorage != "undefined" && localStorage !== null && localStorage.getItem && localStorage.setItem;
  
  var Options = function() {
    
    this.nick = "Player"+Math.round(Math.random()*10000);
    this.autoCamera = true;
    this.showNicks = true;
    this.load();
    
  };
  
  Options.prototype = {
      
      load: function() {
        if (CAN_SAVE) {
          var settings = localStorage.getItem(Constants.STORAGE_NAME);
          if (!settings) {
            return;
          }
          settingsObj = $.parseJSON(settings);
          
          this.nick = settingsObj.nick;
          this.autoCamera = settingsObj.autoCamera;
          this.showNicks = settingsObj.showNicks;
          
        }
      },
      
      setNick: function(nick) {
        this.nick = nick;
        this.save();
      },
      getNick: function() {
        return this.nick;
      },
      
      setAutoCamera: function(autoCamera) {
        this.autoCamera = autoCamera;
        this.save();
      },
      getAutoCamera: function() {
        return this.autoCamera;
      },
      
      setShowNicks: function(showNicks) {
        this.showNicks = showNicks;
        this.save();
      },
      getShowNicks: function() {
        return this.showNicks;
      },
      
      save: function() {
        if (CAN_SAVE) {
          var objString = '{"nick": "' +this.nick+ '", "autoCamera":' +this.autoCamera+ ', "showNicks":' +this.showNicks+ '}';
          localStorage.setItem(Constants.STORAGE_NAME,objString);
        }
      }
      
  };
  
  return Options;
  
});