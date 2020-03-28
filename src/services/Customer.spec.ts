import CustomerService from '@services/Customer';

import MongoMock from '@utils/tests/MongoMock';
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

  it('must be able to save the customer history', async () => {

    const customerHistory = ["https://lojabuscanimes.com/camisa-naruto-naruto-modo-kyubi-modelo-01.html"];

    const customerService = new CustomerService();
    await customerService.saveHistory('5e7e53bde99e96cf084b0c25', customerHistory);
    const createdCustomer = await Customer.findOne({}).lean();
    

    expect(createdCustomer).not.toEqual(null);
    

    const createdHistory = await Activity.find({type: 'history'}).lean();


    expect(createdHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          client: createdCustomer?._id,
        }),
      ]),
    );

  });

  it('must be able to save the customer sales', async () => {
    const customerHistory = ["https://lojabuscanimes.com/camisa-naruto-naruto-modo-kyubi-modelo-01.html"];

    const customerService = new CustomerService();
    await customerService.saveSale('5e7e53bde99e96cf084b0c25', customerHistory);

    const createdHistory = await Activity.find({type: 'sale'}).lean();

    expect(createdHistory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'sale',
        }),
      ]),
    );

  });
});