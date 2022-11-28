const express = require("./provider/Express");
const MongoDB = require("./provider/Mongodb");

class App {
    static init = () => {
        /** Start server */
        express.init();

        /** Start MongoDB connection */
        MongoDB.init();
    };
}

App.init();
