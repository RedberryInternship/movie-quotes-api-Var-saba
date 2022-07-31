import path from 'path'
import fs from 'fs'

const generateEmail = (name: string, object: string, url: string) => {
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

  return newEmailTemp
}

export default generateEmail
