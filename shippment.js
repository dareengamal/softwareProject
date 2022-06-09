/*import express from 'express';

const router = express.Router();

router.get('/' , ( req , res) => {
    res.send('THIS WORK');
});

export default router ;*/
import express from 'express';
import { getshippment, updateshippment, createshippment,cancelshippment } from '../controllers/App.js';

const router=express.Router();


 //router.get('/', getProducts);
 router.get('/{order_id}',getshippment);
 router.post('/',createshippment);
 router.patch('/',updateshippment);

 router.delete('/',cancelshippment);
 //router.patch('/',cancelshippment)


export default router;
