const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../models');
const Admin = db.Admin;

// Register a new admin
const adminRegister = async (req, res) => {
  console.log("📥 Incoming Admin Registration Data:", req.body);
  try {
    // Hash the password before saving
     console.log("🔑 Hashing password...");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
     console.log("✅ Password hashed successfully");
    
    // Check if email or schoolName already exists
    console.log("🔍 Checking if admin already exists...");
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { schoolName: req.body.schoolName }
        ]
      }
    });

    if (existingAdmin) {
        console.warn("⚠️ Admin already exists with this email or school name");
      return res.status(400).json({ message: 'Email or school name already exists' });
    }

    // Create a new admin
    console.log("🛠 Creating new admin in database...");
    const admin = await Admin.create({
      ...req.body,
      password: hashedPassword
    });
 console.log("✅ Admin created successfully:", admin.toJSON());
    // Omit password before sending the response
    admin.password = undefined;

    res.status(201).json(admin);
  }  catch (error) {
  console.error("🔥 Admin Register Error:", error); // full Sequelize error in console
  res.status(500).json({
    message: "Registration failed",
    error: error.message,           // short message for frontend
    details: error                  // full details (you can remove in production)
  });}
};

// Admin login
const adminLogIn = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(req.body.password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Omit password before sending the response
    admin.password = undefined;

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin details by ID
const getAdminDetail = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Omit password before sending the response
    admin.password = undefined;

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };
