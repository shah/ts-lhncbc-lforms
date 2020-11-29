import { jsonMutator as jm } from "./deps.ts";
import { FormItem, NihLhcForm } from "./lform.ts";
import { readLhcFormFileSync } from "./persist.ts";

export function lhcFormTopLevelItemMutationsSupplier(
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

export function lhcFormSubItemMutationsSupplier(
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

export function lhcFormTopLevelItemMutationsQuesCodeRegistry<F>(
  registry: Record<
    string,
    LhcFormTopLevelItemMutationsPreparer<F>
  >,
): LhcFormTopLevelItemMutationsPreparer<F> {
  return (item, itemJPMS, index, form, formJPMS) => {
    if (item.questionCode) {
      const preparer = registry[item.questionCode];
      if (preparer) {
        return preparer(item, itemJPMS, index, form, formJPMS);
      }
    }
    return undefined;
  };
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
        const tlJPMS = lhcFormTopLevelItemMutationsSupplier(formJPMS, tlIdx);
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
            const siJPMS = lhcFormSubItemMutationsSupplier(
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

export function migrateLhcForm<F extends NihLhcForm>(
  src: F,
  mp: LhcFormMutationsPreparer<F>,
): jm.JsonMutationError | jm.JsonMutationResult<F> {
  const jpms = mp(src, jm.jsonPatchMutationsSupplier());
  const patchOps = jm.filterInvalidOps(jpms.patchOps(), src);
  const mutator = jm.jsonPatchMutator(src, patchOps);
  return mutator();
}

export function migrateLhcFormFile<F extends NihLhcForm>(
  src: string | URL,
  mp: LhcFormMutationsPreparer<F>,
): jm.JsonMutationError | jm.JsonMutationResult<F> {
  const lhcForm = readLhcFormFileSync(src) as F;
  return migrateLhcForm(lhcForm, mp);
}
