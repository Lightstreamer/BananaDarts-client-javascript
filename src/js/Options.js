define(["./Constants"],function(Constants) {

  var CAN_SAVE = typeof localStorage != "undefined" && localStorage !== null && localStorage.getItem && localStorage.setItem;
  
  var optionsList = [
                     "nick",
                     "autoCamera",
                     "showNicks"
                     ];
  
  var Options = function() {
    
    this.nick = "Player"+Math.round(Math.random()*10000);
    this.autoCamera = true;
    this.showNicks = true;
    this.audio = typeof Audio != "undefined";
    this.load();
    
  };
  
  Options.prototype = {
      
      load: function() {
        if (CAN_SAVE) {
          for (var i=0; i<optionsList.length; i++) {
            var val = localStorage.getItem(Constants.STORAGE_NAME+optionsList[i]);
            if (!val) {
              continue;
            }
            if (val == "true") {
              val = true;
            } else if (val == "false") {
              val = false;
            } 
            
            this[optionsList[i]] = val;
            
          }
        }
      },
      
      setNick: function(nick) {
        this.nick = nick;
        this.save("nick");
      },
      getNick: function() {
        return this.nick;
      },
      
      setAutoCamera: function(autoCamera) {
        this.autoCamera = autoCamera;
        this.save("autoCamera");
      },
      getAutoCamera: function() {
        return this.autoCamera;
      },
      toggleAutoCamera: function() {
        this.setAutoCamera(!this.autoCamera);
      },
      
      setShowNicks: function(showNicks) {
        this.showNicks = showNicks;
        this.save("showNicks");
      },
      getShowNicks: function() {
        return this.showNicks;
      },
      toggleShowNicks: function() {
        this.setShowNicks(!this.showNicks);
      },
      
      setAudio: function(audio) {
        this.audio = audio;
        this.save("audio");
      },
      getAudio: function() {
        return this.audio;
      },
      toggleAudio: function() {
        this.setAudio(!this.audio);
      },
      
      save: function(what) {
        if (CAN_SAVE) {
          localStorage.setItem(Constants.STORAGE_NAME+what,this[what]);
        }
      }
      
  };
  
  return Options;
  
});