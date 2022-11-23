const express = require("./provider/express");
const MongoDB = require("./provider/mongodb");

class App {
    static init = () => {
        /** Start server */
        express.init();

        /** Start MongoDB connection */
        MongoDB.init();
    };
}

App.init();
