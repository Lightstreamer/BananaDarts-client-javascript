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
define(["Inheritance","EventDispatcher"],
    function(Inheritance,EventDispatcher) {
  
  var FloatingMenu = function(element,isOpen,closedElement) {
    this.initDispatcher();
    
    this.zoom = 1;
    this.originalHeight = 0;
    this.originalWidth = 0;
    this.element = element;
    
    this.currentlyOpen = isOpen;
   
    this.closedElement = closedElement;
    
    this.setup(isOpen);
  };
  
  
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
      this.element.css("z-index",10);
      
      this.element.on("transitionend",function() {
        if (that.isOpen()) {
          that.element.css("overflow","auto");
        } 
      });
      $(window).resize(function() {
        that.onResize();
      });
      
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
    
    moveElement: function(left,top) {
      this.element.css("left",left);
      this.element.css("top",top);
    },
    
    open: function() {
      this.element.css("height",this.originalHeight*this.zoom);
      this.element.css("width",this.originalWidth*this.zoom);
     
      this.centerElement();
      
      if (!this.currentlyOpen) {
        this.currentlyOpen = true;
        this.dispatchEvent("onOpen");
      }
    },
    
    close: function() {
      this.element.css("overflow","hidden");
      this.element.css("height",0);
      this.element.css("width",0);
      
      
      if (this.closedElement) {
        var offset = this.closedElement.offset();
        this.moveElement(offset.left,offset.top);
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