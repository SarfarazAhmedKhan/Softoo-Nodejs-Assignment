import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('search')
  async searchRecordBySKU(@Body() body: { sku: string }) {
    const { sku } = body;
    try {
      const record = await this.stockService.getStockLevel(sku);
      return record;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
