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
  
  
  var SEE_THROUGH_MATERIAL = new THREE.MeshBasicMaterial({color: "black",  blending: THREE.NoBlending, opacity:0});
  
  
  var Field = function(htmlEl,toHideWhileFlying) {
     
    this.htmlEl = htmlEl;
    this.toHideWhileFlying = toHideWhileFlying;
    
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
    this.group = new THREE.Object3D();
    this.scene.add( this.group );
    
    this.renderer = null;
    this.cssRenderer = null;
    this.camera = null;
    this.controls = null;
    this.orbitBlocked = true;
    this.orbitEnabled = true;
    
    
    this.setupRenderers(); //may throw
    
    this.setupHtml();
        
    this.setupRoom();

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
  
  /*var cCall = 0;
  var cExe = 0;
  var cChange = 0;
  setInterval(function() {
    console.log(cCall + " - " + cExe + " - " + cChange);
    cExe = cCall = cChange = 0;
  },1000);*/
  
  Field.prototype = {
      
      /**
       * @private
       */
      setupSize: function() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var aspect;
        if (w/h > 1.5) {
          aspect = w / h;
        } else {
          h = w/1.77777;
          aspect = 1.77777;
        }
        
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( w, h );
        this.cssRenderer.setSize( w, h );
        
        this.cssRender();
        this.render();
      },
      
      /**
       * @private
       */
      setupRenderers: function() {
        this.cssRenderer = new THREE.CSS3DRenderer();
        this.renderer = new THREE.WebGLRenderer(); //may throw exception 
        
        this.renderer.shadowMapEnabled = true;
        this.renderer.sortObjects = false;
        this.renderer.setClearColor( "black", 1 );
       
        //this.rendererStats  = new THREEx.RendererStats();
        //this.stats = new Stats();
      },
      
      setupHtml: function() {
        this.cssRenderer.domElement.id = "cssRenderer"; //css is important
        this.htmlEl.appendChild(this.cssRenderer.domElement);
        
        this.renderer.domElement.id = "renderer"; //css is important
        this.cssRenderer.domElement.appendChild(this.renderer.domElement);
        
        /*this.rendererStats.domElement.style.position   = 'absolute';
        this.rendererStats.domElement.style.left  = '0px';
        this.rendererStats.domElement.style.bottom    = '45px';
        this.htmlEl.appendChild( this.rendererStats.domElement );
        
        this.htmlEl.appendChild(this.stats.domElement);*/
      },
      
      /**
       * @private
       */
      setupCamera: function() {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 10000);
        
        this.controls = new THREE.OrbitControls(this.camera, this.htmlEl);
        this.applyOrbitSettings();
        
        var that = this;
        this.controls.addEventListener('change', function() {
          //cChange++;
          that.render();
          that.cssRender();
        });
        
        this.resetCamera();
        this.render();
      },
      
      /**
       * @private
       */
      setupLight: function() {
        // Lighting the scene.
                
        /*var boardLight = new THREE.DirectionalLight(0xffffff, 3.5);
        boardLight.position.set(0,Constants.MAX_SIZE.y/3.5,-Constants.MAX_SIZE.z/1.5);
        boardLight.target.position.set(0,0,-Constants.MAX_SIZE.z);
        boardLight.shadowCameraLeft = -Constants.BOARD_DIAMETER/2;
        boardLight.shadowCameraRight = Constants.BOARD_DIAMETER/2;//40
        boardLight.shadowCameraTop = Constants.BOARD_DIAMETER/1.3;
        boardLight.shadowCameraBottom = -Constants.BOARD_DIAMETER/2;
        boardLight.shadowCameraNear = Constants.BOARD_DIAMETER/2;
        boardLight.shadowCameraFar = Constants.BOARD_DIAMETER/0.6;
        //boardLight.castShadow = true;
        //boardLight.shadowCameraVisible = true;
        this.scene.add(boardLight);*/
        
        var pLight = new THREE.PointLight(0xffffff, 3.5);
        pLight.position.set(0,Constants.MAX_SIZE.y/2,-Constants.MAX_SIZE.z/1.5);
        this.scene.add(pLight);
        
        /*var pLight2 = new THREE.PointLight(0xffffff, 3.5);
        pLight2.position.set(0,Constants.MAX_SIZE.y/2,Constants.MAX_SIZE.z/1.5);
        this.scene.add(pLight2);*/
        
        var pLightLeft = new THREE.PointLight(0xffffff, 0.5);
        pLightLeft.position.set(-Constants.MAX_SIZE.x,Constants.MAX_SIZE.y/2,Constants.MAX_SIZE.z/1.5);
        this.scene.add(pLightLeft);
        
        var pLightRight = new THREE.PointLight(0xffffff, 0.5);
        pLightRight.position.set(Constants.MAX_SIZE.x,Constants.MAX_SIZE.y/2,Constants.MAX_SIZE.z/1.5);
        this.scene.add(pLightRight);
        
        
        var aboveLight = new THREE.DirectionalLight( 0xFFFFFF, 0.1 );
        aboveLight.position.set(Constants.MAX_SIZE.x/3,Constants.MAX_SIZE.y,Constants.MAX_SIZE.z); 
        aboveLight.target.position.set(0,-Constants.MAX_SIZE.y,-Constants.MAX_SIZE.z);
        aboveLight.castShadow = true;
        //aboveLight.shadowCameraVisible = true;
        aboveLight.shadowCameraLeft = -Constants.MAX_SIZE.x*2; 
        aboveLight.shadowCameraTop = Constants.MAX_SIZE.z*2;
        aboveLight.shadowCameraRight = Constants.MAX_SIZE.x;
        aboveLight.shadowCameraBottom = -Constants.MAX_SIZE.z*2;
        aboveLight.shadowCameraNear = 0;
        aboveLight.shadowCameraFar = Constants.MAX_SIZE.y*4;
        aboveLight.shadowMapWidth = 4096;
        aboveLight.shadowMapHeight = 4096;
        aboveLight.shadowBias = -.001;
        aboveLight.shadowDarkness = .85;
        
      
        
        this.scene.add( aboveLight );
        
      },
      
      /**
       * @private
       */
      setupRoom: function() {
        
        //textures
        var floorTexture = THREE.ImageUtils.loadTexture("images/floor.jpg");
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( 8, 5 );
        
        var ceilingTexture = THREE.ImageUtils.loadTexture("images/ceiling.jpg");
        ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set( 4, 3 );
        
        var leftWallTexture = THREE.ImageUtils.loadTexture("images/leftwall.jpg");
        var backWallTexture = THREE.ImageUtils.loadTexture("images/wall.jpg");
        var rightWallTexture = THREE.ImageUtils.loadTexture("images/rightwall.jpg");
     
        //create materials using textures
        var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture});
        var ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture});
        var leftWallMaterial = new THREE.MeshBasicMaterial({ map: leftWallTexture});
        var backWallMaterial =  new THREE.MeshBasicMaterial({ map: backWallTexture});
        var rightWallMaterial = new THREE.MeshBasicMaterial({ map: rightWallTexture});
        
        //prepare geometries
        var sideWallGeometry = new THREE.PlaneGeometry(Constants.MAX_SIZE.z*2+Constants.FLOOR_OVERFLOW,Constants.MAX_SIZE.y*2);
        var floorCeilingGeometry = new THREE.PlaneGeometry(Constants.MAX_SIZE.x*2,Constants.MAX_SIZE.z*2+Constants.FLOOR_OVERFLOW);
        var backWallGeometry = new THREE.PlaneGeometry(Constants.MAX_SIZE.x*2,Constants.MAX_SIZE.y*2);
        
        //put everything together
        var floor = new THREE.Mesh(floorCeilingGeometry,floorMaterial);
        floor.position.set(0,-Constants.MAX_SIZE.y,Constants.FLOOR_OVERFLOW/2);
        floor.rotation.x = Math.PI / -2;
        floor.receiveShadow = true;
        this.group.add(floor);
        
        var ceiling = new THREE.Mesh(floorCeilingGeometry,ceilingMaterial);
        ceiling.position.set(0,Constants.MAX_SIZE.y,Constants.FLOOR_OVERFLOW/2);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.receiveShadow = true;
        this.group.add(ceiling);
                
        var backWall = new THREE.Mesh(backWallGeometry,backWallMaterial);
        backWall.position.set(0,0,-Constants.MAX_SIZE.z);
        backWall.receiveShadow = true;
        this.group.add(backWall);
        
        var leftWall = new THREE.Mesh(sideWallGeometry,leftWallMaterial);
        leftWall.position.set(-Constants.MAX_SIZE.x,0,Constants.FLOOR_OVERFLOW/2);
        leftWall.receiveShadow = false;
        leftWall.rotation.y = Math.PI / 2;
        this.group.add(leftWall);
        
        var rightWall = new THREE.Mesh(sideWallGeometry,rightWallMaterial);
        rightWall.position.set(Constants.MAX_SIZE.x,0,Constants.FLOOR_OVERFLOW/2);
        rightWall.receiveShadow = false;
        rightWall.rotation.y = Math.PI / -2;
        this.group.add(rightWall);
        
      },
      
      /**
       * @private
       */
      setupBoard: function() {
        var that = this;
        
        var boardTexture = THREE.ImageUtils.loadTexture("obj/dartboard.jpg");
        var boardMaterial = new THREE.MeshLambertMaterial({map: boardTexture});
        
        Utils.loadObj("obj/dartboard.obj", "obj/dartboard.obj.mtl", function (object) {
          object.position.set(0,Constants.CENTER_Y,-(Constants.MAX_SIZE.z));
          object.quaternion.set(0,1,0,0);
         
          object.children[2].material = boardMaterial;
          
          that.group.add( object );
          that.render();
        });
        
        
        //hack to show a shadow
        var blackMaterial = new THREE.MeshLambertMaterial({color: "black", opacity: 0, transparent: true});
        var boardGeometry = new THREE.CylinderGeometry(Constants.BOARD_DIAMETER/2,Constants.BOARD_DIAMETER/2,1,50,50,false);
        var board = new THREE.Mesh(boardGeometry,blackMaterial);
        board.position.set(0,Constants.CENTER_Y,-(Constants.MAX_SIZE.z)+Constants.BOARD_THICKNESS);
        board.castShadow = true;
        board.rotation.x = Math.PI/-2;
        this.scene.add(board);
        
   
      },
      
