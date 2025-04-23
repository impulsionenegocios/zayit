export interface Cliente {
  id: number;
  name: string;
  logo: File | null;
  email: string;
  password: string;
  role: string;
  briefing_id: number | null;
  audit_id: number | null;
  action_plan_id: number | null;
  meta_report_id: number | null;
  logo_url: string | null;
  instagram_report_id: number | null;
  gmb_report_id: number | null;
  zcard_report_id: number | null;
  analytics_report_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ClienteForm {
  name: string;
  email: string;
  password: string;
  role: string;
  logo: File | null;
}
