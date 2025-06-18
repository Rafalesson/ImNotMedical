import { Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Browser, launch } from 'puppeteer';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser | null = null;

  async onModuleInit() {
    try {
      this.browser = await launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      });
    } catch (error) {
      console.error('FALHA AO INICIAR PUPPETEER:', error);
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    if (!this.browser) {
      throw new InternalServerErrorException('Instância do Puppeteer não está pronta.');
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