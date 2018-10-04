const bitcoin = require('bitcoinjs-lib')

const toPaddedHexString = (num, len) => {
  const str = num.toString(16)
  return "0".repeat(len - str.length) + str
}

const createOmniOutput = (amount) => {
  const simpleSend = [
    "6f6d6e69",
    "0000",
    "00000000001f",
    toPaddedHexString(amount * 100000000, 16),
  ].join('')

  const data = Buffer.from(simpleSend, "hex")

  const omniOutput = bitcoin.script.compile([
    bitcoin.opcodes.OP_RETURN,
    data
  ])

  return omniOutput
}

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
  },

  create({ keyPair, recipient, amount, unspents }) {
    const tx = new bitcoin.TransactionBuilder()

    const sender = keyPair.getAddress()

    const fundValue = 546
    const feeValue = 5000
    const totalUnspent = unspents.reduce((sum, { satoshis }) => sum + satoshis, 0)
    const skipValue = totalUnspent - fundValue - feeValue

    unspents.forEach(({ txid, vout }) => tx.addInput(txid, vout))

    const omniOutput = createOmniOutput(amount)

    tx.addOutput(recipient, fundValue)
    tx.addOutput(omniOutput, 0)
    tx.addOutput(sender, skipValue)

    tx.inputs.forEach((input, index) => {
      tx.sign(index, keyPair)
    })

    return tx.buildIncomplete().toHex()
  }
}
