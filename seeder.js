const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");

//Load env vars
dotenv.config({ path: `./config/config.env` });

//Load models
const Bootcamp = require("./models/bootcamp");
const Course = require("./models/Course");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

//Read JSON fies
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

//Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		console.log("Data imported...".green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

//Delete Data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		console.log("Data Deleted...".red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
