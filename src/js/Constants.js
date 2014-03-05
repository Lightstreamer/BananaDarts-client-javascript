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
define(["./Utils"],function(Utils) {
  
  var dartSize = 96;
  
  var SIZE_X = Utils.cmToUnit(500);
  var SIZE_Y = Utils.cmToUnit(300);
  var SIZE_Z = Utils.cmToUnit(236.855);
  
  var CENTER_FROM_FLOOR = Utils.cmToUnit(172.2);
  
  var NO_GRAVITY = 0;
  var EARTH_GRAVITY = 9.82; //m/s^2
  var MOON_GRAVITY =  1.6249; //m/s^2
  var ACCELERATION_UNIT_MS_SQUARE = Utils.cmToUnit(MOON_GRAVITY/10000); //(9.81/1000000)*100 cm/ms^2;
  
  return {
    OWN: "own",
    OTHER: "other",
 
    ADAPTER: "DART",
    LOG_UPDATES_ON_CONSOLE: false,
    CHEAT: false,
    
    DART_ORIGINAL_SIZE: dartSize,
    
    ARM_REACH: Utils.cmToUnit(32),
    ARM_LENGTH: Utils.cmToUnit(70),
    TWENTY: Utils.cmToUnit(20),
    GO_LINE: 1,
    
    FLOOR_OVERFLOW: dartSize,
    
    
    BOARD_DIAMETER: 200,
    
    MAX_SIZE: {
     x:SIZE_X/2,
     y:SIZE_Y/2,
     z:SIZE_Z/2
    },
    
    CENTER_Y: (CENTER_FROM_FLOOR-SIZE_Y/2),
    INITIAL_CAMERA_POS_Y: (Utils.cmToUnit(170)-SIZE_Y/2),
    INITIAL_CAMERA_POS_Z: (Utils.cmToUnit(280)+SIZE_Z/2),
    
    LEAP_PADDING: {
      x: 10,
      y: 0,
      z: 4
    },

    ACCELERATION: ACCELERATION_UNIT_MS_SQUARE,
    HALF_ACCELERATION: ACCELERATION_UNIT_MS_SQUARE/2,
    
    SPEED_FACTOR: 2,
    USE_PEAK_SPEED: false,
    USE_LAST_SPEED: true,
    HISTORY_WEIGHT: 0.5,
    
    
    DEFAULT_NICK: "Anonymous",
    ROOM: "dart",
    
    SIMULATED_PLAYERS: 0
  };
  
});