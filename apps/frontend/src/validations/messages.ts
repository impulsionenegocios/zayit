export const generateValidationMessage = (ctx: any) => {
  const field = ctx.field.charAt(0).toUpperCase() + ctx.field.slice(1);

  switch (ctx.rule?.name) {
    case 'required':
      return `O campo ${field} é obrigatório.`;
    case 'email':
      return `Digite um e-mail válido.`;
    case 'min':
      const minValue = Array.isArray(ctx.rule?.params) ? ctx.rule.params[0] : 0;
      return `O campo ${field} deve ter no mínimo ${minValue} caracteres.`;
    default:
      return `O campo ${field} é inválido.`;
  }
};
