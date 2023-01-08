import { type Connection } from 'mongoose';
import {
  getAllTokensFromProject,
  updateOneTokenRootUrls,
} from './db/queries/tokenQueries';

const projectSlugs = {
  local: 'chainlife-testnet',
  prod: 'chainlife',
};

const rootUrls = {
  local: 'http://localhost:7071',
  prod: 'https://api.gengames.io',
  new: 'https://api.substratum.art',
};

export const updateTokenUrls = async (
  conn: Connection,
  env: 'local' | 'prod',
) => {
  const projectSlug = projectSlugs[env];
  const rootUrl = rootUrls[env];
  const newRootUrl = rootUrls.new;

  const tokens = await getAllTokensFromProject(projectSlug, conn);

  const updatedTokens = await Promise.all(
    tokens.map(async (token) => {
      const { generator_url, token_id } = token;

      const updatedGeneratorUrl = generator_url.replace(rootUrl, newRootUrl);

      const updatedToken = await updateOneTokenRootUrls(
        conn,
        projectSlug,
        token_id,
        updatedGeneratorUrl,
      );

      return updatedToken;
    }),
  );

  const tokensAfterUpdate = await getAllTokensFromProject(projectSlug, conn);

  // iterate through updated tokens and make sure that generator_url and animation_url have the new root url
  tokensAfterUpdate.forEach((token) => {
    const { generator_url, animation_url } = token;

    if (!generator_url.includes(newRootUrl))
      throw new Error(
        `Token ${token.token_id} does not have the new root url in generator_url`,
      );

    if (!animation_url.includes(newRootUrl))
      throw new Error(
        `Token ${token.token_id} does not have the new root url in animation_url`,
      );
  });

  return updatedTokens.length;
};
