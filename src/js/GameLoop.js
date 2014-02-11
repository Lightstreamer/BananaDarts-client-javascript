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
define([],function() {
  
  function run(who) {
    return function() {
      who.calculate();
    };
  }
  
  var GameLoop = function(game,field) {
    this.thread = null;
    this.game = game;
    this.field = field;
  };
  
  GameLoop.prototype = {
     start: function() {
       if (this.thread) {
         return;
       }

       this.thread = true;
       requestAnimationFrame(run(this));
       
     },
     stop: function() {
       if (!this.thread) {
         return;
       }

       this.thread = false;
     },
     calculate: function() {
       if (!this.thread) {
         return;
       }
       this.game.forEachPlayer(function(player) {
         if (player.isFlying()) {
           player.calculate();
         }
       });
       this.field.render();
       requestAnimationFrame(run(this));
     }
  };
  
  
  return GameLoop;  
  
  
});
