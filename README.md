# Starling Javascript SDK 

[![JavaScript Standard Style](https://img.shields.io/badge/code_style-standard-informational.svg)](https://standardjs.com)
[![NPM Package Version](https://img.shields.io/npm/v/starling-developer-sdk?color=informational)](https://www.npmjs.com/package/starling-developer-sdk)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/starling-developer-sdk?label=size)](https://bundlephobia.com/result?p=starling-developer-sdk@latest)

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
  accessToken: '<oauth access token>'
})

client.getAccounts()
  .then(({ data }) => console.log(data))
  .catch(err => console.log(err))
```
