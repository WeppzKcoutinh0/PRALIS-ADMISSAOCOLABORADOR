<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ApplicationStatusBadge from './ApplicationStatusBadge.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import { maskCpf } from '@/services/applications/mappers'
import { formatDateTimeBr } from '@/utils/formatters'
import type { ApplicationListItem } from '@/services/applications/applicationsService'

defineProps<{ items: ApplicationListItem[]; isLoading: boolean }>()
</script>

<template>
  <div class="apps-table">
    <div v-if="isLoading" class="apps-table__skeleton">
      <BaseSkeleton v-for="n in 5" :key="n" height="52px" rounded />
    </div>

    <EmptyState
      v-else-if="items.length === 0"
      title="Nenhum cadastro encontrado"
      description="Ajuste os filtros ou aguarde novos cadastros chegarem pelo link público."
    />

    <table v-else class="apps-table__table">
      <thead>
        <tr>
          <th scope="col">Colaborador</th>
          <th scope="col">CPF</th>
          <th scope="col">Enviado em</th>
          <th scope="col">Status</th>
          <th scope="col">Dados internos</th>
          <th scope="col">Atualizado em</th>
          <th scope="col"><span class="visually-hidden">Ações</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td data-label="Colaborador">{{ item.fullName || '—' }}</td>
          <td data-label="CPF">{{ maskCpf(item.cpf) }}</td>
          <td data-label="Enviado em">{{ formatDateTimeBr(item.submittedAt) || '—' }}</td>
          <td data-label="Status"><ApplicationStatusBadge :status="item.status" /></td>
          <td data-label="Dados internos">
            <span v-if="item.status === 'cancelled'" class="apps-table__muted">—</span>
            <RouterLink
              v-else-if="item.internalDataPending"
              :to="{ name: 'dp-application-internal', params: { id: item.id } }"
              class="apps-table__pending-link"
            >
              <BaseBadge tone="warning">Pendente</BaseBadge>
            </RouterLink>
            <BaseBadge v-else tone="success">Preenchidos</BaseBadge>
          </td>
          <td data-label="Atualizado em">{{ formatDateTimeBr(item.updatedAt) }}</td>
          <td data-label="Ações">
            <RouterLink :to="{ name: 'dp-application-detail', params: { id: item.id } }" class="apps-table__link">
              Ver cadastro
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.apps-table__skeleton {
  display: grid;
  gap: var(--pralis-space-2);
}
.apps-table__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--pralis-surface);
  border-radius: var(--pralis-radius-md);
  overflow: hidden;
}
thead {
  display: none;
}
tbody tr {
  display: block;
  border: 1px solid var(--pralis-border);
  border-radius: var(--pralis-radius-md);
  margin-bottom: var(--pralis-space-3);
  padding: var(--pralis-space-3);
}
tbody td {
  display: flex;
  justify-content: space-between;
  gap: var(--pralis-space-2);
  padding: 6px 0;
  font-size: 0.88rem;
  border: none;
}
tbody td::before {
  content: attr(data-label);
  font-weight: 700;
  color: var(--pralis-text-muted);
}
.apps-table__link {
  font-weight: 700;
  color: var(--pralis-primary-dark);
}
.apps-table__pending-link {
  text-decoration: none;
}
.apps-table__muted {
  color: var(--pralis-text-muted);
}

@media (min-width: 860px) {
  .apps-table {
    overflow-x: auto;
  }
  .apps-table__table {
    min-width: 760px;
  }
  thead {
    display: table-header-group;
  }
  thead th {
    text-align: left;
    padding: 12px 16px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--pralis-text-muted);
    border-bottom: 1px solid var(--pralis-border);
  }
  tbody tr {
    display: table-row;
    border: none;
    margin: 0;
    border-bottom: 1px solid var(--pralis-border);
  }
  tbody td {
    display: table-cell;
    padding: 14px 16px;
  }
  tbody td::before {
    content: none;
  }
}
</style>
