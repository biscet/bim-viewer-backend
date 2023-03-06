import { AuthClientTwoLegged } from "forge-apis";

import {
  clientId,
  clientSecret,
  scopeInternal,
  scopePublic,
} from "../utils/config";

const getClient = (scopes) => {
  return new AuthClientTwoLegged(
    clientId,
    clientSecret,
    scopes || scopeInternal
  );
};

const cache = {};
const getToken = async (scopes) => {
  const key = scopes.join("+");
  if (cache[key]) {
    return cache[key];
  }
  const client = getClient(scopes);
  const credentials = await client.authenticate();
  cache[key] = credentials;
  setTimeout(() => {
    delete cache[key];
  }, credentials.expires_in * 1000);
  return credentials;
};

const getPublicToken = async () => {
  return getToken(scopePublic);
};

const getInternalToken = async () => {
  return getToken(scopeInternal);
};

export { getInternalToken, getPublicToken, getClient };
