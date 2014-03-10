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
      } else {
        $("#waiting_leap").show();
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
  var firsClick = false;
  
  var x = new Image();
  x.src = "images/down.png";//preload
  x = null;
  
  var hideTop =  -$("#tools_stuff").height()+15; //show 15px
  
  $("#tools_button").click(function() {
    firsClick = true;
    if (open) {
      $("#tools").css("top",hideTop);
      $(this).attr("src","images/down.png");
    } else {
      $("#tools").css("top",0);
      $(this).attr("src","images/up.png");
    }
    open = !open;
  });
  
  $("#theWorld").click(function() {
    if (open) {
      $("#tools_button").click();
    }
  });
  
  setTimeout(function() {
    if (!firsClick) {
      $("#tools_button").click();
    }
  },2000);
  
});
  

require(["Subscription","js/Field","js/Constants","js/Dart","js/Game","js/lsClient","js/Player","js/LeapMotion","js/Scoreboard","js/Simulator","js/ConsoleSubscriptionListener","js/RoomSubscription"],
    function(Subscription,Field,Constants,Dart,Game,lsClient,Player,LeapMotion,Scoreboard,Simulator,ConsoleSubscriptionListener,RoomSubscription) {
  
  var randomNick = "user-"+Math.round(Math.random()*10000);
  
  
  //setup game
  var field = new Field($("#theWorld")[0]);
  var game = new Game(field);
  var scoreboard = new Scoreboard(game,field,"scoreboardTemplate",["td"],$("#scoreboard"));
  var player = new Player(randomNick,"",lsClient,game);
  
  //setup subscription
  var roomSubscription = new RoomSubscription(Constants.ROOM);
  if (Constants.LOG_UPDATES_ON_CONSOLE) {
    roomSubscription.addListener(new ConsoleSubscriptionListener("Room Subscription "+Constants.ROOM));
  }
  roomSubscription.addListener(game);
  roomSubscription.addListener(scoreboard);
  lsClient.subscribe(roomSubscription);
  
  //bind to UI
  
  //setup camera controls
  $("#resetCamera").click(function(){
    field.resetCamera();
  });
  
  //setup camera auto on/off
  $("#autoCamera").change(function() {
    game.enableCameraHandling($(this).prop("checked"));
  });
  game.enableCameraHandling($("#autoCamera").prop("checked")); 
  
  //setup nicks on darts on/off
  $("#showNicks").change(function() {
    game.showExtraInfo($(this).prop("checked"));
  });
  game.showExtraInfo($("#showNicks").prop("checked"));
  
  //setup nick & status inputs
  $("#nick").val(randomNick).prop('disabled', false).keyup(function() {
    player.changeNick($(this).val());
  });
  $("#status").prop('disabled', false).keyup(function() {
    player.changeStatus($(this).val());
  });
  
  //bind leap motion and game
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
  
  //setup simulators
  var created = 0;
  var creator = setInterval(function() {
    if (created >= Constants.SIMULATED_PLAYERS) {
      clearInterval(creator);
      return;
    }
    created++;
    console.log("Create new simulator " + created);
    new Simulator(game);
  },100);
  
  
});

  