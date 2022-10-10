import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express();
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));


const port = process.env.PORT || 5000
const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    code: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model('Products', productSchema);



app.post("/product", async (req, res) => {

    console.log("product received: ", req.body);

    let newProduct = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        code: req.body.code,
    })
    try {
        let response = await newProduct.save()
        console.log("product added: ", response);

        res.send({
            message: "product added",
            data: response
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to add product"
        });
    }
})


app.get("/products", async (req, res) => {
    try {
        let products = await productModel.find({}).exec();
        console.log("all product : ", products);

        res.send({
            message: "all products",
            data: products
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

app.get("/product/:id", async (req, res) => {
    try {
        let product = await productModel
            .findOne({ _id: req.params.id })
            .exec();
        console.log("product : ", product);

        res.send({
            message: "product",
            data: product
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

app.put("/product/:id", async (req, res) => {

    console.log("data to be edited: ", req.body);

    let update = {}
    if (req.body.name) update.name = req.body.name
    if (req.body.description) update.description = req.body.description
    if (req.body.price) update.price = req.body.price
    if (req.body.code) update.code = req.body.code

    try {
        let updated = await productModel
            .findOneAndUpdate({ _id: req.params.id }, update, { new: true })
            .exec();

        console.log("updated product: ", updated);

        res.send({
            message: "product updated successfully",
            data: updated
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to update product"
        });
    }
})
app.delete("/product/:id", async (req, res) => {

    console.log("product received: ", req.body);

    try {
        let deleted = await productModel.deleteOne({ _id: req.params.id })
        console.log("product deleted: ", deleted);

        res.send({
            message: "product deleted",
            data: deleted
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to delete product"
        });
    }
})






app.use((req, res) => {
    res.status(404).send("404 not found");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
////////////////mongodb connected disconnected events///////////////////////////////////////////////
let dbURI = 'mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/socialmrdiaBase?retryWrites=true&w=majority';
   mongoose.connect(dbURI);

mongoose.connection.on('connected', function () { //connected
    console.log("mongoose connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});


process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

//////////////////////////////////////