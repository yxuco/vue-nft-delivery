# NFT Token Ownership Verification with Vue.js and Node.js
Example Project to demonstrate how to use Vue.js with nodejs backend


## Development Phase

Usually, the way you develop and the way you build and run in production are completely different. That's why, I would like to define two phases: The development phase and production phase.

In the development phase, we run the nodejs server and the Vue app on completely different ports. It’s easier and faster to develop that way. If you look at the following diagram the Vue app is running on port 8082 with the help of a webpack dev server and the nodejs server is running on port 3070.

```sh
# start the api nodejs on port 3070
cd api
npm install
npm run dev

# start the vue.js app on port 8082
cd nft-app
npm install
npm run serve
```

## Project Structure

Let’s understand the project structure for this project. We will have two package.json: one for the Vue and another for nodejs API. It’s always best practice to have completely different node_modules for each one. In this way, you won’t get merging issues or any other problems regarding web and server node modules collision.

If you look at the above project structure, all the vue.js app resides under the my-app folder and nodejs API resides under the api folder. If you put NodeJS API at the root folder instead of in a separate folder you might have issues with the Vue CLI picking up root node_modules.

## NodeJS API

Create API project from scratch.

```sh
mkdir api -P && cd api
npm init
```

Parameters for `npm init `:

```
package name: (api)
version: (1.0.0)
description: backend for nft-delivery
entry point: (index.js) server.js
test command: test
git repository: https://github.com/yxuco/vue-nft-delivery
keywords: nft
author: Yueming Xu
license: (ISC)
```

We use the express and nodemon on the server-side. Express is the Fast, unopinionated, minimalist web framework for NodeJS and nodemon is the library which makes your API reloads automatically whenever there is a change in the files. Let’s install these two dependencies. nodemon is only used for development so install this as a dev dependency.

```sh
npm install express --save
npm install nodemon --save-dev

# use webpack to bundle javascript, styles etc
npm install --save-dev webpack webpack-cli
```

Create entry file [server.js](./api/server.js) and [webpack.config.js](./api/webpack.config.js).  Add scripts definitions to the final Nodejs config [package.json](./api/package.json).

The `server.js` implements 2 APIs, `/api/user` and `/api/users` for adding and querying user data, and the server listens on port `3070`.

Start the nodejs API server using command `npm run dev` and the moment you change any file, it will be automatically updated. We are using `nodemon` to watch files.

Verify the API server: `curl http://localhost:3070/api/users`.

Build js production bundle using command `npm run build`.  Start the production server using command `npm run start`.

## Vue UI

Create vue app from scratch.

Install Vue CLI, and create vuejs project

```sh
npm install -g @vue/cli
vue create nft-app
```

Install packages.

```sh
# call APIs
npm install --save axios

# front-end css lib
npm install --save bootstrap bootstrap-vue-3
```

