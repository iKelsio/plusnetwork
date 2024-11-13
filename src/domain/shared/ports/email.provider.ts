export enum EmailTemplate {
  passwordChanged = "password-changed",
  forgotPassword = "fortgot-password",
  jobApplicationConfirmation = "job-application-confirmation",
  welcome = "welcome",
}

export interface IEmailProvider {
  sendMail(
    to: string,
    templateName: `${EmailTemplate}`,
    data?: Record<string, unknown>
  ): Promise<void>;
}
