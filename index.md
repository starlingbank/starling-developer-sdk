---
layout: landing
---

{:.subtitle}
The `starling-developer-sdk` npm module is a thin JS library around Starling Bank's REST API.

{:.subtitle}
See the [main Starling Developers site](https://developer.starlingbank.com) for API documentation and more.

##### SDK Documentation

{:.subtitle}
Below you can find the link to read the documentation for each SDK version.

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
