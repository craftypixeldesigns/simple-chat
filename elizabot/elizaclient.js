/*
ELIZA CLIENT

An Eliza client that listens on port 8113 talks to everyone. 
Use with server4.js

cmah@ucalgary.ca
599.81 Assignment 1 - Phase 5.1
Feb. 2015
*/

var net = require('net'); 
var ElizaBot = require('./elizabot.js');
var eliza = new ElizaBot();
var initial = eliza.getInitial();

var client = net.createConnection(8113, function() {
    
     /*  Data socket
        Whenever it receives data from other clients, 
        it will answer with Eliza
    */
    client.on('data', function(data) {        
        console.log(data.toString());
        
        // Parse through data
        // http://stackoverflow.com/questions/20474257/split-string-into-two-parts
        var str = data.toString();
        var index = str.indexOf(":");  // Gets the first index where a space occours
        var username = str.substr(0, index); // Gets the first part
        var msg = str.substr(index + 1);  // Gets the text part
        
        switch(username) {
            case 'Server':
                //do nothing
                break;
            case 'Eliza':
                //do nothing
                break;
            default:
                console.log(eliza.transform(data.toString()));

            if (eliza.quit) {
                socket.write(eliza.getFinal());
                eliza.reset();
            }
        } // end switch
    }); // end data socket
});