import * as R from "ramda";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as dotenv from "dotenv";
dotenv.config();

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket-experiment-eduardo");
R.pipe(
  () =>
    new aws.s3.BucketObject("index.html", {
      bucket: bucket.id,
      source: new pulumi.asset.FileAsset("./index.html"),
    })
);

// Export the name of the bucket
export const bucketName = bucket.id;
