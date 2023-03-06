import fs from "fs";
import { BucketsApi, ObjectsApi, PostBucketsPayload } from "forge-apis";

import { clientId } from "../utils/config";

export const getBucketDetailRoute = async (req, res, next) => {
  const bucketId = req.params.id;

  try {
    const bucket = await new BucketsApi().getBucketDetails(
      bucketId,
      req.oauth_client,
      req.oauth_token
    );

    res.json({
      bucket_key: bucket.body.bucketKey,
      bucket_owner: bucket.body.bucketOwner,
      permissions: bucket.body.permissions,
      policy_key: bucket.body.policyKey,
    });
  } catch (err) {
    next(err);
  }
};

export const getBucketsRoute = async (req, res, next) => {
  try {
    const buckets = await new BucketsApi().getBuckets(
      { limit: 64 },
      req.oauth_client,
      req.oauth_token
    );

    const response = await Promise.all(
      buckets.body.items.map(async (bucket) => {
        const bucketDetail = await new BucketsApi().getBucketDetails(
          bucket.bucketKey,
          req.oauth_client,
          req.oauth_token
        );

        const bucketItems = await new ObjectsApi().getObjects(
          bucket.bucketKey,
          {},
          req.oauth_client,
          req.oauth_token
        );

        const bucketBodyName = bucketDetail.body.bucketKey.split("-");
        const bucketName = bucketBodyName.slice(1, bucket.length).join("-");

        return {
          id: bucket.bucketKey,
          text: bucket.bucketKey.replace(`${clientId.toLowerCase()}-`, ""),
          type: "bucket",
          children: bucketItems.body.items.length,
          detail: {
            bucketKey: bucketDetail.body.bucketKey,
            bucketOwner: bucketDetail.body.bucketOwner,
            bucketName: bucketName,
            policyKey: bucket.policyKey,
            permissions: bucketDetail.body.permissions,
            createdDate: bucketDetail.body.createdDate,
          },
          items: bucketItems.body.items.map((object) => {
            return {
              id: Buffer.from(object.objectId).toString("base64"),
              text: object.objectKey,
              type: "object",
              children: false,
            };
          }),
        };
      })
    );

    res.json(response);
  } catch (err) {
    next(err);
  }
};

export const getItemsBucketRoute = async (req, res, next) => {
  const bucket_name = req.query.id;
  try {
    const objects = await new ObjectsApi().getObjects(
      bucket_name,
      {},
      req.oauth_client,
      req.oauth_token
    );

    res.json(
      objects.body.items.map((object) => {
        return {
          id: Buffer.from(object.objectId).toString("base64"),
          text: object.objectKey,
          type: "object",
          children: false,
        };
      })
    );
  } catch (err) {
    next(err);
  }
};

export const postBucketRoute = async (req, res, next) => {
  const payload = new PostBucketsPayload();

  payload.bucketKey = `${clientId.toLowerCase()}-${req.body.bucketKey}`;
  payload.policyKey = req.body.policyKey;

  try {
    await new BucketsApi().createBucket(
      payload,
      {},
      req.oauth_client,
      req.oauth_token
    );

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const deleteBucketRoute = async (req, res, next) => {
  try {
    await new BucketsApi().deleteBucket(
      req.body.bucketKey,
      req.oauth_client,
      req.oauth_token
    );

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const postObjectsRoute = async (req, res, next) => {
  try {
    fs.readFile(req.file.path, async (err, data) => {
      if (err) {
        next(err);
      }

      try {
        await new ObjectsApi().uploadObject(
          req.body.bucketKey,
          req.file.originalname,
          data.length,
          data,
          {},
          req.oauth_client,
          req.oauth_token
        );

        res.status(200).end();
      } catch (error) {
        next(error);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteObjectRoute = async (req, res, next) => {
  try {
    await new ObjectsApi().deleteObject(
      req.body.bucketKey,
      req.body.objectName,
      req.oauth_client,
      req.oauth_token
    );

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
