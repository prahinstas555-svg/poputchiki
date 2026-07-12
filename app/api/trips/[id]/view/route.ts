// app/api/trips/[id]/view/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const supabase = createClient(url, serviceKey);

    // читаем текущее значение
    const { data: current, error: readError } = await supabase
      .from('trips')
      .select('views')
      .eq('id', id)
      .single();

    if (readError || !current) {
      return NextResponse.json({ error: readError?.message || 'Not found' }, { status: 404 });
    }

    // пишем новое значение +1
    const nextViews = (current.views ?? 0) + 1;

    const { error: writeError } = await supabase
      .from('trips')
      .update({ views: nextViews })
      .eq('id', id);

    if (writeError) {
      return NextResponse.json({ error: writeError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, views: nextViews });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
