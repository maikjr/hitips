import fs from 'fs';
import ImportProducts from '@services/ImportProducts';

import MongoMock from '@utils/tests/MongoMock';
import Product from '@schemas/Product';

describe('Import Products', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it('should be able to import new products', async () => {
    const fileSync = fs.readFileSync(__dirname +'/../../tmp/products.xml', "utf8");
    const importProducts = new ImportProducts();
    await importProducts.run(fileSync);

    const createdProducts = await Product.find({}).lean();

    expect(createdProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Camisa Naruto - Naruto Modo Kyuubi',
          url: 'https://lojabuscanimes.com/camisa-naruto-naruto-modo-kyubi-modelo-01.html',
        }),
      ]),
    );

  });
});