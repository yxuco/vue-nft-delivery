const express = require('express');
// const serveIndex = require('serve-index');
const ethers = require('ethers');
const Web3 = require('web3');
const path = require('path');
const config = require('./config.json');
const erc721 = require('./erc721.json');
// console.log(erc721);

// create express server
const app = express();

const port = config.port;
console.log('NFT list: ', JSON.stringify(config.contracts));

const web3 = new Web3(new Web3.providers.HttpProvider(config.infura));

// needed to work with post of JSON object
app.use(express.json());

// display static content list in public folder
app.use(express.static('nft-app'));
app.use('/public', express.static('public'));
// app.use('/public', serveIndex('public'));

// sample midware logs time for api calls
app.use('/api', (req, res, next) => {
  console.log('Public content request time: ', Date.now());
  next();
});

// API implementation
app.get('/api/contracts', (req, res) => {
  res.json(config.contracts);
});

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );

async function getOwner(contract, tokenId) {
  const nftToken = new web3.eth.Contract(erc721, contract);
  res = await promisify(cb => nftToken.methods.ownerOf(tokenId).call(cb));
  console.log("token owner: ", res);
  return res;
};

app.post('/api/verify', (req, res) => {
  const msg = req.body;
  console.log("verify message: ", msg);
  try {
    const message = msg.contract + "-" + msg.tokenId;
    const signerAddr = ethers.utils.verifyMessage(message, msg.signature);
    console.log("signer address: ", signerAddr);
    getOwner(msg.contract, msg.tokenId).then( owner => {
      res.json({ signer: msg.signer, verified: signerAddr, owner: owner });
    }).catch(err => {
//      console.log(err.message);
      res.json({ error: err.message });
    });
  } catch (err) {
//    console.log(err);
    res.json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'nft-app/index.html'));
});

// start server
app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});