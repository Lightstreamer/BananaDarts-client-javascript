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
  
  var VISIBLE_PIXELS_WHILE_CLOSED = 10;
  var LOGO_ZOOM_WHILE_CLOSED = 0.25;
  var OPACITY_WHILE_CLOSED = 0.6;
  var OPACITY_WHILE_OPEN = 0.9;

  var isOpen = true;
  
  var firstSetup = true;
  var firstAction = false;
  
  var logoWidth = null;
  var logoHeight = null;
  var fontSize = null;
  var miniFontSize = null;
  var inputHeight  = null;
  var zoom = 1;
  
  var accordion = null;
  
  
  var Accordion = function(heads,elements) {
    this.heights = {};
    for (var i=0; i<heads.length; i++) {
      this.setup(heads[i],elements[i]);
      this.heights[elements[i]] = $(elements[i]).outerHeight();
      this.doClose(elements[i]);
      
    }
    this.doOpen(elements[0]);
    
  };
  
  Accordion.prototype = {
      
    setup: function(head,name) {
      var that = this;
      $(head).click(function() {
        that.click(name);
      });
    },
      
    click: function(name) {
      if (this.openEl == name) {
        this.close(name);
      } else {
        this.open(name);
      }
    },
      
    open: function(name) {
      if (this.openEl == name) {
        return;
      }
      this.doClose(this.openEl);
      this.doOpen(name);
    },
    
    close: function(name) {
      if (this.openEl != name) {
        return;
      }
      this.doClose(this.openEl);
    },
    
    doClose: function(name) {
      if (!name) {
        return;
      }
      $(name).css("height","0");
      this.openEl = null;
    },
    
    doOpen: function(name) {
      if (!name) {
        return;
      }
      this.openEl = name;
      $(name).css("height",14+this.heights[name]*zoom);
    }
      
      
  };
  
  return {
    
    setup: function() {
      if (firstSetup) {
        $("#tools").css("margin",0);
        logoWidth = $("#logo").outerWidth();
        logoHeight = $("#logo").outerHeight();
        fontSize = $("#accordion").css("font-size").replace("px","");
        miniFontSize = $("#linksRow").css("font-size").replace("px","");
        inputHeight = $(".inputDiv").outerHeight();
        $("#logo, #tools, .github").css("opacity",OPACITY_WHILE_OPEN);
        
        accordion = new Accordion(["#optionsHead","#playInstuctionsHead","#cameraInstuctionsHead"],
            ["#options","#playInstuctions","#cameraInstuctions"]);
        
        firstSetup = false;
      }
      
      zoom=1;
      while (zoom > 0 && logoWidth*zoom > window.innerWidth/2) {
        zoom -= 0.1;
      }
            
      $("#tools, #logo").css("width",logoWidth*zoom);
      $("#logo").css("height",logoHeight*zoom);
      $("#tools_stuff").css("padding-top",logoHeight*zoom);
      
      $("#accordion").css("font-size",fontSize*zoom);
      
      $(".inputDiv").css("height",inputHeight*zoom);
      $("#nick, #chatMessage").css("font-size",fontSize*zoom);
      
      if (zoom >= 0.6) {
        $("#linksRow").css("font-size",miniFontSize*zoom);
        $("#linksRow").show();
      } else {
        $("#linksRow").hide();
      }
      
      accordion.doOpen(accordion.openEl);
      
      if (!isOpen) {
        isOpen = true;
        this.close();
      }
    },
    isOpen: function() {
      return isOpen;
    },
    open: function() {
      
      firstAction = true;
      if (!isOpen) {
        $("#tools").css("right",-logoWidth*zoom+10);
        
        //1 open the menu
        $("#tools").css("right",0);
        //2 restore logo
        $("#logo").css("width",logoWidth*zoom);
        $("#logo").css("height",logoHeight*zoom);
        //3 decrease transparency
        $("#logo, #tools, .github").css("opacity",OPACITY_WHILE_OPEN);
        //4 change arrow
        $("#tools_button").css("transform","rotate(0deg)");
        
        isOpen = true;
      }
    },
    close: function() {
      firstAction = true;
      if (isOpen) {
        
        //1 close the menu
        $("#tools").css("right",-logoWidth*zoom+VISIBLE_PIXELS_WHILE_CLOSED);
        //2 shrink logo
        $("#logo").css("width",logoWidth*zoom*LOGO_ZOOM_WHILE_CLOSED);
        $("#logo").css("height",logoHeight*zoom*LOGO_ZOOM_WHILE_CLOSED);
        //3 increase transparency
        $("#logo, #tools, .github").css("opacity",OPACITY_WHILE_CLOSED);
        //4 change arrow
        $("#tools_button").css("transform","rotate(180deg)");
        
        isOpen = false;
      }
    },
    toggle: function() {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    
    gotFirstCall: function() {
      return firstAction;
    },
    
    hide: function(hide) {
      if (hide) {
        $("#tools, .github, #logo").hide();
      } else {
        $("#tools, .github, #logo").show();
      }
      
    }
  };
  
});
