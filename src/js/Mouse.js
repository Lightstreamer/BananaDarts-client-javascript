/*
Copyright (c) Lightstreamer Srl

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
define(["Inheritance","EventDispatcher","./Constants"],
    function(Inheritance,EventDispatcher,Constants) {
  
  var MAX = {
      x: Constants.ARM_LENGTH/2,
      y: Constants.ARM_LENGTH/2+Constants.TWENTY,
  };
  var MIN = {
      x: -Constants.ARM_LENGTH/2,
      y: -Constants.ARM_LENGTH/2+Constants.TWENTY,
  };
  
  var GAME_AREA_MAX = {};
  var GAME_AREA_MIN = {};
  function calcGameArea() {
    GAME_AREA_MIN.x = window.innerWidth/6;
    GAME_AREA_MIN.y = 0;
    
    GAME_AREA_MAX.x = window.innerWidth-GAME_AREA_MIN.x;
    GAME_AREA_MAX.y = window.innerHeight;
  }
  $(window).resize(function() {
    calcGameArea();
  });
  calcGameArea();
  
  
  var Mouse = function() {
    this.initDispatcher();
    
    this.isDown = false;
    this.norm = {
        x: 0,
        y: 0
    };
    this.prev = {
        x: 0,
        y: 0
    };
    
    this.setupListeners();
    
    
  };
  
  Mouse.prototype = {
    setupListeners: function() {
      var that = this;
      $("body").mousemove(function(event) {
        that.mousePosChange(event.pageX,event.pageY);
      }).mousedown(function(event) {
        that.mouseClickChange(true);
      }).mouseup(function(event) {
        that.mouseClickChange(false);
      }).mouseleave(function(event) {
        that.mouseClickChange(false);
      }).mouseenter(function(event) {
        that.mouseClickChange(false);
      });
      
    },
    
    mouseClickChange: function(isDown) {
      this.isDown = isDown;
      if (this.isOn) {
        this.dispatchEvent("onMouseChange",[this.isDown,this.norm["x"],this.norm["y"]]);
      }
    },
    
    mousePosChange: function(newX,newY) {
      var on = this.calcNormalizedPos("x",-newX);
      on &= this.calcNormalizedPos("y",newY);
      
      if (this.isOn != on) {
        this.isOn = on;
        this.dispatchEvent("onMouseAreaEnter",[this.isOn]);
      }
      
      if (this.isOn) {
        this.dispatchEvent("onMouseChange",[this.isDown,this.norm["x"],this.norm["y"]]);
      } 
      
    },
    
    
    
    calcNormalizedPos: function(axis, val) {
      
      var abs = Math.abs(val);
      if (abs < GAME_AREA_MIN[axis] || abs > GAME_AREA_MAX[axis]) {
        return false;
      } 
      
      
      var delta = this.prev[axis] - val;
      this.prev[axis] = val;
      this.norm[axis] += delta;
      
      if (this.norm[axis] > MAX[axis]) {
        this.norm[axis] = MAX[axis];
      } else if (this.norm[axis] < MIN[axis]) {
        this.norm[axis] = MIN[axis];
      }
      
      return true;
    }
   
  };
  
  Inheritance(Mouse,EventDispatcher,true,true);
  return new Mouse(); //singleton

});