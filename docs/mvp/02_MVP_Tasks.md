# DynamicForms MVP - Tasks Detalhadas (TypeScript + Yarn)

## 📋 Como Usar Este Documento

- Cada **FASE** contém múltiplas **TASKS**
- Marque `[ ]` como `[x]` ao completar cada item
- Use commits git após cada task principal
- Consulte exemplos de código ao lado de cada task

## ⚡ Mudanças nesta Versão

Esta versão foi atualizada para usar:
- ✅ **Yarn** ao invés de npm
- ✅ **TypeScript** ao invés de JavaScript
- ✅ Extensões `.tsx` e `.ts` ao invés de `.jsx` e `.js`
- ✅ Interfaces TypeScript ao invés de JSDoc
- ✅ Tipagem em todos os componentes React

**Nota**: Os demais componentes (NumberField, SelectField, etc.) seguem o mesmo padrão do TextField - adicione as interfaces de props com tipos importados de `schema.types.ts` e `react-hook-form`.

---

## FASE 1: Setup do Projeto (2-3 horas)

### Task 1.1: Inicializar Projeto React com Vite + TypeScript

**Objetivo**: Criar projeto base e instalar dependências

#### Passos:
```bash
# 1. Criar projeto com TypeScript
yarn create vite dynamic-forms-mvp --template react-ts
cd dynamic-forms-mvp

# 2. Instalar dependências core
yarn install

# 3. Instalar bibliotecas de formulário
yarn add react-hook-form zod @hookform/resolvers

# 4. Instalar Tailwind CSS
yarn add -D tailwindcss postcss autoprefixer
yarn dlx tailwindcss init -p

# 5. Instalar utilitários
yarn add date-fns clsx

# 6. (Opcional) React Router se quiser múltiplas páginas
yarn add react-router-dom
```

**Checklist:**
- [ ] Projeto criado com Vite + TypeScript
- [ ] Todas dependências instaladas sem erros
- [ ] `yarn dev` executa sem problemas
- [ ] Navegador abre em `http://localhost:5173`

---

### Task 1.2: Configurar Tailwind CSS

**Objetivo**: Habilitar Tailwind no projeto

#### 1. Editar `tailwind.config.ts`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 2. Editar `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 3. Limpar `src/App.css` (deletar ou deixar vazio)

**Checklist:**
- [ ] Tailwind configurado
- [ ] Classes Tailwind funcionando (teste com `className="text-red-500"`)

---

### Task 1.3: Criar Estrutura de Pastas

**Objetivo**: Organizar arquitetura do projeto

```bash
mkdir -p src/components/DynamicForm
mkdir -p src/components/fields
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/types
mkdir -p public/schemas
```

#### Criar arquivos placeholder:
```bash
# Componentes principais
touch src/components/DynamicForm/DynamicForm.tsx
touch src/components/DynamicForm/FieldRenderer.tsx

# Fields
touch src/components/fields/TextField.tsx
touch src/components/fields/NumberField.tsx
touch src/components/fields/SelectField.tsx
touch src/components/fields/TextAreaField.tsx
touch src/components/fields/CheckboxField.tsx
touch src/components/fields/RadioField.tsx
touch src/components/fields/DateField.tsx
touch src/components/fields/FieldWrapper.tsx

# UI
touch src/components/ui/LoadingSpinner.tsx
touch src/components/ui/SuccessModal.tsx

# Hooks
touch src/hooks/useFormSchema.ts

# Utils
touch src/utils/schemaValidator.ts
touch src/utils/fieldTypeRegistry.ts

# Types
touch src/types/schema.types.ts
```

**Checklist:**
- [ ] Todas as pastas criadas
- [ ] Arquivos placeholder criados

---

### Task 1.4: Limpar Boilerplate do Vite

**Objetivo**: Remover código de exemplo

#### Editar `src/App.tsx`:
```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Dynamic Forms MVP
        </h1>
        {/* Formulário será renderizado aqui */}
      </div>
    </div>
  );
}

export default App;
```

#### Deletar arquivos não utilizados:
```bash
rm src/App.css
rm src/assets/react.svg
rm public/vite.svg
```

**Checklist:**
- [ ] App.tsx limpo
- [ ] Arquivos desnecessários removidos
- [ ] Página inicial exibe "Dynamic Forms MVP"

---

### Task 1.5: Configurar ESLint para TypeScript

**Objetivo**: Manter qualidade de código

