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

//all <script> js loaded
addPerc(20);

require(["js/Constants","js/Field","js/Game",
         "js/Dart","js/Player","js/Options","js/Controls",
         "js/lsClient","js/Simulator","js/ConsoleSubscriptionListener",
         "js/Scoreboard","js/RoomSubscription",
         "js/ChatBoard","js/ChatSubscription",
         "js/FloatingMenu","js/Status", "js/Utils"],
    function(Constants,Field,Game,
        Dart,Player,Options,Controls,
        lsClient,Simulator,ConsoleSubscriptionListener,
        Scoreboard,RoomSubscription,
        ChatBoard,ChatSubscription,
        FloatingMenu,Status,Utils) {
  
  //all required js loaded
  addPerc(18);
  var loading = new FloatingMenu($("#loading"),{
    startOpen: true,
    zIndex: Constants.FLOATING_Z_INDEX.MAX,
    openPosition: {right: 0, bottom: 0, left: 0, top: 0}
  });

  THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
    var perc = (50/total)*loaded + 50;
    showPerc(perc);
    
    if (loaded == total) {
      THREE.DefaultLoadingManager.onProgress = null;
      setTimeout(function() {
        loading.close();
      },1000);
    }
  };
  
  
  var options = new Options();
  var userNick = options.getNick();
  
  //setup game
  var field = null;
  try {
    field = new Field($("#theWorld")[0],$(".hideWhileFlying"));
  } catch(e) {
    Status.changeStatus(Status.NOT_COMPATIBLE);
    return;
  }
  
  var game = new Game(field);
  var scoreboard = new Scoreboard(field,"scoreboardTemplate",["td"],$("#scoreboard"));
  var chat = new ChatBoard(field,"chatTemplate",["span"],$("#chat"),$("#chatPlaceHolder"));
  var player = new Player(userNick,lsClient,game);
  var controls = new Controls(player);
  
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
  
  var cmBottom = $("#communicateButton").css("bottom").replace("px","") - $("#communicateMenu").outerHeight()/4;
  var cmRight = $("#communicateButton").outerWidth() + 20;
  
  var communicateMenu = new FloatingMenu($("#communicateMenu"),{
    startOpen: true,
    closedPosition: {right: cmRight, bottom: cmBottom},
    openPosition: {right: cmRight, bottom: cmBottom} ,
    zIndex: Constants.FLOATING_Z_INDEX.MIDDLE,
    effect: FloatingMenu.WIDTH_EFFECT,
    button: $("#communicateButton")
  });
  
  var instructionsMenu = new FloatingMenu($("#instructionsMenu"),{
    startOpen: options.getInstructionsOpen(),
    closedPosition: $("#instructionsButton"),
    effect: FloatingMenu.WIDTH_HEIGHT_EFFECT,
    button: $("#instructionsButton")
  });
  
  var optionsMenu = new FloatingMenu($("#optionsMenu"),{
    closedPosition: $("#optionsButton"),
    effect: FloatingMenu.WIDTH_HEIGHT_EFFECT,
    button: $("#optionsButton")
  });
      
  var grey = new FloatingMenu($("#grey"),{
    startOpen: options.getInstructionsOpen(),
    openPosition: {right: 0, bottom: 0, left: 0, top: 0},
    zIndex: Constants.FLOATING_Z_INDEX.MIN,
    effect: FloatingMenu.OPACITY_EFFECT,
    openOpacity: 0.7
  });
  
  instructionsMenu.addListener({
    onOpen: function() {
      optionsMenu.close();
      options.setInstructionsOpen(true);
    },
    onClose: function() {
      options.setInstructionsOpen(false);
    }
  });
  
  optionsMenu.addListener({
    onOpen: function() {
      instructionsMenu.close();
    }
  });
  
  
  controls.disable("menu");
  var menusListener = {
      onOpen: function() {
        grey.open();
        controls.disable("menu");
      },
      
      onClose: function() {
        grey.close();
        controls.enable("menu");
      }
  };
  
  instructionsMenu.addListener(menusListener);
  optionsMenu.addListener(menusListener);
  
  $("#instructionsClose").click(function() {
    instructionsMenu.close();
  });
  $("#optionsClose").click(function() {
    optionsMenu.close();
  });
  $("#grey").click(function(){
    instructionsMenu.close();
    optionsMenu.close();
  });
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      instructionsMenu.close();
      optionsMenu.close();
    }   
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
    /*if (Menu.isOpen()) { TODO any menu must have the same effect
      return;
    }*/
    
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
  
  $(window).keyup(function(e) { 
    if (e.which == Constants.CAMERA_KEY) { 
      field.blockOrbit(true);
      controls.enable("camera");
    }
  }).keydown(function(e) { 
    if (e.which == Constants.CAMERA_KEY) {
      field.blockOrbit(false);
      controls.disable("camera");
    }
  }).focus(function() {
    field.blockOrbit(true);
    controls.enable("camera");
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
  
  function swicthControlType(isLeap) {
    if (isLeap) {
      $(".leapInstruction").show();
      $(".mouseInstruction").hide();
    } else {
      $(".leapInstruction").hide();
      $(".mouseInstruction").show();
    }
    options.setLeap(isLeap);
    controls.enableLeap(isLeap);
    options.setMouse(!isLeap);
    controls.enableMouse(!isLeap);
  }
  
  
  swicthControlType(options.getLeap());
  $(".switch-input").prop("checked",options.getLeap());
  $(".switch-input").change(function() {
    swicthControlType(this.checked);
    $(".switch-input").prop("checked",this.checked);
  });
  
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
  
  
  var enableSoundEffect = Utils.loadSound("throw");
  if (enableSoundEffect) {
    switchCheckedClass("#audioButton",options.getAudio());
    game.enableAudio(options.getAudio());
    $("#audioButton").click(function() {
      options.toggleAudio();
      if(options.getAudio()) {
        enableSoundEffect.play();
      }
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
  });
  
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
  //Let us enter the game room 
  doEnter();
    
  
  
  //setup simulators
  var created = 0;
  var creator = setInterval(function() {
    if (created >= Constants.SIMULATED_PLAYERS) {
      clearInterval(creator);
      return;
    }
    created++;
    console.log("Create new simulator " + created);
    new Simulator(game,created == 1);
  },100);
  
  
  addPerc(2);
  
});


  