import * as mqtt from 'mqtt';

let client: mqtt.Client;
let mqttConfig: any;

export const connect = (config: any, connectOptions: mqtt.IClientOptions, onConnected?: (client: mqtt.MqttClient) => void) => {
  mqttConfig = config;

  const protocol = (config.port === 8883 || config.port === 8884) ? 'mqtts' : 'mqtt';
  client = mqtt.connect(`${protocol}://${config.username}:${config.password}@${config.broker}:${config.port}`, connectOptions);

  client.on('error', (err) => {
    console.log(`Mqtt error: ${err.message}`);
  });

  client.on('connect', () => {
    console.log('Connected to mqtt');

    if (onConnected) {
      onConnected(client);
    }
  });

  client.on('close', () => {
    console.log('Mqtt connection closed');
  });
};

export const onMessage = (callback: mqtt.OnMessageCallback) => {
  client.on('message', callback);
};

export const publish = (topic: string, payload: string, retain: boolean = mqttConfig.retain) => {
  console.log(`Sending payload: ${payload} to topic: ${topic}`);
  client.publish(topic, payload, {
    qos: mqttConfig.qos,
    retain
  });
};

export const subscribe = (topic: string) => {
  client.subscribe(topic, (err) => {
    if (err) {
      console.log(`Cannot subscribe to topic ${topic}: ${err}`);
    } else {
      console.log('Subscribed to topic:', topic);
    }
  });
}


export const getClient = () => client;
