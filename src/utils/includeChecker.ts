const includeChecker = (
  EngValue: string,
  GeoValue: string,
  searchKeyWord: string
) => {
  return (
    EngValue.toLowerCase().includes(searchKeyWord) ||
    GeoValue.toLowerCase().includes(searchKeyWord)
  )
}

export default includeChecker
