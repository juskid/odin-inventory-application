const { Router } = require("express");
const controller = require("../controllers/itemsController");
const router = Router();

router.get("/", controller.itemsGet);

router.get("/create", controller.createItemGet);
router.post("/create", controller.createItemPost);

router.get("/update/:id", controller.updateItemGet);
router.post("/update/:id", controller.updateItemPost);

router.get("/delete/:id", controller.deleteItem);

router.get("/:id", controller.itemDetailsGet);

module.exports = router;