const bcrypt = require('bcrypt');
const Subject = require('../models/subjectSchema');
const Teacher = require('../models/teacherSchema');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const existingTeacher = await Teacher.findOne({ where: { email } });

        if (existingTeacher) {
            res.send({ message: 'Email already exists' });
        }
        else {
            const teacher = await Teacher.create({ name, email, password: hashedPass, role, school, teachSubject, teachSclass });

            await Subject.update({ teacherId: teacher.id }, { where: { id: teachSubject } });

            const result = teacher.toJSON();
            delete result.password;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ where: { email: req.body.email } });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await Teacher.findByPk(teacher.id, {
                    include: [{ model: Subject, attributes: ['subName', 'sessions'] }],
                });
                teacher = teacher.toJSON();
                delete teacher.password;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.findAll({ where: { school: req.params.id }, include: [{ model: Subject, attributes: ['subName'] }] });
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                let teacherData = teacher.toJSON();
                delete teacherData.password;
                return teacherData;
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findByPk(req.params.id, {
            include: [{ model: Subject, attributes: ['subName', 'sessions'] }]
        });
        if (teacher) {
            teacher = teacher.toJSON();
            delete teacher.password;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByPk(teacherId);
        if (!updatedTeacher) {
            res.send({ message: 'Teacher not found' });
            return;
        }
        await updatedTeacher.update({ teachSubject });
        await Subject.update({ teacherId: updatedTeacher.id }, { where: { id: teachSubject } });
        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByPk(req.params.id);
        if (!deletedTeacher) {
            res.send({ message: "Teacher not found" });
            return;
        }
        await deletedTeacher.destroy();
        await Subject.update({ teacherId: null }, { where: { teacherId: deletedTeacher.id } });
        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.destroy({ where: { school: req.params.id } });
        if (deletionResult === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }
        await Subject.update({ teacherId: null }, { where: { school: req.params.id } });
        res.send({ message: "Teachers deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.destroy({ where: { teachSclass: req.params.id } });
        if (deletionResult === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }
        await Subject.update({ teacherId: null }, { where: { teachSclass: req.params.id } });
        res.send({ message: "Teachers deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findByPk(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};
