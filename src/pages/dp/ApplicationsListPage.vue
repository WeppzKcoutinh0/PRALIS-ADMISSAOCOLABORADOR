<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DpLayout from '@/layouts/DpLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import ApplicationFilters from '@/components/dp/ApplicationFilters.vue'
import ApplicationsTable from '@/components/dp/ApplicationsTable.vue'
import Pagination from '@/components/dp/Pagination.vue'
import { useDpApplications } from '@/composables/useDpApplications'
import type { ApplicationStatus } from '@/types/status'

const route = useRoute()
const { items, total, isLoading, errorMessage, filters, fetchApplications, setPage, applyFilters } =
  useDpApplications()

onMounted(() => {
  const statusQuery = route.query.status
  if (typeof statusQuery === 'string') {
    filters.status = statusQuery as ApplicationStatus
  }
  fetchApplications()
})
</script>

<template>
  <DpLayout>
    <h1>Cadastros</h1>
    <p>Todos os cadastros enviados pelos colaboradores para o Departamento Pessoal.</p>

    <BaseCard>
      <ApplicationFilters @filter="applyFilters" />
      <BaseAlert v-if="errorMessage" tone="danger">{{ errorMessage }}</BaseAlert>
      <ApplicationsTable :items="items" :is-loading="isLoading" />
      <Pagination :page="filters.page" :page-size="filters.pageSize" :total="total" @update:page="setPage" />
    </BaseCard>
  </DpLayout>
</template>
