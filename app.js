const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');
const mongoose = require('mongoose');


const productRoutes = require("./api/routes/products")
const orderRoutes = require("./api/routes/orders")
const userRoutes = require("./api/routes/users")

//database connection options
mongoose.connect("mongodb://localhost:27017/apiconnection", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,PATCH,GET');
        return res.status(200).json({});
    }
    next();
});


app.use(morgan('dev')); ///for extra log Server listening GET /orders/122 200 172.467 ms - 43
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;