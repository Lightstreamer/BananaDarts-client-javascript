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
  
  var FINGERS_OF_FIST = 1;
  
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
  
  function convert(frame,leapPos,axis) {
    var pos = POSITIONS[axis];

    //note each axis in the rendering goes from +MAX_SIZE to -MAX_SIZE
    
    //convert value from leap reeferences to field references (we're taking into account the full size, from -v to +v)
    //in case of the z axis we only admit the user to move the object in the positive section (so do not double the max_size)
    var converter = (frame.interactionBox.size[pos]-Constants.LEAP_PADDING[axis])/(Constants.MAX_SIZE[axis]*(axis == "z" ? 1 : 2)); 
    var converted = leapPos[pos]/converter;

    //halve the value because it is or +v or -v
    if (axis == "y") {
      //leap only has positive y while our field also has negative values, shift value accordingly
      val = (converted/2)-Constants.MAX_SIZE[axis];
    } else if (axis == "z") {
      //leap only both positive and negative z while we only admit positive in the z axis, shift value accordingly
      val = (converted+Constants.MAX_SIZE[axis])/2;
    } else {
      val = converted/2;
    }
    
    //put the correct sign on the converted value
    if (Math.abs(val) > Constants.MAX_SIZE[axis]) {
      if (val > 0) {
        val = Constants.MAX_SIZE[axis]-1;
      } else {
        val = -(Constants.MAX_SIZE[axis]-1);
      }
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
       
        var pos = [
                   convert(frame,hand.palmPosition,"x"),
                   convert(frame,hand.palmPosition,"y"),
                   convert(frame,hand.palmPosition,"z")
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

