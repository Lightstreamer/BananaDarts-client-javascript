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
define(["LightstreamerClient","./Constants","Executor","./Player","./lsClient"],
    function(LightstreamerClient,Constants,Executor,Player,lsClient) {
  
  var simCount = 0;
  
  var MESSAGES = ["Hi!","Hello","I'm a simulator","\\m/","Lightstreamer!","Wow! So Dart, Much Throw, Very Multiplayer"];
  
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
    this.real = this.current + this.shift;
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
      
      this.real = this.current + this.shift;
      
      return this.real;
      
    }  
  };
  
  
  function rand(v) {
    return Math.round(Math.random()*v);
  }
  
  function Simulator(game,isChampion) {
    this.client = new LightstreamerClient(lsClient.connectionDetails.getServerAddress(),Constants.ADAPTER);
    this.client.connect();
    
    this.game = game;
    this.wait = 20;
    
    this.axis = {
        x: new Pos(MAX_3JS_POS["x"],SHIFT_3JS_POS["x"]),
        y: new Pos(MAX_3JS_POS["y"],SHIFT_3JS_POS["y"]),
        z: new Pos(MAX_3JS_POS["z"],SHIFT_3JS_POS["z"])
    };
   
    this.player = new Player("Sim"+(simCount++),this.client,game,true);
    this.player.enterRoom(Constants.ROOM);
   
    this.isChampion = isChampion;
    
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
        
        if (this.wait > 0) {
          this.wait--;
        } else {
          var move = rand(40);
          if (move == 5) {
            if (this.isChampion) {
              this.player.release(Constants.ROOM,0,0,-2900);
            } else {
              var mulX = this.axis.x.real > 0 ? -1 : 1;
              this.player.release(Constants.ROOM,rand(1500)*mulX,rand(1000),-(rand(3000)+1000));
            }
            
            this.wait = 50;
          } else if (move == 33) {
            this.player.sendChatMessage(Constants.ROOM,MESSAGES[rand(MESSAGES.length-1)]);
          
          } else {
            if (this.isChampion) {
              this.player.move(Constants.ROOM,0,Constants.MAX_SIZE.y/2,Constants.MAX_SIZE.z);
            } else {
              this.player.move(Constants.ROOM,this.randomPos("x"),this.randomPos("y"),this.randomPos("z"));
            }
              
          }
        }
        
        
      }
  };
  
  
  return Simulator;
});
