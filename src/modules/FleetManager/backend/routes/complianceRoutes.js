const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    uploadDocument,
    getComplianceStatus,
    getUpcomingExpiries
} = require("../controllers/complianceController");

router.post("/upload", upload.single("document"), uploadDocument);
router.get("/status", getComplianceStatus);
router.get("/upcoming-expiry", getUpcomingExpiries);
router.get("/expiries", getUpcomingExpiries);

module.exports = router;