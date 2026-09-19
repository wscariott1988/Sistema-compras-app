# Smart Market PWA

Aplicação web progressiva para gestão inteligente de compras de supermercado, comparação de preços entre estabelecimentos e automação de leitura de notas fiscais (SEFAZ-RS). Mobile-first, construída com **Vite + React + Tailwind CSS + Lucide Icons + `html5-qrcode`**.

## 🚀 Funcionalidades

- **Mercado Campeão:** Card fixo no topo com o supermercado de menor custo total e o resumo de economia (dados da API).
- **Lista de Compras Rápida:** Busca instantânea por categoria, filtro "Apenas Marcados", toque para marcar/desmarcar com **Optimistic UI Update**, desmarcar todos e preços dos 4 mercados com o menor valor destacado em verde.
- **Leitor de QR Code:** Captura de NFC-e pela câmera (`html5-qrcode`), vibração no dispositivo, envio automático à API e redirecionamento para a Fila. Inclui digitação manual da chave de 44 dígitos e importação de imagem.
- **Fila de Processamento:** Monitor de sincronia com contadores, filtros por status e badges coloridas (Em Análise/Pendente, Processado, Com Alerta/Erro/Duplicada), sincronização manual e exportação CSV.
- **PWA Instalável:** Manifesto `standalone`, ícones, meta tags iOS/Android e service worker para cache da página.

## 🛠 Tech Stack

- **Frontend:** React 18 + Tailwind CSS 3 + Lucide Icons + `html5-qrcode`
- **Build:** Vite 5
- **Backend/API:** Google Apps Script (`API.gs`)
- **Database:** Google Sheets (`Smart_Market_DB`)
- **Hospedagem:** Vercel / Netlify

## 📁 Estrutura

```
├── public/                         # PWA: manifesto, ícones, service worker
│   ├── manifest.json
│   ├── icon-192.png / icon-512.png / icon-512-maskable.png / icon-180.png
│   └── sw.js
├── src/
│   ├── main.jsx                    # Bootstrap React + registro do SW
│   ├── App.jsx                     # Estado global, dados, toasts, navegação
│   ├── config.js                   # Leitura de VITE_API_URL (.env)
│   ├── index.css                   # Tailwind + tokens visuais
│   ├── services/api.js             # Cliente REST (GET + POST no-cors Apps Script)
│   ├── utils/format.js             # Formatação de moeda/data, mercado campeão
│   └── components/
│       ├── ChampionHeader.jsx      # Cartão Mercado Campeão (fixo no topo)
│       ├── ListaTab.jsx            # Aba 1 — lista de compras
│       ├── ItemCard.jsx            # Cartão de categoria com comparativo de preços
│       ├── BiparNota.jsx           # Aba 2 — leitor QR (lazy loaded)
│       ├── Fila.jsx                # Aba 3 — status da fila de notas
│       ├── BottomNav.jsx           # Navegação inferior fixa
│       └── Toast.jsx               # Feedback visual global
└── vercel.json                     # Rewrite SPA + headers do service worker
```

## ⚙️ Configuração da API

Defina a URL do Google Apps Script em `.env` (copie o `.env.example`):

```env
VITE_API_URL=https://script.google.com/macros/s/AKfycbwcC0JWqnKcogFhnEko2jF7o4px6-SxsUJs1yoww5wZS_jrZD07ryVLPkvVSgvGNM0t/exec
```

> Se a variável não estiver definida, o `src/config.js` usa essa mesma URL como fallback.

### Contratos da API

**GET `${VITE_API_URL}`** — carrega dados gerais:

```json
{
  "campeao": "Atacadão",
  "resumoCustos": "Economia de R$ 18,83 (40,6%) em relação ao mais caro",
  "itens": [
    {
      "linha": 8,
      "comprar": true,
      "categoria": "Água Mineral",
      "rissul": 1.69,
      "macromix": 1.59,
      "fort": 1.49,
      "atacadao": 1.39,
      "ultimaCompra": "R$ 1.39 (Atacadão em 12/03)",
      "mercadoMaisBarato": "Atacadão"
    }
  ],
  "fila": [
    { "id": "FILA_123", "data": "2026-09-19", "url": "https://...", "status": "Pendente" }
  ]
}
```

**POST** (payload em `text/plain`, modo `no-cors` — padrão do Apps Script):

| Ação            | Payload                                   |
| --------------- | ----------------------------------------- |
| `toggleItem`    | `{ "action": "toggleItem", "linha", "comprar" }` |
| `biparNota`     | `{ "action": "biparNota", "url" }`        |
| `desmarcarTodos`| `{ "action": "desmarcarTodos" }`          |

## 🧑‍💻 Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173 (preferencialmente no celular, com acesso à câmera via HTTPS ou `localhost`).

## 🚢 Deploy na Vercel

O projeto já inclui `vercel.json` (rewrite SPA + headers do SW).

**Opção 1 — CLI:**

```bash
npm i -g vercel
vercel
```

**Opção 2 — Dashboard (recomendado):**

1. Crie um projeto em [vercel.com/new](https://vercel.com/new) e importe este repositório.
2. Ajustes automáticos: framework **Vite**, build `npm run build`, output `dist`.
3. Em **Settings → Environment Variables**, adicione `VITE_API_URL` com a URL da API.
4. Deploy.

> Dica: para testar a câmera/scanner no celular, use HTTPS (a URL de produção da Vercel já é HTTPS). O recurso "Add to Home Screen" do iOS/Android ativa o modo `standalone` do manifesto.

## 🧹 Scripts

| Comando             | Descrição                          |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Ambiente de desenvolvimento        |
| `npm run build`     | Build de produção em `dist/`      |
| `npm run preview`   | Pré-visualização do build          |