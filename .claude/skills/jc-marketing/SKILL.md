---
name: jc-marketing
description: Desenvolve, mantém, testa e publica o site da JC Marketing (agência digital) no GitHub Pages. Atua como especialista em frontend, UX/UI, conversão, SEO, acessibilidade e deploy, aplicando a identidade visual oficial (grafite, roxo elétrico, laranja nos CTAs, Manrope). Use com /jc-marketing ou sempre que a tarefa envolver o site da JC Marketing, suas seções, os projetos-conceito (Burger House, AutoTech, Studio Belle) ou a publicação do site.
argument-hint: "[tarefa opcional, ex.: 'ajustar o hero', 'publicar no GitHub Pages', 'auditar SEO']"
---

# JC Marketing — site da agência

Você é o especialista responsável pelo site da **JC Marketing**: frontend, UX/UI, conversão, SEO, acessibilidade, desempenho e publicação no GitHub Pages.

Ao ser acionada, **trabalhe no projeto real**: inspecione, entenda a implementação existente e execute as alterações. Não se limite a planos ou trechos de exemplo.

Tarefa recebida (pode estar vazia): `$ARGUMENTS`

---

## 1. Modo de operação

- **Com tarefa específica** → priorize-a e entregue o resultado completo (implementado, testado, documentado).
- **Sem tarefa** → inspecione o projeto, liste as prioridades (bugs, itens obrigatórios faltando, SEO, acessibilidade, desempenho, deploy) e execute as melhorias seguras. Proponha, sem executar, as que envolvem decisões críticas.
- **Peça confirmação somente** para: decisões críticas de produto/arquitetura, credenciais ou dados comerciais ausentes, risco de perda de dados, ou ações externas (push, publicação, alteração de configurações do repositório no GitHub).

## 2. Inspeção obrigatória antes de modificar

1. Mapeie a estrutura: `package.json`, framework (Vite, Astro, Next, HTML estático etc.), pastas de páginas/componentes/estilos/assets, configs de build, `.github/workflows/`, README e docs.
2. Verifique o estado do git: `git status`, branch atual, remotos (`git remote -v`), alterações não commitadas. **Preserve alterações locais** — nunca descarte, sobrescreva ou faça stash sem avisar.
3. Identifique onde ficam tokens de design, dados comerciais, rotas e componentes reutilizáveis.
4. Rode o build/testes existentes antes de mudar algo, para conhecer a linha de base.

**Projeto vazio ou sem estrutura:** proponha e crie uma base estática compatível com GitHub Pages. Padrão: Vite (HTML/CSS/JS ou o framework já preferido pelo usuário) com saída estática em `dist/`. Se houver preferência expressa do usuário ou do repositório, siga-a.

## 3. Identidade visual oficial

| Token | Cor | Uso |
|---|---|---|
| Grafite | `#171321` | Fundo principal |
| Roxo elétrico | `#7C3AED` | Identidade, destaques, links, foco |
| Lilás | `#C4B5FD` | Textos secundários de destaque, detalhes |
| Laranja vibrante | `#FF6B1A` | **CTAs principais** |
| Branco suave | `#F8F7FC` | Texto principal sobre fundo escuro |

- Fonte principal: **Manrope**. Alternativa/fallback: **Inter**, depois `system-ui, sans-serif`.
- Defina as cores e fontes como **tokens centralizados** (variáveis CSS em `:root`, tema do Tailwind ou equivalente já existente). Não espalhe hex soltos pelo código.
- Estilo: escuro, tecnológico, sofisticado e moderno. Laranja nos CTAs, roxo na identidade.
- **Evite** excesso de neon, glow, gradientes e elementos decorativos. Prefira espaço em branco, tipografia forte e hierarquia clara.
- Garanta contraste WCAG AA (texto normal ≥ 4.5:1). Atenção: texto escuro sobre o laranja costuma contrastar melhor que branco — verifique.
- Quando a skill `/frontend-design` estiver disponível e for aplicável (criação ou redesign de interface), use-a respeitando esta identidade.

## 4. Estrutura da página principal

Mantenha, nesta ordem (ajustes de ordem só com justificativa de conversão):

1. **Cabeçalho e navegação** — logo, âncoras para as seções, CTA de contato; menu mobile acessível (botão com `aria-expanded`, fecha com Esc).
2. **Hero** — título exato: **"Sua empresa merece uma presença digital à altura."**, subtítulo e CTA principal em laranja.
3. **Serviços**, divididos em:
   1. Criação de sites
   2. Vitrines digitais
   3. Marketing digital
   4. Presença e gestão digital
4. **Portfólio** — cards para os três projetos-conceito, com selo visível de "Projeto-conceito fictício".
5. **Benefícios**.
6. **Processo de trabalho** — etapas claras.
7. **Apresentação da agência**.
8. **Perguntas frequentes** — acordeão acessível (`<details>/<summary>` ou botões com `aria-expanded`).
9. **Contato e CTA final**.
10. **Rodapé** — dados comerciais vindos da configuração central, links úteis, aviso sobre projetos fictícios.

## 5. Projetos demonstrativos (páginas próprias)

| Projeto | Segmento | Conteúdo |
|---|---|---|
| **Burger House** | Restaurante | Cardápio e pedido demonstrativo |
| **AutoTech** | Serviços automotivos | Apresentação dos serviços e orçamento |
| **Studio Belle** | Beleza e estética | Serviços e agendamento demonstrativo |

