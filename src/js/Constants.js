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
define(function() {
  
  var scale = 0.20;
  
  var SIZE_X = 1333;
  var SIZE_Y = 666;
  var SIZE_Z = 1053;
  
  var CENTER_FROM_FLOOR = 769;
  
  return {
    OWN: "own",
    OTHER: "other",
 
    ADAPTER: "DART",
    LOG_UPDATES_ON_CONSOLE: false,
    DEBUG_LEAP: false,
    CHEAT: true,
    
    SCALE: scale,
       
    ARM_REACH: 142*scale,
    
    MAX_SIZE: {
     x:SIZE_X/2*scale,
     y:SIZE_Y/2*scale,
     z:SIZE_Z/2*scale
    },
    
    CENTER_Y: (CENTER_FROM_FLOOR-SIZE_X/2)*scale,
    
    LEAP_PADDING: {
      x: 10,
      y: 0,
      z: 10
    },
    
    FRAME_INTERVAL: 50,
    BASE_RATE: 10,
    LOCAL_PLAYER_RT: false,
    
    DEFAULT_NICK: "Anonymous",
    ROOM: "dart"
  };
  
});