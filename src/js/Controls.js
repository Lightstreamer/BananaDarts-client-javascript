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
define(["./LeapMotion","./Mouse","./Constants","./Status"], 
    function(LeapMotion,Mouse,Constants,Status) {

  var fixedZ = Constants.MAX_SIZE.z-Constants.ARM_REACH/2+Constants.GO_LINE;
  
  var Controls = function(player) {
    this.player = player;
    
    this.leapEnabled = false;
    LeapMotion.addListener(this);
    this.leapReady = LeapMotion.isReady();
    
    
    this.mouseEnabled = false;
    Mouse.addListener(this);
    
    this.disableKeys = {};
    this.allDisabled = 0;
    
    this.mouseClickTime = null;
    this.mouseInArea = false;
    
  };
  
  Controls.prototype = {
      
      disable: function(key) {
        if (!this.disableKeys[key]) {
          this.disableKeys[key] = true;
          this.allDisabled++;
        }
        this.cursorHandling();
      },
      
      enable: function(key) {
        if (this.disableKeys[key]) {
          delete(this.disableKeys[key]);
          this.allDisabled--;
        }
        this.cursorHandling();
      },
      
      //MOUSE
      
      enableMouse: function(enable) {
        if (this.mouseEnabled == enable) {
          return;
        }
        this.mouseEnabled = enable;
        this.resetMouse();
        this.cursorHandling();
      },
      
      //Mouse listener
      
      onMouseChange: function(holdingClick,posX,posY) {
        if (!this.mouseEnabled || this.allDisabled > 0) {
          return;
        }
        
        if (holdingClick) {
          if (!this.mouseClickTime) {
            //just clicked
            this.mouseClickTime = new Date().getTime();
            this.mouseClickX = posX;
            this.mouseClickY = posY;
          } //else is charging
          
        } else if (!this.mouseClickTime) {
          //just chillin'
          this.player.move(Constants.ROOM,posX,posY,fixedZ);
        } else {
          //throw it!
          var chargingTime =  new Date().getTime() - this.mouseClickTime;
          var deltaX = posX - this.mouseClickX;
          var deltaY = posY - this.mouseClickY;
          
          this.player.release(Constants.ROOM,deltaX*Constants.SPEED_MULTIPLIERS["x"],chargingTime*Constants.SPEED_MULTIPLIERS["y"],-deltaY*Constants.SPEED_MULTIPLIERS["z"]);
          
          //reset
          this.resetMouse();
        }
        
        
      },
      
      onMouseAreaEnter: function(enter) {
        this.mouseInArea = enter;
        this.cursorHandling();
      },
      
     cursorHandling: function() {
        if (this.mouseEnabled && this.allDisabled == 0 && this.mouseInArea) {
          $("body").css("cursor","none");
        } else  {
          $("body").css("cursor","");
          
        }
      },
      
      resetMouse: function() {
        this.mouseClickTime = null;
        this.mouseClickX = null;
        this.mouseClickY = null;
      },
      
      
      
      
      //LEAP MOTION
      
      enableLeap: function(enable) {
        this.leapEnabled = enable;
        Status.changeStatus(this.leapReady || !enable ? Status.OK : Status.WAIT_LEAP);
      },
      
      //LeapMotion listener
      
      onReady: function(ready) {
        this.leapReady = ready;
        if (this.leapEnabled) {
          Status.changeStatus(ready ? Status.OK : Status.WAIT_LEAP);
        }
      },
      
      onFistMove: function(x,y,z,sx,sy,sz) {
        if (!this.leapEnabled || this.allDisabled > 0) {
          return;
        }
        if (z <= Constants.MAX_SIZE.z-Constants.ARM_REACH+Constants.GO_LINE) {
          this.player.release(Constants.ROOM,sx,sy,sz);
        } else {
          this.player.move(Constants.ROOM,x,y,z);
        }
      }
      
      
  };
  
  
  
  return Controls;
  
  
  
  
});
