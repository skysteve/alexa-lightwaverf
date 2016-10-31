/**
 * Created by steve on 30/10/2016.
 */
import { log, createMessageId } from '../utils';

const https = require('https');

const endpoint = 'POST_ENDPOINT';

function createConfirmation(type) {
  log('send confirmation', type);

  return {
    header: {
      messageId: createMessageId(),
      name: type,
      namespace: 'Alexa.ConnectedHome.Control',
      payloadVersion: '2'
    },
    payload: {}
  };
}

function sendPostMsg(msg) {
  return new Promise((resolve, reject) => {
    try {
      const postData = JSON.stringify({
        text: `@hugo ${msg}`
      });

      const postOptions = {
        host: endpoint.substring(0, endpoint.indexOf('/')),
        port: '443',
        path: endpoint.substring(endpoint.indexOf('/')),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      let response = '';

      const postReq = https.request(postOptions, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          response += chunk;
        });

        res.on('end', () => {
          resolve(response);
        });
      });

      // post the data
      postReq.write(postData);
      postReq.end();
    } catch (ex) {
      reject(ex);
    }
  });
}

function turnOnDevice(roomId, deviceId) {
  const msg = `turn deviceOn R${roomId} D${deviceId}`;

  return sendPostMsg(msg)
    .then(() => createConfirmation('TurnOnConfirmation'));
}

function turnOffDevice(roomId, deviceId) {
  const msg = `turn deviceOff R${roomId} D${deviceId}`;


  return sendPostMsg(msg)
    .then(() => createConfirmation('TurnOffConfirmation'));
}

function setDimLevel(roomId, deviceId, dimLevel) {
  const msg = `dim R${roomId} D${deviceId} L${dimLevel}`;

  return sendPostMsg(msg)
    .then(() => createConfirmation('SetPercentageConfirmation'));
}

export default function (event) {
  log('control event', event);
  log('event type', event.header.name);

  const aplDetails = event.payload.appliance.additionalApplianceDetails;

  switch (event.header.name) {
    case 'TurnOnRequest':
      return turnOnDevice(aplDetails.roomId, aplDetails.deviceId);
    case 'TurnOffRequest':
      return turnOffDevice(aplDetails.roomId, aplDetails.deviceId);
    case 'SetPercentageRequest':
      return setDimLevel(aplDetails.roomId, aplDetails.deviceId, event.payload.percentageState.value);
    default:
      throw new Error(`Could not handle event type ${event.header.name}`);
  }
}
