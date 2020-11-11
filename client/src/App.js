import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './tailwind.output.css';

const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'SHOP', 'PFE'];
const INITIAL_DATA = TICKERS.reduce((o, key, i) => Object.assign(o, {[i]: {ticker: key, price: [0]}}), {});

const App = () => {
  // state keeping track of ticker data
  const [stocks, setStocks] = useState(INITIAL_DATA);

  const [showHistory, setShowHistory] = useState(false);

  const fetch_prices = () => {
    axios.get(`/api/portfolio`)
      .then(res => {
        let new_stocks = {};
        Object.keys(res.data).forEach((id) => {
          new_stocks[id] = {ticker: stocks[id].ticker, price: [...stocks[id].price, res.data[id].price]}
        })
        setStocks(new_stocks);
      });
  };

  // fetch data from Node server every second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch_prices();
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col min-h-screen justify-between bg-black">
      <header className="flex relative h-20 justify-center items-center text-teal-400">
        <a href="/" className="font-bold text-3xl text-header">
          Robinhook
        </a>
      </header>

      <div className="container mx-auto w-2/5 h-72 text-white">
        <div className="grid grid-cols-3 gap-4 border-2 rounded-lg h-full py-4">
          {Object.keys(stocks).map((id) => (
            <>
              <div className="flex justify-center font-bold">
                <p>{stocks[id].ticker}</p>
              </div>
              <div className="flex justify-center">
                <p>{stocks[id].price[stocks[id].price.length - 1]}</p>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-teal-400 hover:bg-teal-700 border py-1 px-2 rounded-lg"
                  type="button"
                  onClick={() => setShowHistory(id)}
                >
                  Price History
                </button>
              </div>
            </>
          ))}
        </div>
      </div>

      <div className="container mx-auto w-2/5 h-64 text-white overflow-hidden overflow-y-scroll text-center border-2 rounded-lg">
        {showHistory
          ? (
            <>
              <h1 className="text-2xl font-bold pb-5">Price History ({stocks[showHistory].ticker})</h1>
              {stocks[showHistory].price.map((price, i) => (
                <p>{price}</p>
              ))}
            </>
          ) : (
            <h1 className="text-2xl font-bold pb-5">Price History</h1>
          )}
      </div>

      <footer className="flex flex-col relative h-20 justify-center items-center text-white">
        <p>
          Connected to <a className="underline" href="http://localhost:5000/api">Node Server</a> and <a className="underline" href="http://localhost:8000/api">SimDAQ API</a>
        </p>
        <p>---John Kim---</p>
      </footer>
    </div>
  );
}

export default App;
