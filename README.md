# Lightstreamer - Multiplayer Darts for Leap Motion - HTML (LeapJS, Three.js) Client #
<!-- START DESCRIPTION lightstreamer-example-darts-leapmotion-client-javascript -->

Multiplayer, [Leap Motion](https://www.leapmotion.com/) controlled, Dart game running in the browser and using 
[Lightstreamer](http://www.lightstreamer.com) for it real-time communication needs. 

[![screenshot](screenshot1.png)](http://demos.lightstreamer.com/http://demos.lightstreamer.com/DartsLeapMotion//)<br>
[![screenshot](screenshot2.png)](http://demos.lightstreamer.com/http://demos.lightstreamer.com/DartsLeapMotion//)<br>
[![screenshot](screenshot3.png)](http://demos.lightstreamer.com/http://demos.lightstreamer.com/DartsLeapMotion//)<br>
An online demonstration is hosted on our servers at: [http://demos.lightstreamer.com/DartsLeapMotion/](http://demos.lightstreamer.com/DartsLeapMotion/)<br>

This application uses the *JavaScript Client API for Lightstreamer* to handle the communications with Lightstreamer Server, *leapjs* to read the users' hand movement through the Leap Motion Controller and
*three.js* to display the users' darts on the browser.

Each user controls a dart (the red one) that can be thrown toward the dartboard in order to score points while seeing how other players are faring (the green darts)

<!-- END DESCRIPTION lightstreamer-example-darts-leapmotion-client-javascript -->

# Build #

The html application can be optionally built, to reduce the number and size of the files to be downloaded by the browser, using [r.js](http://requirejs.org/docs/optimization.html).
A ready-made configuration file for the build process is available in the build_rjs folder of this project.

# Deploy #

Before you can run this demo some dependencies need to be solved:

-  Lightstreamer JS client is currently hot-linked in the html page: you may want to replace it with a local version and/or to upgrade its version.
-  RequireJS is currently hot-linked in the html page: you may want to replace it with a local version and/or to upgrade its version.
-  jQuery is currently hot-linked in the html page: you may want to replace it with a local version and/or to upgrade its version.
-  leapjs is currently hot-linked in the html page: you may want to replace it with a local version and/or to upgrade its version.
-  three.js is currently hot-linked in the html page: you may want to replace it with a local version and/or to upgrade its version.

You can deploy this demo inside Lightstreamer internal web server or in any other web server.
If you choose the former please create a new folder under <LS_HOME>/pages/ and copy the contents of the src folder of this project there.
The client demo configuration assume that Lightstreamer Server, Lightstreamer Adapters and this client are launched on the same machine.
If you need to targeting a different Lightstreamer server please search this line in js/Constants.js:
```js
SERVER: protocolToUse+"//push.lightstreamer.com",
```
and change it accordingly.

Note that the [DART](https://github.com/Weswit/Lightstreamer-example-Darts-LeapMotion-adapter-java) adapters have to be deployed in your local Lightstreamer server instance.

# See Also #

## Lightstreamer Adapter Needed by This Demo Client ##
<!-- START RELATED_ENTRIES -->

* [Lightstreamer - Multiplayer Darts for Leap Motion - Java Adapter](https://github.com/Weswit/Lightstreamer-example-Darts-LeapMotion-adapter-java)

<!-- END RELATED_ENTRIES -->

# Lightstreamer Compatibility Notes #

* Compatible with Lightstreamer JavaScript Client library version 6.1 or newer.