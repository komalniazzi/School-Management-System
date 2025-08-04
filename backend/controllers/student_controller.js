const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema');
const Subject = require('../models/subjectSchema');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            where: {
                rollNum: req.body.rollNum,
                school_id: req.body.adminID,
                sclass_id: req.body.sclassName,
            }
        });

        if (existingStudent) {
            return res.status(400).json({ message: 'Roll Number already exists' });
        }

        const student = await Student.create({
            name: req.body.name,
            rollNum: req.body.rollNum,
            password: hashedPass,
            school_id: req.body.adminID,
            sclass_id: req.body.sclassName,
        });

        const result = student.toJSON();
        delete result.password;
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const studentLogIn = async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { rollNum: req.body.rollNum, name: req.body.studentName }
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const validated = await bcrypt.compare(req.body.password, student.password);
        if (validated) {
            const result = student.toJSON();
            delete result.password;
            delete result.examResult;
            delete result.attendance;
            res.status(200).json(result);
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { school_id: req.params.id },
            include: [{ model: SClass, attributes: ['sclassName'] }]
        });

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
};

const getStudentDetail = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                { model: Admin, attributes: ['schoolName'] },
                { model: SClass, attributes: ['sclassName'] },
                { model: Subject, as: 'examResult', attributes: ['subName'] },
                { model: Subject, as: 'attendance', attributes: ['subName', 'sessions'] }
            ]
        });

        if (student) {
            const result = student.toJSON();
            delete result.password;
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No student found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const deletedCount = await Student.destroy({ where: { id: req.params.id } });
        if (deletedCount === 0) {
            res.status(404).json({ message: "Student not found" });
        } else {
            res.status(200).json({ message: "Student deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStudents = async (req, res) => {
    try {
        const deletedCount = await Student.destroy({ where: { school_id: req.params.id } });
        if (deletedCount === 0) {
            res.status(404).json({ message: "No students found to delete" });
        } else {
            res.status(200).json({ message: "Students deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStudentsByClass = async (req, res) => {
    try {
        const deletedCount = await Student.destroy({ where: { sclass_id: req.params.id } });
        if (deletedCount === 0) {
            res.status(404).json({ message: "No students found to delete" });
        } else {
            res.status(200).json({ message: "Students deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const [updatedCount, [updatedStudent]] = await Student.update(req.body, {
            where: { id: req.params.id },
            returning: true
        });

        if (updatedCount === 0) {
            res.status(404).json({ message: "Student not found" });
        } else {
            const result = updatedStudent.toJSON();
            delete result.password;
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const [updatedCount] = await student.update({ examResult: [{ subName, marksObtained }] });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Student not found" });
        } else {
            res.status(200).json({ message: "Exam result updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const [updatedCount] = await student.update({ attendance: [{ date, status, subName }] });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Student not found" });
        } else {
            res.status(200).json({ message: "Attendance updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;
    try {
        const updatedCount = await Student.update({ attendance: [] }, { where: { 'attendance.subName': subName } });
        res.status(200).json({ message: `Attendance cleared for all students for ${subName}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id;
    try {
        const updatedCount = await Student.update({ attendance: [] }, { where: { school_id: schoolId } });
        res.status(200).json({ message: `Attendance cleared for all students in school ${schoolId}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId;
    try {
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const [updatedCount] = await student.update({ attendance: student.attendance.filter(a => a.subName !== subName) });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Student not found" });
        } else {
            res.status(200).json({ message: `Attendance removed for student ${studentId} in ${subName}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const [updatedCount] = await student.update({ attendance: [] });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Student not found" });
        } else {
            res.status(200).json({ message: `Attendance removed for student ${studentId}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    deleteStudents,
    deleteStudentsByClass,
    updateStudent,
    studentAttendance,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance
};
