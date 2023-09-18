const success = {
  statusCode: 200,
};

export const connectHandler = async (event: any, context: any) => {
  console.log('connectHandler event', event);
  console.log('connectHandler context', context);
  return success;
};

export const disconnectHandler = async (event: any, context: any) => {
  console.log('disconnectHandler event', event);
  console.log('disconnectHandler context', context);
  return success;
};

export const wsDefaultHandler = async (event: any, context: any) => {
  console.log('wsDefaultHandler event', event);
  console.log('wsDefaultHandler context', context);
  return success;
};

// export const connectHandler = async (event: any, context: any) => {
//   // await wsClient._setupClient(event);

//   if (event.requestContext.eventType === 'CONNECT') {
//     // sub general channel
//     await subscribeChannel(
//       {
//         ...event,
//         body: JSON.stringify({
//           action: 'subscribe',
//           channelId: 'General',
//         }),
//       },
//       context
//     );

//     return success;
//   } else if (event.requestContext.eventType === 'DISCONNECT') {
//     // // unsub all channels connection was in
//     // const subscriptions = await db.fetchConnectionSubscriptions(event);
//     // const unsubscribes = subscriptions.map(async (subscription) =>
//     //   // just simulate / reuse the same as if they issued the request via the protocol
//     //   unsubscribeChannel(
//     //     {
//     //       ...event,
//     //       body: JSON.stringify({
//     //         action: 'unsubscribe',
//     //         channelId: db.parseEntityId(subscription[db.Channel.Primary.Key]),
//     //       }),
//     //     },
//     //     context
//     //   )
//     // );

//     // await Promise.all(unsubscribes);
//     return success;
//   }

//   return success;
// };

// async function subscribeChannel(event: any, context: any) {
//   // const channelId = JSON.parse(event.body).channelId;
//   // await db.Client.put({
//   //   TableName: db.Table,
//   //   Item: {
//   //     [db.Channel.Connections.Key]: `${db.Channel.Prefix}${channelId}`,
//   //     [db.Channel.Connections.Range]: `${db.Connection.Prefix}${
//   //       db.parseEntityId(event)
//   //     }`
//   //   }
//   // }).promise();

//   // Instead of broadcasting here we listen to the dynamodb stream
//   // just a fun example of flexible usage
//   // you could imagine bots or other sub systems broadcasting via a write the db
//   // and then streams does the rest
//   return success;
// }
