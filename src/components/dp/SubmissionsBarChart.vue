<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DailySubmissionCount } from '@/services/applications/applicationsService'

const props = defineProps<{ data: DailySubmissionCount[] }>()

const scrollRef = ref<HTMLElement | null>(null)

const max = computed(() => Math.max(1, ...props.data.map((d) => d.count)))

onMounted(() => {
  // mostra os dias mais recentes por padrao quando a lista nao cabe na tela
  if (scrollRef.value) scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
})

function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatWeekday(iso: string) {
  return new Date(`${iso}T12:00:00`)
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
}
</script>

<template>
  <div ref="scrollRef" class="bar-chart">
    <div class="bar-chart__row">
      <div v-for="day in data" :key="day.date" class="bar-chart__col">
        <span class="bar-chart__value">{{ day.count > 0 ? day.count : '' }}</span>
        <div class="bar-chart__track">
          <div
            class="bar-chart__bar"
            :class="{ 'bar-chart__bar--empty': day.count === 0 }"
            :style="{ height: `${(day.count / max) * 100}%` }"
          />
        </div>
        <span class="bar-chart__weekday">{{ formatWeekday(day.date) }}</span>
        <span class="bar-chart__day">{{ formatDay(day.date) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-chart {
  overflow-x: auto;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
  mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
}
.bar-chart__row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-width: min-content;
  padding-bottom: 2px;
}
.bar-chart__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 30px;
  flex-shrink: 0;
}
.bar-chart__value {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--pralis-primary-dark);
  height: 14px;
}
.bar-chart__track {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: flex-end;
  background: var(--pralis-surface-alt);
  border-radius: var(--pralis-radius-sm);
  overflow: hidden;
}
.bar-chart__bar {
  width: 100%;
  min-height: 3px;
  background: linear-gradient(180deg, var(--pralis-primary) 0%, var(--pralis-primary-dark) 100%);
  border-radius: var(--pralis-radius-sm) var(--pralis-radius-sm) 0 0;
  transition: height 0.5s ease;
}
.bar-chart__bar--empty {
  background: var(--pralis-border);
}
@media (prefers-reduced-motion: reduce) {
  .bar-chart__bar {
    transition: none;
  }
}
.bar-chart__weekday {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--pralis-text-secondary);
  text-transform: capitalize;
  margin-top: 4px;
}
.bar-chart__day {
  font-size: 0.65rem;
  color: var(--pralis-text-muted);
}
</style>
