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
define(["Subscription","Inheritance"],function(Subscription,Inheritance) {
  
  var ChatSubscription = function(room) {
    
    //ROOMCHATLIST_SUBSCRIPTION contains user statuses and user nicks
    
    this._callSuperConstructor(ChatSubscription,["DISTINCT","roomchat_"+room,["nick","message"]]);
    this.setRequestedSnapshot("yes");
    
  }; 
  
  Inheritance(ChatSubscription,Subscription);
  return ChatSubscription;
  
});