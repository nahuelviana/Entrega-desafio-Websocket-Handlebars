const fs = require("fs")
const express = require('express');
const cartsRouter = express.Router();
const cartsDataFile = 'carts.json';

    // Función para generar IDs únicos para los carritos
function generateCartId() {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let cartId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        cartId += characters.charAt(randomIndex);
    }
    return cartId;
}

function loadCartsDataFromFile() {
    try {
        const data = fs.readFileSync(cartsDataFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Función para guardar datos de carritos en el archivo JSON
function saveCartsDataToFile(carts) {
    try {
        const data = JSON.stringify(carts, null, 2);
        fs.writeFileSync(cartsDataFile, data, 'utf-8');
    } catch (error) {
        console.error('Error saving carts data to file:', error.message);
    }
}

// Lista de carritos 
const carts = [];

// Ruta para crear un nuevo carrito

cartsRouter.post('/', (req, res) => {
    try {
        const cartId = generateCartId();

        const newCart = {
            id: cartId,
            products: [],
        };

        // Cargar los datos de carritos existentes desde el archivo JSON
        let carts = loadCartsDataFromFile();

        carts.push(newCart);

        // Guardar los datos actualizados de carritos en el archivo JSON
        saveCartsDataToFile(carts);

        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

module.exports = cartsRouter