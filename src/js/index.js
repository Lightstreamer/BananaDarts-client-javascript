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
    function hideLeapRequest(hide) {
      if (hide) {
        $("#waiting_leap").hide();
        $("#ready_leap").show();
      } else {
        $("#waiting_leap").show();
        $("#ready_leap").hide();
      }
    }
    setTimeout(function() {
      hideLeapRequest(LeapMotion.isReady());
    },1000);
    LeapMotion.addListener({
      onReady: function(ready) {
        hideLeapRequest(ready);
      }
    });
  });
});

require(["js/Constants","js/Field","js/Game",
         "js/Dart","js/Player","js/Options","js/LeapMotion",
         "js/lsClient","js/Simulator","js/ConsoleSubscriptionListener",
         "js/Scoreboard","js/RoomSubscription",
         "js/ChatBoard","js/ChatSubscription"],
    function(Constants,Field,Game,
        Dart,Player,Options,LeapMotion,
        lsClient,Simulator,ConsoleSubscriptionListener,
        Scoreboard,RoomSubscription,
        ChatBoard,ChatSubscription) {
  
  var options = new Options();
  
  var userNick = options.getNick();
  
  
  //setup game
  var field = new Field($("#theWorld")[0]);
  var game = new Game(field);
  var scoreboard = new Scoreboard(field,"scoreboardTemplate",["td"],$("#scoreboard"));
  var chat = new ChatBoard(field,"chatTemplate",["span"],$("#chat"));
  var player = new Player(userNick,lsClient,game);
  
  //setup chat subscription
  var chatSubscription = new ChatSubscription(Constants.ROOM);
  if (Constants.LOG_UPDATES_ON_CONSOLE) {
    chatSubscription.addListener(new ConsoleSubscriptionListener("Chat Subscription "+Constants.ROOM));
  }
  chatSubscription.addListener(chat);
  lsClient.subscribe(chatSubscription);
  
  //setup room subscription
  var roomSubscription = new RoomSubscription(Constants.ROOM);
  if (Constants.LOG_UPDATES_ON_CONSOLE) {
    roomSubscription.addListener(new ConsoleSubscriptionListener("Room Subscription "+Constants.ROOM));
  }
  roomSubscription.addListener(game);
  roomSubscription.addListener(scoreboard);
  lsClient.subscribe(roomSubscription);
  
  //bind to UI
  
  var menuIsOpen = true;
  $(document).ready(function(){
    var firsClick = false;
    
    var x = new Image();
    x.src = "images/down.png";//preload
    x = null;
    
    var hideTop = 0;
    function setup() {
      hideTop =  -$("#tools_stuff").height()+15; //show 15px
      if (!menuIsOpen) {
        $("#tools").css("top",hideTop);
      }
    }
    setup();
    
    
    $("#tools_button").click(function() {
      firsClick = true;
      if (menuIsOpen) {
        $("#tools").css("top",hideTop);
        $(this).attr("src","images/down.png");
      } else {
        $("#tools").css("top",0);
        $(this).attr("src","images/up.png");
      }
      menuIsOpen = !menuIsOpen;
    });
    
    $("#theWorld").click(function() {
      if (menuIsOpen) {
        $("#tools_button").click();
      }
    });
    
    $(window).resize(function(){
      setup();
    });
    
    setTimeout(function() {
      if (!firsClick) {
        $("#tools_button").click();
      }
    },2000);
    
  });
  
  
  //paging handling
  var current = 1;
  function changePage(goTo) {
    current = goTo;
    var max = scoreboard.getCurrentPages();
    if (current > max) {
      current = max;
    } else if (current < 1) {
      current = 1;
    }
    scoreboard.goToPage(current);
  }
  $(document).keypress(function(e) {
    if (menuIsOpen) {
      return;
    }
    if (e.which == 100 || e.which == 68) {
      changePage(current+1);
    } else if(e.which == 115 || e.which == 83) {
      changePage(current-1);
    }
  });
  
  //setup camera controls
  $("#resetCamera").click(function(){
    field.resetCamera();
  });
  
  //setup camera auto on/off
  $("#autoCamera").prop("checked",options.getAutoCamera()).change(function() {
    options.setAutoCamera($(this).prop("checked"));
    game.enableCameraHandling(options.getAutoCamera());
  });
  game.enableCameraHandling(options.getAutoCamera()); 
  
  //setup nicks on darts on/off
  $("#showNicks").prop("checked",options.getShowNicks()).change(function() {
    options.setShowNicks($(this).prop("checked"));
    game.showExtraInfo(options.getShowNicks());
  });
  game.showExtraInfo(options.getShowNicks());
  
  //setup nick input
  $("#nick").val(userNick).prop('disabled', false).keyup(function() {
    options.setNick($(this).val());
    player.changeNick(options.getNick());
  });
  
  //send chat messages
  function doSend() {
    player.sendChatMessage(Constants.ROOM,$("#chatMessage").val());
    $("#chatMessage").val("");
  }
  $("#sendChat").click(function(){
    doSend();
  });
  $("#chatMessage").keypress(function(e) {
    if(e.which == 13) {
      doSend();
    }
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
  
  //enter/exit room based on leap motion status
  function doEnter() {
    player.enterRoom(Constants.ROOM);
    $("#chatMessage").prop('disabled', false);
  }
  function doExit() {
    player.exitRoom(Constants.ROOM);
    $("#chatMessage").prop('disabled', true);
  }
  if (LeapMotion.isReady()) {
    doEnter();
  } else {
    LeapMotion.addListener({
      onReady: function(ready) {
        if (ready) {
          doEnter();
        } else {
          doExit();
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

  