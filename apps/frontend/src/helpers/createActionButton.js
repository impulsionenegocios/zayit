import { h } from 'vue';
import ActionButton from '@/components/ui/ActionButton.vue';
export function createActionButton(props, slots) {
    return () => h(ActionButton, props, slots);
}
