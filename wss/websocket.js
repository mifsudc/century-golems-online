const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION
});
const apigwManagementApi = new aws.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'https://3xr8kkccte.execute-api.ap-southeast-2.amazonaws.com/dev'
});

/**
 * 
 */
module.exports.handler = async event => {
    console.log(event)

    const connectionEvents = {
        $connect,
        $disconnect,
        $default,
        sendmessage,
        info
    };

    return connectionEvents[event.requestContext.routeKey].call(null, event)
        .catch( e => { console.log('Error', e); return { statusCode: 500, body: `Failed to connect ${ JSON.stringify(e) }` } });
}

/**
 * Connect to a room lobby
 *  1. Create connection entry
 *  2. Broadcast connection to room members
 */
async function $connect(event) {
    const name = event.queryStringParameters ? event.queryStringParameters.name : undefined;
    if (!name) return { statusCode: 500 }

    let roomId = event.queryStringParameters ? event.queryStringParameters.roomId : undefined;

    // Generate empty room id
    if (!roomId) {
        let attempts = 0;
        do {
            roomId = generateRoomcode();
        } while (await roomHasMembers(roomId) && attempts++ < 10)
    }
    // only connect to a non empty room that doesn't have a dupe name
    // todo: refactor to avoid double scan
    else if ( !(await roomHasMembers(roomId)) && !(await roomHasDuplicateName(name)) ) {
        return { statusCode: 500 }
    }

    const { connectionId } = event.requestContext;
    const time = Date.now();

    // Create new connection item
    const connection = {
        TableName: process.env.TABLE_NAME,
        Item: {
            connectionId,
            roomId,
            name,
            time
        }
    };
    await db.put(connection).promise();

    // Broadcast to room members
    await dispatchToRoom(roomId, connectionId, JSON.stringify({ action: 'connect', body: { name, connectionId } }));
    
    return { statusCode: 200, body: roomId };
}

/**
 * Disconnect from a room lobby
 *  1. Remove connection entry
 *  2. Broadcast disconnection to room members
 */
async function $disconnect(event) {

    
    const connectionId = event.requestContext.connectionId;
    
    // Obtain game & connection details
    const query = {
        TableName: process.env.TABLE_NAME,
        Key: {
            connectionId
        }
    };
    
    const { Item } = await db.get(query).promise();
    const { roomId } = Item;
    
    // Broadcast to room members
    await dispatchToRoom(roomId, connectionId, JSON.stringify({ action: 'disconnect', body: { connectionId } }));
    
    // Delete existing connection item
    const connection = {
        TableName: process.env.TABLE_NAME,
        Key: { connectionId }
    };
    await db.delete(connection).promise();
    
    return { statusCode: 200, body: 'Disconnected.' };
}

/**
 * Broadcast event to room
 */
async function sendmessage(event) {
    const connectionId = event.requestContext.connectionId;

    // Obtain game & connection details
    const query = {
        TableName: process.env.TABLE_NAME,
        Key: {
            connectionId
        }
    };

    const { Item } = await db.get(query).promise();
    const { roomId } = Item;

    const body = JSON.parse(event.body);

    // Broadcast event to members
    await dispatchToRoom(roomId, connectionId, body.message);

    return { statusCode: 200 };
}

async function $default(event) {
    console.log('event: ', event);
    return { statusCode: 200, body: 'Default.' };
}

/**
 * Dispatches room id to requester
 */
async function info(event) {
    const { connectionId } = event.requestContext;
    const playerQuery = {
        TableName: process.env.TABLE_NAME,
        Key: {
            connectionId
        }
    };

    const { Item } = await db.get(playerQuery).promise();
    const { roomId } = Item;

    const roomQuery = {
        TableName: process.env.TABLE_NAME,
        ExpressionAttributeValues: {
            ':r': roomId
        },
        ExpressionAttributeNames: {
            '#r': 'roomId',
            '#c': 'connectionId',
            '#n': 'name',
            '#t': 'time'
        },
        FilterExpression: '#r = :r',
        ProjectionExpression: '#c, #n, #t'
    };

    const { Items } = await db.scan(roomQuery).promise();
    const players = Items.sort((a, b) => a.time - b.time).map(({ name, connectionId }) => ({ name, connectionId }));

    await dispatchToMember(connectionId, JSON.stringify({ action: 'info', body: { roomId, connectionId, players } }));
    return { statusCode: 200 }
}



async function dispatchToRoom(roomId, dispatcherConnectionId, message) {
    const query = {
        TableName: process.env.TABLE_NAME,
        ExpressionAttributeValues: {
            ':id': roomId
        },
        FilterExpression: 'roomId = :id'
    };

    const connections = await db.scan(query).promise();

    const sendMessages = connections.Items.map(async ({ connectionId }) => {
        if (connectionId !== dispatcherConnectionId) {
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: message }).promise();
        }
    });
   
    return Promise.all(sendMessages);
}

async function dispatchToMember(connectionId, message) {
    return apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: message }).promise();
}

function generateRoomcode() {
    return [...Array(4)]
        .map(_ => Math.floor(Math.random() * 10))
        .map(n => String.fromCharCode(65 + n))
        .join('');
}

async function roomHasDuplicateName(name, roomId) {
    const query = {
        TableName: process.env.TABLE_NAME,
        Select: "COUNT",
        ExpressionAttributeValues: {
            ':id': roomId,
            ':n': name
        },
        ExpressionAttributeNames: {
            '#r': 'roomId',
            '#n': 'name'
        },
        FilterExpression: '#r = :id AND #n := :n'
    };

    const { Count } = await db.scan(query).promise();
    return Count > 0;
}

async function roomHasMembers(roomId) {
    const query = {
        TableName: process.env.TABLE_NAME,
        Select: "COUNT",
        ExpressionAttributeValues: {
            ':id': roomId
        },
        FilterExpression: 'roomId = :id'
    };

    const { Count } = await db.scan(query).promise();
    return Count > 0;
}