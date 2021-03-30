# Perfecty Push JS SDK

[![tests](https://github.com/rwngallego/perfecty-push-js-sdk/workflows/Tests/badge.svg)](https://github.com/rwngallego/perfecty-push-js-sdk/actions?query=workflow%3ATests)
[![deployment](https://github.com/rwngallego/perfecty-push-js-sdk/workflows/Deployment/badge.svg)](https://github.com/rwngallego/perfecty-push-js-sdk/actions?query=workflow%3ADeployment)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Javascript SDK for [Perfecty Push](https://github.com/rwngallego/perfecty-push), a self-hosted Push Notifications server written in Go.

You can use this client library to include Push Notifications in your website for free.
WordPress is also supported. More information on the main project:

- [https://github.com/rwngallego/perfecty-push](https://github.com/rwngallego/perfecty-push)

**NOTICE: This project is under active development and no API is stable yet.**

![Perfecty Push for Wordpress](.github/assets/logo-white.png)

## Local Setup 👨🏻‍💻

This project uses:

- Babel with @babel/preset-env
- Jest for unit testing
- Browserlistrc to specify dynamic Browser compatibility
- ESLint using the Standard style
- Webpack 5

To run the development server:

```sh
npm install
npm start
```

To run the build with watch in WordPress:

```shell
npm run watch
```

To generate the minified SDK in `dist/`:

```sh
npm build
```

## Unit tests 🧪

Run all the tests using jest:

```sh
npm test
```

## License 💡

This project is licensed under [MIT](LICENSE).

## Collaborators 🔥

[<img alt="rwngallego" src="https://avatars3.githubusercontent.com/u/691521?s=460&u=ceab22655f55101b66f8e79ed08007e2f8034f34&v=4" width="117">](https://github.com/rwngallego) |
:---: |
[Rowinson Gallego](https://www.linkedin.com/in/rwngallego/) |

## Special Thanks

[<img alt="Jetbrains" src="https://github.com/rwngallego/perfecty-push-wp/raw/master/.github/assets/jetbrains-logo.svg" width="120">](https://www.jetbrains.com/?from=PerfectyPush)

Thanks to Jetbrains for supporting this Open Source project with their magnificent tools.
