define(function() {

  var x = new Image();
  x.src = "images/down.png";//preload
  x = null;
  
  var isOpen = true;
  var hideTop = 0;
  
  return {
    hideTop: 0,
    
    setup: function() {
      hideTop =  -$("#tools_stuff").height()+100; //show 100px (including logo)
      if (!isOpen) {
        $("#tools").css("top",hideTop);
      }
    },
    isOpen: function() {
      return isOpen;
    },
    open: function() {
      if (!isOpen) {
        $("#tools").css("top",0);
        $("#tools_button").attr("src","images/up.png");
        isOpen = true;
      }
    },
    close: function() {
      if (isOpen) {
        $("#tools").css("top",hideTop);
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
