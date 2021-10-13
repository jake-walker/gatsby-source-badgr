# gatsby-source-badgr

A Gatsby source plugin for [Badgr](https://badgr.com/) badges.

This plugin is great for a personal portfolio websites where you want to show off certification badges that you have earned.

## Installation

```shell
yarn add gatsby-source-badgr gatsby-plugin-image gatsby-source-filesystem
```

- `gatsby-plugin-image` is recommended for loading images efficiently
- `gatsby-source-filesystem` is needed for using badge images

## Configuration

> You should pass in your password as an environment variable to prevent accidentally committing it to source control.

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-badgr',
      options: {
        endpoint: 'https://api.eu.badgr.io',
        username: 'john.doe@example.com',
        password: process.env.BADGR_PASSWORD
      }
    }
  ]
}
```

### Endpoints

| Region               | Endpoint                 |
| -------------------- | ------------------------ |
| **🇺🇸 United States** | **https://api.badgr.io** |
| 🇪🇺 Europe            | https://api.eu.badgr.io  |
| 🇨🇦 Canada            | https://api.ca.badgr.io  |
| 🇦🇺 Australia         | https://api.au.badgr.io  |
