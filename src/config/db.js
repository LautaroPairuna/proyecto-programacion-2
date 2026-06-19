const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB conectado con éxito');
};
mongoose.connection.on('error', (err) => {
  console.log('Hubo un error en la conexión con MongoDB:', err);
});

module.exports = connectDB;
