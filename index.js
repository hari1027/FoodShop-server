const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express()
const cors = require("cors")
const FoodshopRouter = require('./routes/ShopsRouter')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log('DB Connected')).catch((err) => console.log(err))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors());

app.use(FoodshopRouter);

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'hari04harry@gmail.com',
        pass: 'kqmw kgxc cfbg qmkl',
    },
});

app.post('/send-email', (req, res) => {
    const { email } = req.body;
    const token = generateToken();

    const mailOptions = {
        from: 'hari04harry@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `your token is : ${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send({ message: "Error sending email" });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({ message: "Email sent", token: token });
        }
    });
});

// Sample data structure to store shop feedback
const shops = {};

// Calculate the average rating for a shop
const calculateAverageRating = (shop) => {
    if (shop.feedback.length === 0) {
        return 0;
    }
    else {
        let avgRating = 0
        shop.feedback.map((item) => {
            avgRating = avgRating + item.rating
        })
        avgRating = avgRating / shop.feedback.length
        return avgRating
    }
};

const totalComments = (shop) => {
    if (shop.feedback.length === 0) {
        return 0;
    }
    else {
        let totalComments = 0
        shop.feedback.map((item) => {
            if (item.name !== null && item.name !== undefined && item.name !== '') {
                totalComments = totalComments + 1
            }
        })
        return totalComments
    }
}

// API endpoint to submit feedback for a shop
app.post('/submitFeedback', (req, res) => {
    const { shopId, email, rating, name, comments } = req.body;

    // Check if the shop exists in the data structure
    if (!shops[shopId]) {
        shops[shopId] = {
            feedback: [],
        };
    }

    const shop = shops[shopId];

    // Check if the user has already submitted feedback
    const existingFeedbackIndex = shop.feedback.findIndex((feedback) => feedback.email === email);

    if (existingFeedbackIndex !== -1) {
        // Update existing feedback
        shop.feedback[existingFeedbackIndex] = { email, rating, name, comments };
    } else {
        // Add new feedback
        shop.feedback.push({ email, rating, name, comments });
    }

    // Update the shop's ratings array
    // shop.ratings.push(Number(rating));

    // Send success response with status 200
    res.status(200).json({
        message: 'Feedback successfully submitted',
    });
});

// API endpoint to get the shop's object based on shopId
app.get('/getShopRatingAndFeedback/:shopId', (req, res) => {
    const { shopId } = req.params;

    // Check if the shop exists in the data structure
    if (shops[shopId]) {
        const shop = shops[shopId];
        const averageRating = calculateAverageRating(shop);
        let totalPeopleGivenRating = shop.feedback.length;
        let totalPeopleGivenComments = totalComments(shop)
        const data = { shop, averageRating, totalPeopleGivenRating, totalPeopleGivenComments };
        res.status(200).json(data);
    } else {
        res.status(404).json({
            message: 'Shop not found',
        });
    }
});

const bookMarkedShops = {};

// API endpoint to bookmark a shop for a user
app.post('/bookmarkShop', (req, res) => {
    const { shopId, email } = req.body;

    // Check if the shop exists in the data structure
    if (!bookMarkedShops[shopId]) {
        bookMarkedShops[shopId] = {
            shopId: shopId,
            bookmarkedBy: [],
        };
    }

    // Check if the user has already bookmarked the shop
    const isBookmarked = bookMarkedShops[shopId].bookmarkedBy.includes(email);

    if (!isBookmarked) {
        // Add the user's email to the list of users who bookmarked the shop
        bookMarkedShops[shopId].bookmarkedBy.push(email);

        // Send success response with status 200
        res.status(200).json({
            message: 'Shop bookmarked successfully',
        });
    } else {
        // Send a response indicating that the shop is already bookmarked
        res.status(400).json({
            message: 'Shop is already bookmarked by the user',
        });
    }
});

//Api endpoint to remove bookMark for a user
app.post('/removeShopFromBookmark', (req, res) => {
    const { shopId, email } = req.body;

    // Check if the shop exists in the data structure
    if (bookMarkedShops[shopId]) {

        // Check if the user has bookmarked the shop
        const userIndex = bookMarkedShops[shopId].bookmarkedBy.indexOf(email);

        if (userIndex !== -1) {
            // Remove the user's email from the list of users who bookmarked the shop
            bookMarkedShops[shopId].bookmarkedBy.splice(userIndex, 1);

            // Send success response with status 200
            res.status(200).json({
                message: 'Shop removed from bookmarks for the user successfully',
            });
        } else {
            // Send a response indicating that the user did not bookmark the shop
            res.status(400).json({
                message: 'User did not bookmark the shop',
            });
        }
    } else {
        // Send a response indicating that the shop does not exist
        res.status(404).json({
            message: 'Shop not found',
        });
    }
});

// API endpoint to get bookmarked shops for a user
app.get('/getBookmarkedShops/:email', (req, res) => {
    const { email } = req.params;
    const bookmarkedShopsList = [];

    // Iterate through all shops to find bookmarked shops for the user
    Object.entries(bookMarkedShops).forEach(([shopId, shop]) => {
        if (shop.bookmarkedBy.includes(email)) {
            bookmarkedShopsList.push({
                shopId,
            });
        }
    });

    res.status(200).json({
        bookmarkedShopsList,
    });

});

//Api endpoint to get all name and comments of a shop
app.get('/getCommentsList/:shopId', (req, res) => {
    const { shopId } = req.params;

    // Check if the shop exists in the data structure
    if (!shops[shopId]) {
        return res.status(404).json({
            message: 'Shop not found',
        });
    }

    const shop = shops[shopId];

    // Filter out feedback where both name and comments are null
    const shopFeedback = shop.feedback
        .filter((feedback) => feedback.name !== null || feedback.comments !== null)
        .map((feedback) => ({
            name: feedback.name,
            comments: feedback.comments,
        }));

    res.status(200).json(shopFeedback);
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))