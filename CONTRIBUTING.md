# Contributing to the Starling Bank Developer SDK

First off, thanks for taking the time to contribute! 👍

The following is a set of guidelines for contributors. These are not rules, so feel free to propose changes to this document in a pull request. 📝

## Developing the SDK

Install dependencies with `npm install`

The following scripts are at your disposal:

| `npm run <script>` | Description                                         |
|--------------------|-----------------------------------------------------|
| `clean`            | Remove compiled code                                |
| `build`            | Compile the application to disk (`dist` by default) |
| `lint`             | Find lint issues                                    |
| `lint:fix`         | Fix most lint issues                                |
| `test`             | Run unit tests                                      |
| `test:dev`         | Run unit tests on save (watch mode)                 |
| `test:verbose`     | Run unit tests with debug logging                   |

In developing it, you'll likely want to check out the [Starling Bank API docs](https://developer.starlingbank.com/docs).

### Developing the docs locally

You can develop the docs locally by running a jekyll server. Checkout the `gh-pages` branch and execute

```bash
bundle install
bundle exec jekyll serve
```

This depends on ruby and bundler (see [here](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll) for more info on Jekyll and Github Pages)

## Commit messages

- Follow [The 7 Rules](https://chris.beams.io/posts/git-commit/#seven-rules)
- Feel free to spice them up with some [Gitmoji](https://gitmoji.carloscuesta.me/)

## Pull requests

- Try to create a [perfect pull request](https://opensource.com/article/18/6/anatomy-perfect-pull-request)
