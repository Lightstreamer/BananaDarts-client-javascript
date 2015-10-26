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
require(["js/Simulator"],function(Simulator) {
  
  var Collection = function(el,champions) {
    this.el = $(el);
    this.sims = [];
    this.champions = champions;
  };
  Collection.prototype = {
      add: function() {
        this.sims.push(new Simulator(null,this.champions));
        this.el.text(this.sims.length);
      },
      remove: function() {
        if (this.sims.length <= 0) {
          return;
        }
        var closing = this.sims.shift();
        closing.dispose();
        this.el.text(this.sims.length);
      }
  };

  
  $(document).ready(function() {
    
    var champions = new Collection("#champion",true);
    var simulators = new Collection("#simple",false);
    
    $("#addChampion").click(function() {
      champions.add();
    });
    $("#addSimple").click(function() {
      simulators.add();
    });
    
    $("#removeChampion").click(function() {
      champions.remove();
    });
    $("#removeSimple").click(function() {
      simulators.remove();
    });
    
  });  
  
  
  
  
  
});