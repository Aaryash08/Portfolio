const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, subject, msg } = req.body;

    // Create transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Setup email data
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECIPIENT,
        subject: subject,
        text: `You have a new contact form submission from:
        
        Name: ${name}
        Email: ${email}
        Message: ${msg}`
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Something went wrong.');
        }
        res.status(200).send('Form submitted successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
