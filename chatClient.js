const net = require("net");
const readline = require("readline");

const input = readline.createInterface({input:process.stdin, output:process.stdout});
const port = 5432;                // Port number can be changed, but must be consistent with the port number in server.
const client = net.connect(port);

let nickname;

client.on("connect", connect);
function connect()
{
    console.log("Connected to the server.");

    input.question("Choose a nickname:", (answer) => 
    {
        nickname = answer;
        chat();
    });
}

function chat()
{
    input.question(`[${nickname}] : `, (message) => 
    {
        if(message === "exit") client.end( ()=> process.exit() );
        else
        {
            client.write(`[${nickname}] : ${message}`);
            chat();  
        }  
    })
}

client.on("data", response);
function response(data)
{
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    console.log(data.toString());
    process.stdout.write(`[${nickname}] : `);
}