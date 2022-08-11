import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance);
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

console.log(`Creator is creating the testNFT`)

const theNFT = await stdlib.launchToken(accAlice, 'Lillian blessing', 'LB', { supply: 1 })
const nftParams = {
  nftId: theNFT.id,
  numTickets: 10
}

const OUTCOME = ['Your number is not a match', 'Your number is a match!']

await accBob.tokenAccept(nftParams.nftId)

const Shared = {
  getNum: (numTickets) => {
    const num = (Math.floor(Math.random() * numTickets) + 1)
    return num
  },
  seeOutCome: (num) => {
    console.log(`The outcome: ${OUTCOME[num]}`)
  },
}

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    ...Shared,
    startRaffle: () => {
      console.log(`The raffle information is been sent to the contract`)
      return nftParams
    },
    seeHash: (value) => {
      console.log(`Winning number Hash: ${value}`)
    }
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    // implement Bob's interact object here
    ...stdlib.hasRandom,
    ...Shared,
    showNum: (num) => {
      console.log(`Your raffle number is ${num}`)
    },
    seeWinner: (num) => {
      console.log(`The winning number is ${num}`)
    }
  }),
]);

console.log('Goodbye, Alice and Bob!');
