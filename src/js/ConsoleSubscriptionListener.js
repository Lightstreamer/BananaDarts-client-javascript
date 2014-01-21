define(function() {
  
  var ConsoleSubscriptionListener = function(name) {
    this.name = name;
  };
  
  ConsoleSubscriptionListener.prototype = {
      onItemUpdate: function(upd) {
        console.log("------------------>"+this.name);
        upd.forEachField(function(name,pos,val) {
          console.log(name + ": " + val);
        });
        console.log("<------------------"+this.name);
      },
      onSubscription: function() {
        console.log("Subscribed " + this.name);
      },
      onSubscriptionError: function() {
        console.log("Subscriprtion error " + this.name);
      },
      onUnsubscription: function() {
        console.log("Unsubscribed " + this.name);
      },
      onEndOfSnapshot: function() {
        console.log("EOS " + this.name);
      },
      onCommandSecondLevelSubscriptionError: function() {
        console.log("Subscriprtion error (2nd level) " + this.name);
      }
  };
  
  
  return ConsoleSubscriptionListener;
  
});
