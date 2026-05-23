const courseModel = require("../models/coursesModel");
const fs = require("fs");
const path = require("path");

// ==================== EXISTING CONTROLLERS ====================

// Show admin login page
function showAdminLogin(req, res) {
    console.log("i am admin login");
    res.render("pages/adminLogin");
}

// Store a new course (creation)
function storeCourses(req, res) {
    console.log("=== Received Body ===");
    console.log(req.body);
    console.log("=== Received Files ===");
    console.log(req.files);

    try {
        // Process Course Image
        const courseImageFile = req.files?.find(f => f.fieldname === "courseImage");
        const imagePath = courseImageFile ? "/" + courseImageFile.path.replace(/\\/g, "/") : "";

        // Process Instructor Image
        const instructorImageFile = req.files?.find(f => f.fieldname === "instructorImage");
        const instructorImagePath = instructorImageFile ? "/" + instructorImageFile.path.replace(/\\/g, "/") : "";

        // Convert whatYouLearn (string with newlines/commas to array)
        let whatYouLearnArray = [];
        if (req.body.whatYouLearn) {
            whatYouLearnArray = req.body.whatYouLearn
                .split(/\r?\n|,/)
                .map(item => item.trim())
                .filter(item => item);
        }

        // Convert requirements (string to array)
        let requirementsArray = [];
        if (req.body.requirements) {
            requirementsArray = req.body.requirements
                .split(/\r?\n|,/)
                .map(item => item.trim())
                .filter(item => item);
        }

        // Process modules → syllabus (rename & add videoUrl)
        const syllabus = [];
        if (req.body.modules && Array.isArray(req.body.modules)) {
            for (let i = 1; i < req.body.modules.length; i++) {
                const module = req.body.modules[i];
                if (module && module.moduleTitle) {
                    const lectures = [];
                    if (module.lectures && Array.isArray(module.lectures)) {
                        for (let j = 1; j < module.lectures.length; j++) {
                            const lecture = module.lectures[j];
                            if (lecture && lecture.lectureTitle) {
                                const videoFieldName = `modules[${i}][lectures][${j}][videoFile]`;
                                const videoFile = req.files?.find(f => f.fieldname === videoFieldName);
                                const videoUrl = videoFile ? "/" + videoFile.path.replace(/\\/g, "/") : "";
                                
                                lectures.push({
                                    lectureTitle: lecture.lectureTitle,
                                    videoUrl: videoUrl,
                                    videoDuration: lecture.videoDuration || "0:00",
                                    isFree: lecture.isFree === "true"
                                });
                            }
                        }
                    }
                    syllabus.push({
                        moduleTitle: module.moduleTitle,
                        lectures: lectures
                    });
                }
            }
        }

        // Process projects
        const projects = [];
        if (req.body.projects && Array.isArray(req.body.projects)) {
            for (let i = 1; i < req.body.projects.length; i++) {
                const project = req.body.projects[i];
                if (project && project.projectTitle) {
                    projects.push({
                        projectTitle: project.projectTitle,
                        projectDescription: project.projectDescription || "",
                        projectUrl: project.projectUrl || ""
                    });
                }
            }
        }

        // Build final course document
        const courseData = {
            courseName: req.body.courseName,
            category: req.body.category,
            level: req.body.level,
            duration: req.body.duration,
            price: Number(req.body.price),
            originalPrice: Number(req.body.originalPrice),
            image: imagePath,
            courseDescription: req.body.courseDescription,
            longDescription: req.body.longDescription || req.body.courseDescription,
            whatYouLearn: whatYouLearnArray,
            requirements: requirementsArray,
            syllabus: syllabus,
            instructor: {
                name: req.body.instructorName,
                profilePicture: instructorImagePath,
                bio: req.body.instructorBio
            },
            projects: projects
        };

        console.log("=== Transformed Course Data ===");
        console.log(JSON.stringify(courseData, null, 2));

        // Save to MongoDB
        const newCourse = new courseModel(courseData);
        newCourse.save()
            .then(() => {
                console.log("✅ Course saved successfully");
                res.redirect("/admin/courses?success=Course created successfully");
            })
            .catch((error) => {
                console.error("❌ Error saving course:", error);
                // Delete uploaded files if database save fails
                if (req.files) {
                    req.files.forEach(file => {
                        if (fs.existsSync(file.path)) {
                            fs.unlinkSync(file.path);
                        }
                    });
                }
                res.status(500).send("Error saving course: " + error.message);
            });
    } catch (error) {
        console.error("❌ Error in storeCourses:", error);
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(500).send("Error processing course data: " + error.message);
    }
}

