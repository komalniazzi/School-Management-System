const Notice = require('../models/noticeSchema'); // Assuming you have the Sequelize model defined as 'Notice'

const noticeCreate = async (req, res) => {
    try {
        const { title, details, date } = req.body;
        const notice = await Notice.create({
            title,
            details,
            date,
            school_id: req.body.adminID // Assuming adminID is passed in the request body
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const noticeList = async (req, res) => {
    try {
        const notices = await Notice.findAll({ where: { school_id: req.params.id } });
        if (notices.length > 0) {
            res.status(200).json(notices);
        } else {
            res.status(404).json({ message: "No notices found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedCount, [updatedNotice]] = await Notice.update(req.body, {
            where: { id },
            returning: true
        });
        if (updatedCount === 0) {
            res.status(404).json({ message: "Notice not found" });
        } else {
            res.status(200).json(updatedNotice);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await Notice.destroy({ where: { id } });
        if (deletedCount === 0) {
            res.status(404).json({ message: "Notice not found" });
        } else {
            res.status(200).json({ message: "Notice deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteNotices = async (req, res) => {
    try {
        const deletedCount = await Notice.destroy({ where: { school_id: req.params.id } });
        if (deletedCount === 0) {
            res.status(404).json({ message: "No notices found to delete" });
        } else {
            res.status(200).json({ message: "Notices deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };
