export const CONTACT_TYPES = {
  CALL: 'call',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  MEETING: 'meeting',
} as const;

export type ContactType = (typeof CONTACT_TYPES)[keyof typeof CONTACT_TYPES];

export const CONTACT_TYPE_OPTIONS = [
  { label: 'Phone Call', value: CONTACT_TYPES.CALL },
  { label: 'WhatsApp', value: CONTACT_TYPES.WHATSAPP },
  { label: 'Email', value: CONTACT_TYPES.EMAIL },
  { label: 'Meeting', value: CONTACT_TYPES.MEETING },
];