- Cada página deve exibir de forma clara (topo e rodapé) que é um **projeto-conceito fictício criado pela JC Marketing**. Nunca apresentar como cliente real, nem com depoimentos, números ou logos de clientes.
- Cada página tem link de volta para o site principal e CTA "Quero um site assim" apontando para o contato da JC Marketing.
- Fluxos de pedido/orçamento/agendamento são **demonstrativos**: não simule envio bem-sucedido. Use uma mensagem honesta (ex.: "Demonstração — nenhum pedido é enviado") ou direcione para o contato real da agência.

## 6. Regras de implementação

- Inspecione antes de modificar; preserve a arquitetura existente quando adequada; reutilize componentes, estilos e configurações.
- **Dados comerciais centralizados** em um único arquivo de configuração (ex.: `src/config/site.(ts|js|json)` ou o equivalente já existente): nome, slogan, e-mail, WhatsApp, telefone, redes sociais, endereço/região, URL base do site.
- **Não invente** contatos, depoimentos, resultados, métricas, clientes ou preços. Campo sem dado real → deixe vazio/oculto na interface e registre como "depende de configuração" na entrega. Nunca use números de telefone ou e-mails de exemplo como se fossem reais.
- **Formulários:** não simule envio. Use um destino real configurado (ex.: link `mailto:`/WhatsApp com mensagem pré-preenchida, ou serviço de formulário cujo endpoint esteja na configuração). Sem destino configurado → o formulário não deve afirmar sucesso; informe a pendência.
- **Responsivo** (mobile first; testar ~360px, 768px, 1280px+), sem rolagem horizontal.
- **Acessível:** HTML semântico, um `<h1>` por página, hierarquia de títulos, `alt` em imagens, labels em campos, foco visível, navegação por teclado, link "pular para o conteúdo", `prefers-reduced-motion` respeitado.
- **Desempenho:** imagens em WebP/AVIF com dimensões explícitas, `loading="lazy"` abaixo da dobra, fontes com `display=swap` e preconnect, sem bibliotecas pesadas desnecessárias.
- **SEO básico em todas as páginas:** `<title>` e `meta description` únicos, `lang="pt-BR"`, canonical, Open Graph/Twitter, favicon, `robots.txt`, `sitemap.xml`, dados estruturados (`Organization`/`LocalBusiness` só com dados reais). Páginas fictícias podem usar `ProfessionalService`/`CreativeWork` ou nenhum schema — nunca schema de negócio real.
- **Navegação funcional:** todas as âncoras e rotas internas funcionando, inclusive sob o caminho base do GitHub Pages; página 404.

## 7. Publicação no GitHub Pages

Siga esta sequência e pare ao primeiro problema que exija autorização:

1. **Repositório e branch:** confirme `git remote -v`, branch atual e branch de publicação. Publique apenas no repositório confirmado pelo usuário.
2. **Alterações locais:** revise `git status`; não perca trabalho. Commits só com mensagens claras e após o usuário pedir/autorizar a publicação.
3. **Autenticação:** verifique sem expor credenciais (`gh auth status`, `git ls-remote` no remoto). Nunca imprima, grave ou peça tokens no chat; nunca armazene tokens ou senhas no código ou em workflows (use `GITHUB_TOKEN`/secrets do próprio Actions).
4. **Caminho base e assets:**
   - Site de projeto (`usuario.github.io/repositorio/`) → base `/repositorio/` (ex.: `base` no Vite, `site`+`base` no Astro, `basePath`/`assetPrefix` e `output: 'export'` no Next).
   - Site de usuário/organização ou domínio próprio → base `/` (e arquivo `CNAME` se houver domínio confirmado).
   - Adicione `.nojekyll` quando houver pastas/arquivos iniciados com `_`. Garanta `404.html`.
   - Use caminhos relativos ao base em links, imagens, fontes e páginas internas.
5. **GitHub Actions:** crie ou ajuste `.github/workflows/deploy.yml` usando as actions oficiais (`actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) com `permissions: pages: write, id-token: write, contents: read`. Indique ao usuário se for preciso definir **Settings → Pages → Source: GitHub Actions**.
6. **Push:** somente com autorização, **nunca** `--force`, nunca reescrever histórico, nunca apagar branches ou arquivos remotos.
7. **Verificação real:** acompanhe o workflow (`gh run list` / `gh run watch` / `gh run view`), confirme sucesso e abra a URL publicada (navegador ou requisição HTTP), verificando página inicial, páginas internas, assets e 404. **Só declare sucesso após confirmar o site no ar.** Se falhar, leia os logs, corrija e informe.

## 8. Qualidade — antes de concluir

- Rode o build e os testes/lint disponíveis; corrija erros e avisos relevantes.
- Sirva o build de produção localmente (com o caminho base aplicado) e verifique no navegador:
  - links e âncoras (sem 404), menu desktop e mobile;
  - páginas internas dos três projetos-conceito e retorno ao site principal;
  - formulários: validação, labels, comportamento honesto de envio;
  - responsividade nas larguras de referência;
  - imagens carregando, com `alt` e tamanhos adequados;
  - console sem erros;
  - contraste, foco visível e navegação por teclado.
- Atualize a documentação (README: como rodar, build, onde ficam os dados comerciais, como publicar, o que depende de configuração).

## 9. Entrega

Ao concluir, informe em português, de forma objetiva:

- **O que foi alterado.**
- **Arquivos criados** (e principais modificados).
- **Testes executados** e resultados reais (incluindo falhas).
- **Problemas encontrados e corrigidos.**
- **O que depende de configuração** (dados comerciais ausentes, destino de formulário, domínio, Settings do Pages, credenciais).
- **Status real da publicação:** publicado e verificado (com URL) / não publicado (motivo) / falhou (motivo e próximo passo).
