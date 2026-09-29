/* Modelo da apresentação gerada (HTML autônomo).
 * Marcadores substituídos pelo gerador: __TEMA__, __TITULO__, __CONFIG__, __IMAGENS__.
 * Pode ser editado à vontade — é um template literal: evite crases (`) e ${ no conteúdo. */
window.MODELO_APRESENTACAO = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="__TEMA__">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>__TITULO__</title>
<style>
:root{
  --display:"Bahnschrift SemiCondensed","Bahnschrift","Barlow Condensed","Arial Narrow",sans-serif;
  --body:"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;
  --mono:Consolas,"Cascadia Mono","IBM Plex Mono",Menlo,monospace;
}
:root,[data-theme="azul"]{
  color-scheme:dark;
  --ground:#0A1233;--panel:#111B45;--panel2:#17235A;--line:#27367A;--ink:#E9EDF9;--muted:#97A3CB;
  --accent:#2BC4B4;--on-accent:#04201d;--route:#F4B740;--on-route:#2a1d00;--warn:#FF7A6B;
  --stage:#060B22;--glow:#1c2f86;--shadow:rgba(0,0,0,.5);
}
[data-theme="branco"]{
  color-scheme:light;
  --ground:#F3F5FA;--panel:#FFFFFF;--panel2:#EAEFF8;--line:#CDD5E7;--ink:#0E1838;--muted:#55607F;
  --accent:#0B8F83;--on-accent:#FFFFFF;--route:#B7791F;--on-route:#FFFFFF;--warn:#C0362C;
  --stage:#DDE3EF;--glow:#D6E0F7;--shadow:rgba(14,24,56,.18);
}
[data-theme="escuro"]{
  color-scheme:dark;
  --ground:#0F1013;--panel:#17191D;--panel2:#1F2227;--line:#30343B;--ink:#ECEDEF;--muted:#9BA1AB;
  --accent:#4FD1C5;--on-accent:#06201D;--route:#F2B84B;--on-route:#241800;--warn:#FF7A6B;
  --stage:#070809;--glow:#1b1e24;--shadow:rgba(0,0,0,.6);
}
.sem-rota .mode.route,.sem-rota .legend,.sem-rota .badge{display:none!important}
.strip button.r{outline:2px solid var(--route);outline-offset:-2px}
.slist .rt{color:var(--route);font-size:10px;margin-left:auto;padding-left:8px;white-space:nowrap}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{height:100%}
body{margin:0;background:var(--ground);color:var(--ink);font:15px/1.5 var(--body)}
button{font:inherit;color:inherit;cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}

#home{min-height:100%;padding-inline:clamp(16px,4vw,56px);padding-block:clamp(20px,4vh,44px);
  background:radial-gradient(1200px 500px at 85% -10%,var(--glow) 0%,transparent 60%),var(--ground)}
