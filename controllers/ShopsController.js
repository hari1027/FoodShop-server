const FoodShop = require('../modals/ShopsDetails');

module.exports = {

    addShop: async (req, res) => {
        const newShop = new FoodShop(req.body);
        try {
            await newShop.save();
            res.status(200).json("Shop added to verification successfully")
        } catch (error) {
            res.status(500).json("Failed To add the Shop To Verification")
            console.log(error);
        }
    },

    getAllShopsList: async (req, res) => {
        try {
            const shopsList = await FoodShop.find().sort({ createdAt: -1 })
            res.status(200).json(shopsList)
        } catch (error) {
            res.status(500).json("Failed To get ShopsList")
            console.log(error);
        }
    },

    getShop: async (req, res) => {
        try {
            const shop = await FoodShop.findById(req.params.id)
            res.status(200).json(shop)
        } catch (error) {
            res.status(500).json("Failed To get ShopData")
            console.log(error);
        }
    },

    deleteShop: async (req, res) => {
        try {
            await FoodShop.findByIdAndDelete(req.params.id)
            res.status(200).json(`Shop Deleted Successfully`)
        } catch (error) {
            res.status(500).json("Failed To Delete the shop")
            console.log(error);
        }
    },

    updateShop: async (req, res) => {
        try {
            await FoodShop.findByIdAndDelete(req.params.id)
            const updateShop = new FoodShop({
                _id: req.params.id,
                shopName: req.body.shopName,
                shopAddress: req.body.shopAddress,
                shopCategory: req.body.shopCategory,
                foodCuisines: req.body.foodCuisines,
                shopOwnerName: req.body.shopOwnerName,
                shopOwnerNumber: req.body.shopOwnerNumber
            });
            await updateShop.save();
            res.status(200).json(`Shop Updated Successfully`)
        } catch (error) {
            res.status(500).json("Failed To Update the shop")
            console.log(error);
        }
    },

    searchShop: async (req, res) => {
        try {
            const shop = await FoodShop.aggregate(
                [
                    {
                        $search: {
                            index: "default",
                            text: {
                                query: req.params.key,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]
            )
            res.status(200).json(`Shop Data:${JSON.stringify(shop)}`)
        }
        catch (error) {
            res.status(500).json("Failed To Search the shop")
            console.log(error);
        }
    },

    filterShop: async(req,res) => {
        const { shopName, shopAddress, shopCategory, foodCuisines } = req.body;
        try {
            const shopsList = await FoodShop.find().sort({ createdAt: -1 })
            let filteredShops = shopsList
              if (shopName && shopName !== '') {
                filteredShops = filteredShops.filter(shop => shop.shopName === shopName);
              }
              if (shopCategory && shopCategory !== '') {
                filteredShops = filteredShops.filter(shop => shop.shopCategory === shopCategory);
              }
              if (foodCuisines && foodCuisines.length > 0) {
                filteredShops = filteredShops.filter(shop =>
                    foodCuisines.some(foodCuisines => shop.foodCuisines.includes(foodCuisines))
                );
              }
             res.json(filteredShops);
        } catch (error) {
            res.status(500).json("Failed To get ShopsList In Filter")
            console.log(error);
        }
    }
}