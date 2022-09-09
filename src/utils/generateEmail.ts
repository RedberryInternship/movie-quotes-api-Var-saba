import path from 'path'
import fs from 'fs'

const generateEmail = (
  name: string,
  object: string,
  url: string,
  passwordReset?: boolean
) => {
  const template = fs.readFileSync(
    path.join(__dirname, '..', 'views', 'email-template.html'),
    'utf-8'
  )

  let newEmailTemp = template

  newEmailTemp = newEmailTemp.replace(
    /{% uri %}/g,
    `${process.env.FRONTEND_URI}${url}`
  )
  newEmailTemp = newEmailTemp.replace(/{% verify-object %}/g, object)
  newEmailTemp = newEmailTemp.replace('{% user-name %}', name)

  if (!passwordReset) {
    newEmailTemp = newEmailTemp.replace('{% button-action %}', 'Verify')
    newEmailTemp = newEmailTemp.replace('{% action %}', 'verify')
  } else {
    newEmailTemp = newEmailTemp.replace('{% button-action %}', 'Reset')
    newEmailTemp = newEmailTemp.replace('{% action %}', 'reset')
  }

  if (object === 'account') {
    newEmailTemp = newEmailTemp.replace(
      '{% new-welcome-text %}',
      'Thanks for joining Movie quotes! We really appreciate it.'
    )
  } else {
    newEmailTemp = newEmailTemp.replace('{% new-welcome-text %}', '')
  }

  return newEmailTemp
}

export default generateEmail
