import type { ApiResponse } from "@/lib/api/types";
import type { ApiPayloadValue } from "@/lib/api/types";

export type SearchFilterParams = {
  [key: string]: ApiPayloadValue;
  program?: string;
  specialization?: string;
  related_programs?: string;
  related?: string;
  degreeType?: string;
  degree_type?: string;
  country?: string;
  year?: string;
  semester?: string;
  addon?: string;
  addonConditionType?: string;
  page?: number | string;
  per_page?: number | string;
};

export type Programs = {
  program: string;
  Total: number;
};
export type RelatedPrograms = {
  Total: number;
  related_programs: string;
};
export interface University {
  universitiesid: number;
  uni_no: string;
  uni_rank: number;
  uni_address: string;
  uni_fin_aid: string;
  tags: string;
  city: string;
  university: string;
  state_province: string;
  university_accreditation: string;
  uni_financial_requirements: string;
  zip_code: string;
  uni_time_zone: string;
  uni_region: string;
  primary_email: string;
  uni_requirements: string;
  phone: string;
  uni_accreditation_type: string;
  uni_institutional_code: string;
  qs_world_univ_rankings: string;
  us_news_rankings: string;
  uni_tuition_deposit: string;
  uni_website: string;
  facebook_link: string;
  linkedin_link: string;
  gplus_link: string;
  twitter_link: string;
  type_of_commission: string;
  commission_amount: string;
  internship_in_months: number;
  commission_bonus: string;
  why_this_university: string;
  num_backlogs: number;
  average_salary_per_year: string;

  degree_type: string;
  degree_name: string;
  department: string;
  program: string;
  depart_contact_info: string;
  specialisation: string;
  depart_description: string;
  program_accreditation: string;
  department_comments: string;
  program_requirements: string;
  program_remarks: string;
  university_type: string;
  program_comments: string;
  program_rank: string;

  uni_address_send_transcript: string;
  wes_requirement: string;
  pte_code: string;
  lan_instruction: string;
  how_to_apply: string;
  visa_info: string;

  domestic_depart_deadline: string | null;
  domestic_financial_deadline: string | null;
  domestic_admission_deadline: string | null;

  semester: string;

  inter_fin_deadline: string | null;
  inter_depart_deadline: string | null;
  inter_adm_deadline: string | null;
  documents_deadline: string | null;

  portal_open_date: string | null;

  credit_evaluation: string;
  fee_payment_type: string;

  sat_subject: string;
  sat_total: string;
  gre_total: string;
  gmat_total: string;
  gre_subject: string;

  ielts: string;
  act_score: string;
  pte: string;
  german_lang: string;

  specialization_link: string;
  depar_address_link: string;
  program_link: string;

  ets_requirement: string;
  program_financial_aid_form_req: string;
  gre_subject_test_required: string;
  sat_subject_test_required: string;
  dept_appl_form_required: string;

  application_link: string;
  lang_instruction_link: string;
  depart_deadline_link: string;
  application_deadline_link: string;
  doc_deadline_link: string;

  app_fee_waiver: string;

  international_app_fee_link: string;
  tuition_fee_link: string;
  app_fee_link: string;

  credit_evaluation_req_link: string;
  estimated_living_cost_link: string;
  gpa_requirement_link: string;
  gre_subject_prerequisite_link: string;
  gmat_prerequisite_link: string;

  ielts_lan_req_link: string;
  toefl_lang_requirement_link: string;
  pte_language_requirement_link: string;
  german_lang_requirement_link: string;

  naces_requirement_link: string;

  transcript_evaluation: string;
  depart_app_requirement_link: string;
  depart_app: string;

  bank_certi_requirement_link: string;
  research_proposal: string;

  portfolio_requirement_link: string;
  portfolio: string;

  sat_subject_prerequisite_link: string;

  commission_percent: string;

  acceptance_rate: string;
  related_programs: string;

  domestic_app_fee: string;
  program_tuition_deposit: string;
  international_app_fee: string;
  depart_app_fee: string;

  estimated_living_cost: string;

  doc_required: string;

  toefl: number;
  academic_requirements_gpa: number;

  inter_tuition_fee_cr_hr: string;
  domestic_tuition_fee_cr_hr: string;
  international_tuition_fee_yr: string;

  sat_crmw_prerequisite_link: string;
  gre_vq_prerequisite_link: string;
  gre_a_prerequisite_link: string;

  research_pro_req_link: string;

  work_experience: number;

  duration_of_course_months: number;
  no_of_credits: number;

  associate: string;

  gre_code: number;
  ielts_code: number;
  gmat_code: number;
  sat_code: number;

  financial_aid: number;
  toefl_code: number;

  country: string;

  uni_tution_deposit_curr: string;

  fin_scho_deadline_link: string;

  doc_click_count: number;
  more_click_count: number;
  share_click_count: number;
  view_count: number;

  depart_link: string;

  gre_a: string;

  co_op: string;

  uni_stem: string;

  commission_remarks: string;

  bank_certificate: string;

  universities_vendors: string;

  university_application_online: string;

  old_crm_entity: string;
  old_uni_no: string;

  total_view: number;
  total_scholarships: number;
  total_scholarshipsamount: number;
  total_program: number;
  total_admitted: number;
  total_enrolled: number;

  uni_placement: string;

  domestic_tuition_fee_yr: string;

  uni_english: string;
  duolingo: string;
  uni_puc_inter_12: string;

  uni_dept_deadline: string | null;
  uni_deposit_deadline: string | null;
  uni_cas_deadline: string | null;
  uni_enroll_deadline: string | null;

  change_agent: string;
  agent_change_process: string;

  about: string | null;

  turn_around_time: string;

  app_fee_wavier_code: string;

  years_15: string;

  chg_program: string;

  day_one_cpt: string | null;

  short_name: string;

  key_words: string;

  application_fee_disocunt: string;

  total_shortlisted: number;
  total_applied: number;

  moi_accepted: string | null;

  crmid: number;
  smcreatorid: number;
  smownerid: number;
  modifiedby: number;

  setype: string;

  description: string | null;

  createdtime: string;
  modifiedtime: string;

  viewedtime: string | null;

  status: string | null;

  version: number;

  presence: number;

  deleted: number;

  smgroupid: number;

  source: string;

  label: string;

  starred: string | null;
}

export type SearchResultsResponse = ApiResponse<{
  Programs: Programs[];
  RelatedPrograms: RelatedPrograms[];
  data: University[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  state: {
    state_province: string;
  }[];
  university: {
    university: string;
  }[];
}>;
