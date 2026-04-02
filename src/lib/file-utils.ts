export default function getBase64Image(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image (JPEG, PNG, GIF, or WEBP)'))
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      const base64String = reader.result?.toString()?.split(',')[1]
      if (base64String) {
        resolve(base64String)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
  })
}
