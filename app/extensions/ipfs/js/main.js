/* global Ipfs */

chrome.protocol.registerStringProtocol('ipfs', handler)

const node = new Ipfs({
  config: {
    Addresses: {
      Swarm: []
    }
  }
})

// TODO: bring back once brave supports registerURIHandlers
// chrome.protocol.registerStringProtocol('dweb', handler)

/*
 * request is an object with:
 *   - method (e.g GET)
 *   - referrer (always empty for now)
 *   - url (full ipfs://<path>)
 * reply is a functin that takes one argument which is the response to the request
 */
function handler (request, reply) {
  if (!node.isOnline()) {
    node.once('ready', () => handler(request, reply))
  }

  const path = request.url.split('ipfs://')[1]

  // TODO check if it is valid IPFS Path
  // callback('hi there!' + test()) // eslint-disable-line

  // TODO here I need to check if it is a directory or a file:
  // if file load it
  // if directory fetch it and look for an index.html
  //   if index.html load that
  //   if no index.html, load the directory listing just like the gateway

  node.files.cat(path, (err, stream) => {
    if (err) {
      // TODO create a nice error page
      return reply('err: ' + err.message)
    }

    // TODO replace this by something like BL
    let buf = ''

    stream.on('data', (data) => {
      buf += data.toString()
    })

    stream.on('end', () => reply(buf))
  })
}
