const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    shopAddress: { type: String, required: true },
    shopCategory: { type: String, required: true },
    foodCuisines: { type: [String], required: true },
    menuImages: [],
    shopImages: [],
    shopOwnerName: { type: String, required: true },
    shopOwnerNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("FoodShop", ShopSchema) 