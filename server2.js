/*
SIMPLE CHAT SERVER 2

A TCP server that listens on port 8113 that tracks each connection. For each message (a string delimited by a newline) that the server receives, it sends it out to every connected client. 
Users can create usernames.

To use:
- Run 'node server2.js' in a terminal
- Run 'telnet localhost 8113' in another terminal (one terminal using telnet = one connection)
-- If using Microsoft telnet: use ctrl + ] and the command 'send <insert string delimited by newline>'
-- Press enter to toggle between Microsoft telnet and the server
- Type and press enter on the terminals running telnet

- Note the first string entered is the client's username

cmah@ucalgary.ca
599.81 Assignment 1 - Phase 2
Feb. 2015
*/

var net = require('net'); 

// Server keeps track of each connection
var connectionList = [];
var totalConnections = 0;
var hasNameChanged = false;

/*
    Server that broadcasts information about new clients and messages
*/
var server = net.createServer(function (socket) {
    
    socket.name = socket.remoteAddress + ':' + socket.remotePort;
    
    console.log('NEW CONNECTION: ' + socket.name);
    socket.write('Welcome to the Chat Server ' + socket.name + '!\n');
    
    socket.setEncoding('utf8');
    connectionList.push(socket); //add new client connection to list
    totalConnections++;
    
    broadcast(socket.name + ' joined the Chat Server\n', socket.name.toString());
    broadcast('Number of Chat Server participants: ' + totalConnections + '\n', socket.name.toString()); 
    
    socket.write('Please enter your username: ');
    hasNameChanged = false; // ensures multiple clients get a username
    
    /*
        Data socket
    */
    socket.on('data', function (data) {
        if (!hasNameChanged) {
            socket.username = data.trim(); // eliminate new line
            hasNameChanged = true;
            console.log('USER ' + socket.name + ' SET USERNAME TO ' + socket.username); 
        } else {
            console.log('DATA RECEIVED: ' + socket.username + ': ' + data.trim());
            broadcast(data, socket.username);
        }
    }); // end data socket
    
    
    /* 
        Close socket
    */
    socket.on('close', function (error) {
        connectionList.splice(connectionList.indexOf(socket), 1); //remove client from list
        totalConnections--;
        
        console.log('CLOSE CONNECTION: ' + socket.name + '\n');
        broadcast(socket.name + ' left the Chat Server\n', socket.name.toString());
        broadcast('Number of Chat Server participants: ' + totalConnections + '\n', socket.name.toString()); 
        
    }); // end close socket
    
    socket.on('error', function (error) {
        console.log('ERROR: ' + error);
    }); // end error socket
    
}).listen(8113); // server listens on port 8113

console.log('Server listening on port 8113');

/*  Function broadcast
    Sends a message out to all connected clients except for sender
*/
function broadcast(message, sender) {
    for (var i = 0; i < connectionList.length; i++) {
        connectionList[i].write(sender + ': ' + message);
    }
};