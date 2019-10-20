# Contributing to the Starling Bank Developer SDK

First off, thanks for taking the time to contribute! 👍

The following is a set of guidelines for contributors. These are not rules, so (as with everything in this repo) feel free to propose changes to this document in a pull request. 📝

If you just want to ask us a question, it's easiest to do on the [Starling Developer Slack](https://developer.starlingbank.com/community) than by opening an issue.

## Getting started guide

> If you're not used to using Git, we recommend reading the free [Pro Git book](https://git-scm.com/book/en/v2).
>
> If you're not used to using GitHub, we recommend learning from the [First Contributions guide](https://github.com/firstcontributions/first-contributions/blob/master/README.md).

We follow the standard [Github flow](https://guides.github.com/introduction/flow/), with public contributors forking the repository and creating a branch there.

### First time setup

1. Fork and clone the repo
2. Checkout the `master` branch
3. Run `npm install`

### For each contribution

1. Find an [issue](https://github.com/starlingbank/starling-developer-js-sdk/issues) for what your contribution will fix, or create one if one does not already exist. Either assign yourself to the issue or comment that you are working on it.
2. Create a descriptively named branch
3. Make your changes, including writing tests. If you get stuck have a look through the existing code for examples, or ask questions on the [Starling Developer Slack](https://developer.starlingbank.com/community).
4. Ensure tests pass with `npm test`
5. Ensure your code doesn't have lint issues with `npm run lint` (if it does, you can use `npm run lint:fix` to fix most issues)
6. Push your changes to your fork, and create a [pull request](https://github.com/starlingbank/starling-developer-js-sdk/pulls).
7. Wait for your code to get reviewed, and merge it once reviewed.

## Issues

- Comment on issues which you are working on. This prevents people working on the same thing and makes it clearer what work is being done where.
- Split big issues into subissues (e.g. rather than have one issue to update the entire SDK to the new API, you could split it to an issue per endpoint group)
- If you stop working on an issue, please let others know so they can pick it up. If you managed to get somewhere do share the progress you've made so others have a head start.

## Pull requests

- Try to make your changesets as small as possible - this will help your code get reviewed quickly and reduce the chance of have to deal with merge conflicts.
- Reference the issue the pull request works towards fixing/fixes (if applicable). Most pull requests should be attached to an issue - tiny things probably don't need to be though (e.g. fixing typos). Use your own judgement.
- Try to create a [perfect pull request](https://opensource.com/article/18/6/anatomy-perfect-pull-request)

## Commit messages

- Follow [The 7 Rules](https://chris.beams.io/posts/git-commit/#seven-rules)
- Feel free to spice them up with some [Gitmoji](https://gitmoji.carloscuesta.me/)

## NPM scripts

The following scripts are at your disposal:

| `npm run <script>` | Description                                         |
|--------------------|-----------------------------------------------------|
| `install`          | Install dependencies                                |
| `clean`            | Remove compiled code                                |
| `build`            | Compile the application to disk (`dist` by default) |
| `lint`             | Find lint issues                                    |
| `lint:fix`         | Fix most lint issues                                |
| `test`             | Run unit tests                                      |
| `test:dev`         | Run unit tests on save (watch mode)                 |
| `test:verbose`     | Run unit tests with debug logging                   |

## Developing the docs locally

The docs' content is based off the jsdoc annotations on the code itself - this is where content updates should be made.

For other doc changes, you can develop the docs locally by running a jekyll server. Checkout the `gh-pages` branch and execute

```bash
bundle install
bundle exec jekyll serve
```

This depends on ruby and bundler (see [here](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll) for more info on Jekyll and Github Pages)

## Releases

1. Checkout the `master` branch
2. Run `./release.sh <patch | minor | major>` (following the [Semantic Versioning spec](http://semver.org))
