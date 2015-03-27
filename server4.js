/*
SIMPLE CHAT SERVER 3 MODIFIED

Modification is so it is easier to parse through data sent by the server for elizclient.js and elizaclient2.js to read

A TCP server that listens on port 8113 that tracks each connection. For each message (a string delimited by a newline) that the server receives, it sends it out to every connected client. 
Users can create usernames.
When running the server, you can log messages. The logger has three different levels. It logs to the console, as well as to a specified file. If a file is not specified, then the system logs to the screen. If no logging level is specified, then it defaults to level 0.

To use:
- Run 'node server3.js' in a terminal
- Run 'telnet localhost 8113' in another terminal (one terminal using telnet = one connection)
-- If using Microsoft telnet: use ctrl + ] and the command 'send <insert string delimited by newline>'
-- Press enter to toggle between Microsoft telnet and the server
- Type and press enter on the terminals running telnet

- Note the first string entered is the client's username

Calling conventions:
-l <num> or --log-level=<num> indicates level of logging mechanism
    This is optional, where the default is 0 and no logging occurs
    Level 1: Logs only messages with the following format: [date-time] MESSAGE: [username]: [message]
    Level 2: Logs also the connections and disconnects from the clients: [date-time] [CONNECT/DISCONNECT]: [IP]:[port]
-f <filename.extension> or --file=<filename.extension> logs to a file based on level of logging mechanism

cmah@ucalgary.ca
599.81 Assignment 1 - Phase 3
Feb. 2015
*/

/*==================
|      PARSER       |
===================*/

var Getopt = require('node-getopt');
var levelNum = 0; // default level 0
var fileName = '';

/*
    Create Getopt instance  to parse command line input
*/
var opt = require('node-getopt').create([
    ['l', 'log-level=ARG',  'ARG=level number (0-2)'],
    ['f', 'file=ARG',       'ARG=file name with extension'],
    ['h', 'help',           'display this help']
])
.bindHelp() // 'help' option
.parseSystem(); // parse command line

/*
    Create Getopt object
*/
var getopt = new Getopt([
    ['l', 'log-level=ARG'],
    ['f', 'file=ARG'],
    ['h', 'help']
])
.bindHelp(); // 'help' option

//argv[0]=node, argv[1]=<script name>
opt = getopt.parse(process.argv.slice(2));

// Set input to appropriate variables
if (opt.options['log-level'] != undefined) {
    levelNum = parseInt(opt.options['log-level']);
}
if (opt.options['file'] != undefined) {
    fileName = opt.options['file'];
}
/*==================
|     SERVER &      |
|     LOGGING       |
===================*/

var net = require('net'); 
var fs = require('fs');

// Server keeps track of each connection
var connectionList = [];
var totalConnections = 0;
var hasNameChanged = false;

var loggingMsg = '';

/*
    Server that broadcasts information about new clients and messages
*/
var server = net.createServer(function (socket) {
    
    socket.name = socket.remoteAddress + ':' + socket.remotePort; // sets a new field for socket

    if (levelNum == 2) {
        loggingMsg = 'CONNECT: ' + socket.name.toString() + '\n';
        console.log(loggingMsg);
        
        if (fileName != '') {
            fs.appendFile(fileName, loggingMsg, function(error) {
                if(error) {
                    console.log('ERROR: ' + error);
                }
            }); 
        }
    }
    
    socket.write('Server: Welcome to the Chat Server ' + socket.name + '!\n');
    
    socket.setEncoding('utf8');
    connectionList.push(socket); //add new client connection to list
    totalConnections++;
    
//    broadcast('Number of Chat Server participants: ' + totalConnections + '\n', socket); 
    
    socket.write('Server: Please enter your username: ');
    hasNameChanged = false;
    
    /*
        Data socket
    */
    socket.on('data', function (data) {
        if (!hasNameChanged) {
            socket.username = data.trim(); // eliminate new line
            hasNameChanged = true;
            
            broadcast(socket.username + ' joined the Chat Server\n', 'Server');
        } else {
            if (levelNum > 1) {
                loggingMsg = socket.username.toString() + ': ' + data.toString().trim();
                console.log(loggingMsg);

                if (fileName != '') {
                    fs.appendFile(fileName, loggingMsg, function(error) {
                        if(error) {
                            console.log('ERROR: ' + error);
                        }
                    }); 
                }
            }

            broadcast(data, socket.username);
        }
    }); // end data socket
    
    
    /* 
        Close socket
    */
    socket.on('close', function (error) {
        connectionList.splice(connectionList.indexOf(socket), 1); //remove client from list
        totalConnections--;
        
        if (levelNum == 2) {
            loggingMsg = 'DISCONNECT: ' + socket.name.toString() + '\n';
            console.log(loggingMsg);

            if (fileName != '') {
                fs.appendFile(fileName, loggingMsg, function(error) {
                    if(error) {
                        console.log('ERROR: ' + error);
                    }
                }); 
            }
        }
        
        broadcast(socket.username + ' left the Chat Server\n', 'Server');
//        broadcast('Number of Chat Server participants: ' + totalConnections + '\n', 'Server'); 
        
    }); // end close socket
    
    socket.on('error', function (error) {
        console.log('ERROR: ' + error);
    }); // end error socket
    
}).listen(8113); // server listens on port 8113

/*==================
|     BROADCAST     |
===================*/

/*  Function broadcast
    Sends a message out to all connected clients except for sender
*/
function broadcast(message, name) {
    for (var i = 0; i < connectionList.length; i++) {
        connectionList[i].write(name + ': ' + message);
    }
};

/*==================
|       DATE       |
===================*/

/*  Function pad
    Pads 0 for month if < 2 digits
*/
function pad(n) {
    return n < 10 ? '0' + n : n;
};

/*  Function currTime
    Returns current time while padding numbers
*/
function currTime() { 
    var date = new Date();
    
    return (date.getFullYear() + '-'
            + pad(date.getMonth() + 1) + '-'
            + pad(date.getDate()) + ' ' 
            + pad(date.getHours()) + ':'
            + pad(date.getMinutes()) + ':'
            + pad(date.getSeconds()) + ' ');
};