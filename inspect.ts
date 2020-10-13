import type * as lf from "./lform.ts";
import { inspect as insp, safety } from "./deps.ts";

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionResult<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionResult<F> {
}

// deno-lint-ignore no-empty-interface
export interface SuccessfulLhcFormInspection<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.SuccessfulInspection<F> {
}

export const lhcFormInspectionSuccess = insp.successfulInspection;
export const isSuccessfulLhcFormInspection = insp.isSuccessfulInspection;

export interface LhcFormInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionIssue<F>, insp.DiagnosableInspectionResult<string> {
}

export const lchFormIssue = insp.inspectionIssue;
export const isLhcFormInspectionIssue = insp.isInspectionIssue;
export const isDiagnosableLhcFormInspectionIssue =
  insp.isDiagnosableInspectionResult;

export interface LhcFormItemInspectionIssue<
  I extends lf.FormItem = lf.FormItem,
> extends insp.InspectionIssue<I>, insp.DiagnosableInspectionResult<string> {
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionContext<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionContext<F> {
}

// deno-lint-ignore no-empty-interface
export interface LhcFormSanitizerContext {
}

export class TypicalLhcFormInspectionContext<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> implements LhcFormInspectionContext<F> {
  readonly inspectionTarget: F;
  readonly diags = new insp.InspectionDiagnosticsRecorder<
    F,
    insp.InspectionContext<F>
  >();

  constructor(
    content: F,
    sanitize?: safety.TransformerSync<
      LhcFormSanitizerContext,
      F
    >,
  ) {
    this.inspectionTarget = sanitize ? sanitize.transform(content) : content;
  }
}

export interface LhcFormInspector<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.Inspector<F, LhcFormInspectionContext<F>> {
  (
    ctx: LhcFormInspectionContext<F>,
    active: LhcFormInspectionResult<F>,
  ): Promise<insp.InspectionResult<F>>;
}
