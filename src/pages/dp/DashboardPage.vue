<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import DpLayout from '@/layouts/DpLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import ApplicationStatusBadge from '@/components/dp/ApplicationStatusBadge.vue'
import StatusDonutChart from '@/components/dp/StatusDonutChart.vue'
import SubmissionsBarChart from '@/components/dp/SubmissionsBarChart.vue'
import wheatIcon from '@/assets/brand/icons/pralis-wheat-orange.png'
import { dashboardStatusGroups } from '@/config/status'
import {
  countByStatuses,
  getSubmissionsByDay,
  listApplications,
  type ApplicationListItem,
  type DailySubmissionCount
} from '@/services/applications/applicationsService'
import { formatDateTimeBr } from '@/utils/formatters'
import { useAuth } from '@/composables/useAuth'

const { profile } = useAuth()

const kpiIcons: Record<string, 'search' | 'check' | 'cancel'> = {
  in_review: 'search',
  done: 'check',
  cancelled: 'cancel'
}

const kpiAccent: Record<string, { fg: string; bg: string }> = {
  in_review: { fg: 'var(--pralis-primary-dark)', bg: 'var(--pralis-primary-tint)' },
  done: { fg: 'var(--pralis-success)', bg: 'var(--pralis-success-tint)' },
  cancelled: { fg: 'var(--pralis-danger)', bg: 'var(--pralis-danger-tint)' }
}

const donutColor: Record<string, string> = {
  in_review: 'var(--pralis-primary)',
  done: 'var(--pralis-success)',
  cancelled: 'var(--pralis-danger)'
}

const counts = reactive<Record<string, number | null>>(
  Object.fromEntries(dashboardStatusGroups.map((g) => [g.id, null]))
)
const dailyData = ref<DailySubmissionCount[] | null>(null)
const recentApplications = ref<ApplicationListItem[] | null>(null)

const totalInPipeline = computed(() => counts.in_review)

const donutSegments = computed(() =>
  dashboardStatusGroups.map((group) => ({
    id: group.id,
    label: group.title,
    value: counts[group.id] ?? 0,
    color: donutColor[group.id]
  }))
)

const hasAnyData = computed(() => donutSegments.value.some((s) => s.value > 0))
const isCountsLoaded = computed(() => Object.values(counts).every((v) => v !== null))

onMounted(async () => {
  await Promise.all([
    ...dashboardStatusGroups.map(async (group) => {
      counts[group.id] = await countByStatuses(group.statuses)
    }),
    getSubmissionsByDay(14).then((value) => {
      dailyData.value = value
    }),
    listApplications({
      page: 1,
      pageSize: 6,
      status: 'all',
      sortBy: 'submitted_at',
      sortDirection: 'desc'
    }).then(({ items }) => {
      recentApplications.value = items
    })
  ])
})

const today = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long'
})
</script>

<template>
  <DpLayout>
    <section class="dashboard-hero">
      <div class="dashboard-hero__text">
        <h1>Olá, {{ profile?.fullName?.split(' ')[0] ?? '' }}</h1>
        <p class="dashboard-hero__subtitle">
          Hoje é {{ today }}. Aqui está um resumo dos cadastros de admissão em andamento na Pralís.
        </p>
      </div>
      <img :src="wheatIcon" alt="" class="dashboard-hero__icon" />
    </section>

    <div class="dashboard-grid">
      <RouterLink
        v-for="group in dashboardStatusGroups"
        :key="group.id"
        :to="{ name: 'dp-applications', query: { status: group.statuses[0] } }"
        class="dashboard-card-link"
      >
        <BaseCard class="dashboard-card">
          <span
            class="dashboard-card__icon"
            :style="{ color: kpiAccent[group.id].fg, backgroundColor: kpiAccent[group.id].bg }"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="kpiIcons[group.id] === 'search'">
                <circle cx="10" cy="10" r="6" />
                <line x1="14.5" y1="14.5" x2="20" y2="20" />
              </template>
              <template v-else-if="kpiIcons[group.id] === 'check'">
                <circle cx="12" cy="12" r="9" />
                <polyline points="8,12.5 11,15.5 16,9" />
              </template>
              <template v-else>
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </template>
            </svg>
          </span>
          <p class="dashboard-card__title">{{ group.title }}</p>
          <BaseSkeleton v-if="counts[group.id] === null" height="36px" width="60px" />
          <p v-else class="dashboard-card__count">{{ counts[group.id] }}</p>
        </BaseCard>
      </RouterLink>
    </div>

    <div class="dashboard-panels">
      <BaseCard class="dashboard-panel">
        <h2 class="dashboard-panel__title">Cadastros por status</h2>
        <p class="dashboard-panel__caption">Distribuição de todos os cadastros enviados até hoje.</p>
        <div v-if="!isCountsLoaded" class="dashboard-panel__loading">
          <BaseSkeleton height="148px" width="148px" rounded />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
            <BaseSkeleton v-for="i in 6" :key="i" height="14px" />
          </div>
        </div>
        <EmptyState
          v-else-if="!hasAnyData"
          title="Ainda não há cadastros"
          description="Assim que colaboradores enviarem o formulário público, o resumo aparece aqui."
        />
        <StatusDonutChart v-else :segments="donutSegments" />
      </BaseCard>

      <BaseCard class="dashboard-panel">
        <h2 class="dashboard-panel__title">Cadastros recebidos</h2>
        <p class="dashboard-panel__caption">Últimos 14 dias.</p>
        <div v-if="dailyData === null" class="dashboard-panel__loading">
          <BaseSkeleton height="140px" />
        </div>
        <SubmissionsBarChart v-else :data="dailyData" />
      </BaseCard>
    </div>

    <BaseCard class="dashboard-recent">
      <div class="dashboard-recent__header">
        <div>
          <h2 class="dashboard-panel__title">Atividade recente</h2>
          <p class="dashboard-panel__caption">Últimos cadastros enviados pelos colaboradores.</p>
        </div>
        <RouterLink :to="{ name: 'dp-applications' }" class="dashboard-recent__link">Ver todos</RouterLink>
      </div>

      <div v-if="recentApplications === null" class="dashboard-recent__loading">
        <BaseSkeleton v-for="i in 4" :key="i" height="52px" />
      </div>
      <EmptyState
        v-else-if="recentApplications.length === 0"
        title="Nenhum cadastro enviado ainda"
        description="Os cadastros recebidos pelo formulário público aparecerão aqui."
      />
      <ul v-else class="dashboard-recent__list">
        <li v-for="item in recentApplications" :key="item.id">
          <RouterLink :to="{ name: 'dp-application-detail', params: { id: item.id } }" class="dashboard-recent__item">
            <div class="dashboard-recent__item-main">
              <span class="dashboard-recent__name">{{ item.fullName }}</span>
              <span class="dashboard-recent__protocol">{{ item.protocolNumber }}</span>
            </div>
            <div class="dashboard-recent__item-meta">
              <ApplicationStatusBadge :status="item.status" />
              <BaseBadge v-if="item.status === 'dp_review' && item.internalDataPending" tone="warning">
                Preencher dados internos
              </BaseBadge>
              <span class="dashboard-recent__date">{{ formatDateTimeBr(item.submittedAt) }}</span>
            </div>
          </RouterLink>
        </li>
      </ul>
    </BaseCard>

    <p v-if="totalInPipeline !== null" class="dashboard-footnote">
      {{ totalInPipeline }} cadastro{{ totalInPipeline === 1 ? '' : 's' }} em andamento no total.
    </p>
  </DpLayout>
