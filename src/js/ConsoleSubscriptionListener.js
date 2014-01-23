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
