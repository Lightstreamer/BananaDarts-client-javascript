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
  
  return {
    OWN: "own",
    OTHER: "other",
 
    ADAPTER: "DART",
    LOG_UPDATES_ON_CONSOLE: false,
    DEBUG_LEAP: true,
    
    SCALE: scale,
       
    ARM_REACH: 142*scale,
    
    MAX_SIZE: {
     x:1333/2*scale,
     y:666/2*scale,
     z:1053/2*scale
    },
    
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