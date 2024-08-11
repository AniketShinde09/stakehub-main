const express = require('express');
const bodyParser = require('body-parser');
const connectDB=require('./config/db');
const { PendingOrder, CompletedOrder } = require('./models/model');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// ================ Connect DB =============
connectDB();



app.post('/api/orders', async (req, res) => {
  const { buyer_qty, buyer_price, seller_price, seller_qty } = req.body;
  try {
    const newOrder = new PendingOrder({ buyer_qty, buyer_price, seller_price, seller_qty });
    
    const data=await matchOrders(buyer_price);
    if(data){
      await newOrder.save();
    }
    console.log(data);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const matchOrders = async (buyer_price) => {
  const pendingOrders = await PendingOrder.find({}).exec();
  for (const order of pendingOrders) {
    if (buyer_price >= order.seller_price) {
      const qtyToMatch = Math.min(order.buyer_qty, order.seller_qty);
      const price = order.seller_price;

      await CompletedOrder.updateOne(
        { price },
        { $inc: { qty: qtyToMatch } },
        { upsert: true }
      );

      await PendingOrder.findByIdAndDelete(order._id);
      return false;
    }
  }
  return true;
};


app.get('/api/orders/:type', async (req, res) => {
  const type = req.params.type; 
  try {
    const model = type === 'completed' ? CompletedOrder : PendingOrder;
    const orders = await model.find({}).exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
