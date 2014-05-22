define(["./FloatingMenu","./Constants"],
    function(FloatingMenu,Constants) {

  var floatingWin = new FloatingMenu($("#statusMenu"),false,null,null,Constants.FLOATING_Z_INDEX.MAX);
  
  
  var Status = {
    
    OK: "#ok",
    status: "#ok",
    NOT_COMPATIBLE: "#not_compatible",
    WAIT_LEAP: "#no_leap",
    
    changeStatus: function(next) {
      if (next == this.OK) {
        floatingWin.close();
      } else {
        floatingWin.open();
      }
      
      if (this.status == this.NOT_COMPATIBLE) {
        //don't move from there
        return;
      }
      
      $(this.status).hide();
      $(next).show();
      this.status = next;
    }

  };
  
  $(Status.OK).hide();
  $(Status.NOT_COMPATIBLE).hide();
  $(Status.WAIT_LEAP).hide();
  
  return Status;
  
});