const languageValidation = (value: string, language: 'en' | 'ge') => {
  let languageRegex = /[\u10A0-\u10FF]/
  const text = value.replace(/\s/g, '')

  if (language === 'en') {
    languageRegex = /^[A-Za-z][A-Za-z0-9]*$/
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const isValidLanguage = languageRegex.test(char)

    if (
      !isValidLanguage &&
      !/[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/.test(char) &&
      !+char &&
      char !== '0'
    ) {
      return false
    }
  }

  return true
}

export default languageValidation
