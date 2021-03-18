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
		ref: "Bootcamp",
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageCost: { $avg: "$tuition" },
			},
		},
	]);
	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (error) {
		console.error(error);
	}
};

// call getAverageCost after save
CourseSchema.post("save", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost before remove
CourseSchema.pre("remove", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
