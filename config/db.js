const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    
    // Escuchar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    // Manejo graceful del cierre
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📴 Conexión MongoDB cerrada por terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;