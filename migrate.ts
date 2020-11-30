import { jsonMutator as jm, jsonPatch as jp } from "./deps.ts";
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
  F extends NihLhcForm,
> {
  readonly form: F;
  readonly formJPMS: jm.JsonPatchMutationsSupplier;
}

export interface LhcFormMutationsSupplierContextConstructor<
  F extends NihLhcForm,
> {
  (form: F): LhcFormMutationsSupplierContext<F>;
}

export interface LhcFormItemMutationsSupplierContext<
  F extends NihLhcForm,
> extends LhcFormMutationsSupplierContext<F> {
  readonly itemLevel: number;
  readonly item: FormItem;
  readonly itemJPMS: jm.JsonPatchMutationsSupplier;
  readonly itemIndexInParent: number;
}

export interface LhcFormSubItemMutationsSupplierContext<
  F extends NihLhcForm,
> extends LhcFormItemMutationsSupplierContext<F> {
  readonly parentItem: LhcFormItemMutationsSupplierContext<F>;
  readonly ancestors: LhcFormItemMutationsSupplierContext<F>[];
}

export function isLhcFormItemMutationsSupplierContext<F extends NihLhcForm>(
  o: LhcFormMutationsSupplierContext<F>,
): o is LhcFormItemMutationsSupplierContext<F> {
  return ("itemLevel" in o) && ("item" in o) && ("itemJPMS" in o) &&
    ("itemIndexInParent" in o);
}

export function isLhcFormSubItemMutationsSupplierContext<F extends NihLhcForm>(
  o: LhcFormMutationsSupplierContext<F>,
): o is LhcFormSubItemMutationsSupplierContext<F> {
  return isLhcFormItemMutationsSupplierContext(o) && ("parentItem" in o);
}

export interface LhcFormJsonPatchMutationsSupplier<
  F extends NihLhcForm,
> {
  (ctx: LhcFormMutationsSupplierContext<F>): void;
}

export interface LhcFormItemJsonPatchMutationsSupplier<
  F extends NihLhcForm,
> {
  (ctx: LhcFormItemMutationsSupplierContext<F>): void;
}

export interface LhcFormItemFlexibleMutationsSuppliers<
  F extends NihLhcForm,
> {
  (ctx: LhcFormItemMutationsSupplierContext<F>):
    | LhcFormItemJsonPatchMutationsSupplier<F>
    | LhcFormItemJsonPatchMutationsSupplier<F>[]
    | undefined;
}

export function lchFormQuestionCodeMutationsSuppliers<
  F extends NihLhcForm,
>(
  { exactMutators, regExMutators, noMatchMutator, everyMutator }: {
    exactMutators?: Map<string, LhcFormItemJsonPatchMutationsSupplier<F>>;
    regExMutators?: Map<RegExp, LhcFormItemJsonPatchMutationsSupplier<F>>;
    everyMutator?: LhcFormItemJsonPatchMutationsSupplier<F>;
    noMatchMutator?: (
      questionCodeKey: string,
    ) => LhcFormItemJsonPatchMutationsSupplier<F> | undefined;
  },
): LhcFormItemFlexibleMutationsSuppliers<F> {
  const undefinedQC = "[UNDEFINED]";
  const findQuesCodeMutSupplier = (qc: string):
    | LhcFormItemJsonPatchMutationsSupplier<F>
    | LhcFormItemJsonPatchMutationsSupplier<F>[]
    | undefined => {
    if (exactMutators) {
      const found = exactMutators.get(qc);
      if (found) return everyMutator ? [found, everyMutator] : found;
    }
    if (regExMutators) {
      const found: LhcFormItemJsonPatchMutationsSupplier<F>[] = [];
      for (const [regExp, val] of regExMutators.entries()) {
        if (qc.match(regExp)) found.push(val);
      }
      if (found.length > 0) {
        return everyMutator ? [...found, everyMutator] : found;
      }
    }
    if (noMatchMutator) {
      const found = noMatchMutator(qc);
      if (found && everyMutator) return [found, everyMutator];
      if (found) return found;
      if (everyMutator) return everyMutator;
    }
    return undefined;
  };
  return (ctx) => {
    if (isLhcFormSubItemMutationsSupplierContext(ctx)) {
      if (ctx.item.questionCode) {
        return findQuesCodeMutSupplier(
          questionCodesHierarchy(
            ...ctx.ancestors.map((a) => a.item.questionCode || undefinedQC),
            ctx.item.questionCode || undefinedQC,
          ),
        );
      }
    } else {
      if (ctx.item.questionCode) {
        return findQuesCodeMutSupplier(ctx.item.questionCode);
      }
    }
  };
}

/**
 * lhcFormFlexibleMutationsSupplier creates an LhcFormJsonPatchMutationsSupplier 
 * which loops through each top-level form item and sub-items and checks to see if
 * a LhcFormJsonPatchMutationsSupplier(s) is available. If a supplier is available
 * it is executed.
 * @param itemMutationSuppliers provides a mutations supplier for a given ctx
 */
export function lhcFormFlexibleMutationsSupplier<
  F extends NihLhcForm,
