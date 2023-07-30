# Projetos Ativos API

## Requisitos

* [NodeJS](https://nodejs.org/en)
* [GitHub Token](#github-token)

## Execução

1. Clone este projeto
2. Copie o arquivo .env.exemple e o renomeie para .env
3. Adicione seu [token do GitHub](#github-token) ao arquivo .env

    ```.env
    GITHUB_TOKEN=github_pat_11AM..
    ```

4. Instale as dependências

    ```sh
    npm install
    ```

5. Compile e execute o projeto

    ```sh
    npm run build && npm run start
    ```

## Development

```sh
# Dependências
npm install

npm run start:dev
```

Acesse: <http://localhost:5000>

## Build

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
