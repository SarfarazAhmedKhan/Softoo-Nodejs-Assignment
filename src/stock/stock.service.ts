import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

interface Stock {
  sku: string;
  stock: number;
}

interface Transaction {
  sku: string;
  type: 'order' | 'restock';
  qty: number;
}

@Injectable()
export class StockService {
  private async readJsonFile<T>(fileName: string): Promise<T[]> {
    const filePath = path.join(__dirname, '../../data', fileName);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new Error(`Failed to read file ${filePath}: ${err.message}`);
    }
  }

  async getStockLevel(sku: string): Promise<{ sku: string; qty: number }> {
    const stocks = await this.readJsonFile<Stock>('stocks.json');
    const transactions =
      await this.readJsonFile<Transaction>('transactions.json');

    let stockEntry = stocks.find((stock) => stock.sku === sku);
    let currentStock = stockEntry ? stockEntry.stock : 0;

    transactions.forEach((transaction) => {
      if (transaction.sku === sku) {
        currentStock +=
          transaction.type === 'order' ? -transaction.qty : transaction.qty;
      }
    });
    if (
      !stockEntry &&
      !transactions.some((transaction) => transaction.sku === sku)
    ) {
      throw new Error(`SKU ${sku} does not exist`);
    }

    return { sku, qty: currentStock };
  }
}
