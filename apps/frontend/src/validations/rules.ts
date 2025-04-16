import { required, email, min } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';

// Registre as regras que serão usadas globalmente
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
