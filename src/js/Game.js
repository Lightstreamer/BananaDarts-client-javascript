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
define(["./Constants","./Dart","./ConsoleSubscriptionListener","Subscription"],
    function(Constants,Dart,ConsoleSubscriptionListener,Subscription) {
  
  var BRIDGE_CALL = {
    nick: "setNick",
    posX: "setPosX",
    posY: "setPosY",
    posZ: "setPosZ",
    dVx: "setDVX",
    dVy: "setDVY",
    dVz: "setDVZ",
    locked: "setServerLocked",
    timestamp: "setTimestamp"
  };
  
  var POS_RELATED = {
      timestamp: true,  
      posX: true,
      posY: true,
      posZ: true
  };
  
  var LOCKABLE_PROPS = {
      posX: true,
      posY: true,
      posZ: true
  };
  
  var CONVERT = {
      posX: true,
      posY: true,
      posZ: true,
  };
  
  var Game = function(client,room,field) {
    this.players = {};
    this.field = field;
    
    this.localPlayerKey = null;
    this.localPlayerIsLocked = false;
    
    this.extraInfo = null;
    this.showExtraInfo(true);
    
    
    var roomSubscription = new Subscription("COMMAND","roomchatlist_"+room,["command","key"]);  //ROOMCHATLIST_SUBSCRIPTION contains user statuses and user nicks
    roomSubscription.setRequestedSnapshot("yes");
    //roomSubscription.setRequestedMaxFrequency("unfiltered");
    roomSubscription.setCommandSecondLevelFields(["nick","status",
                                                  "dVx","dVy","dVz",
                                                  "posX","posY","posZ","timestamp",
                                                  "locked"]);
    roomSubscription.addListener(this);
    
    var posSubscription = new Subscription("COMMAND","roompos_"+room,["command","key", 
                                                                        "posX","posY","posZ","timestamp"]); //ROOMPOSITION_SUBSCRIPTION contains list of users and object positions
    posSubscription.setRequestedSnapshot("yes");
    posSubscription.setRequestedMaxFrequency(0.5);
    posSubscription.addListener(this);
    
    if (Constants.LOG_UPDATES_ON_CONSOLE) {
      roomSubscription.addListener(new ConsoleSubscriptionListener("User Status"));
      posSubscription.addListener(new ConsoleSubscriptionListener("Sync Positions"));
    }
    
    client.subscribe(roomSubscription);
    client.subscribe(posSubscription);
    
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
      
      setLocalPlayerKey: function(key) {
        if (this.localPlayerKey && this.players[this.localPlayerKey]) {
          this.players[this.localPlayerKey].changeType(Constants.OTHER);
        }
        this.localPlayerKey = key;
        if (this.players[key]) {
          this.players[key].changeType(Constants.OWN);
        }
      },
      
      isLocalPlayerServerLocked: function() {
        if (this.localPlayerKey && this.players[this.localPlayerKey]) {
          return this.players[this.localPlayerKey].isServerLocked();
        }
        return true;
      },
      
      onItemUpdate: function(itemUpdate) {
        
        var key = itemUpdate.getValue("key");
        var command = itemUpdate.getValue("command");
      
        if (command == "DELETE") {
          this.removePlayer(key);
          return;
        } 
        
        if (command == "ADD") {
          this.addPlayer(key);
        }

        this.updatePlayer(key,itemUpdate);
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
        
        var locked = this.localPlayerIsLocked && key == this.localPlayerKey;
        
        var ignorePositions = player.hasNewerPosition(itemUpdate.getValue("timestamp"));

        itemUpdate.forEachChangedField(function(name,pos,val) {
          if (locked && LOCKABLE_PROPS[name]) {
            return;
          }
          
          var tc = BRIDGE_CALL[name];
          if (val !== null && tc && (!ignorePositions || !POS_RELATED[name])) {
            if (CONVERT[name]) {
              val = getMyDouble(fromBase64(val));
            }
            player[tc](val);
          }
        });
      },
      moveLocalPlayer: function(x,y,z) {
        if (this.localPlayerKey) {
          this.movePlayer(this.localPlayerKey,x,y,z);
        } 
      },
      movePlayer: function(id,x,y,z) {
        if (this.players[id]) {
          this.players[id].setPosX(x);
          this.players[id].setPosY(y);
          this.players[id].setPosZ(z);
        }
      },
      lockLocalPlayer: function(locked) {
        this.localPlayerIsLocked = locked;
      }
      
  };
  
  return Game;
});