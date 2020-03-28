import MongoMock from '@utils/tests/MongoMock';
import Recommendations from '@services/Recommendations';
import CustomerService from '@services/Customer';

import Customer from '@schemas/Customer';
import Product from '@schemas/Customer';
import Activity from '@schemas/Activity';

describe('Customers', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Activity.deleteMany({});
  });

  it('must be able to show the recommendations', async () => {
    const customer = '5e7e53bde99e96cf084b0c25';
    const currentProduct = 'https://lojabuscanimes.com/camisa-naruto-naruto-modo-kyubi-modelo-01.html';
    const customerHistory = ["https://lojabuscanimes.com/camisa-naruto-naruto-modo-kyubi-modelo-01.html"];


    const customerService = new CustomerService();
    await customerService.saveHistory(customer, customerHistory);

    const createdCustomer = await Customer.findOne({}).lean();
    await customerService.saveSale(createdCustomer?._id, customerHistory);


    const recommendations = new Recommendations(15);
    const history = await recommendations.history(createdCustomer?._id);
    const similarProducts = await recommendations.similarProducts(currentProduct);
    const areBuying = await recommendations.areBuying();
    const boughtTogether = await recommendations.boughtTogether(currentProduct);

    expect(history).not.toEqual(null);
    expect(similarProducts).not.toEqual(null);
    expect(areBuying).not.toEqual(null);
    expect(boughtTogether).not.toEqual(null);

  });

});
