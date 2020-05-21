/**
 * @preserve
 * LIGHTSTREAMER - www.lightstreamer.com
 * Lightstreamer Web Client
 * Version 8.0.2 build 1798
 * Copyright (c) Lightstreamer Srl. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0
 *   See http://www.apache.org/licenses/LICENSE-2.0
 * Contains: Executor, EventDispatcher, Inheritance
 */

;(function() {

var lightstreamerExports = (function () {
  'use strict';

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

  var IllegalStateException = /*@__PURE__*/(function() {
    /**
     * Constructs an IllegalStateException with the specified detail message.
     * @constructor
     *
     * @param {String} message short description of the error.
     *
     * @exports IllegalStateException
     * @class Thrown to indicate that a method has been invoked at an illegal or 
     * inappropriate time or that the internal state of an object is incompatible 
     * with the call.
     * <BR>Use toString to extract details on the error occurred.
     */
    var IllegalStateException = function(message) {

      /**
       * Name of the error, contains the "IllegalStateException" String.
       * 
       * @type String
       */
      this.name = "IllegalStateException";

      /**
       * Human-readable description of the error.
       * 
       * @type String
       */
      this.message = message;

    };

    IllegalStateException.prototype = {

        toString: function() {
          return ["[",this.name,this.message,"]"].join("|");
        }
        
    };
    
    return IllegalStateException;
  })();

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

  var Environment = /*@__PURE__*/(function() {
    var isBrowserDocumentVar = (typeof window !== "undefined"  && typeof navigator !== "undefined" && typeof document !== "undefined");
    var isWebWorkerVar = typeof importScripts !== "undefined"; //potentially WebWorkers may appear on node.js
    var isNodeJSVar = typeof process == "object" && (/node(\.exe)?$/.test(process.execPath) || (process.node && process.v8) || (process.versions && process.versions.node && process.versions.v8 ));
    
    if (isBrowserDocumentVar && !document.getElementById) {
      throw new IllegalStateException("Not supported browser");
    }
    /**
     * @exports Environment
     */
    var Environment = {
        
        /**
         * Checks if the code is running inside an HTML document.
         * <BR/>Note that browsers not supporting DOM Level 2 (i.e.: document.getElementById) 
         * are not recognized by this method
         * 
         * @returns {Boolean} true if the code is running inside a Browser document, false otherwise.
         * 
         * @static
         */
        isBrowserDocument: function() {
          return isBrowserDocumentVar;
        },
        
        /**
         * Checks if the code is running inside a Browser. The code might be either running inside a
         * HTML page or inside a WebWorker.
         * <BR/>Note that browsers not supporting DOM Level 2 (i.e.: document.getElementById) 
         * are not recognized by this method
         * 
         * @returns {Boolean} true if the code is running inside a Browser, false otherwise.
         * 
         * @static
         */
        isBrowser: function() {
          return !isNodeJSVar && (isBrowserDocumentVar || isWebWorkerVar);
        },
        
        /**
         * Checks if the code is running inside Node.js.
         * 
         * @returns {Boolean} true if the code is running inside Node.js, false otherwise.
         * 
         * @static
         */
        isNodeJS: function() {
          return !isBrowserDocumentVar && isNodeJSVar;
        },
        
        /**
         * Checks if the code is running inside a WebWorker.
         * 
         * @returns {Boolean} true if the code is running inside a WebWorker, false otherwise.
         * 
         * @static
         */
        isWebWorker: function() {
          return !isBrowserDocumentVar && !isNodeJSVar && isWebWorkerVar;
        },

        /**
         * Checks if the code is not running on a known environment
         * @returns {boolean} true if the code not running on a known environment, false otherwise.
         */
        isOther: function() {
          return !isBrowserDocumentVar && !isNodeJSVar && !isWebWorkerVar;
        },

        /**
         * Helper method that will throw an IllegalStateException if the return value of isBrowserDocument is false.
         * This method is supposedly called as first thing in a module definition.
         * 
         * @throws {IllegalStateException} if this function is not called inside a HTML page. The message of the error
         * is the following: "Trying to load a browser-only module on non-browser environment".
         * 
         * @static
         * 
         * @example
         * define(["Environment"],function(Environment) {
         *   Environment.browserDocumentOrDie();
         *   
         *   //module definition here
         * });
         */
        browserDocumentOrDie: function() {
          if(!this.isBrowserDocument()) {
            throw new IllegalStateException("Trying to load a browser-only module on non-browser environment");
          }
        }
    
    };
    
    Environment["isBrowserDocument"] = Environment.isBrowserDocument;
    Environment["isBrowser"] = Environment.isBrowser;
    Environment["isNodeJS"] = Environment.isNodeJS;
    Environment["isWebWorker"] = Environment.isWebWorker;
    Environment["browserDocumentOrDie"] = Environment.browserDocumentOrDie;
      
    return Environment;
  })();

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

  var Helpers = /*@__PURE__*/(function() {
    var TRIM_REGEXP = new RegExp("^\\s*([\\s\\S]*?)\\s*$");
    var COMMA = new RegExp(",","g");
    var DOT = new RegExp("\\.","g");
    
    /**
     * This module is a motley collection of simple "shortcut" methods
     * @exports Helpers
     */
    var Helpers = {
        
        /**
         * Shortcut for new Date().getTime();
         * 
         * @returns the current timestamp
         */
        getTimeStamp: function() {
          return new Date().getTime();
        },
        
        /**
         * Shortcut for Math.round( Math.random() * max );
         * @param {Number} [max=1000] The max value to be returned
         * @returns the current timestamp
         */
        randomG: function(max) {
          max = max || 1000;
          return Math.round( Math.random() * max );
        },
        
        /**
         * Trims a string
         * @param {String} str the string to be trimmed
         * @returns {String} the trimmed string
         */
        trim: function(str) {
          return str.replace(TRIM_REGEXP,"$1");
        },
        
        /**
         * Gets a string and interpret it as a Number. The given string may contain dots or commas to separate decimals
         * @param {String} val the string to be converted
         * @param {Boolean} [commaAsDecimalSeparator=false] true to interpret the commas as decimal separators, false to interpret dots as decimal separators
         * @returns {Number} the interpreted number
         * @example
         * Helpers.getNumber("3.432.771,201",true) == 3432771.201
         */
        getNumber: function(val, commaAsDecimalSeparator) {
          if (val) {
            if (!val.replace) {
              return val;
            }
            if (commaAsDecimalSeparator) {
              val = val.replace(DOT, "");
              val = val.replace(COMMA, ".");
            } else {
              val = val.replace(COMMA, "");
            }
            return new Number(val);
          }
          return 0;
        },
        
        /**
         * Shortcut for val.join && typeof(val.join) == "function"
         * @param {Object} val the object to be verified 
         * @returns {Boolean} true if val is an array, false otherwise
         */
        isArray: function(val) {
          return val && val.join && typeof(val.join) == "function";
        },
        
        /**
         * Adds a handler for a browser event. The capture flag is set to false.
         * @param {Object} obj the element to be listened to.
         * @param {String} evnt the event to be listened to.
         * @param {Function} handler the function to be called
         * @returns {Boolean} true if the event was registered, false otherwise.
         * @example 
         * Helpers.addEvent(window, "load", function(){});
         */
        addEvent: function(obj, evnt, handler){ 
          if (!Environment.isBrowserDocument()) {
            return false;
          }
          if (typeof obj.addEventListener != "undefined") {
            obj.addEventListener(evnt, handler, false);
            
          } else if (typeof obj.attachEvent != "undefined") { //old IE
            obj.attachEvent("on" + evnt, handler);
          } 
          return true;
        },
        
        /**
         * Removes a handler for a browser event. 
         * @param {Object} obj the element that is listened to.
         * @param {String} evnt the event that is listened to.
         * @param {Function} handler the function that is called
         * @returns {Boolean} true if the event was removed, false otherwise.
         */
        removeEvent: function(obj, evnt, handler){ 
          if (!Environment.isBrowserDocument()) {
            return false;
          }
          if (typeof obj.removeEventListener != "undefined") {
            obj.removeEventListener(evnt, handler, false);
            
          } else if (typeof obj.detachEvent != "undefined") { //old IE
            obj.detachEvent("on" + evnt, handler);
          } 
          return true;
        } 
    };
    
    Helpers["getTimeStamp"] = Helpers.getTimeStamp;
    Helpers["randomG"] = Helpers.randomG;
    Helpers["trim"] = Helpers.trim;
    Helpers["getNumber"] = Helpers.getNumber;
    Helpers["isArray"] = Helpers.isArray;
    Helpers["addEvent"] = Helpers.addEvent;
    Helpers["removeEvent"] = Helpers.removeEvent;
    
    return Helpers;
  })();

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

  var BrowserDetection = /*@__PURE__*/(function() {
    //You'll find strange comments near the methods declarations; We use such comments to keep track of why are we using such browser sniffing 
    
    
   /* 
       stuff we never used or used in the past
     
        var is_icab = (window.ScriptEngine && (ScriptEngine().indexOf("InScript") > -1));
        var is_icab2down = (is_icab && !document.createElement);
        var is_icab3up = (is_icab && document.createElement);
        
        var is_konqueror = (navigator.vendor == "KDE")||(document.childNodes)&&(!document.all)&&(!navigator.taintEnabled);
        var is_safari = (document.childNodes)&&(!document.all)&&(!navigator.taintEnabled)&&(!navigator.accentColorName);
        var is_omniweb45plus = (document.childNodes)&&(!document.all)&&(!navigator.taintEnabled)&&(navigator.accentColorName);
        
        var is_nn6up = (navigator.product == "Gecko");
        var is_nn6 = (navigator.product == "Gecko" && !window.find);
        var is_nn7 = (navigator.product == "Gecko" && window.find);
    */
    //20110909 removed isOldKHTML and isIE5 detections. 
    //20130813 removed isProbablyWinPhone7 detection
    
    //null means "not yet checked", while false means that we are not on such browser; if we're not on a browser at all
    //we can directly set everything to false
    var INIT_VALUE = Environment.isBrowser() ? null : false;

    var LOW_UA = Environment.isBrowser() ? navigator.userAgent.toLowerCase() : null;
    
    function getSolution(myVer,reqVer,less) {
      if(!reqVer || !myVer) {
        return true;
      } else if (less === true) {
        // the given version or less
        return myVer <= reqVer;
      } else if (less === false) {
        //the given version or more 
        return myVer >= reqVer;
      } else {
        //exactly the given version
        return myVer == reqVer;
      }
    }
    
    function doUACheck(checkString) {
      return LOW_UA.indexOf(checkString) > -1;
    }
    
    function getSimpleUACheckFunction(checkString) {
      var resultVar = INIT_VALUE;
      return function() {
        if (resultVar === null) {
          resultVar = doUACheck(checkString);
        }
        return resultVar;
        
      };
    }  
    function getChainedANDFunction(funs) {
      var resultVar = INIT_VALUE;
      return function() {
        if (resultVar === null) {
          resultVar = true;
          for (var i=0; i<funs.length; i++) {
            resultVar = resultVar && funs[i]();
          }
        }
        return resultVar;
      };
    }
    function getChainedORFunction(funs) {
      var resultVar = INIT_VALUE;
      return function() {
        if (resultVar === null) {
          resultVar = false;
          for (var i=0; i<funs.length; i++) {
            resultVar = resultVar || funs[i]();
          }
        }
        return resultVar;
      };
    }
    
    function getVersionedFunction(preCheckFunction,versionExtractionFunction) {
      var isBrowser = INIT_VALUE;
      var browserVersion = INIT_VALUE; 
      return function(requestedVersion,orLowerFlag){
        if (isBrowser === null) {
          isBrowser = preCheckFunction();
          browserVersion = isBrowser ? versionExtractionFunction() : null;
        }
        return isBrowser ? getSolution(browserVersion,requestedVersion,orLowerFlag) : false;
      };
    }
    
    function getExtractVersioByRegexpFunction(regexp) {
      var isBrowser = INIT_VALUE;
      return function() {
        if (isBrowser === null) {
          var res = regexp.exec(LOW_UA);
        
          if (res && res.length >= 2) {
            return res[1];  
          }
        }
        return null;
      };
    }
    
    function getOperaVersion() {
      if (!opera.version) {
        //pre 7.6
        //we do not need to detect Opera 6 so we're cool like this
        return 7;
      } else {
        //> 7.6
        var verStr = opera.version();
        verStr = verStr.replace(new RegExp("[^0-9.]+","g"), "");
        
        return parseInt(verStr);
      }
           //side NOTE: opera 7 mobile does not have opera.postError
    }
    
    function hasOperaGlobal() {
      return typeof opera != "undefined";
    }
      
    function getNotFunction(f) {
      return function() {
        return !f();
      };
    }
    
    
    var khtmlVar = INIT_VALUE;
    
    /**
     * Simple module that can be used to try to detect the browser in use.If possible the use of this module should be avoided:
     * it should only be used if the behavior can't be guessed using feature detection. The module does not contain an extensive list
     * of browsers, new method were added only when needed in the Lightstreamer JavaScript Client library. 
     * <br/>There are two kinds of methods, one does simply recognize the browsers, the other can also discern the browser version.
     * As most of the methods are based on User Agent inspections all the method names contain the "probably" word to recall their
     * intrinsic weakness.
     * @exports BrowserDetection
     */
    var BrowserDetection = {
        /**
         * Check if the browser in use is probably a rekonq or not
         * @method
         * @return {Boolean} true if probably a rekonq, false if probably not.
         */
        isProbablyRekonq: getSimpleUACheckFunction("rekonq"),  //used by isProbablyApple thus "spin fix"
        /**
         * Check if the browser in use is probably a WebKit based browser or not
         * @method
         * @return {Boolean} true if probably a WebKit based browser, false if probably not.
         */
        isProbablyAWebkit: getSimpleUACheckFunction("webkit"),//iframe generation
        /**
         * Check if the browser in use is probably a Playstation 3 browser or not
         * @method
         * @return {Boolean} true if probably a Playstation 3 browser, false if probably not.
         */
        isProbablyPlaystation: getSimpleUACheckFunction("playstation 3"),  //expected streaming behavior
        /**
         * Check if the browser in use is probably a Chrome (or Chrome tab)  or not. A specific version or version range can be requested.
         * @method
         * @param {Number=} requestedVersion The version to be checked. If not specified any version will do.
         * @param {Boolean=} orLowerFlag true to check versions up to the specified one, false to check for greater versions; the specified version
         * is always included. If missing only the specified version is considered.
         * @return {Boolean} true if the browser is probably the correct one, false if probably not.
         */
        isProbablyChrome: getVersionedFunction( 
                                                    getSimpleUACheckFunction("chrome/"),
                                                    getExtractVersioByRegexpFunction(new RegExp("chrome/([0-9]+)","g"))
                                                    ),  // iframe content generation / used by isProbablyApple / used by isProbablyAndroid / windows communication
        /**
         * Check if the browser in use is probably a KHTML browser or not
         * @method
         * @return {Boolean} true if probably a KHTML browser, false if probably not.
         */
        isProbablyAKhtml: function() {
          if (khtmlVar === null) {
            khtmlVar = (document.childNodes) && (!document.all) && (!navigator.taintEnabled) && (!navigator.accentColorName);
          }
          return khtmlVar;
        }, //hourglass trick
        /**
         * Check if the browser in use is probably a Konqueror or not. A specific version or version range can be requested.
         * @method
         * @param {Number=} requestedVersion The version to be checked. If not specified any version will do.
         * @param {Boolean=} orLowerFlag true to check versions up to the specified one, false to check for greater versions; the specified version
         * is always included. If missing only the specified version is considered.
         * @return {Boolean} true if the browser is probably the correct one, false if probably not.
         */
        isProbablyKonqueror: getVersionedFunction( 
                                                    getSimpleUACheckFunction("konqueror"),
                                                    getExtractVersioByRegexpFunction(new RegExp("konqueror/([0-9.]+)","g"))
                                                    ),  //iframe communications / iframe content generation
        /**
         * Check if the browser in use is probably an Internet Explorer or not. A specific version or version range can be requested.
         * @method
         * @param {Number=} requestedVersion The version to be checked. If not specified any version will do.
         * @param {Boolean=} orLowerFlag true to check versions up to the specified one, false to check for greater versions; the specified version
         * is always included. If missing only the specified version is considered.
         * @return {Boolean} true if the browser is probably the correct one, false if probably not.
         */                                                 
        isProbablyIE: function(requestedVersion,orLowerFlag){
          if (
                  getVersionedFunction(
                          getSimpleUACheckFunction("msie"), 
                          getExtractVersioByRegexpFunction(new RegExp("msie\\s"+"("+"[0-9]+"+")"+"[.;]","g"))
                  )(requestedVersion,orLowerFlag)
                  ||
                  getVersionedFunction(
                          getSimpleUACheckFunction("rv:11.0"),
                          function() { return "11"; }
                  )(requestedVersion,orLowerFlag)
                  ) {
            return true;
          } else {
            return false;
          }
        },  //color name resolution / eval isolation / hourglass trick / expected streaming behavior / iframe communication / iframe domain handling / iframe creation
        /**
         * Check if the browser in use is probably an Internet Explorer 11 or not.
         * @method
         * @return {Boolean} true if the browser is probably the correct one, false if probably not.
         */                                                 
        isProbablyEdge: getSimpleUACheckFunction("edge"), // expected streaming behavior
        /**
         * Check if the browser in use is probably a Firefox or not. A specific version or version range can be requested.
         * @method
         * @param {Number=} requestedVersion The version to be checked. If not specified any version will do.
         * @param {Boolean=} orLowerFlag true to check versions up to the specified one, false to check for greater versions; the specified version
         * is always included. If missing only the specified version is considered.
         * @return {Boolean} true if the browser is probably the correct one, false if probably not.
         */  
        isProbablyFX: getVersionedFunction(
                                           getSimpleUACheckFunction("firefox"),
                                           getExtractVersioByRegexpFunction(new RegExp("firefox\\/(\\d+\\.?\\d*)"))
                                           ), //mad check
        /**
         * Check if the browser in use is probably an old Opera (i.e.: up to the WebKit switch) or not. A specific version or version range can be requested.
         * @method
         * @param {Number=} requestedVersion The version to be checked. If not specified any version will do.
         * @param {Boolean=} orLowerFlag true to check versions up to the specified one, false to check for greater versions; the specified version
         * is always included. If missing only the specified version is considered.
         * @return {Boolean} true if the browser is probably the correct one, false if probably not.
         */                                          
        isProbablyOldOpera: getVersionedFunction(hasOperaGlobal,getOperaVersion) //autoscroll / expected streaming behavior / windows communication / onload expectations / iframe communications / iframe content generation / iframe generation
    };
    
    /**
     * Check if the browser in use is probably an Android stock browser or not
     * @method
     * @return {Boolean} true if probably an Android stock browser, false if probably not.
     */
    BrowserDetection.isProbablyAndroidBrowser = getChainedANDFunction([
                                                         getSimpleUACheckFunction("android"),
                                                         BrowserDetection.isProbablyAWebkit,
                                                         getNotFunction(BrowserDetection.isProbablyChrome)
                                                         ]);//spin fix / connection behavior handling
     /**
      * Check if the browser in use is probably an Opera Mobile or not
      * @method
      * @return {Boolean} true if probably a an Opera Mobile, false if probably not.
      */
     BrowserDetection.isProbablyOperaMobile = getChainedANDFunction([
                                                      BrowserDetection.isProbablyOldOpera,
                                                      getSimpleUACheckFunction("opera mobi")
                                                      ]); //expected test results
       
      /**
       * Check if the browser in use is probably an Apple Browser (i.e. Safari or Safari Mobile) or not. A specific version or version range can be requested.
       * @method
       * @param {Number=} requestedVersion The version to be checked. If not specified any version will do.
       * @param {Boolean=} orLowerFlag true to check versions up to the specified one, false to check for greater versions; the specified version
       * is always included. If missing only the specified version is considered.
       * @return {Boolean} true if the browser is probably the correct one, false if probably not.
       */ 
      BrowserDetection.isProbablyApple = getVersionedFunction( 
                                          getChainedANDFunction([ // safari + (ipad || iphone || ipod || (!android+!chrome+!rekonq))
                                              getSimpleUACheckFunction("safari"),
                                              getChainedORFunction([
                                                                    getSimpleUACheckFunction("ipad"),
                                                                    getSimpleUACheckFunction("iphone"),
                                                                    getSimpleUACheckFunction("ipod"),
                                                                    getChainedANDFunction([
                                                                                           getNotFunction(BrowserDetection.isProbablyAndroidBrowser),
                                                                                           getNotFunction(BrowserDetection.isProbablyChrome),
                                                                                           getNotFunction(BrowserDetection.isProbablyRekonq)])
                                                                    ])
                                              ]),
                                              getExtractVersioByRegexpFunction(new RegExp("version\\/(\\d+\\.?\\d*)"))
                                            ); //spin fix / windows communication
    
    BrowserDetection["isProbablyRekonq"] = BrowserDetection.isProbablyRekonq;
    BrowserDetection["isProbablyChrome"] = BrowserDetection.isProbablyChrome;
    BrowserDetection["isProbablyAWebkit"] = BrowserDetection.isProbablyAWebkit;
    BrowserDetection["isProbablyPlaystation"] = BrowserDetection.isProbablyPlaystation;
    BrowserDetection["isProbablyAndroidBrowser"] = BrowserDetection.isProbablyAndroidBrowser;
    BrowserDetection["isProbablyOperaMobile"] = BrowserDetection.isProbablyOperaMobile;
    BrowserDetection["isProbablyApple"] = BrowserDetection.isProbablyApple;
    BrowserDetection["isProbablyAKhtml"] = BrowserDetection.isProbablyAKhtml;
    BrowserDetection["isProbablyKonqueror"] = BrowserDetection.isProbablyKonqueror;
    BrowserDetection["isProbablyIE"] = BrowserDetection.isProbablyIE;
    BrowserDetection["isProbablyEdge"] = BrowserDetection.isProbablyEdge;
    BrowserDetection["isProbablyFX"] = BrowserDetection.isProbablyFX;
    BrowserDetection["isProbablyOldOpera"] = BrowserDetection.isProbablyOldOpera;
    return BrowserDetection;
  })();

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

  var List = /*@__PURE__*/(function() {  
    /**
     * Creates an empty List instance
     * @constructor
     *
     * @exports List
     * @class Very simple Array-backed List implementation.<br/>
     * It is discouraged the use of this class to handle big lists. 
     */
    var List = function() {
      this.data = [];
    };
    
    List.prototype = {
        
      /**
       * Adds the element to the end of the list (using Array.push).
       * Each element can be added multiple times; in such case it will be added to the list multiple times
       * 
       * @param {Object} newEl The element to be added
       */
      add: function(newEl) {
        this.data.push(newEl);
      },
      
      /**
       * Removes the first occurrence of the specified object in the List.<br/>
       * A linear search is performed to find the element; a non-strict comparison ( == )
       * is performed to identify the element. 
       * 
       * @param {Object} newEl The element to be removed
       * 
       * @returns {Boolean} true if element was found and deleted, false otherwise
       */
      remove: function(remEl) {
        var i = this.find(remEl);
        if (i < 0) {
          return false;
        }
        this.data.splice(i,1);
        return true;
      },

      /**
       * Checks if an element is in the list
       *
       * @param {Object} el the element to be searched
       *
       * @returns {Boolean} true if element was found, false otherwise
       */
      contains: function(el) {
        return this.find(el) >= 0;
      },

      /**
       * @private
       */
      find: function(el) {
        for (var i=0; i<this.data.length; i++) {
          if (this.data[i] === el) {
            return i;
          }
        }
        return -1;
      },
      
      /**
       * Executes a given callback passing each element of the list as the only
       * call parameter.<br/>  
       * Callbacks are executed synchronously before the method returns: calling 
       * {@link List#add} or {@link List#remove} during callback execution may result in
       * a wrong iteration.
       * 
       * @param {Function} cb The callback to be called.
       */
      forEach: function(cb) {
        for (var i=0; i<this.data.length; i++) {
          cb(this.data[i]);
        }
      },
      
      /**
       * Returns a copy of the internal array.
       * 
       * @returns {Array} A copy of the original array.
       */
      asArray: function() {
        return [].concat(this.data);
      },
      
      /**
       * Resets the list by re-instantiating the internal array.
       */
      clean: function() {
        this.data = [];
      }
      
    };
    
    //exports
    List.prototype["add"] = List.prototype.add;
    List.prototype["remove"] = List.prototype.remove;
    List.prototype["forEach"] = List.prototype.forEach;
    List.prototype["asArray"] = List.prototype.asArray;
    List.prototype["clean"] = List.prototype.clean;
    
    
    return List;
  })();

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

  var EnvironmentStatus = /*@__PURE__*/(function() {
    //do not use EventDispatcher/Executor to avoid circular dependencies hell
      
    var onunloadFunctions = new List();
    var onloadFunctions = new List();  
    var onbeforeunloadFunctions = new List();
    var controlLoadTimeout = 1000;
    
    var isDOMLoaded = false;
    
    //closure compiler trick -->
    var names = {
      onloadDone : "onloadDone",
      onloadInprogress : "onloadInprogress",
      unloaded : "unloaded",
      unloading : "unloading",
      preunloading : "preunloading"
    };
    var reverse = {};
    for (var i in names) {
      reverse[names[i]] = i;
    }
    //<-- closure compiler trick
   
    
    function getOnloadClosure(that) {
      return getEventClosure(that,reverse['onloadDone'],reverse['onloadInprogress'],onloadFunctions,'onloadEvent');
    }
    
    function getUnloadClosure(that) {
      return getEventClosure(that,reverse['unloaded'],reverse['unloading'],onunloadFunctions,'unloadEvent');
    }
    
    function getBeforeUnloadClosure(that) {
      return getEventClosure(that,reverse['preunloading'],reverse['preunloading'],onbeforeunloadFunctions,'preUnloadEvent');
    }
    
    
    function getEventClosure(that,toCheck,toSet,toExe,methodName) {
      return function() {
        if (that[toCheck]) {
          return;
        }
        that[toSet] = true;
        
        toExe.forEach(function(elToExe) {
          try {
            singleEventExecution(elToExe,methodName);
          } catch (_e) {
          }
        });
        
        if (toCheck != 'preunloading') {
          toExe.clean();
        }

        that[toCheck] = true;
        that[toSet] = false;
      };
      
    }
    
    function singleEventExecution(elToExe,methodName) {
      if (elToExe[methodName]) {
        elToExe[methodName]();
      } else {
        elToExe();
      }
    }
    
    function asynchSingleEventExecution(elToExe,methodName) { 
      setTimeout(function() {
        singleEventExecution(elToExe,methodName);
      },0);
    }
    
    function executeLater(what,when,who,how) { 
      setTimeout(function() {
        if (who) {
          if (how) {
            what.apply(who,how);
          } else {
            what.apply(who);
          }
        } else if (how) {
          what.apply(null, how);
        } else {
          what();
        }
      },when);
    }
    
    function DOMloaded() {
      isDOMLoaded = true; //no need to initialize it anywhere
    }
      
    /**
     * Tries to track the loading status of the page. It may fallback to using timeouts or DOMContentLoaded events to address browser compatibilities: in such
     * cases there is a chance that the registered onload handlers are fired before the actual onload is. Also unload and beforeunload may not fire at all.
     * @exports EnvironmentStatus
     */
    var EnvironmentStatus = {
      /**
       * @private
       */
      onloadDone: false,
      /**
       * @private
       */
      onloadInprogress: false,
      /**
       * @private
       */
      unloaded: false,
      /**
       * @private
       */
      unloading: false,
      /**
       * @private
       */
      preunloading: false,
      
      /**
       * Checks if the load event has been fired.
       * @returns {Boolean} true if the load event has already been fired, false otherwise.
       */
      isLoaded: function() {
        return this.onloadDone;
      },
      /**
       * Checks if the unload event has been fired.
       * @returns {Boolean} true if the unload event has already been fired, false otherwise.
       */
      isUnloaded : function() {
        return this.unloaded;
      },
      /**
       * Checks if the unload event is currently being handled.
       * @returns {Boolean} true if the unload event is currently being handled, false otherwise.
       */
      isUnloading: function() {
        return this.unloading;
      },
      
      /**
       * Adds a handler for the load event. If the event was already fired the handler is sent in a setTimeout (with a 0 timeout).
       * @param {Function|EnvironmentStatusListener} the function to be executed or an object containing the onloadEvent function to be executed. 
       */
      addOnloadHandler: function(f) {
        if (this.isPreOnload()) {
          onloadFunctions.add(f);
        } else {
          asynchSingleEventExecution(f,'onloadEvent');
        }
      },
      
      /**
       * Adds a handler for the unload event. If the event was already fired the handler is sent in a setTimeout (with a 0 timeout).
       * @param {Function|EnvironmentStatusListener} the function to be executed or an object containing the unloadEvent function to be executed. 
       */
      addUnloadHandler: function(f) {
        if (this.isPreUnload()) {
          onunloadFunctions.add(f);
        } else {
          asynchSingleEventExecution(f,'unloadEvent');
        }
      },
      
      /**
       * Adds a handler for the onbeforeunload event.
       * @param {Function|EnvironmentStatusListener} the function to be executed or an object containing the preUnloadEvent function to be executed. 
       */
      addBeforeUnloadHandler: function(f) {
        onbeforeunloadFunctions.add(f);
        if (this.preunloading) {
          asynchSingleEventExecution(f,'preUnloadEvent');
        }
      },
      
      /**
       * Removes the specified load handler if present, otherwise it does nothing. 
       * @param {Function|EnvironmentStatusListener} the function or object to be removed
       */
      removeOnloadHandler: function(f) {
        onloadFunctions.remove(f);
      },
      
      /**
       * Removes the specified unload handler if present, otherwise it does nothing. 
       * @param {Function|EnvironmentStatusListener} the function or object to be removed
       */
      removeUnloadHandler: function(f) {
        onunloadFunctions.remove(f);
      },
      
      /**
       * Removes the specified onbeforeunload handler if present, otherwise it does nothing. 
       * @param {Function|EnvironmentStatusListener} the function or object to be removed.
       */
      removeBeforeUnloadHandler: function(f) {
        onbeforeunloadFunctions.remove(f);
      },
      
      /**
       * @private
       */
      isPreOnload: function() {
        return !(this.onloadDone || this.onloadInprogress);
      },
      
      /**
       * @private
       */
      isPreUnload: function() {
        return !(this.unloaded || this.unloading);
      },
    
      /**
       * @private
       */
      attachToWindow: function() {
        Helpers.addEvent(window,"unload",this.closeFun);
        Helpers.addEvent(window,"beforeunload",this.beforeCloseFun);
        
        //EXPERIMENTAL
        if (document && typeof document.readyState != "undefined") {
          var strState = document.readyState;
          if (strState.toUpperCase() == "COMPLETE") {
            //already loaded
            this.asynchExecution();
            return;
          } else {
            //It may happen that readyState is not "completed" but the onload
            //was already fired. We fire a timeout to check the case
            executeLater(this.controlReadyStateLoad,controlLoadTimeout,this);
          }
        } else if(this.isInBody()) {
          //already loaded
          this.asynchExecution();
          return;
        }
        //EXPERIMENTAL end
        

        var done = Helpers.addEvent(window,"load",this.readyFun);
        if (!done) {
          //Can't append an event listener to the onload event (webworker / nodejs)
          //Let's launch a timeout 
          this.asynchExecution(); //should not happen since we did the check on the module setup, why did we keep it?
        } else if (BrowserDetection.isProbablyOldOpera()) {
          //Old Opera did not fire the onload event on a page wrapped
          //in an iFrame if a brother iFrame is still loading (in the
          //worst case the second iFrame is a forever-frame)
          //To prevent the case we will fire a fake onload
         
          
          var checkDOM = false;
          //on Opera < 9 DOMContentLoaded does not exist, so we can't wait for it
          if (BrowserDetection.isProbablyOldOpera(9, false)) {
            checkDOM = true;
            //DOMContentLoaded did not fire yet or we should have not reach this point 
            //as per the readyState/isInBody checks
            Helpers.addEvent(document,"DOMContentLoaded",DOMloaded);
          } 
          executeLater(this.controlOperaLoad,controlLoadTimeout,this,[checkDOM]);
          
        }
      },
      
      /**
       * @private
       */
      asynchExecution: function() {
        executeLater(this.readyFun,0);
      },
      
      /**
       * @private
       */
      controlReadyStateLoad: function() {
        if (!this.onloadDone) {
          //onload not yet fired
          var strState = document.readyState;
          if (strState.toUpperCase() == "COMPLETE") {
            this.readyFun();
          } else {
            executeLater(this.controlReadyStateLoad,controlLoadTimeout,this);
          }
        }
      },
      
      /**
       * @private
       */
      controlOperaLoad: function(checkDOM) {
        if (!this.onloadDone) {
          //onload not yet fired
          if (isDOMLoaded || !checkDOM && this.isInBody()) {
            //DOM is there
            //let's fake the onload event
            this.readyFun(); 
          } else {
            //body is still missing
            executeLater(this.controlOperaLoad,controlLoadTimeout,this,[checkDOM]);
          }
        }
      },
      
      /**
       * @private
       */
      isInBody: function() {
        return (typeof document.getElementsByTagName != "undefined" && typeof document.getElementById != "undefined" && ( document.getElementsByTagName("body")[0] != null || document.body != null ) );
      }
      
    };
    
    
    EnvironmentStatus.readyFun = getOnloadClosure(EnvironmentStatus);
    EnvironmentStatus.closeFun = getUnloadClosure(EnvironmentStatus);
    EnvironmentStatus.beforeCloseFun = getBeforeUnloadClosure(EnvironmentStatus);
    if (Environment.isBrowserDocument()) {
      EnvironmentStatus.attachToWindow();
    } else {
      EnvironmentStatus.asynchExecution();
    }
    
    
    
    EnvironmentStatus["addOnloadHandler"] = EnvironmentStatus.addOnloadHandler;
    EnvironmentStatus["addUnloadHandler"] = EnvironmentStatus.addUnloadHandler;
    EnvironmentStatus["addBeforeUnloadHandler"] = EnvironmentStatus.addBeforeUnloadHandler;
    EnvironmentStatus["removeOnloadHandler"] = EnvironmentStatus.removeOnloadHandler;
    EnvironmentStatus["removeUnloadHandler"] = EnvironmentStatus.removeUnloadHandler;
    EnvironmentStatus["removeBeforeUnloadHandler"] = EnvironmentStatus.removeBeforeUnloadHandler;
    EnvironmentStatus["isLoaded"] = EnvironmentStatus.isLoaded;
    EnvironmentStatus["isUnloaded"] = EnvironmentStatus.isUnloaded;
    EnvironmentStatus["isUnloading"] = EnvironmentStatus.isUnloading;
    
    return EnvironmentStatus;
  })();

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

  var Executor = /*@__PURE__*/(function() {
      var step = 50;
      var newStuffFlag = false;
      var toBeExecuted = [];
      var now = Helpers.getTimeStamp();
      var RESET_TIME = 3*60*60*1000; //3 hours
      var resetAt = now+RESET_TIME; //workaround for Safari 5 windows: after several hours the toBeExecuted array becomes unusable (OOM)
      var toBeRepeated = [];
      var timer = null;
      var nextId = 0;
      //var goodWakeups = 0;
      
      function sortFun(a,b) {
        if (a.time === b.time) {
          return a.orderId - b.orderId;
        }
        return a.time-b.time;
      }
      
      //TICK handling stuff
      var origin = Environment.isBrowserDocument() && (document.location.protocol == "http:" || document.location.protocol == "https:") ? (document.location.protocol+"//"+document.location.hostname+(document.location.port?":"+document.location.port:"")) : "*";
      var DEFAULT_GENERATE_TICK = function() { /*setTimeout(doTick,0); */ };
      var generateTickExecution = DEFAULT_GENERATE_TICK;
      var pendingGeneratedTick = false;
      function doTick() {
        pendingGeneratedTick = false;
        execute();
      }
      //we need to call this for urgent task as on FX5 and CH11 setInterval/setTimeout calls 
      //are made 1 per second on background pages (and our 50ms tick is based on a setInterval) 
      function generateTick() {
        if (!pendingGeneratedTick) {
          pendingGeneratedTick = true;
          generateTickExecution();
        }
      }
      
      
      function doInit() {
        if (!timer) {
          //set up the method to generate the tick
          //  on recent browsers we send a post message and trigger the doTick when we receive such message
          if (Environment.isBrowserDocument() && typeof postMessage != "undefined") {
            generateTickExecution = function() {
                try {
                    window.postMessage("Lightstreamer.run",origin);                    
                } catch (e) {
                    // sometimes on IE postMessage fails mysteriously but, if repeated, works
                    try {
                        window.postMessage("Lightstreamer.run",origin);
                    } catch (e) {
                        // await next tick (at most 50ms on foreground page and 1s in background pages)
                    }
                }
            };
            
            var postMessageHandler = function(event){
              if (event.data == "Lightstreamer.run" && origin == "*" || event.origin == origin) {
                doTick();
              }
            };
            Helpers.addEvent(window,"message", postMessageHandler);
            
            ///verify if postMessage can be used 
            generateTick();
            if (pendingGeneratedTick == false) {
              //post message can't be used, rollback
              Helpers.removeEvent(window,"message", postMessageHandler);
              generateTickExecution =  DEFAULT_GENERATE_TICK;
            }
            
          } else if (Environment.isNodeJS() && typeof process != "undefined" && process.nextTick) {
            //  on node versions having the nextTick method we rely on that
            generateTickExecution  = function() {
              process.nextTick(doTick);
            };
            
          } //  other cases will use the default implementation that's currently empty
          
        } else {
          clearInterval(timer);
        }
        
        //for "normal" tasks we use an interval
        timer = setInterval(execute,step);
      }
      
      
      //main execution method, the core of the Executor
      function execute() {
        if (EnvironmentStatus.unloaded) {
          clearInterval(timer);
          return;
        }
        
        var last = now;
        now = Helpers.getTimeStamp();
        if (now < last) {
          // not to be expected, but let's protect from this, because, otherwise,
          // the order of the events might not be respected
          now = last;
        }
        //adjustTimer(last, now);
        
        if (toBeExecuted.length > 0) {
          if (newStuffFlag) {
            toBeExecuted.sort(sortFun);
            newStuffFlag = false;
          } //no new tasks = no need to sort
          
          var exeNow;
          while (toBeExecuted.length > 0 && toBeExecuted[0].time <= now && !EnvironmentStatus.unloaded) {
            exeNow = toBeExecuted.shift();
            if (exeNow.fun) {
              Executor.executeTask(exeNow);
              
              //prepare to re-enqueue repetetive tasks
              if (exeNow.step) {  
                toBeRepeated.push(exeNow);
              }
            } 
          }
        } 

        if (toBeExecuted.length <= 0) { //if queue is empty reset the index
          nextId = 0;
        }
        
        // re-enqueue repetetive tasks 
        var t;
        while(toBeRepeated.length > 0) {
          t = toBeRepeated.shift();
          if (t.step) { //a task might have called stopRepetitiveTask on this task
            t.orderId = nextId++;
            Executor.addPackedTimedTask(t,t.step,true);
          }
        }
        
        if (now >= resetAt) {
          resetAt = now+RESET_TIME;
          toBeExecuted = [].concat(toBeExecuted);
        }
      }

      /**
       * An Executor based on a single setInterval that is triggered every 50ms to dequeue expired tasks.
       * When 0ms tasks are enqueued a postMessage call is used to trigger an immediate execution; on nodejs
       * the process.nextTick method is used in place of the postMessage; on older browser where postMessage
       * is not supported no action is taken.
       * 
       * @exports Executor
       * @extends module:ExecutorInterface
       */
      var Executor = {  
        
        toString: function() {
          return ["[","Executor",step,toBeExecuted.length,/*this.goodWakeups,*/"]"].join("|");
        },
       
      
        getQueueLength: function() {
          return toBeExecuted.length;
        },
        
        packTask: function(fun,context,params) {
          return {fun:fun,context:context||null,params:params||null,orderId:nextId++};
        },
        
        addPackedTimedTask: function(task,time,repetitive) {
          task.step = repetitive ? time : null;
          task.time = now + parseInt(time);
          // WARNING: "now" has not been refreshed;
          // hence, with this implementation, the order of the events is guaranteed
          // only when "time" is the same (or growing);
          // we assume that sequences of tasks to be kept ordered will have a the same "time"
          
          if (isNaN(task.time)) {
            try {
              throw new Error();
            } catch(e) {
              var err = "Executor error for time: " + time;
              if (e.stack) {
                err+= " " +e.stack;
              }
              throw err;
            }
          }
          toBeExecuted.push(task);
          newStuffFlag = true;
        },
        
        addRepetitiveTask: function(fun,interval,context,params) {
          return this.addTimedTask(fun,interval,context,params,true);
        },

        stopRepetitiveTask: function(task) {
          if (!task) {
            return;
          }
          task.fun = null;
          task.step = null;
        },

        addTimedTask: function(fun,time,context,params,repetitive) {
          var task = this.packTask(fun,context,params);
          this.addPackedTimedTask(task,time,repetitive);
          if (time == 0) {
            generateTick();
          }
          return task;
        },
        
        modifyTaskParam: function(task,index,newParam) {
          task.params[index] = newParam;
        },
        
        modifyAllTaskParams: function(task,extParams) {
          task.params = extParams;
        },
        
        delayTask: function(task,delay) {
          task.time += delay;
          newStuffFlag = true;
        },
        
        executeTask: function(task,extParams) {
          try {

              //IE doesn't like the simple form when useParams is null:
              //task.fun.apply(task.context, task.params);
              //if we leave the above code instead of using the below code, we fall into IE weird problem, where
              //the execution fails in exception, task.fun results not null nor undefined, but if we try to print it 
              //(toString) or call it results as undefined (exception "Object expected").
            
            var useParams = extParams || task.params;
            
            if (task.context) {
              if (useParams) {
                task.fun.apply(task.context, useParams);
              } else {
                task.fun.apply(task.context);
              }
            } else if (useParams) {
              task.fun.apply(null, useParams);
            } else {
              task.fun();
            }
            
          } catch (_e) {
            var sendName = null;
            try {
              sendName = task.fun.name || task.fun.toString();
            } catch(_x) {
            }
            //TODO report sendName
          } 
          
        }
        
     };
     
     if (Environment.isWebWorker()) {
       //we need this workaround otherwise on firefox 10 the Executor may not run as expected.
       //I wasn't able to create a simple test case as it seems that the number of classes involved
       //and the loading order have an impact on the issue (so that it is possible that once built the
       //issue will not be there)
       //I don't want to include BrowserDetection here so that I apply the workaround on all browsers
       setTimeout(doInit,1);
       
       //other possible workarounds (referring to the failing test)
       //that make the Executor run correctly:
       // *do not include Subscription
       // *do not include the descriptor classes (inside the library code)
       // *set the step value to a higher value (75 and 100 are suggested values that seem to work)
       
     } else {
       doInit();
     }
     
     Executor["getQueueLength"] = Executor.getQueueLength;
     Executor["packTask"] = Executor.packTask;
     Executor["addPackedTimedTask"] = Executor.addPackedTimedTask;
     Executor["addRepetitiveTask"] = Executor.addRepetitiveTask;
     Executor["stopRepetitiveTask"] = Executor.stopRepetitiveTask;
     Executor["addTimedTask"] = Executor.addTimedTask;
     Executor["modifyTaskParam"] = Executor.modifyTaskParam;
     Executor["modifyAllTaskParams"] = Executor.modifyAllTaskParams;
     Executor["delayTask"] = Executor.delayTask;
     Executor["executeTask"] = Executor.executeTask;
     
     return Executor;
  })();

     
   
   
  /*
        function adjustTimer(last, now) {
          var diff = now - last;
          
          if (diff <= step) {
            goodWakeups++;
          } else {
            goodWakeups--;
          }
          
          if (goodWakeups >= 10) {
            changeStep(step+1);
            goodWakeups = 0;
          } else if (goodWakeups < 0) {
            if (step >= 2) {
              changeStep(Math.round(step / 2));
              goodWakeups = 0;
            } else {
              goodWakeups = 0;
            }
          }
        }
        
        function changeStep (newStep) {
          step = newStep;
          doInit();
        }
  */

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

  var Inheritance = /*@__PURE__*/(function() {
    /**
     * @method
     * 
     * @param {Object} o
     * @param {Function} tc
     * @param {Object[]} params
     * 
     * @private
     */
    function doCall(o,tc,params) {
      if (tc) {
        if (params) {
          return tc.apply(o,params);
        } else {
          return tc.apply(o);
        }
      }
    }
    
    
    /**
     * @private
     */
    function searchAlias(proto,extendedName) {
      for (var i in proto) {
        if (proto[extendedName] == proto[i] && extendedName != i) {
          return i;
        }
      }
      return null;
    }
    
    /**
     * This module introduce a "classic" inheritance mechanism as well as an helper to
     * copy methods from one class to another. See the Inheritance method documentation below for details.
     * @exports Inheritance
     */
    var Inheritance = {
        
      /**
       * This method extends a class with the methods of another class preserving super
       * methods and super constructor. This method should be called on a class only
       * after its prototype is already filled, otherwise
       * super methods may not work as expected.<br/>
       * The <i>_super_</i>, <i>_callSuperMethod</i> and <i>_callSuperConstructor</i> names are reserved: extending and
       * extended classes' prototypes must not define properties with such names.<br/>
       * Once extended it is possible to call the super constructor calling the _callSuperConstructor
       * method and the super methods calling the _callSuperMethod method
       * <br/>Note that this function is the module itself (see the example)
       * 
       * @throws {IllegalStateException} if checkAliases is true and an alias of the super class
       * collides with a different method on the subclass.
       *
       * @param {Function} subClass the class that will extend the superClass
       * @param {Function} superClass the class to be extended
       * @param {boolean} [lightExtension] if true constructor and colliding methods of the
       * super class are not ported on the subclass hence only non-colliding methods will be copied
       * on the subclass (this kind of extension is also known as mixin)
       * @param {boolean} [checkAliases] if true aliases of colliding methods will be searched on the
       * super class prototype and, if found, the same alias will be created on the subclass. This is 
       * especially useful when extending a class that was minified using the Google Closure Compiler.
       * Note however that collisions can still occur, between a property and a method and between methods
       * when the subclass is minified too. The only way to prevent collisions is to minify super and sub 
       * classes together.
       * @function Inheritance
       * @static
       * 
       * @example
       * require(["Inheritance"],function(Inheritance) {
       *   function Class1() {
       *   }
       *
       *   Class1.prototype = {
       *     method1: function(a) {
       *       return a+1;
       *     }
       *   };
       * 
       *   function Class2() {
       *     this._callSuperConstructor(Class2);
       *   }
       *
       *   Class2.prototype = {
       *     method1: function(a,b) {
       *       return this._callSuperMethod(Class2,"method1",[a])+b;
       *     }
       *   };
       *
       *   Inheritance(Class2,Class1);
       *   
       *   var class2Instance = new Class2();
       *   class2Instance.method1(1,2); //returns 4
       *   
       * });
       */
      Inheritance: function(subClass, superClass, lightExtension, checkAliases){
        //iterate all of superClass's methods
        for (var i in superClass.prototype) {
          if (!subClass.prototype[i]) {
            //copy non-colliding methods directly
            subClass.prototype[i] = superClass.prototype[i];
          } else if(checkAliases) {
            //in case of collision search in the super prototype if the method has an alias
            //and create the alias here too
            var name = searchAlias(superClass.prototype,i);
            if (name) {
              //we want to copy  superClass.method to superClass.prototype[i], but subClass.prototype[i] already exists 
              //name is an alias of i --> superClass.prototype[name] == superClass.prototype[i]
              //if subClass has a name method thay is different not an alias of i (subClass.prototype[name] != subClass.prototype[i]) there is a collision problem
              if (subClass.prototype[name] && subClass.prototype[name] !== subClass.prototype[i]) {
                //unless the alias name was previously copied from superClass ( superClass.prototype[name] == superClass.prototype[name] )
                if (superClass.prototype[name] !== superClass.prototype[name]) {
                  throw new IllegalStateException("Can't solve alias collision, try to minify the classes again (" + name + ", " + i + ")");
                }
              }
              subClass.prototype[name] = subClass.prototype[i];
            }
            
          }
        }
       
        if (!lightExtension) {
          //setup the extended class for super calls (square brakets used to support google closure)
          subClass.prototype["_super_"] = superClass;
          subClass.prototype["_callSuperConstructor"] = Inheritance._callSuperConstructor;
          subClass.prototype["_callSuperMethod"] = Inheritance._callSuperMethod;
        }

        return subClass;
      },
      
      /**
       * This method is attached to the prototype of each extended class as _callSuperMethod to make it possible to
       * call super methods. 
       * <br/>Note that it is not actually visible in this module.
       * 
       * @param {Function} ownerClass the class that calls this method.
       * @param {String} toCall the name of the super function to be called.
       * @param {Object[]} [params] array of parameters to be used to call the super method.
       * @static
       */
      _callSuperMethod: function(ownerClass, toCall, params){
        return doCall(this,ownerClass.prototype["_super_"].prototype[toCall],params);
      },
      
      /**
       * This method is attached to the
       * prototype of each extended class as _callSuperConstructor to make it possible
       * to call the super constructor.
       * <br/>Note that it is not actually visible in this module.
       *
       * @param {Function} ownerClass the class that calls this method.
       * @param {Object[]} [params] array of parameters to be used to call the super constructor.
       * @static
       */
      _callSuperConstructor: function(ownerClass, params){
        doCall(this,ownerClass.prototype["_super_"], params);
      }
    
    
    };
    
    //the way this is handled may look weird, well it is, I had to put
    //things this way with the only purpose to let JSDoc document the module
    //as I wanted to (and that didn't even turned out perfectly)
    return Inheritance.Inheritance;
  })();

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

  var EventDispatcher = /*@__PURE__*/(function() {
    //var actionsLogger = LoggerManager.getLoggerProxy(LoggerManager.ACTIONS);   
    
    /**
     * This constructor simply calls the {@link EventDispatcher#initDispatcher initDispatcher} method. This class is supposed 
     * to be extended using {@link module:Inheritance} extension.
     * It can be either light extended or fully extended. When light extension is performed
     * the {@link EventDispatcher#initDispatcher initDispatcher} method should be called in the extended class constructor.
     * @constructor
     * 
     * @exports EventDispatcher
     * @class Class to be extended by classes requiring multiple listeners support.
     * The dispatcher can act in two different ways, either synchronously (all listeners are triggered
     * before the dispatching method exits) or asynchonously (all the listeners are triggered only when 
     * the currently running code has been executed).<br/>  
     * When extending this class is a good idea to also prepare an empty fake class to act as interface 
     * to keep track of the events that will be generated.
     * 
     *
     * 
     * 
     * @example
     * //using light extension
     * define(["Inheritance","EventDispatcher"],function(Inheritance,EventDispatcher) {
     *   
     *   var MyClass = function() {
     *     this.initDispatcher();
     *     //do stuff
     *   }
     *   
     *   MyClass.prototype = {
     *     foo: function() {
     *       //still doing stuff
     *       
     *       //send an eventName event to the listeners (their eventName method will be called)
     *       this.dispatchEvent("eventName",[paramForHandlers,otherParamForHandlers]);
     *       
     *       //do more stuff
     *     }
     *   };
     *   
     *   Inheritance(MyClass,EventDispatcher,true);
     *   return MyClass;
     * });
     * 
     * define([],function() {
     *   
     *   var MyClassListener = function() {
     *     //do stuff
     *   }
     *   
     *   MyClassListener = {
     *     eventName: function(param1,param2) {
     *       //handle event
     *     }
     *   };
     *   
     *   return MyClassListener;
     * });
     */
    var EventDispatcher = function() {
      this.initDispatcher();
    };
    
    EventDispatcher.prototype = {
        
        /**
         * Initializes the required internal structures and configures the dispatcher 
         * for sending asynchronous events.
         * <br/>If called more than once it will reset the status of the instance.
         * <br/>This method MUST be called at least once before event dispatching can 
         * be exploited, otherwise most methods will fail either silently or with unexpected
         * exceptions as no init-checks are performed by them.
         * @protected
         * 
         * @see EventDispatcher#useSynchEvents
         */
        initDispatcher: function() {
          this.theListeners = new AsymList();
          this.synchEvents = false;
        },
        
        /**
         * Adds a listener and fires the onListenStart event to it sending itself as only parameter.
         * Note that the onListenStart event is only fired on the involved listener not on previously
         * registered listeners.
         * 
         * @param {EventDispatcherListener} aListener a listener to receive events notifications. The listener does not need
         * to implement all of the possible events: missing events will not be fired on it.
         */
        addListener: function(aListener) {
          if (aListener && !this.theListeners.contains(aListener)) {
            var obj = {handler:aListener,listening:true};
            this.theListeners.add(obj);
            this.dispatchToOneListener("onListenStart",[this],obj,true);
          }
        },
        
        /**
         * Removes a listener and fires the onListenEnd event to it sending itself as only parameter.
         * Note that the onListenEnd event is only fired on the involved listener not on previously
         * registered listeners.
         * 
         * @param {EventDispatcherListener} aListener the listener to be removed.
         */
        removeListener: function(aListener) {
          if (!aListener) {
            return;
          }
          
          var obj = this.theListeners.remove(aListener);
          if (obj) {
            this.dispatchToOneListener("onListenEnd",[this],obj,true);
          }
        },
        
        /**
         * Returns an array containing the currently active listeners.
         * 
         * @returns {Array.<EventDispatcherListener>} an array of listeners.
         */
        getListeners: function() {
          return this.theListeners.asArray();
        },
        
        /**
         * Configures the EventDispatcher to send either synchronous or asynchronous events.
         * <br/>Synchronous events are fired on listeners before the {@link EventDispatcher#dispatchEvent} call
         * of the related event is returned.
         * </br>Asynchronous events are fired after the current code block is completed and possibly
         * after more code blocks are executed. Can be considered as if the calls are performed 
         * inside setTimeout with timeout 0.
         * 
         * @param {Boolean} [useSynch=false] true to fire events synchronously, any other value to fire them
         * asynchronously.
         * 
         * @see EventDispatcher#initDispatcher
         */
        useSynchEvents: function(useSynch) {
          this.synchEvents = useSynch === true;
        },

        /**
         * @private 
         * @param evt
         * @param params
         * @param listener
         * @param forced
         */
        dispatchToOneListener: function(evt,params,listener,forced) {
          if (this.synchEvents) {
            this.dispatchToOneListenerExecution(evt,params,listener,true);
          } else {
            Executor.addTimedTask(this.dispatchToOneListenerExecution,0,this,[evt,params,listener,forced]);
          }
        },
        
        /**
         * @private
         * @param evt
         * @param params
         * @param listener
         * @param forced
         */
        dispatchToOneListenerExecution: function(evt,params,listener,forced) {
          if (listener && listener.handler[evt] && (forced || listener.listening)) {
            try {
              //if we don't distinguish the two cases we will have problems on IE
              if (params) {
                listener.handler[evt].apply(listener.handler,params);
              } else {
                listener.handler[evt].apply(listener.handler);
              }
            } catch(_e) {
              //actionsLogger.logError(LoggerManager.resolve(2),evt,_e);
            }
          }
        },
        
        /**
         * Fires an event on all the listeners.
         * @param {String} evt The name of the event to be fired. A method with this name will be called on the listeners. 
         * @param {Array} [params] An array of objects to be used as parameters for the functions handling the event.
         * @see EventDispatcher#useSynchEvents
         */
        dispatchEvent: function(evt,params) {
          /*if (actionsLogger.isDebugLogEnabled()) {
            actionsLogger.logDebug(LoggerManager.resolve(3),evt);
          }*/
          
          var that = this;
          this.theListeners.forEach(function(el) {
            that.dispatchToOneListener(evt,params,el,false);
          });
        }
    };

    //closure compiler exports
    EventDispatcher.prototype["initDispatcher"] = EventDispatcher.prototype.initDispatcher;
    EventDispatcher.prototype["addListener"] = EventDispatcher.prototype.addListener;
    EventDispatcher.prototype["removeListener"] = EventDispatcher.prototype.removeListener;
    EventDispatcher.prototype["getListeners"] = EventDispatcher.prototype.getListeners;
    EventDispatcher.prototype["useSynchEvents"] = EventDispatcher.prototype.useSynchEvents;
    EventDispatcher.prototype["dispatchEvent"] = EventDispatcher.prototype.dispatchEvent;
    
    /**
     * extend the List class to power up the remove method:
     * as we get from outside object but we want to wrap them
     * before adding to the list we need a way to remove
     * the wrapped object given the original one
     * we also change the return value
     * @private
     */
    var AsymList = function() {
      this._callSuperConstructor(AsymList);
    };
    AsymList.prototype = {
      remove: function(remEl) {
        var i = this.find(remEl);
        if (i < 0) {
          return false;
        }
        var toRet = this.data[i];
        toRet.listening = false;
        this.data.splice(i,1);
        return toRet;
      },
      find: function(el) {
        for (var i=0; i<this.data.length; i++) {
          if (this.data[i].handler == el) {
            return i;
          }
        }
        return -1;
      },
      asArray: function() {
        var toRet = [];
        this.forEach(function(aListener) {
          toRet.push(aListener.handler);
        });
        return toRet;
      }
    };
    Inheritance(AsymList,List);
    
    
    return EventDispatcher;
  })();

  var _virtual_virtualEntrypoint = {
  'Executor': Executor,
  'EventDispatcher': EventDispatcher,
  'Inheritance': Inheritance
  };

  return _virtual_virtualEntrypoint;

}());

    if (typeof define === 'function' && define.amd) {
        define("lightstreamerUtils", ["module"], function(module) {
            var namespace = (module.config()['ns'] ? module.config()['ns'] + '/' : '');
            define(namespace + 'Executor', function() { return lightstreamerExports['Executor'] });
define(namespace + 'EventDispatcher', function() { return lightstreamerExports['EventDispatcher'] });
define(namespace + 'Inheritance', function() { return lightstreamerExports['Inheritance'] });
        });
        require(["lightstreamerUtils"]);
    }
    else if (typeof module === 'object' && module.exports) {
        exports['Executor'] = lightstreamerExports['Executor'];
exports['EventDispatcher'] = lightstreamerExports['EventDispatcher'];
exports['Inheritance'] = lightstreamerExports['Inheritance'];
    }
    else {
        var namespace = createNs(extractNs(), window);
        namespace['Executor'] = lightstreamerExports['Executor'];
namespace['EventDispatcher'] = lightstreamerExports['EventDispatcher'];
namespace['Inheritance'] = lightstreamerExports['Inheritance'];
    }
    
    function extractNs() {
        var scripts = window.document.getElementsByTagName("script");
        for (var i = 0, len = scripts.length; i < len; i++) {
            if ('data-lightstreamer-ns' in scripts[i].attributes) {        
                return scripts[i].attributes['data-lightstreamer-ns'].value;
            }
        }
        return null;
    }
    
    function createNs(ns, root) {
        if (! ns) {
            return root;
        }
        var pieces = ns.split('.');
        var parent = root || window;
        for (var j = 0; j < pieces.length; j++) {
            var qualifier = pieces[j];
            var obj = parent[qualifier];
            if (! (obj && typeof obj == 'object')) {
                obj = parent[qualifier] = {};
            }
            parent = obj;
        }
        return parent;
    }
}());
