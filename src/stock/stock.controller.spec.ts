import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

describe('StockController', () => {
  let controller: StockController;
  let stockService: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [StockService],
    }).compile();

    controller = module.get<StockController>(StockController);
    stockService = module.get<StockService>(StockService);
  });

  describe('getStockLevel', () => {
    it('should return stock level for a given SKU', async () => {
      const sku = 'SXB930757/87/87';
      const expectedResult = { sku: 'SXB930757/87/87', qty: 10 };

      jest
        .spyOn(stockService, 'getStockLevel')
        .mockResolvedValueOnce(expectedResult);

      const result = await controller.searchRecordBySKU({ sku });

      expect(result).toEqual(expectedResult);
    });
  });
});
