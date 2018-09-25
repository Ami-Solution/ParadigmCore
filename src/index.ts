import { ABCI_PORT } from "./config";

/*
  =========================
  Blind Star - codename (developent)
  index.ts @ {server}
  =========================
  @date_inital 12 September 2018
  @date_modified 24 September 2018
  @author Henry Harder

  Main ABCI application supporting the OrderStream network. 
*/


let _pjs = require("paradigm.js");
let _enc = require("./PayloadCipher").PayloadCipher

let abci = require('abci');
let startAPI = require("./server").startAPIserver;
let port = require('./config').ABCI_PORT;
let version = require('./config').VERSION;
let Vote = require('./Vote').Vote;


let paradigm = new _pjs(); // new paradigm instance
let Order = paradigm.Order; 

let cipher = new _enc({ // new Payload
  inputEncoding: 'utf8',
  outputEncoding: 'base64'
});

let state = { // eventually will represent address => limit
  number: 0
}

let handlers = {
  info (_) {
    return {
      data: 'Stake Verification App',
      version: version,
      lastBlockHeight: 0,
      lastBlockAppHash: Buffer.alloc(0)
    }
  },

  checkTx (request) {
    let txObject;
    
    try {
      txObject = cipher.ABCIdecode(request.tx);
    } catch (error) {
      // console.log(error)
      console.log("Bad order at "+Date()+".")
      return Vote.invalid('Bad order - error decompressing TX.');
    }

    try {      
      let newOrder = new Order(txObject);
      let recoveredAddr = newOrder.recoverPoster();
      if (typeof(recoveredAddr) === "string"){ 
        /*
          The above conditional shoud rely on a verifyStake(), that checks
          the existing state for that address. 
        */        
        return Vote.valid(`Success: stake of '${recoveredAddr}' verified.`);
      } else {
        return Vote.invalid('Bad order maker - no stake.');
      }
    } catch (error) {
      // console.log(error);
      console.log("Bad order at "+Date()+".")
      return Vote.invalid('Bad order format.');
    }
  },

  deliverTx (request) {
    let txObject;
    
    try {
      txObject = cipher.ABCIdecode(request.tx);
    } catch (error) {
      // console.log(error)
      console.log("Bad order at "+Date()+".")
      return Vote.invalid('Bad order - error decompressing TX.');
    }

    try {      
      let newOrder = new Order(txObject);
      let recoveredAddr = newOrder.recoverPoster();
      if (typeof(recoveredAddr) === "string"){ 
        /*
          The above conditional shoud rely on a verifyStake(), that checks
          the existing state for that address. 
       */
        return Vote.valid(`Success: stake of '${recoveredAddr}' verified.`);
      } else {
        return Vote.invalid('Bad order maker - no stake.');
      }
    } catch (error) {
      // console.log(error);
      console.log("Bad order at "+Date()+".")
      return Vote.invalid('Bad order format.');
    }
  }
}

abci(handlers).listen(port, () => {
  console.log(`[PC - ABCI Server @${version}: ${new Date().toLocaleString()}] ABCI server started on port ${port}.`);
  startAPI();
});