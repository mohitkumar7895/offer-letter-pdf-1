export const uploadImage = async (file: File): Promise<string> => {
  // Simulate network delay for mock upload
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // For a mock implementation, we convert the image to base64.
  // In production, you would upload to AWS S3, Cloudinary, etc., 
  // and return the public URL string instead.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
