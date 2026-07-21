/**
 * Media upload service.
 *
 * TODO(backend): There is NO media/upload endpoint in the backend. The schema
 * stores `articles.featured_image` as a plain text URL, and `multer` + `aws-sdk`
 * (Cloudflare R2) dependencies are installed but unused, with static file
 * serving commented out in `src/app/server.js`.
 *
 * Required endpoint (proposed): `POST /api/v1/media` (multipart/form-data,
 * field `file`), auth: author/superadmin, returning `{ url: string }`. Wire it
 * here and the URL-based picker will transparently gain direct uploads.
 */
export const MEDIA_UPLOAD_ENDPOINT = "/api/v1/media"; // not yet implemented

export async function uploadImage(_file: File): Promise<string> {
  void _file;
  throw new Error(
    "Direct upload isn't available yet. Paste an image URL instead. (Backend media upload endpoint pending.)",
  );
}
