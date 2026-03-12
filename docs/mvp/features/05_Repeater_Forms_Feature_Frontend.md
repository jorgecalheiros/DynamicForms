# DynamicForms - Repeater Forms Feature (Frontend)

## 📋 Índice
1. [Visão Geral](#1-visão-geral)
2. [Análise e Decisões](#2-análise-e-decisões)
3. [Schema Extension](#3-schema-extension)
4. [Estrutura de Dados](#4-estrutura-de-dados)
5. [Componentes Frontend](#5-componentes-frontend)
6. [UX/UI Guidelines](#6-uxui-guidelines)
7. [Validações](#7-validações)
8. [Edge Cases](#8-edge-cases)
9. [Tasks de Implementação](#9-tasks-de-implementação)
10. [Testes](#10-testes)
11. [Exemplos de Uso](#11-exemplos-de-uso)

---

## 1. Visão Geral

### 1.1 Problema

No MVP atual do DynamicForms, os formulários são renderizados estaticamente a partir de um schema JSON e os dados são apenas exibidos no console (`console.log`). 

Surgiu a necessidade de **formulários que possam se auto-repetir**, como:

- **Cadastro de Dependentes**: Adicionar múltiplos dependentes (nome, idade, parentesco)
- **Endereços**: Residencial, comercial, correspondência
- **Experiências Profissionais**: Múltiplos empregos anteriores
- **Certificações**: Cursos e certificados

### 1.2 Objetivo

Permitir que formulários se repitam, possibilitando ao usuário:
1. ✅ Preencher dados de uma entrada
2. ✅ Salvar temporariamente (estado local React)
3. ✅ Adicionar mais entradas
4. ✅ Editar/Excluir entradas da lista temporária
5. ✅ Ao final, consolidar todos os dados (console.log por enquanto)

### 1.3 Solução Proposta

Adicionar um novo **tipo de formulário** chamado `repeater` que:
- ✅ Identifica formulários repetíveis via `type: 'repeater'` no schema
- ✅ Mantém dados temporários no estado React
- ✅ Permite edição/exclusão antes da submissão final
- ✅ Suporta configurações: min/max entries, labels customizados, reordenação
- ✅ Retorna array de objetos ao submeter

### 1.4 Valor Entregue

✅ **UX melhorada** - Usuário revisa todos os dados antes de submeter  
✅ **Menos erros** - Validação por entrada individual  
✅ **Flexibilidade** - Adicionar quantas entradas necessárias  
✅ **Controle** - Editar/excluir antes de enviar  
✅ **Escalável** - Preparado para outros tipos futuros (wizard, multi-step)

---

## 2. Análise e Decisões

### 2.1 Sugestão Original (Análise)

**Proposta**:
> "Formulário de dependentes com nome, idade e parentesco. Usuário pode salvar ou adicionar +1. Dados temporários aparecem em lista com editar/excluir. Identificar via `type: 'repeater'` no schema."

✅ **Pontos Fortes**:
- Type no schema - Simples e claro
- Dados temporários - Permite revisão
- Editar/Excluir - Essencial para UX
- Reset após adicionar - Intuitivo

⚠️ **Pontos Expandidos**:
- Limite máximo/mínimo de entradas ✓
- Ordenação/reordenação ✓
- Validação: por entrada individual ✓
- Formato de saída: array de objetos ✓

### 2.2 Decisões Arquiteturais

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| **Tipo no Schema** | `type: 'repeater'` | Simples, extensível para outros tipos futuros (`wizard`, `multi-step`) |
| **Dados temporários** | Array no estado React | Fácil manipulação, não polui nada externo |
| **Validação** | Por entrada individual | Evita erro em massa, melhor feedback ao usuário |
| **Formato de saída** | Array de objetos | `[{ name: "João", age: 5 }, { name: "Maria", age: 35 }]` |
| **Edição** | In-place na lista | Mais rápido que modal, melhor UX |
| **Limite** | Configurável via `repeaterConfig` | Flexibilidade por formulário |
| **Ordenação** | Opcional via drag-and-drop | Útil para priorização (experiências profissionais) |

### 2.3 Tipos de Formulários (Evolutivo)

```typescript
export type FormType = 
  | 'default'    // Formulário único e simples (atual)
  | 'repeater'   // Formulário que pode se repetir (nova feature)
  | 'wizard';    // (Futuro) Multi-step form com navegação entre etapas
```

---

## 3. Schema Extension

### 3.1 TypeScript Types

```typescript
// src/types/schema.types.ts

export type FormType = 'default' | 'repeater';

export interface FormSchema {
  formId: string;
  title: string;
  description?: string;
  type?: FormType;                // ⭐ NOVO (default = 'default')
  repeaterConfig?: RepeaterConfig; // ⭐ NOVO (apenas se type === 'repeater')
  fields: Field[];
}

export interface RepeaterConfig {
  minEntries?: number;        // Mínimo de entradas (padrão: 0)
  maxEntries?: number;        // Máximo de entradas (padrão: ilimitado)
  addButtonText?: string;     // Texto do botão (padrão: "Adicionar outro")
  itemLabel?: string;         // Label do item (padrão: "Item")
  allowReorder?: boolean;     // Drag-and-drop (padrão: false)
  confirmDelete?: boolean;    // Confirmar ao excluir (padrão: true)
  showCounter?: boolean;      // Mostrar "X de Y itens" (padrão: true)
  collapsible?: boolean;      // Colapsar itens (padrão: false)
}

// Estrutura de entrada repetida (frontend)
export interface RepeaterEntry {
  id: string;                      // UUID gerado no frontend
  data: Record<string, any>;       // Dados do formulário
  timestamp: number;               // Quando foi criado
  isValid: boolean;                // Se passou pela validação
}
```

### 3.2 Exemplo de Schema JSON

```json
{
  "formId": "dependentes-form",
  "title": "Cadastro de Dependentes",
  "description": "Adicione todos os seus dependentes",
  "type": "repeater",
  "repeaterConfig": {
    "minEntries": 0,
    "maxEntries": 10,
    "addButtonText": "Adicionar outro dependente",
    "itemLabel": "Dependente",
    "allowReorder": true,
    "confirmDelete": true,
    "showCounter": true
  },
  "fields": [
    {
      "key": "name",
      "type": "text",
      "label": "Nome Completo",
      "order": 1,
      "config": { "required": true, "minLength": 3, "maxLength": 100 }
    },
    {
      "key": "age",
      "type": "number",
      "label": "Idade",
      "order": 2,
      "config": { "required": true, "min": 0, "max": 120 }
    },
    {
      "key": "relationship",
      "type": "select",
      "label": "Parentesco",
      "order": 3,
      "config": {
        "required": true,
        "options": [
          { "value": "spouse", "label": "Cônjuge" },
          { "value": "child", "label": "Filho(a)" },
          { "value": "parent", "label": "Pai/Mãe" },
          { "value": "sibling", "label": "Irmão/Irmã" },
          { "value": "other", "label": "Outro" }
        ]
      }
    }
  ]
}
```

### 3.3 Schema Validator Update

```typescript
// src/utils/schemaValidator.ts

export function validateSchema(schema: any): ValidationResult {
  const errors: string[] = [];

  // ... validações existentes ...

  // Validar type
  const validTypes = ['default', 'repeater'];
  if (schema.type && !validTypes.includes(schema.type)) {
    errors.push(
      `Invalid form type: '${schema.type}'. Must be one of: ${validTypes.join(', ')}`
    );
  }

  // Se type === 'repeater', validar repeaterConfig
  if (schema.type === 'repeater') {
    if (schema.repeaterConfig) {
      const config = schema.repeaterConfig;

      if (config.minEntries !== undefined) {
        if (typeof config.minEntries !== 'number' || config.minEntries < 0) {
          errors.push('repeaterConfig.minEntries must be a non-negative number.');
        }
      }

      if (config.maxEntries !== undefined) {
        if (typeof config.maxEntries !== 'number' || config.maxEntries < 1) {
          errors.push('repeaterConfig.maxEntries must be at least 1.');
        }
      }

      if (
        config.minEntries !== undefined &&
        config.maxEntries !== undefined &&
        config.minEntries > config.maxEntries
      ) {
        errors.push('repeaterConfig.minEntries cannot be greater than maxEntries.');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## 4. Estrutura de Dados

### 4.1 Estado do Componente (Frontend)

```typescript
interface RepeaterFormState {
  entries: RepeaterEntry[];           // Lista de entradas salvas temporariamente
  currentEntry: FormData | null;      // Entrada sendo preenchida/editada
  editingIndex: number | null;        // Índice da entrada em edição (-1 = nova)
  isValid: boolean;                   // Se a entrada atual é válida
}

// Exemplo de entries:
const entries: RepeaterEntry[] = [
  {
    id: "uuid-abc-123",
    data: { 
      name: "João Silva", 
      age: 5, 
      relationship: "child" 
    },
    timestamp: 1678901234567,
    isValid: true
  },
  {
    id: "uuid-def-456",
    data: { 
      name: "Maria Silva", 
      age: 35, 
      relationship: "spouse" 
    },
    timestamp: 1678901245678,
    isValid: true
  }
];
```

### 4.2 Formato de Submissão

**Formulário Default (atual)**:
```javascript
// onSubmit recebe:
const data = {
  name: "João Silva",
  age: 30,
  email: "joao@example.com"
};

console.log('Form submitted:', data);
```

**Formulário Repeater (novo)**:
```javascript
// onSubmit recebe array:
const data = [
  {
    name: "João Silva",
    age: 5,
    relationship: "child"
  },
  {
    name: "Maria Silva",
    age: 35,
    relationship: "spouse"
  },
  {
    name: "Pedro Silva",
    age: 65,
    relationship: "parent"
  }
];

console.log('Repeater form submitted:', data);
// Output no console:
// [
//   { name: "João Silva", age: 5, relationship: "child" },
//   { name: "Maria Silva", age: 35, relationship: "spouse" },
//   { name: "Pedro Silva", age: 65, relationship: "parent" }
// ]
```

### 4.3 Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│ 1. Usuário preenche formulário                 │
│    { name: "João", age: 5, relationship: ... } │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ 2. Clica "Adicionar outro dependente"          │
│    → Validação individual (Zod)                │
│    → Se válido: adiciona ao array `entries`    │
│    → Reset do formulário                       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ 3. Entradas aparecem em lista                  │
│    [📋 Dependente 1] [✏️ Edit] [🗑️ Delete]     │
│    [📋 Dependente 2] [✏️ Edit] [🗑️ Delete]     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ 4. Usuário clica "Salvar Todos"                │
│    → Extrai apenas o campo `data` de cada entry│
│    → onSubmit(entries.map(e => e.data))        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ 5. Por enquanto: console.log(data)             │
│    Futuro: enviar para API                     │
└─────────────────────────────────────────────────┘
```

---

## 5. Componentes Frontend

### 5.1 Component Tree

```
<DynamicForm>
  │
  ├─ schema.type === 'default' → <SingleForm>
  │   └─ <FieldRenderer> (existente)
  │
  └─ schema.type === 'repeater' → <RepeaterForm>
      │
      ├─ <RepeaterList> (lista de entradas salvas)
      │   └─ <RepeaterItem> × N
      │       ├─ Exibir resumo dos dados
      │       ├─ [✏️ Edit Button]
      │       └─ [🗑️ Delete Button]
      │
      └─ <RepeaterInputForm> (formulário de entrada/edição)
          ├─ <FieldRenderer> × N
          ├─ [Cancelar] (se editando)
          └─ [➕ Adicionar / 💾 Salvar]
```

### 5.2 RepeaterForm Component (Container)

```tsx
// src/components/DynamicForm/RepeaterForm.tsx
import { useState } from 'react';
import { FormSchema, RepeaterEntry } from '../../types/schema.types';
import { RepeaterList } from './RepeaterList';
import { RepeaterInputForm } from './RepeaterInputForm';
import { v4 as uuidv4 } from 'uuid';

interface RepeaterFormProps {
  schema: FormSchema;
  onSubmit: (data: Array<Record<string, any>>) => void;
}

export function RepeaterForm({ schema, onSubmit }: RepeaterFormProps) {
  const [entries, setEntries] = useState<RepeaterEntry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const config = schema.repeaterConfig || {};
  const {
    minEntries = 0,
    maxEntries = Infinity,
    addButtonText = 'Adicionar outro',
    itemLabel = 'Item',
    confirmDelete = true,
    showCounter = true,
  } = config;

  const canAdd = entries.length < maxEntries;
  const canSubmit = entries.length >= minEntries;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleAdd = (data: Record<string, any>) => {
    const newEntry: RepeaterEntry = {
      id: uuidv4(),
      data,
      timestamp: Date.now(),
      isValid: true,
    };

    setEntries([...entries, newEntry]);
    setEditingIndex(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (data: Record<string, any>) => {
    if (editingIndex === null) return;

    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = {
      ...updatedEntries[editingIndex],
      data,
      timestamp: Date.now(),
    };

    setEntries(updatedEntries);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    if (confirmDelete) {
      const confirmMsg = `Tem certeza que deseja excluir ${itemLabel} ${index + 1}?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }

    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newEntries = [...entries];
    const [movedItem] = newEntries.splice(fromIndex, 1);
    newEntries.splice(toIndex, 0, movedItem);
    setEntries(newEntries);
  };

  const handleFinalSubmit = () => {
    if (!canSubmit) {
      alert(`Você precisa adicionar pelo menos ${minEntries} ${itemLabel}(s).`);
      return;
    }

    // Extrair apenas os dados (sem id, timestamp, isValid)
    const data = entries.map(entry => entry.data);
    
    // Por enquanto, apenas console.log
    console.log('Repeater form submitted:', data);
    
    // Chamar callback
    onSubmit(data);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {schema.title}
        </h1>
        {schema.description && (
          <p className="text-gray-600">{schema.description}</p>
        )}
        {showCounter && (
          <p className="text-sm text-gray-500 mt-2">
            {entries.length} {itemLabel}(s) adicionado(s)
            {maxEntries !== Infinity && ` de ${maxEntries} permitido(s)`}
          </p>
        )}
      </div>

      {/* Lista de entradas */}
      {entries.length > 0 && (
        <RepeaterList
          entries={entries}
          itemLabel={itemLabel}
          allowReorder={config.allowReorder}
          editingIndex={editingIndex}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}

      {/* Formulário de entrada */}
      {(editingIndex === null && canAdd) || editingIndex !== null ? (
        <RepeaterInputForm
          schema={schema}
          initialData={editingIndex !== null ? entries[editingIndex].data : undefined}
          isEditing={editingIndex !== null}
          addButtonText={addButtonText}
          onAdd={handleAdd}
          onSaveEdit={handleSaveEdit}
          onCancel={editingIndex !== null ? handleCancelEdit : undefined}
        />
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
          Limite de {maxEntries} {itemLabel}(s) atingido.
        </div>
      )}

      {/* Footer com botão de submit */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <button
          type="button"
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
        >
          ← Voltar
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={!canSubmit}
          className={`
            px-6 py-3 font-medium rounded-md transition
            ${canSubmit
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          ✓ Salvar Todos ({entries.length})
        </button>
      </div>
    </div>
  );
}
```

### 5.3 RepeaterList Component

```tsx
// src/components/DynamicForm/RepeaterList.tsx
import { RepeaterEntry } from '../../types/schema.types';

interface RepeaterListProps {
  entries: RepeaterEntry[];
  itemLabel: string;
  allowReorder?: boolean;
  editingIndex: number | null;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export function RepeaterList({
  entries,
  itemLabel,
  allowReorder = false,
  editingIndex,
  onEdit,
  onDelete,
}: RepeaterListProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <span>📋</span>
        {itemLabel}s Adicionados ({entries.length})
      </h3>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`
              border rounded-lg p-4 bg-white transition
              ${editingIndex === index 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
              ${allowReorder ? 'cursor-move' : ''}
            `}
            draggable={allowReorder}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Conteúdo */}
              <div className="flex-1">
                {/* Header do item */}
                <div className="flex items-center gap-2 mb-2">
                  {allowReorder && (
                    <span className="text-gray-400 text-sm">☰</span>
                  )}
                  <h4 className="font-medium text-gray-900">
                    {itemLabel} {index + 1}
                  </h4>
                  {editingIndex === index && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Editando...
                    </span>
                  )}
                </div>

                {/* Resumo dos dados */}
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(entry.data).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium min-w-[120px] capitalize">
                        {key}:
                      </span>
                      <span className="flex-1">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Editar"
                  disabled={editingIndex !== null && editingIndex !== index}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  title="Excluir"
                  disabled={editingIndex !== null}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5.4 RepeaterInputForm Component

```tsx
// src/components/DynamicForm/RepeaterInputForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from '../../types/schema.types';
import { FieldRenderer } from '../FieldRenderer/FieldRenderer';
import { buildZodSchema } from '../../utils/zodSchemaBuilder';

interface RepeaterInputFormProps {
  schema: FormSchema;
  initialData?: Record<string, any>;
  isEditing: boolean;
  addButtonText: string;
  onAdd: (data: Record<string, any>) => void;
  onSaveEdit: (data: Record<string, any>) => void;
  onCancel?: () => void;
}

export function RepeaterInputForm({
  schema,
  initialData,
  isEditing,
  addButtonText,
  onAdd,
  onSaveEdit,
  onCancel,
}: RepeaterInputFormProps) {
  const zodSchema = buildZodSchema(schema.fields);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialData || {},
    resolver: zodResolver(zodSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: Record<string, any>) => {
    if (isEditing) {
      onSaveEdit(data);
    } else {
      onAdd(data);
      reset(); // Limpar formulário após adicionar
    }
  };

  const sortedFields = [...schema.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        {isEditing ? '✏️ Editar Item' : '➕ Adicionar Novo Item'}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          {sortedFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              register={register}
              errors={errors}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className={`
              flex-1 px-4 py-3 font-medium rounded-md transition
              ${isValid
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isEditing ? '💾 Salvar Alterações' : `➕ ${addButtonText}`}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 5.5 Update DynamicForm (Router)

```tsx
// src/components/DynamicForm/DynamicForm.tsx
import { FormSchema } from '../../types/schema.types';
import { SingleForm } from './SingleForm'; // Componente existente (renomeado)
import { RepeaterForm } from './RepeaterForm';

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (data: any) => void;
}

export function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const formType = schema.type || 'default';

  switch (formType) {
    case 'repeater':
      return <RepeaterForm schema={schema} onSubmit={onSubmit} />;
    
    case 'default':
    default:
      return <SingleForm schema={schema} onSubmit={onSubmit} />;
  }
}
```

---

## 6. UX/UI Guidelines

### 6.1 Estados Visuais

**Estado 1: Lista Vazia**
```
┌──────────────────────────────────────────┐
│ 📝 Nenhum dependente adicionado          │
│ Preencha o formulário abaixo para        │
│ adicionar seu primeiro dependente        │
└──────────────────────────────────────────┘
```

**Estado 2: Adicionando**
- Formulário visível e ativo
- Botão "Adicionar outro dependente" habilitado
- Validação em tempo real (borda verde/vermelha)

**Estado 3: Editando**
- Item da lista destacado (borda azul)
- Formulário preenchido com dados do item
- Botão "Salvar Alterações" + "Cancelar"
- Outros botões de edição desabilitados

**Estado 4: Limite Atingido**
```
┌──────────────────────────────────────────┐
│ ⚠️ Limite de 10 dependentes atingido     │
│ Exclua um dependente para adicionar mais │
└──────────────────────────────────────────┘
```

### 6.2 Feedback Visual

**Validação de Campos**:
- ✅ Válido: borda verde (`border-green-500`)
- ❌ Inválido: borda vermelha + mensagem (`border-red-500`)
- ⏳ Validando: spinner sutil

**Ações**:
- Adicionar: fade-in do novo item
- Deletar: fade-out + confirmação
- Editar: highlight do item sendo editado
- Salvar todos: loading state no botão (futuro)

### 6.3 Mensagens ao Usuário

```typescript
const messages = {
  emptyList: `Nenhum ${itemLabel} adicionado ainda`,
  minEntriesNotMet: `Você precisa adicionar pelo menos ${minEntries} ${itemLabel}(s) para continuar`,
  maxEntriesReached: `Limite de ${maxEntries} ${itemLabel}(s) atingido`,
  confirmDelete: `Tem certeza que deseja excluir ${itemLabel} ${index + 1}?`,
  submitInfo: `${entries.length} ${itemLabel}(s) serão enviados`,
};
```

### 6.4 Acessibilidade (a11y)

```tsx
// ARIA labels e roles
<div role="list" aria-label={`${itemLabel}s adicionados`}>
  {entries.map((entry, index) => (
    <div role="listitem" aria-label={`${itemLabel} ${index + 1}`}>
      {/* ... */}
      <button 
        aria-label={`Editar ${itemLabel} ${index + 1}`}
        onClick={() => onEdit(index)}
      >
        ✏️
      </button>
      <button 
        aria-label={`Excluir ${itemLabel} ${index + 1}`}
        onClick={() => onDelete(index)}
      >
        🗑️
      </button>
    </div>
  ))}
</div>

// Navegação por teclado
- Tab: Navegar entre campos e botões
- Enter: Submeter formulário / Confirmar ação
- Esc: Cancelar edição
```

---

## 7. Validações

### 7.1 Validação por Entrada (Individual)

Cada entrada é validada individualmente usando Zod + React Hook Form:

```typescript
// Exemplo de validação para campo "age"
z.number()
  .min(0, 'Idade não pode ser negativa')
  .max(120, 'Idade inválida')
  .refine(val => Number.isInteger(val), 'Idade deve ser um número inteiro')
```

**Benefícios**:
- Feedback imediato ao usuário
- Evita adicionar entradas inválidas na lista
- Botão "Adicionar" desabilitado se inválido

### 7.2 Validação Global do Repeater

```typescript
const canSubmit = useMemo(() => {
  const meetsMinEntries = entries.length >= (repeaterConfig.minEntries || 0);
  const allEntriesValid = entries.every(e => e.isValid);
  
  return meetsMinEntries && allEntriesValid;
}, [entries, repeaterConfig]);
```

---

## 8. Edge Cases

### 8.1 Casos Críticos

| Edge Case | Comportamento | Implementação |
|-----------|---------------|---------------|
| Usuário tenta adicionar além do `maxEntries` | Botão "Adicionar" desabilitado, mensagem exibida | `canAdd = entries.length < maxEntries` |
| Usuário tenta submeter com menos que `minEntries` | Botão "Salvar Todos" desabilitado, alert | `canSubmit = entries.length >= minEntries` |
| Usuário edita e clica em "Cancelar" | Dados retornam ao estado anterior | `handleCancelEdit()` reseta `editingIndex` |
| Usuário sai da página com dados não salvos | Browser native confirmation "Deseja sair?" | `useEffect` com `beforeunload` |
| Validação falha ao editar | Destaque visual no erro, não salva | React Hook Form `setFocus` |
| Formulário tem 0 campos | Erro no schema validator | Bloqueia na validação |
| `maxEntries = 1` | Funciona como lista de 1 item editável | Funciona normalmente |

### 8.2 Exemplo de beforeunload

```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (entries.length > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [entries.length]);
```

---

## 9. Tasks de Implementação

### FASE 1: Schema e Types (1-2h)

#### Task 1.1: Atualizar Types
- [ ] Adicionar `FormType` enum (`'default' | 'repeater'`)
- [ ] Adicionar `RepeaterConfig` interface
- [ ] Atualizar `FormSchema` com `type?` e `repeaterConfig?`
- [ ] Adicionar `RepeaterEntry` interface
- [ ] Exportar todos os tipos em `index.ts`

#### Task 1.2: Atualizar Schema Validator
- [ ] Validar `type` field (deve ser 'default' ou 'repeater')
- [ ] Validar `repeaterConfig` quando `type === 'repeater'`
  - minEntries >= 0
  - maxEntries >= 1
  - minEntries <= maxEntries
- [ ] Adicionar testes unitários para validação

**Commit**: `feat(schema): add repeater form type support`

**Tempo estimado**: 1-2h

---

### FASE 2: Componentes Frontend (4-6h)

#### Task 2.1: RepeaterInputForm Component
- [ ] Criar componente base (`src/components/DynamicForm/RepeaterInputForm.tsx`)
- [ ] Integrar com React Hook Form + Zod
- [ ] Renderizar fields usando `FieldRenderer`
- [ ] Implementar botões: "Adicionar" / "Salvar Alterações" / "Cancelar"
- [ ] Validação em tempo real
- [ ] Reset após adicionar

#### Task 2.2: RepeaterList Component
- [ ] Criar componente (`src/components/DynamicForm/RepeaterList.tsx`)
- [ ] Renderizar lista de `RepeaterEntry[]`
- [ ] Card por item com resumo dos dados
- [ ] Botões Edit/Delete por item
- [ ] Destaque visual para item sendo editado
- [ ] Empty state ("Nenhum item adicionado")

#### Task 2.3: RepeaterForm Container
- [ ] Criar componente container (`src/components/DynamicForm/RepeaterForm.tsx`)
- [ ] Estado: `entries`, `editingIndex`
- [ ] Handlers: `handleAdd`, `handleEdit`, `handleSaveEdit`, `handleDelete`, `handleCancelEdit`
- [ ] Lógica de `canAdd` e `canSubmit`
- [ ] Integrar `RepeaterList` e `RepeaterInputForm`
- [ ] Header com contador
- [ ] Footer com botão "Salvar Todos"
- [ ] `console.log` dos dados ao submeter

#### Task 2.4: Atualizar DynamicForm Router
- [ ] Detectar `schema.type`
- [ ] Renderizar `<SingleForm>` se `type === 'default'`
- [ ] Renderizar `<RepeaterForm>` se `type === 'repeater'`
- [ ] Passar props corretas

#### Task 2.5: Styling
- [ ] Adicionar classes Tailwind
- [ ] Animações (fade-in, fade-out)
- [ ] Responsividade mobile

**Commit**: `feat(ui): implement repeater form components`

**Tempo estimado**: 4-6h

---

### FASE 3: Schemas de Exemplo (1h)

#### Task 3.1: Criar Schema de Dependentes
- [ ] Criar `public/schemas/dependentes-form.json`
- [ ] Configurar `type: 'repeater'`
- [ ] Definir `repeaterConfig` com limites e labels
- [ ] Campos: name, age, relationship

#### Task 3.2: Criar Outros Exemplos
- [ ] **Endereços**: `enderecos-form.json`
  - street, number, city, state, zipcode, type (residential/commercial)
- [ ] **Experiências Profissionais**: `experiencias-form.json`
  - company, role, startDate, endDate, description
- [ ] **Certificações**: `certificacoes-form.json`
  - name, institution, date, url

#### Task 3.3: Atualizar App.tsx
- [ ] Adicionar seletor de schemas
- [ ] Carregar schema selecionado
- [ ] Passar para `<DynamicForm>`

**Commit**: `docs: add repeater form example schemas`

**Tempo estimado**: 1h

---

### FASE 4: UX Enhancements (2-3h - Opcional)

#### Task 4.1: Drag and Drop Reordering
- [ ] Instalar `@dnd-kit/core` e `@dnd-kit/sortable`
- [ ] Implementar `handleReorder` no RepeaterForm
- [ ] Visual feedback durante drag
- [ ] Indicador de posição de drop

#### Task 4.2: Collapse/Expand Items
- [ ] Estado `collapsed` por item
- [ ] Animação smooth de expand/collapse
- [ ] Ícone indicador (▼/▶)
- [ ] "Expandir todos" / "Recolher todos" buttons

#### Task 4.3: Confirmação ao Sair
- [ ] Detectar dados não salvos (`entries.length > 0`)
- [ ] `beforeunload` event handler
- [ ] Mensagem customizada

**Commit**: `feat(ux): advanced UX features for repeater forms`

**Tempo estimado**: 2-3h (opcional)

---

### FASE 5: Testes (3-4h)

#### Task 5.1: Unit Tests - Components
- [ ] `RepeaterForm.test.tsx`:
  - Add entry
  - Edit entry
  - Delete entry
  - Min/Max validation
  - Submit disabled when < minEntries
- [ ] `RepeaterList.test.tsx`:
  - Render entries correctly
  - Edit button triggers callback
  - Delete button shows confirmation
- [ ] `RepeaterInputForm.test.tsx`:
  - Validation works
  - Reset after add
  - Cancel editing

#### Task 5.2: Integration Tests
- [ ] Fluxo completo:
  1. Adicionar 3 dependentes
  2. Editar o segundo
  3. Excluir o primeiro
  4. Submeter
- [ ] Min/Max entries enforcement
- [ ] Validation errors

**Commit**: `test: comprehensive tests for repeater forms`

**Tempo estimado**: 3-4h

---

### 🎯 Estimativa Total

| Fase | Horas | Dias (8h) | Prioridade |
|------|-------|-----------|------------|
| Fase 1 | 1-2h | 0.1-0.25 | ⭐⭐⭐ Alta |
| Fase 2 | 4-6h | 0.5-0.75 | ⭐⭐⭐ Alta |
| Fase 3 | 1h | 0.1 | ⭐⭐ Média |
| Fase 4 | 2-3h | 0.25-0.4 | ⭐ Baixa (Opcional) |
| Fase 5 | 3-4h | 0.4-0.5 | ⭐⭐ Média |
| **TOTAL** | **11-16h** | **1.4-2 dias** | |

**Com IA (Claude Code)**: Redução de ~50% = **6-8 horas** (1 dia)

---

## 10. Testes

### 10.1 Unit Test Example

```typescript
// src/components/DynamicForm/RepeaterForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RepeaterForm } from './RepeaterForm';
import { FormSchema } from '../../types/schema.types';

describe('RepeaterForm', () => {
  const mockSchema: FormSchema = {
    formId: 'test-form',
    title: 'Dependentes',
    type: 'repeater',
    repeaterConfig: {
      minEntries: 1,
      maxEntries: 3,
      itemLabel: 'Dependente',
      addButtonText: 'Adicionar dependente',
    },
    fields: [
      {
        key: 'name',
        type: 'text',
        label: 'Nome',
        order: 1,
        config: { required: true },
      },
      {
        key: 'age',
        type: 'number',
        label: 'Idade',
        order: 2,
        config: { required: true, min: 0, max: 120 },
      },
    ],
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render empty state', () => {
    render(<RepeaterForm schema={mockSchema} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Dependentes')).toBeInTheDocument();
    expect(screen.getByText(/0 Dependente\(s\) adicionado/)).toBeInTheDocument();
  });

  it('should add a new entry', async () => {
    render(<RepeaterForm schema={mockSchema} onSubmit={mockOnSubmit} />);
    
    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'João Silva' },
    });
    fireEvent.change(screen.getByLabelText('Idade'), {
      target: { value: '5' },
    });
    
    // Adicionar
    fireEvent.click(screen.getByText('Adicionar dependente'));
    
    await waitFor(() => {
      expect(screen.getByText('Dependente 1')).toBeInTheDocument();
      expect(screen.getByText(/João Silva/)).toBeInTheDocument();
      expect(screen.getByText(/1 Dependente\(s\) adicionado/)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with array of data', async () => {
    render(<RepeaterForm schema={mockSchema} onSubmit={mockOnSubmit} />);
    
    // Adicionar 2 entradas
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'João Silva' },
    });
    fireEvent.change(screen.getByLabelText('Idade'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByText('Adicionar dependente'));
    
    await waitFor(() => screen.getByText('Dependente 1'));
    
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Maria Silva' },
    });
    fireEvent.change(screen.getByLabelText('Idade'), {
      target: { value: '35' },
    });
    fireEvent.click(screen.getByText('Adicionar dependente'));
    
    // Submeter
    await waitFor(() => screen.getByText('Dependente 2'));
    fireEvent.click(screen.getByText(/Salvar Todos \(2\)/));
    
    expect(mockOnSubmit).toHaveBeenCalledWith([
      { name: 'João Silva', age: 5 },
      { name: 'Maria Silva', age: 35 },
    ]);
    
    expect(console.log).toHaveBeenCalledWith(
      'Repeater form submitted:',
      expect.arrayContaining([
        { name: 'João Silva', age: 5 },
        { name: 'Maria Silva', age: 35 },
      ])
    );
  });
});
```

---

## 11. Exemplos de Uso

### 11.1 Dependentes

```json
{
  "formId": "dependentes-form",
  "title": "Cadastro de Dependentes",
  "description": "Adicione informações sobre seus dependentes",
  "type": "repeater",
  "repeaterConfig": {
    "minEntries": 0,
    "maxEntries": 10,
    "addButtonText": "Adicionar outro dependente",
    "itemLabel": "Dependente",
    "allowReorder": false,
    "confirmDelete": true,
    "showCounter": true
  },
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
        "placeholder": "Ex: João Silva Santos"
      }
    },
    {
      "key": "age",
      "type": "number",
      "label": "Idade",
      "order": 2,
      "config": {
        "required": true,
        "min": 0,
        "max": 120
      }
    },
    {
      "key": "birthdate",
      "type": "date",
      "label": "Data de Nascimento",
      "order": 3,
      "config": {
        "required": true
      }
    },
    {
      "key": "relationship",
      "type": "select",
      "label": "Grau de Parentesco",
      "order": 4,
      "config": {
        "required": true,
        "options": [
          { "value": "spouse", "label": "Cônjuge" },
          { "value": "child", "label": "Filho(a)" },
          { "value": "parent", "label": "Pai/Mãe" },
          { "value": "sibling", "label": "Irmão/Irmã" },
          { "value": "other", "label": "Outro" }
        ]
      }
    }
  ]
}
```

**Output ao submeter**:
```javascript
// Console output:
Repeater form submitted: [
  {
    name: "João Silva Santos",
    age: 5,
    birthdate: "2019-03-15",
    relationship: "child"
  },
  {
    name: "Maria Silva",
    age: 35,
    birthdate: "1989-07-22",
    relationship: "spouse"
  }
]
```

### 11.2 Endereços

```json
{
  "formId": "enderecos-form",
  "title": "Cadastro de Endereços",
  "description": "Adicione todos os seus endereços",
  "type": "repeater",
  "repeaterConfig": {
    "minEntries": 1,
    "maxEntries": 5,
    "addButtonText": "Adicionar outro endereço",
    "itemLabel": "Endereço",
    "allowReorder": true
  },
  "fields": [
    {
      "key": "type",
      "type": "select",
      "label": "Tipo",
      "order": 1,
      "config": {
        "required": true,
        "options": [
          { "value": "residential", "label": "Residencial" },
          { "value": "commercial", "label": "Comercial" }
        ]
      }
    },
    {
      "key": "zipcode",
      "type": "text",
      "label": "CEP",
      "order": 2,
      "config": {
        "required": true,
        "pattern": "^[0-9]{5}-[0-9]{3}$"
      }
    },
    {
      "key": "street",
      "type": "text",
      "label": "Rua",
      "order": 3,
      "config": { "required": true }
    },
    {
      "key": "number",
      "type": "text",
      "label": "Número",
      "order": 4,
      "config": { "required": true }
    },
    {
      "key": "city",
      "type": "text",
      "label": "Cidade",
      "order": 5,
      "config": { "required": true }
    }
  ]
}
```

---

## 📚 Conclusão

Esta feature de **Repeater Forms** adiciona funcionalidade essencial ao DynamicForms, permitindo que usuários preencham múltiplas entradas do mesmo formulário.

### ✅ O que foi entregue neste documento:

1. **Schema completo** - TypeScript types + JSON examples
2. **Componentes React prontos** - RepeaterForm, RepeaterList, RepeaterInputForm
3. **UX Guidelines detalhadas** - Estados visuais, feedback, acessibilidade
4. **Validações robustas** - Individual + Global
5. **Edge cases mapeados** - 10+ cenários tratados
6. **Tasks de implementação** - Checklist completo com estimativas
7. **Testes unitários** - Exemplos prontos para usar
8. **Schemas de exemplo** - Dependentes, Endereços, Experiências

### 🎯 Formato de Saída Atual:

```javascript
// Por enquanto: apenas console.log
console.log('Repeater form submitted:', [
  { name: "João", age: 5, relationship: "child" },
  { name: "Maria", age: 35, relationship: "spouse" }
]);
```

### 📖 Próximo Passo:

Consultar documento **"06_Backend_Data_Persistence_Planning.md"** para ver como esses dados serão salvos no futuro (API, formato, estratégias).

---

**Versão**: 1.0 (Frontend Only)  
**Criado em**: 11 de Março de 2026  
**Status**: Pronto para implementação  
**Estimativa**: 11-16h (6-8h com IA)
