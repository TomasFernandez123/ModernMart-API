const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
    console.log('🚀 Configurando tests...');
    
    // ✅ Asegurar que estamos desconectados
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de cualquier DB existente');
    }
    
    // ✅ Crear y conectar a DB temporal
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('✅ DB temporal conectada para tests');
});

afterAll(async () => {
    console.log('🧹 Limpiando tests...');
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('✅ Tests terminados');
});

afterEach(async () => {
    // Limpiar todas las colecciones después de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});