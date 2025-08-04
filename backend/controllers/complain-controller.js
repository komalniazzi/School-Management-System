const Complain = require('../models/complainSchema');

// Create a new complain
const createComplain = async (req, res) => {
  try {
    const newComplain = await Complain.create(req.body);
    res.status(201).json(newComplain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complains
const getAllComplains = async (req, res) => {
  try {
    const complains = await Complain.findAll();
    res.status(200).json(complains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplain, getAllComplains };
