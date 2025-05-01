export function getContactTypeLabel(type: string): string {
  switch (type) {
    case 'call':
      return 'Ligação';
    case 'whatsapp':
      return 'Whatsapp';
    case 'email':
      return 'Email';
    case 'meeting':
      return 'Reunião';
    default:
      return 'Contato';
  }
}

export function getContactTypeIcon(type: string): string {
  switch (type) {
    case 'call':
      return 'mdi:phone';
    case 'whatsapp':
      return 'mdi:whatsapp';
    case 'email':
      return 'mdi:email';
    case 'meeting':
      return 'mdi:calendar';
    default:
      return 'mdi:account';
  }
}

export function getContactTypeClass(type: string): string {
  switch (type) {
    case 'call':
    case 'whatsapp':
      return 'bg-green-500/20 text-green-500';
    case 'email':
      return 'bg-blue-500/20 text-blue-500';
    case 'meeting':
      return 'bg-purple-500/20 text-purple-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
}
