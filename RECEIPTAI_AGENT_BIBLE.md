# ReceiptAI — Bíblia do Projeto para Agentes
> Documento de referência completo. Tudo que um agente precisa para desenvolver o projeto do zero.

---

## ÍNDICE

1. [Conceito & Proposta de Valor](#1-conceito--proposta-de-valor)
2. [Design System](#2-design-system)
3. [Telas — Especificação Detalhada](#3-telas--especificação-detalhada)
4. [Arquitetura Técnica](#4-arquitetura-técnica)
5. [Estrutura de Arquivos (Monorepo)](#5-estrutura-de-arquivos-monorepo)
6. [Banco de Dados](#6-banco-de-dados)
7. [API — Endpoints & Contratos](#7-api--endpoints--contratos)
8. [Lógica de OCR & Parser](#8-lógica-de-ocr--parser)
9. [Infraestrutura & Docker](#9-infraestrutura--docker)
10. [Variáveis de Ambiente](#10-variáveis-de-ambiente)
11. [Fluxo de Dados End-to-End](#11-fluxo-de-dados-end-to-end)
12. [Regras de Negócio Críticas](#12-regras-de-negócio-críticas)

---

## 1. Conceito & Proposta de Valor

### O Produto
**ReceiptAI** é um aplicativo mobile SaaS para MEIs, Freelancers e pequenos negócios que **elimina o trabalho manual de organizar gastos**. O usuário tira uma foto de qualquer nota fiscal/recibo — o app extrai valor, estabelecimento, categoria e data automaticamente.

### Proposta Central
> "Tire uma foto da nota e tenha seus gastos organizados automaticamente."

### Regra de Ouro
```
Se o usuário precisar pensar → FALHA
Se ele só tirar foto e pronto → SUCESSO
```

### Público-alvo
| Perfil | Dor Principal |
|--------|--------------|
| MEI (Microempreendedor) | Perdem notas, dificuldade com DAS e contabilidade |
| Freelancer | Não organizam gastos por projeto/categoria |
| Pequenos negócios | Sem controle fiscal, relatórios manuais |

### MVP — Funcionalidades Mínimas
1. Autenticação (registro + login)
2. Tirar foto do recibo
3. OCR automático (extração de valor + estabelecimento)
4. Salvar gasto
5. Listar gastos com status
6. Dashboard com totais
7. Insights mensais básicos

---

## 2. Design System

### 2.1 Identidade Visual — "Liquid Glass"

O design segue a estética **Liquid Glass**: glassmorfismo de alta qualidade com motion orgânico. O objetivo é transmitir **automação inteligente trabalhando em segundo plano** enquanto o UI parece leve, etéreo e premium.

**Palavras-chave do estilo:**
- Soft translucency (superfícies leves e translúcidas)
- Organic motion (elementos que flutuam, não que encaixam)
- Automated calm (parece que o sistema trabalha sozinho)
- Refinement (sem bordas pesadas; usa refração de luz)

---

### 2.2 Paleta de Cores Completa

> Use exatamente estes tokens em todas as implementações. Nunca improvise cores.

#### Cores Primárias
| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#3a6758` | Ações principais, texto de destaque, ícones ativos |
| `on-primary` | `#ffffff` | Texto sobre fundo primary |
| `primary-container` | `#a7d7c5` | Background de chips de status "Processado", nav ativa |
| `on-primary-container` | `#325f51` | Texto sobre primary-container |
| `primary-fixed` | `#bcedda` | Gradientes sutis, decoração |
| `primary-fixed-dim` | `#a1d1bf` | Versão escurecida de primary-fixed |
| `inverse-primary` | `#a1d1bf` | Primary em contextos invertidos |

#### Cores de Superfície
| Token | Hex | Uso |
|-------|-----|-----|
| `surface` | `#f9faf7` | Background base do app |
| `background` | `#f9faf7` | Cor de fundo da body |
| `surface-bright` | `#f9faf7` | Superfície mais clara |
| `surface-dim` | `#d9dad8` | Superfície escurecida |
| `surface-container-lowest` | `#ffffff` | Branco puro — cards internos |
| `surface-container-low` | `#f3f4f1` | Container levemente elevado |
| `surface-container` | `#edeeeb` | Container padrão |
| `surface-container-high` | `#e8e8e6` | Container mais elevado |
| `surface-container-highest` | `#e2e3e0` | Container máximo |
| `surface-variant` | `#e2e3e0` | Variante de superfície |
| `surface-tint` | `#3a6758` | Tint da superfície (primary) |
| `inverse-surface` | `#2e312f` | Dark mode surface |
| `inverse-on-surface` | `#f0f1ee` | Texto sobre inverse surface |

#### Texto & Bordas
| Token | Hex | Uso |
|-------|-----|-----|
| `on-surface` | `#1a1c1b` | Texto principal (quase preto) |
| `on-surface-variant` | `#404945` | Texto secundário, labels, placeholders |
| `on-background` | `#1a1c1b` | Texto sobre background |
| `outline` | `#717975` | Bordas de input, divisores |
| `outline-variant` | `#c0c8c3` | Bordas sutis, separadores |

#### Cores Secundárias
| Token | Hex | Uso |
|-------|-----|-----|
| `secondary` | `#5c5f60` | Elementos secundários |
| `on-secondary` | `#ffffff` | Texto sobre secondary |
| `secondary-container` | `#e1e3e4` | Container para itens secundários |
| `on-secondary-container` | `#626566` | Texto sobre secondary-container |
| `secondary-fixed` | `#e1e3e4` | |
| `secondary-fixed-dim` | `#c5c7c8` | |
| `on-secondary-fixed` | `#191c1d` | |
| `on-secondary-fixed-variant` | `#454748` | |

#### Cores Terciárias (Acento / Alertas Suaves)
| Token | Hex | Uso |
|-------|-----|-----|
| `tertiary` | `#83514c` | Acento terciário (salmon/rose) |
| `on-tertiary` | `#ffffff` | |
| `tertiary-container` | `#febdb6` | Container para itens de alerta/atenção |
| `on-tertiary-container` | `#7a4a45` | |
| `tertiary-fixed` | `#ffdad6` | Versão clara do terciário |
| `tertiary-fixed-dim` | `#f7b7b0` | |
| `on-tertiary-fixed` | `#33100e` | |
| `on-tertiary-fixed-variant` | `#683a36` | |

#### Cores de Estado
| Token | Hex | Uso |
|-------|-----|-----|
| `error` | `#ba1a1a` | Estados de erro |
| `on-error` | `#ffffff` | Texto sobre error |
| `error-container` | `#ffdad6` | Background de mensagem de erro |
| `on-error-container` | `#93000a` | Texto sobre error-container |

---

### 2.3 Tipografia

> Nunca use Inter, Roboto, Arial ou qualquer fonte genérica. Usar exatamente estas três famílias.

#### Fontes
| Família | Import | Papel |
|---------|--------|-------|
| **Sora** | `wght@400;600;700;800` | Headlines, display, logotipo — futurista e geométrica |
| **Manrope** | `wght@400;500;600` | Corpo de texto, descrições — legível e equilibrada |
| **Space Grotesk** | `wght@500` | Labels, caps, metadata, readouts de sistema |

```html
<!-- Google Fonts import -->
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600&family=Space+Grotesk:wght@500&display=swap" rel="stylesheet"/>
```

#### Escala Tipográfica
| Token | Família | Tamanho | Peso | Line Height | Letter Spacing | Uso |
|-------|---------|---------|------|-------------|----------------|-----|
| `display-lg` | Sora | 48px | 600 | 56px | -0.02em | Valores monetários grandes |
| `headline-lg` | Sora | 32px | 600 | 40px | -0.01em | Títulos de seção desktop |
| `headline-lg-mobile` | Sora | 28px | 600 | 36px | — | Títulos de seção mobile |
| `body-md` | Manrope | 16px | 400 | 24px | — | Corpo de texto padrão |
| `label-caps` | Space Grotesk | 12px | 500 | 16px | 0.05em | Labels, status chips, metadata |

---

### 2.4 Espaçamento & Grid

| Token | Valor | Uso |
|-------|-------|-----|
| `unit` | 4px | Unidade base |
| `gutter` | 16px | Gap entre elementos de grid |
| `margin-mobile` | 20px | Margem horizontal nas telas mobile |
| `margin-desktop` | 40px | Margem horizontal desktop |
| `stack-gap` | 24px | Gap entre seções empilhadas |

**Grid mobile:** 4 colunas, gutter 16px, margem 20px
**Grid desktop:** 12 colunas, gutter 16px, margem 40px

---

### 2.5 Border Radius
| Token | Valor | Uso |
|-------|-------|-----|
| `DEFAULT` | 4px (0.25rem) | Elementos muito pequenos |
| `lg` | 8px (0.5rem) | Botões secundários |
| `xl` | 12px (0.75rem) | Cards pequenos |
| `full` | 9999px | Pills, chips, avatares, bottom nav |

> **Cards principais usam `rounded-[32px]` (2rem) diretamente no className — é intencional.**
> Containers de categoria usam `rounded-[24px]` (1.5rem).
> Feed items usam `rounded-[32px]` a `rounded-[40px]`.

---

### 2.6 Efeito Glassmorphism — Implementação Exata

Este é o efeito central do design. Deve ser aplicado em todos os cards, headers, nav e tooltips.

```css
/* Glass Card — padrão absoluto */
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(167, 215, 197, 0.1);
}

/* Refractive Edge — realce de borda superior (luz batendo no vidro) */
.refractive-edge {
  border-top: 1px solid rgba(255, 255, 255, 0.8);
}

/* Liquid Shadow — sombra esverdeada suave */
.liquid-shadow {
  box-shadow: 0 20px 40px rgba(167, 215, 197, 0.1);
}

/* Liquid Glow — brilho para elementos em destaque */
.liquid-glow {
  box-shadow: 0 0 40px rgba(167, 215, 197, 0.3);
}

/* Specular Highlight — reflexo de luz no topo do card */
.specular-highlight {
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
}

/* Scanning Frame — frame da câmera */
.scanning-frame {
  border: 2px solid transparent;
  background: 
    linear-gradient(rgba(167, 215, 197, 0.1), rgba(167, 215, 197, 0.1)) padding-box,
    linear-gradient(to bottom right, #a7d7c5, #3a6758) border-box;
  box-shadow: 0 0 30px rgba(167, 215, 197, 0.4);
}
```

---

### 2.7 Backgrounds

Cada tela tem um background específico — nunca use cor sólida simples.

```css
/* Home Screen */
body {
  background: radial-gradient(circle at top right, #bcedda 0%, #f9faf7 40%);
}

/* History Screen */
body {
  background: linear-gradient(135deg, #f9faf7 0%, #edeeeb 100%);
}

/* Insights Screen */
body {
  background-image: 
    radial-gradient(at 0% 0%, rgba(167, 215, 197, 0.15) 0px, transparent 50%), 
    radial-gradient(at 100% 100%, rgba(167, 215, 197, 0.1) 0px, transparent 50%);
  background-color: #f9faf7;
}

/* Detail Screen */
body {
  background: #f9faf7; /* base com glass cards fazendo o trabalho visual */
}
```

---

### 2.8 Animações

```css
/* Float — tooltips da câmera */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.ocr-tooltip {
  animation: float 3s ease-in-out infinite;
}
/* segundo tooltip com delay */
.ocr-tooltip-delayed {
  animation: float 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

/* Pulse — indicador de processamento ativo */
.animate-pulse-slow {
  animation: pulse 3s ease-in-out infinite;
}

/* Shutter glow */
.shutter-glow {
  box-shadow: 0 0 25px rgba(167, 215, 197, 0.6);
}
```

#### Micro-interações padrão (React Native equivalente)
- Botões: `activeOpacity={0.8}` + scale `0.95` ao pressionar
- Cards: `scale(1.02)` no hover / `scale(1)` no release
- Nav items inativos: `opacity 0.6` → `1.0` na transição

---

### 2.9 Material Symbols (Ícones)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

**Configuração padrão (outlined, não preenchido):**
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

**Para ícones preenchidos (estados ativos):**
```html
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
```

#### Mapeamento de ícones por contexto
| Contexto | Ícone |
|----------|-------|
| Home/Dashboard | `dashboard` |
| Histórico | `receipt_long` |
| Câmera/Scan | `camera_enhance` |
| Insights | `analytics` |
| Configurações | `settings` |
| Notificações | `notifications` |
| Voltar | `arrow_back` |
| Estabelecimento | `store` |
| Pagamento | `payments` |
| Zoom | `zoom_in` |
| Editar | `edit` |
| Confirmar | `check_circle` |
| Flash câmera | `flash_on` |
| Galeria | `image` |
| Recuperar | `history` |
| IA/Auto | `auto_awesome` |
| Impostos | `account_balance` |
| Suprimentos | `inventory_2` |
| Viagens | `flight_takeoff` |
| Alimentação | `shopping_cart` / `restaurant` |
| Combustível | `local_gas_station` |
| Café | `coffee` |
| Software | `cloud` |
| Carteira | `account_balance_wallet` |
| Sync/Processando | `sync` |
| OK/Done | `check_circle` |
| Fechar | `close` |
| Adicionar | `add` |
| Seta direita | `arrow_forward` |
| Chevron | `chevron_right` |

---

### 2.10 Componentes-Base

#### TopAppBar (Header)
```
height: 64px (h-16)
position: fixed, top-0, z-50
background: rgba(#f9faf7, 0.6) + backdrop-blur-xl
border-bottom: 1px solid rgba(255,255,255,0.20)
shadow: 0 8px 32px 0 rgba(167,215,197,0.1)
padding: horizontal 20px (margin-mobile)

Conteúdo esquerdo: avatar circular (40px) + "ReceiptAI" em Sora bold primary
Conteúdo direito: botão de notificações (ícone, rounded-full)
Em telas de detalhe: botão voltar (arrow_back) substitui o avatar
```

#### BottomNavBar
```
position: fixed, bottom: 20px
width: 90% da tela
left: 50%, translateX(-50%)
border-radius: full (rounded-full)
background: rgba(255,255,255,0.40) + backdrop-blur(30px)
border: 1px solid rgba(255,255,255,0.50)
shadow: 0 20px 40px rgba(58,103,88,0.15)
height: 80px (h-20)

5 abas: Home | History | Scan (central elevado) | Insights | Settings

Item ATIVO: fundo primary-container, texto on-primary-container, rounded-full, scale(1.05)
Item INATIVO: cor on-surface-variant, hover → primary
Botão Scan central: w-14 h-14, bg-primary, rounded-full, -mt-8 (elevado), shadow-lg
```

> **Regra de supressão:** A BottomNavBar é OCULTADA nas telas de fluxo transacional (Câmera, Detail de recibo). Ela reaparece apenas em telas estruturais (Home, History, Insights, Settings).

#### FAB (Floating Action Button)
```
position: fixed, bottom: 112px (bottom-28), right: 24px (right-6)
size: 64px × 64px (w-16 h-16)
border-radius: rounded-3xl (24px)
background: primary (#3a6758)
color: on-primary (#fff)
shadow: 0 20px 40px rgba(58,103,88,0.3)
icon: camera_enhance (FILL 1)
hover: scale(1.1)
active: scale(0.9)
Tooltip: aparece à esquerda no hover — "Escanear Recibo"
```

#### Glass Card (Card padrão)
```css
background: rgba(255,255,255,0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.5);
box-shadow: 0 8px 32px 0 rgba(167,215,197,0.1);
border-radius: 32px (padrão); variações: 24px, 40px
```

#### Status Chips (Pills de status)
| Status | Background | Texto | Dot |
|--------|-----------|-------|-----|
| PROCESSADO | `primary-container` | `on-primary-container` | `bg-primary` |
| PENDENTE | `surface-container-highest` | `on-surface-variant` | `bg-outline` |
| NOVO | `primary` | `on-primary` | — |

```html
<!-- Exemplo PROCESSADO -->
<div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-caps text-[10px] uppercase tracking-wider">
  <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
  Processado
</div>
```

---

## 3. Telas — Especificação Detalhada

### TELA 1 — Home (Dashboard)

**Arquivo de referência:** `Image_2.html` | **Screenshot:** `Image_5.png`

**Propósito:** Visão geral do estado financeiro do usuário. Central de comando.

#### Layout
```
TopAppBar (avatar + "ReceiptAI" + bell)
│
├── Section: Saudação personalizada
│   ├── H1: "Olá, {nome}" — Sora 28px/600
│   └── P: "Sua saúde financeira está em fluxo constante." — Manrope 16px muted
│
├── Bento Grid (md:12 cols, mobile: 1 col)
│   │
│   ├── HERO CARD (md:8 cols) — Glass card 32px radius
│   │   ├── Donut chart animado (conic-gradient + mask radial)
│   │   │   ├── Centro: label "TOTAL" + valor "R$ 2.450" (primary, Sora)
│   │   │   └── Animação: animate-pulse (suave)
│   │   └── Texto direito:
│   │       ├── "Gastos Mensais" — Sora 28px/600
│   │       ├── Descrição com maior categoria em bold
│   │       └── Pills: "SAUDÁVEL" (primary-container/30) | "MEI" (secondary-container/50)
│   │
│   ├── INSIGHT CARD (md:4 cols) — Glass card, gradient from-primary-container/20
│   │   ├── Ícone: analytics num quadrado branco 48px rounded-2xl
│   │   ├── Label: "INSIGHT INTELIGENTE" (label-caps, primary)
│   │   ├── Quote: "Você gastou 15% menos em café este mês." (Sora 20px)
│   │   └── CTA: "VER DETALHES →" (label-caps, primary, hover slide-right)
│   │
│   ├── SCANS RECENTES (md:6 cols) — Lista feed
│   │   ├── Header: "Scans Recentes" + "VER TUDO" (link)
│   │   └── Items (glass card, rounded-2xl, hover scale 1.02):
│   │       ├── Thumbnail 48×48 rounded-xl
│   │       ├── Nome estabelecimento (semibold) + horário (muted sm)
│   │       └── Valor (bold, primary) + chip de status
│   │
│   └── TAX CARD (md:6 cols) — Gradient from-white to-primary-fixed/30
│       ├── Label: "PREVISÃO DE IMPOSTO (DAS)"
│       ├── Valor: "R$ 72,00" (Sora 32px, primary)
│       ├── Progress bar (75% preenchido, bg-primary, rounded-full)
│       ├── "Você atingiu 75% do teto mensal para sua categoria MEI."
│       └── Blob decorativo: bg-primary-container/20, blur-3xl (canto inferior direito)
│
BottomNavBar (Home ativo)
FAB câmera (bottom-28, right-6) — apenas desktop hidden, mobile visible
```

#### Donut Chart (implementação CSS pura)
```css
.liquid-chart-container {
  background: conic-gradient(from 180deg at 50% 50%, #3a6758 0deg, #a7d7c5 160deg, transparent 160deg);
  mask: radial-gradient(circle, transparent 65%, black 66%);
  -webkit-mask: radial-gradient(circle, transparent 65%, black 66%);
}
/* Container: w-48 h-48, rounded-full, animate-pulse, opacity-80 */
```

---

### TELA 2 — History (Histórico de Gastos)

**Arquivo de referência:** `Image_8.html` | **Screenshot:** `Image_2.png` (conforme enviado)

**Propósito:** Lista completa de despesas com filtros por período e categoria.

#### Layout
```
TopAppBar (avatar + "ReceiptAI" + bell)
│
├── HERO SUMMARY CARD — Glass, rounded-3xl, bg-primary/5
│   ├── Label: "TOTAL DESTE MÊS" (label-caps, primary, tracking-widest)
│   ├── Valor: "R$ 4.250,80" (Sora 32px, primary)
│   └── Delta: "+12% vs mês anterior" (muted, alinhado à direita)
│
├── FILTER CHIPS — Scroll horizontal
│   ├── "Esta Semana" (ativo: bg-primary, text-on-primary, rounded-full)
│   ├── "Mês Passado" (inativo: bg-white/60, glass, on-surface-variant)
│   └── "Suprimentos" (inativo: mesmo estilo)
│
└── EXPENSE FEED — Lista vertical, gap-4
    │
    ├── ITEM PADRÃO (glass, rounded-[2rem], p-5, hover: -translate-y-1)
    │   ├── Ícone categoria: w-14 h-14, rounded-2xl, bg-{cor}-container/30
    │   ├── Nome + valor (bold, on-surface) — linha superior
    │   └── Data/hora + chip status — linha inferior
    │
    └── ITEM ESPECIAL "RECORRENTE" (bg-primary-container/20, rounded-[2.5rem], p-6)
        ├── Ícone: w-12 h-12, rounded-full, bg-white, auto_awesome (primary)
        ├── Nome + tag "RECORRENTE IDENTIFICADO" (label-caps, on-surface-variant)
        ├── Valor (extrabold, primary)
        ├── Divisor: h-[1px] bg-white/40
        └── "Identificado automaticamente via e-mail" + chip "NOVO" (bg-primary)

FAB câmera (bottom-28, right-6)
BottomNavBar (History ativo)
```

#### Categorias e suas cores de ícone
| Categoria | Ícone | Cor bg container |
|-----------|-------|-----------------|
| Alimentação | `shopping_cart` | `primary-container/30`, text `primary` |
| Combustível | `local_gas_station` | `secondary-container/30`, text `secondary` |
| Restaurante | `restaurant` | `tertiary-container/30`, text `tertiary` |
| Café | `coffee` | `secondary-container/30`, text `secondary` |
| Software | `cloud` | `primary-container/30`, text `primary` |
| Recorrente | `auto_awesome` | `white`, text `primary` |

---

### TELA 3 — Câmera / Scan

**Arquivo de referência:** `Image_6.html` | **Screenshot:** `Image_3.png`

**Propósito:** Tela imersiva de captura de recibo. Fluxo transacional — sem BottomNavBar.

#### Layout
```
FULLSCREEN CAMERA VIEWPORT (z-0)
└── Imagem da câmera: w-full h-full object-cover, grayscale-[20%], brightness-[0.8]

UI OVERLAY SHELL (z-10, flex column, justify-between, py-6)
│
├── HEADER (px-20px, flex justify-between)
│   ├── BTN FECHAR: w-12 h-12, glass-panel, rounded-full, ícone "close" (primary)
│   ├── MODE INDICATOR: glass-panel, rounded-full, px-4 py-2
│   │   ├── Dot animado: w-2 h-2, bg-primary, rounded-full, animate-pulse
│   │   └── "MODO AUTOMÁTICO" (label-caps)
│   └── BTN FLASH: w-12 h-12, glass-panel, rounded-full, "flash_on" (primary)
│
├── SCANNING FRAME (absolute, inset-0, centered)
│   ├── Frame: w-full max-w-md aspect-[3/4], scanning-frame class, rounded-[32px]
│   └── Corner accents: w-8 h-8, border-4, border-primary (4 cantos)
│
├── FLOATING OCR TOOLTIPS (pointer-events-none)
│   ├── ESTABELECIMENTO TOOLTIP (self-end, mr-4, animation float)
│   │   ├── glass-panel, rounded-2xl, p-4
│   │   ├── Ícone: bg-primary-container, p-2, rounded-lg, "store" (on-primary-container)
│   │   ├── Label: "ESTABELECIMENTO" (label-caps, primary/70, 10px)
│   │   └── Valor: "Starbucks Coffee" (Sora 16px, on-surface)
│   │
│   └── TOTAL TOOLTIP (self-start, ml-4, animation float delay 0.5s)
│       ├── glass-panel, rounded-2xl, p-4
│       ├── Ícone: bg-primary (sólido), p-2, rounded-lg, "payments" (white)
│       ├── Label: "TOTAL DETECTADO" (label-caps, primary/70, 10px)
│       └── Valor: "R$ 24,50" (Sora 16px, on-surface)
│
└── SHUTTER CONTROLS (px-20px, pb-48px, flex column, items-center, gap-8)
    ├── CONTROLES HORIZONTAIS (flex, gap-12)
    │   ├── GALERIA: ícone + label, opacity-60
    │   ├── SHUTTER BUTTON (central):
    │   │   ├── Glow: absolute -inset-4, bg-primary/20, rounded-full, blur-xl
    │   │   ├── Outer ring: w-20 h-20, rounded-full, bg-white, p-1, shutter-glow
    │   │   └── Inner: rounded-full, border-2 border-primary/20, gradient from-primary-container to-primary
    │   │       └── Ícone: "camera" (white, text-3xl)
    │   └── RECUPERAR: ícone + label, opacity-60
    │
    └── FEEDBACK BAR: glass-panel, max-w-xs, rounded-full, py-3 px-6
        ├── Ícone "info" (primary, sm)
        └── "Posicione o recibo no centro" (14px, on-surface-variant)
```

> **Comportamento:** Os tooltips de OCR aparecem em tempo real à medida que o modelo processa a imagem. Eles devem "flutuar" com a animação `float`. A câmera dispara automaticamente quando detecta um recibo com boa qualidade.

---

### TELA 4 — Detail do Recibo (Resultado do OCR)

**Arquivo de referência:** `Image_10.html` | **Screenshot:** `Image_1.png`

**Propósito:** Exibe os dados extraídos pelo OCR para confirmação antes de salvar.

#### Layout
```
TopAppBar (arrow_back + "ReceiptAI" + bell + avatar)
│
└── MAIN CONTENT (pt-24, pb-32, px-20px, max-w-lg mx-auto)
    │
    ├── RECEIPT VISUAL SECTION — glass-card, rounded-[32px], p-2
    │   ├── Specular highlight: absolute inset-x-0 top-0 h-32 (overlay de luz)
    │   ├── Imagem do recibo: aspect-[3/4], grayscale + brightness-110 + mix-blend-multiply
    │   ├── Overlay: bg-primary/5 (tint sutil)
    │   ├── Anotação OCR: "DETECTADO: ESTABELECIMENTO"
    │   │   └── Pill: bg-primary/90, text-on-primary, label-caps, liquid-glow, backdrop-blur
    │   │       Linha divisória: h-0.5 bg-primary/30 blur-[1px]
    │   └── BTN ZOOM: absolute top-6 right-6, w-12 h-12, glass-card, rounded-full
    │
    ├── DATA FIELDS BENTO (grid, 2 cols, gap-4)
    │   │
    │   ├── ESTABELECIMENTO (col-span-2) — glass-card, rounded-[24px], p-5
    │   │   ├── Label: "ESTABELECIMENTO" (label-caps, on-surface-variant)
    │   │   ├── Valor: "Mercado Central Ltda" (Sora 32px/600, primary)
    │   │   └── BTN editar: "edit" ícone (outline-variant → primary no hover)
    │   │
    │   ├── DATA (col 1) — glass-card, rounded-[24px], p-5
    │   │   ├── Label: "DATA"
    │   │   └── Valor: "15 Out, 2023" (body-md semibold)
    │   │
    │   ├── CATEGORIA (col 2) — glass-card, rounded-[24px], p-5
    │   │   ├── Label: "CATEGORIA"
    │   │   └── Valor: ícone "shopping_cart" (primary 18px) + "Alimentação" (semibold)
    │   │
    │   └── VALOR TOTAL (col-span-2) — glass-card, rounded-[24px], p-5, bg-primary/5
    │       ├── Label: "VALOR TOTAL" (label-caps, primary)
    │       ├── Valor: "R$ 142,50" (Sora 32px, primary)
    │       └── Badge "BRL": bg-primary-container, on-primary-container, rounded-full
    │
    └── AI NOTIFICATION — glass-card, rounded-[24px], p-4, border-l-4 border-l-primary
        ├── Ícone: w-10 h-10, rounded-full, bg-primary-fixed, "auto_awesome" (FILL 1, primary-fixed-dim)
        └── Texto: "IA refinada." (bold, primary) + descrição (14px, on-surface-variant)

FAB CONFIRMAR & SALVAR (fixed, bottom-10, right-10, z-60)
  bg-primary, text-on-primary, px-8 py-4, rounded-full
  shadow: 0 20px 40px rgba(58,103,88,0.25)
  hover: scale(1.05) + overlay white/10
  ícone "check_circle" + "Confirmar & Salvar" (bold)

BottomNavBar: OCULTA (tela de detalhe transacional)
```

---

### TELA 5 — Insights (Relatórios Mensais)

**Arquivo de referência:** `Image_4.html` | **Screenshot:** `Image_4.png`

**Propósito:** Visão analítica profunda com comparativos mensais, categorias e previsões.

#### Layout
```
TopAppBar (avatar + "ReceiptAI" + bell)
│
└── MAIN (pt-24, px-20px, space-y-24px)
    │
    ├── HEADER
    │   ├── "Relatórios Mensais" (Sora 28px/600)
    │   └── "Uma visão detalhada da sua saúde financeira em Outubro." (muted)
    │
    ├── INSIGHTS HERO — glass-card, rounded-[2rem], p-6, overflow-hidden
    │   ├── Chip: "✦ INSIGHT DO MÊS" (label-caps, primary)
    │   ├── H2: "Suas despesas com 'Viagens' reduziram 12% em relação a Setembro."
    │   ├── Texto explicativo com valor em bold
    │   └── Ícone decorativo: seta para baixo com animação suave
    │
    ├── COMPARATIVO MENSAL — glass-card, rounded-[2rem], p-6
    │   ├── Título + legenda (Bruto / Líquido)
    │   └── Bar chart (6 meses, Maio → Out)
    │       ├── Cada barra: 2 layers (container/40 = bruto, primary = líquido)
    │       ├── Barra ativa (Out): container com glow shadow
    │       └── Labels: label-caps, muted (inativas) / primary bold (ativa)
    │
    ├── CATEGORIES LIST (md:4 cols)
    │   ├── Item Impostos: ícone account_balance (tertiary-container/30, text-tertiary)
    │   ├── Item Suprimentos: ícone inventory_2 (primary-container/30, text-primary)
    │   └── Item Viagens: ícone flight_takeoff (secondary-container/30, text-secondary)
    │   Cada item: glass-card, rounded-[2rem], p-6, flex, chevron_right, hover translate-x-1
    │
    ├── AUTOMATED FEED — "Processamento em Tempo Real"
    │   ├── Item ATIVO (border-l-4 border-l-primary, animate-pulse-slow):
    │   │   ├── Ícone "sync" (primary)
    │   │   ├── "Conciliando Notas Fiscais..." + timestamp "AGORA"
    │   │   └── Descrição (on-surface-variant)
    │   └── Item CONCLUÍDO (opacity-80):
    │       ├── Ícone "check_circle" (secondary)
    │       └── "Dedução de Impostos Calculada" + "2h atrás"
    │
    └── FORECAST CARD — glass-card, rounded-[2rem], p-8, text-center
        ├── "Previsão para Novembro" (Sora 28px)
        ├── Grid 3 colunas: Expectativa | Cashback | Status MEI
        │   (separados por w-px h-12 bg-outline-variant/30)
        └── BTN: "Exportar PDF Detalhado" — bg-primary, rounded-full, shadow-primary/20

BottomNavBar (Insights ativo)
FAB: OCULTO na tela de Insights
```

---

## 4. Arquitetura Técnica

### Stack Completa

| Camada | Tecnologia | Versão Recomendada |
|--------|-----------|-------------------|
| Mobile | React Native + Expo | Expo SDK 51+ |
| Roteamento mobile | Expo Router (file-based) | v3 |
| State management | Zustand | v4 |
| HTTP client mobile | Axios | v1 |
| Backend | NestJS | v10 |
| ORM | TypeORM | v0.3 |
| Database | PostgreSQL | 16-alpine |
| Cache | Redis | 7-alpine |
| OCR | Azure AI Vision (Read API v3.2) | — |
| Storage | Local (dev) / Azure Blob (prod) | — |
| Auth | JWT (passport-jwt) | — |
| Containerização | Docker + Docker Compose | — |
| Proxy reverso | Nginx | alpine |
| Docs API | Swagger (OpenAPI) | — |

---

### Diagrama de Fluxo (End-to-End)

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  React Native│     │   NestJS API  │     │  Azure Vision │
│   (Expo)     │     │   (NestJS)    │     │  (Read API)   │
└──────┬───────┘     └──────┬───────┘     └───────┬───────┘
       │                    │                      │
       │ 1. POST /receipt/upload                   │
       │ (multipart/form-data)                     │
       │──────────────────>│                      │
       │                    │ 2. Salva imagem      │
       │                    │    no storage        │
       │                    │ 3. POST /analyze     │
       │                    │──────────────────────>
       │                    │ 4. Poll resultado    │
       │                    │<──────────────────────
       │                    │ 5. OcrParserService  │
       │                    │    (extrai dados)    │
       │                    │ 6. Salva no DB       │
       │                    │    (receipt+expense) │
       │ 7. Retorna JSON    │                      │
       │<──────────────────│                      │
       │ { amount, merchant,│                      │
       │   category, date } │                      │
```

---

## 5. Estrutura de Arquivos (Monorepo)

```
receiptai/                          ← raiz do monorepo
├── package.json                    ← workspaces: apps/*, packages/*
├── docker-compose.yml              ← produção
├── docker-compose.dev.yml          ← desenvolvimento
├── .env.example                    ← template de variáveis
│
├── infra/
│   ├── nginx.conf                  ← proxy reverso + rate limiting
│   └── init.sql                    ← extensions PostgreSQL (uuid-ossp, pg_trgm)
│
├── apps/
│   │
│   ├── api/                        ← NestJS Backend
│   │   ├── Dockerfile
│   │   ├── Dockerfile.dev
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   └── src/
│   │       ├── main.ts             ← bootstrap, helmet, swagger, cors, pipes
│   │       ├── app.module.ts       ← root module (TypeORM, Config, Throttler)
│   │       │
│   │       ├── config/
│   │       │   └── typeorm.config.ts
│   │       │
│   │       └── modules/
│   │           ├── auth/
│   │           │   ├── auth.module.ts
│   │           │   ├── auth.controller.ts  ← POST /auth/register, /auth/login, /auth/me
│   │           │   ├── auth.service.ts     ← bcrypt, JWT, validação
│   │           │   ├── guards/
│   │           │   │   └── jwt-auth.guard.ts
│   │           │   └── strategies/
│   │           │       ├── jwt.strategy.ts
│   │           │       └── local.strategy.ts
│   │           │
│   │           ├── user/
│   │           │   ├── user.module.ts
│   │           │   ├── user.service.ts
│   │           │   └── entities/
│   │           │       └── user.entity.ts  ← id, email, name, password, profileType
│   │           │
│   │           ├── receipt/
│   │           │   ├── receipt.module.ts
│   │           │   ├── receipt.controller.ts  ← POST /receipt/upload, GET /receipt/:id
│   │           │   ├── receipt.service.ts     ← orquestra OCR + parser + save
│   │           │   ├── entities/
│   │           │   │   └── receipt.entity.ts  ← id, userId, imageUrl, rawText, status
│   │           │   └── services/
│   │           │       ├── azure-ocr.service.ts   ← Azure Vision Read API
│   │           │       └── ocr-parser.service.ts  ← regex parser (valor + merchant)
│   │           │
│   │           ├── expense/
│   │           │   ├── expense.module.ts
│   │           │   ├── expense.controller.ts  ← GET/PATCH/DELETE /expense
│   │           │   ├── expense.service.ts
│   │           │   └── entities/
│   │           │       └── expense.entity.ts  ← id, userId, amount, merchant, category
│   │           │
│   │           └── health/
│   │               └── health.controller.ts   ← GET /health
│   │
│   └── mobile/                     ← React Native + Expo
│       ├── app.json
│       ├── package.json
│       ├── tsconfig.json
│       ├── babel.config.js
│       └── src/
│           ├── app/                ← Expo Router (file-based routing)
│           │   ├── _layout.tsx     ← Root layout, AuthProvider, ThemeProvider
│           │   ├── index.tsx       ← Redirect para (auth) ou (tabs)
│           │   ├── (auth)/
│           │   │   ├── login.tsx
│           │   │   └── register.tsx
│           │   └── (tabs)/
│           │       ├── _layout.tsx ← BottomTabNavigator
│           │       ├── index.tsx   ← Home/Dashboard
│           │       ├── history.tsx ← Histórico de gastos
│           │       ├── scan.tsx    ← Câmera
│           │       ├── insights.tsx← Relatórios
│           │       └── settings.tsx
│           │
│           ├── components/
│           │   ├── ui/
│           │   │   ├── GlassCard.tsx
│           │   │   ├── StatusChip.tsx
│           │   │   ├── TopAppBar.tsx
│           │   │   ├── BottomNavBar.tsx
│           │   │   └── FAB.tsx
│           │   └── receipt/
│           │       ├── ExpenseItem.tsx
│           │       ├── ReceiptDetailCard.tsx
│           │       └── OcrTooltip.tsx
│           │
│           ├── features/
│           │   ├── auth/
│           │   │   ├── auth.store.ts      ← Zustand store
│           │   │   └── auth.service.ts
│           │   ├── receipt/
│           │   │   ├── receipt.service.ts ← upload + polling
│           │   │   ├── receipt.hooks.ts
│           │   │   └── receipt.types.ts
│           │   └── expense/
│           │       ├── expense.service.ts
│           │       └── expense.types.ts
│           │
│           ├── services/
│           │   └── api.ts              ← Axios instance + interceptors
│           │
│           ├── constants/
│           │   ├── colors.ts           ← todos os tokens de cor
│           │   └── typography.ts       ← escala tipográfica
│           │
│           └── utils/
│               ├── formatCurrency.ts
│               └── formatDate.ts
│
└── packages/
    └── shared/
        ├── package.json
        └── src/
            └── types/
                ├── expense.types.ts    ← interfaces compartilhadas
                └── receipt.types.ts
```

---

## 6. Banco de Dados

### Entidade: `users`
| Coluna | Tipo | Constraints | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK, default uuid_generate_v4() | |
| `email` | VARCHAR | UNIQUE, NOT NULL | |
| `name` | VARCHAR | NOT NULL | |
| `password` | VARCHAR | NOT NULL | bcrypt hash |
| `profile_type` | ENUM | NOT NULL, DEFAULT 'MEI' | MEI, FREELANCER, SMALL_BUSINESS |
| `avatar_url` | VARCHAR | NULLABLE | |
| `is_active` | BOOLEAN | DEFAULT true | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

### Entidade: `receipts`
| Coluna | Tipo | Constraints | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users.id | |
| `image_url` | VARCHAR | NOT NULL | path/url da imagem |
| `thumbnail_url` | VARCHAR | NULLABLE | versão menor |
| `raw_text` | TEXT | NULLABLE | texto bruto do OCR |
| `status` | ENUM | DEFAULT 'PENDING' | PENDING, PROCESSING, PROCESSED, FAILED |
| `error_message` | VARCHAR | NULLABLE | descrição do erro se FAILED |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

### Entidade: `expenses`
| Coluna | Tipo | Constraints | Descrição |
|--------|------|------------|-----------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users.id | |
| `receipt_id` | UUID | FK → receipts.id, NULLABLE | |
| `amount` | DECIMAL(10,2) | NOT NULL | valor em BRL |
| `merchant` | VARCHAR | NOT NULL | nome do estabelecimento |
| `category` | ENUM | DEFAULT 'OTHER' | FOOD, TRANSPORT, SUPPLIES, SOFTWARE, UTILITIES, SERVICES, OTHER |
| `expense_date` | DATE | NULLABLE | data do gasto (da nota) |
| `notes` | VARCHAR | NULLABLE | observações do usuário |
| `is_recurring` | BOOLEAN | DEFAULT false | |
| `currency` | VARCHAR(3) | DEFAULT 'BRL' | |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 7. API — Endpoints & Contratos

### Auth

#### `POST /api/auth/register`
```json
// Request
{
  "name": "Ricardo Silva",
  "email": "ricardo@email.com",
  "password": "MinhaSenh@123",
  "profileType": "MEI"
}

// Response 201
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "Ricardo Silva",
    "email": "ricardo@email.com",
    "profileType": "MEI"
  }
}
```

#### `POST /api/auth/login`
```json
// Request
{ "email": "ricardo@email.com", "password": "MinhaSenh@123" }

// Response 200
{
  "accessToken": "eyJhbGc...",
  "user": { "id": "uuid", "name": "Ricardo Silva", "email": "...", "profileType": "MEI" }
}
```

#### `GET /api/auth/me` (Authorization: Bearer {token})
```json
// Response 200
{
  "id": "uuid",
  "name": "Ricardo Silva",
  "email": "ricardo@email.com",
  "profileType": "MEI",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Receipt

#### `POST /api/receipt/upload` (multipart/form-data) — ROTA PRINCIPAL
```
Headers: Authorization: Bearer {token}, Content-Type: multipart/form-data
Body: file (image/jpeg|png|webp, max 10MB)
```
```json
// Response 201
{
  "receiptId": "uuid",
  "status": "PROCESSED",
  "data": {
    "amount": 97.60,
    "merchant": "MERCADO CENTRAL LTDA",
    "category": "FOOD",
    "date": "2023-10-15",
    "currency": "BRL",
    "rawText": "MERCADO CENTRAL LTDA\nCNPJ: 12.345...\n..."
  },
  "expenseId": "uuid"
}
```

**Estados possíveis da resposta:**
- `PROCESSED` → dados extraídos com sucesso
- `FAILED` → OCR falhou ou parser não encontrou dados

#### `GET /api/receipt/:id`
```json
// Response 200
{
  "id": "uuid",
  "imageUrl": "/uploads/receipts/uuid.jpg",
  "status": "PROCESSED",
  "rawText": "...",
  "expense": { "amount": 97.60, "merchant": "MERCADO CENTRAL LTDA", ... },
  "createdAt": "2024-01-15T14:32:00Z"
}
```

---

### Expense

#### `GET /api/expense` (paginado + filtros)
```
Query params:
  page: number (default 1)
  limit: number (default 20)
  category: string (opcional)
  startDate: YYYY-MM-DD (opcional)
  endDate: YYYY-MM-DD (opcional)
```
```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "amount": 249.90,
      "merchant": "AMAZON BRASIL",
      "category": "SUPPLIES",
      "expenseDate": "2023-10-15",
      "isRecurring": false,
      "status": "PROCESSED",
      "receipt": { "id": "uuid", "thumbnailUrl": "/uploads/..." },
      "createdAt": "2024-01-15T14:20:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

#### `GET /api/expense/summary` — Totais para Dashboard
```json
// Response 200
{
  "currentMonth": {
    "total": 4250.80,
    "deltaPercent": 12,
    "deltaDirection": "up"
  },
  "previousMonth": { "total": 3795.50 },
  "byCategory": [
    { "category": "FOOD", "total": 1240.00 },
    { "category": "TRANSPORT", "total": 840.00 },
    { "category": "SOFTWARE", "total": 2150.00 }
  ],
  "taxForecast": { "amount": 72.00, "percentOfLimit": 75 },
  "recentExpenses": [ /* últimos 5 */ ]
}
```

#### `PATCH /api/expense/:id` — Edição manual
```json
// Request (campos opcionais)
{
  "merchant": "MERCADO CENTRAL LTDA",
  "amount": 97.60,
  "category": "FOOD",
  "expenseDate": "2023-10-15",
  "notes": "Compras da semana"
}
```

#### `DELETE /api/expense/:id`
```
Response 204 No Content
```

---

### Health

#### `GET /api/health`
```json
{ "status": "ok", "timestamp": "2024-01-15T14:00:00Z" }
```

---

## 8. Lógica de OCR & Parser

### 8.1 Fluxo do OCR

```
1. Recebe imagem (multipart)
2. Salva no storage (local /uploads ou Azure Blob)
3. Gera thumbnail com Sharp (800px max, qualidade 80)
4. Atualiza receipt.status = 'PROCESSING'
5. Chama AzureOcrService.analyzeReceipt(imagePath)
   ├── Submit: POST {endpoint}/vision/v3.2/read/analyze
   │   Headers: Ocp-Apim-Subscription-Key
   │   Body: image buffer (octet-stream)
   ├── Lê header 'Operation-Location' da resposta
   └── Poll (a cada 2s, máx 15 tentativas = 30s):
       GET {operationLocation}
       Aguarda status = "succeeded" | "failed"
6. Extrai texto das linhas (readResults[].lines[].text)
7. Chama OcrParserService.parse(rawText)
8. Cria Expense com dados extraídos
9. Atualiza receipt.status = 'PROCESSED'
10. Retorna { receiptId, expenseId, data }
```

### 8.2 Algoritmo do Parser

#### Extração de Valor
```typescript
// Estratégia: keyword match → fallback maior valor
const KEYWORD_PATTERNS = [
  /^total\s*(a\s*pagar)?[\s:R$]*([\d.,]+)/i,
  /^valor\s*(total|liquido|bruto)?[\s:R$]*([\d.,]+)/i,
  /total[\s:]*R?\$?\s*([\d.,]+)/i,
];

// Formatos monetários suportados
"1.234,56"  → 1234.56  (BR formato com separador de milhar)
"234,56"    → 234.56   (BR formato simples)
"234.56"    → 234.56   (US formato)

// Fallback: extrai TODOS os valores monetários, retorna o MAIOR
// Racional: o total é sempre o maior valor em um recibo
```

#### Extração do Estabelecimento
```typescript
// Filtra as primeiras 8 linhas removendo:
const REMOVE_PATTERNS = [
  /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/,  // CNPJ
  /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/,           // CPF
  /^(nf-?e|nota\s+fiscal|cupom|cnpj|cpf)/i, // palavras fiscais
  /^\d[\d\s./:-]*$/,                         // linhas só com números
  /https?:\/\/|www\./i,                      // URLs
];

// Retorna a primeira linha "limpa" com 3–60 caracteres
// Transforma em UPPERCASE
```

#### Inferência de Categoria
```typescript
// Mapeamento por regex sobre merchant + todo o texto
{
  FOOD:      /supermercado|mercado|padaria|restaurante|ifood|rappi|açougue/i,
  TRANSPORT: /posto.*ipiranga|posto.*shell|uber|99|taxi|combustível|gasolina/i,
  SOFTWARE:  /aws|azure|google.*cloud|netflix|spotify|adobe|figma|notion|slack|zoom/i,
  UTILITIES: /energia.*elétrica|gás|telefone|claro|vivo|tim|oi|internet/i,
  SUPPLIES:  /papelaria|material.*escritório|toner|impressora/i,
  SERVICES:  /contador|advocacia|consultoria|manutenção|reparo/i,
  // DEFAULT: OTHER
}
```

### 8.3 Mock para Desenvolvimento (sem Azure)
Quando `AZURE_VISION_KEY` está vazio, o service retorna um recibo simulado com confiança 0.95. Isso permite desenvolver e testar o parser sem custos.

---

## 9. Infraestrutura & Docker

### Serviços Docker

| Serviço | Imagem | Porta | Função |
|---------|--------|-------|--------|
| `postgres` | postgres:16-alpine | 5432 | Banco principal |
| `redis` | redis:7-alpine | 6379 | Cache + sessões |
| `api` | build local | 3000 | NestJS API |
| `nginx` | nginx:alpine | 80, 443 | Proxy reverso + rate limit |

### Dockerfile da API (produção)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Dockerfile da API (desenvolvimento)
```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 9229
CMD ["npm", "run", "start:dev"]
```

### Nginx — Rate Limiting
```nginx
# API geral: 30 req/min
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;

# Upload: 10 req/min (mais restritivo — custo de OCR)
limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=10r/m;

# Tamanho máximo de upload: 10MB
client_max_body_size 10M;
```

### Security Headers (Nginx)
```
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer-when-downgrade
```

### Healthchecks (Docker Compose)
```yaml
postgres:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U receiptai"]
    interval: 10s
    retries: 5

redis:
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    retries: 5
```

### Volumes Persistentes
```
postgres_data  → dados do PostgreSQL
uploads_data   → imagens de recibos (compartilhado API ↔ Nginx)
```

---

## 10. Variáveis de Ambiente

```bash
# === DATABASE ===
POSTGRES_USER=receiptai
POSTGRES_PASSWORD=receiptai_pass       # TROCAR EM PRODUÇÃO
POSTGRES_DB=receiptai
DATABASE_URL=postgresql://receiptai:receiptai_pass@postgres:5432/receiptai

# === AUTH ===
JWT_SECRET=change_this_to_random_256bit_string   # CRÍTICO: trocar em produção
JWT_EXPIRES_IN=7d

# === AZURE OCR ===
AZURE_VISION_KEY=your_key_here         # Deixar vazio para usar mock em dev
AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/

# === STORAGE ===
STORAGE_TYPE=local                     # ou "azure"
UPLOAD_PATH=/app/uploads               # path interno do container
# Se azure:
# AZURE_STORAGE_CONNECTION_STRING=...
# AZURE_STORAGE_CONTAINER=receipts

# === APP ===
NODE_ENV=development                   # ou "production"
PORT=3000
ALLOWED_ORIGINS=http://localhost:8081  # origens do app mobile (produção: domínio real)
```

---

## 11. Fluxo de Dados End-to-End

### Fluxo Feliz: Scan de Recibo

```
MOBILE                          API                         AZURE / DB
  │                              │                              │
  │ 1. Usuário abre câmera       │                              │
  │    (scan.tsx)                │                              │
  │                              │                              │
  │ 2. Captura foto              │                              │
  │    (Expo Camera)             │                              │
  │                              │                              │
  │ 3. POST /receipt/upload      │                              │
  │ ───────────────────────────> │                              │
  │                              │ 4. Salva imagem (sharp)      │
  │                              │    Cria receipt (PENDING)    │
  │                              │                              │
  │                              │ 5. POST Azure Vision         │
  │                              │ ─────────────────────────────>
  │                              │                              │
  │                              │ 6. Poll (2s intervals)       │
  │                              │ <─────────────────────────────
  │                              │    status: "succeeded"       │
  │                              │                              │
  │                              │ 7. OcrParser.parse()         │
  │                              │    → amount, merchant,       │
  │                              │      category, date          │
  │                              │                              │
  │                              │ 8. Cria Expense              │
  │                              │    Atualiza Receipt→PROCESSED│
  │                              │                              │
  │ 9. Resposta com dados        │                              │
  │ <─────────────────────────── │                              │
  │                              │                              │
  │ 10. Navega para              │                              │
  │     result.tsx               │                              │
  │     (dados preenchidos)      │                              │
  │                              │                              │
  │ 11. Usuário confirma         │                              │
  │     "Confirmar & Salvar"     │                              │
  │                              │                              │
  │ 12. Navega para history      │                              │
```

---

## 12. Regras de Negócio Críticas

### Regra #1 — Confiança na Extração
> A métrica de sucesso central é: **o usuário confia no valor extraído?**
> Se a taxa de erro for alta, o produto perde toda sua proposta de valor.

**Estratégia de mitigação:**
- Sempre mostrar o valor extraído na tela de detalhe para confirmação
- Permitir edição manual de qualquer campo
- Registrar casos de falha (status FAILED) para análise posterior
- No parser, preferir falso-negativo (retornar null) a falso-positivo (retornar valor errado)

### Regra #2 — Upload Seguro
- Validar MIME type: apenas `image/jpeg`, `image/png`, `image/webp`
- Limite de tamanho: 10MB
- Gerar UUID para o nome do arquivo (nunca usar nome original do usuário)
- Armazenar fora do webroot público; servir via Nginx com path controlado

### Regra #3 — Autenticação em Todos os Endpoints
- Toda rota da API (exceto `/auth/login`, `/auth/register`, `/health`) exige `JwtAuthGuard`
- O `user_id` nunca vem do body da request — sempre extraído do JWT
- Queries de expense/receipt sempre filtram por `userId` (nunca listar dados de outros usuários)

### Regra #4 — Supressão da BottomNavBar
A BottomNavBar deve ser ocultada nas telas:
- Câmera (scan.tsx) — fluxo imersivo, sem distrações
- Detalhe do recibo (result.tsx) — fluxo de confirmação, apenas "Confirmar & Salvar"

Ela aparece em: Home, History, Insights, Settings.

### Regra #5 — Formato Monetário Brasileiro
- Sempre exibir valores como `R$ 1.234,56` (ponto para milhar, vírgula para decimal)
- Armazenar no banco como `DECIMAL(10,2)` (não float, para evitar imprecisão)
- Nunca usar `parseFloat` diretamente em strings BR — usar o parser próprio

### Regra #6 — Zero Input Manual no Happy Path
O fluxo ideal tem exatamente 2 interações do usuário:
1. Tirar a foto
2. Tocar em "Confirmar & Salvar"

Qualquer campo editável existe como fallback, não como fluxo principal.

---

## Referência Rápida de Implementação

### React Native — Tokens de cor para StyleSheet
```typescript
// src/constants/colors.ts
export const colors = {
  primary: '#3a6758',
  onPrimary: '#ffffff',
  primaryContainer: '#a7d7c5',
  onPrimaryContainer: '#325f51',
  primaryFixed: '#bcedda',
  surface: '#f9faf7',
  background: '#f9faf7',
  onSurface: '#1a1c1b',
  onSurfaceVariant: '#404945',
  surfaceContainerLowest: '#ffffff',
  surfaceContainer: '#edeeeb',
  outline: '#717975',
  outlineVariant: '#c0c8c3',
  error: '#ba1a1a',
  secondary: '#5c5f60',
  secondaryContainer: '#e1e3e4',
  tertiary: '#83514c',
  tertiaryContainer: '#febdb6',
} as const;
```

### React Native — GlassCard Component
```typescript
// Simula glassmorphism no RN com BlurView
import { BlurView } from 'expo-blur';

const GlassCard = ({ children, style }) => (
  <BlurView intensity={20} tint="light" style={[styles.card, style]}>
    {children}
  </BlurView>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    // Shadow iOS
    shadowColor: '#a7d7c5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    // Shadow Android
    elevation: 4,
  },
});
```

### Axios Instance (Mobile)
```typescript
// src/services/api.ts
import axios from 'axios';
import { authStore } from '../features/auth/auth.store';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30s para uploads com OCR
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) authStore.getState().logout();
    return Promise.reject(error);
  }
);
```

---

*Documento gerado com base nos arquivos de design (HTML, imagens, markdown de design system) e no documento de produto do ReceiptAI. Versão 1.0.*
