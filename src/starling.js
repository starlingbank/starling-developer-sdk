import Account from './entities/account'
import AccountHolder from './entities/accountHolder'
import Address from './entities/address'
import FeedItem from './entities/feedItem'
import Card from './entities/card'
import OAuth from './entities/oauth'
import Payee from './entities/payee'
import Payment from './entities/payment'
import Mandate from './entities/mandate'
import SavingsGoal from './entities/savingsGoal'
import Identity from './entities/identity'

/**
 * Facade to dispatch operations to services
 */
class Starling {
  /**
   * Create an instance of the starling client
   * @param {Object=} options - configuration parameters
   */
  constructor (options) {
    const defaults = {
      apiUrl: 'https://api.starlingbank.com',
      oauthUrl: 'https://oauth.starlingbank.com',
      clientId: '',
      clientSecret: ''
    }

    this.config = Object.assign({}, defaults, options)

    this.identity = new Identity(this.config)
    this.accountHolder = new AccountHolder(this.config)
    this.account = new Account(this.config)
    this.address = new Address(this.config)
    this.feedItem = new FeedItem(this.config)
    this.payment = new Payment(this.config)
    this.mandate = new Mandate(this.config)
    this.payee = new Payee(this.config)
    this.card = new Card(this.config)
    this.savingsGoal = new SavingsGoal(this.config)
    this.oAuth = new OAuth(this.config)
  }
}

module.exports = Starling
