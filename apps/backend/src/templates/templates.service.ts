import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CertificateData } from 'src/certificate/certificate.types';

@Injectable()
export class TemplatesService {
  private readHtmlTemplate(): string {
    return fs.readFileSync(path.join(process.cwd(), 'dist', 'templates', 'certificate.template.html'), 'utf-8');
  }

  private readCssTemplate(): string {
    return fs.readFileSync(path.join(process.cwd(), 'dist', 'templates', 'templateAtestado.css'), 'utf-8');
  }

  private getImageAsBase64(imageName: string): string {
    try {
      const imagePath = path.join(process.cwd(), 'dist', 'templates', imageName);
      if (!fs.existsSync(imagePath)) {
        console.warn(`Arquivo de imagem não encontrado: ${imagePath}`);
        return '';
      }
      const imageBuffer = fs.readFileSync(imagePath);
      const extension = path.extname(imageName).slice(1);
      const mimeType = `image/${extension}`;
      return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
      console.error(`Erro ao ler a imagem ${imageName}:`, error);
      return '';
    }
  }

  public getPopulatedCertificateHtml(data: CertificateData): string {
    const htmlTemplate = this.readHtmlTemplate();
    const cssTemplate = this.readCssTemplate();
    const signatureJpeg = this.getImageAsBase64('assinatura_img.jpeg');
    const signaturePng = this.getImageAsBase64('signature.png');

    let populatedHtml = htmlTemplate
      .replace(/{{doctorName}}/g, data.doctorName ?? '')
      .replace(/{{doctorSpecialty}}/g, data.doctorSpecialty ?? 'Clínico Geral')
      .replace(/{{doctorCRM}}/g, data.doctorCrm ?? '')
      .replace(/{{doctorAddress}}/g, data.doctorAddress ?? 'Endereço não informado')
      .replace(/{{doctorPhone}}/g, data.doctorPhone ?? 'Contato não informado')
      .replace(/{{patientName}}/g, data.patientName ?? '')
      .replace(/{{patientCPF}}/g, data.patientCpf ?? '')
      .replace(/{{patientAge}}/g, data.patientAge ?? '')
      .replace(/{{patientSex}}/g, data.patientSex ?? 'Não informado')
      .replace(/{{durationInDays}}/g, data.durationInDays.toString())
      .replace(/{{durationInWords}}/g, data.durationInWords ?? '')
      .replace(/{{startDate}}/g, data.startDate ?? '')
      .replace(/{{purpose}}/g, data.purpose ?? '')
      .replace(/{{cidCode}}/g, data.cidCode ?? '')
      .replace(/{{cidDescription}}/g, data.cidDescription ?? '')
      .replace(/{{issueDateTime}}/g, data.issueDateTime ?? '')
      .replace(/{{certificateId}}/g, data.certificateId ?? '')
      .replace('{{signatureImage}}', signatureJpeg)
      .replace('{{signaturePngImage}}', signaturePng);

    return populatedHtml.replace('</head>', `<style>${cssTemplate}</style></head>`);
  }
}