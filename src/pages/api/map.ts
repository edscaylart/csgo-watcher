import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// POST /api/map
// Required fields in body: map
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.body.map) {
    const { team_ct, team_t, mode, name, round } = req.body.map;
    const result = await prisma.map.upsert({
      where: { name },
      create: {
        mode,
        name,
        round,
        team_ct_score: team_ct.score,
        team_tr_score: team_t.score
      },
      update: {
        mode,
        name,
        round,
        team_ct_score: team_ct.score,
        team_tr_score: team_t.score
      },
    })
    return res.status(201).json(result)
  }
  return res.status(200).json({ ok: 'ok' })
}
