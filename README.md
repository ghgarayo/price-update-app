# Aplicação para atualização massiva de preços

### === Instalação === 

Acesse o arquivo .env.example para referências do que será necessário adicionar no seu arquivo .env na raiz da pasta server.

Acessar a pasta server e rodar o comando:
"npm install" 

Após isso, dentro da pasta web, rode novamente o comando:
"npm install"

Caso você não tenha as tabelas e os dados carregados no banco de dados , você poderá executar o comando dentro da pasta server: 
"npm run knex -- migrate:latest"

### === Informações === 

O back-end foi desenvolvido em Node.JS e o framework Fastify. Para o banco de dados, utilizado o MySQL 8.0 e 
o query builder Knex para facilitar as operações e versionamento (migrations).

O front-end foi desenvolvido em React, utilizando o framework Next.JS. Para estilização, foi adicionado Tailwind CSS. 

Para padronização do código escrito, foi utilizado a biblioteca ESLint com o preset de configuração da Rocketseat. 
