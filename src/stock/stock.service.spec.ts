import { StockService } from './stock.service';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    service = new StockService();
  });

  describe('getStockLevel', () => {
    it('should return stock level for an existing SKU', async () => {
      // Mock data
      const stocks = [{ sku: 'CLQ274846/07/46', stock: 10 }];
      const transactions = [{ sku: 'CLQ274846/07/46', type: 'order', qty: 2 }];

      // Mock the readJsonFile method
      jest
        .spyOn(service as any, 'readJsonFile')
        .mockImplementation((fileName: string) => {
          if (fileName === 'stocks.json') {
            return Promise.resolve(stocks);
          } else if (fileName === 'transactions.json') {
            return Promise.resolve(transactions);
          }
          return Promise.resolve([]);
        });

      const result = await service.getStockLevel('CLQ274846/07/46');
      expect(result).toEqual({ sku: 'CLQ274846/07/46', qty: 8 });
    });

    it('should return 0 stock level for a non-existing SKU', async () => {
      // Mock data
      const stocks = [{ sku: 'NPR640416/53/91', stock: 3231 }];
      const transactions = [{ sku: 'NPR640416/53/91', type: 'order', qty: 2 }];

      // Mock the readJsonFile method
      jest
        .spyOn(service as any, 'readJsonFile')
        .mockImplementation((fileName: string) => {
          if (fileName === 'stocks.json') {
            return Promise.resolve(stocks);
          } else if (fileName === 'transactions.json') {
            return Promise.resolve(transactions);
          }
          return Promise.resolve([]);
        });

      try {
        await service.getStockLevel('NonExistingSKU');
      } catch (error) {
        expect(error.message).toBe('SKU NonExistingSKU does not exist');
      }
    });
  });
});
