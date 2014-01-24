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
define(["Inheritance","AbstractGrid","./Constants","./ConsoleSubscriptionListener","Subscription"],
    function(Inheritance,AbstractGrid,Constants,ConsoleSubscriptionListener,Subscription) {
  
  //TODO clean up this module
  
  var TOT_WIDTH = Constants.MAX_SIZE.z*2;
  var TOT_HEIGHT = Constants.MAX_SIZE.y*2;
  
  var columns = [
                 { perc: 50,
                   field: "id",
                   color: 0xaaff00},
                 { perc: 50,
                   field: "score",
                   color: 0xffffff}
                ];
  
  
  var MAX_ROWS = 10; //number of rows
  
  var rowWidth = TOT_WIDTH;
  var rowHeight = TOT_HEIGHT/MAX_ROWS;
  

  var Scoreboard = function(client,game,field) {
    
    this._callSuperConstructor(Scoreboard);
    
    this.field = field;
    this.game = game;
    
    this.rows = {};
    this.orderedRows = [];
    this.rowsCount = 0;
        
    this.setup();
    this.parseHtml();
    
    
    
    var scoreSubscription = new Subscription("DISTINCT","roomscore_"+Constants.ROOM,["id","score"]);  //ROOMCHATLIST_SUBSCRIPTION contains user statuses and user nicks
    scoreSubscription.setRequestedSnapshot("yes");
    if (Constants.LOG_UPDATES_ON_CONSOLE) {
      scoreSubscription.addListener(new ConsoleSubscriptionListener("Room score"));
    }
    scoreSubscription.addListener(this);
    
    client.subscribe(scoreSubscription);
    
  };
  
  
  Scoreboard.prototype = {
      setup: function() {
        var geometry = new THREE.CubeGeometry(0.2,TOT_HEIGHT,TOT_WIDTH);
        
        var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
        var panel = new THREE.Mesh(geometry, material);
        panel.position.x=0;
        panel.position.y=0;
        panel.position.z=0;
        
        
      
        
        this.panel = new THREE.Object3D();
        this.panel.position.x = Constants.MAX_SIZE.x+10;
        this.panel.position.y = 0;
        this.panel.position.z = 0;
        this.panel.add(panel);
        
        
        /*var test = new THREE.Mesh(new THREE.CubeGeometry(1,rowHeight,rowWidth), new THREE.MeshLambertMaterial( { color: 0x00ff00 }));
        test.position.x = 0;
        test.position.y = TOT_HEIGHT/2-(rowHeight/2);
        test.position.z = -TOT_WIDTH/2+(rowWidth/2);
        this.panel.add(test);*/
        //this.panel.remove(test);
       
        
        this.field.addObject(this.panel);
        
      },
      
      updateRowExecution: function(key,serverValues) {
        //replace id with nick
        var player = this.game.getPlayer(serverValues["id"]);
        if (player) {
          serverValues["id"] = player.getNick();
        }
        
        
        if (!this.rows[key]) {
          this.addRow(key,serverValues);
        } else {
          this.fillRow(this.rows[key],serverValues);
        }
      },
      
      removeRowExecution: function(key) {
        this.rowsCount--;
        this.panel.remove(this.rows[key]);
        delete(this.rows[key]);
        for (var i=0; i<this.orderedRows.length; i++) {
          if (this.orderedRows[i] == key) {
            this.orderedRows.splice(i,1);
            break;
          }
        }
        
        this.field.render();
      },
  
      addRow: function(key,serverValues) {
        if (this.rowsCount >= MAX_ROWS) {
          var rRow = this.orderedRows[0];
          this.removeRow(rRow);
        }
        
        var rowObj = this.fillRow(null,serverValues);
        this.shiftRows();
        this.orderedRows.push(key);
        
        rowObj.position.x = 0;
        rowObj.position.y = TOT_HEIGHT/2-(rowHeight/2);
        rowObj.position.z = -TOT_WIDTH/2+(rowWidth/2);
        
        this.panel.add(rowObj);
        this.rowsCount++;
        this.rows[key] = rowObj;
        
        
        this.field.render();

        
      },
      
      fillRow: function(row,values) {
        //TODO currently does not handle updates to an existing row
        if (!row) {
          row  = new THREE.Mesh(new THREE.CubeGeometry(1,rowHeight,rowWidth), new THREE.MeshLambertMaterial( { color: 0x00ff00 }));
        }
        
        var PADDING = 10;
        
        var offset = 0;
        for (var i = 0; i < columns.length; i++) {
          if (i>0){
            offset += TOT_WIDTH/100*columns[i-1].perc;
          }
          var cellWidth = (TOT_WIDTH/100)*columns[i].perc;
          var cell = new THREE.Mesh(new THREE.CubeGeometry(1,rowHeight,cellWidth), new THREE.MeshLambertMaterial( { color: columns[i].color }));
          cell.position.x=-1;
          cell.position.y=0;
          cell.position.z=-cellWidth/2+offset;// cellWidth/2+offset;
          
          row.add(cell);
          
          var txt = values[columns[i].field];
          if(!txt) {
            continue;
          }
          var text3d = null;
          do {
            text3d = new THREE.TextGeometry( txt, {
              size: 6,
              height: 0,
              curveSegments: 0,
              
              font: "droid serif",
              weight: "bold",
            });
            text3d.computeBoundingBox();
            
            if ((text3d.boundingBox.max.x > (cellWidth-PADDING*2))) {
              var newL = Math.round(txt.length*(cellWidth-PADDING*2) / text3d.boundingBox.max.x);
              
              if (newL >= txt.length) {
                break;
              }
              
              txt = txt.substring(0,newL);

            }
            
          } while(text3d.boundingBox.max.x > (cellWidth-PADDING*2));
          
          
          var textObj = new THREE.Mesh(text3d,  new THREE.MeshLambertMaterial( { color: 0x0000ff }));
          textObj.position.x=-3;
          textObj.position.y=-text3d.boundingBox.max.y/2;
          textObj.position.z= -cellWidth/2 + PADDING;//-cellWidth/2 + text3d.boundingBox.max.x/2;
          textObj.rotation.y += (-90*0.0174532925);
         
          cell.add(textObj);
        }
        
        return row;
        
      },
      
      shiftRows: function() {
        for (var i in this.rows) {
          this.rows[i].position.y -= rowHeight;
        }
      },
      
      sortTable: function() {
        alert("NOT IMPLEMENTED");
      },
      
      computeFieldSymbolsSet: function() {
        alert("NOT IMPLEMENTED");
      },
      
      parseHtml: function() {
        this.parsed = true;
      }
      
  };
  
  
  Inheritance(Scoreboard,AbstractGrid);
  return Scoreboard;
  
});





 
