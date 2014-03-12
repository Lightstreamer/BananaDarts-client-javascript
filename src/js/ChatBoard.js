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
  
  var ChatBoard = function(field,template,cells,container,placeholder) {
    
    this._callSuperConstructor(ChatBoard,[template]);
    
    this.isEmpty = true;
    this.placeholder = placeholder;
    
    this.setNodeTypes(cells);
    this.parseHtml();
    
    this.setMaxDynaRows(10);
    this.setAddOnTop(false);
    
    container.show();
    var element = container[0];
    var cssObject = new THREE.CSS3DObject(element);
    
    //get its size and center it in the top right corner
    var rect = element.getBoundingClientRect();
    var z = -Constants.MAX_SIZE.z+rect.width/2;
    var y = Constants.MAX_SIZE.y-rect.height/2;
    cssObject.position.set(-Constants.MAX_SIZE.x+10,y,z); //stay away a bit from the wall or you'll get a strange flickering effect (makes sense @ 0 distance)
    cssObject.rotation.y = Math.PI / 2;
    field.addCSSObject(cssObject);
   
  };
  
  ChatBoard.prototype = {
      onItemUpdate: function() {
        if (this.isEmpty) {
          this.isEmpty = false;
          if (this.placeholder) {
            this.placeholder.hide();
          }
        }
        this._callSuperMethod(ChatBoard,"onItemUpdate",arguments);
      }
  };
  
  Inheritance(ChatBoard,DynaGrid);
  return ChatBoard;
  
});





 
