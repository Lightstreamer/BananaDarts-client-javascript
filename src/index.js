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
require(["js/Constants","js/Field","js/Game",
         "js/Dart","js/Player","js/Options","js/LeapMotion",
         "js/lsClient","js/Simulator","js/ConsoleSubscriptionListener",
         "js/Scoreboard","js/RoomSubscription",
         "js/ChatBoard","js/ChatSubscription",
         "js/Menu", "js/Status"],
    function(Constants,Field,Game,
        Dart,Player,Options,LeapMotion,
        lsClient,Simulator,ConsoleSubscriptionListener,
        Scoreboard,RoomSubscription,
        ChatBoard,ChatSubscription,
        Menu,Status) {
  
  var options = new Options();
  
  var userNick = options.getNick();
  
  
  //setup game
  var field = null;
  try {
    field = new Field($("#theWorld")[0]);
  } catch(e) {
    Status.changeStatus(Status.NOT_COMPATIBLE);
    return;
  }
  
  var game = new Game(field);
  var scoreboard = new Scoreboard(field,"scoreboardTemplate",["td"],$("#scoreboard"));
  var chat = new ChatBoard(field,"chatTemplate",["span"],$("#chat"),$("#chatPlaceHolder"));
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
  
  
  
  $(document).ready(function(){
    var firsClick = false;
    
    Menu.setup();    
    
    $("#tools_button").click(function(e) {
      e.stopPropagation();
      firsClick = true;
      Menu.toggle();
      
    });
    $("#tools").click(function() {
      Menu.open();
    });
    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        Menu.close();
      }   
    });
    $("#theWorld").click(function() {
      Menu.close();
    });
    setTimeout(function() {
      if (!firsClick) {
        Menu.close();
      }
    },5000);
    $(window).resize(function(){
      Menu.setup();
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
      if (Menu.isOpen()) {
        return;
      }
      
      if (e.which == 100 || e.which == 68) {
        changePage(current+1);
      } else if(e.which == 115 || e.which == 83) {
        changePage(current-1);
      } else if (e.which == 116 || e.which == 84) {
        scoreboard.sortByTot();
      } else if (e.which == 108 || e.which == 76) {
        scoreboard.sortByLast();
      }
    });
    
    //setup camera controls
    $("#resetCamera").click(function(){
      field.resetCamera();
    });
    
    
    var x = new Image();
    x.src = "images/checkhover.png";//preload
    x = null;
    
    function switchCheckedClass(el,flag) {
      if (flag) {
        $(el).addClass("checked");
      } else {
        $(el).removeClass("checked");
      }
    }
    
    switchCheckedClass("#autoCameraButton",options.getAutoCamera());
    game.enableCameraHandling(options.getAutoCamera()); 
    $("#autoCameraButton").click(function() {
      options.toggleAutoCamera();
      switchCheckedClass("#autoCameraButton",options.getAutoCamera());
      game.enableCameraHandling(options.getAutoCamera()); 
    });
   
    //setup nicks on darts on/off
    switchCheckedClass("#showNicksButton",options.getShowNicks());
    game.showExtraInfo(options.getShowNicks()); 
    $("#showNicksButton").click(function() {
      options.toggleShowNicks();
      switchCheckedClass("#showNicksButton",options.getShowNicks());
      game.showExtraInfo(options.getShowNicks()); 
    });
    
    
    if (typeof Audio != "undefined") {
      switchCheckedClass("#audioButton",options.getAudio());
      game.enableAudio(options.getAudio());
      $("#audioButton").click(function() {
        options.toggleAudio();
        switchCheckedClass("#audioButton",options.getAudio());
        game.enableAudio(options.getAudio()); 
      });
    } else {
      $("#audioButton").hide();
    }
    
    
    //setup nick input
    $("#nick").val(userNick).keyup(function() {
      options.setNick($(this).val());
      player.changeNick(options.getNick());
    }).keypress(function(e) {
      if(e.which == 13) {
        Menu.close();
      }
    });;
    
    //reset score
    $("#resetScore").click(function() {
      player.resetScore(Constants.ROOM);
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
    
    
    
    //slightly move camera to show dart
    field.moveCamera(Constants.INITIAL_CAMERA_POS_X, Constants.INITIAL_CAMERA_POS_Y, Constants.INITIAL_CAMERA_POS_Z);
    LeapMotion.addListener({
      onFistMove: function() {
        field.resetCamera();
        LeapMotion.removeListener(this);
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
      $("#nick").prop('disabled', false);
    }
    function doExit() {
      player.exitRoom(Constants.ROOM);
      $("#chatMessage").prop('disabled', true);
      $("#nick").prop('disabled', true);
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
    
    //setup message
    THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
      if (loaded == total) {
        THREE.DefaultLoadingManager.onProgress = null;
        LeapMotion.addListener({
          onReady: function(ready) {
            Status.changeStatus(ready ? Status.READY : Status.WAITING_LEAP);
          }
        });
        Status.changeStatus(LeapMotion.isReady() ? Status.READY : Status.WAITING_LEAP);
      }
    };
    
    
  });
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


  