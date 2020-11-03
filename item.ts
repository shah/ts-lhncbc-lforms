import type { FormItem } from "./lform.ts";

export interface UniqueItem {
  readonly questionCardinality: { min: 1; max: 1 };
}

export function isUniqueItem(i: FormItem): i is UniqueItem {
  return i.questionCardinality?.min == 1 && i.questionCardinality?.max == 1;
}

export interface TextItem extends FormItem {
  readonly dataType: "ST";
}

export function isTextItem(i: FormItem): i is TextItem {
  return i.dataType == "ST";
}

export interface EmailAddressItem extends FormItem {
  readonly dataType: "EMAIL" | "ST";
}

export interface StrictEmailAddressItem extends EmailAddressItem {
  readonly dataType: "EMAIL";
}

export function isStrictEmailAddressItem(
  i: FormItem,
): i is StrictEmailAddressItem {
  return i.dataType == "EMAIL";
}

export interface PhoneItem extends FormItem {
  readonly dataType: "PHONE" | "ST";
}

export interface StrictPhoneItem extends FormItem {
  readonly dataType: "PHONE";
}

export interface ConstrainedListItem extends FormItem {
  readonly dataType: "CNE";
}

export interface ExtensibleConstrainedListItem extends FormItem {
  readonly dataType: "CWE";
}

export type UniqueTextItem = TextItem & UniqueItem;
export type UniqueEmailAddressItem = EmailAddressItem & UniqueItem;
export type UniqueStrictEmailAddressItem = StrictEmailAddressItem & UniqueItem;
export type UniquePhoneItem = PhoneItem & UniqueItem;
export type UniqueStrictPhoneItem = StrictPhoneItem & UniqueItem;

export interface MultiLineTextItem extends FormItem {
  readonly dataType: "TX";
}

export function isMultiLineTextItem(i: FormItem): i is MultiLineTextItem {
  return i.dataType == "TX";
}

export type UniqueMultiLineTextItem = MultiLineTextItem & UniqueItem;

export interface DateItem extends FormItem {
  readonly dataType: "DT";
}

export function isDateItem(i: FormItem): i is DateItem {
  return i.dataType == "DT";
}

export type UniqueDateItem = DateItem & UniqueItem;

export interface RequiredSingleAnswer {
  readonly answerCardinality: { min: 0 | 1; max: 1 };
  readonly editable?: 1 | string;
}

export interface RequiredMultipleAnswers {
  readonly answerCardinality: { min: 1; max: "*" };
}

export type RequiredUniqueTextItem = UniqueTextItem & RequiredSingleAnswer;

export interface ConstrainedListItemValue extends FormItem {
  readonly text: string;
  readonly code?: string | number;
  readonly system?: string | null;
  readonly label?: string | null;
  readonly score?: string | null | number;
}

export interface ContactAddressItem extends FormItem {
  readonly items: [
    HouseOrBuilding,
    TownOrCity,
    StateOrProvince,
    ZipOrPostal,
    CountryOrRegion,
  ];
}
export interface HouseOrBuilding extends FormItem {
  readonly dataType?: "ST";
}
export interface TownOrCity extends FormItem {
  readonly dataType?: "ST";
}
export interface StateOrProvince extends FormItem {
  readonly dataType: "ST";
}
export interface ZipOrPostal extends FormItem {
  readonly dataType: "ST" | "NUMBER";
}
export interface CountryOrRegion extends FormItem {
  readonly dataType: "ST";
}
export interface CurrencyItem extends FormItem {
  readonly dataType?: "ST";
}

export type UniqueCurrencyItem = CurrencyItem & UniqueItem;

export interface URLItem extends FormItem {
  readonly dataType: "URL";
}

export function isURLItem(i: FormItem): i is URLItem {
  return i.dataType == "URL";
}

export type UniqueURLItem = URLItem & UniqueItem;
