# SIASD WebApp

Este repositório contém um projeto TypeScript + React configurado com Vite.js. O Vite.js é uma estrutura de compilação extremamente rápida para o desenvolvimento de aplicativos da web modernos.

## Visão Geral

O projeto utiliza as seguintes tecnologias principais:

- [TypeScript](https://www.typescriptlang.org/): Uma linguagem de programação que é uma extensão do JavaScript, oferecendo tipagem estática.

- [React](https://reactjs.org/): Uma biblioteca JavaScript para criar interfaces de usuário.

- [Vite.js](https://vitejs.dev/): Um construtor de aplicações web rápido e flexível que oferece desenvolvimento instantâneo com carregamento rápido.

- [SASS](https://sass-lang.com/): Um pré-processador CSS que permite estilizar seu aplicativo de forma mais eficiente e organizada.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu sistema. A versão mínima do Node.js suportada é a 16.

## Configuração do Ambiente de Desenvolvimento

Siga estas etapas para configurar o ambiente de desenvolvimento e iniciar o projeto:

### Passo 1: Instale as dependências

Navegue até o diretório do projeto e execute o seguinte comando para instalar as dependências:

```bash
npm install
```

### Passo 4: Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Isso iniciará o servidor de desenvolvimento do Vite.js. Você pode acessar o aplicativo em [http://localhost:3000](http://localhost:5173).

### Executando Testes

Para executar os testes do projeto, use o seguinte comando:

```bash
npm test
```

### Construindo o Projeto para Produção

Para criar uma versão otimizada para produção do projeto, utilize o seguinte comando:

```bash
npm run build
```

Isso criará uma pasta `dist` contendo os arquivos de produção.

Claro, vou criar uma documentação de introdução ao Redux Toolkit, excluindo o passo de instalação. O Redux Toolkit é uma biblioteca que simplifica o gerenciamento de estado em aplicativos React com Redux. O Redux Toolkit fornece utilitários e padrões de projeto para tornar o desenvolvimento com Redux mais produtivo e eficiente.

## Introdução ao Redux Toolkit

O Redux Toolkit é uma biblioteca oficial do Redux que visa simplificar e melhorar a experiência de uso do Redux em aplicativos React. Ele fornece um conjunto de utilitários, padrões de projeto e configurações padrão para que você possa escrever código Redux mais facilmente, com menos boilerplate e melhor desempenho. Abaixo, apresentaremos os principais recursos e conceitos do Redux Toolkit.

### Configuração Básica

#### Configuração do Store

O Redux Toolkit facilita a criação do store Redux. Você pode criar um store com `configureStore`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Importe seu reducer principal

const store = configureStore({
  reducer: rootReducer,
  // Configurações adicionais, como middleware, devTools, etc.
});

export default store;
```

#### Definindo Reducers

O Redux Toolkit permite definir reducers usando a função `createSlice`. Isso reduz a quantidade de código e aumenta a legibilidade:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

### Uso no Componente React

Para usar o Redux Toolkit em um componente React, você pode usar os hooks `useSelector` e `useDispatch` fornecidos pela biblioteca `react-redux`. Aqui está um exemplo simples:

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice'; // Importe suas actions

function Counter() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default Counter;
```

### Benefícios do Redux Toolkit

O Redux Toolkit oferece várias vantagens:

- Menos boilerplate: Reduz a quantidade de código necessário para criar reducers, actions e stores.
- Padrões de projeto recomendados: Define padrões de projeto recomendados para estruturar seu código Redux.
- Imutabilidade: Facilita a criação de código imutável com `immer`, permitindo a modificação direta do estado.
- DevTools integrados: Integração simples com as DevTools do Redux.
- Melhor desempenho: O Redux Toolkit otimiza a performance do Redux.

### Próximos Passos

Esta é apenas uma introdução ao Redux Toolkit. À medida que você se aprofundar, pode explorar recursos avançados, como a criação de middlewares personalizados, controle de assincronia com `createAsyncThunk`, e muito mais. A documentação oficial do Redux Toolkit é um excelente recurso para aprender mais: [Redux Toolkit Documentation](https://redux-toolkit.js.org/).

## Estrutura do Projeto

A estrutura do projeto segue as convenções padrão do Vite.js para projetos React.

```
src/
  ├─ components/
  │   ├─ containers/
  │   │   ├─ ContainerA/
  │   │   │   ├─ ContainerA.tsx
  │   │   │   └─ ContainerA.module.scss
  │   │   │
  │   │   ├─ ContainerB/
  │   │   │   ├─ ContainerB.tsx
  │   │   │   └─ ContainerB.module.scss
  │   │   │
  │   │   └─ ...
  │   │
  │   ├─ elements/
  │   │   ├─ ElementA/
  │   │   │   ├─ ElementA.tsx
  │   │   │   └─ ElementA.module.scss
  │   │   │
  │   │   ├─ ElementB/
  │   │   │   ├─ ElementB.tsx
  │   │   │   └─ ElementB.module.scss
  │   │   │
  │   │   └─ ...
  │   │
  ├─ public/
  │   ├─ pt-br/
  │   │   ├─ translations.json
  │   │   └─ ...
  │   ├─ en-us/
  │   │   ├─ translations.json
  │   │   └─ ...
  │   ├─ es/
  │   │   ├─ translations.json
  │   │   └─ ...
  │   └─ ...
  ├─ package.json
  ├─ tsconfig.json
```

Dentro da pasta `components`, você pode criar um arquivo `index.ts` que exporta cada componente como padrão:

```tsx
// components/index.ts
export { default as ComponentA } from './ComponentA/ComponentA';
export { default as ComponentB } from './ComponentB/ComponentB';
// Exporte outros componentes aqui, se necessário
```

Neste exemplo, estamos exportando `ComponentA` e `ComponentB` como padrão usando a sintaxe `export { default as ComponentName }`.

Agora, você pode importar esses componentes em outros lugares do seu código da seguinte maneira:

```tsx
import { ComponentA, ComponentB } from '../components';
```

Isso permite que você importe vários componentes de forma mais concisa e legível, diretamente da pasta `components`. Certifique-se de adicionar todos os seus componentes no arquivo `index.ts` para que possam ser importados dessa forma.

## Tecnologias utilizadas

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Vite.js](https://vitejs.dev/)

Divirta-se desenvolvendo seu projeto com TypeScript, React e Vite.js!
