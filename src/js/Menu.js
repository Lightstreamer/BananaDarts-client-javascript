define(function() {

  var x = new Image();
  x.src = "images/down.png";//preload
  x = null;
  
  var isOpen = true;
  var hideTop = 0;
  var originalLogoSize = 228;
  var targetLogoSize = 100;
  $("#logo").css("height",originalLogoSize+"px");
  
  
  return {
    
    setup: function() {
      
      if (!isOpen) {
        hideTop =  -$("#tools_stuff").outerHeight()+targetLogoSize+20;
        $("#tools").css("top",hideTop);
      } else {
        hideTop =  -$("#tools_stuff").outerHeight()+originalLogoSize+20+$("#linksRow").outerHeight();
      }
    },
    isOpen: function() {
      return isOpen;
    },
    open: function() {
      if (!isOpen) {
        $("#linksRow").show();
        $("#tools").css("top",0);
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
