const bitcoin = require('bitcoinjs-lib')

const getAmountFromOmniOutput = (omniOutput) => {
  const omniScriptBuffer = bitcoin.script.fromASM(omniOutput.scriptPubKey.asm)
  const omniScript = bitcoin.script.decompile(omniScriptBuffer)
  const dataHex = omniScript[1].toString('hex')
  const amountHex = dataHex.substr(dataHex.length - 8)
  const amountSatoshi = Number.parseInt(amountHex, 16)
  const amount = new Number(amountSatoshi / 10**8).toFixed(8)

  return amount
}

const getAddressFromOutput = (output) => {
  const address = output.scriptPubKey.addresses[0]

  return address
}

module.exports = {
  parse(transaction) {
    const txid = transaction.txid

    const amount = getAmountFromOmniOutput(transaction.vout[0])
    const from = getAddressFromOutput(transaction.vout[1])
    const to = getAddressFromOutput(transaction.vout[2])

    return { txid, amount, from, to }
  }
}
