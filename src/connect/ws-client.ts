import * as AWS from 'aws-sdk';

export class Client {
  client?: AWS.ApiGatewayManagementApi;
  constructor(config?: any) {
    if (config) {
      this._setupClient(config);
    }
  }

  // allow just passing a single event to setup the client for ease of use
  async _setupClient(config: any) {
    console.log('config', config);

    this.client = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: `https://${config.requestContext.domainName}/${config.requestContext.stage}`,
    });

    console.log('this.client', this.client);

    const connectionInfo = await this.client
      ?.getConnection({
        ConnectionId: config.requestContext.connectionId,
      })
      .promise();

    console.log('connectionInfo', connectionInfo);

    // temporarily we update dynamodb with most recent info
    // after CF support this can go away, we just do this so a single deployment makes this work
    // if(config.fromDb !== true){
    //     await db.Client.put({
    //         TableName: db.Table,
    //         Item: {
    //             [db.Primary.Key]: 'APPLICATION',
    //             [db.Primary.Range]: 'WS_CONFIG',
    //             requestContext: {
    //                 domainName: config.requestContext.domainName,
    //                 stage: config.requestContext.stage
    //             }
    //         }
    //     }).promise();
    // }
    // }
  }

  // async send(connection, payload){
  //     // Cheat and allow event to be passed in
  //     // this also lets us default to setupClient too
  //     await this._setupClient(connection)

  //     let ConnectionId = connection;
  //     if(typeof connection === 'object'){
  //         ConnectionId = connection.requestContext.connectionId;
  //     }

  //     console.log(connection, payload)
  //     await this.client.postToConnection({
  //         ConnectionId,
  //         Data: JSON.stringify(payload)
  //     }).promise().catch(async err => {
  //         console.log(JSON.stringify(err))

  //         if (err.statusCode === 410) {
  //             // unsub all channels connection was in
  //             const subscriptions = await db.fetchConnectionSubscriptions(ConnectionId);

  //             console.log(`[wsClient][send][postToConnection] Found stale connection, deleting ${ConnectionId}:`);
  //             console.log('[wsClient][send][postToConnection] Unsubscribe from channels:');
  //             console.log(JSON.stringify(subscriptions, null, 2));

  //             const unsubscribes = subscriptions.map(async subscription =>
  //                 db.Client.delete({
  //                     TableName: db.Table,
  //                     Key: {
  //                         [db.Channel.Connections.Key]: `${db.Channel.Prefix}${db.parseEntityId(subscription[db.Channel.Primary.Key])}`,
  //                         [db.Channel.Connections.Range]: `${db.Connection.Prefix}${ConnectionId}`
  //                     }
  //                 }).promise()
  //             );

  //             await Promise.all(unsubscribes);
  //         }
  //     });

  //     return true;
  // }
}

// module.exports = {
//     Client
// }
