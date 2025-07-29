// Endereço: apps/backend/src/pdf/pdf.service.ts

import { Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, connect } from 'puppeteer';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser | null = null;

  async onModuleInit() {
    try {
      const apiKey = process.env.BROWSERLESS_API_KEY;
      if (!apiKey) {
        throw new InternalServerErrorException('BROWSERLESS_API_KEY não foi encontrada nas variáveis de ambiente.');
      }

      console.log('Conectando ao Browserless.io...');
      // MODIFICAÇÃO: Usando a URL de conexão correta do produto BaaS V2
      this.browser = await connect({
        browserWSEndpoint: `wss://production-sfo.browserless.io?token=${apiKey}`,
      });
      console.log('Conexão com Browserless.io estabelecida com sucesso.');
      
    } catch (error) {
      console.error('FALHA AO CONECTAR COM BROWSERLESS.IO:', error);
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    if (!this.browser) {
      throw new InternalServerErrorException('Instância do navegador remoto (Puppeteer) não está pronta.');
    }
    const page = await this.browser.newPage();
    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }
}