"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchRadarStatus } from "@/features/cms/services/viral-issue.service";
export function RadarHealth({enabled}: {enabled: boolean}) {
  const query = useQuery({queryKey: ["cms", "news-feed", "radar-status"],queryFn: fetchRadarStatus,
    enabled, staleTime: 30_000, refetchInterval: 60_000,refetchIntervalInBackground: false,refetchOnWindowFocus: "always",refetchOnReconnect: "always"});
  if (!enabled) return null;
  if (query.isError && !query.data) return <p className="mb-3 text-sm text-amber-600">Status sumber belum tersedia. <button onClick={()=>void query.refetch()} className="underline">Coba lagi</button></p>;
  if (!query.data) return null;
  const data = query.data;
  return <details className="mb-4 rounded border border-neutral-200 p-3 text-sm dark:border-neutral-700">
    <summary className="cursor-pointer font-medium">Radar isu · {data.sources?.filter(s=>s.active).length ?? 0} portal aktif · {data.enabled ? data.availability : "kandidat belum diaktifkan"}</summary>
    <p className="my-2 text-xs text-neutral-500">{data.message ?? "Cakupan editorial lintas media; bukan ukuran jumlah pembaca."}</p>
    {query.isError ? <p className="text-amber-600">Refresh status gagal; menampilkan status sebelumnya.</p> : null}
    <ul className="grid gap-2 sm:grid-cols-2">{data.sources?.map(source=>{
      const health=data.health?.filter(h=>h.source_id===source.id) ?? [];
      return <li key={source.id} className="border-t border-neutral-200 pt-2 dark:border-neutral-700">
        <p className="font-medium">{source.label} · {source.active ? (health.length ? health.map(h=>h.state).join(", ") : "belum diperiksa") : "paused"}</p>
        <p className="text-xs text-neutral-500">{source.reason}</p>
        <p className="text-xs text-neutral-500">Kelompok media: {source.ownershipVerified === false ? "belum diverifikasi; bukan suara independen tambahan" : source.group}</p>
        {source.channels.map(channel=><p key={channel.id} className="text-xs text-neutral-500">{channel.id}: {channel.desks.length ? channel.desks.join(", ") : "cakupan desk belum divalidasi"}</p>)}
        {health.map(h=><p key={h.channel} className="text-xs text-neutral-500">{h.channel}: {h.reason ?? (h.complete ? "pengambilan lengkap" : "kelengkapan belum terbukti")}</p>)}
        {data.attempts?.filter(a=>a.source_id===source.id).map(a=><p key={a.source_id} className="text-xs text-neutral-500">Fetch 24 jam: {a.succeeded}/{a.attempts} berhasil · {a.blocked} terblokir · {a.retry_scheduled} retry</p>)}
        {data.pending?.filter(p=>p.source_id===source.id).map(p=><p key={p.status} className="text-xs text-neutral-500">{p.status}: {p.count} URL</p>)}
      </li>;
    })}</ul>
  </details>;
}
