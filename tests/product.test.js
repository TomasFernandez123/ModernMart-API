// tests/products.test.js
const request = require('supertest');
const app = require('../app'); // Tu aplicación Express
const Product = require('../models/Product');

// Datos que usaremos en varios tests
const sampleProducts = [
    { title: 'Laptop', price: 1000, description: 'Delicious laptop', category: 'electronics' },
    { title: 'Mouse', price: 25, description: 'Delicious laptop', category: 'electronics' },
    { title: 'Keyboard', price: 75, description: 'Delicious laptop', category: 'electronics' },
];

describe('Products API - Integration Tests', () => {
    
    // Test 1: Verificar que GET /products funciona sin datos
    test('GET /products should return empty array when no products exist', async () => {
        console.log('🧪 Test 1: DB vacía');
        
        // ACCIÓN: Hacer request a tu API
        const response = await request(app)
            .get('/api/products')
            .expect(200); // Verificar que el status sea 200
        
        // VERIFICACIONES: ¿La respuesta es correcta?
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]); // Array vacío
        expect(response.body.total_products).toBe(0);
    });

    // Test 2: Verificar paginación con datos reales
    test('GET /products should return paginated results', async () => {
        console.log('🧪 Test 2: Paginación');
        
        // PREPARACIÓN: Crear productos en la DB
        await Product.insertMany(sampleProducts);
        console.log('📝 Creados 3 productos de prueba');
        
        // ACCIÓN: Pedir página 1 con límite de 2
        const response = await request(app)
            .get('/api/products?page=1&limit=2')
            .expect(200);
        
        // VERIFICACIONES
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2); // Solo 2 productos
        expect(response.body.total_products).toBe(3); // Total en DB
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(2);
        expect(response.body.total_pages).toBe(2); // 3 productos ÷ 2 = 2 páginas
        
        console.log('✅ Paginación funciona correctamente');
    });

    // Test 3: Verificar que página 2 devuelve el producto restante
    test('GET /products page 2 should return remaining product', async () => {
        console.log('🧪 Test 3: Página 2');
        
        // PREPARACIÓN
        await Product.insertMany(sampleProducts);
        
        // ACCIÓN: Pedir página 2
        const response = await request(app)
            .get('/api/products?page=2&limit=2')
            .expect(200);
        
        // VERIFICACIONES
        expect(response.body.data).toHaveLength(1); // Solo queda 1 producto
        expect(response.body.page).toBe(2);
        
        console.log('✅ Página 2 funciona correctamente');
    });

    // Test 4: Verificar límites inválidos
    test('GET /products should handle invalid parameters gracefully', async () => {
        console.log('🧪 Test 4: Parámetros inválidos');
        
        await Product.insertMany(sampleProducts);
        
        // ACCIÓN: Enviar parámetros raros
        const response = await request(app)
            .get('/api/products?page=abc&limit=xyz')
            .expect(200);
        
        // VERIFICACIONES: Debe usar valores por defecto
        expect(response.body.page).toBe(1); // Default
        expect(response.body.limit).toBe(10); // Default
        
        console.log('✅ Maneja parámetros inválidos correctamente');
    });
});