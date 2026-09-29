/* ==========================================================================
 * Leitura dos arquivos (roda 100% no navegador)
 *  - PPTX (JSZip): títulos dos slides, slides ocultos, dados da capa
 *  - PDF  (pdf.js): uma imagem JPEG por página (+ títulos, se não houver PPTX)
 * ========================================================================== */
(function (global) {
  'use strict';

  var NS = {
    p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
    a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
    r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    rel: 'http://schemas.openxmlformats.org/package/2006/relationships'
  };

  /* Regras de sugestão de tópico: a primeira que casar vence.
   * O texto é comparado em MAIÚSCULAS e sem acento. Edite à vontade. */
  var REGRAS_TOPICO = [
    [/DIAGNOSTICO DEC/, 'Diagnóstico DEC'],
    [/IMPROCEDENT/, 'Improcedentes'],
    [/CONJUNTO|CONSUMO DEC/, 'Conjuntos'],
    [/MULTA|PENALIDADE/, 'Multas e Penalidades'],
    [/NR AUX/, 'NR Auxiliares'],
    [/FORMACAO DE COLETIVA|INTERRUPCAO 24/, 'Coletiva e Interrupção 24h'],
    [/PRIMEIRA MANOBRA/, 'Primeira Manobra'],
    [/CONFIRMACAO DE CIRCUITO/, 'Confirmação de Circuito'],
    [/EQUIPAMENTO/, 'Equipamentos Indisponíveis'],
    [/DESLIGAMENTO|PROGRAMADA X URGENTE/, 'Desligamentos Programados'],
    [/\bTMA|TEMPO MEDIO DE ATENDIMENTO/, 'TMA'],
    [/\bDEC\b|\bFEC\b|REGIONAIS/, 'DEC e FEC']
  ];

  var ABERTURA = 'Abertura', ENCERRAMENTO = 'Encerramento';

  function normalizar(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[–—]/g, '-').toUpperCase();
  }

  // rótulos de classificação que o Office imprime no PDF (ex.: "INTERNAL")
  var ROTULOS = /^(internal|interno|uso interno|confidencial|confidential|restrito|restricted|p[uú]blico|public|general|geral)$/i;

  function ignorarTexto(t) {
    return /^(data d|atualizado|destaques|principais destaques|\d)/i.test(t) || ROTULOS.test(t.trim());
  }

  function dividirTitulo(par) {
    if (par.length >= 2) return { titulo: par.slice(1).join(' · '), sobre: par[0] };
    return { titulo: par[0] || '', sobre: '' };
  }

  function sugerirTopico(titulo, sobre) {
    var n = normalizar(titulo + ' ' + sobre);
    for (var i = 0; i < REGRAS_TOPICO.length; i++) {
      if (REGRAS_TOPICO[i][0].test(n)) return REGRAS_TOPICO[i][1];
    }
    var base = titulo || sobre;
    return base.split(/\s+[-–·\/]\s+/)[0].trim();
  }

  /* ---------------------------- PPTX ---------------------------- */
  function filho(el, ns, nome) {
    if (!el) return null;
    for (var i = 0; i < el.children.length; i++) {
      var c = el.children[i];
      if (c.namespaceURI === ns && c.localName === nome) return c;
    }
    return null;
  }

  function xml(texto) {
    return new DOMParser().parseFromString(texto, 'application/xml');
  }

  function caixasDeTexto(doc) {
    var caixas = [];
    var sps = doc.getElementsByTagNameNS(NS.p, 'sp');
    for (var i = 0; i < sps.length; i++) {
      var sp = sps[i], par = [];
      var ps = sp.getElementsByTagNameNS(NS.a, 'p');
      for (var j = 0; j < ps.length; j++) {
        var ts = ps[j].getElementsByTagNameNS(NS.a, 't'), txt = '';
        for (var k = 0; k < ts.length; k++) txt += ts[k].textContent;
        txt = txt.replace(/\s+/g, ' ').trim();
        if (txt) par.push(txt);
      }
      if (!par.length) continue;
      var off = filho(filho(filho(sp, NS.p, 'spPr'), NS.a, 'xfrm'), NS.a, 'off');
      var ph = filho(filho(filho(sp, NS.p, 'nvSpPr'), NS.p, 'nvPr'), NS.p, 'ph');
      caixas.push({ y: off ? parseInt(off.getAttribute('y') || '0', 10) : 0, tipo: ph ? (ph.getAttribute('type') || '') : '', paragrafos: par });
    }
    return caixas;
  }

  function tituloDoSlide(caixas, altura) {
    for (var i = 0; i < caixas.length; i++) {
      if (caixas[i].tipo === 'title' || caixas[i].tipo === 'ctrTitle') return dividirTitulo(caixas[i].paragrafos);
    }
    var melhor = null, tam = 0;
    caixas.forEach(function (c) {
      if (c.y > altura * 0.14) return;
      var txt = c.paragrafos.join(' ');
      if (txt.length < 4 || ignorarTexto(txt)) return;
      if (txt.length > tam) { melhor = c; tam = txt.length; }
    });
    return melhor ? dividirTitulo(melhor.paragrafos) : { titulo: '', sobre: '' };
  }

  function dadosDaCapa(caixas) {
    var capa = { titulo: '', subtitulo: '', data: '' };
    caixas.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (c) {
      var txt = c.paragrafos.join(' · ');
      var m = txt.match(/\d{1,2}\s+de\s+[A-Za-zÀ-ú]+\s+de\s+\d{4}|\d{2}\/\d{2}\/\d{4}/);
      if (!capa.data && m) { capa.data = m[0]; return; }
      if (/^atualizado$/i.test(txt.trim()) || ROTULOS.test(txt.trim())) return;
      if (!capa.titulo) capa.titulo = txt;
      else if (!capa.subtitulo) capa.subtitulo = txt;
    });
    return capa;
  }

  function lerPptx(arquivo) {
    return JSZip.loadAsync(arquivo).then(function (zip) {
      var pPres = zip.file('ppt/presentation.xml'), pRels = zip.file('ppt/_rels/presentation.xml.rels');
      if (!pPres || !pRels) throw new Error('O arquivo .pptx não tem a estrutura esperada (presentation.xml ausente).');
      return Promise.all([pPres.async('string'), pRels.async('string')]).then(function (r) {
        var pres = xml(r[0]), rels = xml(r[1]);
        var sz = pres.getElementsByTagNameNS(NS.p, 'sldSz')[0];
        var altura = sz ? parseInt(sz.getAttribute('cy'), 10) : 6858000;
        var alvos = {};
        var rs = rels.getElementsByTagNameNS(NS.rel, 'Relationship');
        for (var i = 0; i < rs.length; i++) alvos[rs[i].getAttribute('Id')] = rs[i].getAttribute('Target');
        var ids = pres.getElementsByTagNameNS(NS.p, 'sldId'), caminhos = [];
        for (var j = 0; j < ids.length; j++) {
          var alvo = alvos[ids[j].getAttributeNS(NS.r, 'id')];
          if (!alvo) continue;
          alvo = alvo.replace(/^\/+/, '');
          caminhos.push(alvo.indexOf('ppt/') === 0 ? alvo : 'ppt/' + alvo);
        }
        return Promise.all(caminhos.map(function (c) {
          var f = zip.file(c);
          return f ? f.async('string') : Promise.resolve('');
        })).then(function (textos) {
          var slides = textos.map(function (t, k) {
            var s = { n: k + 1, oculto: false, titulo: '', sobre: '', caixas: [] };
            if (t) {
              var d = xml(t);
              s.oculto = d.documentElement.getAttribute('show') === '0';
              s.caixas = caixasDeTexto(d);
              var tt = tituloDoSlide(s.caixas, altura);
              s.titulo = tt.titulo; s.sobre = tt.sobre;
            }
            return s;
          });
          if (!slides.length) throw new Error('Nenhum slide encontrado no .pptx.');
          return slides;
        });
      });
    });
  }

  /* ----------------------------- PDF ----------------------------- */
  function configurarPdfjs() {
    if (!global.pdfjsLib) throw new Error('A biblioteca pdf.js não carregou (vendor/pdfjs).');
    if (!global.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.js';
    }
  }

  /* Título aproximado a partir do texto do PDF (usado quando não há PPTX):
   * linhas na faixa superior da página, de cima para baixo. */
  function tituloDoPdf(conteudo, altura) {
    var linhas = {};
    conteudo.items.forEach(function (it) {
      var y = it.transform[5];
      if (y < altura * 0.86 || !it.str.trim()) return;
      var chave = Math.round(y / 4);
      (linhas[chave] = linhas[chave] || []).push(it);
    });
    var ordem = Object.keys(linhas).map(Number).sort(function (a, b) { return b - a; });
    var par = [];
    ordem.forEach(function (k) {
      var txt = linhas[k].sort(function (a, b) { return a.transform[4] - b.transform[4]; })
        .map(function (i) { return i.str; }).join(' ').replace(/\s+/g, ' ').trim();
      if (txt.length >= 3 && !ignorarTexto(txt)) par.push(txt);
    });
    return par.length ? dividirTitulo(par.slice(0, 3)) : { titulo: '', sobre: '' };
  }

  /* Capa sem PPTX: junta linhas vizinhas com o mesmo tamanho de fonte
   * (ex.: título quebrado em duas linhas) e devolve blocos de cima para baixo. */
  function textoDaCapaPdf(conteudo) {
    var linhas = {};
    conteudo.items.forEach(function (it) {
      if (!it.str.trim()) return;
      var k = Math.round(it.transform[5] / 4);
      var l = linhas[k] = linhas[k] || { y: it.transform[5], tam: 0, itens: [] };
      l.itens.push(it);
      l.tam = Math.max(l.tam, Math.abs(it.transform[3]) || it.height || 0);
    });
    var ord = Object.keys(linhas).map(function (k) { return linhas[k]; }).sort(function (a, b) { return b.y - a.y; });
    var blocos = [];
    ord.forEach(function (l) {
      var txt = l.itens.sort(function (a, b) { return a.transform[4] - b.transform[4]; })
        .map(function (i) { return i.str; }).join(' ').replace(/\s+/g, ' ').trim();
      var ult = blocos[blocos.length - 1];
      if (ult && Math.abs(ult.tam - l.tam) < 0.6 && (ult.yFim - l.y) < l.tam * 1.7) {
        ult.texto += ' ' + txt; ult.yFim = l.y;
      } else {
        blocos.push({ texto: txt, tam: l.tam, yFim: l.y });
      }
    });
    return blocos.map(function (bl, i) { return { y: i, tipo: '', paragrafos: [bl.texto] }; });
  }

  function lerPdf(arquivo, opcoes, progresso) {
    configurarPdfjs();
    var largura = opcoes.largura || 1920, qualidade = opcoes.qualidade || 0.82, comTexto = !!opcoes.comTexto;
    return arquivo.arrayBuffer().then(function (buf) {
      return global.pdfjsLib.getDocument({ data: buf }).promise;
    }).then(function (doc) {
      var paginas = [], canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
      var total = doc.numPages;
      function proxima(n) {
        if (n > total) { doc.destroy(); return paginas; }
        progresso(n, total);
        return doc.getPage(n).then(function (pag) {
          var v1 = pag.getViewport({ scale: 1 }), vp = pag.getViewport({ scale: largura / v1.width });
          canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          return pag.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
            return new Promise(function (ok) { canvas.toBlob(ok, 'image/jpeg', qualidade); });
          }).then(function (blob) {
            var p = { blob: blob, url: URL.createObjectURL(blob), titulo: '', sobre: '', capa: null };
            if (!comTexto) { pag.cleanup(); paginas.push(p); return; }
            return pag.getTextContent().then(function (tc) {
              var t = tituloDoPdf(tc, v1.height);
              p.titulo = t.titulo; p.sobre = t.sobre;
              if (n === 1) p.capa = dadosDaCapa(textoDaCapaPdf(tc));
              pag.cleanup(); paginas.push(p);
            });
          });
        }).then(function () { return proxima(n + 1); });
      }
      return proxima(1);
    });
  }

  /* Relaciona as páginas do PDF com os slides do PPTX (o PowerPoint não
   * exporta slides ocultos) e sugere o tópico de cada página. */
  function montarPauta(paginas, slidesPptx) {
    var aviso = '', base = null, ocultos = [];
    if (slidesPptx) {
      var visiveis = slidesPptx.filter(function (s) { return !s.oculto; });
      ocultos = slidesPptx.filter(function (s) { return s.oculto; }).map(function (s) { return s.n; });
      if (paginas.length === visiveis.length) base = visiveis;
      else if (paginas.length === slidesPptx.length) base = slidesPptx;
      else {
        base = visiveis.slice(0, paginas.length);
        aviso = 'O PDF tem ' + paginas.length + ' páginas e o PPTX tem ' + visiveis.length +
          ' slides visíveis. Confira se os dois arquivos são da mesma versão da apresentação.';
      }
    }
    var lista = [];
    paginas.forEach(function (pg, i) {
      var s = base ? (base[i] || { n: i + 1, titulo: '', sobre: '' }) : { n: i + 1, titulo: pg.titulo, sobre: pg.sobre };
      var topico;
      if (i === 0) topico = ABERTURA;
      else if (i === paginas.length - 1 && !s.titulo && !s.sobre) topico = ENCERRAMENTO;
      else topico = sugerirTopico(s.titulo, s.sobre) || (lista.length ? lista[lista.length - 1].topico : 'Tópico ' + (i + 1));
      lista.push({ pagina: i + 1, slide: s.n, titulo: s.titulo, sobre: s.sobre, topico: topico, url: pg.url, blob: pg.blob });
    });
    var capa = slidesPptx ? dadosDaCapa(slidesPptx[0].caixas) : (paginas[0] && paginas[0].capa) || { titulo: '', subtitulo: '', data: '' };
    return { slides: lista, ocultos: ocultos, aviso: aviso, capa: capa };
  }

  global.Leitura = {
    lerPptx: lerPptx,
    lerPdf: lerPdf,
    montarPauta: montarPauta,
    normalizar: normalizar,
    ABERTURA: ABERTURA,
    ENCERRAMENTO: ENCERRAMENTO
  };
})(window);
