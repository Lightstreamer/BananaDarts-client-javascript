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
define(function() {
  var loader = null;
  
  function setShadowOnObject(object) {
    object.castShadow = true;
    object.receiveShadow = true;
    var children = object.getDescendants();
    for (var i = 0; i < children.length; i++) {
      setShadowOnObject(children[i]);
    }
  }
  
  function checkZero(data) {
    for (var k=0; k<7; k++) {
      if (data[k] != 0) {
        return false;
      }
    }
    
    return true;
  }
  
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  
  function getAudioType() {
    if (typeof Audio != "undefined") {
      var test = new Audio();
      if (test.canPlayType) {
        if (!test.canPlayType("audio/ogg")) {
          if (!test.canPlayType("audio/mp3")) {
            return false;
          }
          return "mp3";
        }
      }
      return "ogg";
    }
    return false;
  }
  var audioType = getAudioType();
  
  return {
    
    loadObj: function(obj,mtl,cb) {
      if (!loader) {
        loader = new THREE.OBJMTLLoader();
      }
      loader.load(obj, mtl, function (object) {
        setShadowOnObject(object);
        cb(object);
      } );
    },
    
    cmToUnit: function(cm) {
      return cm*4.37445319335;
    },
    
    mmsToUnitms: function(mms) {
        //double cms = mms/10; //from cm/s to mm/s
        //double cmms = cms/1000; //from cm/s to cm/ms
        //double unitms = cmToUnit(cmms); //from cm/ms to unit/ms
        
        return this.cmToUnit(mms/10000);
    },
    
    loadSound: function(name) {
      if (audioType === false) {
        return null;
      }
      
      var sound = new Audio("sound/"+name+"."+audioType); 
      sound.load();  
      
      return {
        play: function() {
          sound.cloneNode(true).play();
        }
      };
      
    },
    
    
    
    fromBase64: function(dataToConvert) {

      var o1, o2, o3, h1, h2, h3, h4, bits;
      
      var res = [];
      //var fin = new ArrayBuffer(8);

      if (!dataToConvert) {
        return [];
      }

      dataToConvert += "";

      var i = 0;
      do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(dataToConvert.charAt(i++));
        h2 = b64.indexOf(dataToConvert.charAt(i++));
        h3 = b64.indexOf(dataToConvert.charAt(i++));
        h4 = b64.indexOf(dataToConvert.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        
        if (h3 == 64) {
          res.push(o1);
        } else if (h4 == 64) {
          res.push(o1);
          res.push(o2);
        } else {
          res.push(o1);
          res.push(o2);
          res.push(o3);
        }
      } while (i < dataToConvert.length);
    /*
        j = 0;
        while ( j < res.length)  {
          fin[j] = res[j];
          j++;
        }
    */
        return res;
    },
      
    toDouble: function(data) {

      var sign = 1;
      var exp = 0;
      var man = 1;
      
      if ( checkZero(data) == true ) {
        return 0;
      }
      
      if (data[0] > 128) {
        sign = -1;
      }

      var uno = data[0];
      var due = data[1];
      
      if ( uno > 128 ) {
         uno = uno % 128;
      }
      if (uno >= 64) {
        exp += 1024;
        uno = uno % 64;
      }
      if (uno >= 32) {
        exp += 512;
        uno = uno % 32;
      }
      if (uno >= 16) {
        exp += 256;
        uno = uno % 16;
      }
      if (uno >= 8) {
        exp += 128;
        uno = uno % 8;
      }
      if (uno >= 4) {
        exp += 64;
        uno = uno % 4;
      }
      if (uno >= 2) {
        exp += 32;
        uno = uno % 2;
      }
      if (uno >= 1) {
        exp += 16;
      }
      if (due >= 128) {
        exp += 8;
        due = due % 128;
      }
      if (due >= 64) {
        exp += 4;
        due = due % 64;
      }
      if (due >= 32) {
        exp += 2;
        due = due % 32;
      }
      if (due >= 16) {
        exp += 1;
        due = due % 16;
      }
      
      due = due % 16;
      if (due >= 8) {
        man += 0.5;
        due = due % 8;
      }
      if (due >= 4) {
        man += 0.25;
        due = due % 4;
      }
      if (due >= 2) {
        man += 0.125;
        due = due % 2;
      }
      if (due >= 1) {
        man += 0.0625;
      }
      
      var w = 5;
      var mantiss = man;
      for (var i = 2; i < 8; i++) {
        var b = data[i];
        for (var j = 7; j >= 0; j--) {
          if ( b >= Math.pow(2, j) ) {
            mantiss += 1/Math.pow(2, w);
            b = b % Math.pow(2, j);
            //console.log("Mantissa Alt: " + mantiss + ", w: " + w + ", div: " + Math.pow(2, w) + "," + 1/Math.pow(2, w) + " i:" + i + " j:" + j + " b:" + b);
          }
          w++;
        }
      }
      
      return sign * Math.pow(2, (exp-1023)) * mantiss;
    }

    
  };
  
  
  
});