import { ImageResponse } from 'next/server';

import { Favicon } from '@/components/Favicon';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(<Favicon size={size.width} />, { ...size });
}
