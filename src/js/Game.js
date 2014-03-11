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
define(["./Constants","./Utils","./Dart","./GameLoop"],
    function(Constants,Utils,Dart,GameLoop) {
    
  var Game = function(field) {
    this.players = {};
    this.field = field;
    
    this.localPlayerKey = null;
    
    this.extraInfo = null;
    this.showExtraInfo(true);
    
    this.cameraHandling = true;
    
    
    
    this.gameLoop = new GameLoop(this);
  };
  
  Game.prototype = {
      
      showExtraInfo: function(show) {
        var newV = this.field.isWebGLinUse() && show; 
        
        if (this.extraInfo != newV) {
          this.forEachPlayer(function(player) {
            player.showNick(newV);
          });
          this.extraInfo = newV;
        } 
      },
      
      enableCameraHandling: function(enabled) {
        this.cameraHandling = enabled;
      },
      
      setLocalPlayerKey: function(key) {
        if (this.localPlayerKey && this.players[this.localPlayerKey]) {
          this.players[this.localPlayerKey].changeType(Constants.OTHER);
        }
        this.localPlayerKey = key;
        if (this.players[key]) {
          this.players[key].changeType(Constants.OWN);
        }
      },
      
      onItemUpdate: function(itemUpdate) {
        
        var key = itemUpdate.getValue("key");
        var command = itemUpdate.getValue("command");
      
        if (command == "DELETE") {
          this.removePlayer(key);
          
        } else if (command == "ADD") {
          this.addPlayer(key);
        } else {
          this.updatePlayer(key,itemUpdate);
        }
      },
      
      onUnsubscription: function() {
        var that = this;
        this.forEachPlayer(function(player) {
          that.removePlayer(player.getKey());
        });
      },
      
      forEachPlayer: function(cb) {
        for (var i in this.players) {
          cb(this.players[i]);
        }
      },
      
      removePlayer: function(key) {
        if (!this.players[key]) {
          return;
        }
        var player = this.players[key];
        delete(this.players[key]);
        player.clear();
      },
      addPlayer: function(key) {
        if (this.players[key]) {
          return;
        }

        this.players[key] = new Dart(key,key == this.localPlayerKey ? Constants.OWN : Constants.OTHER,this.field,this.extraInfo);
      },
      getPlayer: function(key) {
        return this.players[key];
      },
      updatePlayer: function(key,itemUpdate) {
        var player = this.players[key];
        if (!player) {
          //TODO error?
          return;
        }
        
        if (itemUpdate.isValueChanged("nick")) {
          player.setNick(itemUpdate.getValue("nick"));
        }
        
        if (itemUpdate.isValueChanged("status")) {
          player.setStatus(itemUpdate.getValue("status"));
        }
        
     
        if (key == this.localPlayerKey) {
          //we do not need any information, we calculate everything locally
          return;
        }
        
        var x = Utils.toDouble(Utils.fromBase64(itemUpdate.getValue("posX")));
        var y = Utils.toDouble(Utils.fromBase64(itemUpdate.getValue("posY")));
        var z = Utils.toDouble(Utils.fromBase64(itemUpdate.getValue("posZ")));
        
        if (player.isPlanted() && z >= Constants.MAX_SIZE["z"] - Constants.ARM_REACH) {
          player.reset();
        }
        
        player.setPosition(x,y,z);
        
        if (itemUpdate.isValueChanged("dVz")) {
          var vZ = itemUpdate.getValue("dVz");
          if (vZ !== null) {
            player.setSpeed(Number(itemUpdate.getValue("dVx")),Number(itemUpdate.getValue("dVy")),Number(vZ));
            this.gameLoop.start();
          }
        }
      },
      
      resetPlayer: function(id) {
        if (this.players[id]) {
          this.players[id].reset();
        }
      },
      
      movePlayer: function(id,x,y,z) {
        if (this.players[id]) {
          this.players[id].setPosition(x,y,z);
        }
      },

      throwPlayer: function(id,sx,sy,sz,attachCamera) {
        if (this.players[id]) {
          if (attachCamera && this.cameraHandling) {
            this.players[id].attachCamera(true);
          }
          this.players[id].setSpeed(sx,sy,sz);
          this.gameLoop.start();
        }
      },
      
      isPlayerFlying: function(id) {
        if (this.players[id]) {
          return this.players[id].isFlying();
        }
        return false;
      },
      
      isPlayerPlanted: function(id) {
        if (this.players[id]) {
          return this.players[id].isPlanted();
        }
        return false;
      }
  };
  
  return Game;
});