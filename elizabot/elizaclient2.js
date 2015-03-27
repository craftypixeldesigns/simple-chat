/*
ELIZA CLIENT

An Eliza client that listens on port 8113 and spawns an independent instance of Elizabot for each connection to the server
Use with server4.js

cmah@ucalgary.ca
599.81 Assignment 1 - Phase 5.2
Feb. 2015
*/

var net = require('net'); 
var ElizaBot = require('./elizabot.js');

/*
    Client that takes server's messages, create new Eliza, 
    and replies to clients connected to server
*/
var socket = net.createConnection(8113, function() {
    socket.write('Eliza\n'); // send username to server
    
    /*  Function OtherClient
        Constructor for an object called OtherClient, 
        indexed by a string username
    */
    function OtherClient(username) {
        this.username = username;
        this.elizabot = new ElizaBot();
        this.initial = this.elizabot.getInitial();
    };
    
    var otherclient = new Array();
    
    /*  Data socket
        Whenever it receives data from other clients, 
        it will answer with Eliza
    */
    socket.on('data', function(data) {      
        console.log(data.toString());
        
        // Parse through data
        // http://stackoverflow.com/questions/20474257/split-string-into-two-parts
        var str = data.toString();
        var index = str.indexOf(':');  // Gets the first index where a space occours
        var username = str.substr(0, index); // Gets the first part
        var msg = str.substr(index + 1);  // Gets the text part
        
        switch(username) {
            // Add or remove username from otherclient[]
            case 'Server':
                var arrMsg = msg.split(' ');

                if (arrMsg[2] == 'joined') {
                    otherclient[arrMsg[1]] = new OtherClient(arrMsg[1]);
                } else if (arrMsg[2] == 'left') {
                    socket.write(otherclient[arrMsg[1]].elizabot.getFinal());
                    otherclient[arrMsg[1]].elizabot.reset();
                    delete otherclient[arrMsg[1]];
                }
                break;
            case 'Eliza':
                // do nothing
                break;
            default:
                // If username does not exist, create an object 
                // Covers the case when user joins BEFORE Eliza connects 
                if (otherclient[username] == undefined) {
                    otherclient[username] = new OtherClient(username);
                } 
                socket.write('Well ' + username + ', ' + otherclient[username].elizabot.transform(msg) + '\n');
        } // end switch
    });  // end data socket
});