# Portfólio · Gabriela Castro Pereira

Site de página única com *scrollytelling*: um notebook construído em CSS 3D fica preso
na tela, dá zoom, conta a história da Gabriela **dentro da própria tela**, desliza para
o lado e recua para o fundo enquanto os projetos passam por cima em cards de vidro.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
Motion (`motion/react`) · Lenis · Phosphor Icons · Simple Icons.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Ao publicar fora da Vercel, defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://gabriela.dev`)
para a imagem de compartilhamento do LinkedIn usar o domínio certo. Na Vercel isso é automático.

---

## Editar o conteúdo

| O quê | Onde |
| --- | --- |
| Nome, textos do hero, história, trajetória, formação, stack, contato | `src/content/profile.ts` |
| Projetos (título, descrição, tags, links, imagem) | `src/content/projects.ts` |
| Foto de perfil | `src/assets/images/gabriela.jpg` |

**Projetos:** os quatro itens atuais são **exemplos**. Para usar prints reais, salve as
imagens em `src/assets/projects/` (proporção 16:10, ex.: 1600 × 1000), importe no
`projects.ts` e preencha `image`. Sem imagem, o card e a tela do notebook usam uma capa
tipográfica provisória na cor do campo `tone`.

---

## Como o scroll funciona

### 1. Estrutura (`src/components/story/scroll-story.tsx`)

```
<div trilha>
  <Stage>           sticky, top 0, altura 100svh: notebook, luz, índice de capítulos
  <div -mt-100svh>  primeiro plano, rola por cima do palco
    Hero                    100svh
    Espaçador da história   380svh  (âncoras #sobre, #trajetoria, #formacao, #stack)
    Intro "Projetos"        100svh  (#projetos)
    Lista de projetos       ~88svh por projeto
    Contato                 100svh  (#contato)
```

O palco fica preso durante toda a trilha; só o primeiro plano rola. Nenhum estado React
muda durante o scroll: tudo passa por `MotionValue`s.

### 2. Uma linha do tempo `t` de 0 a 5 (`use-story-timeline.ts`)

Cada seção mede o próprio progresso com `useScroll`. Os trechos são contíguos, então a
soma forma uma linha do tempo monotônica:

| Trecho | Offsets do `useScroll` | `t` | O que acontece |
| --- | --- | --- | --- |
| Hero | `start start` → `end start` | 0 → 1 | zoom: o notebook gira de frente e cresce até escala 1; a senha da tela se preenche |
| História | `start start` → `end end` | 1 → 2 | o notebook fica parado; a coluna **dentro da tela** rola pelos capítulos |
| Intro | `start end` → `start start` | 2 → 3 | desliza da esquerda para a direita e espelha a diagonal |
| Lista | `start end` → `start 0.3` | 3 → 4 | recua para o fundo (menor, mais alto, 80% de opacidade) |
| (resto da lista) | | 4 | vaivém esquerda/direita guiado pelo card ativo |
| Contato | `start end` → `end end` | 4 → 5 | volta ao centro e fecha a tampa |

### 3. Poses (`choreography.ts`)

Cada fase é uma pose; entre poses, interpolação com *easing* (`inOutCubic`). Valores do
desktop (`x` em vw, `y` em vh, `z` em px, rotações em graus; a origem é o centro da tampa):

| `t` | x | y | z | scale | tilt (rotateX) | turn (rotateY) | tampa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 hero | −21 | −6 | 0 | 0.47 | −14 | +30 | aberta (20) |
| 1 zoom | −6.5 | 3.5 | 0 | 1 | −20 | 0 | aberta |
| 2 fim da história | −6.5 | 3.5 | 0 | 1 | −20 | 0 | aberta |
| 3 lateral | +21 | −5 | 0 | 0.47 | −14 | −30 | aberta |
| 4 fundo | 0 ± 12 | −6 | −120 | 0.5 | −12 | ∓20 | aberta |
| 4.4 | 0 | 10 | 0 | 0.4 | −22 | −10 | −10 |
| 4.75 | 0 | −6 | 0 | 0.36 | −28 | −13 | −70 |
| 5 contato | 0 | −9 | 0 | 0.36 | −30 | −14 | fechada (−88) |

Mobile e tablet têm tabelas próprias (notebook em cima e texto embaixo).

O notebook tem três camadas de transformação:

```
.rig   translate3d(x, y, z) scale(s)          origem: centro da tampa
.body  rotateX(tilt) rotateY(turn) rotateZ()  origem: dobradiça
.lid   rotateX(tampa)                         origem: dobradiça
```

Na fase de zoom, `tilt −20°` e `tampa +20°` giram em torno do **mesmo pivô** e se anulam:
a tela fica exatamente de frente, enquanto o teclado continua visível em perspectiva.

### 4. Fase 3: vaivém

Um `IntersectionObserver` com a raiz reduzida a uma linha no meio da tela informa qual
card está ativo. Card par (à esquerda) leva o notebook para a direita e vice-versa.
O lado alvo passa por um `useSpring` (rápido, mas suave) e a velocidade do spring
inclina o notebook na direção do movimento. A tela mostra o projeto ativo e a luz
ambiente assume a cor dele.

### 5. Texto nítido na tela

Dentro de uma cena com `perspective` o navegador compõe a tela por um caminho 3D que
reamostra o texto. Durante a história (`t` 1 → 2) uma **tela-espelho 2D**
(`screen-mirror.tsx`) é posicionada exatamente sobre a tela 3D, com a mesma geometria
(variáveis em `globals.css`). Visualmente é a mesma tela, mas com texto pixel-perfeito.

---

## Por que CSS 3D e não WebGL (`.glb`)?

- **Legibilidade:** a tela é DOM real, com texto selecionável, acessível e nítido.
- **Peso:** nenhum modelo de vários MB nem three.js no bundle.
- **Performance:** só `transform` e `opacity` animados, compostos na GPU; funciona bem em celular.
- **Tema:** o alumínio troca entre prata (tema claro) e grafite (tema escuro) só com CSS.

## Acessibilidade e performance

- `prefers-reduced-motion`: sem giros, sem vaivém e sem fechar a tampa; o Lenis desliga a suavização.
- `prefers-reduced-transparency`: vidro vira superfície sólida.
- Tema claro e escuro automáticos (`prefers-color-scheme`).
- Scroll medido no build de produção em Chrome headless (composição por software, cenário
  pessimista): ~4 a 7 ms de main thread por frame; p95 de 13,5 ms no mobile com CPU 4× mais lenta.

## Ajustes finos

| Constante | Arquivo | Efeito |
| --- | --- | --- |
| `STORY_SVH` | `scroll-story.tsx` | quanto rolar para atravessar a história |
| `CHAPTER_DWELL` | `scroll-story.tsx` | quanto cada capítulo fica parado na tela |
| `CHOREOGRAPHY` | `choreography.ts` | poses por fase e por layout |
| `SCREEN_TIMELINE` | `choreography.ts` | quando a tela troca de conteúdo, liga e desliga |
| `--lid-w` | `globals.css` | tamanho nativo do notebook (escala 1) |
