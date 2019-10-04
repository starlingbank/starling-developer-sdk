# Starling Javascript SDK 

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

client.getBalance()
  .then(({ data }) => console.log(data))
  .catch(err => console.log(err))
```

## Developing the SDK

Install dependencies as follows

```bash
npm install
```

The following scripts are at your disposal:

|`npm run <script>` | Description |
|------------------|-----------|
|`clean`|Removes the compiled code.|
|`build`|Compiles the application to disk (`dist/` by default).|
|`lint`|Lint all `.js` files.|
|`test`|Runs unit tests with mocha.|
|`test-verbose`|Runs unit tests with debug logging.|

### Developing the docs locally

You can develop the docs locally by running a jekyll server. Checkout the gh-pages branch and execute

```bash
bundle install
bundle exec jekyll serve
```

This depends on ruby and bundler (see [here](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll) for more info on Jekyll and Github Pages)
