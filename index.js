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
    const newProduct = {
    title: "producto prueba",
    description: "este es un producto de prueba",
    price: 200,
    thumbnail: "sin imagen",
    code: "abc123",
    stock: 25,
};

    try {
        productManager.addProduct(newProduct);
        console.log("Producto agregado:", newProduct);
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

    try {
        productManager.updateProduct(newProduct.id, { price: 250, stock: 30 });
        console.log("Producto actualizado:", productManager.getProductById(newProduct.id));
        } catch (error) {
            console.error(error.message);
        }

    try {
        productManager.deleteProduct(newProduct.id);
        console.log("Producto eliminado.");
    } catch (error) {
    console.error(error.message);
    }
