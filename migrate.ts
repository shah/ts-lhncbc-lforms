import { jsonMutator as jm } from "./deps.ts";
import { FormItem, NihLhcForm } from "./lform.ts";

export function lchFormTopLevelItemMutationsSupplier(
  jpms: jm.JsonPatchMutationsSupplier,
  itemIndex: number,
): jm.JsonPatchMutationsSupplier {
  return jm.jsonPatchAnchoredMutationsSupplier(
    jpms,
    (path: jm.JsonPointer): jm.JsonPointer => {
      return `/items/${itemIndex}/${path}`;
    },
  );
}

export function lchFormSubItemMutationsSupplier(
  jpms: jm.JsonPatchMutationsSupplier,
  tlItemIndex: number,
  subItemIndex: number,
): jm.JsonPatchMutationsSupplier {
  return jm.jsonPatchAnchoredMutationsSupplier(
    jpms,
    (path: jm.JsonPointer): jm.JsonPointer => {
      return `/items/${tlItemIndex}/items/${subItemIndex}/${path}`;
    },
  );
}

export interface LhcFormMutationsPreparer<F extends NihLhcForm> {
  (
    form: F,
    formJPMS: jm.JsonPatchMutationsSupplier,
  ): jm.JsonPatchMutationsSupplier;
}

export interface LhcFormTopLevelItemMutationsPreparer<
  F extends NihLhcForm,
  I extends FormItem = FormItem,
> {
  (
    item: I,
    itemJPMS: jm.JsonPatchMutationsSupplier,
    index: number,
    form: F,
    formJPMS: jm.JsonPatchMutationsSupplier,
  ): LhcFormSubItemMutationsPreparer<F, I> | undefined;
}

export interface LhcFormSubItemMutationsPreparer<
  F extends NihLhcForm,
  I extends FormItem = FormItem,
> {
  (
    item: I,
    itemJPMS: jm.JsonPatchMutationsSupplier,
    index: number,
    parent: FormItem,
    parentJPMS: jm.JsonPatchMutationsSupplier,
    form: F,
    formJMS: jm.JsonPatchMutationsSupplier,
  ): void;
}

export function lhcFormMutationsPreparer<F extends NihLhcForm>(
  prepareForm: (form: F, formJPMS: jm.JsonPatchMutationsSupplier) => void,
  prepareItem: LhcFormTopLevelItemMutationsPreparer<F>,
): LhcFormMutationsPreparer<F> {
  return (
    form: F,
    formJPMS: jm.JsonPatchMutationsSupplier,
  ): jm.JsonPatchMutationsSupplier => {
    prepareForm(form, formJPMS);
    if (form.items) {
      for (let tlIdx = 0; tlIdx < form.items.length; tlIdx++) {
        const tlItem = form.items[tlIdx];
        const tlJPMS = lchFormTopLevelItemMutationsSupplier(formJPMS, tlIdx);
        const prepareSubItem = prepareItem(
          tlItem,
          tlJPMS,
          tlIdx,
          form,
          formJPMS,
        );
        if (prepareSubItem && tlItem.items) {
          for (let subI = 0; subI < tlItem.items.length; subI++) {
            const si = tlItem.items[subI];
            const siJPMS = lchFormSubItemMutationsSupplier(
              formJPMS,
              tlIdx,
              subI,
            );
            prepareSubItem(si, siJPMS, subI, tlItem, tlJPMS, form, formJPMS);
          }
        }
      }
    }
    return formJPMS;
  };
}
