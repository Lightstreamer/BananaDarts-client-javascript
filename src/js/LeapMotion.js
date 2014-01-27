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
  
  var FINGERS_OF_FIST = 2;
  
  var POSITIONS = {
      x: 0,
      y: 1,
      z: 2
  };
  
  function checkHandValidPositionOnAxis(frame,leapPos,axis) {
    if (Constants.LEAP_PADDING[axis] == 0) {
      return true;
    }
    var pos = POSITIONS[axis];
    var abs = frame.interactionBox.size[pos]-Constants.LEAP_PADDING[axis];
    return Math.abs(leapPos[pos]) <= abs;
  }
  
  function checkHandValidPosition(frame,leapPos) {
    return checkHandValidPositionOnAxis(frame,leapPos,"x") &&
    checkHandValidPositionOnAxis(frame,leapPos,"y") &&
    checkHandValidPositionOnAxis(frame,leapPos,"z");
  }
  
  var MAX_3JS_POS = {
    x: Constants.MAX_SIZE["x"]*2,
    y: Constants.MAX_SIZE["y"]*2,
    z: Constants.ARM_REACH
  };
  
  function convert(leapPos,axis) {
    var pos = POSITIONS[axis];

    //leapPos is normalized (0 >= leapPos[pos] <= 1)
    //first we conver leapPos[pos] to the full range
    var val = MAX_3JS_POS[axis]*leapPos[pos];
  
    //then we shift accordingly
    if (axis == "z") {
      val = Constants.MAX_SIZE["z"] - Constants.ARM_REACH + val;
    } else {
      val -= Constants.MAX_SIZE[axis];
    }
    
    return val;
  }
  
  
  var LeapMotion = function() {
    this.initDispatcher();
    this.fist = false;
    
    this.handInUse == null;
    
    this.controller = new Leap.Controller();
    this.registerCallbacks();
    this.controller.connect();
    
    this.ready = false;
  };
  
  LeapMotion.prototype = {
      
      /**
       * @private
       */
      registerCallbacks: function() {
        var that = this;
        this.controller.on('frame', function(frame) { 
          that.onFrame(frame);
        });
        
        this.controller.on('ready', function() { 
          that.setReady(true);
        });
        this.controller.on('deviceConnected', function() { 
          that.setReady(true);
        });
        this.controller.on('deviceDisconnected', function() { 
          that.setReady(false);
        });
      },
      
      /**
       * @private
       */
      setReady: function(ready) {
        if (ready == this.ready) {
          return;
        }
        this.ready = ready;
        this.dispatchEvent("onReady",[ready]);
        
      },
      
      isReady: function() {
        return this.ready;
      },
      
      /**
       * @private
       */
      onFrame: function(frame) {
        var hand = this.getHandInUse(frame);
        if (!hand) {
          this.setFist(null,false); //remove the hand == remove the fist
          return;
        }
        this.setFist(hand,hand.fingers.length <= FINGERS_OF_FIST);
       
        var normPos = frame.interactionBox.normalizePoint(hand.palmPosition,true);
        
        var pos = [
                   convert(normPos,"x"),
                   convert(normPos,"y"),
                   convert(normPos,"z")
                   ];
        
       
        this.dispatchEvent(this.isFist() ? "onFistMove" : "onPalmMove",pos);

      },
      
      /**
       * @private
       */
      getHandInUse: function(frame) {
        var hands = frame.hands;
        
        var centerHand = null; 
        
        for (var i=0; i<hands.length; i++) {
          if (!checkHandValidPosition(frame,hands[i].palmPosition)) {
            continue;
          }
          if (hands[i].id == this.handInUse) {
            return hands[i];
            
          } else if (!centerHand) {
            centerHand = hands[i];
              
          } else if (Math.abs(hands[i].palmPosition[POSITIONS["x"]]) < Math.abs(centerHand.palmPosition[POSITIONS["x"]])) {
            centerHand = hands[i];
          }

        }
        this.handInUse = centerHand ? centerHand.id : null;
        return centerHand;
        
      },
    
      isFist: function() {
        return this.fist;
      },
      
      setFist: function(hand,isFist) {
        if (this.fist == isFist) {
          return;
        }

        var speeds = [];
        if (hand) {
          for (var i=0; i<3; i++) {
            speeds[i] = Math.round(hand.palmVelocity[i]||0);
          }
        } else {
          speeds = [0,0,0];
        }
        this.dispatchEvent(isFist ? "onFist" : "onFistReleased",speeds);
        this.fist = isFist;
      }
      
      
      
      
  };
  
  
  Inheritance(LeapMotion,EventDispatcher,true,true);
  return new LeapMotion(); //singleton
});

