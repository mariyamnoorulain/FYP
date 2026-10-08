const mongoose = require('mongoose');
const User = require('./backend/models/user');
const Lecture = require('./backend/models/lecture');
require('dotenv').config({ path: './backend/.env' }); // Adjust path if needed

const run = async () => {
    try {
        // Connect to MongoDB
        // Assuming URI is in .env or default local
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnhub';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // 1. Check Users
        const users = await User.find({ role: 'tutor' });
        console.log('\n--- Tutors ---');
        users.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}`);
        });

        // 2. Check Lectures
        const lectures = await Lecture.find({});
        console.log('\n--- Lectures ---');
        console.log(`Total Lectures: ${lectures.length}`);
        lectures.forEach(l => {
            console.log(`ID: ${l._id}, Title: ${l.title}, TutorID: ${l.tutorId}, CourseId: ${l.courseId}`);
        });

        // 3. Check specific match
        if (users.length > 0) {
            const firstTutorId = users[0]._id;
            const lecturesForTutor = await Lecture.find({ tutorId: firstTutorId });
            console.log(`\nLectures for first tutor (${users[0].name}): ${lecturesForTutor.length}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
