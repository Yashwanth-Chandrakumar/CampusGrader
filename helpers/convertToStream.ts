// helpers/convertToStream.ts
import { NextRequest } from 'next/server';
import { Readable } from 'stream';

export function convertToStream(req: NextRequest): Readable {
  const stream = new Readable();
  stream.push(req.body);
  stream.push(null);
  return stream;
}
