/*
Copyright (c) Lightstreamer Srl

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
define(["Inheritance","EventDispatcher","./Constants"],
    function(Inheritance,EventDispatcher,Constants) {
  
  /*
  {
    startOpen: true|false,
    closedPosition: {left: Number, top: Number} | jQuery,
    openPosition: {left: Number, top: Number} | jQuery,
    zIndex: Number,
    effect: Constant,
    button: jQuery,
    openOpacity: Number
  }
  */
  
  var FloatingMenu = function(element,conf) {
    this.initDispatcher();
    this.useSynchEvents(true);
    
    this.element = element;
    
    conf = conf || {};
    this.currentlyOpen = conf.startOpen || false;
    this.effect = conf.effect || FloatingMenu.NO_EFFECT;
    this.closedPosition = conf.closedPosition || null;
    this.openPosition = conf.openPosition || null;
    this.zIndex = conf.zIndex || Constants.FLOATING_Z_INDEX.STANDARD;
    this.button = conf.button || null;
    this.openOpacity = conf.openOpacity || 0.9;
    
    this.zoom = 1;
    this.originalHeight = 0;
    this.originalWidth = 0;
    
    this.setup(this.currentlyOpen);
  };
  
  FloatingMenu.WIDTH_HEIGHT_EFFECT = 1;
  FloatingMenu.OPACITY_EFFECT = 2;
  FloatingMenu.WIDTH_EFFECT = 3;
  FloatingMenu.NO_EFFECT = 4;
  
  
  FloatingMenu.prototype = {
    
    setup: function(startOpen) {
      var that = this;
      
      this.element.css("z-index",0);
      this.element.css("position","absolute");
      this.element.css("overflow","hidden");
      
      this.element.show();
      
      this.originalHeight = this.element.outerHeight();
      this.originalWidth = this.element.outerWidth();
      
      if (!startOpen) {
        this.close();
      } else {
        this.open();
      }
      
        this.onResize();
      this.element.css("z-index",this.zIndex);
      
      this.element.on("transitionend",function() {
        if (that.isOpen()) {
          that.element.css("overflow","auto");
        }
      });
      $(window).resize(function() {
        that.onResize();
      });
      
            if (this.button) {
        this.button.click(function() {
          that.toggle();
        });
      }
      
    },
      
      
    isOpen: function() {
      return this.currentlyOpen;
    },
    
    onResize: function() {
      this.zoom=1;
      while (this.zoom > 0 && this.originalWidth*this.zoom > window.innerWidth) {
        this.zoom -= 0.1;
      }
      while (this.zoom > 0 && this.originalHeight*this.zoom > window.innerHeight) {
        this.zoom -= 0.1;
      }
      
      if (this.currentlyOpen) {
        this.open();
      } else {
        this.close();
      }
         
    },
    
    centerElement: function() {
      var left = (window.innerWidth-this.originalWidth*this.zoom)/2;
      var top = (window.innerHeight-this.originalHeight*this.zoom)/2;
      
      this.moveElement(left,top);
      
    },
    
    moveElement: function(left,top,right,bottom) {
      this.element.css("left",left||"");
      this.element.css("top",top||"");
      this.element.css("right",right||"");
      this.element.css("bottom",bottom||"");
    },
    
    moveElementByObj: function(obj) {
      if (obj.offset) {
        this.moveElementByObj(obj.offset());
      } else {
        this.moveElement(obj.left,obj.top,obj.right,obj.bottom);
      }
    },
    
    open: function() {
      if (this.effect == FloatingMenu.WIDTH_HEIGHT_EFFECT) {
        this.element.css("height",this.originalHeight*this.zoom);
        this.element.css("width",this.originalWidth*this.zoom);
      } else if (this.effect == FloatingMenu.WIDTH_EFFECT) {
        this.element.css("width",this.originalWidth*this.zoom);
      } else if (this.effect == FloatingMenu.OPACITY_EFFECT) {
        this.element.css("opacity",this.openOpacity);
      } else {
        this.element.css("display","block");
      }
      
      if (this.openPosition) {
        this.moveElementByObj(this.openPosition);
      } else {
        this.centerElement();
      }
      
      if (!this.currentlyOpen) {
        this.currentlyOpen = true;
        this.dispatchEvent("onOpen");
      }
    },
    
    close: function() {
      this.element.css("overflow","hidden");
      
      if (this.effect == FloatingMenu.WIDTH_HEIGHT_EFFECT) {
        this.element.css("height",0);
        this.element.css("width",0);
      } else if (this.effect == FloatingMenu.WIDTH_EFFECT) {
        this.element.css("width",0);
      } else if (this.effect == FloatingMenu.OPACITY_EFFECT) {
        this.element.css("opacity",0);
      } else {
        this.element.css("display","none");
      }
      
      if (this.closedPosition) {
        this.moveElementByObj(this.closedPosition);
      }
      
      if (this.currentlyOpen) {
        this.currentlyOpen = false;
        this.dispatchEvent("onClose");
      }
      
    },
    
    toggle: function() {
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    }
    
    
  };
  
  Inheritance(FloatingMenu,EventDispatcher,true,true);
  return FloatingMenu;
  
});