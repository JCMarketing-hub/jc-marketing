# Site JC Marketing

Site institucional da JC Marketing, com três projetos-conceito fictícios (Burger House, AutoTech e Studio Belle). É um site estático feito com [Vite](https://vite.dev), sem framework de interface, e pronto para o GitHub Pages.

## Requisitos

- Node.js 20 ou mais recente
- npm

## Comandos

```bash
npm install        # instala as dependências
npm run dev        # servidor de desenvolvimento em http://localhost:5173
npm run build      # gera o site estático em dist/
npm run preview    # serve o dist/ localmente
npm run check      # verifica links, âncoras, SEO básico e avisos de projeto-conceito em dist/
npm test           # build + check
```

## Estrutura

```
index.html                     Página principal
404.html                       Página de erro (GitHub Pages)
projetos/burger-house/         Projeto-conceito: restaurante (cardápio e pedido demonstrativo)
projetos/autotech/             Projeto-conceito: oficina (serviços e orçamento demonstrativo)
projetos/studio-belle/         Projeto-conceito: beleza (serviços e agendamento demonstrativo)
site.config.js                 Dados comerciais (fonte única)
vite.config.js                 Build multipágina, includes e SEO (canonical, sitemap, robots)
src/partials/                  Trechos HTML compartilhados (cabeçalho, rodapé, avisos)
src/styles/base.css            Tokens da identidade visual, botões e formulários
src/styles/home.css            Estilos da página principal
src/styles/demos.css           Estilos e temas dos projetos-conceito
src/scripts/                   Menu, formulários e pedido demonstrativo
scripts/check-links.mjs        Verificação automática do build
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
| `--jc-graphite` | `#171321` | Fundo |
| `--jc-purple` | `#7C3AED` | Identidade e destaques |
| `--jc-lilac` | `#C4B5FD` | Detalhes e foco |
| `--jc-orange` | `#FF6B1A` | CTAs principais (texto grafite, para garantir contraste) |
| `--jc-white` | `#F8F7FC` | Texto |

As fontes são Manrope (principal) e Inter (alternativa), carregadas do Google Fonts.

## Dados comerciais — dependem de configuração

Todos os contatos ficam em **`site.config.js`** e estão **vazios** de propósito, para não publicar dados inventados:

- `contact.whatsapp`: somente dígitos, com DDI e DDD
- `contact.email`, `contact.phone`, `contact.region`
- `social.instagram`, `social.linkedin`, `social.facebook`: URLs completas

Enquanto nenhum canal estiver preenchido:

- o site mostra o aviso "canais de atendimento sendo configurados";
- o botão do formulário de contato fica desabilitado.

O formulário **não envia dados a nenhum servidor**. Com WhatsApp configurado, ele abre o WhatsApp com a mensagem pronta. Com apenas o e-mail, abre o aplicativo de e-mail.

## Projetos-conceito

Burger House, AutoTech e Studio Belle são **fictícios**:

- cada página mostra uma faixa de aviso no topo e no rodapé;
- não há preços, depoimentos ou resultados;
- pedido, orçamento e agendamento são demonstrativos e informam que nada foi enviado.

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
- Inserir o logotipo oficial, se for diferente do monograma em `src/partials/logo.html` e `public/favicon.svg`.
