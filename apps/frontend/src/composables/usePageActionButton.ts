import { onMounted, onUnmounted } from 'vue';
import { useActionButton } from '@/stores/layout/actionButton';
import { createActionButton } from '@/helpers/createActionButton';
import ActionButton from '@/components/ui/ActionButton.vue';

type ActionButtonProps = InstanceType<typeof ActionButton>['$props'];

export function usePageActionButton(props: ActionButtonProps, slots?: Record<string, () => any>) {
  const actionButton = useActionButton();

  onMounted(() => {
    actionButton.component = createActionButton(props, slots);
  });

  onUnmounted(() => {
    actionButton.component = null;
  });
}