// Show admin dashboard (list all courses)
function adminDashboard(req, res) {
    res.render("pages/adminDashboard");
}

// ==================== NEW CONTROLLERS FOR COURSE MANAGEMENT ====================

// Helper function to delete old file if it exists
function deleteOldFile(filePath) {
    if (filePath && filePath !== "" && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted old file: ${filePath}`);
        } catch (err) {
            console.error(`Failed to delete old file: ${filePath}`, err);
        }
    }
}

// Helper to save uploaded file (returns stored path)
function saveUploadedFile(file) {
    // file already saved by multer, just return its relative path
    return "/" + file.path.replace(/\\/g, "/");
}

// API: Get all courses (JSON)
const getApiAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
};

// API: Delete a course by ID
const deleteApiCourse = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Delete associated files (images, videos, etc.) from server
        // Course image
        if (course.image && fs.existsSync(course.image.substring(1))) {
            fs.unlinkSync(course.image.substring(1));
        }
        // Instructor image
        if (course.instructor?.profilePicture && fs.existsSync(course.instructor.profilePicture.substring(1))) {
            fs.unlinkSync(course.instructor.profilePicture.substring(1));
        }
        // Lecture videos
        if (course.syllabus && Array.isArray(course.syllabus)) {
            course.syllabus.forEach(module => {
                if (module.lectures) {
                    module.lectures.forEach(lecture => {
                        if (lecture.videoUrl && fs.existsSync(lecture.videoUrl.substring(1))) {
                            fs.unlinkSync(lecture.videoUrl.substring(1));
                        }
                    });
                }
            });
        }

        await courseModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: "Failed to delete course" });
    }
};

// GET add course form (no data)
const getAddCourseForm = (req, res) => {
    res.render("pages/courseForm", { course: null });
};

// GET edit course form (populated with existing data)
const getEditCourseForm = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).send("Course not found");
        }
        res.render("pages/courseForm", { course });
    } catch (error) {
        console.error("Error loading edit form:", error);
        res.status(500).send("Server Error");
    }
};

// UPDATE course (handles incremental module/lecture updates)
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const existingCourse = await courseModel.findById(courseId);
        if (!existingCourse) {
            return res.status(404).send("Course not found");
        }

        // Extract form data
        const {
            courseName, category, courseDescription, longDescription,
            level, duration, price, originalPrice,
            whatYouLearn, requirements,
            instructorName, instructorBio,
            modules, projects, isPublished
        } = req.body;

        // --- Process course image ---
        let courseImage = existingCourse.image;
        const courseImageFile = req.files?.find(f => f.fieldname === "courseImage");
        if (courseImageFile) {
            // Delete old image if exists
            if (existingCourse.image && fs.existsSync(existingCourse.image.substring(1))) {
                fs.unlinkSync(existingCourse.image.substring(1));
            }
            courseImage = saveUploadedFile(courseImageFile);
        }

        // --- Process instructor image ---
        let instructorProfilePicture = existingCourse.instructor?.profilePicture;
        const instructorImageFile = req.files?.find(f => f.fieldname === "instructorImage");
        if (instructorImageFile) {
            if (existingCourse.instructor?.profilePicture && fs.existsSync(existingCourse.instructor.profilePicture.substring(1))) {
                fs.unlinkSync(existingCourse.instructor.profilePicture.substring(1));
            }
            instructorProfilePicture = saveUploadedFile(instructorImageFile);
        }

        // Parse arrays from comma-separated strings
        const whatYouLearnArray = whatYouLearn ? whatYouLearn.split(",").map(s => s.trim()).filter(s => s) : [];
        const requirementsArray = requirements ? requirements.split(",").map(s => s.trim()).filter(s => s) : [];

        // --- Process syllabus (modules & lectures) ---
        let processedSyllabus = [];
        
        if (modules && typeof modules === "object") {
            // modules sent as an object with numeric keys (from dynamic form)
            const moduleKeys = Object.keys(modules).filter(k => !isNaN(parseInt(k)));
            for (const key of moduleKeys) {
                const module = modules[key];
                let lecturesArray = [];
                if (module.lectures && typeof module.lectures === "object") {
                    const lectureKeys = Object.keys(module.lectures).filter(k => !isNaN(parseInt(k)));
                    for (const lKey of lectureKeys) {
                        const lecture = module.lectures[lKey];
                        let videoUrl = lecture.existingVideoUrl || "";
                        
                        // Check for new video upload
                        const videoFieldName = `modules[${key}][lectures][${lKey}][videoFile]`;
                        const videoFile = req.files?.find(f => f.fieldname === videoFieldName);
                        if (videoFile) {
                            // Delete old video if exists
                            if (videoUrl && videoUrl !== "" && fs.existsSync(videoUrl.substring(1))) {
                                fs.unlinkSync(videoUrl.substring(1));
                            }
                            videoUrl = saveUploadedFile(videoFile);
                        }
                        
                        lecturesArray.push({
                            lectureTitle: lecture.lectureTitle,
                            videoUrl: videoUrl,
                            videoDuration: lecture.videoDuration || "0:00",
                            isFree: lecture.isFree === "true"
                        });
                    }
                }
                processedSyllabus.push({
                    moduleTitle: module.moduleTitle,
                    lectures: lecturesArray
                });
            }
        } else {
            // No new module data, keep existing syllabus
            processedSyllabus = existingCourse.syllabus;
        }

        // --- Process projects ---
        let processedProjects = [];
        if (projects && typeof projects === "object") {
            const projectKeys = Object.keys(projects).filter(k => !isNaN(parseInt(k)));
            for (const key of projectKeys) {
                const proj = projects[key];
                processedProjects.push({
                    projectTitle: proj.projectTitle,
                    projectDescription: proj.projectDescription || "",
                    projectUrl: proj.projectUrl || ""
                });
            }
        } else {
            processedProjects = existingCourse.projects || [];
        }

        // Prepare final update data
        const updatedData = {
            courseName,
            category,
            courseDescription,
            longDescription: longDescription || courseDescription,
            image: courseImage,
            level,
            duration,
            price: Number(price),
            originalPrice: Number(originalPrice),
            whatYouLearn: whatYouLearnArray,
            requirements: requirementsArray,
            syllabus: processedSyllabus,
            instructor: {
                name: instructorName,
                profilePicture: instructorProfilePicture,
                bio: instructorBio
            },
            projects: processedProjects,
            isPublished: isPublished === "true"
        };

        await courseModel.findByIdAndUpdate(courseId, updatedData, { new: true });
        res.redirect("/admin/courses?success=Course updated successfully");
    } catch (error) {
        console.error("Error updating course:", error);
        // Clean up newly uploaded files if update fails
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(500).send("Failed to update course: " + error.message);
    }
};

// ==================== EXPORT ALL CONTROLLERS ====================
module.exports = {
    showAdminLogin,
    adminDashboard,
    storeCourses,
    getApiAllCourses,
    deleteApiCourse,
    getAddCourseForm,
    getEditCourseForm,
    updateCourse
};