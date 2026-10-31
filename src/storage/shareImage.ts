// Shares a rendered view as a 1080×1920 PNG through the system share sheet (Life Sim Spec §8).
// The web build uses shareImage.web.ts.

import * as Sharing from 'expo-sharing';
import type { ComponentRef, RefObject } from 'react';
import { PixelRatio, type View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export const SHARE_SIZE = { width: 1080, height: 1920 } as const;

/** Returns false when sharing isn't available on this device. */
export async function shareViewAsImage(view: RefObject<ComponentRef<typeof View> | null>, title: string): Promise<boolean> {
  if (!(await Sharing.isAvailableAsync())) return false;
  // captureRef sizes are logical pixels; divide by the pixel ratio to get exactly 1080×1920.
  const ratio = PixelRatio.get();
  const uri = await captureRef(view, { format: 'png', quality: 1, result: 'tmpfile', width: SHARE_SIZE.width / ratio, height: SHARE_SIZE.height / ratio });
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: title });
  return true;
}
