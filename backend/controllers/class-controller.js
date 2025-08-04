const SClass = require('../models/sclassSchema'); // Assuming you have the Sequelize model defined as 'SClass'
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');
const Teacher = require('../models/teacherSchema');

const sclassCreate = async (req, res) => {
    try {
        const { sclassName, adminID } = req.body;

        const existingSclass = await SClass.findOne({ where: { sclassName, school_id: adminID } });
        if (existingSclass) {
            return res.status(400).json({ message: 'Sorry, this class name already exists' });
        }

        const sclass = await SClass.create({ sclassName, school_id: adminID });
        res.status(201).json(sclass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sclassList = async (req, res) => {
    try {
        const sclasses = await SClass.findAll({ where: { school_id: req.params.id } });
        if (sclasses.length > 0) {
            res.status(200).json(sclasses);
        } else {
            res.status(404).json({ message: "No sclasses found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSclassDetail = async (req, res) => {
    try {
        const sclass = await SClass.findByPk(req.params.id, {
            include: [{ model: Admin, attributes: ['schoolName'] }]
        });
        if (sclass) {
            res.status(200).json(sclass);
        } else {
            res.status(404).json({ message: "No class found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.findAll({ where: { sclassName: req.params.id } });
        if (students.length > 0) {
            const modifiedStudents = students.map(student => {
                const { password, ...rest } = student.toJSON();
                return rest;
            });
            res.status(200).json(modifiedStudents);
        } else {
            res.status(404).json({ message: "No students found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await SClass.destroy({ where: { id: req.params.id } });
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        await Student.destroy({ where: { sclassName: req.params.id } });
        await Subject.destroy({ where: { sclassName: req.params.id } });
        await Teacher.destroy({ where: { teachSclass: req.params.id } });
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await SClass.destroy({ where: { school_id: req.params.id } });
        if (deletedClasses === 0) {
            return res.status(404).json({ message: "No classes found to delete" });
        }
        await Student.destroy({ where: { school_id: req.params.id } });
        await Subject.destroy({ where: { school_id: req.params.id } });
        await Teacher.destroy({ where: { school_id: req.params.id } });
        res.status(200).json({ message: "Classes deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };
