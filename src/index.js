/**
 * Created by steve on 30/10/2016.
 */
import { log } from './utils';
import handleControl from './handlers/control';
import handleDiscovery from './handlers/discovery';

/**
 * Main entry point.
 * Incoming events from Alexa Lighting APIs are processed via this method.
 */
exports.handler = function handler(event, context) {
  log('Input', event);

  switch (event.header.namespace) {
  /**
   * The namespace of "Discovery" indicates a request is being made to the lambda for
   * discovering all appliances associated with the customer's appliance cloud account.
   * can use the accessToken that is made available as part of the payload to determine
   * the customer.
   */
    case 'Alexa.ConnectedHome.Discovery':
      handleDiscovery(event, context, event.header.messageID);
      break;
  /**
   * The namespace of "Control" indicates a request is being made to us to turn a
   * given device on, off or brighten. This message comes with the "appliance"
   * parameter which indicates the appliance that needs to be acted on.
   */
    case 'Alexa.ConnectedHome.Control':
      handleControl(event, context);
      break;
  /**
   * We received an unexpected message
   */
    default:
      log('Err', `No supported namespace: ${event.header.namespace}`);
      context.fail('Something went wrong');
      break;
  }
};
