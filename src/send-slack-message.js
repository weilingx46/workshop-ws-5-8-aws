'use strict'
const rp = require('minimal-request-promise')
function sendSlackMessage(news, url = process.env.SlackWebhookUrl) {
  const body = JSON.stringify({
    text: 'Following posts are trending on Hacker News:',
    attachments: news.map(item => ({
      'author_name': `${item.score} points by ${item.by}`,
      title: item.title,
      'title_link': item.url
    }))
  })
  return rp.post(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
}
module.exports = sendSlackMessage
