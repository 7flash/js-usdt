const expect = require('chai').expect
const bitcoin = require('bitcoinjs-lib')

const decodedTransaction = require('./mocks/transaction')

const usdt = require('../src/index.js')

describe('js-usdt', () => {
  describe('parse transaction', () => {
    it('should fetch data from decoded transaction', () => {
      const result = usdt.parse(decodedTransaction)

      expect(result).to.be.deep.equal({
        "amount": "9.90000000",
        "to": "1DUb2YYbQA1jjaNYzVXLZ7ZioEhLXtbUru",
        "from": "1DWQ1gZ8VhL1fUCABqKbXtUZv63roGvXf",
        "txid": "5451c8e67d7ab3f947064337e8cf87c416f1fb163630913dcf307d4ca5d5ccaa",
      })
    })
  })

  describe('create transaction', () => {
    it('should return unsigned transaction', () => {
      const senderKeyPair = bitcoin.ECPair.makeRandom()
      const recipientKeyPair = bitcoin.ECPair.makeRandom()
      const recipient = recipientKeyPair.getAddress()

      const amount = '100'
      const unspents = [{
        "address":"18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX",
        "txid":"ae899e9d4a463fd4db98054d5a408a796bf3caed98185010f0807c628d948052",
        "vout":0,
        "scriptPubKey":"76a914536ffa992491508dca0354e52f32a3a7a679a53a88ac",
        "amount":12.55294976,
        "satoshis":1255294976,
        "height":544405,
        "confirmations":1
      }]

      const result = usdt.create({ keyPair: senderKeyPair, recipient, amount, unspents })

      expect(typeof result).to.be.equal('string')
    })
  })
})
