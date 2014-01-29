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
    
    this.webGLinUse = this.setupRenderer();
    htmlEl.appendChild(this.renderer.domElement);
    
    this.setupAxis();

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
        
        
        
        this.controls = new THREE.TrackballControls( this.camera );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = false;
        this.controls.dynamicDampingFactor = 0.3;
        this.controls.keys = [ 65, 83, 68 ];
        
        
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
        aboveLight.position.set(0,Constants.MAX_SIZE.y,0);
        aboveLight.target.position.set(0,-Constants.MAX_SIZE.y,0);
        aboveLight.castShadow = true;
       // aboveLight.shadowCameraVisible = true;
        aboveLight.shadowCameraLeft = -Constants.MAX_SIZE.z;
        aboveLight.shadowCameraTop = -Constants.MAX_SIZE.x;
        aboveLight.shadowCameraRight = Constants.MAX_SIZE.z;
        aboveLight.shadowCameraBottom = Constants.MAX_SIZE.x;
        aboveLight.shadowCameraNear = .1;
        aboveLight.shadowCameraFar = Constants.MAX_SIZE.y*2+1; //+1 or else part of the floor might be out of reach 
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
      setupAxis: function() {
        var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
        
        var plane1 = new THREE.Geometry();
        plane1.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane1.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane1.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane1.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        
        var plane2 = new THREE.Geometry();
        plane2.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane2.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane2.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane2.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        
        var plane3 = new THREE.Geometry();
        plane3.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane3.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane3.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane3.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        
        var plane4 = new THREE.Geometry();
        plane4.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane4.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane4.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane4.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );

        var plane5 = new THREE.Geometry();
        plane5.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane5.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane5.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane5.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        
        var plane6 = new THREE.Geometry();
        plane6.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane6.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane6.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane6.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        
        var plane7 = new THREE.Geometry();
        plane7.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane7.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane7.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        plane7.vertices.push( new THREE.Vector3( Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        
        var plane8 = new THREE.Geometry();
        plane8.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, Constants.MAX_SIZE.z ) );
        plane8.vertices.push( new THREE.Vector3( -Constants.MAX_SIZE.x, -Constants.MAX_SIZE.y, -Constants.MAX_SIZE.z ) );
        
        var line8 = new THREE.Line( plane8, material );
        line8.type = THREE.LinePieces;
        this.group.add( line8 );
        
        var line7 = new THREE.Line( plane7, material );
        line7.type = THREE.LinePieces;
        this.group.add( line7 );
        
        var line5 = new THREE.Line( plane5, material );
        line5.type = THREE.LinePieces;
        this.group.add( line5 );
        
        var line4 = new THREE.Line( plane4, material );
        line4.type = THREE.LinePieces;
        this.group.add( line4 );
        
        var line1 = new THREE.Line( plane1, material );
        line1.type = THREE.LinePieces;
        this.group.add( line1 );
        
        var line2 = new THREE.Line( plane2, material );
        line2.type = THREE.LinePieces;
        this.group.add( line2 );
        
        var line3 = new THREE.Line( plane3, material );
        line3.type = THREE.LinePieces;
        this.group.add( line3 );
        
        var floor = new THREE.Mesh(new THREE.PlaneGeometry(Constants.MAX_SIZE.x*2,Constants.MAX_SIZE.z*2),new THREE.MeshLambertMaterial( { color: 0x00ff00 } ));
        floor.position.set(0,-Constants.MAX_SIZE.y,0);
        floor.rotation.x = Math.PI / -2;
        floor.receiveShadow = true;
        this.group.add( floor );
      },
      
      /**
       * @private
       */
      setupBoard: function() {
        var that = this;
        
        Utils.loadObj("obj/dartboard.obj", "obj/dartboard.obj.mtl", function (object) {
          object.position.set(0,0,-(Constants.MAX_SIZE.z));
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

        this.controls.reset();
        
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