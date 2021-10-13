const BadgrClient = require('@geobadges/badgr-api-client');
const { createRemoteFileNode } = require('gatsby-source-filesystem');
const axios = require('axios').default;

const BADGE_NODE_TYPE = 'BadgrBadge';

exports.pluginOptionsSchema = ({ Joi }) => Joi.object({
  endpoint: Joi.string().default('https://api.badgr.io').description('The endpoint of the Badgr API'),
  username: Joi.string().required().description('Your Badgr username'),
  password: Joi.string().required().description('Your Badgr password'),
}).external(async (pluginOptions) => {
  try {
    // eslint-disable-next-line no-new
    new BadgrClient({
      endpoint: pluginOptions.endpoint,
      username: pluginOptions.username,
      password: pluginOptions.password,
    });
  } catch (err) {
    throw new Error('Badgr endpoint, username or password is incorrect');
  }
});

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, pluginOptions) => {
  const client = new BadgrClient({
    endpoint: pluginOptions.endpoint,
    username: pluginOptions.username,
    password: pluginOptions.password,
  });

  const backpack = await client.getBackpack({
    fields: ['entityId', 'image', 'badgeclassOpenBadgeId'],
  });

  await Promise.all(backpack.map(async (assertion) => {
    const badgeClass = (await axios.get(assertion.badgeclassOpenBadgeId)).data;

    if (badgeClass['@context'] !== 'https://w3id.org/openbadges/v2') {
      // eslint-disable-next-line no-console
      console.warn(`Badge Class ${assertion.badgeclassOpenBadgeId} has unexpected context ${badgeClass['@context']}`);
      return;
    }

    const badge = {
      assertionId: assertion.entityId,
      imageUrl: assertion.image,
      badgeClass: assertion.badgeclassOpenBadgeId,
      name: badgeClass.name,
      description: badgeClass.description,
      tags: badgeClass.tags,
    };

    actions.createNode({
      ...badge,
      id: createNodeId(`${BADGE_NODE_TYPE}-${badge.assertionId}`),
      parent: null,
      children: [],
      internal: {
        type: BADGE_NODE_TYPE,
        content: JSON.stringify(badge),
        contentDigest: createContentDigest(badge),
      },
    });
  }));
};

exports.onCreateNode = async ({
  node, actions: { createNode }, createNodeId, getCache,
}) => {
  if (node.internal.type === BADGE_NODE_TYPE) {
    const fileNode = await createRemoteFileNode({
      url: node.imageUrl,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      getCache,
    });

    if (fileNode) {
      // eslint-disable-next-line no-param-reassign
      node.remoteImage___NODE = fileNode.id;
    }
  }
};
