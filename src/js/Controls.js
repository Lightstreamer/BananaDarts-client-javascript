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
define(["./LeapMotion","./Mouse","./Constants"], function(LeapMotion,Mouse,Constants) {

  var fixedZ = Constants.MAX_SIZE.z-Constants.ARM_REACH/2+Constants.GO_LINE;
  
  var Controls = function(player) {
    this.player = player;
    
    this.leapEnabled = false;
    LeapMotion.addListener(this);
    
    this.mouseEnabled = false;
    Mouse.addListener(this);
    
    this.mouseClickTime = null;
    
    
    this.leapSwitch = leapSwitch;
    this.mouseSwitch = mouseSwitch;
    
    
  };
  
  Controls.prototype = {
      
      //MOUSE
      
      enableMouse: function(enable) {
        this.mouseEnabled = enable;
      },
      
      //Mouse listener
      
      onMouseChange: function(holdingClick,posX,posY) {
        if (!this.mouseEnabled) {
          return;
        }
        
        if (holdingClick) {
          if (!this.mouseClickTime) {
            //just clicked
          } //else is charging
          
        } else if (!this.mouseClickTime) {
          //just chillin'
          this.player.move(Constants.ROOM,x,y,fixedZ);
        } else {
          //throw it!
        }
        
        
      },
      
      
      
      
      //LEAP MOTION
      
      enableLeap: function(enable) {
        this.leapEnabled = enable;
      },
      
      //LeapMotion listener
      
      onReady: function(ready) {
        if (ready) {
          //TODO ?
        } else {
          //TODO ?
        }
      },
      
      onFistMove: function(x,y,z,sx,sy,sz) {
        if (!this.leapEnabled) {
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
