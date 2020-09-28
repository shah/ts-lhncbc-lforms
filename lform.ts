/**
 * An NIH LHC Form which follows the structured defined in:
 * https://github.com/lhncbc/lforms/blob/master/form_definition.md
 */
export interface NihLhcForm {
  type?: string;
  code?: string;
  name?: string;
  dataType?: FormDataType;
  header?: boolean;
  units?: FormUnits | null;
  codeSystem?: FormCodeSystem | string;
  codingInstructions?: string;
  copyrightNotice?: string | null;
  templateOptions?: FormTemplateOptions;
  items?: FormItem[];
  lformsVersion?: string;
  status?: string;
  shortName?: string;
  version?: string;
  url?: string;
  date?: Date | string;
  publisher?: string;
  description?: string;
  deriveFrom?: string[];
  subjectType?: string[];
  experimental?: boolean;
  purpose?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: DatePeriod;
  PATH_DELIMITER?: string;
  codeList?: codeListOptions[];
  template?: string;
  identifier?: string | null;
  hasSavedData?: boolean;
}

export enum FormDataType {
  Bl = "BL",
  Cne = "CNE",
  Cwe = "CWE",
  Dt = "DT",
  Dtm = "DTM",
  Empty = "",
  Int = "INT",
  Nr = "NR",
  Qty = "QTY",
  Real = "REAL",
  Section = "SECTION",
  St = "ST",
  Title = "TITLE",
  Tm = "TM",
  Tx = "TX",
}

export interface FormUnits {
  name: string;
  default?: boolean;
  normalRange?: null;
  absoluteRange?: null;
}

export enum FormCodeSystem {
  Loinc = "LOINC",
}

export interface FormItem {
  questionCode?: string;
  question?: string;
  dataType?: string;
  displayControl?: DisplayControl;
  units?: Unit[] | string | null;
  linkId?: string;
  questionCodeSystem?: string;
  header?: boolean;
  codingInstructions?: null | string;
  copyrightNotice?: string | null;
  questionCardinality?: Cardinality;
  answerCardinality?: Cardinality;
  answers?: ItemAnswer[] | string | null;
  skipLogic?: SkipLogic;
  editable?: 0 | 1 | 2 | string;
  defaultAnswer?: DefaultAnswerClass | string;
  calculationMethod?: null;
  items?: FormItem[];
  codingInstructionsFormat?: "html" | "text";
  answerCodeSystem?: string;
  layout?: string;
  dataControl?: DataControl[];
  value?: ValueElement[] | ValueElement;
  prefix?: string;
  extensions?: Record<string, unknown>;
  hideUnits?: boolean;
  noEmptyValue?: boolean;
  localQuestionCode?: string;
  validation?: "EMAIL" | "NUMBER";
  obj_text?: CssExtensions;
  obj_prefix?: CssExtensions;
  codeList?: codeListOptions[];
  numberField?: boolean;
  externallyDefined?: string;
  FILEUPLOAD?: boolean;
}

export interface Cardinality {
  min: number;
  max: number | "*";
}

export interface ItemAnswer {
  code?: string;
  text: string;
  other?: boolean | string;
  label?: string;
  score?: number | null;
  system?: string | null;
  questionCardinality?: Cardinality;
  parentAnswerCode?: string;
}

export interface DataControl {
  source: Source;
  construction: string;
  dataFormat: DataFormatElement | string;
  onAttribute: string;
}

export interface Source {
  sourceType?: string;
  sourceLinkId: string;
}

export interface DefaultAnswerClass {
  text: string;
}

export interface DisplayControl {
  viewMode?: string;
  css?: CSS[];
  answerLayout?: AnswerLayout;
  questionLayout?: QuestionLayout | string;
}

export interface AnswerLayout {
  type: string;
  columns?: string | number;
}

export interface QuestionLayout {
  type: string;
  columns?: string;
}

export interface CSS {
  name: Name;
  value: string;
}

export enum Name {
  Color = "color",
  MinWidth = "min-width",
  Width = "width",
}

export type ValueElement = string | boolean | number | {
  text?: string;
  code?: string | number;
  other?: boolean | string;
};

export interface DataFormatElement {
  code: string;
  text: string;
}

export interface FormHeaderItemDisplayControl {
  colCSS: CSS[];
}

export interface SkipLogic {
  conditions: Condition[];
  action: "show";
  logic?: string;
}

export interface Condition {
  source: string | number;
  trigger: Trigger;
}

export interface Trigger {
  code?: string;
  value?: ValueElement;
  exists?: boolean;
  notEqual?: ValueElement;
  minInclusive?: number;
  maxInclusive?: number;
}

export interface Unit {
  name: string;
  default?: boolean;
}

export interface FormTemplateOptions {
  showFormHeader?: boolean;
  showFormOptionPanel?: boolean;
  formHeaderItems?: FormHeaderItem[];
  hideFormControls?: boolean;
  hideUnits?: boolean;
  obrHeader?: boolean;
  hideHeader?: boolean;
  allowHTMLInInstructions?: boolean;
  allowMultipleEmptyRepeatingItems?: boolean;
  showColumnHeaders?: boolean;
  showQuestionCode?: boolean;
  showCodingInstruction?: boolean;
  tabOnInputFieldsOnly?: boolean;
  showFormOptionPanelButton?: boolean;
  showItemOptionPanelButton?: boolean;
  useAnimation?: boolean;
  displayControl?: DisplayControl;
  viewMode?: string;
  defaultAnswerLayout?: DisplayControl;
  useTreeLineStyle?: boolean;
  columnHeaders?: columnHeadOption[];
}

export interface FormHeaderItem {
  question: string;
  questionCode: string;
  dataType: string;
  answers: DataFormatElement[] | string;
  answerCardinality?: Cardinality;
  displayControl: FormHeaderItemDisplayControl;
  defaultAnswer?: string;
}

export interface DatePeriod {
  start?: string;
  end?: string;
}

export interface CssExtensions {
  extension?: [{
    url?: string;
    valueString?: string;
  }];
}

export interface CodeListOptions {
  code?: string;
  display?: string;
  system?: string;
}

export interface ColumnHeadOption {
  name?: string;
}
