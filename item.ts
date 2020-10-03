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
