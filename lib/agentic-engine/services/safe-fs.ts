import fs from 'fs';
import path from 'path';

/**
 * Serverless-Safe File System Utility
 * Guarantees that file operations succeed in local dev, GitHub Actions (read/write),
 * and Vercel Serverless / AWS Lambda (where the root filesystem is strictly read-only and only /tmp is writable).
 */
export class SafeFs {
  private static readonly TMP_ROOT = '/tmp';

  /**
   * Resolves a serverless /tmp fallback path for any relative or absolute path
   */
  public static getTmpFallbackPath(originalPath: string): string {
    const filename = path.basename(originalPath);
    return path.join(this.TMP_ROOT, filename);
  }

  /**
   * Safely writes file content. If root filesystem is read-only (EROFS),
   * it transparently redirects the write to /tmp.
   */
  public static writeFileSyncSafe(
    targetPath: string,
    data: string | NodeJS.ArrayBufferView,
    encoding: BufferEncoding = 'utf-8'
  ): { writtenPath: string; isFallback: boolean } {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, data, encoding);
      return { writtenPath: targetPath, isFallback: false };
    } catch (err: any) {
      // In serverless, fallback to /tmp
      if (err?.code === 'EROFS' || err?.code === 'EACCES' || err?.message?.includes('read-only')) {
        try {
          const tmpPath = this.getTmpFallbackPath(targetPath);
          fs.writeFileSync(tmpPath, data, encoding);
          return { writtenPath: tmpPath, isFallback: true };
        } catch (tmpErr) {
          console.warn(`[SafeFs] Failed fallback write to /tmp for ${targetPath}:`, tmpErr);
        }
      }
      console.warn(`[SafeFs] Could not write to ${targetPath}:`, err?.message);
      return { writtenPath: targetPath, isFallback: false };
    }
  }

  /**
   * Safely appends content to a file. Falls back to /tmp if root filesystem is read-only.
   */
  public static appendFileSyncSafe(
    targetPath: string,
    data: string | Uint8Array,
    encoding: BufferEncoding = 'utf-8'
  ): { writtenPath: string; isFallback: boolean } {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.appendFileSync(targetPath, data, encoding);
      return { writtenPath: targetPath, isFallback: false };
    } catch (err: any) {
      if (err?.code === 'EROFS' || err?.code === 'EACCES' || err?.message?.includes('read-only')) {
        try {
          const tmpPath = this.getTmpFallbackPath(targetPath);
          fs.appendFileSync(tmpPath, data, encoding);
          return { writtenPath: tmpPath, isFallback: true };
        } catch (tmpErr) {
          console.warn(`[SafeFs] Failed fallback append to /tmp for ${targetPath}:`, tmpErr);
        }
      }
      console.warn(`[SafeFs] Could not append to ${targetPath}:`, err?.message);
      return { writtenPath: targetPath, isFallback: false };
    }
  }

  /**
   * Reads file content checking both primary target path and /tmp fallback
   */
  public static readFileSyncSafe(targetPath: string, encoding: BufferEncoding = 'utf-8'): string | null {
    if (fs.existsSync(targetPath)) {
      try {
        return fs.readFileSync(targetPath, encoding);
      } catch {}
    }

    const tmpPath = this.getTmpFallbackPath(targetPath);
    if (fs.existsSync(tmpPath)) {
      try {
        return fs.readFileSync(tmpPath, encoding);
      } catch {}
    }

    return null;
  }

  /**
   * Checks if file exists in either target path or /tmp fallback
   */
  public static existsSyncSafe(targetPath: string): boolean {
    return fs.existsSync(targetPath) || fs.existsSync(this.getTmpFallbackPath(targetPath));
  }
}
