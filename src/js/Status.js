define(function() {

  return {
    
    LOADING: "#loading",
    status: "#loading",
    WAITING_LEAP: "#waiting_leap",
    READY: "#ready_leap",
    NOT_COMPATIBLE: "#not_compatible",
    
    
    changeStatus: function(next) {
      $(this.status).hide();
      $(next).show();
      this.status = next;
    }

  };
  
  
})