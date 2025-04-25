import { onMounted, onUnmounted } from 'vue';
import { useActionButton } from '@/stores/layout/actionButton';
import { createActionButton } from '@/helpers/createActionButton';
export function usePageActionButton(props, slots) {
    const actionButton = useActionButton();
    onMounted(() => {
        actionButton.component = createActionButton(props, slots);
    });
    onUnmounted(() => {
        actionButton.component = null;
    });
}
