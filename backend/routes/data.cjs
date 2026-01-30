const express = require("express");
const router = express.Router();
const {
  getPeople,
  getPerson,
  addPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/data.cjs");

// router.get("/", getPeople);
// router.get("/:personId", getPerson);
// router.post("/", addPerson);
// router.put("/:personId", updatePerson);
// router.delete("/:personId", deletePerson);

router.route("/").get(getPeople).post(addPerson);
router.route("/:personId").get(getPerson).put(updatePerson).delete(deletePerson);

module.exports = router;