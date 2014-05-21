define(["./FloatingMenu"],function(FloatingMenu) {

  var floatingWin = new FloatingMenu($("#statusMenu"),false,null,null,11);
  
  
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