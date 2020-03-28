import stringSimilarity from 'string-similarity';

import Activity from '@schemas/Activity';
import Product from '@schemas/Product';

class Recommendations{
  private limitProducts: number;

  constructor(limit: number) {
    this.limitProducts = limit;
  }

  async history(client: any): Promise<object>{
    const history = await Activity.find({ client, type: 'history' })
                    .populate('items')
                    .lean()
                    .limit(this.limitProducts);
    return history;
  }

  async similarProducts(currentProduct: string): Promise<object>{
    const product = await Product.findOne({url: currentProduct})
                    .select('title description')
                    .lean();
    const products = await Product.find({}).lean();
    const similarProducts: object[] =  [];
    if(product){
      await Promise.all(products.map(item => {
        if(similarProducts.length === this.limitProducts) return;
        const compareTitle = stringSimilarity.compareTwoStrings(product.title.toString(), item.description.toString());
        const compareDescription = stringSimilarity.compareTwoStrings(product.description.toString(), item.description.toString());
        const sumScore = (compareTitle + compareDescription);
        if(Number(sumScore.toFixed(1)) > 0.5){
          similarProducts.push(item);
        }
      }));
    }
    return similarProducts;
  }
  async areBuying(): Promise<any>{
    const sale = await Activity.find({type: 'sale'})
                    .lean()
                    .populate('items')
                    .limit(this.limitProducts);
    return sale;
  }
  async boughtTogether(currentProduct: string): Promise<any>{
    const product = await Product.findOne({url: currentProduct}).lean();
    if(product){
      const sale = await Activity.find({ items: product._id, type: 'sale' }).populate('items').limit(this.limitProducts);
      return sale;
    }
  }
}

export default Recommendations;