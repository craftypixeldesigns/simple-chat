# Simple Chat Server
A simple chat server for a school assignment

Requirements found here: http://www.hcitang.org/uploads/Teaching/CPSC599W2015A1.html

# Server1.js
To use:
- Run `node server1.js` in a terminal
- Run `telnet localhost 8113`  in another terminal (one terminal using telnet = one connection)
- For each client connected, type and your messages will be sent to the server

# Server2.js
To use:
- Run `node server2.js` in a terminal
- Run `telnet localhost 8113`  in another terminal (one terminal using telnet = one connection)
- The first string entered is the client's desired username
- All messages afterwards will be sent to the server
 
# Server3.js
- Run `node server3.js` in a terminal - can add additional fields (see Calling Conventions)
- Run `telnet localhost 8113`  in another terminal (one terminal using telnet = one connection)

###Calling Conventions:
`-l <num>` or `--log-level=<num>` indicates level of logging mechanism
- This is optional, where the default is 0 and no logging occurs
- Level 1: Logs only messages with the following format: _[date-time] MESSAGE: [username]: [message]_
- Level 2: Logs also the connections and disconnects from the clients: _[date-time] [CONNECT/DISCONNECT]: [IP]:[port]_

`-f <filename.extension>` or `--file=<filename.extension>` logs to a file based on level of logging mechanism
- Use extension .txt for a nicely formatted file

# Server4.js
- Run `node server4.js` in a terminal - can add additional fields (see Calling Conventions)
- Run `node elizaclient.js` or `node elizaclient2.js`
- 
# ElizaServer.js
- Run `node elizaserver.js` in a terminal - can add additional fields (see Calling Conventions)
- - Run `telnet localhost 8113`  in another terminal (one terminal using telnet = one connection)
