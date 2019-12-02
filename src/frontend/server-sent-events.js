// Connect to server to recieve stream of updates
const source = new EventSource('/stream');

source.onopen = () => {
  console.log('Connection to server opened.');
};
source.onmessage = stream => {
  console.log('Received stream, update data.', stream.data);
};
source.onerror = error => {
  console.log('An error has occurred while receiving stream.', error);
  source.close();
};