</template>

<style scoped>
.dashboard-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--pralis-space-4);
  background: linear-gradient(135deg, var(--pralis-primary-tint) 0%, var(--pralis-surface) 70%);
  border: 1px solid var(--pralis-border);
  border-radius: var(--pralis-radius-lg);
  padding: var(--pralis-space-5) var(--pralis-space-6);
  margin-bottom: var(--pralis-space-5);
}
.dashboard-hero h1 {
  margin-bottom: 4px;
}
.dashboard-hero__subtitle {
  margin: 0;
  text-transform: capitalize;
}
.dashboard-hero__subtitle::first-letter {
  text-transform: uppercase;
}
.dashboard-hero__icon {
  width: 56px;
  height: auto;
  flex-shrink: 0;
  opacity: 0.9;
  display: none;
}
@media (min-width: 560px) {
  .dashboard-hero__icon {
    display: block;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--pralis-space-4);
  margin-bottom: var(--pralis-space-5);
}
.dashboard-card-link {
  text-decoration: none;
}
.dashboard-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.dashboard-card-link:hover .dashboard-card {
  transform: translateY(-2px);
  box-shadow: var(--pralis-shadow-lg);
}
@media (prefers-reduced-motion: reduce) {
  .dashboard-card {
    transition: none;
  }
}
.dashboard-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--pralis-radius-md);
  margin-bottom: var(--pralis-space-3);
}
.dashboard-card__icon svg {
  width: 20px;
  height: 20px;
}
.dashboard-card__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pralis-text-secondary);
  margin-bottom: 8px;
}
.dashboard-card__count {
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--pralis-font-primary);
  color: var(--pralis-primary-dark);
  margin: 0;
}

.dashboard-panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--pralis-space-4);
  margin-bottom: var(--pralis-space-4);
}
@media (min-width: 900px) {
  .dashboard-panels {
    grid-template-columns: 1fr 1fr;
  }
}
.dashboard-panel {
  min-width: 0;
}
.dashboard-panel__title {
  font-family: var(--pralis-font-primary);
  font-size: 1rem;
  font-weight: 800;
  color: var(--pralis-text-primary);
  margin-bottom: 2px;
}
.dashboard-panel__caption {
  font-size: 0.8rem;
  color: var(--pralis-text-muted);
  margin-bottom: var(--pralis-space-4);
}
.dashboard-panel__loading {
  display: flex;
  align-items: center;
  gap: var(--pralis-space-5);
}

.dashboard-recent {
  margin-bottom: var(--pralis-space-4);
}
.dashboard-recent__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--pralis-space-3);
  margin-bottom: var(--pralis-space-3);
}
.dashboard-recent__link {
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}
.dashboard-recent__loading {
  display: flex;
  flex-direction: column;
  gap: var(--pralis-space-3);
}
.dashboard-recent__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.dashboard-recent__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 12px 8px;
  border-bottom: 1px solid var(--pralis-border);
  text-decoration: none;
  border-radius: var(--pralis-radius-sm);
}
li:last-child .dashboard-recent__item {
  border-bottom: none;
}
.dashboard-recent__item:hover {
  background: var(--pralis-surface-alt);
}
.dashboard-recent__item-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dashboard-recent__name {
  font-weight: 700;
  color: var(--pralis-text-primary);
  font-size: 0.9rem;
}
.dashboard-recent__protocol {
  font-size: 0.75rem;
  color: var(--pralis-text-muted);
}
.dashboard-recent__item-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
}
.dashboard-recent__date {
  font-size: 0.8rem;
  color: var(--pralis-text-secondary);
  white-space: nowrap;
}

.dashboard-footnote {
  text-align: center;
  font-size: 0.8rem;
  color: var(--pralis-text-muted);
}
</style>
