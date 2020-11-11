// SimDAQ API

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;
var router = express.Router();

let sample_data = {
  0: {
    ticker: 'AAPL',
    price: 116.88,
  },
  1: {
    ticker: 'NVDA',
    price: 513.60,
  },
  2: {
    ticker: 'TSLA',
    price: 409.22,
  },
  3: {
    ticker: 'SHOP',
    price: 885.25,
  },
  4: {
    ticker: 'PFE',
    price: 38.75,
  },
};

// updates ticker prices to random value within 5% of the previous value
const update_prices = () => {
  Object.keys(sample_data).forEach(id => {
    const max = sample_data[id].price * (1 + 0.05);
    const min = sample_data[id].price * (1 - 0.05);
    const new_price = (Math.random() * (max - min) + min);
    sample_data[id].price = new_price >= 0 ? Math.round(new_price * 1e2) / 1e2 : 0;
  });
}

// base/testing endpoint
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the SimDAQ aAPI. Try the /api/:ticker endpoint to retrieve ticker prices' });   
});

// all ticker prices in portfolio endpoint - updates prices upon client requests
router.get('/portfolio',  (req, res) => {
  update_prices();
  return res.send(sample_data);
});

// individual ticker prices endpoint - updates prices upon client requests
router.get('/:ticker',  (req, res) => {
  update_prices();
  return res.send(sample_data.find((stock, i) => stock.ticker === req.params.ticker));
});

app.use('/api', router);
app.listen(port, () => console.log(`Listening on port ${port}`));