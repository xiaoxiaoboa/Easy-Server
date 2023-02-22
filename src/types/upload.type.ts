export interface File {
  size: number

  filepath: string

  originalFilename: string | null

  newFilename: string | null

  mimetype: string | null

  mtime: Date | null

  hashAlgorithm: false | "sha1" | "md5" | "sha256"
  hash: string | object | null
}
