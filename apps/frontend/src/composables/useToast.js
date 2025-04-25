import { useToastStore } from '@/stores/layout/toast';
export function useToast() {
    const toast = useToastStore();
    function success(message, duration = 3000) {
        toast.addToast({ type: 'success', message, duration });
    }
    function error(message, duration = 3000) {
        toast.addToast({ type: 'error', message, duration });
    }
    function info(message, duration = 3000) {
        toast.addToast({ type: 'info', message, duration });
    }
    function warning(message, duration = 3000) {
        toast.addToast({ type: 'warning', message, duration });
    }
    function custom(options) {
        toast.addToast({
            type: options.type ?? 'info',
            message: options.message,
            duration: options.duration ?? 3000,
            persistent: options.persistent ?? false,
        });
    }
    return {
        success,
        error,
        info,
        warning,
        custom,
        remove: toast.removeToast,
        dismissAll: toast.dismissAll,
    };
}
