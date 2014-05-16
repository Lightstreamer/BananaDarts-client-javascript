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
define(["Inheritance","EventDispatcher","./Constants"],
    function(Inheritance,EventDispatcher,Constants) {
  
  
  var Mouse = function() {
    this.initDispatcher();
    
    
    this.setupListeners();
    
    
  };
  
  Mouse.prototype = {
    setupListeners: function() {
      var that = this;
      $(document).mousemove(function(event ) {

      }).mousedown(function(event) {

      }).mouseup(function(event) {

      });
      
    }
      
      
      //TODO fire this onMouseChange: function(holdingClick,posX,posY)
  };
  
  Inheritance(Mouse,EventDispatcher,true,true);
  return new Mouse(); //singleton

});