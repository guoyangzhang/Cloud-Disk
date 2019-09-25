const user = require('./user');
const appDefault = require('./appDefault');
const ucApi = require('./ucApi');
const wpApi = require('./wpApi');
const tree = require('./tree');

const api = {};

Object.assign(
    api,
    user,
    wpApi,
    ucApi,
    appDefault,
    tree
);
module.exports = api;