///////////////////---> end initialization code

      render: function() {
        //cCall++;
        if (this.waitingToRender) {
          return;
        }
        this.waitingToRender = true;
        var that = this;
        requestAnimationFrame(function() {
          //cExe++;
          that.waitingToRender = false;
          if (that.controls.enabled) {
            that.controls.update();
          }
          that.renderer.render(that.scene, that.camera); 
          //that.rendererStats.update(that.renderer);
          //that.stats.update();
          if (that.waitingToRenderCSS) {
            that.cssRenderer.render(that.cssScene, that.camera);
            that.waitingToRenderCSS = false;
          }
        });
      },
      
      cssRender: function() {
        this.waitingToRenderCSS = true;
        this.render();
      },
      
      resetCamera: function() {
        this.moveCamera(0,Constants.INITIAL_CAMERA_POS_Y,Constants.INITIAL_CAMERA_POS_Z);
        this.pointCamera(0,Constants.INITIAL_CAMERA_POS_Y,0);
      },
      
      moveCameraToward: function(x,y,z) {
        var diffZ = Math.abs(this.camera.position.z - z);
        if (diffZ > Constants.MAX_MOVE_CAMERA_STEP) {
          if (z > this.camera.position.z) {
            z = this.camera.position.z+Constants.MAX_MOVE_CAMERA_STEP;
          } else {
            z = this.camera.position.z-Constants.MAX_MOVE_CAMERA_STEP;
          }
        }
        
        this.moveCamera(x,y,z);
      },
      
      moveCamera: function(x,y,z) {
        this.camera.position.set(x,y,z);
        this.render();
        this.cssRender();
      },
      
      pointCamera: function(x,y,z) {
        this.camera.lookAt( {x:x,y:y,z:z} );
        this.controls.target.set(x,y,z);
        this.render();
        this.cssRender();
      },
      
      enableOrbit: function(enabled) {
        if (enabled != this.orbitEnabled) {
          this.orbitEnabled = enabled;
          this.applyOrbitSettings();
        }
      },
      
      blockOrbit: function(blocked) {
        if (blocked != this.orbitBlocked) {
          this.orbitBlocked = blocked;
          this.applyOrbitSettings();
        }
      },
      
      applyOrbitSettings: function() {
        this.controls.enabled = !this.orbitBlocked && this.orbitEnabled;
      },
      
      addObject: function(obj) {
        this.group.add(obj);
        this.render();
      },
      
      removeObject: function(obj) {
        this.group.remove(obj);
        this.render();
      },

      addCSSObject: function(obj) {
        //create the see-through panel that will permit the mix of html in the 3D scene
        var rect = obj.element.getBoundingClientRect();
        var panelGeometry = new THREE.PlaneGeometry(rect.width-10,rect.height-10); //if we don't give a margin (-10) we see white lines around the html snippet. take care to have 5 useless padding pixels in that html
        var panel = new THREE.Mesh(panelGeometry,SEE_THROUGH_MATERIAL);
        panel.position = obj.position;
        panel.rotation = obj.rotation;
        panel.quaternion = obj.quaternion;
        this.scene.add(panel);
        
        this.cssScene.add(obj);
        this.cssRender();
      },
      
      removeCSSObject: function(obj) {
        this.cssScene.remove(obj);
        this.cssRender();
      },
      
      hideMenu: function(hide) {
        if (hide) {
          this.toHideWhileFlying.hide();
        } else {
          this.toHideWhileFlying.show();
        }
      }
  };
  
  return Field;
  
});