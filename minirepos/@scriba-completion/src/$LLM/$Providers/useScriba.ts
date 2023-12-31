import { Socket, io } from 'socket.io-client'

import { ILLMProvider } from './$Types'

/* -------------------------------------------------------------------------- */
/*                                   useScriba                                */
/* -------------------------------------------------------------------------- */

type useScriba = (i: {
  authUserJWT: string
  apiProxyEndpoint?: string
}) => ILLMProvider<Socket>

/**
 * Scriba LLM Provider
 */
export const useScriba: useScriba = i => {
  const meta = {
    '<vendor>': 'Scriba' as const,
    '<vendorCli>': _connectWsClient(i)
  }

  return {
    '<meta>': meta
  }
}

/* -------------------------------------------------------------------------- */
/*                              _connectWsClient                              */
/* -------------------------------------------------------------------------- */
/**
 * Scriba utilises a websocket client to communicate with the server.
 */
function _connectWsClient(i: Parameters<useScriba>[0]) {
  console.debug('[@scriba/obsidian] starting websocket client')

  const wsCli = io(i.apiProxyEndpoint || 'https://api.usescriba.com', {
    transports: ['websocket'],
    auth: {
      token: i.authUserJWT
    },
    extraHeaders: {
      Authorization: 'Bearer' + i.authUserJWT
    }
  })

  wsCli.on('connect_error', err => {
    console.log(`[@scriba/obsidian] ws connect_error due to ${err.message}`)
  })

  return wsCli
}
