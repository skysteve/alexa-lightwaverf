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

/* eslint-disable */
export function createMessageId () {
  let d = new Date().getTime();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;

    d = Math.floor(d / 16);

    return (c=='x' ? r : (r&0x3|0x8)).toString(16);

  });

  return uuid;
}
/* eslint-enable */
