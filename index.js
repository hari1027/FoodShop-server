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
            // ratings: [],
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

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))