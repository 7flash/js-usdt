const expect = require('chai').expect

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

  })
})
