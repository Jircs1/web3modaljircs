import { DEFAULT_SESSION_PARAMS } from './shared/constants'
import { testMWSiwe } from './shared/fixtures/w3m-wallet-fixture'

testMWSiwe.beforeEach(async ({ modalPage, walletPage }) => {
  await modalPage.copyConnectUriToClipboard()
  await walletPage.connect()
  await walletPage.handleSessionProposal(DEFAULT_SESSION_PARAMS)
})

testMWSiwe.afterEach(async ({ modalValidator, walletValidator }) => {
  await modalValidator.expectDisconnected()
  await walletValidator.expectDisconnected()
})

testMWSiwe(
  'it should sign in with ethereum',
  async ({ modalPage, walletPage, modalValidator, walletValidator }) => {
    await modalPage.promptSiwe()
    await walletValidator.expectReceivedSign({})
    await walletPage.handleRequest({ accept: true })
    await modalValidator.expectAuthenticated()
    await modalValidator.expectConnected()
    await walletValidator.expectConnected()
    await modalPage.disconnect()
  }
)

testMWSiwe(
  'it should reject sign in with ethereum',
  async ({ modalPage, walletPage, modalValidator, walletValidator }) => {
    await modalPage.promptSiwe()
    await walletValidator.expectReceivedSign({})
    await walletPage.handleRequest({ accept: false })
    await modalValidator.expectSignatureDeclined()
    await modalPage.cancelSiwe()
    await modalValidator.expectUnauthenticated()
  }
)
