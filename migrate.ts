import { jsonMutator as jm, jsonPatch as jp } from "./deps.ts";
import { FormItem, ItemAnswer, NihLhcForm } from "./lform.ts";
import { readLhcFormFileSync } from "./persist.ts";

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
  readonly forEachAnswer?: (
    handler: (ctx: LhcFormItemAnswerMutationsSupplierContext<F>) => void,
  ) => void;
}

export interface LhcFormItemAnswerMutationsSupplierContext<
  F extends NihLhcForm,
> extends LhcFormMutationsSupplierContext<F> {
  readonly item: LhcFormItemMutationsSupplierContext<F>;
  readonly answer: string | ItemAnswer;
  readonly answerIndexInItem: number;
  readonly answerJPMS: jm.JsonPatchMutationsSupplier;
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

export class FormItemJsonPatchMutationsSupplierTextMap<F extends NihLhcForm>
  extends Map<
    string,
    | LhcFormItemJsonPatchMutationsSupplier<F>
    | LhcFormItemJsonPatchMutationsSupplier<F>[]
  > {
  registerSupplier(
    mapKeys: string | string[],
    supplier: LhcFormItemJsonPatchMutationsSupplier<F>,
  ) {
    const addSupplier = (qc: string) => {
      const exists = this.get(qc);
      if (exists) {
        if (Array.isArray(exists)) {
          exists.push(supplier);
        } else {
          this.set(qc, [exists, supplier]);
        }
      } else {
        this.set(qc, supplier);
      }
    };
    if (typeof mapKeys === "string") {
      addSupplier(mapKeys);
    } else {
      mapKeys.forEach((qc) => addSupplier(qc));
    }
  }
}

export class FormItemJsonPatchMutationsSupplierRegExMap<F extends NihLhcForm>
  extends Map<RegExp, LhcFormItemJsonPatchMutationsSupplier<F>> {
  registerSupplier(
    key: RegExp,
    supplier: LhcFormItemJsonPatchMutationsSupplier<F>,
  ) {
    this.set(key, supplier);
  }
}

export interface LhcFormQuestionCodeMutationsSuppliersOptions<
  F extends NihLhcForm,
> {
  readonly questionCodesHierarchySearchKey: (
    ...questionCodes: string[]
  ) => string;
  readonly exactMutators?: FormItemJsonPatchMutationsSupplierTextMap<F>;
  readonly skipRegSearchExAfterExactMatch?: boolean;
  readonly regExMutators?: FormItemJsonPatchMutationsSupplierRegExMap<F>;
  readonly everyMutator?: LhcFormItemJsonPatchMutationsSupplier<F>;
  readonly noMatchMutator?: (
    questionCodeKey: string,
  ) => LhcFormItemJsonPatchMutationsSupplier<F> | undefined;
  readonly reportMatch?: (
    questionCode: string,
    supplier:
      | LhcFormItemJsonPatchMutationsSupplier<F>
      | LhcFormItemJsonPatchMutationsSupplier<F>[],
    regExp?: RegExp,
  ) => void;
}

export function lhcFormQuestionCodeMutationsSuppliers<
  F extends NihLhcForm,
>(
  {
    questionCodesHierarchySearchKey,
    exactMutators,
    skipRegSearchExAfterExactMatch,
    regExMutators,
    noMatchMutator,
    everyMutator,
    reportMatch,
  }: LhcFormQuestionCodeMutationsSuppliersOptions<F>,
): LhcFormItemFlexibleMutationsSuppliers<F> {
  const undefinedQC = "[UNDEFINED]";
  const findQuesCodeMutSupplier = (qc: string):
    | LhcFormItemJsonPatchMutationsSupplier<F>
    | LhcFormItemJsonPatchMutationsSupplier<F>[]
    | undefined => {
    const allMatches: LhcFormItemJsonPatchMutationsSupplier<F>[] = [];
    if (exactMutators) {
      const exactMatchFound = exactMutators.get(qc);
      if (exactMatchFound) {
        if (reportMatch) reportMatch(qc, exactMatchFound);
        if (skipRegSearchExAfterExactMatch) {
          return Array.isArray(exactMatchFound)
            ? (everyMutator
              ? [...exactMatchFound, everyMutator]
              : exactMatchFound)
            : (everyMutator
              ? [exactMatchFound, everyMutator]
              : exactMatchFound);
        }
        if (Array.isArray(exactMatchFound)) {
          allMatches.push(...exactMatchFound);
        } else {
          allMatches.push(exactMatchFound);
        }
      }
    }
    if (regExMutators) {
      for (const [regExp, val] of regExMutators.entries()) {
        if (qc.match(regExp)) {
          if (reportMatch) reportMatch(qc, val, regExp);
          if (Array.isArray(val)) {
            allMatches.push(...val);
          } else {
            allMatches.push(val);
          }
        }
      }
    }
    if (allMatches.length > 0) {
      return everyMutator ? [...allMatches, everyMutator] : allMatches;
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
          questionCodesHierarchySearchKey(
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
            itemJPMS: jm.jsonPatchAnchoredMutationsSupplier(
              formJPMS,
              (path: jm.JsonPointer): jm.JsonPointer => {
                return `/items/${tlIdx}/${path}`;
              },
            ),
            forEachAnswer: tlItem.answers
              ? (handler) => {
                for (
                  let ansIdx = 0;
                  ansIdx < tlItem.answers!.length;
                  ansIdx++
                ) {
                  handler(
                    {
                      ...formCtx,
                      item: tlCtx,
                      answer: tlItem.answers![ansIdx],
                      answerIndexInItem: ansIdx,
                      answerJPMS: jm.jsonPatchAnchoredMutationsSupplier(
                        formJPMS,
                        (path: jm.JsonPointer): jm.JsonPointer => {
                          return `/items/${tlIdx}/answers/${ansIdx}/${path}`;
                        },
                      ),
                    },
                  );
                }
              }
              : undefined,
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
                itemJPMS: jm.jsonPatchAnchoredMutationsSupplier(
                  formJPMS,
                  (path: jm.JsonPointer): jm.JsonPointer => {
                    return `/items/${tlIdx}/items/${subIdx}/${path}`;
                  },
                ),
                forEachAnswer: siItem.answers
                  ? (handler) => {
                    for (
                      let ansIdx = 0;
                      ansIdx < siItem.answers!.length;
                      ansIdx++
                    ) {
                      handler(
                        {
                          ...formCtx,
                          item: siCtx,
                          answer: siItem.answers![ansIdx],
                          answerIndexInItem: ansIdx,
                          answerJPMS: jm.jsonPatchAnchoredMutationsSupplier(
                            formJPMS,
                            (path: jm.JsonPointer): jm.JsonPointer => {
                              return `/items/${tlIdx}/items/${subIdx}/answers/${ansIdx}/${path}`;
                            },
                          ),
                        },
                      );
                    }
                  }
                  : undefined,
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