#### Editar `.eslintrc.cjs`:
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Não necessário com TypeScript
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
}
```

**Checklist:**
- [ ] ESLint configurado para TypeScript
- [ ] `yarn lint` executa sem erros críticos

---

### 🎯 Entrega da Fase 1:
- ✅ Projeto React + Vite funcionando
- ✅ Tailwind CSS operacional
- ✅ Estrutura de pastas criada
- ✅ Dependências instaladas
- ✅ Boilerplate limpo

**Commit sugerido:**
```bash
git add .
git commit -m "feat: initial project setup with Vite, Tailwind and folder structure"
```

---

## FASE 2: Definição do Schema JSON (2-3 horas)

### Task 2.1: Criar Schema de Formulário de Contato

**Objetivo**: Primeiro schema de exemplo funcional

#### Criar `public/schemas/contact-form.tson`:
```json
{
  "formId": "contact-form-v1",
  "title": "Formulário de Contato",
  "description": "Entre em contato com nossa equipe. Responderemos em até 24 horas.",
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
        "placeholder": "Digite seu nome completo"
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
      "key": "phone",
      "type": "text",
      "label": "Telefone",
      "order": 3,
      "config": {
        "required": false,
        "pattern": "^\\(?\\d{2}\\)?[\\s-]?\\d{4,5}-?\\d{4}$",
        "placeholder": "(11) 98765-4321"
      }
    },
    {
      "key": "subject",
      "type": "select",
      "label": "Assunto",
      "order": 4,
      "config": {
        "required": true,
        "options": [
          { "value": "", "label": "Selecione..." },
          { "value": "support", "label": "Suporte Técnico" },
          { "value": "sales", "label": "Vendas" },
          { "value": "partnership", "label": "Parcerias" },
          { "value": "other", "label": "Outro" }
        ]
      }
    },
    {
      "key": "message",
      "type": "textarea",
      "label": "Mensagem",
      "order": 5,
      "config": {
        "required": true,
        "minLength": 10,
        "maxLength": 500,
        "rows": 5,
        "placeholder": "Descreva sua solicitação em detalhes..."
      }
    },
    {
      "key": "urgency",
      "type": "radio",
      "label": "Nível de Urgência",
      "order": 6,
      "config": {
        "required": true,
        "options": [
          { "value": "low", "label": "Baixa - Posso aguardar alguns dias" },
          { "value": "medium", "label": "Média - Preciso em 1-2 dias" },
          { "value": "high", "label": "Alta - Urgente" }
        ]
      }
    },
    {
      "key": "subscribe",
      "type": "checkbox",
      "label": "Desejo receber novidades e atualizações por e-mail",
      "order": 7,
      "config": {
        "required": false
      }
    }
  ]
}
```

**Checklist:**
- [ ] Arquivo criado em `public/schemas/`
- [ ] JSON válido (sem erros de sintaxe)
- [ ] Todos os 7 tipos de campo presentes

---

### Task 2.2: Criar Schema de Pesquisa de Satisfação

**Objetivo**: Schema focado em checkbox e radio

#### Criar `public/schemas/survey-form.tson`:
```json
{
  "formId": "survey-form-v1",
  "title": "Pesquisa de Satisfação",
  "description": "Sua opinião é muito importante para nós!",
  "fields": [
    {
      "key": "name",
      "type": "text",
      "label": "Nome (opcional)",
      "order": 1,
      "config": {
        "required": false,
        "placeholder": "Seu nome"
      }
    },
    {
      "key": "rating",
      "type": "radio",
      "label": "Como você avalia nosso serviço?",
      "order": 2,
      "config": {
        "required": true,
        "options": [
          { "value": "5", "label": "⭐⭐⭐⭐⭐ Excelente" },
          { "value": "4", "label": "⭐⭐⭐⭐ Muito Bom" },
          { "value": "3", "label": "⭐⭐⭐ Bom" },
          { "value": "2", "label": "⭐⭐ Regular" },
          { "value": "1", "label": "⭐ Ruim" }
        ]
      }
    },
    {
      "key": "features",
      "type": "select",
      "label": "Quais recursos você mais utiliza? (múltipla escolha)",
      "order": 3,
      "config": {
        "required": false,
        "multiple": true,
        "options": [
          { "value": "dashboard", "label": "Dashboard" },
          { "value": "reports", "label": "Relatórios" },
          { "value": "integrations", "label": "Integrações" },
          { "value": "mobile", "label": "App Mobile" },
          { "value": "api", "label": "API" }
        ]
      }
    },
    {
      "key": "would_recommend",
      "type": "checkbox",
      "label": "Eu recomendaria este produto para outras pessoas",
      "order": 4,
      "config": {
        "required": false
      }
    },
    {
      "key": "comments",
      "type": "textarea",
      "label": "Comentários adicionais",
      "order": 5,
      "config": {
        "required": false,
        "maxLength": 1000,
        "rows": 4,
        "placeholder": "Compartilhe suas sugestões ou feedback..."
      }
    }
  ]
}
```

**Checklist:**
- [ ] Arquivo criado
- [ ] JSON válido
- [ ] Select com `multiple: true` incluído

---

### Task 2.3: Criar Schema de Cadastro de Usuário

**Objetivo**: Schema focado em number e date

#### Criar `public/schemas/registration-form.tson`:
```json
{
  "formId": "registration-form-v1",
  "title": "Cadastro de Usuário",
  "description": "Crie sua conta em menos de 1 minuto",
  "fields": [
    {
      "key": "full_name",
      "type": "text",
      "label": "Nome Completo",
      "order": 1,
      "config": {
        "required": true,
        "minLength": 5,
        "maxLength": 100,
        "placeholder": "Ex: João da Silva"
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
        "placeholder": "seu.email@exemplo.com"
      }
    },
    {
      "key": "birth_date",
      "type": "date",
      "label": "Data de Nascimento",
      "order": 3,
      "config": {
        "required": true,
        "max": "2010-01-01",
        "min": "1920-01-01"
      }
    },
    {
      "key": "age",
      "type": "number",
      "label": "Idade",
      "order": 4,
      "config": {
        "required": true,
        "min": 18,
        "max": 120,
        "placeholder": "Ex: 25"
      }
    },
    {
      "key": "country",
      "type": "select",
      "label": "País",
      "order": 5,
      "config": {
        "required": true,
        "options": [
          { "value": "", "label": "Selecione seu país..." },
          { "value": "BR", "label": "Brasil" },
          { "value": "US", "label": "Estados Unidos" },
          { "value": "PT", "label": "Portugal" },
          { "value": "ES", "label": "Espanha" }
        ]
      }
    },
    {
      "key": "bio",
      "type": "textarea",
      "label": "Biografia (opcional)",
      "order": 6,
      "config": {
        "required": false,
        "maxLength": 300,
        "rows": 3,
        "placeholder": "Conte um pouco sobre você..."
      }
    },
    {
      "key": "terms",
      "type": "checkbox",
      "label": "Aceito os termos de uso e política de privacidade",
      "order": 7,
      "config": {
        "required": true
      }
    }
  ]
}
```

**Checklist:**
- [ ] Arquivo criado
- [ ] JSON válido
- [ ] Number e Date fields presentes

---

### Task 2.4: Documentar Estrutura do Schema

**Objetivo**: Criar documentação de referência

#### Criar `SCHEMA_SPEC.md` na raiz do projeto:
```markdown
# Schema Specification

## Estrutura Geral

Um schema de formulário deve seguir esta estrutura:

```json
{
  "formId": "string (obrigatório)",
  "title": "string (obrigatório)",
  "description": "string (opcional)",
  "fields": [ /* array de fields */ ]
}
```

## Estrutura de Field

Cada field no array `fields` deve ter:

```json
{
  "key": "string (único, obrigatório)",
  "type": "string (obrigatório)",
  "label": "string (obrigatório)",
  "order": "number (obrigatório)",
  "config": { /* object (obrigatório) */ }
}
```

## Tipos de Campo Suportados

### 1. text
Input de texto simples.

**Config:**
- `required` (boolean): Campo obrigatório
- `minLength` (number): Tamanho mínimo
- `maxLength` (number): Tamanho máximo
- `placeholder` (string): Texto de placeholder
- `pattern` (string): Regex para validação

