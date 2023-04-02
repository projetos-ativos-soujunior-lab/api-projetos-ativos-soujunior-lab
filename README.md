# Projetos Ativos API

## Development

```sh
# Dependências
npm install

npm run dev
```

Acesse: <http://localhost:5002>

## Build & Start

```sh
# Dependências
npm install

npm run build

npm run start
```

## GitHub Token

Para evitar erro de [limitação de taxa](https://docs.github.com/pt/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#rate-limiting) utilize um token do GitHub. O limite de taxa restringe chamadas para a API do GitHub.

O token pode ser obtido na sua conta do GitHub em **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**.

No arquivo `.env` adicione seu token em `GITHUB_TOKEN` seguindo o exemplo do arquivo [.env.exemple](/.env.exemple).

```yaml
GITHUB_TOKEN=github_pat_11AM...
```
