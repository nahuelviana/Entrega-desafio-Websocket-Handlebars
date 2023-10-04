const fs = require('fs');
const express = require('express');
const app = express();
const port = 8080;
const cartsRouter = require('./cartsRouter');


// Clase ProductManager para gestionar productos
class ProductManager {
    constructor() {
        this.products = [];
        this.dataFile = 'products.json'; 
        this.loadDataFromFile(); 
    }
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
// Cargar datos de productos desde el archivo JSON
    loadDataFromFile() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }
// Guardar datos de productos en el archivo JSON
    saveDataToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.dataFile, data, 'utf-8');
        } catch (error) {
            console.error('Error saving data to file:', error.message);
        }
    }

    addProduct(product) {
        if (this.products.some((p) => p.code === product.code)) {
            throw new Error("El producto con el mismo código ya existe.");
        }
        product.id = this.generateId();
        this.products.push(product);
        this.saveDataToFile();
    }
// Obtener todos los productos
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        console.log("Buscando producto con ID:", id);
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado.");
        }
        updatedFields.id = id;
        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields
        };
        this.saveDataToFile();
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado.");
        }
        this.products.splice(productIndex, 1);
        this.saveDataToFile();
    }
}
app.use(express.json());
const productManager = new ProductManager();

let newProduct;
try {
    newProduct = {
        title: "producto prueba",
        description: "este es un producto de prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc123",
        stock: 25,
    };
    productManager.addProduct(newProduct);
    productManager.saveDataToFile();
    const product = productManager.getProductById(newProduct.id);
    console.log("Producto encontrado por ID:", product);
} catch (error) {
    console.error(error.message);
}
console.log("Productos después de agregar:", productManager.getProducts());
try {
    const product = productManager.getProductById(newProduct.id);
    console.log("Producto encontrado por ID:", product);
} catch (error) {
    console.error(error.message);
}

app.post('/api/products', (req, res) => {
    try {
        const productData = req.body;
        productManager.addProduct(productData);
        res.status(201).json(productData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;
    try {
        productManager.updateProduct(id, updatedFields);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    try {
        productManager.deleteProduct(id);
        res.status(204).send(); // Respuesta exitosa sin contenido
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




// Usar el router de carritos definido en cartsRouter.js
    app.use('/api/carts', cartsRouter);
// Rutas para obtener productos con límite
    app.get('/api/products', (req, res) => {
        const { limit } = req.query;
        if (limit) {
            const limitValue = parseInt(limit);
            const products = productManager.getProducts().slice(0, limitValue);
            res.json(products);
        } else {
            const products = productManager.getProducts();
            res.json(products);
        }
    });
// Ruta para obtener un producto por su ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    try {
        const product = productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});
// Ruta para obtener productos con límite específico
        app.get('/api/products/limit/:limit', (req, res) => {
            const limit = parseInt(req.params.limit);
            const products = productManager.getProducts().slice(0, limit);
            res.json(products);
        });
        // Ruta de error para productos no encontrados
    app.get('/products/notfound', (req, res) => {
        res.status(404).json({ error: 'Producto no encontrado' });
    });
    
// Iniciar el servidor en el puerto especificado
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });