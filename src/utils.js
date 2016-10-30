/**
 * Created by steve on 30/10/2016.
 */
/**
 * Utility functions.
 */
export function log(title, msg) {
  console.log('***************', title, '*************');
  if (typeof msg === 'object') {
    console.log(JSON.stringify(msg, null, 4));
  } else {
    console.log(msg);
  }
  console.log('***************', title, 'End *************');
}
