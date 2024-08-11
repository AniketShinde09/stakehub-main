import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './App.css'



const App = () => {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);

  const [form, setForm] = useState({
    buyer_qty: '',
    buyer_price: '',
    seller_price: '',
    seller_qty: ''
  });


  useEffect(() => {
    fetchOrders('pending');
    fetchOrders('completed');
  }, []);

  const fetchOrders = async (type) => {
    const res = await fetch(`https://stakehub-j1rz.onrender.com/api/orders/${type}`);
    const data = await res.json();
    //console.log(data);
    if (type === "pending")
      setPending(data);
    else
      setCompleted(data);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(form);
    await axios.post('https://stakehub-j1rz.onrender.com/api/orders', form);
    fetchOrders('pending');
    fetchOrders('completed');

  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1 className='heading'>Order Management System</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" name="buyer_qty" value={form.buyer_qty} onChange={handleChange} placeholder="Buyer Quantity" className='input' />
        <input type="number" name="buyer_price" value={form.buyer_price} onChange={handleChange} placeholder="Buyer Price" className='input' />
        <input type="number" name="seller_price" value={form.seller_price} onChange={handleChange} placeholder="Seller Price" className='input' />
        <input type="number" name="seller_qty" value={form.seller_qty} onChange={handleChange} placeholder="Seller Quantity" className='input' />
        <button type="submit" className='button'>Submit Order</button>
      </form>
      <h2 className='heading1'>Pending Orders</h2>
      {pending.length != 0 &&
        <ul>
          {pending.map(order => (
            <li key={order._id} className='item'>
              <span className=''>{`Buyer Qty: ${order.buyer_qty}`}</span>
              <span className=''>{`Buyer Price: ${order.buyer_price}`}</span>
              <span className=''>{`Seller Price: ${order.seller_price}`}</span>
              <span className=''>{`Seller Qty: ${order.seller_qty}`}</span></li>
          ))}
        </ul>
      }
      <h2 className='heading1'>Completed Orders</h2>
      {completed.length != 0 &&
        <ul>
          {completed.map(order => (
            <li key={order._id} className='item'>
              <span className=''>{`Price: ${order.price}`}</span>
              <span className=''>{`Qty: ${order.qty}`}</span>
            </li>
          ))}
        </ul>
      }
      <h2 className='heading1'>Price Chart</h2>
      <div className='price-chart'>
        <LineChart width={400} height={400} data={completed} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="qty" />
          <YAxis dataKey="price" />
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
        </LineChart>
      </div>
    </div>
  );
};

export default App;
