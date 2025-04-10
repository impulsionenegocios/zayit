import { h, type VNode, type Component } from 'vue';
import ActionButton from '@/components/ui/ActionButton.vue';

export function createActionButton(
  props: InstanceType<typeof ActionButton>['$props'],
  slots?: Record<string, () => VNode>,
): () => VNode {
  return () => h(ActionButton as Component, props, slots);
}
