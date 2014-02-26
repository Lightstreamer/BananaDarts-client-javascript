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


require(["js/LeapMotion"],
    function(LeapMotion) {
  
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
  });
});

$(document).ready(function(){
  var open = true;
  
  var x = new Image();
  x.src = "images/down.png";//preload
  x = null;
  
  var hideTop =  -$("#tools_stuff").height()+2; //show 2px
 
  
  $("#tools_button").click(function() {
    if (open) {
      $("#tools").css("top",hideTop);
      $(this).attr("src","images/down.png");
    } else {
      $("#tools").css("top",0);
      $(this).attr("src","images/up.png");
    }
    open = !open;
  });
  
  
  setTimeout(function() {
    if (open) {
      $("#tools_button").click();
    }
  },2000);
  
});
  

require(["js/Field","js/Constants","js/Dart","js/Game","js/lsClient","js/GameLoop","js/Player","js/LeapMotion","js/Scoreboard","js/Simulator"],
    function(Field,Constants,Dart,Game,lsClient,GameLoop,Player,LeapMotion,Scoreboard,Simulator) {
  
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
  $("#autoCamera").change(function() {
    game.enableCameraHandling($(this).prop("checked"));
  });
  game.enableCameraHandling($("#autoCamera").prop("checked")); 
  
  var gameLoop = new GameLoop(game,field);
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
    onFistMove: function(x,y,z,sx,sy,sz) {
      if (z <= Constants.MAX_SIZE.z-Constants.ARM_REACH+Constants.GO_LINE) {
        player.release(Constants.ROOM,sx,sy,sz);
      } else {
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
  
  
  for (var i=0; i < Constants.SIMULATED_PLAYERS; i++) {
    new Simulator(game);
  }
  
});

  