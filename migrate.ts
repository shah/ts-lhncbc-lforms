import { jsonMutator as jm } from "./deps.ts";
import { FormItem, NihLhcForm } from "./lform.ts";
import { readLhcFormFileSync } from "./persist.ts";

export function questionCodesHierarchy(...questionCodes: string[]): string {
  return questionCodes.join("::");
}

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

export interface LhcFormMutationsSupplierContext<
  F extends NihLhcForm = NihLhcForm,
> {
  readonly form: F;
  readonly formJPMS: jm.JsonPatchMutationsSupplier;
}

export interface LhcFormItemMutationsSupplierContext<
  F extends NihLhcForm = NihLhcForm,
> extends LhcFormMutationsSupplierContext<F> {
  readonly item: FormItem;
  readonly itemJPMS: jm.JsonPatchMutationsSupplier;
  readonly itemIndexInParent: number;
}

export interface LhcFormSubItemMutationsSupplierContext<
  F extends NihLhcForm = NihLhcForm,
> extends LhcFormItemMutationsSupplierContext<F> {
  readonly parentItem: LhcFormItemMutationsSupplierContext<F>;
}

export function isLhcFormItemMutationsSupplierContext<F extends NihLhcForm>(
  o: LhcFormMutationsSupplierContext<F>,
): o is LhcFormItemMutationsSupplierContext<F> {
  return ("item" in o) && ("itemJPMS" in o);
}

export function isLhcFormSubItemMutationsSupplierContext<F extends NihLhcForm>(
  o: LhcFormMutationsSupplierContext<F>,
): o is LhcFormSubItemMutationsSupplierContext<F> {
  return isLhcFormItemMutationsSupplierContext(o) && ("parentItem" in o);
}

export interface LhcFormJsonPatchMutationsSupplier<
  F extends NihLhcForm = NihLhcForm,
> {
  (ctx: LhcFormMutationsSupplierContext<F>): void;
}

// deno-lint-ignore no-empty-interface
export interface QuestionCodeMutationsSuppliers<
  F extends NihLhcForm = NihLhcForm,
> extends
  Map<
    string,
    | LhcFormJsonPatchMutationsSupplier<F>
    | LhcFormJsonPatchMutationsSupplier<F>[]
  > {
}

/**
 * lhcFormQuestionCodeMutationsSupplier createa a LhcFormJsonPatchMutationsSupplier 
 * which loops through each top-level form item and sub-items and checks to see if
 * a question code ("QC") key is mapped to a LhcFormJsonPatchMutationsSupplier. If a
 * QC is mapped, it runs the method.
 * @param prepareForm method called for the form mutations
 * @param quesCodeMutRegistry dictionary of QCs mapped to mutation suppliers
 */
export function lhcFormQuestionCodeMutationsSupplier<
  F extends NihLhcForm = NihLhcForm,
>(
  prepareForm: LhcFormJsonPatchMutationsSupplier<F>,
  quesCodeMutRegistry: QuestionCodeMutationsSuppliers,
): LhcFormJsonPatchMutationsSupplier<F> {
  return (formCtx: LhcFormMutationsSupplierContext<F>): void => {
    prepareForm(formCtx);
    const { form, formJPMS } = formCtx;
    if (form.items) {
      for (let tlIdx = 0; tlIdx < form.items.length; tlIdx++) {
        const tlItem = form.items[tlIdx];
        if (tlItem.questionCode) {
          const tlCtx: LhcFormItemMutationsSupplierContext<F> = {
            ...formCtx,
            item: tlItem,
            itemIndexInParent: tlIdx,
            itemJPMS: lhcFormTopLevelItemMutationsSupplier(formJPMS, tlIdx),
          };
          const tlmSupplier = quesCodeMutRegistry.get(tlItem.questionCode);
          if (tlmSupplier) {
            if (Array.isArray(tlmSupplier)) {
              tlmSupplier.forEach((s) => s(tlCtx));
            } else {
              tlmSupplier(tlCtx);
            }
          }
          if (tlItem.items) {
            for (let subIdx = 0; subIdx < tlItem.items.length; subIdx++) {
              const siItem = tlItem.items[subIdx];
              const simSupplier = quesCodeMutRegistry.get(
                questionCodesHierarchy(
                  tlItem.questionCode,
                  siItem.questionCode || "*",
                ),
              );
              if (simSupplier) {
                const siCtx: LhcFormSubItemMutationsSupplierContext<F> = {
                  ...formCtx,
                  item: siItem,
                  itemIndexInParent: subIdx,
                  itemJPMS: lhcFormSubItemMutationsSupplier(
                    formJPMS,
                    tlIdx,
                    subIdx,
                  ),
                  parentItem: tlCtx,
                };
                if (Array.isArray(simSupplier)) {
                  for (const p of simSupplier) {
                    simSupplier.forEach((s) => s(siCtx));
                  }
                } else {
                  simSupplier(siCtx);
                }
              }
            }
          }
        }
      }
    }
  };
}

/**
 * lhcFormMutationsSupplier createa a LhcFormJsonPatchMutationsSupplier which
 * loops through each top-level form item and sub-items and calls the wrapped
 * `supplier` argument.
 * @param supplier method called for the form, top-level items, and sub-items
 */
export function lhcFormMutationsSupplier<F extends NihLhcForm = NihLhcForm>(
  supplier: LhcFormJsonPatchMutationsSupplier<F>,
): LhcFormJsonPatchMutationsSupplier<F> {
  return (formCtx: LhcFormMutationsSupplierContext<F>): void => {
    supplier(formCtx);
    const { form, formJPMS } = formCtx;
    if (form.items) {
      for (let tlIdx = 0; tlIdx < form.items.length; tlIdx++) {
        const tlItem = form.items[tlIdx];
        const tlCtx: LhcFormItemMutationsSupplierContext<F> = {
          ...formCtx,
          item: tlItem,
          itemIndexInParent: tlIdx,
          itemJPMS: lhcFormTopLevelItemMutationsSupplier(formJPMS, tlIdx),
        };
        supplier(tlCtx);
        if (tlItem.items) {
          for (let subIdx = 0; subIdx < tlItem.items.length; subIdx++) {
            const siItem = tlItem.items[subIdx];
            const siCtx: LhcFormSubItemMutationsSupplierContext<F> = {
              ...formCtx,
              item: siItem,
              itemIndexInParent: subIdx,
              itemJPMS: lhcFormSubItemMutationsSupplier(
                formJPMS,
                tlIdx,
                subIdx,
              ),
              parentItem: tlCtx,
            };
            supplier(siCtx);
          }
        }
      }
    }
  };
}

export function migrateLhcForm<F extends NihLhcForm = NihLhcForm>(
  src: F,
  formMutSupplier: LhcFormJsonPatchMutationsSupplier<F>,
): jm.JsonMutationError | jm.JsonMutationResult<F> {
  const formJpmsCtx = {
    form: src,
    formJPMS: jm.jsonPatchMutationsSupplier(),
  };
  formMutSupplier(formJpmsCtx);
  const patchOps = jm.filterInvalidOps(formJpmsCtx.formJPMS.patchOps(), src);
  const mutator = jm.jsonPatchMutator(src, patchOps);
  return mutator();
}

export function migrateLhcFormFile<F extends NihLhcForm = NihLhcForm>(
  src: string | URL,
  mp: LhcFormJsonPatchMutationsSupplier<F>,
): jm.JsonMutationError | jm.JsonMutationResult<F> {
  const lhcForm = readLhcFormFileSync(src) as F;
  return migrateLhcForm(lhcForm, mp);
}
