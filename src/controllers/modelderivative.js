import {
  DerivativesApi,
  JobPayload,
  JobPayloadInput,
  JobPayloadOutput,
  JobSvfOutputPayload,
} from "forge-apis";

export const postTranslate = async (req, res, next) => {
  let job = new JobPayload();

  job.input = new JobPayloadInput();
  job.input.urn = req.body.objectName;

  job.output = new JobPayloadOutput([new JobSvfOutputPayload()]);
  job.output.formats[0].type = "svf";
  job.output.formats[0].views = ["2d", "3d"];

  try {
    // (https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/DerivativesApi.md#translate).
    await new DerivativesApi().translate(
      job,
      {},
      req.oauth_client,
      req.oauth_token
    );
    console.log("START TRANSLATION");
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