**Exemplo:**
```json
{
  "key": "email",
  "type": "text",
  "label": "E-mail",
  "order": 1,
  "config": {
    "required": true,
    "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    "placeholder": "seu@email.com"
  }
}
```

### 2. number
Input numérico.

**Config:**
- `required` (boolean)
- `min` (number): Valor mínimo
- `max` (number): Valor máximo
- `step` (number): Incremento
- `placeholder` (string)

**Exemplo:**
```json
{
  "key": "age",
  "type": "number",
  "label": "Idade",
  "order": 2,
  "config": {
    "required": true,
    "min": 18,
    "max": 100,
    "placeholder": "Ex: 25"
  }
}
```

### 3. select
Dropdown de seleção.

**Config:**
- `required` (boolean)
- `multiple` (boolean): Permitir múltipla seleção
- `options` (array): Lista de opções
  - Cada opção: `{ "value": string, "label": string }`

**Exemplo:**
```json
{
  "key": "country",
  "type": "select",
  "label": "País",
  "order": 3,
  "config": {
    "required": true,
    "multiple": false,
    "options": [
      { "value": "BR", "label": "Brasil" },
      { "value": "US", "label": "Estados Unidos" }
    ]
  }
}
```

### 4. textarea
Texto longo multi-linha.

**Config:**
- `required` (boolean)
- `minLength` (number)
- `maxLength` (number)
- `rows` (number): Número de linhas visíveis
- `placeholder` (string)

### 5. checkbox
Caixa de seleção sim/não.

**Config:**
- `required` (boolean)

### 6. radio
Escolha única entre opções.

**Config:**
- `required` (boolean)
- `options` (array): Lista de opções

### 7. date
Seletor de data.

**Config:**
- `required` (boolean)
- `min` (string): Data mínima (YYYY-MM-DD)
- `max` (string): Data máxima (YYYY-MM-DD)

## Validações

Todas as validações são client-side e baseadas no `config` de cada field.

## Ordem de Renderização

Fields são renderizados em ordem crescente do campo `order`.
```

**Checklist:**
- [ ] SCHEMA_SPEC.md criado
- [ ] Todos os 7 tipos documentados
- [ ] Exemplos incluídos

---

### 🎯 Entrega da Fase 2:
- ✅ 3 schemas JSON criados e validados
- ✅ Todos os 7 tipos de campo representados
- ✅ Documentação de schema criada

**Commit sugerido:**
```bash
git add .
git commit -m "feat: create JSON schemas and documentation"
```

---

## FASE 3: Utilitários e Tipos (3-4 horas)

### Task 3.1: Definir Tipos com TypeScript

**Objetivo**: Type safety com TypeScript

#### Editar `src/types/schema.types.ts`:
```typescript
/**
 * Configuração específica de cada tipo de campo
 */
export interface FieldConfig {
  // Comum a todos
  required?: boolean;
  
  // Text e Textarea
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  pattern?: string;
  
  // Number
  min?: number;
  max?: number;
  step?: number;
  
  // Textarea
  rows?: number;
  
  // Select
  multiple?: boolean;
  options?: Option[];
}

/**
 * Opção para Select e Radio
 */
export interface Option {
  value: string;
  label: string;
}

/**
 * Tipos de campo permitidos
 */
export type FieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'textarea' 
  | 'checkbox' 
  | 'radio' 
  | 'date';

/**
 * Definição de um campo do formulário
 */
export interface Field {
  key: string;
  type: FieldType;
  label: string;
  order: number;
  config: FieldConfig;
}

/**
 * Schema completo do formulário
 */
export interface FormSchema {
  formId: string;
  title: string;
  description?: string;
  fields: Field[];
}

/**
 * Resultado da validação do schema
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

**Checklist:**
- [ ] Tipos definidos com TypeScript
- [ ] Editor mostrando autocompletion (VS Code)
- [ ] Nenhum erro de compilação TypeScript

---

### Task 3.2: Field Type Registry

**Objetivo**: Definir tipos permitidos e suas propriedades

#### Editar `src/utils/fieldTypeRegistry.ts`:
```typescript
/**
 * Tipos de campo permitidos no sistema
 */
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  DATE: 'date',
} as const;

export type FieldTypeValue = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];

/**
 * Propriedades de config permitidas por tipo de campo
 */
export const ALLOWED_CONFIG_BY_TYPE: Record<FieldTypeValue, string[]> = {
  text: [
    'required',
    'minLength',
    'maxLength',
    'placeholder',
    'pattern',
  ],
  number: [
    'required',
    'min',
    'max',
    'step',
    'placeholder',
  ],
  select: [
    'required',
    'multiple',
    'options',
  ],
  textarea: [
    'required',
    'minLength',
    'maxLength',
    'rows',
    'placeholder',
  ],
  checkbox: [
    'required',
  ],
  radio: [
    'required',
    'options',
  ],
  date: [
    'required',
    'min',
    'max',
  ],
};

/**
 * Verifica se um tipo de campo é válido
 * @param type - Tipo a validar
 * @returns boolean
 */
export function isValidFieldType(type: string): type is FieldTypeValue {
  return Object.values(FIELD_TYPES).includes(type as FieldTypeValue);
}

/**
 * Obtém as propriedades permitidas para um tipo
 * @param type - Tipo do campo
 * @returns string[]
 */
export function getAllowedConfigProperties(type: string): string[] {
  return ALLOWED_CONFIG_BY_TYPE[type as FieldTypeValue] || [];
}

/**
 * Valida se uma propriedade é permitida para um tipo
 * @param type - Tipo do campo
 * @param property - Propriedade a validar
 * @returns boolean
 */
export function isAllowedConfigProperty(type: string, property: string): boolean {
  const allowed = getAllowedConfigProperties(type);
  return allowed.includes(property);
}
```

**Checklist:**
- [ ] Arquivo criado
- [ ] Todos os 7 tipos mapeados
- [ ] Funções helper implementadas

---

### Task 3.3: Schema Validator

**Objetivo**: Validar estrutura do schema JSON

#### Editar `src/utils/schemaValidator.ts`:
```typescript
import { FormSchema, ValidationResult } from '../types/schema.types';
import { isValidFieldType } from './fieldTypeRegistry';

