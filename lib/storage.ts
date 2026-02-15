import { supabase } from './supabase';

/**
 * Uploads a file to the 'products' bucket.
 * @param file The file object from an input element.
 * @returns The public URL of the uploaded image.
 */
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

/**
 * Deletes an image from the 'products' bucket.
 * @param url Full public URL or path of the image.
 */
export const deleteProductImage = async (url: string) => {
  const path = url.split('/').pop(); // simplistic extraction, robust apps should parse URL
  if (!path) return;

  const { error } = await supabase.storage
    .from('products')
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
  }
};
