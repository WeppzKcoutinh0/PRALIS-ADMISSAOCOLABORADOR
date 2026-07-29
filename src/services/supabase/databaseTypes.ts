// Tipagem enxuta do schema do Supabase, escrita a mao para refletir as
// migrations em supabase/migrations. Caso o projeto cresça, recomenda-se
// substituir por tipos gerados via `supabase gen types typescript`.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'admin' | 'dp' | 'viewer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; full_name: string; email: string; role: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      employee_applications: {
        Row: {
          id: string
          protocol_number: string
          public_token_hash: string | null
          public_token_expires_at: string | null
          status: string
          full_name: string
          cpf: string
          birth_date: string
          rg_issue_date: string | null
          sex: string
          race_color: string
          marital_status: string
          education_level: string
          birthplace: string
          nationality: string
          mobile_phone: string | null
          email: string | null
          mother_name: string
          father_name: string | null
          privacy_notice_version: string | null
          privacy_accepted_at: string | null
          submitted_at: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['employee_applications']['Row']>
        Update: Partial<Database['public']['Tables']['employee_applications']['Row']>
      }
      employee_addresses: {
        Row: {
          id: string
          application_id: string
          postal_code: string
          street: string
          address_number: string
          complement: string | null
          district: string | null
          city: string | null
          state: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['employee_addresses']['Row']>
        Update: Partial<Database['public']['Tables']['employee_addresses']['Row']>
      }
      dp_internal_data: {
        Row: {
          id: string
          application_id: string
          job_function: string | null
          contract_type: string | null
          work_schedule: string | null
          transport_voucher_schedule: string | null
          admission_date: string | null
          first_period_days: number | null
          second_period_days: number | null
          is_trust_position: boolean | null
          is_first_job: boolean | null
          notes: string | null
          completed_by: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['dp_internal_data']['Row']>
        Update: Partial<Database['public']['Tables']['dp_internal_data']['Row']>
      }
      employee_documents: {
        Row: {
          id: string
          application_id: string
          document_type: string
          original_file_name: string
          storage_path: string
          mime_type: string
          file_size: number
          uploaded_at: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['employee_documents']['Row']>
        Update: Partial<Database['public']['Tables']['employee_documents']['Row']>
      }
      accounting_outputs: {
        Row: {
          id: string
          application_id: string
          output_version: number
          formatted_content: string
          structured_data: Record<string, unknown>
          generated_by: string
          generated_at: string
          copied_by: string | null
          copied_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['accounting_outputs']['Row']>
        Update: Partial<Database['public']['Tables']['accounting_outputs']['Row']>
      }
      application_status_history: {
        Row: {
          id: string
          application_id: string
          previous_status: string | null
          new_status: string
          changed_by: string | null
          change_reason: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['application_status_history']['Row']>
        Update: Partial<Database['public']['Tables']['application_status_history']['Row']>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          application_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['audit_logs']['Row']>
        Update: Partial<Database['public']['Tables']['audit_logs']['Row']>
      }
    }
  }
}
