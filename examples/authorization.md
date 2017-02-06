---
layout: default
---

## Authorization and making requests

The library currently supports OAuth authentication that the Starling Bank API provides.

### Usage

After obtaining an OAuth access token the token must be provided in each call.
This allows the same client instance to be used for multiple customers.

```javascript
const Starling = require('starling-developer-sdk');

const client = new Starling();

client
    .getBalance('<oauth bearer token>')
    .then(({data}) => {
      // ...
    });
```
This method will take precedence over passing the token into the constructor as in the 'Personal usage' example.

### Personal usage

If you are using a personal access token, pass the token into the constructor of the client.
All subsequent requests will then use this token.

```javascript
const Starling = require('starling-developer-sdk');

const client = new Starling({accessToken: '<personal access token>'});

client
    .getBalance()
    .then(({data}) => {
      // ...
    });
```