const emailData = (
  email: string,
  emailSubject: string,
  emailTemplate: string
) => {
  return {
    to: email,
    from: 'vartasashvili94@gmail.com',
    subject: `Please verify your ${emailSubject}`,
    html: emailTemplate,
  }
}

export default emailData
