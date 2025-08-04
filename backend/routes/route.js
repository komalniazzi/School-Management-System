module.exports = app => {
  const {
    adminRegister,
    adminLogIn,
    getAdminDetail
  } = require('../controllers/admin-controller.js');

  const {
    Student,
    Teacher,
    Notice,
    SClass,
    // Import other Sequelize models as needed
  } = require('../models'); // Import Sequelize models

  var router = require("express").Router();

  // Admin
  router.post('/AdminReg', adminRegister);
  router.post('/AdminLogin', adminLogIn);
  router.get("/Admin/:id", getAdminDetail);

  // Student
  router.post('/StudentReg', async (req, res) => {
    try {
      // Create a student using Sequelize model
      const student = await Student.create(req.body);
      res.status(201).json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add other Student routes using Sequelize models

  // Teacher
  router.post('/TeacherReg', async (req, res) => {
    try {
      // Create a teacher using Sequelize model
      const teacher = await Teacher.create(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add other Teacher routes using Sequelize models

  // Notice
  router.post('/NoticeCreate', async (req, res) => {
    try {
      // Create a notice using Sequelize model
      const notice = await Notice.create(req.body);
      res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Add other Notice routes using Sequelize models
router.get('/NoticeList/:adminId', async (req, res) => {
    try {
      const notices = await Notice.findAll({ where: { adminId: req.params.adminId } });
      res.status(200).json(notices);
    } catch (error) {
      console.error("🔥 Notice List Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ================= SCLASS =================

  // SclassCreate route

  app.use('/', router);
};
