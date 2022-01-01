const buddyList = require('spotify-buddylist')

async function main () {
  const spDcCookie = 'AQDCq28m1t4LkCDpWlZhhY3bFjalJxew7hvpWMkeKsmrbi0d6hauXMTij7NYf-ONBImn4Zhz78vPJGJBw0m8BzxhtxtRlCR04XiLIQV8jqvb0w'

  const { accessToken } = await buddyList.getWebAccessToken(spDcCookie)
  const friendActivity = await buddyList.getFriendActivity(accessToken)

  console.log(JSON.stringify(friendActivity, null, 2))
}

main()

// Run every minute
// setInterval(() => main(), 1000 * 60)
