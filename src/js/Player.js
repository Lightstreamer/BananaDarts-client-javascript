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
define(["Inheritance","EventDispatcher","Subscription","./Constants","./ConsoleSubscriptionListener","./Utils"],
    function(Inheritance,EventDispatcher,Subscription,Constants,ConsoleSubscriptionListener,Utils) {

  function generateId() {
    return "u-"+Math.round(Math.random()*1000);
  }
  
  var Player = function(nick,status,client,game,notLocal) {
    this.initDispatcher();
    
    this.game = game;
    
    this.client = client;
    this.nick = nick;
    this.status = status;
    this.notLocal = notLocal || false;
    
    this.id = generateId(); 
    this.userSubscription = new Subscription("DISTINCT","user_"+this.id,["message","from"]); //USER_SUBSCRIPTION used only to signal presence
    this.userSubscription.setRequestedSnapshot("yes");
    this.userSubscription.addListener(this);
    this.client.subscribe(this.userSubscription);
    
    if (Constants.LOG_UPDATES_ON_CONSOLE) {
      this.userSubscription.addListener(new ConsoleSubscriptionListener("User"));
    }
    
    this.rooms = {};
    this.playing = false;
    
  };
  
  Player.prototype = {
    
      getId: function() {
        return this.id;
      },
      
      ready: function() {
        
        if (this.playing) {
          return;
        }
        this.playing = true;
        this.holding = false;

        this.dispatchEvent("onIdConfirmed",[this.id]);
        if (!this.notLocal) {
          this.game.setLocalPlayerKey(this.id);
        }
       
        //conf nick & status
        this.sendNick();
        this.sendStatus();
        
        //re-enter rooms
        for (var i in this.rooms) {
          this.enterRoomInternal(i);
        } 
      },
      
      reset: function() {
        /*if (!this.playing) {
          return;
        }*/
        this.playing = false;
      },
      
      retry: function() {
        this.id = generateId();
        this.client.unsubscribe(this.userSubscription);
        this.userSubscription.setItems(["user_"+this.id]);
        this.client.subscribe(this.userSubscription);
      },
      
      /**
       * @private
       */
      error: function(message) {
        this.dispatchEvent("onError",[message]);
      },
      
      /**
       * @private
       */
      sendRoomMessage: function(command,sequence,room) {
        if (!this.rooms[room]) {
          return;
        }
        this.sendMessage(command,sequence);
      },
      
      /**
       * @private
       */
      sendMessage: function(command,sequence) {
        if (!this.playing) {
          return;
        }
        this.client.sendMessage(command,sequence,0,this);
      },
      
      enterRoom: function(room) {
        if (this.rooms[room]){
          return;
        }
        
        this.enterRoomInternal(room);
        
        this.rooms[room] = true;
      },
      
      /**
       * @private
       */
      enterRoomInternal: function(room) {
        this.sendMessage("enter|"+room,"enterexit"+room);
      },
      
      exitRoom: function(room) {
        this.sendRoomMessage("leave|"+room,"enterexit"+room,room);
      },
      
      grab: function(room) {
        if (this.game.isPlayerFlying(this.id)) {
          return;
        }
        this.holding = true;
        
        this.sendRoomMessage("grab|"+room,"3D",room);
        if (!this.notLocal) {
          this.game.resetPlayer(this.id);
        }
      },
      
      release: function(room,sx,sy,sz) {
        if (this.game.isPlayerFlying(this.id) || sz >= 0) {
          return;
        }
        this.holding = false;
        
        sx = Utils.mmsToUnitms(sx)*Constants.SCALE;
        sy = Utils.mmsToUnitms(sy)*Constants.SCALE;
        sz = Utils.mmsToUnitms(sz)*Constants.SCALE;

        //convert from mm/s to unit/ms 
        if (Constants.CHEAT) {
          sx = 0;
          sy = 0;
        }
        this.sendRoomMessage("release|"+room+"|"+sx+"|"+sy+"|"+sz,"3D",room); //as sent in sequence the curreent pos on the server is the last pos sent from here
        
        if (!this.notLocal) {
          this.game.throwPlayer(this.id,sx,sy,sz);
        }
      },
      
      move: function(room,x,y,z) {
        if (this.game.isPlayerFlying(this.id)) {
          return;
        }
        if (!this.holding) {
          this.grab(room);
        }
        this.sendRoomMessage("move|"+room+"|"+x+"|"+y+"|"+z,"3D",room);
        
        if (!this.notLocal) {
          this.game.movePlayer(this.id,x,y,z); //update local player locally
        }
      },
      
      changeNick: function(newNick) {
        if (this.nick == newNick) {
          return;
        }
        this.nick = newNick;
        this.sendNick();
      },
      
      /**
       * @private
       */
      sendNick: function() {
        if (!this.nick) {
          return;
        }
        this.sendMessage("nick|"+this.nick,"nick");
      },
      
      changeStatus: function(newStatus) {
        if (this.status == newStatus) {
          return;
        }
        this.status = newStatus;
        this.sendStatus();
      },
  
      /**
       * @private
       */
      sendStatus: function() {
        if (!this.status) {
          return;
        }
        this.sendMessage("status|"+this.status,"status");
      },
      
      //subscription listener-->
      
      onSubscription: function() {
        this.ready();
      },
      
      onUnsubscription: function() {
        this.reset();
      },
      
      onSubscriptionError: function(code,mex) {
        this.retry();
      },
      
      //message listener-->
     
      // onDiscarded onAbort onProcessed -> do nothing
      
      onDeny: function(originalMessage,code,message) {
        //Event handler that is called by Lightstreamer when the related message has been processed by the Server but the expected processing outcome could not be achieved for any reason.
        this.error(message);
      },
      
      onError: function() {
        this.error("Unexpected error");
      }
  };
  
  Inheritance(Player,EventDispatcher,true,true);
  return Player;
  
});