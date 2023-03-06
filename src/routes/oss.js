import express from "express";
import multer from "multer";

import obtainToken from "../middleware/obtainToken";
import {
  getBucketDetailRoute,
  deleteBucketRoute,
  getBucketsRoute,
  getItemsBucketRoute,
  postBucketRoute,
  postObjectsRoute,
  deleteObjectRoute,
} from "../controllers/oss";

const router = express.Router();

router.use(obtainToken);

router.get("/buckets", getBucketsRoute);

router.get("/buckets/:id/details", getBucketDetailRoute);

router.post("/buckets/delete", deleteBucketRoute);

router.get("/items", getItemsBucketRoute);

router.post("/items/delete", deleteObjectRoute);

router.post("/buckets", postBucketRoute);

router.post(
  "/objects",
  multer({ dest: "uploads/" }).single("fileToUpload"),
  postObjectsRoute
);

export default router;
