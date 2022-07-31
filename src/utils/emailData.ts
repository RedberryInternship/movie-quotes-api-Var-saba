const emailData = (
  email: string,
  emailSubject: string,
  emailTemplate: string
) => {
  return {
    to: email,
    from: process.env.EMAIL_SENDER!,
    subject: `Please verify your ${emailSubject}`,
    html: emailTemplate,
  }
}

export default emailData
