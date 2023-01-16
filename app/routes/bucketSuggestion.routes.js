const router = require("express").Router();
const bucket = require("../controllers/bucketSuggestion.controller");
const buckets = new bucket();


router.post('/getBallSuggestions', buckets.calculateEmptyVolume)



module.exports = router
