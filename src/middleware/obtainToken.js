import { getInternalToken, getClient } from "../common/oauth";

export default async (req, res, next) => {
  const token = await getInternalToken();
  req.oauth_token = token;
  req.oauth_client = getClient();
  next();
};
