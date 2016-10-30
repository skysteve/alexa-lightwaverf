import { log } from '../utils';

const AWS = require('aws-sdk');
const doc = require('dynamodb-doc');

AWS.config.update({ region: 'us-east-1' });

const dynamo = new doc.DynamoDB();

const MANUFACTURER = 'LightwaveRF';
const TABLE_NAME = 'DYNAMO_TABLE_NAME';

function getDevicesFromDynamo() {
  return new Promise((resolve, reject) => {
    dynamo.scan({ TableName: TABLE_NAME }, (err, data) => {
      return err ? reject(err) : resolve(data.Items);
    });
  });
}

/**
 * This method is invoked when we receive a "Discovery" message from Alexa Smart Home Skill.
 * We are expected to respond back with a list of appliances that we have discovered for a given
 * customer.
 */
export default function (accessToken, context, messageID) {
  /**
   * Crafting the response header
   */
  const header = {
    messageID,
    namespace: 'Alexa.ConnectedHome.Discovery',
    name: 'LightwaveRFAppliancesResponse',
    payloadVersion: '2'
  };

  /**
   * Response body will be an array of discovered devices.
   */
  const arrDevices = [];

  getDevicesFromDynamo()
    .then((roomsList) => {
      roomsList.forEach((room) => {
        const roomId = room.id;
        const roomName = room.name;

        room.devices.forEach((device) => {
          const actions = [
            'turnOff',
            'turnOn'
          ];

          if (device.type.toLowerCase() === 'dimmer') {
            actions.push('setPercentage');
            // TODO support
            // actions.push('incrementPercentage');
            // actions.push('decrementPercentage');
          }

          arrDevices.push({
            actions,
            applianceId: `R${roomId}D${device.id}`,
            manufacturerName: MANUFACTURER,
            modelName: device.type,
            version: '1.0',
            friendlyName: `${roomName}: ${device.name}`,
            friendlyDescription: `${roomName}: ${device.name}`,
            isReachable: true,
            additionalApplianceDetails: {
              roomId: room.id,
              deviceId: device.id,
              type: device.type
            }
          });
        });
      });
    })
    .then(() => {
      log('Discovered devices', arrDevices);
      context.succeed({
        header,
        payload: {
          discoveredAppliances: arrDevices
        }
      });
    })
    .catch((ex) => {
      log('Failed discovery', ex);
      context.fail(ex);
    });
}
