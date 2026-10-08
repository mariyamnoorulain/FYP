const mongoose = require('mongoose');
require('dotenv').config();
const Lecture = require('./models/lecture');

async function debug() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const lectures = await Lecture.find({}, 'title quiz processingStatus transcript');
        console.log(`Found ${lectures.length} lectures.`);

        lectures.forEach(l => {
            const mcqCount = l.quiz?.mcqs?.length || 0;
            const qCount = l.quiz?.questions?.length || 0;
            const transcriptLen = l.transcript ? l.transcript.length : 0;
            console.log(`- [${l.processingStatus || 'unknown'}] "${l.title}": mcqs=${mcqCount}, questions=${qCount}, transcript_length=${transcriptLen}`);
        });

        process.exit(0);
    } catch (e) {
        console.error('Debug failed:', e);
        process.exit(1);
    }
}

debug();
