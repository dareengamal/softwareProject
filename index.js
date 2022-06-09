import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

const postSchema=mongoose.Schema({
    shippment_status:String,
    order_id:Number,
    address:String,
    order_status:String
});
const shippment = mongoose.model('shippment',postSchema);

const app = express();

app.use(bodyParser.json({limit : "30mb", extended : true }));
app.use(bodyParser.urlencoded({limit : "30mb", extended : true }));
app.use(cors());


app.get('/shippment', async (req, res) => {
    const shippment = await shippment.findOneAndUpdate({ order_Id: req.params.order_id });
    res.status(200).send({ body: shippment, message: 'Successfully retrieved shippment' });
});

app.post('/shippment', async (req, res) => {
    try {
        console.log('[createshippment body]', req.body)
        const { order_id } = req.body;
        if (!order_id) return res.status(403).send('order_id is required');

        const shippment = await shippment.findOne({ order_id: order_id });
        if (!shippment) return res.status(403).send('Document already exists, cannot create');

        const shippmentStatus = 'CREATED';

        const newshippmentDocument = await shippment.create({ order_id: order_id,shippment_status: shippmentStatus });
        return res.status(200).send({ body: newshippmentDocument, message: 'Successfully created shippment' });
    }
    catch (e) {
        console.log('[createshippment] e', e)
    }
});
/*app.delete('/shippment', async (req, res) => {
    try {
        console.log('[deleteshippment body]', req.body)
        const { order_id } = req.body;
        if (!order_id) return res.status(403).send('order_id is required');

        const shippment = await shippment.findOne({ order_id: order_id });
        if (shippment) return res.status(403).send('Document not exists, cannot delete');

        const shippmentStatus = 'cancelled';

        const newshippmentDocument = await shippment.delete({ order_id: order_id,shippment_status: shippmentStatus });
        return res.status(200).send({ body: newshippmentDocument, message: 'Successfully cancelled shippment' });
    }
    catch (e) {
        console.log('[deleteshippment] e', e)
    }
});*/

app.patch('/shippment', async (req, res) => {
    try {
        // const { order_id } = createShipment.order_id;
        const { order_id } = req.body;
        console.log('order_id', order_id);
        if (!order_id) return res.status(403).send('order_id is required');

        const shippment = await shippment.findOne({ order_id: order_id });
        if (!shippment) return res.status(403).send('could not find order_id');

        // fetch shipment from db for this order_id
        // determine what the current status is
        // determine what the next status should be
        // update the database with new
        const currentshippmentStatus = shippment.shippment_status;
        const nextshippmentStatus = {
            CREATED: 'SHIPPED',
            SHIPPED: 'DELIVERED'
        }[currentshippmentStatus];

        const updatedDocument = await shippment.updateOne({ order_id: order_id }, { shippment_status: nextshippmentStatus }, { returnDocument: true });
        return res.status(200).send({ body: updatedDocument, message: 'Successfully updated order status' });

    } catch (e) {
        console.log('[updateshippment] e', e)
    }
});

const CONNECTION_URL = 'mongodb+srv://dareenelsayed:Dg121212@cluster0.tr6st.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

app.listen(PORT , () => console.log (`server running on port : ${PORT}`));

mongoose.connect(CONNECTION_URL , {useNewUrlParser: true , useUnifiedTopology: true})
    // .then(() => app.listen(PORT , () => console.log (`server running on port : ${PORT}`)))
    .then(() =>  console.log (`server running on port : ${PORT}`))
    .catch ((error) => console.log(error.message));



