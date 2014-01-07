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
define(function() {
  
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  
  var Field = function(htmlEl) {
     
    this.scene = new THREE.Scene(); 
    this.group = new THREE.Object3D();
    this.scene.add( this.group );
    
    this.renderer = null;
    this.camera = null;
    
    this.webGLinUse = this.setupRenderer();
    htmlEl.appendChild(this.renderer.domElement);
    
    this.setupAxis();

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
        
        
        
        this.renderer.sortObjects = false;
        
        return webGl;
      },
      
      /**
       * @private
       */
      setupCamera: function() {
        var v = this.webGLinUse ? 0.1 : 1;
        this.camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, v, 10000); 
        this.camera.lookAt( {x:0,y:0,z:0} );
        this.camera.position.z = 140;
      },
      
      /**
       * @private
       */
      setupLight: function() {
        // Lighting the scene.
        var lightF = new THREE.DirectionalLight( 0xffffff, 2 );
        lightF.position.set( 160, 90, 120 );
        this.scene.add( lightF );
        
        var light = new THREE.PointLight( 0xffffff, 2 ); 
        light.position.set( -160, -90, -120 );
        this.scene.add( light );
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
        var material = new THREE.LineBasicMaterial( { color: 0x2f2f2f, opacity: 0.2 } );
        
        var plane1 = new THREE.Geometry();
        plane1.vertices.push( new THREE.Vector3( 80, -45, 60 ) );
        plane1.vertices.push( new THREE.Vector3( -80, -45, 60 ) );
        plane1.vertices.push( new THREE.Vector3( -80, 45, 60 ) );
        plane1.vertices.push( new THREE.Vector3( 80, 45, 60 ) );
        
        var plane2 = new THREE.Geometry();
        plane2.vertices.push( new THREE.Vector3( 80, -45, -60 ) );
        plane2.vertices.push( new THREE.Vector3( -80, -45, -60 ) );
        plane2.vertices.push( new THREE.Vector3( -80, 45, -60 ) );
        plane2.vertices.push( new THREE.Vector3( 80, 45, -60 ) );
        
        var plane3 = new THREE.Geometry();
        plane3.vertices.push( new THREE.Vector3( -80, -45, 60 ) );
        plane3.vertices.push( new THREE.Vector3( -80, 45, 60 ) );
        plane3.vertices.push( new THREE.Vector3( -80, -45, -60 ) );
        plane3.vertices.push( new THREE.Vector3( -80, 45, -60 ) );
        
        var plane4 = new THREE.Geometry();
        plane4.vertices.push( new THREE.Vector3( -80, 45, 60 ) );
        plane4.vertices.push( new THREE.Vector3( -80, 45, -60 ) );
        plane4.vertices.push( new THREE.Vector3( 80, 45, 60 ) );
        plane4.vertices.push( new THREE.Vector3( 80, 45, -60 ) );

        var plane5 = new THREE.Geometry();
        plane5.vertices.push( new THREE.Vector3( 80, 45, 60 ) );
        plane5.vertices.push( new THREE.Vector3( 80, 45, -60 ) );
        plane5.vertices.push( new THREE.Vector3( 80, -45, -60 ) );
        plane5.vertices.push( new THREE.Vector3( 80, -45, 60 ) );
        
        var plane6 = new THREE.Geometry();
        plane6.vertices.push( new THREE.Vector3( -80, -45, -60 ) );
        plane6.vertices.push( new THREE.Vector3( -80, -45, 60 ) );
        plane6.vertices.push( new THREE.Vector3( 80, -45, 60 ) );
        plane6.vertices.push( new THREE.Vector3( 80, -45, -60 ) );
        
        var plane7 = new THREE.Geometry();
        plane7.vertices.push( new THREE.Vector3( 80, 45, 60 ) );
        plane7.vertices.push( new THREE.Vector3( 80, -45, 60 ) );
        plane7.vertices.push( new THREE.Vector3( 80, 45, -60 ) );
        plane7.vertices.push( new THREE.Vector3( 80, -45, -60 ) );
        
        var plane8 = new THREE.Geometry();
        plane8.vertices.push( new THREE.Vector3( -80, -45, 60 ) );
        plane8.vertices.push( new THREE.Vector3( -80, -45, -60 ) );
        
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
      },
      
      /**
       * @private
       */
      setupBoard: function() {
       var that = this;
        
        var loader = new THREE.OBJMTLLoader();
        loader.load("obj/dartboard.obj", "obj/dartboard.obj.mtl", function ( object ) {

          object.position.set(0,0,-59);
          object.scale.set(0.45,0.45,0.45);
          object.quaternion.set(0,1,0,0);
          that.group.add( object );
          that.render();
        } );

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
          that.renderer.render(that.scene, that.camera); 
          //that.cssRenderer.render(that.cssScene, that.camera); 
        });
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