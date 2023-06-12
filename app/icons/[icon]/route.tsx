import { ImageResponse, NextRequest } from 'next/server';

import { Favicon } from '@/components/Favicon';

// Route segment config
export const runtime = 'edge';

interface Context {
  params: { icon: string };
}

const allowed_sizes = [192, 512] as const;

export function GET(_: NextRequest, context: Context) {
  const { icon } = context.params;
  const size = Number(icon.replace('icon-', '').replace('.png', ''));
  if (!allowed_sizes.includes(size)) return new Response(null, { status: 404 });
  return new ImageResponse(<Favicon size={size} />, { width: size, height: size });
}
