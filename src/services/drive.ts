import { refreshAccessToken } from './auth';
import { MOCK_DRIVE_IMAGES } from '../constants/mock-data';

const DRIVE_FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID as string | undefined;

export const isDriveEnabled = import.meta.env.DEV || Boolean(DRIVE_FOLDER_ID);

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

export interface DriveImage {
  id: string;
  name: string;
  thumbnailLink: string;
  webContentLink: string;
}

async function driveRequest(url: string, accessToken: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...init?.headers },
  });

  if (response.status === 401) {
    const freshToken = await refreshAccessToken();
    if (!freshToken) throw new Error('Failed to refresh access token');
    return fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${freshToken}`, ...init?.headers },
    });
  }

  return response;
}

export async function listDriveImages(accessToken: string | null): Promise<DriveImage[]> {
  if (!DRIVE_FOLDER_ID) return MOCK_DRIVE_IMAGES;
  if (!accessToken) throw new Error('No access token available');

  const params = new URLSearchParams({
    q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id,name,thumbnailLink,webContentLink)',
    orderBy: 'name',
  });

  const response = await driveRequest(`${DRIVE_API}/files?${params}`, accessToken);
  if (!response.ok) throw new Error(`Drive API error: ${response.status}`);

  const data = await response.json();
  return data.files as DriveImage[];
}

export async function uploadImage(accessToken: string | null, file: File): Promise<DriveImage> {
  if (!DRIVE_FOLDER_ID) {
    const mockId = `mock-${Date.now()}`;
    return {
      id: mockId,
      name: file.name,
      thumbnailLink: `https://placehold.co/400x300/c6d6ff/333?text=${encodeURIComponent(file.name)}`,
      webContentLink: `https://placehold.co/800x600/c6d6ff/333?text=${encodeURIComponent(file.name)}`,
    };
  }
  if (!accessToken) throw new Error('No access token available');

  const metadata = JSON.stringify({ name: file.name, parents: [DRIVE_FOLDER_ID] });

  const boundary = '---drive-upload-boundary';
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
    `--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`;
  const ending = `\r\n--${boundary}--`;

  const bodyBlob = new Blob([body, file, ending], { type: `multipart/related; boundary=${boundary}` });

  const response = await driveRequest(`${UPLOAD_API}/files?uploadType=multipart&fields=id,name,thumbnailLink,webContentLink`, accessToken, {
    method: 'POST',
    body: bodyBlob,
  });

  if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
  return (await response.json()) as DriveImage;
}
