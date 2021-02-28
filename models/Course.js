const mongoose = require("mongoose");
const bootcamp = require("./bootcamp");

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add a title"],
	},
	description: {
		type: String,
		required: [true, "Please add a description"],
	},
	weeks: {
		type: String,
		required: [true, "Please add number of weeks"],
	},
	tuition: {
		type: Number,
		required: [true, "Please add a tuition cost"],
	},
	minimumSkill: {
		type: String,
		required: [true, "Please add a Skill"],
		enum: ["beginner", "intermediate", "advanced"],
	},
	scholorshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: "bootcamp",
		required: true,
	},
});

module.exports = mongoose.model("Course", CourseSchema);
