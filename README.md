# Starling Javascript SDK 
[![npm version](https://badge.fury.io/js/starling-developer-sdk.svg)](https://www.npmjs.com/package/starling-developer-sdk)
## Documentation

The documentation for our SDK can be found <a href="https://starlingbank.github.io/starling-developer-sdk/">here</a>.


## Installation

```bash
$ npm install --save starling-developer-sdk
```

## Usage

```javascript
const Starling = require('starling-developer-sdk');
// or 
import Starling from 'starling-developer-sk'
const client = new Starling({
    accessToken: '<oauth access token>'
});

client.getBalance()
    .then(({data}) =>  console.log(data))
    .catch(err => console.log(err));
```

## Developing the SDK

Install dependencies as follows

```bash
$ npm install --save
```

The following scripts are at your disposal:

|`$ npm run <script>` | Description |
|------------------|-----------|
|`clean`|Removes the compiled code.|
|`build`|Compiles the application to disk (`dist/` by default).|
|`lint`|Lint all `.js` files.|
|`test`|Runs unit tests with mocha.|
|`test-verbose`|Runs unit tests with debug logging.|

### Developing the docs locally

You can develop the docs locally by running a jekyll server. Checkout the gh-pages branch and execute

```bash
$ bundle install
$ bundle exec jekyll serve
```

This depends on ruby and bundler (see <a href="https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/"> here</a> for more info on Jekyll and Github Pages)
