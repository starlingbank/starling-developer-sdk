# Starling Javascript SDK 

[![Project Status: Unsupported – The project has reached a stable, usable state but the author(s) have ceased all work on it. A new maintainer may be desired.](https://www.repostatus.org/badges/latest/unsupported.svg)](https://www.repostatus.org/#unsupported) [![JavaScript Standard Style](https://img.shields.io/badge/code_style-standard-informational.svg)](https://standardjs.com)
[![NPM Package Version](https://img.shields.io/npm/v/starling-developer-sdk?color=informational)](https://www.npmjs.com/package/starling-developer-sdk)

## Documentation

The documentation for our SDK can be found [here](https://starlingbank.github.io/starling-developer-sdk/).

## Installation

```bash
npm install starling-developer-sdk
```

## Usage

```javascript
const Starling = require('starling-developer-sdk')
// or
import Starling from 'starling-developer-sdk'

const client = new Starling({
  // apiUrl: 'https://api-sandbox.starlingbank.com',
  accessToken: '<oauth access token>'
})

client.account.getAccounts()
  .then(({ data }) => console.log(data))
  .catch(err => console.log(err))
```
