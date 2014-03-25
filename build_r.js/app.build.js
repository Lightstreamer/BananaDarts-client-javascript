({
    appDir: "../src",
    baseUrl: ".",
    dir: "../built",
    
    //if using node to build the project this setting must be changed to "uglify"
    optimize: "closure",
    closure: {
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING',
    },
    
    
    //if using the non-namespaced version of the Lightstreamer library remove the "Lightstreamer/" prefix from LightstreamerClient, Subscription and StatusWidget module names
    paths: {
      "LightstreamerClient": "empty:",
      "Subscription": "empty:",
      "StatusWidget": "empty:",
      "Inheritance": "empty:",
      "DynaGrid": "empty:",
      "Executor": "empty:",
      "EventDispatcher": "empty:"
    },
    
    modules: [
        {
            name: "index",
            includeRequire: false
        }
    ]
})