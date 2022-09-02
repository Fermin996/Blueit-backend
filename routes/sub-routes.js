const express = require("express")

const subControllers = require("../controllers/sub")

const router = express.Router()

router.get('/', subControllers.getSubs)
router.get('/:id', subControllers.getSubById)

module.exports = router