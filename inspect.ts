import { inspect as insp } from "./deps.ts";
import type * as lf from "./lform.ts";

export function lhcFormInspectionPipe<F extends lf.NihLhcForm>(
  ...inspectors: insp.Inspector<F, string>[]
): insp.InspectionPipe<F, string> {
  return insp.inspectionPipe(...inspectors);
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionResult<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionResult<F> {
}

export const isLhcFormInspectionResult = insp.isInspectionResult;

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionOptions extends insp.InspectionOptions {
}

export const isSuccessfulLhcFormInspection = insp.isSuccessfulInspection;

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionIssue<F> {
}

export function isLhcFormInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(o: unknown): o is (LhcFormInspectionIssue<F> & insp.Diagnosable<string>) {
  return insp.isInspectionIssue<F>(o) && insp.isDiagnosable<string>(o);
}

export function lchFormIssue<F extends lf.NihLhcForm = lf.NihLhcForm>(
  form: F,
  message: string,
): LhcFormInspectionIssue<F> & insp.Diagnosable<string> {
  return {
    isInspectionResult: true,
    isInspectionIssue: true,
    inspectionTarget: form,
    diagnostic: message,
  };
}

export interface LhcFormItemInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
> extends LhcFormInspectionIssue<F> {
  item: I;
}

export function isLhcFormItemInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  o: unknown,
): o is (LhcFormItemInspectionIssue<F, I> & insp.Diagnosable<string>) {
  return isLhcFormInspectionIssue<F>(o) && "item" in o;
}

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
    item: item,
  };
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionDiagnostics<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends
  insp.InspectionDiagnostics<
    F,
    string,
    Error
  > {
}

export class TypicalLhcFormInspectionDiags<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionDiagnosticsRecorder<
  F,
  string,
  Error
> {
}

export class ConsoleLhcFormInspectionDiags<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.ConsoleInspectionDiagnostics<
  F,
  string,
  Error
> {
}

export class DerivedLhcFormInspectionDiags<
  F extends lf.NihLhcForm,
  W,
> extends insp.WrappedInspectionDiagnostics<
  F,
  string,
  Error,
  W
> {
}

export interface LchFormInspector<F extends lf.NihLhcForm = lf.NihLhcForm>
  extends insp.Inspector<F, LhcFormInspectionDiagnostics<F>, Error> {
  (
    target: F | LhcFormInspectionResult<F>,
    diags?: LhcFormInspectionDiagnostics<F>,
  ): Promise<F | LhcFormInspectionResult<F>>;
}
