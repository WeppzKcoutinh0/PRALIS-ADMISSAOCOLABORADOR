<script setup lang="ts">
import { computed } from 'vue'

export interface DonutSegment {
  id: string
  label: string
  value: number
  color: string
}

const props = defineProps<{ segments: DonutSegment[] }>()

const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0))
const radius = 54
const circumference = 2 * Math.PI * radius

const arcs = computed(() => {
  let cumulative = 0
  return props.segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const fraction = total.value > 0 ? segment.value / total.value : 0
      const length = fraction * circumference
      const arc = {
        id: segment.id,
        color: segment.color,
        dasharray: `${length} ${circumference - length}`,
        dashoffset: -cumulative
      }
      cumulative += length
      return arc
    })
})
</script>

<template>
  <div class="donut">
    <svg viewBox="0 0 140 140" class="donut__svg" role="img" :aria-label="`${total} cadastros no total, distribuídos por status`">
      <circle cx="70" cy="70" :r="radius" fill="none" stroke="var(--pralis-border)" stroke-width="18" />
      <circle
        v-for="arc in arcs"
        :key="arc.id"
        cx="70"
        cy="70"
        :r="radius"
        fill="none"
        :stroke="arc.color"
        stroke-width="18"
        :stroke-dasharray="arc.dasharray"
        :stroke-dashoffset="arc.dashoffset"
        transform="rotate(-90 70 70)"
        class="donut__arc"
      />
      <text x="70" y="66" text-anchor="middle" class="donut__total-number">{{ total }}</text>
      <text x="70" y="84" text-anchor="middle" class="donut__total-label">no total</text>
    </svg>

    <ul class="donut__legend">
      <li v-for="segment in segments" :key="segment.id" class="donut__legend-item">
        <span class="donut__dot" :style="{ backgroundColor: segment.color }" />
        <span class="donut__legend-label">{{ segment.label }}</span>
        <span class="donut__legend-value">{{ segment.value }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut {
  display: flex;
  align-items: center;
  gap: var(--pralis-space-5);
  flex-wrap: wrap;
  min-width: 0;
}
.donut__svg {
  width: 148px;
  height: 148px;
  flex-shrink: 0;
}
.donut__arc {
  transition: stroke-dasharray 0.6s ease;
}
@media (prefers-reduced-motion: reduce) {
  .donut__arc {
    transition: none;
  }
}
.donut__total-number {
  font-family: var(--pralis-font-primary);
  font-weight: 800;
  font-size: 1.6rem;
  fill: var(--pralis-text-primary);
}
.donut__total-label {
  font-family: var(--pralis-font-primary);
  font-size: 0.55rem;
  fill: var(--pralis-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.donut__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 180px;
}
.donut__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
.donut__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.donut__legend-label {
  color: var(--pralis-text-secondary);
  flex: 1;
}
.donut__legend-value {
  font-weight: 700;
  color: var(--pralis-text-primary);
}
</style>