>(
  formMutationSupplier: LhcFormJsonPatchMutationsSupplier<F>,
  itemMutationSuppliers: LhcFormItemFlexibleMutationsSuppliers<F>,
): LhcFormJsonPatchMutationsSupplier<F> {
  const supplyItemMutations = (ctx: LhcFormItemMutationsSupplierContext<F>) => {
    const supplier = itemMutationSuppliers(ctx);
    if (supplier) {
      if (Array.isArray(supplier)) {
        supplier.forEach((s) => s(ctx));
      } else {
        supplier(ctx);
      }
    }
  };
  return (formCtx: LhcFormMutationsSupplierContext<F>): void => {
    formMutationSupplier(formCtx);
    const { form, formJPMS } = formCtx;
    if (form.items) {
      for (let tlIdx = 0; tlIdx < form.items.length; tlIdx++) {
        const tlItem = form.items[tlIdx];
        if (tlItem.questionCode) {
          const tlCtx: LhcFormItemMutationsSupplierContext<F> = {
            ...formCtx,
            itemLevel: 0,
            item: tlItem,
            itemIndexInParent: tlIdx,
            itemJPMS: lhcFormTopLevelItemMutationsSupplier(formJPMS, tlIdx),
          };
          supplyItemMutations(tlCtx);
          if (tlItem.items) {
            for (let subIdx = 0; subIdx < tlItem.items.length; subIdx++) {
              const siItem = tlItem.items[subIdx];
              const siCtx: LhcFormSubItemMutationsSupplierContext<F> = {
                ...formCtx,
                itemLevel: 1,
                item: siItem,
                itemIndexInParent: subIdx,
                itemJPMS: lhcFormSubItemMutationsSupplier(
                  formJPMS,
                  tlIdx,
                  subIdx,
                ),
                parentItem: tlCtx,
                ancestors: [tlCtx], // TODO: when more levels are assigned, add all parents
              };
              supplyItemMutations(siCtx);
            }
          }
        }
      }
    }
  };
}

export function typicalLhcFormMutationsSupplierContext<
  F extends NihLhcForm,
>(form: F): LhcFormMutationsSupplierContext<F> {
  return {
    form,
    formJPMS: jm.jsonPatchMutationsSupplier(),
  };
}

export interface MigrateLhcFormResult<F extends NihLhcForm> {
  readonly isSuccessful: boolean;
  readonly mutationResult:
    | jm.JsonPatchMutationError
    | jm.JsonPatchMutationResult<F>;
  readonly suggestedPatchOps: jm.JsonPatchOps;
  readonly compare: (invertible?: boolean) => jm.JsonPatchOps;
}

export function migrateLhcForm<F extends NihLhcForm>(
  src: F,
  formMutSupplier: LhcFormJsonPatchMutationsSupplier<F>,
  formCtxCreator: LhcFormMutationsSupplierContextConstructor<F> =
    typicalLhcFormMutationsSupplierContext,
): MigrateLhcFormResult<F> {
  const formJpmsCtx = formCtxCreator(src);
  formMutSupplier(formJpmsCtx);
  const suggestedPatchOps = formJpmsCtx.formJPMS.patchOps();
  const filteredPatchOps = jm.filterInvalidOps(suggestedPatchOps, src);
  const mutator = jm.jsonPatchMutator(src, filteredPatchOps);
  const mutationResult = mutator();
  if (
    jm.isJsonPatchMutationResult<F>(mutationResult) ||
    jm.isJsonPatchMutationError(mutationResult)
  ) {
    return {
      isSuccessful: jm.isJsonPatchMutationResult<F>(mutationResult),
      mutationResult,
      suggestedPatchOps,
      compare: (invertible?: boolean): jm.JsonPatchOps => {
        if (jm.isJsonPatchMutationResult<F>(mutationResult)) {
          return jp.compare(src, mutationResult.mutated, invertible);
        }
        throw Error("mutationResult is not a valid mutation");
      },
    };
  } else {
    throw Error(
      "Mutation Result is neither a JsonPatchMutationError nor JsonPatchMutationResult",
    );
  }
}

export function migrateLhcFormFile<F extends NihLhcForm>(
  src: string | URL,
  mp: LhcFormJsonPatchMutationsSupplier<F>,
): MigrateLhcFormResult<F> {
  const lhcForm = readLhcFormFileSync(src) as F;
  return migrateLhcForm(lhcForm, mp);
}

export interface CompareLhcFormFilesResult<F extends NihLhcForm> {
  readonly srcForm: F;
  readonly compareForm: F;
  readonly patchOps: jm.JsonPatchOps;
}

export function compareLhcFormFiles<F extends NihLhcForm>(
  srcFile: string | URL,
  compareFile: string | URL,
  invertible?: boolean,
): CompareLhcFormFilesResult<F> {
  const srcForm = readLhcFormFileSync(srcFile) as F;
  const compareForm = readLhcFormFileSync(compareFile) as F;
  return {
    srcForm,
    compareForm,
    patchOps: jp.compare(srcForm, compareForm, invertible),
  };
}
