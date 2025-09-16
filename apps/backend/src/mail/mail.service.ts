import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    void this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      console.error('Falha ao inicializar o transporter de e-mail:', error);
      this.transporter = null;
    }
  }

  async sendPasswordResetEmail(
    userEmail: string,
    token: string,
  ): Promise<void> {
    if (!this.transporter) {
      console.error('Transporter nao inicializado!');
      return;
    }

    const resetUrl = `http://localhost:3001/redefinir-senha?token=${token}`;

    const info = await this.transporter.sendMail({
      from: '"Equipe Zello" <nao-responda@zello.com.br>',
      to: userEmail,
      subject: 'Recuperacao de Senha - Zello',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Recuperacao de Senha</h2>
          <p>Ola,</p>
          <p>Voce solicitou a redefinicao de sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <p style="margin: 20px 0;">
            <a
              href="${resetUrl}"
              style="background-color: #2563eb; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;"
            >
              Redefinir Minha Senha
            </a>
          </p>
          <p>Se voce nao solicitou isso, por favor, ignore este e-mail.</p>
          <br>
          <p>Atenciosamente,<br>Equipe Zello.</p>
        </div>
      `,
    });

    console.log(
      'E-mail de teste enviado! Preview URL: %s',
      nodemailer.getTestMessageUrl(info),
    );
  }
}
