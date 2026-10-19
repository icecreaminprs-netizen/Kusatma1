"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Status = "ready" | "playing" | "won" | "lost";
const BOSS: Record<number, string> = { 10: "Ölümsüz Boss", 20: "Güçlü Takipçi", 30: "Alev Devi", 40: "Son Muhafız" };
const START_SECONDS = 15 * 60;

function clock(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Home() {
  const [players, setPlayers] = useState(1);
  const [floor, setFloor] = useState(1);
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [status, setStatus] = useState<Status>("ready");
  const [stamina, setStamina] = useState(100);
  const [message, setMessage] = useState("Kuleye girmek için hazır ol.");
  const [closet, setCloset] = useState(false);
  const [night, setNight] = useState(true);
  const [bossCleared, setBossCleared] = useState<number[]>([]);

  const start = useCallback(() => {
    setFloor(1); setSeconds(START_SECONDS); setStamina(100); setCloset(false);
    setBossCleared([]); setNight(true); setStatus("playing");
    setMessage("Başladınız! Zombilerden kaçın ve yukarı tırmanın.");
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => setSeconds(s => {
      if (s <= 1) { setStatus("lost"); setMessage("Süre bitti! Kule sizi yuttu."); return 0; }
      if (s === 450) setNight(false);
      return s - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const climb = useCallback(() => {
    if (status !== "playing") return;
    if (floor >= 40) { setCloset(true); setMessage("Gizli dolap bulundu! 41. kata ışınlanma kapısı açıldı."); return; }
    const next = floor + 1;
    setFloor(next);
    if (BOSS[next] && !bossCleared.includes(next)) {
      setMessage(`${BOSS[next]} karşınızda! Engellerden sıyrılıp geçidi açın.`);
    } else if (next % 7 === 0) {
      setMessage("Bomba tuzağı! Zamanlamayı iyi ayarla.");
    } else if (next % 5 === 0) {
      setMessage("Su jeti yükseltiyor! Bir sonraki kata hızla çık.");
      setStamina(v => Math.min(100, v + 15));
    } else {
      setMessage(`${next}. kattasınız. Zombiler yaklaşıyor — devam edin!`);
    }
    if (next === 40 && !bossCleared.includes(40)) setMessage("Son Muhafız son geçidi koruyor! Onu aş ve kuleyi bitir.");
    if (next >= 40 && bossCleared.includes(40)) { setStatus("won"); setMessage("Kule tamamlandı! Gizli dolap için tekrar etkileşime geçebilirsin."); }
  }, [status, floor, bossCleared]);

  const jump = useCallback(() => {
    if (status !== "playing") return;
    if (stamina < 10) { setMessage("Nefeslenmen gerek! Enerji dolana kadar bekle."); return; }
    setStamina(v => Math.max(0, v - 10));
    setMessage("Atlayış başarılı! Engeli aştın.");
  }, [status, stamina]);

  const boost = useCallback(() => {
    if (status !== "playing") return;
    setStamina(v => Math.min(100, v + 25));
    setMessage("Su jeti seni yukarı fırlattı! +25 enerji.");
  }, [status]);

  const encounter = useMemo(() => BOSS[floor], [floor]);
  useEffect(() => {
    if (status !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
      if (e.code === "ArrowRight" || e.code === "KeyW") climb();
      if (e.code === "KeyE") boost();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, jump, climb, boost]);

  const markBoss = () => {
    if (!encounter || status !== "playing") return;
    setBossCleared(v => v.includes(floor) ? v : [...v, floor]);
    setStamina(v => Math.max(0, v - 15));
    setMessage(`${encounter} geçildi! Merdiven yolu açıldı.`);
    if (floor === 40) { setStatus("won"); setMessage("Tebrikler! 40 katlı kuleyi tamamladınız. Gizli dolapta 41. kata geçiş var."); }
  };

  return <main className={`page ${night ? "night" : "dawn"}`}>
    <header className="topbar"><a className="brand" href="#" aria-label="Kuşatma ana sayfa"><span className="brand-mark">K</span><span>KUŞATMA<small>PARKUR PROTOKOLÜ</small></span></a><div className="top-status"><span className="live-dot"/>{status === "playing" ? "OPERASYON AKTİF" : "KULE OPERASYONU"}</div></header>
    <section className="hero"><div className="eyebrow"><span/> VSN // HAYATTA KALMA BİRİMİ</div><h1>KUŞATMA <em>PARKUR</em></h1><p className="subtitle">40 kat. 15 dakika. Tek hedef: zirve.</p><p className="intro">Zombilerle dolu dairesel merdiven kulesinde yüksel. Tuzakları aş, takımını koru ve gün doğmadan çıkışa ulaş.</p></section>
    <section className="game-layout">
      <div className="tower-panel"><div className="panel-head"><span>KULE DURUMU</span><span className="floor-count">KAT <b>{floor.toString().padStart(2,"0")}</b><i>/ 40</i></span></div>
        <div className="tower-scene"><div className="moon"/><div className="tower-glow"/><div className="tower-shape">{Array.from({length:9},(_,i)=><div key={i} className={`tower-ring ring-${i}`}><span/></div>)}<div className="player-token">▲</div><div className="zombie zombie-one">☠</div><div className="zombie zombie-two">☠</div></div><div className="scene-label"><span className="scene-dot"/>{night ? "GECE VARDİYASI" : "ŞAFAK YAKLAŞIYOR"}</div><div className="scene-floor">KAT {floor.toString().padStart(2,"0")}</div></div>
        <div className="tower-footer"><div><small>SONRAKİ HEDEF</small><strong>{floor >= 40 ? "GİZLİ DOLAP / 41" : BOSS[floor + 1] || `Kat ${floor + 1}`}</strong></div><div className="progress-track"><span style={{width:`${Math.min(100,floor/40*100)}%`}}/></div><b>{Math.round(floor/40*100)}%</b></div>
      </div>
      <aside className="control-panel"><div className="panel-head"><span>GÖREV KONTROLÜ</span><span className={`status-pill ${status}`}>{status === "playing" ? "CANLI" : status === "won" ? "TAMAMLANDI" : status === "lost" ? "BAŞARISIZ" : "BEKLEMEDE"}</span></div>
        <div className="timer-block"><small>KALAN SÜRE</small><div className={`timer ${seconds < 60 ? "urgent" : ""}`}>{clock(seconds)}</div><div className="timer-track"><span style={{width:`${seconds/START_SECONDS*100}%`}}/></div></div>
        <div className="stat-row"><div><small>EKİP</small><strong>{players} / 3 <span>OYUNCU</span></strong></div><div><small>ENERJİ</small><strong>{stamina}<span> / 100</span></strong></div></div><div className="energy-track"><span style={{width:`${stamina}%`}}/></div>
        <div className="team-picker"><label>EKİP BOYUTU</label><div className="player-options">{[1,2,3].map(n=><button key={n} className={players===n?"selected":""} onClick={()=>status!=="playing"&&setPlayers(n)} disabled={status==="playing"}>{n} {n===1?"OYUNCU":"OYUNCU"}</button>)}</div><p>Birlikte ilerleyin. Oyuncular birbirine hasar veremez.</p></div>
        <div className="message-box"><span className="message-icon">!</span><p>{message}</p></div>
        {status !== "playing" ? <button className="primary-btn" onClick={start}>{status === "ready" ? "▶  OPERASYONU BAŞLAT" : "↻  YENİDEN DENE"}</button> : <div className="action-grid"><button onClick={jump} className="action-btn"><b>↑</b><span>ZIPLA<small>SPACE</small></span></button><button onClick={climb} className="action-btn"><b>↗</b><span>YUKARI ÇIK<small>W / →</small></span></button><button onClick={boost} className="action-btn"><b>≋</b><span>SU JETİ<small>E / +ENERJİ</small></span></button>{encounter && !bossCleared.includes(floor) && <button onClick={markBoss} className="action-btn boss-action"><b>⚔</b><span>BOSS GEÇİDİ<small>ETKİLEŞİM</small></span></button>}{closet && <button onClick={()=>{setStatus("won");setMessage("Gizli dolaptan 41. kata ışınlandın!");}} className="action-btn boss-action"><b>⌁</b><span>IŞINLAN<small>41. KAT</small></span></button>}</div>}
        <p className="controls-note">KLAVYE: SPACE zıpla · W/→ tırman · E su jeti</p>
      </aside>
    </section>
    <section className="milestones"><div className="section-title"><span>01 / TEHLİKE SEVİYELERİ</span><h2>Kule seni bekliyor.</h2></div><div className="boss-grid">{[{n:10,name:"Ölümsüz Boss",desc:"İlk büyük sınav",icon:"☠"},{n:20,name:"Güçlü Takipçi",desc:"Kaçış yok",icon:"⌁"},{n:30,name:"Alev Devi",desc:"Ateş çemberi",icon:"♨"},{n:40,name:"Son Muhafız",desc:"Son kapı",icon:"⚔"}].map(b=><div key={b.n} className={`boss-card ${floor>=b.n?"reached":""}`}><div className="boss-icon">{b.icon}</div><div><small>{b.n}. KAT</small><strong>{b.name}</strong><p>{b.desc}</p></div><span className="boss-state">{bossCleared.includes(b.n)?"✓":floor>=b.n?"!":"LOCK"}</span></div>)}</div></section>
    <section className="rules"><div><span className="rule-symbol">◷</span><div><strong>15 DAKİKA</strong><p>Süre dolmadan zirveye ulaş.</p></div></div><div><span className="rule-symbol">♧</span><div><strong>TAKIM OYUNU</strong><p>1–3 kişi birlikte tırmanın.</p></div></div><div><span className="rule-symbol">⌁</span><div><strong>GİZLİ GEÇİT</strong><p>40. kattan sonra dolabı ara.</p></div></div></section>
    <footer><span>KUŞATMA // PARKUR PROTOTİPİ</span><span>HAYATTA KAL. YÜKSEL. KUŞAT.</span></footer>
  </main>;
}
