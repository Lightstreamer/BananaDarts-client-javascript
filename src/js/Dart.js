/*
Copyright 2013 Weswit s.r.l.

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
define(["./Constants"],function(Constants) {
  
  var tmpGeometry = new THREE.CubeGeometry(2,4,2);
  var tmpMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
  
  var materials = {};
  materials[Constants.OWN] = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  materials[Constants.OTHER] = new THREE.MeshLambertMaterial( { color: 0x0f87ff } );
  
  var mtls = {};
  mtls[Constants.OWN] = "obj/dart.obj.mtl";
  mtls[Constants.OTHER] = "obj/dartb.obj.mtl";
    
  var loader = new THREE.OBJMTLLoader();
  var waiting = {};
  waiting[Constants.OWN] = [];
  waiting[Constants.OTHER] = [];
  var clonable = {};
  function loadClonable(type) {
    loader.load("obj/dart.obj", mtls[type], function ( object ) {
      clonable[type] = object;
      for(var i=0; i<waiting[type].length; i++) {
        waiting[type][i].convertDart();
      }
      waiting[type] = null;
    });
  }
  loadClonable(Constants.OWN);
  loadClonable(Constants.OTHER);
  
  var NICK_OFFSET = {
      x: 2,
      y: 1,
      z: 2,
  };
  
  var Dart = function(key,type,field,showInfo) {
    this.field = field;
    
    this.dart = null;
    this.dinamics = {V: new THREE.Vector3( 0, 0, 0 ), R: new THREE.Vector3( 0, 0, 0 )};
    
    this.text = null; 
    this.nick = null;
    this.showNickFlag = showInfo;
    
    this.key = key;
    this.type = type;
    
    this.initDart();
  };
  
  
  Dart.prototype = {
      /**
       * @private
       */
      initDart: function() {
        if (!clonable[this.type]) {
          //wait
          this.dart = new THREE.Mesh(tmpGeometry,tmpMaterial);
          waiting[this.type].push(this);
        } else {
          this.createDart();
        }
        
        this.dart.position.set(0,0,59);
        this.dart.quaternion.set(0.707,0,0,0.707); //0.64,0,0,0.76); //0.57,0,0,0.81
        this.field.addObject(this.dart);
      },
      
      createDart: function() {
        this.dart = clonable[this.type].clone();
        this.dart.scale.set(2,2,2);
      },
      
      convertDart: function() {
        var tmp = this.dart;
        this.createDart();
        
        //text already correctly positioned
        this.dart.position = tmp.position;
        this.dart.quaternion = tmp.quaternion;
        
        this.field.removeObject(tmp);
        this.field.addObject(this.dart);
      },
      
      changeType: function(newType) {
        if (newType == this.type) {
          return;
        }
        this.type = newType;

        this.convertDart();
        
        if (this.text) {
          this.text.material = materials[this.type];
        }
      },
      
      clear: function() {
        this.field.removeObject(this.dart);
        this.dart = null;
        this.showNick(false);
      },
        
      setNick: function(nick) {
        this.nick = nick;
        this.showNick(this.showNickFlag);
      },
      
      showNick: function(show) {
        if (this.text != null) {
          this.field.removeObject(this.text);
          this.text = null;
        }
        
        this.showNickFlag = show;
        
        if (this.nick == null || this.nick == "" || !show) {
          return;
        }
        
        var text3d = new THREE.TextGeometry( this.nick, {
              size: 1.2,
              height: 0,
              curveSegments: 0,
              
              font: "droid serif",
              weight: "bold",
            });
        text3d.computeBoundingBox();

        this.text = new THREE.Mesh(text3d, materials[this.type]);
        
        this.text.position.x = this.dart.position.x+NICK_OFFSET["x"];
        this.text.position.y = this.dart.position.y+NICK_OFFSET["y"];
        this.text.position.z = this.dart.position.z+NICK_OFFSET["z"];
        this.field.addObject(this.text);
       
        this.field.render();
      }, 
      
      getKey: function() {
        return this.key;
      },
      getDart: function() {
        return this.dart;
      },
      getDinamics: function() {
        return this.dinamics;
      },
      getNick: function() {
        return this.nick;
      },
     
      setDVX: function(val) {
        this.dinamics.V.x = val;
      },
      setDVY: function(val) {
        this.dinamics.V.y = val;
      },
      setDVZ: function(val) {
        this.dinamics.V.z = val;
      },
      setDRX: function(val) {
        this.dinamics.R.x = val;
      },
      setDRY: function(val) {
        this.dinamics.R.y = val;
      },
      setDRZ: function(val) {
        this.dinamics.R.z = val;
      },
      
      //Rotation
      
      setRotX: function(val) {
        this.setRotation("x",val);
      },
      setRotY: function(val) {  
        this.setRotation("y",val);
      },
      setRotZ: function(val) {
        this.setRotation("z",val);
      },
      setRotW: function(val) {
        this.setRotation("w",val);
      },
      
      setRotation: function(axis,val) {
        this.dart.quaternion[axis] = val;
        this.field.render();
      },
      
      //Position
      
      setPosX: function(val) {
        this.setPos("x",val);
      },
      setPosY: function(val) {  
        this.setPos("y",val);
      },
      setPosZ: function(val) {
        this.setPos("z",val);
      },
      
      setPos: function(axis,value) {
        if ( value >= Constants.MAX_SIZE[axis] ) {
          value = Constants.MAX_SIZE[axis];
        }else if ( value <= (Constants.MAX_SIZE[axis] * -1) ) {
          value = -Constants.MAX_SIZE[axis];
        }
        
        if (value ==  this.dart.position[axis]) {
          return;
        }
        
        this.dart.position[axis] = value;
        if (this.text) {
          this.text.position[axis] = value+NICK_OFFSET[axis];
        }
               
        this.field.render();
      },
      
      /**
       * @private
       */
      calculateAxisPos: function(axis,rateFactor) {
        return this.dart.position[axis] + (this.dinamics.V[axis] * 0.002 * rateFactor);
      },
      
      calculate: function(rateFactor) { 
        this.setPos("z", this.calculateAxisPos("z",rateFactor));
        
        if (this.dart.position["z"] != -Constants.MAX_SIZE["z"]) {
          this.setPos("y", this.calculateAxisPos("y",rateFactor));
          this.setPos("x", this.calculateAxisPos("x",rateFactor));
        }
        
       
        /*
        var qx = new THREE.Quaternion();
        qx.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), (this.dinamics.R.x * 0.02 * rateFactor) );
        this.dart.quaternion.multiply( qx );
        this.dart.quaternion.normalize();
          
        var qy = new THREE.Quaternion();
        qy.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), (this.dinamics.R.y * 0.02 * rateFactor) );
        this.dart.quaternion.multiply( qy );
        this.dart.quaternion.normalize();
          
        var qz = new THREE.Quaternion();
        qz.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), (this.dinamics.R.z * 0.02 * rateFactor) );
        this.dart.quaternion.multiply( qz );
        this.dart.quaternion.normalize();
        */
        this.field.render();
      }
  };
  
  return Dart;
});