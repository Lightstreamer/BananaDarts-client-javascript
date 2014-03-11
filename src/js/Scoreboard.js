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
define(["DynaGrid","./Constants","Inheritance"],
    function(DynaGrid,Constants,Inheritance) {
  
  var effects = {
      onVisualUpdate: function(key,visualUpdate,domNode) {
        visualUpdate.setHotTime(500);
        visualUpdate.setHotToColdTime(700);
        visualUpdate.setAttribute("yellow","","backgroundColor");
        visualUpdate.setAttribute("black","white","color");
      }
  };
  
  var Scoreboard = function(field,template,cells,container) {
    
    this._callSuperConstructor(Scoreboard,[template]); 
    this.setNodeTypes(cells);
    this.parseHtml();
    
    this.setMaxDynaRows(10);
    this.setSort("totalScore",true,true,false);
    
    container.show();
    var element = container[0];
    var cssObject = new THREE.CSS3DObject(element);
    
    //get its size and center it in the top left corner
    var rect = element.getBoundingClientRect();
    var x = -Constants.MAX_SIZE.x+rect.width/2;
    var y = Constants.MAX_SIZE.y-rect.height/2;
    cssObject.position.set(x,y,-Constants.MAX_SIZE.z+10); //stay away a bit from the wall or you'll get a strange flickering effect (makes sense @ 0 distance)

    field.addCSSObject(cssObject);
    
    this.addListener(effects);
   
  };
  
  
  Inheritance(Scoreboard,DynaGrid);
  return Scoreboard;
  
});





 
