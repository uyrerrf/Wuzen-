const { Client } = require('minio');

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'wuzen_minio',
  secretKey: process.env.MINIO_SECRET_KEY || 'wuzen_minio_secret_2026'
});

const BUCKET_NAME = 'wuzen-exfil';

(async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
    }
  } catch (err) {
    console.error('MinIO init error:', err);
  }
})();

module.exports = { minioClient, BUCKET_NAME };
