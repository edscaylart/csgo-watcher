import React, { useMemo } from 'react'
import { GetServerSideProps } from 'next'
import { utcToZonedTime } from 'date-fns-tz'
import { format, compareAsc } from 'date-fns'
import { supabase } from '@/lib/initSupabase'

type Props = {
  map: {
    "mode": string;
    "name": string;
    "round": number;
    "team_ct_score": number;
    "team_tr_score": number;
    "updated_at": Date;
  }
}

const Blog: React.FC<Props> = (props) => {
  const formattedDate = useMemo(() => {
    if (!props.map?.updated_at) return '';

    const date = new Date(props.map.updated_at)
    const timeZone = 'America/Sao_Paulo'
    const zonedDate = utcToZonedTime(date, timeZone)
    const formattedDate = format(zonedDate, 'dd/MM/yyyy HH:mm:ss')
    return formattedDate;
  }, [ props.map])

  return (
  <>
   <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">CS:GO dos <span className="text-[hsl(280,100%,70%)]">Pratinhas</span></h1>
          <h3 className="text-2xl font-bold text-center text-white mt-4">Mapa: {props.map.name}</h3>
          <h3 className="text-2xl font-bold text-center text-white mb-4">Round: {props.map.round}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold text-center">Counter-Terrorists</h3>
              <div className="text-4xl text-center">{props.map.team_ct_score}</div>
            </div>
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold  text-center">Terrorists</h3>
              <div className="text-4xl text-center">{props.map.team_tr_score}</div>
            </div>
          </div>

          <p className="text-sm text-white mt-8">
           Última atualização em <span className="text-[hsl(280,100%,70%)]">{formattedDate}</span>
          </p>
        </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  let { data } = await supabase.from('maps')
    .select()
    .order('updated_at', { ascending: false })
    .limit(1)

  return {
    props: { map: data?.length ? data[0] : {} },
  }
}

export default Blog
