'use strict';

var app = require('./app.js');

require('greenlock-express')
    .init({
        packageRoot: __dirname,

        // contact for security and critical bug notices
        maintainerEmail: "hi@yukai.dev",

        // where to look for configuration
        configDir: './greenlock.d',

        // whether or not to run at cloudscale
        cluster: false
    })
    .serve(app)
    // .ready(glx => {
    //     console.log(glx);
    // })
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    // .serve(glx => {
    //     glx
    // });
