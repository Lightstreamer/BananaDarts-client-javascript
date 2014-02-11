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
define(["./Constants","./Utils"],function(Constants,Utils) {
  
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  
  var RIGHT = "right";
  var LEFT = "left";
  var CAMERA_POSITIONS = [
                   {x: 0, y:0, z:Constants.MAX_SIZE.z*2},
                   {x: -Constants.MAX_SIZE.x*2, y:0, z:0},
                   {x: 0, y:0, z:-Constants.MAX_SIZE.z*2},
                   {x: Constants.MAX_SIZE.x*2, y:0, z:0}
                   ];
  
  var Field = function(htmlEl) {
     
    this.scene = new THREE.Scene(); 
    this.group = new THREE.Object3D();
    this.scene.add( this.group );
    
    this.renderer = null;
    this.camera = null;
    this.controls = null;
    
    this.htmlEl = htmlEl;
    this.webGLinUse = this.setupRenderer();
    htmlEl.appendChild(this.renderer.domElement);
    
    this.setupRoom();

    this.currentCameraPosition = -1;
    this.setupCamera();
    
    this.setupLight();
    
    this.setupBoard();
    
    this.setupSize();
    
    this.render();
    
    var that = this;
    $(window).resize(function(){
      that.setupSize();
    });
  };
  
  Field.prototype = {
      
      /**
       * @private
       */
      setupSize: function() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        if ( (WIDTH/HEIGHT) >  1.5) {
          this.renderer.setSize(WIDTH-(WIDTH*0.075), HEIGHT-(HEIGHT*0.075));
          //this.cssRenderer.setSize(WIDTH-(WIDTH*0.075), HEIGHT-(HEIGHT*0.075));

          this.camera.aspect = 2;
          this.camera.updateProjectionMatrix();
          
        } else {
          var zWide = (WIDTH-(WIDTH*0.075));
          this.renderer.setSize(zWide, zWide/1.77777);
          //this.cssRenderer.setSize(zWide, zWide/1.77777);
          
          this.camera.aspect = 1.77777;
          this.camera.updateProjectionMatrix();
        }
        
        this.render();
      },
      
      /**
       * @private
       */
      setupRenderer: function() {
        var webGl = true;
        try { 
          this.setupWebGL();
        } catch (e) { 
          webGl = false;
          this.setupCanvas();
        }
        
        
        this.renderer.shadowMapEnabled = true;
        this.renderer.sortObjects = false;
        
        return webGl;
      },
      
      /**
       * @private
       */
      setupCamera: function() {
        var v = this.webGLinUse ? 0.1 : 1;
        this.camera = new THREE.PerspectiveCamera(Constants.MAX_SIZE.y, WIDTH/HEIGHT, v, 10000); 
        
        this.controls = new THREE.OrbitControls(this.camera, this.htmlEl);
        
        var that = this;
        this.controls.addEventListener('change', function() {
          that.render();
        });
        
        this.rotateCamera(0);
        this.render();
      },
      
      /**
       * @private
       */
      setupLight: function() {
        // Lighting the scene.
        var light1 = new THREE.DirectionalLight( 0xffffff, 2 );
        light1.position.set( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z);
        this.scene.add( light1 );
        
        var light2 = new THREE.PointLight( 0xffffff, 2 ); 
        light2.position.set( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z );
        this.scene.add( light2 );
        
        var aboveLight = new THREE.DirectionalLight( 0xFFFFFF );
        aboveLight.position.set(0,Constants.MAX_SIZE.y+1,0); //+1 or else when touching the ceiling the shadow is not shown
        aboveLight.target.position.set(0,-Constants.MAX_SIZE.y,0);
        aboveLight.castShadow = true;
        //aboveLight.shadowCameraVisible = true;
        aboveLight.shadowCameraLeft = -Constants.MAX_SIZE.z-Constants.FLOOR_OVERFLOW;
        aboveLight.shadowCameraTop = -Constants.MAX_SIZE.x;
        aboveLight.shadowCameraRight = Constants.MAX_SIZE.z;
        aboveLight.shadowCameraBottom = Constants.MAX_SIZE.x;
        aboveLight.shadowCameraNear = 0;
        aboveLight.shadowCameraFar = Constants.MAX_SIZE.y*2+2; //+2 or else part of the floor might be out of reach 
        aboveLight.shadowBias = -.001;
        aboveLight.shadowMapWidth = 2048;
        aboveLight.shadowMapHeight = 2048;
        aboveLight.shadowDarkness = .95;
        this.scene.add( aboveLight );
        
      },
      
      /**
       * @private
       */
      setupWebGL: function() {
        this.renderer = new THREE.WebGLRenderer(); 
      },
      
      /**
       * @private
       */
      setupCanvas: function() {
        this.renderer = new THREE.CanvasRenderer();
      },
      
      /**
       * @private
       */
      setupRoom: function() {
        
        var floor = new THREE.Mesh(new THREE.PlaneGeometry(Constants.MAX_SIZE.x*2,Constants.MAX_SIZE.z*2+Constants.FLOOR_OVERFLOW),new THREE.MeshLambertMaterial( { color: 0x00ff00 } ));
        floor.position.set(0,-Constants.MAX_SIZE.y,Constants.FLOOR_OVERFLOW/2);
        floor.rotation.x = Math.PI / -2;
        floor.receiveShadow = true;
        this.group.add( floor );
        
        var backWall = new THREE.Mesh(new THREE.PlaneGeometry(Constants.MAX_SIZE.x*2,Constants.MAX_SIZE.y*2),new THREE.MeshLambertMaterial( { color: 0x00ff00 } ));
        backWall.position.set(0,0,-Constants.MAX_SIZE.z);
        backWall.receiveShadow = false;
        this.group.add( backWall );
        
        
      },
      
      /**
       * @private
       */
      setupBoard: function() {
        var that = this;
        
        Utils.loadObj("obj/dartboard.obj", "obj/dartboard.obj.mtl", function (object) {
          object.position.set(0,Constants.CENTER_Y,-(Constants.MAX_SIZE.z));
          object.scale.set(Constants.SCALE,Constants.SCALE,Constants.SCALE);
          object.quaternion.set(0,1,0,0);
          that.group.add( object );
          that.render();
        });

      },
      
///////////////////---> end initialization code
      isWebGLinUse: function() {
        return this.webGLinUse;
      },

      render: function() {
        if (this.waitingToRender) {
          return;
        }
        this.waitingToRender = true;
        var that = this;
        requestAnimationFrame(function() {
          that.waitingToRender = false;
          that.controls.update();
          that.renderer.render(that.scene, that.camera); 
          //that.cssRenderer.render(that.cssScene, that.camera); 
        });
      },
      
      rotateCamera: function(dir) {
       
        if (dir == RIGHT) {
          this.currentCameraPosition--;
        } else if (dir == LEFT) {
          this.currentCameraPosition++;
        } else {
          this.currentCameraPosition = dir;
        }
        
       
        if (this.currentCameraPosition >= CAMERA_POSITIONS.length) {
          this.currentCameraPosition = 0;
        } else if(this.currentCameraPosition < 0) {
          this.currentCameraPosition = CAMERA_POSITIONS.length-1;
        }
        
        this.camera.position.set(CAMERA_POSITIONS[this.currentCameraPosition].x,CAMERA_POSITIONS[this.currentCameraPosition].y,CAMERA_POSITIONS[this.currentCameraPosition].z);
        this.camera.lookAt( {x:0,y:0,z:0} );
        
      },
      
      addObject: function(obj) {
        this.group.add(obj);
        this.render();
      },
      
      removeObject: function(obj) {
        this.group.remove(obj);
        this.render();
      }
  };
  
  return Field;
  
});