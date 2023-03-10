import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/initSupabase';

// POST /api/map
// Required fields in body: map
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.body.map) {
    const { team_ct, team_t, mode, name, round } = req.body.map;

    let body = {
      team_ct_score: team_ct.score,
      team_tr_score: team_t.score,
      mode,
      name,
      round,
      id: undefined
    };

    let { data } = await supabase.from('maps')
    .select()
    .eq('name', name)
    .eq('mode', mode)
    .limit(1)

    if (data?.length) {
      body = {...body, id: data[0].id };
    }

    const result = await supabase.from('maps').upsert(body);

    return res.status(201).json(result)
  }
  return res.status(200).json({ ok: 'ok' })
}