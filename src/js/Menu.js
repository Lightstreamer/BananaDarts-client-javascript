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

  var x = new Image();
  x.src = "images/down.png";//preload
  x = null;
  
  var isOpen = true;
  var hideTop = 0;
  var originalLogoSize = 228;
  var targetLogoSize = 100;
  
  var topPosition = 0;
  var leftPosition = 0;
  var originalHeight = null;
  var originalWidth = null;
  var originalLinkHeightRow = null;
  var firstSetup = true;
  
  var zoom = 1;
  $("#logo").css("height",originalLogoSize+"px");
  
  
  return {
    
    setup: function() {
      if (firstSetup) {
        $("#tools").css("margin",0);
        originalHeight = $("#tools").outerHeight();
        originalWidth = $("#tools").outerWidth();
        originalStuffHeight = $("#tools_stuff").outerHeight();
        originalLinkHeightRow = $("#linksRow").outerHeight();
        originalHideTop = -originalStuffHeight+originalLogoSize+20+originalLinkHeightRow;
        firstSetup = false;
      };
    

      zoom=1;
      while (zoom > 0 && originalStuffHeight*zoom > window.innerHeight) {
        zoom -= 0.1;
      }
      while (zoom > 0 && originalWidth*zoom > window.innerWidth) {
        zoom -= 0.1;
      }
      
      topPosition = (originalHeight*zoom - originalHeight)/2;
      leftPosition = (window.innerWidth-originalWidth)/2;
      
      
      $("#tools").css("transform","scale("+zoom+", "+zoom+")");
      $("#tools").css("left",leftPosition);
      $("#tools").css("top",topPosition);
      
      
      hideTop = topPosition + originalHideTop*zoom + (1-zoom)*90;
      
      if (!isOpen) {
        isOpen = true;
        this.close();
      }
    },
    isOpen: function() {
      return isOpen;
    },
    open: function() {
      if (!isOpen) {
        $("#linksRow").show();
        $("#tools").css("top",topPosition);
          $("#logo").css("height",originalLogoSize+"px");
        $("#tools_button").attr("src","images/up.png");
        isOpen = true;
      }
    },
    close: function() {
      if (isOpen) {
        $("#linksRow").hide();
        $("#tools").css("top",hideTop);
        $("#logo").css("height",targetLogoSize+"px");
        $("#tools_button").attr("src","images/down.png");
        isOpen = false;
      }
    },
    toggle: function() {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  };
  
});
