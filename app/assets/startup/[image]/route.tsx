import { ImageResponse, NextRequest } from 'next/server';

import { Favicon } from '@/components/Favicon';

// Route segment config
export const runtime = 'edge';

interface Context {
  params: { image: string };
}

export function GET(_: NextRequest, context: Context) {
  const { image } = context.params;
  const [width, height] = image.replace('apple-touch-startup-image-', '').replace('.png', '').split('x').map(Number);

  if (Number.isNaN(width) || Number.isNaN(height)) return new Response(null, { status: 400 });
  return new ImageResponse(<Favicon size={Math.min(width, height)} />, { width, height });
}
