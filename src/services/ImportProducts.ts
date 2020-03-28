import xml2js from 'xml2js';
import Product from '@schemas/Product';

class ImportProducts{
  async run(fileStream: String): Promise<void> {

    const parser = new xml2js.Parser();
    await new Promise((resolve, reject) => parser.parseString(fileStream, async function (err: any, result: any) {
      if (err) reject(err);
      const jsonResult = JSON.stringify(result);
      const parseJson = JSON.parse(jsonResult);
      const item = parseJson.rss.channel[0].item[0];
      if(!await Product.findOne({ url: item['g:link'][0] })){
        await Product.create({
          url: item['g:link'][0],
          title: item['g:title'][0],
          description: item['g:description'][0],
          thumb: item['g:image_link'][0],
          price: (item['g:sale_price'][0]) ? item['g:sale_price'][0] : item['g:price'][0],
        });
      }
      resolve(result);
    }));
  }
}

export default ImportProducts;