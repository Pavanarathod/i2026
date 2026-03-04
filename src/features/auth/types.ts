export const USER_TYPES = [
  "Student",
  "Associate Admin",
  "Employee",
  "Admin",
  "Associate",
  "University",
  "Partner",
  "Partner Admin",
  "Associate Employee",
  "Master Associate",
] as const;

export type UserType = (typeof USER_TYPES)[number];

export type User = {
  userId: number;
  userType: UserType;
  isAuthenticated: boolean;
  userData: UserData;
};

export type AuthState = {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "error";
};

export interface UserData {
  contactid: number;
  contact_no: string;
  accountid: number;

  salutation: string | null;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  mobile: string | null;

  title: string | null;
  department: string | null;
  fax: string | null;
  reportsto: string;

  training: string | null;
  usertype: string | null;
  contacttype: string | null;

  otheremail: string | null;
  secondaryemail: string | null;

  donotcall: string;
  emailoptout: string;

  imagename: string | null;
  reference: string;
  notify_owner: string;
  isconvertedfromlead: string;

  tags: string | null;

  father_name: string | null;
  mother_name: string | null;
  gender: string | null;

  place_of_birth: string | null;
  nationality: string | null;
  passport_no: string | null;

  test_prep: string | null;
  degree_looking_for: string | null;
  year_looking_for: string | null;
  semester_looking_for: string | null;

  leadstatus: string | null;
  walkin_from: string | null;
  contact_type: string | null;
  documents_required: string | null;

  instagram: string | null;

  lead_date: string | null;
  follow_up_date: string | null;
  walk_in_date: string | null;
  expt_date_of_walkin: string | null;
  bal_due_date: string | null;
  expt_date_of_reg: string | null;
  date_of_test: string | null;
  date_of_reg: string | null;
  demo_date: string | null;
  visa_date: string | null;

  bachelors_percentage: number | string;
  bachelors_college_name: string | null;
  bachelors_major_name: string | null;
  number_backlogs: number | string;
  bachelors_year_of_passing: string | null;
  bachelors_subject: string | null;

  puc_percentage_12th: string | null;
  puc_subjects_12th: string | null;
  puc_college_name_12th: string | null;
  puc_year_of_passing_12th: string | null;
  english_percentage_12th: string | null;

  percentage_10th: string | null;
  subjects_10th: string | null;
  school_name_10th: string | null;

  masters_percentage: string | null;

  edu_budget: number | string;
  work_experience: string | null;
  german_language: string | null;

  google_search: string | null;

  gre_total_1st_attempt: string | null;
  gre_quants_1st_attempt: string | null;
  gre_verbal_1st_attempt: string | null;

  toefl_total_1st_attempt: string | null;
  toefl_reading_1st_attempt: string | null;
  toefl_listening_1st_attempt: string | null;
  toefl_writing_1st_attempt: string | null;
  toefl_speaking_1st_attempt: string | null;

  pte_total_1st_attempt: string | null;
  pte_reading_1st_attempt: string | null;
  pte_listening_1st_attempt: string | null;
  pte_writing_1st_attempt: string | null;
  pte_speaking_1st_attempt: string | null;

  duolingo_total_1st_attempt: string | null;
  duolingo_reading_1st_attempt: string | null;
  duolingo_listening_1st_attempt: string | null;
  duolingo_writing_1st_attempt: string | null;
  duolingo_speaking_1st_attempt: string | null;

  ielts_total_1st_attempt: string | null;
  ielts_reading_1st_attempt: string | null;
  ielts_listening_1st_attempt: string | null;
  ielts_writing_1st_attempt: string | null;
  ielts_speaking_1st_attempt: string | null;

  gmat_total_1st_attempt: string | null;
  gmat_quants_1st_attempt: string | null;
  gmat_verbal_1st_attempt: string | null;
  gmat_awa: string | null;

  sat_total_1st_attempt: string | null;
  sat_quant_1st_attempt: string | null;
  sat_verbal_1st_attempt: string | null;

  act_total_1st_attempt: string | null;
  act_quants_1st_attempt: string | null;
  act_verbal_1st_attempt: string | null;

  lor1_first_name: string | null;
  lor1_last_name: string | null;
  lor1_designation: string | null;
  lor1_employer: string | null;
  lor1_contact: string | null;
  lor1_email: string | null;

  lor2_first_name: string | null;
  lor2_last_name: string | null;
  lor2_designation: string | null;
  lor2_employer: string | null;
  lor2_contact: string | null;
  lor2_email: string | null;

  lor3_first_name: string | null;
  lor3_last_name: string | null;
  lor3_designation: string | null;
  lor3_employer: string | null;
  lor3_contact: string | null;
  lor3_email: string | null;

  incentive_employee_name: string | null;
  incentive_total_amount: number | string;
  incentive_amount_paid: number | string;
  incentive_remarks: string | null;

  marketing_fee_receipt_date: string | null;

  student_id: string | null;

  tuition_fee_paid: number | string;
  marketing_fee: string | null;
  marketing_fee_amount: string | null;
  total_tuition_fee: string | null;

  pref_time_to_call: string | null;

  state: string | null;
  country: string | null;

  basic_info_degree: string | null;

  user_contact_type: string | null;

  referral_code: string | null;

  convert_by: string | null;

  bachelor_degree_name: string | null;

  currency: string | null;

  invitee_contact_id: string | null;

  contacts_training: string | null;
  related_programs: string | null;

  cont_old_crm_entity: string | null;
  old_contact_no: string | null;

  parent_mobile: string | null;

  gre_awa: string | null;

  co_application: string | null;
  co_application_pan: string | null;
  student_pan: string | null;

  collateral: string | null;
  loan_amount: string | null;
  tuition_fee: string | null;
  living_cost: string | null;

  services: string | null;

  longitude: string | null;
  latitude: string | null;
  location_time: string | null;

  facebook_id: string | null;
  twitter_id: string | null;
  linked_id: string | null;

  fcm_token: string | null;

  cont_public_url: string | null;

  ctemailcampaign_optout: string | null;

  edu_loan_status: string | null;
  sponsor_anual_income: string | null;
  sponsor_profession: string | null;

  last_bot_chat: string | null;

  telegram_id: string | null;

  admitted: number;
  applied: number;
  rejected: number;
  shorlist: number;
  enrolled: number;

  last_active: string | null;

  contactsubscriptionid: number;

  homephone: string | null;
  otherphone: string | null;

  assistant: string | null;
  assistantphone: string | null;

  birthday: string | null;

  laststayintouchrequest: number;
  laststayintouchsavedate: number;

  leadsource: string | null;

  smownerid: number;

  assigned_username: string | null;
  assigned_phone_work: string | null;
  assigned_phone_mobile: string | null;
  assigned_email1: string | null;
  assigned_secondaryemail: string | null;

  organisation_name: string | null;
  organisation_email: string | null;
  organisation_phone: string | null;
  organisation_commission: string | null;
}
