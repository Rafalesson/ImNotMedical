import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly certificatesFolder = 'certificates';
  private readonly isConfigured: boolean;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Ignora a configuracao quando as credenciais estao ausentes para permitir que o app suba localmente.
    if (!cloudName || !apiKey || !apiSecret) {
      this.isConfigured = false;
      console.warn(
        'Cloudinary credentials are not configured. File uploads will fail until CLOUDINARY_* variables are provided.',
      );
      return;
    }

    // Configura o cliente global da Cloudinary uma unica vez usando as variaveis de ambiente.
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    this.isConfigured = true;
  }

  // Envia o buffer PDF para a pasta de certificados mantendo o id do registro como public id.
  async uploadCertificatePdf(
    buffer: Buffer,
    identifier: string,
  ): Promise<UploadApiResponse> {
    this.ensureConfigured();
    const publicId = `${this.certificatesFolder}/${identifier}`;
    return this.uploadRaw(buffer, { publicId, format: 'pdf' });
  }

  // Remove um PDF previamente enviado a partir da URL da Cloudinary.
  async deleteCertificatePdfByUrl(
    url: string | null | undefined,
  ): Promise<void> {
    this.ensureConfigured();
    const publicId = this.extractPublicId(url);
    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  }

  // Permite que outras classes verifiquem se a integracao esta ativa.
  isEnabled(): boolean {
    return this.isConfigured;
  }

  // Helper compartilhado para enviar o buffer como asset do tipo raw.
  private uploadRaw(
    buffer: Buffer,
    options: { publicId: string; format?: string },
  ) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      // Cria uma stream de upload porque a Cloudinary espera assets raw como streams.
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          public_id: options.publicId,
          format: options.format,
          overwrite: true,
        },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(
              error instanceof Error ? error : new Error(String(error)),
            );
          }

          if (!result) {
            return reject(new Error('Cloudinary upload returned no result.'));
          }

          resolve(result);
        },
      );

      Readable.from(buffer).pipe(upload);
    });
  }

  // Extrai o public id da Cloudinary a partir da URL para permitir exclusoes futuras.
  private extractPublicId(url: string | null | undefined): string | null {
    if (!url) {
      return null;
    }

    const uploadSegment = '/upload/';
    const segmentIndex = url.indexOf(uploadSegment);
    if (segmentIndex === -1) {
      return null;
    }

    const afterUpload = url.slice(segmentIndex + uploadSegment.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const withoutResource = withoutVersion.replace(/^raw\//, '');
    const withoutExtension = withoutResource.replace(/\.[^./]+$/, '');

    if (!withoutExtension.startsWith(this.certificatesFolder)) {
      return null;
    }

    return withoutExtension;
  }

  private ensureConfigured() {
    if (!this.isConfigured) {
      throw new InternalServerErrorException(
        'Cloudinary credentials are not configured.',
      );
    }
  }
}