Refer docs for [bootstrap css](https://getbootstrap.com/docs/4.5/getting-started/introduction/) and [bootstrap-vue](https://bootstrap-vue.org/docs).

Now the nodejs API is running on port 3070. Now it’s time to look at the Vue UI. The entire Vue app is under the folder [nft-app](./nft-app). You can create with this command `vue create nft-app`. I am not going to put all the files here you can look at the entire files in the above Github link or [here]().

Let’s see some important files [here](./nft-app/src/services/UserService.js). Here is the service file which calls node API. This is a service file with two async functions that use fetch API to make the API calls: `getAllUsers()` and `createUser(data)`.

Here is the Dashboard component that calls this service and gets the data from the API. Once we get the data from the API we set the state accordingly and renders the appropriate components again to pass the data down the component tree. You can find other components [here](./nft-app/src/components/Dashboard.vue).

Note that ESLint default rule does not allow single-word component name, and thus you may see the following compilation error if a component is named `Header` or `header`:

```
error  Component name "Header" should always be multi-word  vue/multi-word-component-names
```

You can override the rule to allow single-word component names by adding [.eslintrc.js](./nft-app/src/components/.eslintrc.js) to the components' folder.

## Interaction between Vue UI and Node API

In the development phase, the Vue app is running on port 8082 with the help of a Vue CLI and nodejs API running on port 3070.

There should be some interaction between these two. We can proxy all the API calls to nodejs API. Vue CLI provides some inbuilt functionality and to tell the development server to proxy any unknown requests to your API server in development, we just need to add this file at the root where package.json resides and configures the appropriate API paths in [vue.config.js](./my-app/vue.config.js).

With this in place, all the calls start with /api will be redirected to http://localhost:3070 where the nodejs API running.

Once this is configured, you can run the Vue app on port 8082 and nodejs API on 3070 still make them work together.

```sh
# nodejs API (Terminal 1)
cd api (change it to API directory)
npm run dev

# Vue app (Terminal 2)
cd my-app (change it to app directory)
npm run serve
```

## How To Build Project For Production

The Vue app runs on the port 8082 with the help of a Vue CLI. This is not the case for running in production. We have to build the Vue project and load those static assets with the node server. Let’s see those step by step here.

First, we need to build the Vue project from `./my-app` with this command `npm run build` or `vue-cli-service build` and all the built assets will be put under the dist folder.

Second, we need to make some changes on the server-side. Here is the modified [server.js](./api/server.js) file.

1. We need to import path that resolves `.` and `..`, and uses the appropriate file separator for any platform
1. We have to use `express.static` at line number `30` to let express know there are a dist folder and assets of the Vue build.
1. Load [index.html]() for the default route `/` at line number `46`

Once you are done with the above changes, you can actually run the whole app with the nodejs server running on port 3070 like below as nodejs acts as a web server as well. At this time you don’t need to run Vue CLI on port 8082. Every time you change anything on the Vue side you need to build the project again to reflect the changes.

## Summary

* There are so many ways we can build Vue apps and ship for production.
* One way is to build the Vue app with NodeJS.
* In the development phase, we can run Vue UI and Nodejs on separate ports.
* The interaction between these two happens with proxying all the calls to API.
* In the production phase, you can build the Vue app and put all the assets in the build folder and load it with the node server.
* Nodejs act as a web server as well in the above case. You need to let express know where are all the Vue build assets are.
* We can package the application in a number of ways.
* You can deploy the packaged zip folder in any node environment.

## Conclusion

This is one way of building and shipping Vue apps. This is really useful when you want to do server-side rendering or you need to do some processing. NodeJS is non-blocking IO and it is very good for normal websites as well. In future posts, I will discuss more on deploying strategies for this kind of architecture.

## References

* [Node.js Express Tutorial](https://www.digitalocean.com/community/tutorials/nodejs-express-basics)
* [Setup HTTPS for Express Server](https://adamtheautomator.com/https-nodejs/)
* [Express API Reference](https://expressjs.com/en/5x/api.html)
* [Webpack Tutorial](https://dev.to/antonmelnyk/how-to-configure-webpack-from-scratch-for-a-basic-website-46a5)
* [Web3 Call Smart Contract](https://ethereum.org/en/developers/tutorials/calling-a-smart-contract-from-javascript/)
* [Web3.js API Reference](https://web3js.readthedocs.io/en/v1.7.1/web3.html#setprovider)
* [BootstrapVue Tutorial](https://blog.logrocket.com/getting-started-with-bootstrapvue-2d8bf907ef11/)
* [Bootstrap css Reference](https://getbootstrap.com/docs/5.1/utilities/api/)
* [BootstrapVue Component Reference](https://bootstrap-vue.org/docs/components)
* [Web Application with Node.js and Vue](https://levelup.gitconnected.com/vue-node-web-application-59d3376e403e)
* [Vue.js and Node.js Example](https://github.com/bbachi/vuejs-nodejs-example.git)
* [Ethers MetaMask Message Signature](https://codesandbox.io/s/react-eth-metamask-signatures-ibuxj)
* [Write mobile web3 crypto apps on iOS and Android](https://nickconfrey.medium.com/how-to-write-mobile-web3-crypto-apps-on-ios-and-android-3c0854e2110f)
