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
        originalHeight = $("#tools").outerHeight();
        originalWidth = $("#tools").outerWidth();
        originalStuffHeight = $("#tools_stuff").outerHeight();
        originalLinkHeightRow = $("#linksRow").outerHeight();
        originalHideTop = -originalStuffHeight+originalLogoSize+20+originalLinkHeightRow;
        firstSetup = false;
      };
    

      zoom=1;
      while (zoom > 0 && originalHeight*zoom > window.innerHeight) {
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
