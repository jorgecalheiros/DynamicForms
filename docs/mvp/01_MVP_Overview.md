# DynamicForms MVP - Overview

## 📊 Visão Geral do Projeto

### Objetivo do MVP
Construir uma aplicação React standalone que renderize formulários dinâmicos a partir de um schema JSON estático, validando o conceito de **"frontend sem conhecimento prévio do schema"**.

### Por Que Este MVP?
- ✅ **Validação rápida** do conceito core sem complexidade de backend
- ✅ **Demonstração visual** para stakeholders e potenciais investidores
- ✅ **Prova técnica** de que o motor de renderização funciona
- ✅ **Base sólida** para evolução incremental (backend → microserviços)
- ✅ **Feedback rápido** sobre UX e estrutura de dados

---

## 🎯 Escopo do MVP

### O Que Está DENTRO do Escopo

#### 1. Renderização Dinâmica de Formulários
- Carregar schema JSON mockado (sem backend)
- Renderizar campos baseados 100% no schema
- Suportar 7 tipos de campo essenciais:
  - `text` - Input de texto simples
  - `number` - Input numérico com min/max
  - `select` - Dropdown (simples e múltiplo)
  - `textarea` - Texto longo multi-linha
  - `checkbox` - Sim/Não ou opções múltiplas
  - `radio` - Escolha única entre opções
  - `date` - Seletor de data

#### 2. Validação Client-Side
- Campos obrigatórios (`required`)
- Min/Max length para texto
- Min/Max value para números
- Pattern validation (regex básico para email, telefone, etc.)
- Mensagens de erro claras e contextuais

#### 3. Submissão de Formulário
- Coletar todos os valores preenchidos
- Validar antes de permitir submit
- Exibir JSON resultante (console + modal)
- Simular resposta de "envio bem-sucedido"
- Resetar formulário após sucesso

#### 4. UI/UX Básica mas Profissional
- Layout responsivo (mobile-first)
- Feedback visual de validação (cores, ícones)
- Loading states ao carregar schemas
- Success/Error messages
- Acessibilidade básica (labels, aria-labels)

### O Que Está FORA do Escopo

❌ **Backend API** - Nenhuma chamada HTTP real  
❌ **Banco de Dados** - Sem persistência real  
❌ **Versionamento** - Apenas um schema por formulário  
❌ **Autenticação/Autorização** - Sem controle de acesso  
❌ **Multi-tenant** - Apenas single-user  
❌ **Multilingual** - Apenas português/inglês hardcoded  
❌ **Upload de Arquivos** - Sem storage real (apenas simulação)  
❌ **Validações Server-Side** - Apenas client-side  
❌ **Analytics/Tracking** - Sem métricas de uso  
❌ **Testes Automatizados** - Apenas testes manuais  

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológica Escolhida

