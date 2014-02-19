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
define(["LightstreamerClient","./Constants","Executor","./Player"],
    function(LightstreamerClient,Constants,Executor,Player) {
  
  var protocolToUse = document.location.protocol != "file:" ? document.location.protocol : "http:";
  var simCount = 0;
  
  var MAX_3JS_POS = {
    x: Constants.MAX_SIZE["x"]*2,
    y: Constants.MAX_SIZE["y"]*2,
    z: Constants.ARM_REACH
  };
  
  var SHIFT_3JS_POS = {
     x: -Constants.MAX_SIZE["x"],
     y: -Constants.MAX_SIZE["y"],
     z: Constants.MAX_SIZE["z"] - Constants.ARM_REACH
  };
  
  var Pos = function(max,shift) {
    this.max = max;
    this.shift = shift;
    this.series = 0;
    this.direction = false;
    this.current = max/2;
  };
  Pos.prototype = {
    nextPos: function() {
      if (this.series <= 0) {
        this.series = rand(1000)+100;
        this.direction = rand(1) == 1;
      }
      
      this.series--;
      
      if (this.direction) {
        this.current += rand(5);
      } else {
        this.current -= rand(5);
      }
      
      if (this.current > this.max) {
        this.current = this.max;
        this.direction = !this.direction;
      } else if (this.current < 0) {
        this.current = 0;
        this.direction = !this.direction;
      }
      
      return this.current + this.shift;
      
    }  
  };
  
  
  function rand(v) {
    return Math.round(Math.random()*v);
  }
  
  function Simulator(game) {
    this.client = new LightstreamerClient(protocolToUse+"//localhost:8080",Constants.ADAPTER);
    this.client.connect();
    
    this.game = game;
    
    this.axis = {
        x: new Pos(MAX_3JS_POS["x"],SHIFT_3JS_POS["x"]),
        y: new Pos(MAX_3JS_POS["y"],SHIFT_3JS_POS["y"]),
        z: new Pos(MAX_3JS_POS["z"],SHIFT_3JS_POS["z"]),
    };
   
    this.player = new Player("Sim"+(simCount++),"",this.client,game,true);
    this.player.enterRoom(Constants.ROOM);
   
    
    Executor.addRepetitiveTask(this.event,50,this);
    
  }
  
  
  Simulator.prototype = {
      randomPos: function(axis) {
        return this.axis[axis].nextPos();
      },
      
      event: function() {
        if (this.game.isPlayerFlying(this.player.getId())) {
          return;
        }
        
        var move = rand(20);
        if (move == 5) {
          
          this.player.release(Constants.ROOM,rand(1000),rand(1000),-(rand(3000)+1000));

        } else {

          this.player.move(Constants.ROOM,this.randomPos("x"),this.randomPos("y"),this.randomPos("z"));
        }
        
        
      },
  };
  
  
  return Simulator;
});
