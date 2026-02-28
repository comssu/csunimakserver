import prisma from "../config/connectDB.js";
import handleUpload, { deleteExistingFile } from "../config/cloudinary.js";
export const updateProfile = async (req, res) => {
    const studentId = req.params.id;
    const { firstname, lastname, website, github, linkedIn, about, level } = req.body;
    if (!studentId)
        return res.status(400).json({ message: "User Id is required!" });
    const foundStudent = await prisma.student.findUnique({ where: { id: studentId } });
    if (!foundStudent)
        return res.status(404).json({ message: "User doesn't exist!" });
    if (req.file) {
        let result;
        if (foundStudent.profileId) {
            result = await handleUpload(req.file.buffer, "profile", foundStudent.profileId);
        }
        else {
            result = await handleUpload(req.file.buffer, "profile", null);
        }
        if (result?.secure_url && result?.public_id) {
            try {
                await prisma.student.update({
                    where: { id: studentId },
                    data: { profileUrl: result.secure_url, profileId: result.public_id }
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    if (firstname)
        await prisma.student.update({ where: { id: studentId }, data: { firstname } });
    if (lastname)
        await prisma.student.update({ where: { id: studentId }, data: { lastname } });
    if (level)
        await prisma.student.update({ where: { id: studentId }, data: { level } });
    if (website)
        await prisma.student.update({ where: { id: studentId }, data: { website } });
    if (github)
        await prisma.student.update({ where: { id: studentId }, data: { github } });
    if (linkedIn)
        await prisma.student.update({ where: { id: studentId }, data: { linkedIn } });
    if (about)
        await prisma.student.update({ where: { id: studentId }, data: { about } });
    const updatedStudent = await prisma.student.findUnique({ where: { id: studentId } });
    return res.status(200).json(updatedStudent);
};
export const addStudent = async (req, res) => {
    const { id, firstname, lastname, level, email, about, website, github, linkedIn } = req.body;
    if (!firstname)
        return res.status(400).json({ message: "Firstname is required!!" });
    if (!lastname)
        return res.status(400).json({ message: "Lastname is required!!" });
    if (!level)
        return res.status(400).json({ message: "Level is required!!" });
    if (!email)
        return res.status(400).json({ message: "Email is required!!" });
    if (!about)
        return res.status(400).json({ message: "About is required!!" });
    if (!id)
        return res.status(400).json({ message: "Id is required!!" });
    const duplicate = await prisma.student.findFirst({ where: { email } });
    const secDuplicate = await prisma.student.findFirst({ where: { id } });
    if (duplicate)
        return res.status(409).json({ message: "User with email already exists!" });
    if (secDuplicate)
        return res.status(409).json({ message: "User with ID already exists!" });
    if (req.file) {
        const result = await handleUpload(req.file.buffer, "profile", null);
        if (result?.secure_url && result?.public_id) {
            try {
                const newUser = await prisma.student.create({
                    data: {
                        profileUrl: result.secure_url,
                        profileId: result.public_id,
                        firstname,
                        lastname,
                        level,
                        email,
                        about,
                        id,
                        website: website ?? "",
                        github: github ?? "",
                        linkedIn: linkedIn ?? ""
                    }
                });
                const newUserDetails = {
                    companyname: newUser.firstname,
                    industry: newUser.lastname,
                    profileUrl: newUser.profileUrl,
                    id: newUser.id,
                    email: newUser.email,
                    linkedIn: newUser.linkedIn,
                    github: newUser.github,
                    website: newUser.website,
                    about: newUser.about,
                    level: newUser.level,
                };
                return res.status(200).json(newUserDetails);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error: Unable to create student account!" });
            }
        }
    }
    return res.status(400).json({ message: "Student image is required!" });
};
export const removeStudent = async (req, res) => {
    const studentId = req.params.id;
    if (!studentId)
        return res.status(400).json({ message: "User Id is required!" });
    const foundStudent = await prisma.student.findUnique({ where: { id: studentId } });
    if (!foundStudent)
        return res.status(404).json({ message: "User doesn't exist!" });
    try {
        if (foundStudent.profileId)
            await deleteExistingFile(foundStudent.profileId);
        await prisma.student.delete({ where: { id: studentId } });
        return res.status(200).json({ message: `Successfully removed ${foundStudent.firstname} ${foundStudent.lastname}!` });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error: Unable to remove student!" });
    }
};
export const getStudent = async (req, res) => {
    const studentId = req.params.id;
    if (!studentId)
        return res.status(400).json({ message: "User Id is required!" });
    const foundStudent = await prisma.student.findUnique({ where: { id: studentId } });
    if (!foundStudent)
        return res.status(404).json({ message: "User doesn't exist!" });
    return res.status(200).json(foundStudent);
};
export const getStudents = async (req, res) => {
    const take = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 8;
    const [students, count] = await Promise.all([
        prisma.student.findMany({
            take,
            skip,
            orderBy: {
                createdAt: "desc"
            }
        }),
        prisma.student.count()
    ]);
    console.log(count);
    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };
    return res.status(200).json({ students: shuffle(students), page, hasMore: (skip + students.length) < count });
};
export const getAllStudents = async (req, res) => {
    const students = await prisma.student.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };
    return res.status(200).json(shuffle(students));
};
