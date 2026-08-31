const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve website
app.use(express.static(path.join(__dirname, "public")));

// Project request API
app.post("/api/project-request", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      budget,
      message
    } = req.body;

    // Basic validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,

      replyTo: email,

      subject: `New ISMS369 Project Request - ${name}`,

      text: `
NEW ISMS369 PROJECT REQUEST

Customer Information
--------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}

Project Information
-------------------
Service: ${service}
Budget: ${budget || "Not provided"}

Project Details
---------------
${message}

--------------------
ISMS369 V4 Website
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("Project request received from:", email);

    res.json({
      success: true,
      message: "Project request sent successfully!"
    });

  } catch (error) {

    console.error("Email error:", error);

    res.status(500).json({
      success: false,
      message: "Could not send the project request."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ISMS369 V4 running on http://localhost:${PORT}`);
});
