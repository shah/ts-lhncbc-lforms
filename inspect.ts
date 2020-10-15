import type * as lf from "./lform.ts";
import { inspect as insp, safety } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionResult<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionResult<F> {
}

export const isSuccessfulLhcFormInspection = insp.isSuccessfulInspection;

export interface LhcFormInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionIssue<F>, insp.DiagnosableInspectionResult<string> {
  isLhcFormInspectionIssue: true;
}

export const isLhcFormInspectionIssue = safety.typeGuardCustom<
  LhcFormInspectionResult<lf.NihLhcForm>,
  LhcFormInspectionIssue<lf.NihLhcForm>
>("isLhcFormInspectionIssue");

export function lchFormIssue<F extends lf.NihLhcForm = lf.NihLhcForm>(
  form: F,
  message: string,
): LhcFormInspectionIssue<F> {
  return {
    isInspectionResult: true,
    isInspectionIssue: true,
    isLhcFormInspectionIssue: true,
    inspectionTarget: form,
    inspectionDiagnostic: message,
  };
}

export interface LhcFormItemInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
> extends LhcFormInspectionIssue<F> {
  isLhcFormItemInspectionIssue: true;
  item: I;
}

export const isLhcFormItemInspectionIssue = safety.typeGuardCustom<
  LhcFormInspectionResult<lf.NihLhcForm>,
  LhcFormItemInspectionIssue<lf.NihLhcForm>
>("isLhcFormInspectionIssue", "isLhcFormItemInspectionIssue");

export function lchFormItemIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  form: F,
  item: I,
  message: string,
): LhcFormItemInspectionIssue<F, I> {
  return {
    ...lchFormIssue(form, message),
    isLhcFormItemInspectionIssue: true,
    item: item,
  };
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionContext<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionContext<F> {
}

// deno-lint-ignore no-empty-interface
export interface LhcFormSanitizerContext {
}

export function sanitizeForm<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(
  content: F,
  sanitize?: safety.TransformerSync<
    LhcFormSanitizerContext,
    F
  >,
): F {
  return sanitize ? sanitize.transform(content) : content;
}

export class TypicalLhcFormInspectionContext<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> implements LhcFormInspectionContext<F> {
  readonly diags = new insp.InspectionDiagnosticsRecorder<
    F,
    insp.InspectionContext<F>
  >();
}

export class ConsoleLhcFormInspectionContext<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> implements LhcFormInspectionContext<F> {
  readonly diags = new insp.ConsoleInspectionDiagnostics(
    new insp.InspectionDiagnosticsRecorder<
      F,
      insp.InspectionContext<F>
    >(),
  );
}

export interface LhcFormInspector<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.Inspector<F, LhcFormInspectionContext<F>> {
  (
    ctx: LhcFormInspectionContext<F>,
    active: LhcFormInspectionResult<F>,
  ): Promise<insp.InspectionResult<F>>;
}
