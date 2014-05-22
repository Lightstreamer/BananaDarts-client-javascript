/*
Copyright 2014 Weswit s.r.l.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
define(["./Constants"],function(Constants) {

  var CAN_SAVE = false;
  try {
    if (typeof localStorage != "undefined" && localStorage !== null && localStorage.getItem && localStorage.setItem) {
      CAN_SAVE = true;
    }
  } catch(e) {
    //may end in exception if localStorage exists but was disabled through browser options
  }
  
  var optionsList = [
                     "nick",
                     "autoCamera",
                     "showNicks",
                     "mouse",
                     "leap",
                     "instructionsOpen"
                     ];
  
  var Options = function() {
    
    this.nick = "Player"+Math.round(Math.random()*10000);
    this.autoCamera = true;
    this.showNicks = true;
    this.leap = false;
    this.mouse = true;
    this.audio = typeof Audio != "undefined";
    this.instructionsOpen = true;
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
      
      setLeap: function(enable) {
        this.leap = enable;
        this.save("leap");
      },
      getLeap: function() {
        return this.leap;
      },
      toggleLeap: function() {
        this.setLeap(!this.leap);
      },
      
      setMouse: function(mouse) {
        this.mouse = mouse;
        this.save("mouse");
      },
      getMouse: function() {
        return this.mouse;
      },
      toggleMouse: function() {
        this.setMouse(!this.mouse);
      },
      
      setInstructionsOpen: function(instructionsOpen) {
        this.instructionsOpen = instructionsOpen;
        this.save("instructionsOpen");
      },
      getInstructionsOpen: function() {
        return this.instructionsOpen;
      },
      
      
      save: function(what) {
        if (CAN_SAVE) {
          localStorage.setItem(Constants.STORAGE_NAME+what,this[what]);
        }
      }
      
  };
  
  return Options;
  
});