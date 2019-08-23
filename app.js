const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

// for parsing application/json
app.use(express.json());  

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) 
app.use(cors());

//Set up default mongoose connection
var url = 'mongodb://127.0.0.1:27017/shopping';
mongoose.connect(url, {useNewUrlParser: true});
/////////////////////// Define schema /////////////////////////////
const productSchema = new mongoose.Schema(
{
    name: String,  
    isActive: Boolean,  
    categoryId: Number, 
}, 
{ collection: 'products' })
.set('toJSON',{
    virtuals: true, 
    versionKey:false, 
    transform: function (doc, ret){delete ret._id}
});
/////////////// Compile model from schema //////////////////////////
let Product = mongoose.model('Product', productSchema);
////////////////////////////////////////////////////////////////////

app.get('/api/products/:id', function(req, res){
    Product.findById(req.params.id, (err, product) => {
        if (!product) {
            return res.status(404).send("Not Found");
        }    
        return res.status(200).json(product); // 200 Ok
    });
});

app.get('/api/products', (req, res) => {
    Product.find({}, (err, products) => {  
        if(products.length == 0) {
            return res.status(404).send("Not Found"); 
        }
        return res.status(200).json(products); // Ok
    });
}); 

app.post('/api/products',function(req, res)  { 
    const product = new Product( req.body );
    if(!product.name) {
        return res.status(400).json("Bad Request");
    }
    product.save(function(err,product){
        return res.status(201).json(product); 
    }); 
});

app.delete('/api/products/:id', function(req, res) {
    Product.findByIdAndRemove(req.params.id,function(err, product){
        if (!product) {
            return res.status(404).json("Not Found") ;  
        }
        return res.sendStatus(204); // No Content
    });
});

app.put('/api/products/:id', function(req, res){
    if(Object.keys(req.body).length === 0) {
        return res.status(400).json("Bad Request");
    }
    Product.findByIdAndUpdate(req.params.id, req.body, {new: true},function(err,product) {  
        if (!product) {
            return res.status(404).send("Not Found");
        }
        return res.sendStatus(204);  // No Content
    });
});

app.listen(3000,()=> console.log('Server started on port 3000'));
