# Backend

## Pré-requisitos

- Node.js (v14+)
- MongoDB Atlas ou instância MongoDB acessível

## Instalação

1. Clone este repositório e navegue até à pasta `backend`:
   ```bash
   git clone https://github.com/MistaPaulo/moviecatalogue_backend.git
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do diretório `backend` com o seguinte formato:
```
MONGODB_URI=<URI de conexão MongoDB Atlas>
DB_NAME=sample_mflix
JWT_SECRET=<Segredo para JWT>
PORT=<Porta de Rede>
```

## Executar Localmente

- **Modo produção**  
  ```bash
  npm start
  ```

- **Modo desenvolvimento** (com hot-reload via nodemon)  
  ```bash
  npm run dev
  ```
