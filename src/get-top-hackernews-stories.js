'use strict'
const rp = require('minimal-request-promise')
function getTopNews() {
  return rp.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
    'Content-Type': 'application/json'
  })
    .then(response => {
      const storyIds = JSON.parse(response.body)
      return Promise.all(
        storyIds.slice(0, 5)
          .map(id => {
            return rp.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
              'Content-Type': 'application/json'
            })
              .then(response => JSON.parse(response.body))
          })
      )
    })
}
module.exports = getTopNews
