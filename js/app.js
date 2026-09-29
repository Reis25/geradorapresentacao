/* ==========================================================================
 * Gerador de Apresentação Interativa — assistente (etapas)
 * ========================================================================== */
(function () {
  'use strict';

  /* ---------------- Configuração ---------------- */
  var CONFIG = {
    larguraImagem: 1920,     // px das imagens geradas a partir do PDF
    qualidadeJpg: 0.82,
    // tópicos pré-marcados quando o usuário escolhe "Rota sugerida"
    rotaPadrao: ['DEC e FEC', 'Diagnóstico DEC', 'Conjuntos', 'Improcedentes']
  };

  var ETAPAS = ['arquivos', 'pauta', 'formato', 'ordem', 'tempo', 'tema', 'gerar'];
  var L = window.Leitura;

  var S = {
    pdf: null, pptx: null, assinatura: '',
    slides: [], ocultos: [], aviso: '', capa: null,
    destaques: {}, modo: null, rota: {}, rotaTocada: false, ordem: [],
    tema: 'azul', etapa: 0, etapaMax: 0, urlHtml: null
  };

  /* ---------------- Utilitários ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function mb(n) { return (n / 1048576).toFixed(1).replace('.', ',') + ' MB'; }
  function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }
  function chave(nome) { return L.normalizar(nome).trim(); }
  function ehMoldura(nome) { var k = chave(nome); return k === chave(L.ABERTURA) || k === chave(L.ENCERRAMENTO); }
  function slug(s) {
    var t = L.normalizar(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return (t || 'apresentacao').slice(0, 60);
  }
  function fmtMin(m) { return m >= 10 ? Math.round(m) + ' min' : (Math.round(m * 10) / 10).toString().replace('.', ',') + ' min'; }

  /* ---------------- Etapas / navegação ---------------- */
  var secoes = {};
  [].forEach.call(document.querySelectorAll('.etapa'), function (s) { secoes[s.getAttribute('data-etapa')] = s; });

  function desenharPassos() {
    var nav = $('passos'); nav.innerHTML = '';
    ETAPAS.forEach(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'passo' + (i === S.etapa ? ' atual' : (i <= S.etapaMax ? ' feito' : ''));
      b.innerHTML = '<span class="n">' + (i + 1) + '</span>' + esc(secoes[e].getAttribute('data-rotulo'));
      b.disabled = i > S.etapaMax || i === S.etapa;
      if (i === S.etapa) b.setAttribute('aria-current', 'step');
      b.onclick = function () { irPara(i); };
      nav.appendChild(b);
    });
  }

  function irPara(i) {
    S.etapa = i;
    S.etapaMax = Math.max(S.etapaMax, i);
    ETAPAS.forEach(function (e, k) { secoes[e].hidden = k !== i; });
    var e = ETAPAS[i];
    if (e === 'pauta') desenharResumoTopicos();
    if (e === 'formato') entrarFormato();
    if (e === 'ordem') desenharOrdem();
    if (e === 'tempo') entrarTempo();
    if (e === 'tema') marcarTema();
    if (e === 'gerar') entrarGerar();
    $('btnVoltar').style.visibility = i === 0 ? 'hidden' : 'visible';
    $('btnAvancar').hidden = e === 'gerar';
    $('btnAvancar').textContent = e === 'arquivos' ? (S.slides.length && assinatura() === S.assinatura ? 'Próximo →' : 'Ler arquivos →') : 'Próximo →';
    $('navInfo').textContent = 'Etapa ' + (i + 1) + ' de ' + ETAPAS.length + ' · ' + secoes[e].getAttribute('data-rotulo');
    desenharPassos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function mostrarErro(id, msg) { var e = $(id); e.textContent = msg; e.hidden = !msg; }

  function avancar() {
    var e = ETAPAS[S.etapa];
    if (e === 'arquivos') return processarArquivos();
    if (e === 'pauta') {
      if (!$('fTitulo').value.trim()) { $('fTitulo').focus(); $('fTitulo').setCustomValidity('Informe o título'); $('fTitulo').reportValidity(); return; }
      $('fTitulo').setCustomValidity('');
    }
    if (e === 'formato') {
      if (!S.modo) { alertaInline('Escolha um dos dois formatos.'); return; }
      if (S.modo === 'sugerida' && contarRota().slides === 0) { alertaInline('Marque pelo menos um slide para a rota sugerida.'); return; }
    }
    if (e === 'tempo') {
      if (!(+$('fTempoC').value > 0)) { $('fTempoC').focus(); return; }
      if (S.modo === 'sugerida' && !(+$('fTempoS').value > 0)) { $('fTempoS').focus(); return; }
    }
    irPara(S.etapa + 1);
  }

  function alertaInline(msg) {
    $('navInfo').textContent = msg;
    $('navInfo').style.color = 'var(--perigo)';
    setTimeout(function () { $('navInfo').style.color = ''; }, 2600);
  }

  $('btnAvancar').onclick = avancar;
  $('btnVoltar').onclick = function () { if (S.etapa > 0) irPara(S.etapa - 1); };

  /* ---------------- Etapa 1: arquivos ---------------- */
  function assinatura() {
    var f = function (x) { return x ? x.name + ':' + x.size + ':' + x.lastModified : '-'; };
    return f(S.pdf) + '|' + f(S.pptx);
  }

  function definirArquivo(f) {
    if (/\.pdf$/i.test(f.name)) S.pdf = f;
    else if (/\.pptx$/i.test(f.name)) S.pptx = f;
    else return false;
    atualizarNomes();
    return true;
  }

  function atualizarNomes() {
    $('nomePdf').textContent = S.pdf ? S.pdf.name + ' · ' + mb(S.pdf.size) : '';
    $('nomePptx').textContent = S.pptx ? S.pptx.name + ' · ' + mb(S.pptx.size) : '';
    $('dropPdf').classList.toggle('ok', !!S.pdf);
    $('dropPptx').classList.toggle('ok', !!S.pptx);
    $('btnAvancar').textContent = S.slides.length && assinatura() === S.assinatura ? 'Próximo →' : 'Ler arquivos →';
  }

  ['dropPdf', 'dropPptx'].forEach(function (id) {
    var z = $(id);
    ['dragenter', 'dragover'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add('sobre'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.remove('sobre'); }); });
    z.addEventListener('drop', function (e) {
      var ok = false;
      [].forEach.call(e.dataTransfer.files, function (f) { ok = definirArquivo(f) || ok; });
      if (!ok) mostrarErro('erroArquivos', 'Use um arquivo .pdf e, se quiser, o .pptx.');
      else mostrarErro('erroArquivos', '');
    });
  });
  $('inPdf').addEventListener('change', function () { if (this.files[0]) { S.pdf = this.files[0]; atualizarNomes(); } });
  $('inPptx').addEventListener('change', function () { if (this.files[0]) { S.pptx = this.files[0]; atualizarNomes(); } });
  // soltar arquivos fora dos quadros não deve abrir o PDF no navegador
  ['dragover', 'drop'].forEach(function (ev) { window.addEventListener(ev, function (e) { e.preventDefault(); }); });

  function progresso(msg, sub, frac) {
    $('progresso').hidden = false;
    $('progMsg').textContent = msg; $('progSub').textContent = sub || '';
    $('progBarra').style.width = Math.round(frac * 100) + '%';
  }

  function processarArquivos() {
    mostrarErro('erroArquivos', '');
    if (!S.pdf) { mostrarErro('erroArquivos', 'Escolha o PDF da apresentação. No PowerPoint: Arquivo › Salvar como › PDF.'); return; }
    if (S.slides.length && assinatura() === S.assinatura) { irPara(1); return; }
    var btn = $('btnAvancar'); btn.disabled = true;
    S.slides.forEach(function (s) { URL.revokeObjectURL(s.url); });
    var slidesPptx = null;
    var inicio = S.pptx ? (progresso('Lendo o PPTX…', S.pptx.name, 0.03), L.lerPptx(S.pptx)) : Promise.resolve(null);
    inicio.then(function (sp) {
      slidesPptx = sp;
      progresso('Convertendo os slides…', 'abrindo o PDF', 0.06);
      return L.lerPdf(S.pdf, { largura: CONFIG.larguraImagem, qualidade: CONFIG.qualidadeJpg, comTexto: !sp }, function (n, t) {
        progresso('Convertendo os slides…', 'página ' + n + ' de ' + t, 0.06 + 0.94 * (n - 1) / t);
      });
    }).then(function (paginas) {
      if (!paginas.length) throw new Error('O PDF não tem páginas.');
      var p = L.montarPauta(paginas, slidesPptx);
      S.slides = p.slides; S.ocultos = p.ocultos; S.aviso = p.aviso; S.capa = p.capa;
      S.assinatura = assinatura();
      S.rota = {}; S.rotaTocada = false; S.destaques = {}; S.ordem = [];
      $('fTitulo').value = p.capa.titulo || S.pdf.name.replace(/\.pdf$/i, '');
      $('fSub').value = p.capa.subtitulo || '';
      $('fData').value = p.capa.data || '';
      progresso('Pronto', plural(S.slides.length, 'slide', 'slides') + ' convertidos', 1);
      montarPauta();
      irPara(1);
    }).catch(function (e) {
      console.error(e);
      $('progresso').hidden = true;
      mostrarErro('erroArquivos', 'Não foi possível ler os arquivos: ' + (e && e.message ? e.message : e));
    }).then(function () { btn.disabled = false; });
  }

  /* ---------------- Etapa 2: pauta ---------------- */
  function montarPauta() {
    var partes = [plural(S.slides.length, 'slide convertido', 'slides convertidos') + ' de ' + S.pdf.name];
    if (S.pptx) partes.push('títulos lidos de ' + S.pptx.name);
    else partes.push('títulos lidos do texto do PDF (envie o .pptx para mais precisão)');
    if (S.ocultos.length) partes.push('slides ocultos ignorados: ' + S.ocultos.join(', '));
    $('resumoLeitura').textContent = partes.join(' · ') + '. Ajuste o que precisar.';
    $('avisoLeitura').textContent = S.aviso; $('avisoLeitura').hidden = !S.aviso;

    var g = $('gradeSlides'); g.innerHTML = '';
    S.slides.forEach(function (s, i) {
      var d = document.createElement('div');
      d.className = 'sl';
      var tt = s.titulo || s.sobre || '(sem título)';
      d.innerHTML = '<img loading="lazy" alt="" src="' + s.url + '">' +
        '<span class="n">Slide ' + s.slide + ' · página ' + s.pagina + '</span>' +
        '<span class="t" title="' + esc(tt) + '">' + esc(tt) + '</span>' +
        '<input type="text" list="listaTopicos" aria-label="Tópico do slide ' + s.slide + '" value="' + esc(s.topico) + '">';
      d.querySelector('input').addEventListener('input', function () { s.topico = this.value; desenharResumoTopicos(); });
      g.appendChild(d);
    });
    desenharResumoTopicos();
  }

  function topicoEfetivo(i) {
    for (var k = i; k >= 0; k--) { var v = (S.slides[k].topico || '').trim(); if (v) return v; }
    return L.ABERTURA;
  }

  /* Tópicos na ordem da primeira aparição + slides de moldura */
  function calcularTopicos() {
    var lista = [], mapa = {}, moldura = [];
    S.slides.forEach(function (s, i) {
      var nome = topicoEfetivo(i), k = chave(nome);
      s.topicoFinal = nome;
      if (ehMoldura(nome)) { moldura.push(s.pagina); return; }
      if (!mapa[k]) { mapa[k] = { nome: nome, paginas: [] }; lista.push(mapa[k]); }
      mapa[k].paginas.push(s.pagina);
    });
    return { lista: lista, moldura: moldura };
  }

  function desenharResumoTopicos() {
    var t = calcularTopicos(), box = $('listaResumo');
    [].forEach.call($('gradeSlides').children, function (el, i) { el.classList.toggle('moldura', ehMoldura(S.slides[i].topicoFinal)); });
    // preserva destaques digitados
    [].forEach.call(box.querySelectorAll('input'), function (inp) { S.destaques[inp.getAttribute('data-k')] = inp.value; });
    box.innerHTML = t.lista.map(function (tp) {
      var k = chave(tp.nome);
      return '<div class="lt"><div class="lt-cab"><b>' + esc(tp.nome) + '</b><span>' + plural(tp.paginas.length, 'slide', 'slides') + '</span></div>' +
        '<input type="text" data-k="' + esc(k) + '" placeholder="Destaque (opcional)" value="' + esc(S.destaques[k] || '') + '"></div>';
    }).join('') || '<p class="sub">Nenhum tópico ainda.</p>';
    [].forEach.call(box.querySelectorAll('input'), function (inp) {
      inp.addEventListener('input', function () { S.destaques[inp.getAttribute('data-k')] = inp.value; });
    });
    $('listaTopicos').innerHTML = t.lista.map(function (tp) { return '<option value="' + esc(tp.nome) + '">'; }).join('') +
      '<option value="' + L.ABERTURA + '"><option value="' + L.ENCERRAMENTO + '">';
  }

  /* ---------------- Etapa 3: formato + rota ---------------- */
  [].forEach.call(document.querySelectorAll('input[name=modo]'), function (r) {
    r.addEventListener('change', function () { S.modo = r.value; atualizarFormato(); });
  });

  function rotaPadrao() {
    var alvo = {}; CONFIG.rotaPadrao.forEach(function (n) { alvo[chave(n)] = true; });
    S.rota = {};
    S.slides.forEach(function (s) {
      if (ehMoldura(s.topicoFinal) || alvo[chave(s.topicoFinal)]) S.rota[s.pagina] = true;
    });
  }

  function contarRota() {
    var n = 0, tops = {};
    S.slides.forEach(function (s) {
      if (!S.rota[s.pagina]) return;
      n++;
      if (!ehMoldura(s.topicoFinal)) tops[chave(s.topicoFinal)] = 1;
    });
    return { slides: n, topicos: Object.keys(tops).length };
  }

  function entrarFormato() {
    var t = calcularTopicos();
    $('nCompleta').textContent = plural(S.slides.length, 'slide', 'slides') + ' · ' + plural(t.lista.length, 'tópico', 'tópicos');
    if (!S.rotaTocada && !Object.keys(S.rota).length) rotaPadrao();
    // descarta páginas que não existem mais
    Object.keys(S.rota).forEach(function (p) { if (p > S.slides.length) delete S.rota[p]; });
    desenharSeletor();
    atualizarFormato();
  }

  function atualizarFormato() {
    [].forEach.call(document.querySelectorAll('.escolha'), function (l) {
      l.classList.toggle('sel', l.querySelector('input').checked);
    });
    $('blocoRota').hidden = S.modo !== 'sugerida';
    var c = contarRota();
    $('nSugerida').textContent = S.modo === 'sugerida' ? plural(c.slides, 'slide escolhido', 'slides escolhidos') + ' · ' + plural(c.topicos, 'tópico', 'tópicos') : 'Você escolhe os slides';
    $('contadorRota').innerHTML = '<b>' + c.slides + '</b> de ' + S.slides.length + ' slides · ' + plural(c.topicos, 'tópico', 'tópicos');
  }

  function desenharSeletor() {
    var t = calcularTopicos(), grupos = [];
    var abert = S.slides.filter(function (s) { return chave(s.topicoFinal) === chave(L.ABERTURA); }).map(function (s) { return s.pagina; });
    var encer = S.slides.filter(function (s) { return chave(s.topicoFinal) === chave(L.ENCERRAMENTO); }).map(function (s) { return s.pagina; });
    if (abert.length) grupos.push({ nome: L.ABERTURA, paginas: abert });
    t.lista.forEach(function (tp) { grupos.push(tp); });
    if (encer.length) grupos.push({ nome: L.ENCERRAMENTO, paginas: encer });

    var box = $('seletorRota'); box.innerHTML = '';
    grupos.forEach(function (gp) {
      var g = document.createElement('div'); g.className = 'grupo';
      var cab = document.createElement('div'); cab.className = 'grupo-cab';
      cab.innerHTML = '<div><b>' + esc(gp.nome) + '</b><span class="qt"></span></div>';
      var tg = document.createElement('button'); tg.type = 'button'; tg.className = 'btn sec pq';
      cab.appendChild(tg);
      var grade = document.createElement('div'); grade.className = 'grupo-slides';
      function sync() {
        var n = gp.paginas.filter(function (p) { return S.rota[p]; }).length;
        cab.querySelector('.qt').textContent = n + ' de ' + gp.paginas.length;
        tg.textContent = n === gp.paginas.length ? 'Desmarcar tópico' : 'Marcar tópico';
        [].forEach.call(grade.children, function (b) {
          var on = !!S.rota[+b.getAttribute('data-p')];
          b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
        });
        atualizarFormato();
      }
      tg.onclick = function () {
        var todos = gp.paginas.every(function (p) { return S.rota[p]; });
        gp.paginas.forEach(function (p) { if (todos) delete S.rota[p]; else S.rota[p] = true; });
        S.rotaTocada = true; sync();
      };
      gp.paginas.forEach(function (p) {
        var s = S.slides[p - 1];
        var b = document.createElement('button'); b.type = 'button'; b.className = 'pick'; b.setAttribute('data-p', p);
        b.innerHTML = '<img loading="lazy" alt="" src="' + s.url + '"><span class="num">Slide ' + s.slide + '</span><span>' + esc(s.titulo || s.sobre || '(sem título)') + '</span>';
        b.onclick = function () { if (S.rota[p]) delete S.rota[p]; else S.rota[p] = true; S.rotaTocada = true; sync(); };
        grade.appendChild(b);
      });
      g.appendChild(cab); g.appendChild(grade); box.appendChild(g);
      sync();
    });
  }

  $('rotaTodos').onclick = function () { S.slides.forEach(function (s) { S.rota[s.pagina] = true; }); S.rotaTocada = true; desenharSeletor(); };
  $('rotaNenhum').onclick = function () { S.rota = {}; S.rotaTocada = true; desenharSeletor(); };
  $('rotaPadrao').onclick = function () { rotaPadrao(); S.rotaTocada = true; desenharSeletor(); };

  /* ---------------- Etapa 4: ordem dos tópicos ---------------- */
  /* Tópicos na ordem escolhida em S.ordem; tópicos novos entram na posição natural (fim) */
  function topicosOrdenados() {
    var t = calcularTopicos(), mapa = {}, lista = [];
    t.lista.forEach(function (tp) { mapa[chave(tp.nome)] = tp; });
    S.ordem.forEach(function (k) { if (mapa[k]) { lista.push(mapa[k]); delete mapa[k]; } });
    t.lista.forEach(function (tp) { if (mapa[chave(tp.nome)]) lista.push(tp); });
    S.ordem = lista.map(function (tp) { return chave(tp.nome); });
    return { lista: lista, moldura: t.moldura };
  }

  /* Sequência de páginas: Abertura, tópicos na ordem escolhida, Encerramento */
  function sequenciaPaginas(t) {
    var abert = [], encer = [], meio = [];
    t.moldura.forEach(function (p) {
      (chave(S.slides[p - 1].topicoFinal) === chave(L.ENCERRAMENTO) ? encer : abert).push(p);
    });
    t.lista.forEach(function (tp) { meio = meio.concat(tp.paginas); });
    return abert.concat(meio, encer);
  }

  function moverTopico(de, para) {
    if (para < 0 || para >= S.ordem.length || de === para) return;
    var k = S.ordem.splice(de, 1)[0];
    S.ordem.splice(para, 0, k);
  }

  function desenharOrdem(foco) {
    var t = topicosOrdenados(), box = $('listaOrdem'), arrastando = null;
    box.innerHTML = '';
    t.lista.forEach(function (tp, i) {
      var li = document.createElement('li');
      li.className = 'ord'; li.draggable = true;
      var naRota = S.modo === 'sugerida' && tp.paginas.some(function (p) { return S.rota[p]; });
      var miniaturas = tp.paginas.slice(0, 4).map(function (p) { return '<img loading="lazy" alt="" src="' + S.slides[p - 1].url + '">'; }).join('') +
        (tp.paginas.length > 4 ? '<span class="mais">+' + (tp.paginas.length - 4) + '</span>' : '');
      li.innerHTML = '<span class="ord-alca" aria-hidden="true">⋮⋮</span>' +
        '<span class="ord-n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
        '<div class="ord-info"><b>' + esc(tp.nome) + '</b><span>' + plural(tp.paginas.length, 'slide', 'slides') +
        (naRota ? ' · <em>na rota sugerida</em>' : '') + '</span></div>' +
        '<div class="ord-mini">' + miniaturas + '</div>' +
        '<div class="ord-bts">' +
        '<button type="button" class="btn sec pq" data-d="-1" aria-label="Subir ' + esc(tp.nome) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" class="btn sec pq" data-d="1" aria-label="Descer ' + esc(tp.nome) + '"' + (i === t.lista.length - 1 ? ' disabled' : '') + '>↓</button>' +
        '</div>';
      [].forEach.call(li.querySelectorAll('[data-d]'), function (b) {
        b.onclick = function () {
          var d = +b.getAttribute('data-d');
          moverTopico(i, i + d);
          desenharOrdem({ i: i + d, d: d });
        };
      });
      li.addEventListener('dragstart', function (e) {
        arrastando = i; li.classList.add('arrastando');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', String(i)); } catch (_) {}
      });
      li.addEventListener('dragend', function () {
        arrastando = null; li.classList.remove('arrastando');
        [].forEach.call(box.children, function (el) { el.classList.remove('alvo'); });
      });
      li.addEventListener('dragover', function (e) {
        if (arrastando === null) return;
        e.preventDefault(); e.dataTransfer.dropEffect = 'move';
        [].forEach.call(box.children, function (el) { el.classList.toggle('alvo', el === li && arrastando !== i); });
      });
      li.addEventListener('drop', function (e) {
        e.preventDefault();
        if (arrastando === null) return;
        moverTopico(arrastando, i);
        arrastando = null;
        desenharOrdem();
      });
      box.appendChild(li);
    });
    if (!t.lista.length) box.innerHTML = '<p class="sub">Nenhum tópico na pauta.</p>';
    if (foco) {
      var li = box.children[foco.i], b = li && (li.querySelector('[data-d="' + foco.d + '"]:not(:disabled)') || li.querySelector('[data-d]:not(:disabled)'));
      if (b) b.focus();
    }
  }

  $('ordemOriginal').onclick = function () { S.ordem = []; desenharOrdem(); };

  /* ---------------- Etapa 5: tempo ---------------- */
  function entrarTempo() {
    $('campoTempoS').hidden = S.modo !== 'sugerida';
    atualizarRitmo();
  }
  function atualizarRitmo() {
    var tc = +$('fTempoC').value, ts = +$('fTempoS').value, nr = contarRota().slides;
    $('ritmoC').textContent = tc > 0 ? '≈ ' + fmtMin(tc / S.slides.length) + ' por slide · ' + S.slides.length + ' slides' : '';
    $('ritmoS').textContent = ts > 0 && nr ? '≈ ' + fmtMin(ts / nr) + ' por slide · ' + nr + ' slides' : '';
  }
  $('fTempoC').addEventListener('input', atualizarRitmo);
  $('fTempoS').addEventListener('input', atualizarRitmo);

  /* ---------------- Etapa 6: tema ---------------- */
  function marcarTema() {
    [].forEach.call(document.querySelectorAll('.tema'), function (l) {
      var inp = l.querySelector('input');
      inp.checked = inp.value === S.tema;
      l.classList.toggle('sel', inp.checked);
    });
  }
  [].forEach.call(document.querySelectorAll('input[name=tema]'), function (r) {
    r.addEventListener('change', function () { S.tema = r.value; marcarTema(); });
  });

  /* ---------------- Etapa 7: gerar ---------------- */
  var NOMES_TEMA = { azul: 'Azul', branco: 'Branco', escuro: 'Dark mode' };

  function entrarGerar() {
    var t = topicosOrdenados(), c = contarRota();
    var linhas = [
      ['Título', $('fTitulo').value.trim()],
      ['Slides', S.slides.length + ' · ' + plural(t.lista.length, 'tópico', 'tópicos') + ' na linha do tempo'],
      ['Ordem', t.lista.map(function (tp) { return tp.nome; }).join(' › ')],
      ['Formato', S.modo === 'sugerida' ? 'Completa + rota sugerida (' + plural(c.slides, 'slide', 'slides') + ')' : 'Apresentação completa'],
      ['Tempo', 'Completa ≈ ' + $('fTempoC').value + ' min' + (S.modo === 'sugerida' ? ' · Rota sugerida ≈ ' + $('fTempoS').value + ' min' : '')],
      ['Tema', NOMES_TEMA[S.tema]]
    ];
    $('resumoFinal').innerHTML = linhas.map(function (l) { return '<dt>' + esc(l[0]) + '</dt><dd>' + esc(l[1]) + '</dd>'; }).join('');
    $('pronto').hidden = true;
  }

  function paraDataUrl(blob) {
    return new Promise(function (ok, erro) {
      var r = new FileReader();
      r.onload = function () { ok(r.result); };
      r.onerror = function () { erro(r.error); };
      r.readAsDataURL(blob);
    });
  }

  function jsonScript(v) {
    return JSON.stringify(v).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  function montarConfig() {
    var t = topicosOrdenados();
    var agora = new Date(), dois = function (n) { return (n < 10 ? '0' : '') + n; };
    var topicos = t.lista.map(function (tp, i) {
      return {
        id: 't' + (i + 1), nome: tp.nome, paginas: tp.paginas,
        slides: tp.paginas.map(function (p) { var s = S.slides[p - 1]; return { p: p, n: s.slide, t: s.titulo || s.sobre || ('Slide ' + s.slide) }; }),
        destaque: (S.destaques[chave(tp.nome)] || '').trim()
      };
    });
    var rota = S.modo === 'sugerida' ? S.slides.filter(function (s) { return S.rota[s.pagina]; }).map(function (s) { return s.pagina; }) : [];
    return {
      titulo: $('fTitulo').value.trim(), subtitulo: $('fSub').value.trim(), data: $('fData').value.trim(),
      tema: S.tema, modo: S.modo, rota: rota,
      tempoCompleta: +$('fTempoC').value, tempoSugerida: S.modo === 'sugerida' ? +$('fTempoS').value : 0,
      paginas: S.slides.length, topicos: topicos, ordem: sequenciaPaginas(t),
      moldura: t.moldura.map(function (p) { return { p: p, nome: S.slides[p - 1].topicoFinal }; }),
      arquivo: (S.pptx || S.pdf).name,
      geradoEm: dois(agora.getDate()) + '/' + dois(agora.getMonth() + 1) + '/' + agora.getFullYear() + ' ' + dois(agora.getHours()) + ':' + dois(agora.getMinutes())
    };
  }

  $('btnGerar').onclick = function () {
    var btn = this; btn.disabled = true; $('gerando').hidden = false; $('pronto').hidden = true;
    var cfg = montarConfig();
    Promise.all(S.slides.map(function (s) { return paraDataUrl(s.blob); })).then(function (imgs) {
      var tpl = window.MODELO_APRESENTACAO
        .replace('__TEMA__', function () { return cfg.tema; })
        .replace('__TITULO__', function () { return esc(cfg.titulo); })
        .replace('__CONFIG__', function () { return jsonScript(cfg); });
      var partes = tpl.split('__IMAGENS__');
      var blob = new Blob([partes[0], '[', imgs.map(function (u) { return '"' + u + '"'; }).join(','), ']', partes.slice(1).join('__IMAGENS__')], { type: 'text/html;charset=utf-8' });
      if (S.urlHtml) URL.revokeObjectURL(S.urlHtml);
      S.urlHtml = URL.createObjectURL(blob);
      var nome = slug(cfg.titulo) + '.html';
      $('btnAbrir').href = S.urlHtml;
      $('btnBaixar').href = S.urlHtml;
      $('btnBaixar').setAttribute('download', nome);
      $('prontoNome').textContent = nome;
      $('prontoTam').textContent = '· ' + mb(blob.size);
      $('pronto').hidden = false;
    }).catch(function (e) {
      console.error(e);
      alert('Não foi possível gerar o arquivo: ' + (e && e.message ? e.message : e));
    }).then(function () { btn.disabled = false; $('gerando').hidden = true; });
  };

  $('btnNovo').onclick = function () { location.reload(); };

  /* ---------------- início ---------------- */
  irPara(0);
})();
