// backend/routes/stores.js
const express = require("express");
const router = express.Router();

const storecontroller = require("../controllers/storecontroller");
const ratingcontroller = require("../controllers/ratingcontroller");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const {
  validateCreateStore,
  handleValidationErrors,
} = require("../middleware/validation");

router.get(
  "/with-user-rating",
  authMiddleware,
  storecontroller.getStoresWithUserRating
);
router.get("/", storecontroller.getAllStores);
router.get("/:id", storecontroller.getStoreById);

router.post(
  "/",
  authMiddleware,
  adminOnly,
  validateCreateStore,
  handleValidationErrors,
  storecontroller.createStore
);

router.put("/:id", authMiddleware, adminOnly, storecontroller.updateStore);
router.delete("/:id", authMiddleware, adminOnly, storecontroller.deleteStore);

// Use submitRating and read store_id from body
router.post(
  "/rate",
  authMiddleware,
  ratingcontroller.submitRating
);

module.exports = router;
