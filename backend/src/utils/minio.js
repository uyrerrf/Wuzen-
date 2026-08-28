const { Client } = require('minio');

const endpoint = process.env.MINIO_ENDPOINT;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;

let minioClient = null;
const BUCKET_NAME = 'wuzen-exfil';

if (endpoint && accessKey && secretKey) {
  minioClient = new Client({
    endPoint: endpoint,
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: accessKey,
    secretKey: secretKey
  });

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
} else {
  console.log('MinIO not configured — skipping initialization');
}

module.exports = { minioClient, BUCKET_NAME };