.wrap{max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
.masthead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
h1{font-family:var(--display);font-weight:700;font-size:clamp(36px,5.6vw,64px);line-height:.98;margin:6px 0 10px;text-wrap:balance}
.org{color:var(--muted);max-width:70ch;margin:0}
.meta{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.chip{font-family:var(--mono);font-size:12px;padding:6px 10px;border:1px solid var(--line);border-radius:4px;color:var(--muted);white-space:nowrap}
.chip b{color:var(--ink);font-weight:600}
.tbtn{padding:6px 10px;border:1px solid var(--line);border-radius:4px;background:transparent;font-family:var(--mono);font-size:12px;color:var(--muted)}
.tbtn:hover{border-color:var(--accent);color:var(--ink)}

.modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.mode{display:flex;flex-direction:column;gap:6px;text-align:left;padding:18px 20px;border-radius:8px;border:1px solid var(--line);background:var(--panel);transition:transform .15s,border-color .15s}
.mode:hover{transform:translateY(-2px);border-color:var(--accent)}
.mode .k{font-family:var(--display);font-size:26px;font-weight:600;display:flex;align-items:center;gap:10px}
.mode .d{color:var(--muted);font-size:14px}
.mode .n{font-family:var(--mono);font-size:12px;color:var(--accent);display:flex;gap:14px;flex-wrap:wrap}
.mode .n .time{font-weight:600}
.mode.route{border-color:color-mix(in srgb,var(--route) 55%,var(--line));background:linear-gradient(135deg,color-mix(in srgb,var(--route) 12%,var(--panel)),var(--panel))}
.mode.route:hover{border-color:var(--route)}
.mode.route .n{color:var(--route)}
.arrow{margin-left:auto;font-family:var(--mono);font-size:20px;opacity:.7}

.tl-head{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px}
.tl-head h2{font-family:var(--display);font-weight:600;font-size:22px;letter-spacing:.06em;text-transform:uppercase;margin:0}
.legend{display:flex;gap:16px;font-size:13px;color:var(--muted);flex-wrap:wrap}
.legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:-1px}
.tl-scroll{overflow-x:auto;padding-bottom:6px}
.tl{position:relative;display:grid;grid-template-columns:repeat(var(--n),minmax(128px,1fr));column-gap:10px;min-width:calc(var(--n) * 138px);padding-top:6px}
.tl::before{content:"";position:absolute;left:0;right:0;top:34px;height:2px;background:var(--line)}
.node{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:0 4px 4px;background:none;border:0;text-align:center}
.node .num{font-family:var(--mono);font-size:11px;color:var(--muted);height:16px}
.node .dot{width:18px;height:18px;border-radius:50%;background:var(--ground);border:2px solid var(--muted);transition:transform .15s,background .15s;z-index:1}
.node.in-route .dot{border-color:var(--route);box-shadow:0 0 0 4px color-mix(in srgb,var(--route) 18%,transparent)}
.node .lbl{font-family:var(--display);font-size:16px;font-weight:600;line-height:1.1;text-wrap:balance;color:var(--muted);overflow-wrap:break-word;hyphens:auto}
.node .rng{font-family:var(--mono);font-size:11px;line-height:1.35;color:var(--muted);opacity:.8}
.node:hover .lbl,.node.sel .lbl{color:var(--ink)}
.node:hover .dot{transform:scale(1.15)}
.node.sel .dot{background:var(--accent);border-color:var(--accent);transform:scale(1.25)}
.node.in-route.sel .dot{background:var(--route);border-color:var(--route)}

.detail{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:22px;padding:20px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}
.thumbbox{border-radius:6px;overflow:hidden;background:#fff;aspect-ratio:16/9;max-width:100%;cursor:zoom-in;border:1px solid var(--line)}
.thumbbox img{width:100%;height:100%;object-fit:contain;display:block}
.strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.strip button{flex:0 0 auto;width:96px;padding:0;border:1px solid var(--line);border-radius:3px;overflow:hidden;background:#fff}
.strip button:hover{border-color:var(--accent)}
.strip img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
.dinfo{display:flex;flex-direction:column;gap:12px;min-width:0}
.dinfo .tag{font-family:var(--mono);font-size:12px;color:var(--accent);letter-spacing:.08em;text-transform:uppercase}
.dinfo h3{font-family:var(--display);font-size:34px;font-weight:700;line-height:1;margin:0;text-wrap:balance}
.dinfo p{margin:0;color:var(--muted)}
.dinfo .destaque{color:var(--ink);border-left:2px solid var(--accent);padding:6px 0 6px 12px;background:var(--panel2);border-radius:0 4px 4px 0}
.badge{align-self:flex-start;font-family:var(--mono);font-size:11px;padding:3px 8px;border-radius:3px;background:color-mix(in srgb,var(--route) 20%,transparent);color:var(--route);letter-spacing:.06em;text-transform:uppercase}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}
.stat{padding:10px 12px;border-left:2px solid var(--accent);background:var(--panel2);border-radius:0 4px 4px 0}
.stat.r{border-left-color:var(--route)}
.stat .v{font-family:var(--display);font-size:24px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.1}
.stat .l{font-size:12px;color:var(--muted)}
.slist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;border-top:1px solid var(--line)}
.slist button{width:100%;display:flex;gap:10px;text-align:left;background:none;border:0;border-bottom:1px solid var(--line);padding:7px 2px;font-size:13.5px;color:var(--muted)}
.slist button:hover{color:var(--ink)}
.slist .sn{font-family:var(--mono);font-size:11px;min-width:3.2em;padding-top:2px;color:var(--accent)}
.go{align-self:flex-start;padding:10px 16px;border-radius:6px;border:0;background:var(--accent);color:var(--on-accent);font-weight:600}
.foot{font-size:12px;color:var(--muted);font-family:var(--mono);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
kbd{font-family:var(--mono);font-size:11px;border:1px solid var(--line);border-bottom-width:2px;border-radius:3px;padding:1px 5px}

#viewer{position:fixed;inset:0;display:flex;flex-direction:column;background:var(--stage);z-index:10}
.vbar{display:flex;align-items:center;gap:12px;padding:10px 16px;padding-top:calc(10px + env(safe-area-inset-top,0px));border-bottom:1px solid var(--line);background:var(--ground);flex-wrap:wrap}
.ibtn{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font-size:13px}
.ibtn:hover{border-color:var(--accent)}
.vtitle{display:flex;flex-direction:column;min-width:0;flex:1}
.vtitle .t{font-family:var(--display);font-size:20px;font-weight:600;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vtitle .m{font-family:var(--mono);font-size:11px;color:var(--muted)}
#viewer.route .vtitle .m{color:var(--route)}
.timer{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12.5px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font-variant-numeric:tabular-nums}
.timer .pace{padding:2px 7px;border-radius:3px;font-size:11px;background:var(--panel2);color:var(--muted)}
.timer .pace.ok{color:var(--accent)}
.timer .pace.late{background:color-mix(in srgb,var(--warn) 18%,transparent);color:var(--warn)}
.timer .pace.early{color:var(--route)}
.timer.paused{opacity:.6}
.counter{font-family:var(--mono);font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.chips{display:flex;gap:6px;overflow-x:auto;padding:8px 16px;border-bottom:1px solid var(--line);background:var(--ground)}
.tchip{flex:0 0 auto;font-size:12px;padding:5px 10px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--muted);white-space:nowrap}
.tchip.on{background:var(--accent);border-color:var(--accent);color:var(--on-accent);font-weight:600}
#viewer.route .tchip.on{background:var(--route);border-color:var(--route);color:var(--on-route)}
.stage{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:14px}
.stage img{max-width:100%;max-height:100%;object-fit:contain;background:#fff;border-radius:4px;box-shadow:0 20px 60px var(--shadow)}
.nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:64px;border-radius:6px;border:1px solid var(--line);background:color-mix(in srgb,var(--ground) 80%,transparent);font-size:22px;opacity:.55;transition:opacity .15s}
.nav:hover{opacity:1}
.nav.prev{left:10px}.nav.next{right:10px}
.nav:disabled{opacity:.15;cursor:default}
.progress{height:4px;background:var(--panel2)}
.progress div{height:4px;background:var(--accent);transition:width .2s}
#viewer.route .progress div{background:var(--route)}

@media (max-width:760px){
  .detail{grid-template-columns:1fr}
  .tl{grid-template-columns:1fr;min-width:0}
  .tl::before{left:24px;right:auto;top:0;bottom:0;width:2px;height:auto}
  .node{display:grid;grid-template-columns:48px 1fr;align-items:center;justify-items:start;text-align:left;padding:6px 0;column-gap:6px}
  .node .num{display:none}
  .node .dot{grid-row:1/3;justify-self:center}
  .nav{display:none}
}
</style>
</head>
<body>
<main id="home">
  <div class="wrap">
    <header class="masthead">
      <div>
        <div class="eyebrow">Apresentação interativa</div>
        <h1 id="hTitulo"></h1>
        <p class="org" id="hSub"></p>
      </div>
      <div class="meta" id="hMeta"></div>
    </header>

    <section class="modes" aria-label="Modo de apresentação">
      <button class="mode" id="btnFull" type="button">
        <span class="k">Apresentação completa <span class="arrow">→</span></span>
        <span class="d">Todos os tópicos, na ordem original.</span>
        <span class="n" id="nFull"></span>
      </button>
      <button class="mode route" id="btnRoute" type="button">
        <span class="k">Rota sugerida <span class="arrow">→</span></span>
        <span class="d" id="dRoute"></span>
        <span class="n" id="nRoute"></span>
      </button>
    </section>

    <section aria-label="Linha do tempo da pauta" style="display:flex;flex-direction:column;gap:14px">
      <div class="tl-head">
        <h2>Pauta</h2>
        <div class="legend"><span><i style="border:2px solid var(--route)"></i>Na rota sugerida</span><span><i style="border:2px solid var(--muted)"></i>Somente na completa</span></div>
      </div>
      <div class="tl-scroll"><div class="tl" id="tl"></div></div>
      <article class="detail" id="detail"></article>
    </section>

    <p class="foot"><span>Navegação: <kbd>←</kbd> <kbd>→</kbd> slides · <kbd>F</kbd> tela cheia · <kbd>T</kbd> tema · <kbd>P</kbd> pausa cronômetro · <kbd>Esc</kbd> pauta</span><span id="gerado"></span></p>
  </div>
</main>

<section id="viewer" hidden aria-label="Apresentação">
  <div class="vbar">
    <button class="ibtn" id="back" type="button" title="Voltar à pauta (Esc)">☰ Pauta</button>
    <div class="vtitle"><span class="t" id="vt"></span><span class="m" id="vm"></span></div>
    <button class="timer" id="timer" type="button" title="Pausar/retomar (P)"><span id="tClock">00:00</span><span id="tEst"></span><span class="pace" id="tPace"></span></button>
    <span class="counter" id="vc"></span>
    <button class="ibtn" id="fs" type="button" title="Tela cheia (F)">⛶</button>
  </div>
  <div class="chips" id="chips"></div>
  <div class="stage" id="stage">
    <button class="nav prev" id="prev" type="button" aria-label="Slide anterior">‹</button>
    <img id="vimg" alt="">
    <button class="nav next" id="next" type="button" aria-label="Próximo slide">›</button>
  </div>
  <div class="progress"><div id="bar"></div></div>
</section>

<script>
var CFG = __CONFIG__;
var IMG = __IMAGENS__;
(function(){
  var $=function(id){return document.getElementById(id);};
  var T=CFG.topicos, N=CFG.paginas;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function fmtMin(m){ if(m>=10) return Math.round(m)+' min'; return (Math.round(m*10)/10).toString().replace('.',',')+' min'; }
  function pad(n){return (n<10?'0':'')+n;}

  var frame={}; CFG.moldura.forEach(function(m){frame[m.p]=m.nome;});
  var topicOfPage={}; T.forEach(function(t){t.paginas.forEach(function(p){topicOfPage[p]=t;});});
  var TEM_ROTA = CFG.modo==='sugerida' && CFG.rota && CFG.rota.length>0;
  var inRoute={}; if(TEM_ROTA) CFG.rota.forEach(function(p){inRoute[p]=true;});
  var FULL=[],ROUTE=[];
  if(CFG.ordem&&CFG.ordem.length===N) FULL=CFG.ordem.slice(); else for(var p=1;p<=N;p++) FULL.push(p);
  FULL.forEach(function(p){ if(inRoute[p]) ROUTE.push(p); });
  T.forEach(function(t){ t.rotaPags=t.paginas.filter(function(p){return inRoute[p];}); t.rota=t.rotaPags.length>0; });
  var routeT=T.filter(function(t){return t.rota;});
  var perFull=CFG.tempoCompleta/FULL.length, perRoute=TEM_ROTA?CFG.tempoSugerida/Math.max(1,ROUTE.length):0;
  if(!TEM_ROTA) document.body.classList.add('sem-rota');

  /* cabeçalho */
  document.title=CFG.titulo;
  $('hTitulo').textContent=CFG.titulo;
  $('hSub').textContent=CFG.subtitulo||'';
  var meta='';
  if(CFG.data) meta+='<span class="chip">Reunião <b>'+esc(CFG.data)+'</b></span>';
  meta+='<span class="chip"><b>'+T.length+'</b> tópicos · <b>'+N+'</b> slides</span>';
  meta+='<button class="tbtn" id="tema" type="button" title="Alternar tema (T)">◐ Tema</button>';
  $('hMeta').innerHTML=meta;
  $('gerado').textContent='Gerado em '+CFG.geradoEm+(CFG.arquivo?' a partir de '+CFG.arquivo:'');
  $('nFull').innerHTML='<span class="time">⏱ ≈ '+CFG.tempoCompleta+' min</span><span>'+T.length+' tópicos · '+FULL.length+' slides</span>';
  if(TEM_ROTA){
    $('nRoute').innerHTML='<span class="time">⏱ ≈ '+CFG.tempoSugerida+' min</span><span>'+routeT.length+' tópicos · '+ROUTE.length+' slides</span>';
    $('dRoute').textContent=ROUTE.length+' slides escolhidos: '+routeT.map(function(t){return t.nome;}).join(' · ')+'.';
  }

  /* linha do tempo */
  var tl=$('tl'), selected=0; tl.style.setProperty('--n',T.length);
  T.forEach(function(t,i){
    var b=document.createElement('button'); b.type='button'; b.className='node'+(t.rota?' in-route':'');
    b.innerHTML='<span class="num">'+pad(i+1)+'</span><span class="dot"></span><span class="lbl">'+esc(t.nome)+'</span><span class="rng">'+t.paginas.length+(t.paginas.length>1?' slides':' slide')+'<br>≈ '+fmtMin(t.paginas.length*perFull)+'</span>';
    b.onclick=function(){select(i);};
    b.ondblclick=function(){var m=modoPara(t);openAt(m,inicioDe(t,m),true);};
    tl.appendChild(b);
  });
  function modoPara(t){return TEM_ROTA&&t.rota&&curMode==='route'?'route':'full';}
  function inicioDe(t,m){return m==='route'?t.rotaPags[0]:t.paginas[0];}
  function select(i){
    if(!T.length) return;
    selected=i; var t=T[i];
    [].forEach.call(tl.children,function(n,k){n.classList.toggle('sel',k===i);});
    var html='<div style="display:flex;flex-direction:column;gap:10px;min-width:0">'
      +'<div class="thumbbox" id="tb" title="Abrir este slide"><img src="'+IMG[t.paginas[0]-1]+'" alt="Primeiro slide de '+esc(t.nome)+'"></div>';
    if(t.paginas.length>1){ html+='<div class="strip">'+t.paginas.map(function(p){return '<button type="button" data-p="'+p+'"'+(inRoute[p]?' class="r"':'')+' title="Página '+p+(inRoute[p]?' · na rota sugerida':'')+'"><img src="'+IMG[p-1]+'" alt="Página '+p+'"></button>';}).join('')+'</div>'; }
    html+='</div><div class="dinfo"><span class="tag">Tópico '+pad(i+1)+' de '+pad(T.length)+'</span><h3>'+esc(t.nome)+'</h3>';
    if(t.rota) html+='<span class="badge">Na rota sugerida'+(t.rotaPags.length<t.paginas.length?' · '+t.rotaPags.length+' de '+t.paginas.length+' slides':'')+'</span>';
    if(t.destaque) html+='<p class="destaque">'+esc(t.destaque)+'</p>';
    html+='<div class="stats"><div class="stat"><div class="v">'+t.paginas.length+'</div><div class="l">'+(t.paginas.length>1?'slides':'slide')+'</div></div>'
      +'<div class="stat"><div class="v">≈ '+fmtMin(t.paginas.length*perFull)+'</div><div class="l">na rota completa</div></div>'
      +(t.rota?'<div class="stat r"><div class="v">≈ '+fmtMin(t.rotaPags.length*perRoute)+'</div><div class="l">na rota sugerida</div></div>':'')+'</div>';
    html+='<ul class="slist">'+t.slides.map(function(s){return '<li><button type="button" data-p="'+s.p+'"><span class="sn">#'+s.n+'</span><span>'+esc(s.t)+'</span>'+(inRoute[s.p]?'<span class="rt">● rota</span>':'')+'</button></li>';}).join('')+'</ul>';
    html+='<button class="go" type="button" id="go">Apresentar a partir daqui →</button></div>';
    var d=$('detail'); d.innerHTML=html;
    $('go').onclick=function(){var m=modoPara(t);openAt(m,inicioDe(t,m),true);};
    $('tb').onclick=function(){var m=modoPara(t);openAt(m,inicioDe(t,m),true);};
    [].forEach.call(d.querySelectorAll('[data-p]'),function(b){b.onclick=function(){var pg=+b.getAttribute('data-p');openAt(modoPara(t)==='route'&&inRoute[pg]?'route':'full',pg,true);};});
  }

  /* cronômetro */
  var tStart=null, tAcc=0, tRunning=false, startPos=0;
  function elapsed(){return tAcc+(tRunning?Date.now()-tStart:0);}
  function timerReset(){tAcc=0;tStart=Date.now();tRunning=true;startPos=pos;$('timer').classList.remove('paused');}
  function timerToggle(){ if(tRunning){tAcc+=Date.now()-tStart;tRunning=false;} else {tStart=Date.now();tRunning=true;} $('timer').classList.toggle('paused',!tRunning); tick(); }
  function tick(){
    if($('viewer').hidden) return;
    var ms=elapsed(), s=Math.floor(ms/1000);
    $('tClock').textContent=pad(Math.floor(s/60))+':'+pad(s%60);
    var total=curMode==='route'?CFG.tempoSugerida:CFG.tempoCompleta, per=curMode==='route'?perRoute:perFull;
    $('tEst').textContent='/ '+total+' min';
    var diff=ms/60000-(pos-startPos)*per, pace=$('tPace');
    if(!tRunning){pace.textContent='pausado';pace.className='pace';}
    else if(ms<20000){pace.textContent='no ritmo';pace.className='pace ok';}
    else if(diff>per*1.5){pace.textContent='atrasado ≈ '+fmtMin(diff);pace.className='pace late';}
    else if(diff<-per*1.5){pace.textContent='adiantado ≈ '+fmtMin(-diff);pace.className='pace early';}
    else {pace.textContent='no ritmo';pace.className='pace ok';}
  }
  setInterval(tick,1000);

  /* visualizador */
  var curMode='full', seq=FULL, pos=0;
  function openAt(mode,page,resetTimer){
    if(mode==='route'&&(!TEM_ROTA||!inRoute[page])) mode='full';
    var changed=mode!==curMode; curMode=mode; seq=mode==='route'?ROUTE:FULL;
    pos=Math.max(0,seq.indexOf(page));
    $('home').hidden=true; $('viewer').hidden=false;
    $('viewer').classList.toggle('route',mode==='route');
    buildChips(); render();
    if(resetTimer||changed||tStart===null) timerReset();
    tick();
  }
  function buildChips(){
    var list=T.filter(function(t){return curMode==='full'||t.rota;});
    $('chips').innerHTML=list.map(function(t){return '<button type="button" class="tchip" data-id="'+t.id+'">'+esc(t.nome)+'</button>';}).join('');
    [].forEach.call($('chips').querySelectorAll('.tchip'),function(c){c.onclick=function(){
      var t=T.filter(function(x){return x.id===c.getAttribute('data-id');})[0]; pos=seq.indexOf(inicioDe(t,curMode)); render();};});
  }
  function render(){
    var p=seq[pos], t=topicOfPage[p];
    $('vimg').src=IMG[p-1]; $('vimg').alt=(t?t.nome:(frame[p]||'Slide'))+' — página '+p;
    $('vt').textContent=t?t.nome:(frame[p]||'');
    $('vm').textContent=(curMode==='route'?'Rota sugerida · '+ROUTE.length+' slides':'Apresentação completa')+' · página '+p;
    $('vc').textContent=(pos+1)+' / '+seq.length;
    $('bar').style.width=((pos+1)/seq.length*100)+'%';
    $('prev').disabled=pos===0; $('next').disabled=pos===seq.length-1;
    [].forEach.call($('chips').querySelectorAll('.tchip'),function(c){var on=t&&c.getAttribute('data-id')===t.id;c.classList.toggle('on',!!on);if(on&&c.scrollIntoView)c.scrollIntoView({block:'nearest',inline:'nearest'});});
    [seq[pos+1],seq[pos-1]].forEach(function(n){if(n){var i=new Image();i.src=IMG[n-1];}});
    tick();
  }
  function step(d){var n=pos+d;if(n>=0&&n<seq.length){pos=n;render();}}
  function home(){
    if(document.fullscreenElement&&document.exitFullscreen) document.exitFullscreen().catch(function(){});
    $('viewer').hidden=true; $('home').hidden=false;
    var t=topicOfPage[seq[pos]]; if(t) select(T.indexOf(t));
  }
  function toggleFs(){var v=$('viewer');if(document.fullscreenElement){document.exitFullscreen().catch(function(){});}else if(v.requestFullscreen){v.requestFullscreen().catch(function(){});}}
  function toggleTema(){var ordem=['azul','branco','escuro'],r=document.documentElement,i=ordem.indexOf(r.getAttribute('data-theme'));r.setAttribute('data-theme',ordem[(i+1)%ordem.length]);}

  $('prev').onclick=function(){step(-1);}; $('next').onclick=function(){step(1);}; $('back').onclick=home;
  $('btnFull').onclick=function(){openAt('full',FULL[0],true);};
  $('btnRoute').onclick=function(){if(TEM_ROTA)openAt('route',ROUTE[0],true);};
  $('fs').onclick=toggleFs; $('timer').onclick=timerToggle; $('tema').onclick=toggleTema;
  $('stage').addEventListener('click',function(e){if(e.target.id==='vimg'){var r=e.target.getBoundingClientRect();step(e.clientX-r.left<r.width*0.3?-1:1);}});
  document.addEventListener('keydown',function(e){
    var k=e.key;
    if(k==='t'||k==='T'){toggleTema();return;}
    if($('viewer').hidden){
      if(k==='ArrowRight') select(Math.min(T.length-1,selected+1));
      else if(k==='ArrowLeft') select(Math.max(0,selected-1));
      else if(k==='Enter'&&T.length) {var m=modoPara(T[selected]);openAt(m,inicioDe(T[selected],m),true);}
      return;
    }
    if(k==='ArrowRight'||k==='PageDown'||k===' '){e.preventDefault();step(1);}
    else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();step(-1);}
    else if(k==='Home'){pos=0;render();}
    else if(k==='End'){pos=seq.length-1;render();}
    else if(k==='Escape'&&!document.fullscreenElement){home();}
    else if(k==='f'||k==='F'){toggleFs();}
    else if(k==='p'||k==='P'){timerToggle();}
  });
  var sx=null;
  $('stage').addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  $('stage').addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)step(dx<0?1:-1);sx=null;});
  select(0);
})();
</script>
</body>
</html>`;
