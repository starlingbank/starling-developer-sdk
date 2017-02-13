---
layout: landing
---

{:.centered}
starlingbank/developer-sdk-js is a thin javascript library around Starling Bank's public REST Api.

#### API Documentation

Below you can find the link to read the documentation for each of the versions
released so far, starting from version 1.0.0.

{%for entry in site.data.versions reversed %}
* [{{entry.version}}]({{site.baseurl}}/docs/{{entry.version}}/index.html)
{%endfor%}

#### Examples

* [Authorization][authorization-examples]


[authorization-examples]: {{site.baseurl}}/examples/authorization
