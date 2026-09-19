# Smart Market RS - Arquitetura V2 (PWA Serverless)

## 1. Visão Geral da Arquitetura
A versão 2 elimina a dependência do AppSheet e do servidor Python legado (FastAPI), migrando para uma arquitetura PWA Serverless mobile-first. A lógica de raspagem e o banco de dados estão centralizados no ecossistema Google Workspace.

## 2. Fluxo de Dados Integrado

[ PWA Mobile (React / Vercel) ]
│ 
│ (1. Ações: Bipar QR Code, Marcar/Desmarcar Item, Filtrar Lista)
▼
[ Google Apps Script API (`API.gs`) ]
│
│ (2. Roteamento HTTP: `doGet` para leitura JSON, `doPost` para atualização)
│ (3. Robô Extrator: Leitura direta na SEFAZ-RS via UrlFetchApp)
▼
[ Google Sheets (`Smart_Market_DB`) ]
  ├── Aba `Lista_Compras_Rapida`: Estado das seleções e Mercado Campeão
  ├── Aba `Fila_Notas`: Fila de QR Codes recebidos
  └── Aba `Produtos_Comprados`: Itens processados pelo robô