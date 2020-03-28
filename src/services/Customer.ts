import Customer from '@schemas/Customer';
import Product from '@schemas/Product';
import Activity from '@schemas/Activity';

class CustomerService{
  async saveHistory(client: any, history: string[]): Promise<object>{
    
    let existentClient = await Customer.findOne({_id: client});
    if(!existentClient){
      existentClient = await Customer.create({});
      client = existentClient._id;
    }

    const items: string[] = [];

    await Promise.all(history.map(async (product: string) => {
      const existingProduct = await Product.findOne({url: product});
      if(existingProduct){
        items.push(existingProduct._id);
      }
    }));
    if(items.length){
      if(!await Activity.findOne({ client, type: 'history' })){
        await Activity.create({
          client, items, type: 'history',
        });
      }else{
        await Activity.updateOne({ client }, { $set: { items } });
      }
    }
    return {
      client,
      items,
    };
  }
  async saveSale(client: any, cart: string[]): Promise<void>{
    const items: string[] = [];

    await Promise.all(cart.map(async (product: string) => {
      const existingProduct = await Product.findOne({url: product});
      if(existingProduct){
        items.push(existingProduct._id);
      }
    }));

    if(items.length){
      if(!await Activity.findOne({ client, type: 'sale' })){
        await Activity.create({
          client, items, type: 'sale',
        });
      }else{
        await Activity.updateOne({ client }, { $set: { items } });
      }
    }
  }
}

export default CustomerService;