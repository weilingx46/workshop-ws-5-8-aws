'use strict'
const getTopHackerNewsStories = require('./src/get-top-hackernews-stories')
const sendSlackMessage = require('./src/send-slack-message')
function scheduledSlackMessage(event, context, callback) {
  getTopHackerNewsStories()
    .then(stories => sendSlackMessage(stories))
    .then(() => callback(null))
    .catch(callback)
}
exports.handler = scheduledSlackMessage
