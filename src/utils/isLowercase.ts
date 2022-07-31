const isLowercase = (property: string) => {
  return /^[a-z0-9]+$/g.test(property)
}

export default isLowercase
