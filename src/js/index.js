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


require(["js/Constants","js/LeapMotion"],
    function(Constants,LeapMotion) {
  
  $(document).ready(function() {
    function showInstructions(show) {
      if (show) {
        $("#waiting_leap").hide();
        $("#leap_instructions").show();
      } else {
        $("#waiting_leap").show();
        $("#leap_instructions").hide();
      }
    }
    setTimeout(function() {
      showInstructions(LeapMotion.isReady());
    },1000);
    LeapMotion.addListener({
      onReady: function(ready) {
        showInstructions(ready);
      }
    });
    
    if (Constants.DEBUG_LEAP) {
      $("#debug").show();
      LeapMotion.addListener({
        onFist: function(sx,sy,sz) {
          $("#h").html("fist");
        },
        onFistReleased: function(sx,sy,sz) {
          $("#h").html("palm");
          $("#s").html(sx + " | " + sy + " | " + sz);
        },
        onFistMove: function(x,y,z) {
          $("#x").html(x);
          $("#y").html(y);
          $("#z").html(z);
        }
      });
    }
  });
});
  

require(["js/Field","js/Constants","js/Dart","js/Game","js/lsClient","js/GameLoop","js/Player","js/LeapMotion","js/Scoreboard"],
    function(Field,Constants,Dart,Game,lsClient,GameLoop,Player,LeapMotion,Scoreboard) {
  
  var field = new Field($("#theWorld")[0]);
  $("#resetCamera").click(function(){
    field.rotateCamera(0);
  });
  $("#goLeftCamera").click(function(){
    field.rotateCamera("left");
  });
  $("#goRightCamera").click(function(){
    field.rotateCamera("right");
  });
  
  
  var game = new Game(lsClient,Constants.ROOM,field);
  var gameLoop = new GameLoop(game,field,Constants.FRAME_INTERVAL,Constants.BASE_RATE);
  gameLoop.start();
  
  var scoreboard = new Scoreboard(lsClient,game,field);
  
  var player = new Player(Constants.DEFAULT_NICK,"",lsClient,game);
  
  $("#nick").val(Constants.DEFAULT_NICK).prop('disabled', false).keyup(function() {
    player.changeNick($(this).val());
  });
  $("#status").prop('disabled', false).keyup(function() {
    player.changeStatus($(this).val());
  });
  
  LeapMotion.addListener({
    onFist: function(sx,sy,sz) {
      player.grab(Constants.ROOM);
    },
    onFistReleased: function(sx,sy,sz) {
      player.release(Constants.ROOM,sx,sy,sz);
    },
    onFistMove: function(x,y,z) {
      if (LeapMotion.isFist()) {
        player.move(Constants.ROOM,x,y,z);
      }
    }
  });
  
  if (LeapMotion.isReady()) {
    player.enterRoom(Constants.ROOM);
  } else {
    LeapMotion.addListener({
      onReady: function(ready) {
        if (ready) {
          player.enterRoom(Constants.ROOM);
        } else {
          player.exitRoom(Constants.ROOM);
        }
      }
    });
  }
});

  