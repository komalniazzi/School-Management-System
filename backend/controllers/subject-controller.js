
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');
const Teacher = require('../models/teacherSchema');


const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
            sclassName: req.body.sclassName,
            school: req.body.adminID,
        }));

        // Check if any subject already exists with the same subCode and school
        const existingSubjectBySubCode = await Subject.findOne({
            where: {
                subCode: subjects[0].subCode,
                school: req.body.adminID,
            }
        });

        if (existingSubjectBySubCode) {
            return res.status(400).send({ message: 'Sorry, this subcode must be unique as it already exists' });
        }

        const result = await Subject.bulkCreate(subjects);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            where: {
                school: req.params.id
            },
            include: [{ model: SClass, attributes: ['sclassName'] }]
        });

        if (subjects.length > 0) {
            res.send(subjects)
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            where: {
                sclassName: req.params.id
            }
        });

        if (subjects.length > 0) {
            res.send(subjects)
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            where: {
                sclassName: req.params.id,
                teacher: null
            }
        });

        if (subjects.length > 0) {
            res.send(subjects);
        } else {
            res.send({ message: "No subjects found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        const subject = await Subject.findOne({
            where: { id: req.params.id },
            include: [
                { model: SClass, attributes: ['sclassName'] },
                { model: Teacher, attributes: ['name'] }
            ]
        });

        if (subject) {
            res.send(subject);
        } else {
            res.send({ message: "No subject found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByPk(req.params.id);
        if (!deletedSubject) {
            return res.status(404).send({ message: 'Subject not found' });
        }

        await deletedSubject.destroy();

        // Set the teachSubject field to null in teachers
        await Teacher.update(
            { teachSubject: req.params.id },
            { teachSubject: null }
        );

        // Remove the objects containing the deleted subject from students' examResult array
        await Student.update(
            { examResult: { subName: req.params.id } },
            { $pull: { examResult: { subName: req.params.id } } }
        );

        // Remove the objects containing the deleted subject from students' attendance array
        await Student.update(
            { attendance: { subName: req.params.id } },
            { $pull: { attendance: { subName: req.params.id } } }
        );

        res.send(deletedSubject);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        const deletedSubjects = await Subject.destroy({ where: { school: req.params.id } });

        // Set the teachSubject field to null in teachers
        await Teacher.update(
            { teachSubject: { $in: deletedSubjects.map(subject => subject.id) } },
            { teachSubject: null }
        );

        // Set examResult and attendance to null in all students
        await Student.update(
            { examResult: { subName: { $in: deletedSubjects.map(subject => subject.id) } } },
            { examResult: null }
        );

        await Student.update(
            { attendance: { subName: { $in: deletedSubjects.map(subject => subject.id) } } },
            { attendance: null }
        );

        res.send(deletedSubjects);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const deletedSubjects = await Subject.destroy({ where: { sclassName: req.params.id } });

        // Set the teachSubject field to null in teachers
        await Teacher.update(
            { teachSubject: { $in: deletedSubjects.map(subject => subject.id) } },
            { teachSubject: null }
        );

        // Set examResult and attendance to null in all students
        await Student.update(
            { examResult: { subName: { $in: deletedSubjects.map(subject => subject.id) } } },
            { examResult: null }
        );

        await Student.update(
            { attendance: { subName: { $in: deletedSubjects.map(subject => subject.id) } } },
            { attendance: null }
        );

        res.send(deletedSubjects);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects };
