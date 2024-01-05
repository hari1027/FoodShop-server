const router = require('express').Router();
const FoodshopController = require('../controllers/ShopsController');

router.get('/Foodshop/', FoodshopController.getAllShopsList)
router.get('/Foodshop/:id', FoodshopController.getShop)
router.post('/Foodshop/', FoodshopController.addShop)
router.delete('/Foodshop/:id', FoodshopController.deleteShop)
router.put('/Foodshop/:id', FoodshopController.updateShop)
router.get('/Foodshop/search/:key', FoodshopController.searchShop)
router.post('/FilterFoodshop/',FoodshopController.filterShop)

module.exports = router