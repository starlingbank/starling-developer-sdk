---
layout: landing
---

{:.subtitle}
The `starling-developer-sdk` npm module is a thin JS library around Starling Bank's REST API.

##### API Documentation

{:.subtitle}
Below you can find the link to read the documentation for each of the versions
released so far, starting from version 0.0.1.

{:.subtitle}
{%for entry in site.data.versions reversed %}
* [{{entry.version}}]({{site.baseurl}}/docs/{{entry.version}}/index.html)
{%endfor%}

{:.h5}
##### Examples

{:.subtitle}
* [Authorization][authorization-examples]

{:.subtitle}
[authorization-examples]: {{site.baseurl}}/examples/authorization


{:.subtitle}
If you haven't already, be sure to check out our [Web](https://github.com/starlingbank/developer-api-web-starter) and [Mobile](https://github.com/starlingbank/developer-api-web-starter) Starter Kits for developing with our API.

{:.subtitle}
Also if you're stuck, our [Getting Started](https://developer.starlingbank.com/get-started) guide may be of use.
