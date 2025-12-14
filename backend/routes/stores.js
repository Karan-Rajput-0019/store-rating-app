// backend/routes/stores.js
const express = require("express");
const router = express.Router();

const storeController = require("../controllers/storecontroller");
const ratingController = require("../controllers/ratingController");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const {
  validateCreateStore,
  handleValidationErrors,
} = require("../middleware/validation");

router.get(
  "/with-user-rating",
  authMiddleware,
  storeController.getStoresWithUserRating
);
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);

router.post(
  "/",
  authMiddleware,
  adminOnly,
  validateCreateStore,
  handleValidationErrors,
  storeController.createStore
);

router.put("/:id", authMiddleware, adminOnly, storeController.updateStore);
router.delete("/:id", authMiddleware, adminOnly, storeController.deleteStore);

// Use submitRating and read store_id from body
router.post(
  "/rate",
  authMiddleware,
  ratingController.submitRating
);

module.exports = router;
