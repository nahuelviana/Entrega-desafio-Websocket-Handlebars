class ProductManager {
    constructor() {
    this.products = [];
    console.log([])
    }
    addProduct(product) {
    if (this.products.some((p) => p.code === product.code)) {
        throw new Error("El producto con el mismo código ya existe.");
    }
    this.products.push(product);
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
}

const productManager = new ProductManager();

const newProduct = {
    id: 1, 
    title: "producto prueba",
    descripcion: "este es un producto de prueba",
    price: 200,
    thumbnail: "sin imagen",
    code: "abc123",
    stock: 25,
};
productManager.addProduct(newProduct);


console.log("Productos después de agregar:", productManager.getProducts());


try {
    productManager.addProduct(newProduct);
} catch (error) {
    console.error(error.message);
}


try {
    const product = productManager.getProductById(1); 
    console.log("Producto encontrado por ID:", product);
} catch (error) {
    console.error(error.message);
}
