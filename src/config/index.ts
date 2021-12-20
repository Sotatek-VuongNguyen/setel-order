export default () => ({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 3000,
  mongoDB: process.env.MONGODB,
  paymentUrl: process.env.PAYMENT_URL || 'http://localhost:4000',
});
