define(function() {

  return {
    
    LOADING: "#loading",
    status: "#loading",
    READY: "#ready",
    NOT_COMPATIBLE: "#not_compatible",
    
    
    changeStatus: function(next) {
      $(this.status).hide();
      $(next).show();
      this.status = next;
    }

  };
  
  
})