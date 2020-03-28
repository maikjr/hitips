import {Router} from 'express';
import fs from 'fs';

import ImportProducts from '@services/ImportProducts';
import ActivityService from '@services/Customer';
import Recommendations from '@services/Recommendations';

const routes = Router();

routes.get('/', (req, res) => res.json({msg: "Hi baby, are you lost?"}));

routes.post('/import-products', async (req, res) => {
  try{
    const fileSync = fs.readFileSync(__dirname +'/../tmp/products.xml', "utf8");
    const importContacts = new ImportProducts();
    await importContacts.run(fileSync);
    res.send({});
  }catch(err){
    return res.status(500).send({ error: 'failed to import the product file' });
  }
});

routes.post('/customer-history', async (req, res) => {
  const {customer, history} = req.body;
  try{
    const activityService = new ActivityService();
    const activity = await activityService.saveHistory(customer, history);
    res.send(activity);
  }catch(err){
    return res.status(500).send({ error: 'failed to save customer history' });
  }
});

routes.post('/customer-sale', async (req, res) => {
  const {customer, cart} = req.body;
  try{
    const activityService = new ActivityService();
    await activityService.saveSale(customer, cart);
    res.send({});
  }catch(err){
    return res.status(500).send({ error: 'failed to save customer history' });
  }
});

routes.post('/recommendations', async (req, res) => {
  const {client, currentProduct, page} = req.body;
  try{

    const recommendationsService = new Recommendations(15);
    const history = await recommendationsService.history(client);
    const similarProducts = await recommendationsService.similarProducts(currentProduct);
    const areBuying = await recommendationsService.areBuying();
    const boughtTogether = await recommendationsService.boughtTogether(currentProduct);

    res.send({
      history,
      similarProducts: (page === 'product') ? similarProducts : [],
      boughtTogether: (page === 'product') ? boughtTogether : [],
      areBuying,
    });

  }catch(err){
    return res.status(500).send({ error: 'failed to save customer history' });
  }
});

export default routes;