const net = require('net');
const port = 5432;                // Port number can be changed, but must be consistent with the port number in client.
const connections = [];

const connectionListener = function(socket)
{
    const terminate = function()
    {
        console.log("Client is disconnected");
        connections.splice(connections.indexOf(socket), 1);
        //connections = connections.filter( s => s !== this.socket);
    
        socket.end();
    }
    socket.on("end", terminate);
    socket.on("error", terminate);

    // Server sends the data to every conneted client except the sender.
    const dataHandler = function(data)
    {
        connections.forEach(s =>
        {
            if(s !== socket) s.write(data);
        })
    };
    socket.on("data", dataHandler);

    console.log(`Client is connected via ${socket.remotePort}`);
    connections.push(socket);
}

const server = net.createServer(connectionListener);

// Error handler
const errorHandler = (err) => {throw err}; 
server.on('error', errorHandler);

const start = () => {console.log("Server bound")};
server.listen(5432, start);

// server.on("listening", start);
// server.listen(3013);