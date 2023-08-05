"use strict";

var app = require("./app.js");

require("greenlock-express")
  .init({
    packageRoot: __dirname,

    // contact for security and critical bug notices
    maintainerEmail: "hi@yukai.dev",

    // where to look for configuration
    configDir: "./greenlock.d",

    // whether or not to run at cloudscale
    cluster: false,
  })
  .ready((glx) => {
    const httpServer1 = glx.httpServer();
    httpServer1.listen(8080, "0.0.0.0", () => {
      console.log(
        "Listening for ACME http-01 challenges on",
        httpServer1.address()
      );
    });

    const httpServer2 = glx.httpServer();
    httpServer2.listen(443, "0.0.0.0", () => {
        console.log(
            "Listening for ACME tls-alpn-01 challenges and serve app on",
            httpServer2.address()
        );
        }
    );
  });
// .ready(glx => {
//     console.log(glx);
// })
// Serves on 80 and 443
// Get's SSL certificates magically!
// .serve(glx => {
//     glx
// });
