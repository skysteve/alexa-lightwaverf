/**
 * Created by steve on 30/10/2016.
 */
import { log, createMessageId } from '../utils';

const AWS = require('aws-sdk');

const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueName = 'SQS_QUEUE_NAME';

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

function sendSqsMsg(body) {
  log('Send SQS', body);
  const msg = {
    MessageBody: body,
    QueueUrl: queueName
  };

  return new Promise((resolve, reject) => {
    SQS.sendMessage(msg, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

function turnOnDevice(roomId, deviceId) {
  const msg = {
    command: 'deviceOn',
    room: roomId,
    device: deviceId
  };

  return sendSqsMsg(msg)
    .then(() => createConfirmation('TurnOnConfirmation'));
}

function turnOffDevice(roomId, deviceId) {
  const msg = {
    command: 'deviceOff',
    room: roomId,
    device: deviceId
  };

  return sendSqsMsg(msg)
    .then(() => createConfirmation('TurnOffConfirmation'));
}

function setDimLevel(roomId, deviceId, dimLevel) {
  const msg = {
    command: 'dim',
    room: roomId,
    device: deviceId,
    level: dimLevel
  };

  return sendSqsMsg(msg)
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
