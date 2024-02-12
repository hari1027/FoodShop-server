const FoodShopForApproval = require('../modals/ShopsDetailsForApproval');

module.exports = {

    addShopForApproval: async (req, res) => {
        const newShop = new FoodShopForApproval(req.body);
        try {
            await newShop.save();
            res.status(200).json("Shop added to verification successfully")
        } catch (error) {
            res.status(500).json("Failed To add the Shop To Verification")
            console.log(error);
        }
    },

    getAllShopsListNeedForApproval: async (req, res) => {
        try {
            const shopsList = await FoodShopForApproval.find().sort({ createdAt: -1 })
            res.status(200).json(shopsList)
        } catch (error) {
            res.status(500).json("Failed To get ShopsList")
            console.log(error);
        }
    },

    deleteShopFromApprovalList: async (req, res) => {
        try {
            await FoodShopForApproval.findByIdAndDelete(req.params.id)
            res.status(200).json(`Shop Deleted Successfully`)
        } catch (error) {
            res.status(500).json("Failed To Delete the shop")
            console.log(error);
        }
    },

    ApprovalToupdateShop: async (req, res) => {
        try {
            const updateShop = new FoodShopForApproval({
                _id: req.params.id,
                shopName: req.body.shopName,
                shopAddress: req.body.shopAddress,
                shopCategory: req.body.shopCategory,
                foodCuisines: req.body.foodCuisines,
                shopOwnerName: req.body.shopOwnerName,
                shopOwnerNumber: req.body.shopOwnerNumber,
                menuImages: req.body.menuImages,
                shopImages: req.body.shopImages
            });
            await updateShop.save();
            res.status(200).json(`Shop Updated Successfully`)
        } catch (error) {
            res.status(500).json("Failed To Update the shop")
            console.log(error);
        }
    },

}