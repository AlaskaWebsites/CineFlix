# CineFlix: Sistema de Gerenciamento de Locadora de Filmes

## Descrição do Projeto

Este projeto consiste no desenvolvimento de uma interface web para o gerenciamento completo de uma locadora de filmes, com foco em Usuários (Funcionários), Clientes, Filmes (consumindo uma API externa) e Locações. O objetivo é fornecer uma ferramenta intuitiva para o controle das operações diárias da locadora, desde o cadastro de informações até o registro e acompanhamento das locações.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias e frameworks, conforme os requisitos do desafio:

* **Vue.js 3**: Framework progressivo para construção de interfaces de usuário.
* **TypeScript 5.x**: Superset do JavaScript que adiciona tipagem estática, garantindo maior robustez e manutenibilidade do código.
* **Tailwind CSS 3.x**: Framework de CSS utilitário, utilizado para estilização rápida e responsiva da interface.
* **Vite 5.x**: Ferramenta de build de nova geração que oferece uma experiência de desenvolvimento frontend extremamente rápida.
* **Pinia 3.x**: Gerenciador de estado para Vue.js, utilizado para centralizar e otimizar o fluxo de dados da aplicação.
* **Vue Router 4.x**: Biblioteca de roteamento oficial para Vue.js, responsável pela navegação entre as diferentes telas da aplicação.
* **Axios 1.x**: Cliente HTTP baseado em Promises para o navegador e Node.js, utilizado para consumir APIs externas.
* **UUID 11.x**: Biblioteca para geração de IDs únicos (UUIDs), utilizada para identificar registros de Usuários, Clientes e Locações.

## Funcionalidades Implementadas

A aplicação cobre as seguintes funcionalidades essenciais:

### 1. **Usuários (Funcionários)**
* **Cadastro**: Registro de novos funcionários com `id`, `nome`, `documento` (CPF), `senha` (em texto simples para fins do desafio) e `status`. Todos os campos são obrigatórios.
* **Edição**: Atualização dos dados de funcionários existentes. A senha não é exibida ou exigida para edição.
* **Listagem**: Visualização de todos os funcionários cadastrados em formato de tabela.
* **Desativação (Soft Delete)**: Capacidade de alterar o `status` do usuário entre 'ativo' e 'inativo', sem remover o registro. Usuários 'inativos' não podem logar.
* **Login/Logout**: Sistema de autenticação que permite o acesso de usuários 'ativos' e mantém o usuário logado ao revisitar o aplicativo (persistência via Local Storage).

### 2. **Clientes**
* **Cadastro**: Registro de novos clientes com `id`, `nome`, `sobrenome`, `cpf`, `contatos` (email e celular) e `endereço`.
* **Edição**: Atualização dos dados de clientes existentes.
* **Listagem**: Visualização de todos os clientes cadastrados em formato de tabela.
* **Desativação (Soft Delete)**: Capacidade de alterar o `status` do cliente entre 'ativo' e 'inativo'.
* **Busca e Filtros**:
    * Listagem de clientes com busca por `nome` (primeiro ou sobrenome) e `documento` (CPF).
    * Filtro por `status` (ativo ou inativo).
* **Integração ViaCEP**: Ao digitar o CEP, as informações de `logradouro`, `bairro`, `cidade` e `uf` são automaticamente buscadas na API do ViaCEP (`https://viacep.com.br/`). Caso o CEP não seja encontrado, permite a edição manual dos campos de endereço.

### 3. **Filmes**
* **Consumo da API OMDb**: Integração com a API da OMDb (`https://www.omdbapi.com/`) para buscar informações sobre filmes.
* **Listagem**: Exibição dos filmes buscados em um formato de grid. Apenas filmes (`Type: 'movie'`) são listados.
* **Busca e Filtros**:
    * Busca por `nome` (título do filme).
    * Filtro por `ano` de lançamento.
* **Paginação**: Funcionalidade de "carregar mais" para exibir resultados adicionais da busca.
* **Tratamento de Pôsteres**: Exibe o pôster do filme, com um fallback para imagem genérica caso o pôster não esteja disponível.

### 4. **Locações**
* **Nova Locação**: Registro de novas locações, associando um `cliente`, `filmes` (múltiplos filmes por locação), `datas de locação e entrega`, e o `usuário` (funcionário) que realizou a locação.
* **Listagem**: Visualização de todas as locações registradas em formato de tabela.
* **Status**: Locações possuem status 'alugado' (inicial) e 'entregue'. Há funcionalidade para marcar uma locação como 'entregue'.
* **Busca e Filtros**:
    * Busca por `cliente` (nome completo).
    * Filtro por `datas de locação` e `datas de entrega`.
