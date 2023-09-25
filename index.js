    const fs = require('fs');

class ProductManager {
    constructor() {
        this.products = [];
        this.dataFile = 'products.json'; 
        this.loadDataFromFile(); 
    }
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    loadDataFromFile() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

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

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        console.log("Buscando producto con ID:", id); // Agrega este mensaje de registro
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

const productManager = new ProductManager();

try {
    let newProduct; // Declaración fuera del bloque try
    newProduct = {
        title: "producto prueba",
        description: "este es un producto de prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc123",
        stock: 25,
    };
    productManager.addProduct(newProduct);
    const product = productManager.getProductById(newProduct.id);
    console.log("Producto encontrado por ID:", product);
} catch (error) {
    console.error(error.message);
}
console.log("Productos después de agregar:", productManager.getProducts());
try {
    // Elimina la declaración de 'const newProduct' aquí
    const product = productManager.getProductById(newProduct.id);
    console.log("Producto encontrado por ID:", product);
} catch (error) {
    console.error(error.message);
}


    const express = require('express');
    const app = express();
    const port = 8080;


app.get('/products', (req, res) => {
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
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    try {
        const product = productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});
        app.get('/products/limit/:limit', (req, res) => {
            const limit = parseInt(req.params.limit);
            const products = productManager.getProducts().slice(0, limit);
            res.json(products);
        });
    app.get('/products/notfound', (req, res) => {
        res.status(404).json({ error: 'Producto no encontrado' });
    });
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });