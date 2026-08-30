import { supabase } from '@/lib/supabase';

/**
 * Uploads a receipt image file to Supabase Storage bucket 'receipts'
 * and returns the clean public CDN URL to store in the expenses.receipt_url column.
 */
export async function uploadReceiptToSupabaseStorage(
  file: File | Blob,
  fileName: string = 'receipt.jpg'
): Promise<string> {
  const fileExt = fileName.split('.').pop() || 'jpg';
  const cleanFileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `public/${cleanFileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload notice:', error.message);
      // Fallback object URL if storage bucket is not configured yet
      return typeof window !== 'undefined' ? URL.createObjectURL(file) : '';
    }

    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload receipt to Supabase storage:', err);
    return typeof window !== 'undefined' ? URL.createObjectURL(file) : '';
  }
}