```
┌─────────────────────────────────────────────┐
│           React Application                 │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      Components Layer                 │ │
│  │  - DynamicForm (container)            │ │
│  │  - FieldRenderer (factory pattern)    │ │
│  │  - 7x Field Components (text, select) │ │
│  │  - UI Components (modal, spinner)     │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      State Management                 │ │
│  │  - React Hook Form (forms & validation)│ │
│  │  - Context API (schema sharing)       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      Data Layer                       │ │
│  │  - Mock JSON schemas (public/schemas) │ │
│  │  - Schema validator utility           │ │
│  │  - Field type registry                │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Bibliotecas Core

| Biblioteca | Versão | Propósito | Por Quê? |
|------------|--------|-----------|----------|
| **React** | 18.x | Framework UI | Padrão da indústria, componentização |
| **React Hook Form** | 7.x | Gerenciamento de formulários | Performance, validação integrada, menos re-renders |
| **Zod** | 3.x | Schema validation | Type-safe, composável, integra perfeitamente com RHF |
| **TailwindCSS** | 3.x | Estilização | Prototipagem rápida, responsivo out-of-the-box |
| **Vite** | 5.x | Build tool | HMR ultra-rápido, DX superior ao CRA |

### Bibliotecas Auxiliares

| Biblioteca | Propósito | Essencial? |
|------------|-----------|------------|
| **date-fns** | Manipulação de datas | Sim (para DateField) |
| **React Router** | Navegação entre forms | Opcional (MVP pode ter 1 form fixo) |
| **clsx** | Conditional CSS classes | Opcional (melhora DX) |

---

## 📁 Estrutura do Projeto

```
dynamic-forms-mvp/
│
├── public/
│   └── schemas/                         # ← JSONs mockados
│       ├── contact-form.json            # Formulário de contato
│       ├── survey-form.json             # Pesquisa de satisfação
│       └── registration-form.json       # Cadastro de usuário
│
├── src/
│   │
│   ├── components/
│   │   ├── DynamicForm/
│   │   │   ├── DynamicForm.jsx          # Container principal do form
│   │   │   ├── FieldRenderer.jsx        # Factory que escolhe qual campo renderizar
│   │   │   └── SubmitButton.jsx         # Botão de submit com loading
│   │   │
│   │   ├── fields/                      # ← Componentes de campo
│   │   │   ├── TextField.jsx            # Input text
│   │   │   ├── NumberField.jsx          # Input number
│   │   │   ├── SelectField.jsx          # Select/dropdown
│   │   │   ├── TextAreaField.jsx        # Textarea
│   │   │   ├── CheckboxField.jsx        # Checkbox
│   │   │   ├── RadioField.jsx           # Radio buttons
│   │   │   ├── DateField.jsx            # Date picker
│   │   │   └── FieldWrapper.jsx         # Wrapper com label + error
│   │   │
│   │   └── ui/                          # ← Componentes de UI
│   │       ├── ValidationMessage.jsx    # Mensagem de erro
│   │       ├── LoadingSpinner.jsx       # Spinner de carregamento
│   │       └── SuccessModal.jsx         # Modal de sucesso
│   │
│   ├── hooks/
│   │   ├── useFormSchema.js             # Hook para carregar schema JSON
│   │   └── useFormSubmit.js             # Hook com lógica de submit
│   │
│   ├── utils/
│   │   ├── schemaValidator.js           # Valida estrutura do schema JSON
│   │   ├── fieldTypeRegistry.js         # Define tipos de campo permitidos
│   │   └── validationRules.js           # Regras de validação reutilizáveis
│   │
│   ├── types/
│   │   └── schema.types.js              # JSDoc types (ou .d.ts se usar TS)
│   │
│   ├── App.jsx                          # Componente raiz
│   ├── main.jsx                         # Entry point
│   └── index.css                        # Tailwind imports
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .eslintrc.cjs
├── .gitignore
└── README.md
```

---

## 📋 Estrutura do Schema JSON

### Exemplo Completo

```json
{
  "formId": "contact-form-v1",
  "title": "Formulário de Contato",
  "description": "Entre em contato com nossa equipe",
  "fields": [
    {
      "key": "name",
      "type": "text",
      "label": "Nome Completo",
      "order": 1,
      "config": {
        "required": true,
        "minLength": 3,
        "maxLength": 100,
        "placeholder": "Digite seu nome"
      }
    },
    {
      "key": "email",
      "type": "text",
      "label": "E-mail",
      "order": 2,
      "config": {
        "required": true,
        "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        "placeholder": "seu@email.com"
      }
    },
    {
      "key": "subject",
      "type": "select",
      "label": "Assunto",
      "order": 3,
      "config": {
        "required": true,
        "options": [
          { "value": "support", "label": "Suporte Técnico" },
          { "value": "sales", "label": "Vendas" },
          { "value": "other", "label": "Outro" }
        ]
      }
    },
    {
      "key": "message",
      "type": "textarea",
      "label": "Mensagem",
      "order": 4,
      "config": {
        "required": true,
        "minLength": 10,
        "maxLength": 500,
        "rows": 5,
        "placeholder": "Descreva sua solicitação..."
      }
    },
    {
      "key": "urgency",
      "type": "radio",
      "label": "Urgência",
      "order": 5,
      "config": {
        "required": true,
        "options": [
          { "value": "low", "label": "Baixa" },
          { "value": "medium", "label": "Média" },
          { "value": "high", "label": "Alta" }
        ]
      }
    },
    {
      "key": "subscribe",
      "type": "checkbox",
      "label": "Desejo receber novidades por e-mail",
      "order": 6,
      "config": {
        "required": false
      }
    }
  ]
}
```

### Propriedades do Schema

#### Nível Root
| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `formId` | string | ✅ Sim | Identificador único do formulário |
| `title` | string | ✅ Sim | Título exibido ao usuário |
| `description` | string | ❌ Não | Descrição/instruções |
| `fields` | array | ✅ Sim | Lista de campos |

#### Nível Field
| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `key` | string | ✅ Sim | Identificador técnico único (imutável) |
| `type` | string | ✅ Sim | Tipo do campo (text, number, select, etc.) |
| `label` | string | ✅ Sim | Label exibido ao usuário |
| `order` | number | ✅ Sim | Ordem de exibição (1, 2, 3...) |
| `config` | object | ✅ Sim | Configurações específicas do tipo |

#### Config por Tipo de Campo

**text**
```json
{
  "required": boolean,
  "minLength": number,
  "maxLength": number,
  "placeholder": string,
  "pattern": string (regex)
}
```

**number**
```json
{
  "required": boolean,
  "min": number,
  "max": number,
  "step": number,
  "placeholder": string
}
```

**select**
```json
{
  "required": boolean,
  "multiple": boolean,
  "options": [
    { "value": string, "label": string }
  ]
}
```

**textarea**
```json
{
  "required": boolean,
  "minLength": number,
  "maxLength": number,
  "rows": number,
  "placeholder": string
}
```

**checkbox**
```json
{
  "required": boolean
}
```

**radio**
```json
{
  "required": boolean,
  "options": [
    { "value": string, "label": string }
  ]
}
```

**date**
```json
{
  "required": boolean,
  "min": string (YYYY-MM-DD),
  "max": string (YYYY-MM-DD)
}
```

---

## ⏱️ Estimativa de Tempo

### Resumo Executivo

| Cenário | Tempo Total | Prazo (focado) | Prazo (part-time) |
|---------|-------------|----------------|-------------------|
| **MVP Básico** | 27-37 horas | 4-5 dias úteis | 1-2 semanas |
| **MVP + Opcionais** | 31-43 horas | 5-6 dias úteis | 2-3 semanas |

### Breakdown por Fase

| # | Fase | Horas | Complexidade |
|---|------|-------|--------------|
| 1 | Setup do Projeto | 2-3h | ⭐ Baixa |
| 2 | Schemas JSON | 2-3h | ⭐ Baixa |
| 3 | Utilitários e Tipos | 3-4h | ⭐⭐ Média |
| 4 | Componentes de Campo | 6-8h | ⭐⭐⭐ Alta |
| 5 | Field Renderer | 3-4h | ⭐⭐ Média |
| 6 | Container DynamicForm | 4-5h | ⭐⭐⭐ Alta |
| 7 | Integração | 3-4h | ⭐⭐ Média |
| 8 | Testes e Refinamentos | 4-6h | ⭐⭐ Média |
| 9 | (Opcional) Avançados | 4-6h | ⭐⭐⭐ Alta |

### Fatores que Impactam o Tempo

**Aceleram ⚡**
- Experiência prévia com React Hook Form
- Familiaridade com Tailwind CSS
- Schemas simples e bem definidos
- Foco apenas em funcionalidades essenciais

**Atrasam 🐌**
- Primeira vez usando as bibliotecas
- Requisitos de UX muito detalhados
- Necessidade de suporte a browsers antigos
- Scope creep (adicionar features não planejadas)

---

## ✅ Critérios de Sucesso

### Must Have (Obrigatório para MVP)
- ✅ Renderizar formulário dinamicamente a partir de JSON
- ✅ Suportar 7 tipos de campo funcionais
- ✅ Validação client-side com mensagens claras
- ✅ Submit exibe dados coletados (console + modal)
- ✅ Layout responsivo (mobile + desktop)
- ✅ Código organizado e comentado

### Should Have (Desejável)
- ✅ 3 schemas de exemplo diferentes
- ✅ Loading states e error handling
- ✅ UI profissional (não precisa ser designer)
- ✅ README com instruções de uso
- ✅ Git com commits organizados

### Nice to Have (Bônus)
- ✅ Conditional fields (mostrar campo X se Y === valor)
- ✅ LocalStorage para salvar rascunhos
- ✅ Acessibilidade (ARIA labels, navegação por teclado)
- ✅ Testes unitários com Vitest
- ✅ Dark mode

### Métricas de Qualidade
- **Performance**: First render < 500ms
- **Acessibilidade**: Lighthouse accessibility score > 90
- **Code Quality**: ESLint sem warnings
- **Responsividade**: Funcional de 320px até 1920px
- **Cross-browser**: Funciona em Chrome, Firefox, Safari

---

## 🚀 Próximos Passos (Pós-MVP)

### Evolução Recomendada

```
MVP (JSON estático)
    ↓
