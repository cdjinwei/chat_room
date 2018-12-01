let ws = require('nodejs-websocket');

const WS_EVENT = {
    TEXT: 'text',
    CLOSE: 'close',
    ERROR: 'error'
}

let client_list = [];
let client_id = 0;

let add_client = function (client) {
    client.id = client_id++;
    client_list.push(client);
}

let remove_client = function (client) {
    // let index = client_list.indexOf(client);
    // console.log(index);
    // client_list.splice(index, 1);
    for(let i = 0; i < client_list.length; i++){
        let client = client_list[i];
        if(client.conn == client){
            client_list.splice(i, 1);
            break;
        }
    }
}

let server = ws.createServer(function (conn) {
    console.log('New Connection!');
    add_client(conn);
    conn.on(WS_EVENT.TEXT, function (str) {
        // console.log(`get new str: ${str}`);
        //send to all 
        for (const key in client_list) {
            if (client_list.hasOwnProperty(key)) {
                const element = client_list[key];
                let side = 0;
                if(element == conn) side = 1;

                // console.log(`connection id:${element.id}`);
                element.sendText(
                    JSON.stringify({
                        id: conn.id,
                        data: str,
                        side: side
                    })
                );
            }
        }
    });
    conn.on(WS_EVENT.CLOSE, function (pa1, pa2) {
        remove_client(conn);
    });
    conn.on(WS_EVENT.ERROR, function (error) {
        //ERROR: read ECONNRESET
        //客户端强制退出时会抛出这个错误
        remove_client(conn);
        console.log(error);
    });
});

server.listen(8123);