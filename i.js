
// ========== SCHEMA FOR LECTURES (Individual Videos) ==========
const lectureSchema = new mongoose.Schema({
    lectureTitle: { type: String, required: true },
    videoUrl: { type: file, required: true },      // YouTube URL or uploaded video path
    videoDuration: { type: String, required: true }, // e.g., "7:16"
    isFree: { type: Boolean, default: false }        // First 2 lectures free
});

//========== SCHEMA FOR MODULES (Course Modules/Chapters) ==========
const moduleSchema = new mongoose.Schema({
    moduleTitle: { type: String, required: true },
    moduleOrder: { type: Number, default: 0 },
    lectures: [lectureSchema]
});

// ========== MAIN COURSE SCHEMA (For both Courses Page & View Course Page) ==========
const courseSchema = new mongoose.Schema({


    // ===== Basic Information (For Courses List Page) =====
    courseName: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['development', 'data', 'analyst', 'dsa', 'cloud', 'marketing', 'design', 'programming']
    },
    level: { 
        type: String, 
        required: true, 
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    duration: { type: String, required: true },       // e.g., "6 Months"
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    image: { type: String, required: true },
    courseDescription: { type: String, required: true },    // Short description for card
    

    // ===== Detailed Information (For View Course Page) =====

    longDescription: { type: String, required:true },   // Detailed description for course page
    whatYouLearn: { type: [String], required:true },    // Array of learning outcomes
    requirements: { type: [String], required:true },    // Array of prerequisites
    
    // ===== Course Content (Syllabus with Sections & Lectures) =====
    syllabus: [moduleSchema],

    // ------------- Instructor Information -------------
    instructor: {
        name: { type: String, required: true },
        profilePicture: { type: String, required: true },
        bio: { type: String, required: true }
    },

    // -------------project features-------------
    projects:[
        {
            projectTitle: { type: String, required: true },
            projectDescription: { type: String, required: true },
            projectUrl: { type: String, default: "" },
        }
    ]  
    
}, { timestamps: true });