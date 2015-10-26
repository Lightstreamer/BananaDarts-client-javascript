/*
Copyright (c) Lightstreamer Srl

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
  
  var RoomSubscription = function(room) {
    
    //ROOMCHATLIST_SUBSCRIPTION contains user statuses and user nicks
    
    this._callSuperConstructor(RoomSubscription,["COMMAND","roomchatlist_"+room,["command","key"]]);
    
    
   
    this.setRequestedSnapshot("yes");
    this.setCommandSecondLevelFields(["nick","status",
                                                  "dVx","dVy","dVz",
                                                  "posX","posY","posZ",
                                                  "lastScore","numThrows","totalScore"]);
  }; 
  
  Inheritance(RoomSubscription,Subscription);
  return RoomSubscription;
  
});