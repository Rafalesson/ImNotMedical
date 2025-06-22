// Endereço: apps/backend/src/mail/mail.service.ts (versão corrigida)

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    console.log('ETHEREAL TEST ACCOUNT:');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);

    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendPasswordResetEmail(userEmail: string, token: string) {
    if (!this.transporter) {
      console.error('Transporter não inicializado!');
      return;
    }

    const resetUrl = `http://localhost:3001/redefinir-senha?token=${token}`;

    const info = await this.transporter.sendMail({
      from: '"Equipe Zello" <nao-responda@zello.com.br>',
      to: userEmail,
      subject: 'Recuperação de Senha - Zello',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Recuperação de Senha</h2>
          <p>Olá,</p>
          <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <p style="margin: 20px 0;">
            <a 
              href="${resetUrl}" 
              style="background-color: #2563eb; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;"
            >
              Redefinir Minha Senha
            </a>
          </p>
          <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
          <br>
          <p>Atenciosamente,<br>Equipe Zello.</p>
        </div>
      `,
    });

    console.log('E-mail de teste enviado! Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}