Fase 2: Backend .NET Monolítico (2-3 semanas)
    ↓
Fase 3: Field Registry Dinâmico (1-2 semanas)
    ↓
Fase 4: Form Builder UI (3-4 semanas)
    ↓
Fase 5: Microserviços (4-6 semanas)
    ↓
Fase 6: Features Avançadas (ongoing)
```

### Fase 2 Preview: Backend .NET

**Endpoints principais:**
- `GET /api/forms/{id}/latest` - Buscar schema ativo
- `POST /api/responses` - Submeter resposta
- `GET /api/responses/{id}` - Buscar resposta específica

**Banco de dados:**
- Forms, FormVersions, Questions, QuestionOptions
- Responses, Answers

**Migration path:**
- Migrar JSONs para SQL
- Frontend muda apenas a URL do fetch
- Adicionar versionamento

---

## 💡 Recomendações Finais

### ✅ FAÇA
1. **Comece pelo schema** - Defina bem o JSON antes de codar
2. **Teste incrementalmente** - Valide cada campo antes de avançar
3. **Commits frequentes** - Facilita rollback e tracking
4. **README vivo** - Documente enquanto desenvolve
5. **Foque no básico** - MVP não precisa de tudo perfeito

### ❌ EVITE
1. **Over-engineering** - Não adicione Redux/Zustand agora
2. **Perfectionism** - UI funcional > UI perfeita
3. **Scope creep** - Anote ideias novas para Fase 2
4. **Validação excessiva** - Cubra 80% dos casos, não 100%
5. **Microserviços prematuros** - Comece simples

### 🎯 Próxima Ação
1. ✅ Revisar este overview
2. ✅ Ajustar estimativas baseado na sua experiência
3. ✅ Criar repositório Git
4. ✅ Seguir as tasks no documento separado
5. 🚀 **Começar a codar!**

---

**Versão**: 1.0  
**Criado em**: Março 2026  
**Status**: Pronto para execução
