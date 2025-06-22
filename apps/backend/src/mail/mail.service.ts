// Endereço: apps/backend/src/mail/mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Usamos um método assíncrono no construtor para criar a conta de teste
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    // 1. Cria uma conta de teste no Ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    console.log('ETHEREAL TEST ACCOUNT:');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);

    // 2. Configura o "transportador" do Nodemailer com as credenciais de teste
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // Usuário gerado pelo Ethereal
        pass: testAccount.pass, // Senha gerada pelo Ethereal
      },
    });
  }

  async sendPasswordResetEmail(userEmail: string, token: string) {
    if (!this.transporter) {
      console.error('Transporter não inicializado!');
      return;
    }

    // Montamos a URL que o usuário irá clicar no e-mail
    const resetUrl = `http://localhost:3000/redefinir-senha?token=${token}`;

    // 3. Enviamos o e-mail
    const info = await this.transporter.sendMail({
      from: '"Equipe Zello" <nao-responda@zello.com.br>',
      to: userEmail,
      subject: 'Recuperação de Senha - Zello',
      html: `
        <p>Olá,</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="<span class="math-inline">\{resetUrl\}"\></span>{resetUrl}</a>
        <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        <p>Atenciosamente, Equipe Zello</p>
      `,
    });

    // 4. O Nodemailer nos dá um link para visualizar o e-mail enviado!
    console.log('E-mail de teste enviado! Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}