* **Regras de Negócio**:
    * Clientes com uma locação em status 'alugado' não podem realizar outra locação até que a anterior seja marcada como 'entregue'.
    * Usuários desativados não podem registrar locações.

### **Detalhes de Implementação Comuns**
* **Armazenamento Local**: Todos os dados (Usuários, Clientes, Locações) são armazenados no `localStorage` do navegador para persistência.
* **Feedback Visual**: Todas as operações de criação, edição e alteração de status exibem um feedback visual de sucesso ou falha (mensagens de alerta nos formulários).
* **Nomenclatura**: Classes, métodos e rotas seguem o padrão americano (inglês).
* **Componentização e Responsabilidade**: A aplicação é estruturada com componentes reutilizáveis, seguindo o padrão de layouts dinâmicos para autenticação e dashboard.

### **Requisitos Adicionais**
* **Responsividade**: O layout é adaptável a diferentes tamanhos de tela (design mobile-first com Tailwind CSS).
* **Componentização**: Componentes são bem definidos e reutilizáveis (e.g., layouts, formulários, tabelas).
* **Uso de Design Atômico (Implicitamente)**: Embora não haja uma divisão explícita de pastas Atomos/Moléculas/Organismos, a estrutura de componentes (inputs, botões, tabelas nas views) e a organização das stores e serviços reflete uma separação de responsabilidades alinhada aos princípios do design atômico.

## Estrutura do Projeto

├── public/                 # Arquivos estáticos (ex: logo)
├── src/
│   ├── assets/
│   │   ├── img/            # Imagens do projeto
│   │   └── styles/         # Estilos globais (main.css)
│   ├── components/         # Componentes reutilizáveis (botões, cards, modais - a serem desenvolvidos/organizados)
│   ├── layouts/            # Layouts principais (Auth, Default)
│   │   ├── Auth/
│   │   └── Default/
│   ├── router/             # Configuração de rotas (index.ts)
│   ├── services/           # Funções para interação com APIs externas e Local Storage
│   │   ├── api.ts          # Instância do Axios
│   │   ├── localStorageService.ts
│   │   ├── omdbService.ts
│   │   └── viacepService.ts
│   ├── stores/             # Stores Pinia para gerenciamento de estado
│   │   ├── auth.ts
│   │   ├── clients.ts
│   │   ├── movies.ts
│   │   ├── rentals.ts
│   │   └── users.ts
│   ├── types/              # Definições de interfaces TypeScript para modelos de dados
│   │   ├── Client.ts
│   │   ├── Movie.ts
│   │   ├── Rental.ts
│   │   └── User.ts
│   ├── utils/              # Funções utilitárias (ex: idGenerator)
│   │   └── idGenerator.ts
│   ├── views/              # Componentes de tela/página (mapeados às rotas)
│   │   ├── Auth/           # Tela de Login
│   │   ├── Register/       # Tela de Cadastro de Usuário
│   │   ├── Dashboard/      # Container principal do Dashboard
│   │   ├── DashboardHome/  # Página inicial do Dashboard
│   │   ├── Users/          # Listagem de Usuários
│   │   ├── UserForm/       # Formulário de Usuário (Cadastro/Edição)
│   │   ├── Clients/        # Listagem de Clientes
│   │   ├── ClientForm/     # Formulário de Cliente (Cadastro/Edição)
│   │   ├── Movies/         # Listagem de Filmes
│   │   ├── Rentals/        # Listagem de Locações
│   │   └── RentalForm/     # Formulário de Locação (Nova Locação)
│   ├── App.vue             # Componente raiz da aplicação
│   └── main.ts             # Ponto de entrada da aplicação Vue
├── .gitignore
├── index.html              # Arquivo HTML principal
├── package.json            # Dependências e scripts do projeto
├── postcss.config.js       # Configuração do PostCSS para Tailwind CSS
├── tailwind.config.js      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração TypeScript
├── tsconfig.app.json       # Configuração TypeScript para o app
├── tsconfig.node.json      # Configuração TypeScript para ambiente Node.js (Vite)
├── vite.config.ts          # Configuração do Vite
└── vercel.json             # Configuração para deploy na Vercel

## Como Executar a Aplicação

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local:

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/en/) (versão LTS recomendada) e o [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js) instalados.

### Instalação

1.  **Clone o repositório** (se ainda não o fez):
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd cineflix
    ```
2.  **Instale as dependências** do projeto:
    ```bash
    npm install
    ```

### Execução

1.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173/` (ou outra porta indicada no terminal).

2.  **Para gerar um build de produção** (otimizado para deploy):
    ```bash
    npm run build
    ```
    Os arquivos gerados estarão na pasta `dist/`.

3.  **Para pré-visualizar o build de produção**:
    ```bash
    npm run preview
    ```