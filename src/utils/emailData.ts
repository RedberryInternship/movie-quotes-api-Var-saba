const emailData = (
  email: string,
  emailSubject: string,
  emailTemplate: string,
  resetPassword?: boolean
) => {
  return {
    to: email,
    from: process.env.EMAIL_SENDER!,
    subject: `${
      resetPassword ? 'Reset' : 'Please verify'
    } your ${emailSubject}`,
    html: emailTemplate,
  }
}

export default emailData
