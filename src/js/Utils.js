define(function() {
  var loader = new THREE.OBJMTLLoader();
  
  function setShadowOnObject(object) {
    object.castShadow = true;
    var children = object.getDescendants();
    for (var i = 0; i < children.length; i++) {
      setShadowOnObject(children[i]);
    }
  }
  
  return {
    
    loadObj: function(obj,mtl,cb) {
      
      loader.load(obj, mtl, function (object) {
        setShadowOnObject(object);
        cb(object);
      } );
    }
    
  };
  
  
  
});