/**
 * Valida a estrutura de um schema de formulário
 * @param schema - Schema do formulário
 * @returns ValidationResult
 */
export function validateSchema(schema: any): ValidationResult {
  const errors: string[] = [];

  // Validar root
  if (!schema) {
    errors.push('Schema é null ou undefined');
    return { valid: false, errors };
  }

  if (!schema.formId || typeof schema.formId !== 'string') {
    errors.push('formId é obrigatório e deve ser string');
  }

  if (!schema.title || typeof schema.title !== 'string') {
    errors.push('title é obrigatório e deve ser string');
  }

  if (!Array.isArray(schema.fields)) {
    errors.push('fields deve ser um array');
    return { valid: false, errors };
  }

  if (schema.fields.length === 0) {
    errors.push('fields não pode estar vazio');
  }

  // Validar cada field
  const keys = new Set<string>();
  schema.fields.forEach((field: any, index: number) => {
    // Validar key
    if (!field.key || typeof field.key !== 'string') {
      errors.push(`Field ${index}: key é obrigatório e deve ser string`);
    } else {
      if (keys.has(field.key)) {
        errors.push(`Field ${index}: key "${field.key}" duplicado`);
      }
      keys.add(field.key);
    }

    // Validar type
    if (!field.type) {
      errors.push(`Field ${field.key || index}: type é obrigatório`);
    } else if (!isValidFieldType(field.type)) {
      errors.push(
        `Field ${field.key}: tipo "${field.type}" inválido. ` +
        `Tipos permitidos: text, number, select, textarea, checkbox, radio, date`
      );
    }

    // Validar label
    if (!field.label || typeof field.label !== 'string') {
      errors.push(`Field ${field.key || index}: label é obrigatório`);
    }

    // Validar order
    if (typeof field.order !== 'number') {
      errors.push(`Field ${field.key || index}: order deve ser number`);
    }

    // Validar config
    if (!field.config || typeof field.config !== 'object') {
      errors.push(`Field ${field.key || index}: config é obrigatório`);
    }

    // Validar options se type === select ou radio
    if (field.type === 'select' || field.type === 'radio') {
      if (!field.config?.options || !Array.isArray(field.config.options)) {
        errors.push(`Field ${field.key}: tipo "${field.type}" requer options array`);
      } else if (field.config.options.length === 0) {
        errors.push(`Field ${field.key}: options não pode estar vazio`);
      } else {
        // Validar estrutura de cada option
        field.config.options.forEach((opt: any, optIndex: number) => {
          if (!opt.value || !opt.label) {
            errors.push(
              `Field ${field.key}, option ${optIndex}: ` +
              `requer {value, label}`
            );
          }
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida e lança erro se schema inválido
 * @param schema - Schema do formulário
 * @throws Error Se schema inválido
 */
export function assertValidSchema(schema: FormSchema): void {
  const validation = validateSchema(schema);
  if (!validation.valid) {
    throw new Error(`Schema inválido:\n${validation.errors.join('\n')}`);
  }
}
```

**Checklist:**
- [ ] Validador implementado
- [ ] Valida todos os campos obrigatórios
- [ ] Detecta keys duplicados
- [ ] Valida options para select/radio

---

### 🎯 Entrega da Fase 3:
- ✅ Tipos definidos (JSDoc)
- ✅ Field Type Registry criado
- ✅ Schema Validator funcional

**Commit sugerido:**
```bash
git add .
git commit -m "feat: add schema validation and field type registry"
```

---

## FASE 4: Componentes de Campo (6-8 horas)

### Task 4.1: FieldWrapper (Componente Base)

**Objetivo**: Wrapper reutilizável para todos os campos

#### Editar `src/components/fields/FieldWrapper.tsx`:
```tsx
import { ReactNode } from 'react';

interface FieldWrapperProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Wrapper comum para todos os campos
 * Renderiza label, asterisco de required, e mensagem de erro
 */
export function FieldWrapper({ label, error, required, children }: FieldWrapperProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Componente criado
- [ ] Label renderiza corretamente
- [ ] Asterisco aparece se required
- [ ] Erro exibe em vermelho

---

### Task 4.2: TextField

**Objetivo**: Input de texto com validações

#### Editar `src/components/fields/TextField.tsx`:
```tsx
import { UseFormRegister } from 'react-hook-form';
import { Field } from '../../types/schema.types';
import { FieldWrapper } from './FieldWrapper';

interface TextFieldProps {
  field: Field;
  register: UseFormRegister<any>;
  error?: string;
}

/**
 * Campo de texto simples
 */
export function TextField({ field, register, error }: TextFieldProps) {
  const { key, label, config } = field;

  const validationRules: any = {
    required: config.required && `${label} é obrigatório`,
  };

  if (config.minLength) {
    validationRules.minLength = {
      value: config.minLength,
      message: `Mínimo de ${config.minLength} caracteres`,
    };
  }

  if (config.maxLength) {
    validationRules.maxLength = {
      value: config.maxLength,
      message: `Máximo de ${config.maxLength} caracteres`,
    };
  }

  if (config.pattern) {
    validationRules.pattern = {
      value: new RegExp(config.pattern),
      message: 'Formato inválido',
    };
  }

  return (
    <FieldWrapper label={label} error={error} required={config.required}>
      <input
        type="text"
        {...register(key, validationRules)}
        placeholder={config.placeholder}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
        "
      />
    </FieldWrapper>
  );
}
```

**Checklist:**
- [ ] Componente implementado
- [ ] Validação required funciona
- [ ] MinLength/MaxLength funciona
- [ ] Pattern validation funciona
- [ ] Placeholder exibido

> **Nota sobre demais componentes**: Os componentes NumberField, SelectField, TextAreaField, CheckboxField, RadioField e DateField seguem o mesmo padrão do TextField mostrado acima. Para cada um:
> 1. Crie interface de props com `field: Field`, `register: UseFormRegister<any>`, `error?: string`
> 2. Importe tipos de `../../types/schema.types` e `react-hook-form`
> 3. O código JavaScript original serve como base - apenas adicione os tipos TypeScript

---

### Task 4.3: NumberField

**Objetivo**: Input numérico com min/max

#### Editar `src/components/fields/NumberField.tsx`:
```jsx
import { FieldWrapper } from './FieldWrapper';

export function NumberField({ field, register, error }) {
  const { key, label, config } = field;

  const validationRules = {
    required: config.required && `${label} é obrigatório`,
    valueAsNumber: true, // Converte string para number
  };

  if (config.min !== undefined) {
    validationRules.min = {
      value: config.min,
      message: `Valor mínimo: ${config.min}`,
    };
  }

  if (config.max !== undefined) {
    validationRules.max = {
      value: config.max,
      message: `Valor máximo: ${config.max}`,
    };
  }

  return (
    <FieldWrapper label={label} error={error} required={config.required}>
      <input
        type="number"
        step={config.step || 1}
        {...register(key, validationRules)}
        placeholder={config.placeholder}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
    </FieldWrapper>
  );
}
```

**Checklist:**
- [ ] Aceita apenas números
- [ ] Min/Max validation funciona
- [ ] Step aplicado

---

### Task 4.4: SelectField

**Objetivo**: Dropdown com suporte a múltipla seleção

#### Editar `src/components/fields/SelectField.tsx`:
```jsx
import { FieldWrapper } from './FieldWrapper';

export function SelectField({ field, register, error }) {
  const { key, label, config } = field;

  const validationRules = {
    required: config.required && `${label} é obrigatório`,
  };

  return (
    <FieldWrapper label={label} error={error} required={config.required}>
      <select
        {...register(key, validationRules)}
        multiple={config.multiple}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        size={config.multiple ? Math.min(config.options.length, 5) : undefined}
      >
        {config.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {config.multiple && (
        <p className="mt-1 text-xs text-gray-500">
          Segure Ctrl/Cmd para selecionar múltiplos
        </p>
      )}
    </FieldWrapper>
  );
}
```

**Checklist:**
- [ ] Renderiza options corretamente
- [ ] Múltipla seleção funciona
- [ ] Dica exibida se multiple=true

---

### Task 4.5: TextAreaField

**Objetivo**: Texto longo multi-linha

#### Editar `src/components/fields/TextAreaField.tsx`:
```jsx
import { FieldWrapper } from './FieldWrapper';

export function TextAreaField({ field, register, error }) {
  const { key, label, config } = field;

  const validationRules = {
    required: config.required && `${label} é obrigatório`,
  };

  if (config.minLength) {
    validationRules.minLength = {
      value: config.minLength,
      message: `Mínimo de ${config.minLength} caracteres`,
    };
  }

  if (config.maxLength) {
    validationRules.maxLength = {
      value: config.maxLength,
      message: `Máximo de ${config.maxLength} caracteres`,
    };
  }

  return (
    <FieldWrapper label={label} error={error} required={config.required}>
      <textarea
        {...register(key, validationRules)}
        rows={config.rows || 4}
        placeholder={config.placeholder}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          resize-vertical
        "
      />
      {config.maxLength && (
        <p className="mt-1 text-xs text-gray-500 text-right">
          Máx. {config.maxLength} caracteres
        </p>
      )}
    </FieldWrapper>
  );
}
```

**Checklist:**
- [ ] Textarea renderiza
- [ ] Rows aplicado
- [ ] MaxLength contador exibido

---

### Task 4.6: CheckboxField

**Objetivo**: Checkbox simples

#### Editar `src/components/fields/CheckboxField.tsx`:
```jsx
export function CheckboxField({ field, register, error }) {
  const { key, label, config } = field;

  const validationRules = {
    required: config.required && `Você deve aceitar ${label}`,
  };

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            {...register(key, validationRules)}
            className="
              w-4 h-4 border-gray-300 rounded
              text-blue-600 focus:ring-2 focus:ring-blue-500
            "
          />
        </div>
        <div className="ml-3">
          <label className="text-sm text-gray-700">
            {label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 ml-7">
          {error}
        </p>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Checkbox renderiza
- [ ] Required validation funciona
- [ ] Label clicável

---

### Task 4.7: RadioField

**Objetivo**: Radio buttons para escolha única

#### Editar `src/components/fields/RadioField.tsx`:
```jsx
import { FieldWrapper } from './FieldWrapper';

export function RadioField({ field, register, error }) {
  const { key, label, config } = field;

  const validationRules = {
    required: config.required && `${label} é obrigatório`,
  };

  return (
    <FieldWrapper label={label} error={error} required={config.required}>
      <div className="space-y-2">
        {config.options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${key}-${option.value}`}
              value={option.value}
              {...register(key, validationRules)}
              className="
                w-4 h-4 border-gray-300
                text-blue-600 focus:ring-2 focus:ring-blue-500
              "
            />
            <label
              htmlFor={`${key}-${option.value}`}
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </FieldWrapper>
  );
}
```

**Checklist:**
- [ ] Múltiplos radios renderizam
- [ ] Apenas um selecionável
- [ ] Labels clicáveis

---

### Task 4.8: DateField

**Objetivo**: Seletor de data

#### Editar `src/components/fields/DateField.tsx`:
```jsx
import { FieldWrapper } from './FieldWrapper';

export function DateField({ field, register, error }) {
  const { key, label, config } = field;

  const validationRules = {
    required: config.required && `${label} é obrigatório`,
  };

  if (config.min) {
    validationRules.min = {
      value: config.min,
      message: `Data mínima: ${config.min}`,
    };
  }

  if (config.max) {
    validationRules.max = {
      value: config.max,
      message: `Data máxima: ${config.max}`,
    };
  }

  return (
    <FieldWrapper label={label} error={error} required={config.required}>
      <input
        type="date"
        {...register(key, validationRules)}
        min={config.min}
        max={config.max}
        className="
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />
    </FieldWrapper>
  );
}
```

**Checklist:**
- [ ] Date picker funciona
- [ ] Min/Max aplicados
- [ ] Validação funciona

---

### 🎯 Entrega da Fase 4:
- ✅ 8 componentes de campo criados
- ✅ Todos com validação integrada
- ✅ UI consistente com Tailwind

**Commit sugerido:**
```bash
git add .
git commit -m "feat: implement all 7 field components with validation"
```

---

## FASE 5: Field Renderer (Factory) (3-4 horas)

### Task 5.1: Implementar FieldRenderer

**Objetivo**: Factory pattern para escolher componente correto

#### Editar `src/components/DynamicForm/FieldRenderer.tsx`:
```jsx
import { TextField } from '../fields/TextField';
import { NumberField } from '../fields/NumberField';
import { SelectField } from '../fields/SelectField';
import { TextAreaField } from '../fields/TextAreaField';
import { CheckboxField } from '../fields/CheckboxField';
import { RadioField } from '../fields/RadioField';
import { DateField } from '../fields/DateField';

/**
 * Mapa de tipos para componentes
 */
const FIELD_COMPONENT_MAP = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  textarea: TextAreaField,
  checkbox: CheckboxField,
  radio: RadioField,
  date: DateField,
};

/**
 * Factory que renderiza o componente correto baseado no tipo
 * @param {Object} props
 * @param {import('../../types/schema.types').Field} props.field
 * @param {Function} props.register
 * @param {Object} props.errors
 */
export function FieldRenderer({ field, register, errors }) {
  const FieldComponent = FIELD_COMPONENT_MAP[field.type];

  if (!FieldComponent) {
    console.error(`Tipo de campo desconhecido: ${field.type}`);
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-sm text-red-600">
          ⚠️ Erro: Tipo de campo "{field.type}" não suportado
        </p>
      </div>
    );
  }

  return (
    <FieldComponent
      field={field}
      register={register}
      error={errors[field.key]?.message}
    />
  );
}
```

**Checklist:**
- [ ] Factory implementado
- [ ] Todos os tipos mapeados
- [ ] Erro exibido se tipo desconhecido

---

### Task 5.2: Testar FieldRenderer Isoladamente

**Objetivo**: Criar página de testes (temporária)

#### Criar `src/components/DynamicForm/FieldRendererTest.tsx`:
```jsx
import { useForm } from 'react-hook-form';
import { FieldRenderer } from './FieldRenderer';

/**
 * Componente temporário para testar FieldRenderer
 * DELETAR após testes
 */
export function FieldRendererTest() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const testFields = [
    {
      key: 'test_text',
      type: 'text',
      label: 'Test Text',
      order: 1,
      config: { required: true, minLength: 3 },
    },
    {
      key: 'test_number',
      type: 'number',
      label: 'Test Number',
      order: 2,
      config: { required: true, min: 0, max: 100 },
    },
    {
      key: 'test_select',
      type: 'select',
      label: 'Test Select',
      order: 3,
      config: {
        required: true,
        options: [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ],
      },
    },
  ];

  const onSubmit = (data) => {
    console.log('Test data:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">FieldRenderer Test</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {testFields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            register={register}
            errors={errors}
          />
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Test Submit
        </button>
      </form>
    </div>
  );
}
```

#### Testar em `src/App.tsx`:
```jsx
import { FieldRendererTest } from './components/DynamicForm/FieldRendererTest';

function App() {
  return <FieldRendererTest />;
}
```

**Checklist:**
- [ ] Teste criado
- [ ] Todos os campos renderizam
- [ ] Validação funciona
- [ ] Submit exibe dados
- [ ] **DELETAR arquivo de teste após validação**

---

### 🎯 Entrega da Fase 5:
- ✅ FieldRenderer implementado
- ✅ Factory pattern funcionando
- ✅ Todos os campos testados

**Commit sugerido:**
```bash
git add .
git commit -m "feat: implement FieldRenderer factory pattern"
```

---

## FASE 6: Container DynamicForm (4-5 horas)

### Task 6.1: Hook useFormSchema

**Objetivo**: Carregar schema JSON via fetch

#### Editar `src/hooks/useFormSchema.ts`:
```typescript
import { useState, useEffect } from 'react';
import { FormSchema } from '../types/schema.types';
import { validateSchema } from '../utils/schemaValidator';

interface UseFormSchemaReturn {
  schema: FormSchema | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para carregar e validar schema JSON
 * @param schemaPath - Caminho do schema (ex: '/schemas/contact-form.json')
 * @returns UseFormSchemaReturn
 */
export function useFormSchema(schemaPath: string): UseFormSchemaReturn {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schemaPath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(schemaPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // Validar estrutura do schema
        const validation = validateSchema(data);
        if (!validation.valid) {
          throw new Error(
            `Schema inválido:\n${validation.errors.join('\n')}`
          );
        }
        setSchema(data);
      })
      .catch((err) => {
        console.error('Erro ao carregar schema:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [schemaPath]);

  return { schema, loading, error };
}
```

**Checklist:**
- [ ] Hook implementado
- [ ] Fetch funciona
- [ ] Validação aplicada
- [ ] Estados loading/error gerenciados

---

### Task 6.2: Componente DynamicForm

**Objetivo**: Container principal do formulário

#### Editar `src/components/DynamicForm/DynamicForm.tsx`:
```tsx
import { useForm } from 'react-hook-form';
import { FormSchema } from '../../types/schema.types';
import { FieldRenderer } from './FieldRenderer';

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: any) => void;
}

/**
 * Container principal do formulário dinâmico
 */
export function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!schema) {
    return null;
  }

  // Ordenar fields por order
  const sortedFields = [...schema.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {schema.title}
        </h1>
        {schema.description && (
          <p className="text-gray-600">
            {schema.description}
          </p>
        )}
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {sortedFields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            register={register}
            errors={errors}
          />
        ))}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full py-3 px-4 
              bg-blue-600 hover:bg-blue-700 
              text-white font-medium rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

**Checklist:**
- [ ] Componente criado
- [ ] Header com título/descrição
- [ ] Fields ordenados corretamente
- [ ] Submit button com loading state

---

### 🎯 Entrega da Fase 6:
- ✅ useFormSchema hook funcional
- ✅ DynamicForm container implementado
- ✅ Formulário renderiza dinamicamente

**Commit sugerido:**
```bash
git add .
git commit -m "feat: implement DynamicForm container and useFormSchema hook"
```

---

## FASE 7: Integração e App Principal (3-4 horas)

### Task 7.1: LoadingSpinner Component

**Objetivo**: Componente de loading

#### Editar `src/components/ui/LoadingSpinner.tsx`:
```jsx
export function LoadingSpinner({ message = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
```

**Checklist:**
- [ ] Spinner animado
- [ ] Mensagem customizável

---

### Task 7.2: SuccessModal Component

**Objetivo**: Modal de sucesso após submit

#### Editar `src/components/ui/SuccessModal.tsx`:
```jsx
/**
 * Modal exibido após submit bem-sucedido
 * @param {Object} props
 * @param {Object} props.data - Dados submetidos
 * @param {Function} props.onClose - Callback para fechar
 */
export function SuccessModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-xl font-bold">✅ Formulário Enviado com Sucesso!</h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-600 mb-4">
            Seus dados foram coletados. Em produção, seriam enviados para o servidor.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Dados coletados:
            </p>
            <pre className="text-xs text-gray-800 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] Modal renderiza
- [ ] Exibe JSON formatado
- [ ] Botão fechar funciona

---

### Task 7.3: App.tsx - Integração Final

**Objetivo**: Juntar tudo no App principal

#### Editar `src/App.tsx`:
```jsx
import { useState } from 'react';
import { DynamicForm } from './components/DynamicForm/DynamicForm';
import { useFormSchema } from './hooks/useFormSchema';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { SuccessModal } from './components/ui/SuccessModal';

function App() {
  const [selectedForm, setSelectedForm] = useState('contact-form');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const { schema, loading, error } = useFormSchema(
    `/schemas/${selectedForm}.tson`
  );

  const handleSubmit = (data) => {
    console.log('📝 Formulário submetido:', data);
    setSubmittedData(data);
    setShowSuccess(true);

    // Simular delay de envio
    setTimeout(() => {
      console.log('✅ Dados "enviados" com sucesso');
    }, 500);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dynamic Forms MVP
          </h1>
          <p className="text-gray-600">
            Formulários renderizados dinamicamente a partir de JSON
          </p>
        </div>

        {/* Form Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione um formulário:
          </label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="contact-form">📧 Formulário de Contato</option>
            <option value="survey-form">📊 Pesquisa de Satisfação</option>
            <option value="registration-form">👤 Cadastro de Usuário</option>
          </select>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner message="Carregando formulário..." />}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-bold mb-2">❌ Erro ao carregar schema</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {schema && !loading && !error && (
          <DynamicForm schema={schema} onSubmit={handleSubmit} />
        )}

        {/* Success Modal */}
        {showSuccess && (
          <SuccessModal data={submittedData} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default App;
```

**Checklist:**
- [ ] Selector de formulários funciona
- [ ] Schema carrega ao trocar seleção
- [ ] Loading exibido
- [ ] Erro exibido se falhar
- [ ] Submit abre modal de sucesso

---

### 🎯 Entrega da Fase 7:
- ✅ App totalmente integrado
- ✅ 3 formulários funcionais
- ✅ UX polida (loading, errors, success)

**Commit sugerido:**
```bash
git add .
git commit -m "feat: integrate all components in main App"
```

---

## FASE 8: Testes e Refinamentos (4-6 horas)

### Task 8.1: Testes Manuais Completos

**Checklist de Testes:**

#### Formulário de Contato
- [ ] Nome: required, minLength 3
- [ ] Email: required, pattern válido
- [ ] Telefone: opcional, pattern válido
- [ ] Assunto: required, select funciona
- [ ] Mensagem: required, min/max length
- [ ] Urgência: required, radio funciona
- [ ] Subscribe: checkbox funciona

#### Pesquisa de Satisfação
- [ ] Rating: required, radio stars
- [ ] Features: select múltiplo funciona
- [ ] Would recommend: checkbox
- [ ] Comments: opcional, maxLength

#### Cadastro de Usuário
- [ ] Full name: required, min/max
- [ ] Email: pattern validação
- [ ] Birth date: date picker, min/max
- [ ] Age: number, min 18, max 120
- [ ] Country: select required
- [ ] Bio: opcional, maxLength
- [ ] Terms: checkbox required

#### Testes de Edge Cases
- [ ] Submit com campos vazios → erros exibidos
- [ ] Submit com dados inválidos → erros específicos
- [ ] Trocar formulário durante preenchimento → limpa dados
- [ ] Erros desaparecem ao corrigir campo
- [ ] JSON no console está correto

---

### Task 8.2: Melhorias de UX

#### 8.2.1: Scroll to First Error
Editar `DynamicForm.tsx`:
```jsx
import { useEffect } from 'react';

export function DynamicForm({ schema, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Scroll para o primeiro erro
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.focus();
    }
  }, [errors]);

  // ... resto do componente
}
```

#### 8.2.2: Reset Form Após Sucesso
```jsx
const {
  register,
  handleSubmit,
  reset, // Adicionar
  formState: { errors, isSubmitting },
} = useForm();

const handleCloseModal = () => {
  setShowSuccess(false);
  setSubmittedData(null);
  reset(); // Limpar formulário
};
```

#### 8.2.3: Melhorar Feedback Visual
Adicionar em `FieldWrapper.tsx`:
```jsx
export function FieldWrapper({ label, error, required, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={error ? 'ring-2 ring-red-500 ring-opacity-50 rounded-md' : ''}>
        {children}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Scroll to error implementado
- [ ] Reset form após sucesso
- [ ] Feedback visual melhorado

---

### Task 8.3: Responsividade Mobile

#### Testar em diferentes telas:
```bash
# Chrome DevTools
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1920px)
```

#### Ajustes se necessário:
```jsx
// Em App.tsx, adicionar breakpoints
<div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl md:text-4xl font-bold...">
```

**Checklist:**
- [ ] Mobile 375px OK
- [ ] Tablet 768px OK
- [ ] Desktop 1920px OK
- [ ] Inputs legíveis em mobile
- [ ] Botões clicáveis em touch

---

### Task 8.4: Documentação Final

#### Atualizar `README.md`:
```markdown
# Dynamic Forms MVP

Sistema de formulários dinâmicos renderizados a partir de schemas JSON.

## 🚀 Como Rodar

```bash
# Instalar dependências
yarn add

# Rodar em desenvolvimento
yarn dev

# Build para produção
npm run build
```

## 📋 Schemas Disponíveis

- **contact-form**: Formulário de contato com validações
- **survey-form**: Pesquisa de satisfação
- **registration-form**: Cadastro de usuário

## 🎨 Tipos de Campo Suportados

- `text` - Input de texto
- `number` - Input numérico
- `select` - Dropdown (simples ou múltiplo)
- `textarea` - Texto longo
- `checkbox` - Sim/Não
- `radio` - Escolha única
- `date` - Seletor de data

## 📁 Estrutura

```
src/
├── components/
│   ├── DynamicForm/      # Container principal
│   ├── fields/           # Componentes de campo
│   └── ui/               # Componentes de UI
├── hooks/                # Custom hooks
├── utils/                # Validações e registries
└── types/                # Definições de tipos
```

## 🔧 Como Criar um Novo Schema

1. Criar arquivo em `public/schemas/seu-form.tson`
2. Seguir estrutura documentada em `SCHEMA_SPEC.md`
3. Validar com schema validator
4. Adicionar no selector do App.tsx

## 🛠️ Stack Tecnológica

- React 18
- Vite
- React Hook Form
- Tailwind CSS
- Zod (validação)

## 📝 Próximos Passos

- [ ] Integrar com backend .NET
- [ ] Adicionar versionamento
- [ ] Implementar field registry dinâmico
- [ ] Criar Form Builder UI
```

#### Criar `CHANGELOG.md`:
```markdown
# Changelog

## [1.0.0] - 2026-03-XX

### Adicionado
- ✅ Renderização dinâmica de formulários via JSON
- ✅ 7 tipos de campo (text, number, select, textarea, checkbox, radio, date)
- ✅ Validação client-side completa
- ✅ 3 schemas de exemplo
- ✅ UI responsiva com Tailwind
- ✅ Modal de sucesso após submit

### Funcionalidades
- Schema validator
- Field type registry
- Error handling
- Loading states
- Scroll to first error
- Form reset após sucesso
```

**Checklist:**
- [ ] README.md atualizado
- [ ] CHANGELOG.md criado
- [ ] SCHEMA_SPEC.md revisado
- [ ] Comentários no código revisados

---

### 🎯 Entrega da Fase 8:
- ✅ Testes manuais completos
- ✅ UX refinada
- ✅ Responsividade validada
- ✅ Documentação completa

**Commit final:**
```bash
git add .
git commit -m "feat: complete MVP with tests, UX improvements and documentation"
git tag v1.0.0
```

---

## FASE 9 (OPCIONAL): Features Avançadas (4-6 horas)

### Task 9.1: Conditional Fields

**Objetivo**: Mostrar campo X apenas se campo Y === valor

#### Adicionar ao schema:
```json
{
  "key": "other_subject",
  "type": "text",
  "label": "Especifique o assunto",
  "order": 5,
  "config": {
    "required": true
  },
  "visibilityCondition": {
    "field": "subject",
    "operator": "equals",
    "value": "other"
  }
}
```

#### Implementar lógica em `DynamicForm.tsx`:
```jsx
import { useWatch } from 'react-hook-form';

export function DynamicForm({ schema, onSubmit }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  
  // Watch all fields
  const watchedValues = useWatch({ control });

  const isFieldVisible = (field) => {
    if (!field.visibilityCondition) return true;

    const { field: watchField, operator, value } = field.visibilityCondition;
    const currentValue = watchedValues[watchField];

    if (operator === 'equals') {
      return currentValue === value;
    }
    // Adicionar outros operators se necessário
    return true;
  };

  const visibleFields = sortedFields.filter(isFieldVisible);

  return (
    // ... renderizar apenas visibleFields
  );
}
```

**Checklist:**
- [ ] Conditional logic implementada
- [ ] Campo aparece/desaparece dinamicamente
- [ ] Validação respeita visibilidade

---

### Task 9.2: LocalStorage - Salvar Rascunhos

**Objetivo**: Não perder dados ao recarregar página

#### Hook customizado:
```javascript
// src/hooks/useFormPersistence.ts
import { useEffect } from 'react';

export function useFormPersistence(formId, watch, setValue) {
  const STORAGE_KEY = `form_draft_${formId}`;

  // Carregar draft ao montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });
      } catch (err) {
        console.error('Erro ao carregar rascunho:', err);
      }
    }
  }, [formId, setValue, STORAGE_KEY]);

  // Salvar a cada mudança
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch, STORAGE_KEY]);

  // Limpar ao submeter
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearDraft };
}
```

#### Usar em `DynamicForm.tsx`:
```jsx
const { clearDraft } = useFormPersistence(schema.formId, watch, setValue);

const handleFormSubmit = (data) => {
  clearDraft();
  onSubmit(data);
};
```

**Checklist:**
- [ ] Draft salva automaticamente
- [ ] Draft restaura ao recarregar
- [ ] Draft limpa após submit

---

### Task 9.3: Acessibilidade (ARIA)

**Objetivo**: Melhorar para screen readers

#### Melhorias:
```jsx
// FieldWrapper.tsx
<label 
  htmlFor={`field-${key}`}
  className="block text-sm font-medium text-gray-700 mb-1"
>
  {label}
  {required && (
    <span className="text-red-500 ml-1" aria-label="obrigatório">
      *
    </span>
  )}
</label>

<input
  id={`field-${key}`}
  aria-required={config.required}
  aria-invalid={!!error}
  aria-describedby={error ? `error-${key}` : undefined}
  {...register(key, validationRules)}
/>

{error && (
  <p id={`error-${key}`} role="alert" className="mt-1 text-sm text-red-600">
    {error}
  </p>
)}
```

**Checklist:**
- [ ] Labels associadas corretamente
- [ ] ARIA attributes adicionados
- [ ] Navegação por teclado funciona
- [ ] Testado com screen reader (NVDA/JAWS)

---

### 🎯 Entrega da Fase 9:
- ✅ Features opcionais implementadas
- ✅ MVP ainda mais robusto

**Commit sugerido:**
```bash
git add .
git commit -m "feat: add conditional fields, localStorage persistence and a11y improvements"
```

---

## 🎉 MVP COMPLETO!

### Próximos Passos Recomendados

1. **Deploy**
   - Vercel: `npm run build` + deploy
   - Netlify: Conectar repositório
   - GitHub Pages: Build + push para gh-pages

2. **Demonstração**
   - Gravar vídeo mostrando funcionalidades
   - Criar apresentação para stakeholders
   - Coletar feedback

3. **Planejamento Fase 2**
   - Revisar documento de evolução
   - Começar design do backend .NET
   - Definir estrutura do banco de dados

---

**Versão**: 1.0  
**Última atualização**: Março 2026
