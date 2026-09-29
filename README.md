# Gerador de Apresentação Interativa

Transforma um PowerPoint em uma **apresentação HTML interativa**. O resultado tem:

- uma linha do tempo com os tópicos da pauta,
- uma apresentação completa e, se você quiser, uma **rota sugerida** mais curta,
- um cronômetro que compara o tempo gasto com o tempo planejado,
- três temas: **Azul**, **Branco** e **Dark mode**.

Tudo roda no navegador. Os arquivos **não saem do seu computador** e não é preciso servidor, PHP nem instalação.

## Como usar

1. No PowerPoint, salve a apresentação em PDF: **Arquivo › Salvar como › PDF**.
2. Abra o gerador e siga as 6 etapas:
   1. **Arquivos**: envie o PDF, que é obrigatório. O `.pptx` é opcional, mas deixa os títulos mais precisos e identifica os slides ocultos.
   2. **Pauta**: confira o título e o tópico de cada slide. Slides com o mesmo nome formam um tópico.
   3. **Formato**: escolha entre **Apresentação completa** e **Rota sugerida**. Na rota sugerida, clique nos slides que vão compor a rota.
   4. **Tempo**: informe o tempo estimado de cada formato.
   5. **Tema**: escolha Azul, Branco ou Dark mode.
   6. **Gerar**: abra a apresentação ou baixe o `.html`.

O arquivo gerado é autônomo, porque as imagens vão embutidas. Ele abre offline e pode ser enviado por e-mail.

**Na apresentação gerada:** `←` e `→` mudam de slide, `F` liga a tela cheia, `T` troca o tema, `P` pausa o cronômetro e `Esc` volta para a pauta.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub, por exemplo `gerador-apresentacao`.
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório:
   ```bash
   git init
   git add .
   git commit -m "Gerador de apresentação interativa"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/gerador-apresentacao.git
   git push -u origin main
   ```
   Se preferir não usar o terminal, use **Add file › Upload files** no próprio GitHub e arraste o conteúdo da pasta.
3. No repositório, abra **Settings › Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, depois a branch `main` e a pasta `/ (root)`, e clique em **Save**.
4. Em cerca de 1 minuto o site estará em `https://SEU-USUARIO.github.io/gerador-apresentacao/`.

O arquivo `.nojekyll` faz o GitHub Pages servir os arquivos como estão.

### Testar localmente

Abra um terminal nesta pasta e rode:

```bash
python -m http.server 8000
```

Depois acesse http://localhost:8000. Abrir o `index.html` com dois cliques até funciona, mas o leitor de PDF fica mais lento fora de um servidor.

## Estrutura

```
index.html                  assistente (6 etapas)
css/app.css                 estilos do assistente
js/app.js                   fluxo das etapas e geração do HTML
js/leitura.js               leitura do PPTX (títulos, ocultos) e do PDF (imagens)
js/modelo-apresentacao.js   modelo da apresentação gerada (temas, linha do tempo, cronômetro)
vendor/jszip.min.js         JSZip 3.10.1 (MIT)
vendor/pdfjs/               pdf.js 3.11.174 (Apache 2.0)
```

### Personalizar

- **Tópicos sugeridos automaticamente:** edite `REGRAS_TOPICO` em `js/leitura.js`.
- **Slides pré-marcados na rota sugerida:** edite `rotaPadrao` em `js/app.js`.
- **Resolução e qualidade das imagens:** edite `larguraImagem` e `qualidadeJpg` em `js/app.js`.
- **Cores dos temas:** edite os blocos `[data-theme="azul"]`, `"branco"` e `"escuro"` em `js/modelo-apresentacao.js`.

## Compatibilidade

Funciona no Chrome, no Edge e no Firefox atuais. O Internet Explorer não é suportado.
