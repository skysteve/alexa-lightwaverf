/**
 * Created by steve on 30/10/2016.
 */
import { log } from '../utils';


export default function (event, context) {
  log('control event', event);

  context.fail('Not implemented');
}
