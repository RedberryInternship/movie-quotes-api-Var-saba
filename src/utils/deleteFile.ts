import fs from 'fs'

const deleteFile = async (path: string) => {
  fs.unlinkSync(path)
}

export default deleteFile
