const router = require('express').Router();
const FoodshopController = require('../controllers/ShopsController');
const FoodshopAdminController = require('../controllers/ShopsApprovalController');

router.get('/Foodshop/', FoodshopController.getAllShopsList)
router.get('/Foodshop/:id', FoodshopController.getShop)
router.post('/Foodshop/', FoodshopController.addShop)
router.delete('/Foodshop/:id', FoodshopController.deleteShop)
router.put('/Foodshop/:id', FoodshopController.updateShop)
router.get('/Foodshop/search/:key', FoodshopController.searchShop)
router.post('/FilterFoodshop/', FoodshopController.filterShop)

router.get('/FoodshopAdmin/', FoodshopAdminController.getAllShopsListNeedForApproval)
router.post('/FoodshopAdmin/', FoodshopAdminController.addShopForApproval)
router.delete('/FoodshopAdmin/:id', FoodshopAdminController.deleteShopFromApprovalList)
router.put('/FoodshopAdmin/:id', FoodshopAdminController.ApprovalToupdateShop)

module.exports = router