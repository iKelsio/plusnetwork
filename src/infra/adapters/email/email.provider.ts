import { createTransport, type Transporter } from "nodemailer";
import { EmailTemplate, IEmailProvider } from "@domain/shared/ports";
import path from "path";
import * as fs from "fs/promises";
import lodash from "lodash";
export class NodemailerProvider implements IEmailProvider {
  private transporter: Transporter;
  private templatesPath: string;

  constructor() {
    this.transporter = createTransport({
      port: 1025,
      // host: SmtpConfig.SMTP_HOST,
      // port: SmtpConfig.SMTP_PORT,
      // service: SmtpConfig.SMTP_SERVICE,
      // secure: GlobalConfig.IS_PRODUCTION,
      // ...(GlobalConfig.IS_PRODUCTION
      //   ? {
      //       auth: {
      //         user: SmtpConfig.SMTP_HOST,
      //         pass: SmtpConfig.SMTP_PASSWORD,
      //       },
      //     }
      //   : {
      //       tls: { rejectUnauthorized: false },
      //     }),
    });

    this.templatesPath = path.join(__dirname, "templates");
  }

  public async verify() {
    return this.transporter.verify();
  }

  async sendMail(
    to: string,
    templateName: `${EmailTemplate}`,
    data?: Record<string, unknown>
  ): Promise<void> {
    const templatePath = path.join(
      this.templatesPath,
      `${templateName}.template`
    );
    const template = await fs.readFile(templatePath, "utf-8");

    const compiledTemplate = lodash.template(template);
    const emailContent = compiledTemplate(data);

    return this.transporter.sendMail({
      to,
      subject: templateName,
      html: emailContent,
    });
  }
}
