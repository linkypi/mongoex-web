/**
 * Created by JL on 2016/3/26.
 */
'use strict'

module.exports = function(input){

    var name ="",server="",port="",url="";

    if(input){
       name = input.name;
       var arr = input.addr.split(':');
       server = arr[0];
       port = arr[1];
       url = 'mongodb://' + input.addr;
    }

    return {
        name: name,
        url: url,    //'mongodb://localhost:27017'
        server: server,//process.env.ME_CONFIG_MONGODB_SERVER  || mongo.host,
        port:   port,//process.env.ME_CONFIG_MONGODB_PORT    || mongo.port,

        set args(body){
            this.name = body.name;
            var arr = body.addr.split(':');
            this.server = arr[0];
            this.port = arr[1];
            this.url = 'mongodb://' + body.addr;
        },

        //useSSL: connect to the server using secure SSL
        useSSL: process.env.ME_CONFIG_MONGODB_SSL ,//,//|| mongo.ssl,

        //autoReconnect: automatically reconnect if connection is lost
        autoReconnect: true,

        //poolSize: size of connection pool (number of connections to use)
        poolSize: 4,

        //set admin to true if you want to turn on admin features
        //if admin is true, the auth list below will be ignored
        //if admin is true, you will need to enter an admin username/password below (if it is needed)
        admin: process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN ? process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN.toLowerCase() === 'true' : false,

        // >>>>  If you are using regular accounts, fill out auth details in the section below
        // >>>>  If you have admin auth, leave this section empty and skip to the next section
        auth: [
            /*
             * Add the name, username, and password of the databases you want to connect to
             * Add as many databases as you want!
             */
            {
                database: process.env.ME_CONFIG_MONGODB_AUTH_DATABASE ,//|| mongo.db,
                username: process.env.ME_CONFIG_MONGODB_AUTH_USERNAME ,//|| mongo.username,
                password: process.env.ME_CONFIG_MONGODB_AUTH_PASSWORD ,//|| mongo.password,
            },
        ],

        //  >>>>  If you are using an admin mongodb account, or no admin account exists, fill out section below
        //  >>>>  Using an admin account allows you to view and edit all databases, and view stats

        //leave username and password empty if no admin account exists
        adminUsername: process.env.ME_CONFIG_MONGODB_ADMINUSERNAME || '',
        adminPassword: process.env.ME_CONFIG_MONGODB_ADMINPASSWORD || '',

        //whitelist: hide all databases except the ones in this list  (empty list for no whitelist)
        whitelist: [],

        //blacklist: hide databases listed in the blacklist (empty list for no blacklist)
        blacklist: [],

    };
};

