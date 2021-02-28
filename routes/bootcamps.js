const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	deleteBootcamp,
	createBootcamp,
	getBootcampsInRadius,
} = require("../controllers/bootcamps");

// include other resource router
const courseRouter = require("./courses");
const router = express.Router();

// re route into other resourse router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);
module.exports = router;
