import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  error?: string;
}

export interface UploadOptions {
  bucket: 'educational-assets' | 'user-certificates';
  folder?: string;
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  onProgress?: (progressPercent: number) => void;
}

const DEFAULT_PDF_MAX_SIZE = 50 * 1024 * 1024; // 50MB
const DEFAULT_IMAGE_MAX_SIZE = 15 * 1024 * 1024; // 15MB

export const mediaService = {
  /**
   * Validate file against size & MIME constraints
   */
  validateFile(file: File, options?: Partial<UploadOptions>): { valid: boolean; error?: string } {
    const maxBytes = options?.maxSizeBytes || DEFAULT_PDF_MAX_SIZE;
    if (file.size > maxBytes) {
      const maxMb = Math.round(maxBytes / (1024 * 1024));
      return { valid: false, error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${maxMb}MB.` };
    }

    if (options?.allowedMimeTypes && options.allowedMimeTypes.length > 0) {
      const isAllowed = options.allowedMimeTypes.some(mime => {
        if (mime.endsWith('/*')) {
          const prefix = mime.split('/')[0];
          return file.type.startsWith(`${prefix}/`);
        }
        return file.type === mime;
      });

      if (!isAllowed) {
        return { valid: false, error: `File type "${file.type || 'unknown'}" is not permitted.` };
      }
    }

    return { valid: true };
  },

  /**
   * Upload file to Supabase Storage or generate local object URL
   */
  async uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    const validation = this.validateFile(file, options);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folder = options.folder ? options.folder.replace(/^\/|\/$/g, '') : 'uploads';
    const uniqueName = `${folder}/${Date.now()}_${cleanFileName}`;

    if (options.onProgress) {
      options.onProgress(20);
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.storage
          .from(options.bucket)
          .upload(uniqueName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.warn('Supabase storage upload error:', error.message);
          throw error;
        }

        if (options.onProgress) {
          options.onProgress(85);
        }

        // Get public URL or signed URL
        const { data: { publicUrl } } = supabase.storage
          .from(options.bucket)
          .getPublicUrl(data?.path || uniqueName);

        if (options.onProgress) {
          options.onProgress(100);
        }

        return {
          url: publicUrl,
          path: data?.path || uniqueName,
          fileName: file.name,
          sizeBytes: file.size,
          mimeType: file.type
        };
      } catch (err: any) {
        console.warn('Fallback to local storage emulation for file:', err);
      }
    }

    // Offline / demo fallback using Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (options.onProgress) options.onProgress(100);
        resolve({
          url: reader.result as string,
          path: uniqueName,
          fileName: file.name,
          sizeBytes: file.size,
          mimeType: file.type
        });
      };
      reader.onerror = (e) => reject(new Error('Failed to read file locally: ' + e));
      reader.readAsDataURL(file);
    });
  }
};
