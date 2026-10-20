# Site NARKIA DIGITAL

Site institucional da NARKIA DIGITAL (antiga JC Marketing), com três exemplos fictícios (Burger House, AutoTech e Studio Belle). É um site estático feito com [Vite](https://vite.dev), sem framework de interface, e pronto para o GitHub Pages.

## Requisitos

- Node.js 20 ou mais recente
- npm

## Comandos

```bash
npm install        # instala as dependências
npm run dev        # servidor de desenvolvimento em http://localhost:5173
npm run build      # gera o site estático em dist/
npm run preview    # serve o dist/ localmente
npm run check      # verifica links, âncoras, SEO básico e avisos de exemplo fictício em dist/
npm test           # build + check
npm run images -- <pasta> [destino] [larguras]   # converte fotos para WebP responsivo
npm run screens -- [url]                         # recaptura as telas das demos (requer o preview rodando)
```

## Estrutura

```
index.html                     Página principal
404.html                       Página de erro (GitHub Pages)
projetos/burger-house/         Exemplo fictício: restaurante (cardápio e pedido demonstrativo)
projetos/autotech/             Exemplo fictício: oficina (serviços e orçamento demonstrativo)
projetos/studio-belle/         Exemplo fictício: salão de beleza (serviços e agendamento demonstrativo)
site.config.js                 Dados comerciais (fonte única)
vite.config.js                 Build multipágina, includes e SEO (canonical, sitemap, robots)
src/partials/                  Trechos HTML compartilhados (cabeçalho, rodapé, avisos)
src/styles/base.css            Tokens da identidade visual, botões e formulários
src/styles/home.css            Estilos da página principal
src/styles/demos.css           Estilos e temas dos exemplos
src/scripts/                   Menu, formulários e pedido demonstrativo
scripts/check-links.mjs        Verificação automática do build
scripts/optimize-images.mjs    Conversão de fotos para WebP (sharp)
scripts/capture-screens.mjs    Captura das telas das demos para os mockups da home
src/assets/img/                Fotos otimizadas e telas das demos (telas/)
public/                        Arquivos copiados sem processamento (favicon)
.github/workflows/deploy.yml   Publicação no GitHub Pages
```

### Marcadores de template

O plugin em `vite.config.js` processa estes marcadores no HTML:

| Marcador | Resultado |
|---|---|
| `<!-- @include nome -->` | Conteúdo de `src/partials/nome.html` |
| `{{base}}` | Caminho base do site (`/` ou `/<repositorio>/`) |
| `{{name}}` / `{{year}}` | Nome da agência / ano atual |
| `<!-- @seo path="/x/" -->` | `canonical` e `og:url` (somente com `SITE_URL`) |
| `<!-- @contacts -->` / `<!-- @social -->` | Canais e redes preenchidos em `site.config.js` |

Links internos devem usar `{{base}}` (ex.: `{{base}}projetos/autotech/`) para funcionar no GitHub Pages.

## Identidade visual

| Token | Cor | Uso |
|---|---|---|
Marca: **NARKIA DIGITAL** · slogan: *Tecnologia e criatividade para crescer.*

| Token | Cor | Uso |
|---|---|---|
| `--brand-graphite` | `#171321` | Fundo principal |
| `--brand-purple` | `#7C3AED` | Destaques, botões secundários, elementos tecnológicos |
| `--brand-lilac` | `#C4B5FD` | Textos secundários e foco |
| `--brand-orange` | `#FF6B1A` | Chamadas de atenção e CTAs principais (texto grafite, para garantir contraste) |
| `--brand-white` | `#F8F7FC` | Texto |

- **Fontes:** Montserrat (títulos em Bold, textos em Regular) e Inter como apoio, carregadas do Google Fonts.
- **Logotipo:** arquivos oficiais em `materiais/identidade-narkia/` (recortes da prancha de identidade). O comando `node scripts/prepare-brand.mjs` remove o fundo escuro da prancha, sem redesenhar o logo, e gera:
  - `src/assets/brand/narkia-logo.webp` (cabeçalho e rodapé) e `narkia-logo.png` (PDF);
  - `public/favicon.png` e `public/apple-touch-icon.png` (símbolo "A");
  - `public/og-image.jpg` (imagem de compartilhamento 1200 × 630).
- **Grafismos:** linhas roxa e laranja antes dos rótulos de seção e faixas diagonais no topo da página.

## Dados comerciais — dependem de configuração

Todos os contatos ficam em **`site.config.js`** e estão **vazios** de propósito, para não publicar dados inventados:

- `contact.whatsapp`: somente dígitos, com DDI e DDD
- `contact.email`, `contact.phone`, `contact.region`
- `social.instagram`, `social.linkedin`, `social.facebook`: URLs completas

Enquanto nenhum canal estiver preenchido:

- o site mostra o aviso "canais de atendimento sendo configurados";
- o botão do formulário de contato fica desabilitado.

O formulário **não envia dados a nenhum servidor**. Com WhatsApp configurado, ele abre o WhatsApp com a mensagem pronta. Com apenas o e-mail, abre o aplicativo de e-mail.

## Exemplos fictícios

Burger House, AutoTech e Studio Belle são **fictícios**:

- cada página mostra uma faixa de aviso no topo e no rodapé;
- não há preços, depoimentos ou resultados;
- pedido, orçamento e agendamento são demonstrativos e informam que nada foi enviado.

## Trabalhos reais

A seção "Trabalhos reais" mostra posts de Instagram criados e gerenciados pela equipe, em mockups de celular. Cada imagem em `src/assets/img/trabalhos/` é uma grade 3 × 3 com 9 posts reais de um cliente.

Regras desta seção:
- o texto mostra só o segmento do negócio, sem citar o nome do cliente;
- não há links para os perfis nem números de seguidores ou engajamento;
- os clientes autorizaram que logo e nome apareçam dentro das próprias artes;
- não usamos fotos de pacientes, de crianças ou de celebridades.

## Imagens e créditos

As fotos dos exemplos fictícios são do [Unsplash](https://unsplash.com) e usadas sob a [Licença Unsplash](https://unsplash.com/license). O crédito aparece no fim de cada página.

| Arquivo | Foto | Autor |
|---|---|---|
| `autotech-carro-*.webp` | [Carro esportivo em quarto escuro](https://unsplash.com/photos/0xySZZ8OK1o) | Tuna Ekici |
| `burger-house-hamburguer-*.webp` | [Hambúrguer com batatas fritas](https://unsplash.com/photos/5qBwgjP1ZwE) | Shaafi Ali |
| `studio-belle-salao-*.webp` | [Cadeiras de salão](https://unsplash.com/photos/PtOfbGkU3uI) | Guilherme Petri |

As imagens em `src/assets/img/telas/` são capturas das próprias páginas de exemplo, usadas nos mockups e no portfólio da home. Depois de alterar uma demo, recapture-as:

```bash
npm run build
npm run preview          # em outro terminal
npm run screens
npm run build
```

## Mini portfólio em PDF

Material de 3 páginas A4 para enviar pelo WhatsApp: [`materiais/mini-portfolio-narkia-digital.pdf`](materiais/mini-portfolio-narkia-digital.pdf).

- Fonte editável: `materiais/mini-portfolio/mini-portfolio.html`. Os marcadores `{{...}}` recebem URL, WhatsApp, telefone e e-mail de `site.config.js`.
- Imagens: as telas reais das demos em `src/assets/img/telas/`, convertidas para JPEG na geração.
- Para gerar de novo, rode `npm run mini-portfolio` (requer Chrome ou Edge instalado).

O script recusa o PDF se:
- algum conteúdo ultrapassar a folha;
- o arquivo não tiver exatamente 3 páginas A4.

Ao final, ele lista os links clicáveis do PDF para conferência.

## Publicação no GitHub Pages

1. Crie o repositório no GitHub e envie o código para a branch `main`.
2. No repositório, abra **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
3. A cada push na `main`, o workflow `deploy.yml`:
   - instala as dependências;
   - faz o build com o caminho base correto (`/<repositorio>/` em site de projeto, `/` em site de usuário ou domínio próprio);
   - roda `npm run check`;
   - publica o resultado.
4. Confira a execução na aba **Actions** e acesse a URL exibida no job `deploy`.

O workflow obtém `BASE_PATH` e `SITE_URL` automaticamente pelo `actions/configure-pages`. Para um domínio próprio, configure-o em **Settings → Pages** e adicione `public/CNAME` com o domínio.

Build local simulando um site de projeto:

```bash
BASE_PATH=/nome-do-repositorio/ SITE_URL=https://usuario.github.io npm run build
BASE_PATH=/nome-do-repositorio/ npm run check
```

No Git Bash do Windows, rode antes `export MSYS_NO_PATHCONV=1 MSYS2_ENV_CONV_EXCL='*'`. Sem isso, o Bash converte `/nome/` num caminho do Windows.

## Pendências conhecidas

- Contatos preenchidos em `site.config.js`: WhatsApp, e-mail, telefone e Instagram. Região, LinkedIn e Facebook ficam ocultos por escolha.
- Adicionar uma imagem de compartilhamento (`og:image`, PNG 1200×630) quando houver arte oficial.
- Os PNGs do logo são recortes de baixa resolução da prancha (o principal tem 545 px de largura). Quando houver a versão vetorial oficial (SVG ou PDF), coloque-a em `materiais/identidade-narkia/` e atualize `src/partials/logo.html`.
