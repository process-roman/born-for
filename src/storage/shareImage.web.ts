// Web version of shareImage.ts: the Web Share API can't take local files from expo-sharing, so
// share the PNG directly when the browser supports file sharing, otherwise download it.

import type { ComponentRef, RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export const SHARE_SIZE = { width: 1080, height: 1920 } as const;

export async function shareViewAsImage(view: RefObject<ComponentRef<typeof View> | null>, title: string): Promise<boolean> {
  // On web, width and height are the output size in pixels.
  const dataUri = await captureRef(view, { format: 'png', quality: 1, result: 'data-uri', ...SHARE_SIZE });
  const blob = await (await fetch(dataUri)).blob();
  const file = new File([blob], 'born-for-life.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return true;
    } catch {
      // Cancelled or blocked: fall back to a download.
    }
  }
  const link = document.createElement('a');
  link.href = dataUri;
  link.download = file.name;
  link.click();
  return true;
}
