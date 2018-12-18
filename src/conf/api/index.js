const user = require('./user');
const appDefault = require('./appDefault');
const ucApi = require('./ucApi');
const wpApi = require('./wpApi');
const api = {};

Object.assign(
    api,
    user,
    wpApi,
    ucApi,
    appDefault
);
module.exports = api;
