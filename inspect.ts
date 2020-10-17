import { inspect as insp } from "./deps.ts";
import type * as lf from "./lform.ts";

export function lhcFormInspectionPipe<F extends lf.NihLhcForm>(
  ...inspectors: insp.Inspector<
    F,
    string,
    Error,
    LhcFormInspectionDiagnostics<F>
  >[]
): insp.InspectionPipe<F, string, Error, LhcFormInspectionDiagnostics<F>> {
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
): LhcFormItemInspectionIssue<F, I> & insp.Diagnosable<string> {
  return {
    ...lchFormIssue(form, message),
    item: item,
  };
}

export interface LhcFormInspectionDiagnostics<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends
  insp.InspectionDiagnostics<
    F,
    string,
    Error
  > {
  readonly onFormIssue: (
    target: F,
    diagnostic: string,
  ) => Promise<LhcFormInspectionResult<F>>;

  readonly onFormInspection: <IR>(
    target: F,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ) => Promise<LhcFormInspectionResult<F> | undefined>;

  readonly onFormItemIssue: (
    form: F,
    item: lf.FormItem,
    diagnostic: string,
  ) => Promise<LhcFormInspectionResult<F>>;

  readonly onFormItemInspection: <IR>(
    form: F,
    item: lf.FormItem,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ) => Promise<LhcFormInspectionResult<F> | undefined>;
}

export class TypicalLhcFormInspectionDiags<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionDiagnosticsRecorder<
  F,
  string,
  Error
> implements LhcFormInspectionDiagnostics<F> {
  async onFormIssue(
    target: F,
    diagnostic: string,
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onPreparedIssue(lchFormIssue<F>(target, diagnostic));
  }

  async onFormInspection<IR>(
    target: F,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormIssue(target, inspResult.diagnostic);
    }
  }

  async onFormItemIssue(
    form: F,
    item: lf.FormItem,
    diagnostic: string,
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onPreparedIssue(
      lchFormItemIssue<F>(form, item, diagnostic),
    );
  }

  async onFormItemInspection<IR>(
    form: F,
    item: lf.FormItem,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormItemIssue(form, item, inspResult.diagnostic);
    }
  }
}

export class ConsoleLhcFormInspectionDiags<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.ConsoleInspectionDiagnostics<
  F,
  string,
  Error
> implements LhcFormInspectionDiagnostics<F> {
  async onFormIssue(
    target: F,
    diagnostic: string,
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onPreparedIssue(lchFormIssue<F>(target, diagnostic));
  }

  async onFormInspection<IR>(
    target: F,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormIssue(target, inspResult.diagnostic);
    }
  }

  async onFormItemIssue(
    form: F,
    item: lf.FormItem,
    diagnostic: string,
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onPreparedIssue(
      lchFormItemIssue<F>(form, item, diagnostic),
    );
  }

  async onFormItemInspection<IR>(
    form: F,
    item: lf.FormItem,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormItemIssue(form, item, inspResult.diagnostic);
    }
  }
}

export class DerivedLhcFormInspectionDiags<
  F extends lf.NihLhcForm,
  W,
> extends insp.WrappedInspectionDiagnostics<
  F,
  string,
  Error,
  W
> implements LhcFormInspectionDiagnostics<F> {
  async onFormIssue(
    target: F,
    diagnostic: string,
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onPreparedIssue(lchFormIssue<F>(target, diagnostic));
  }

  async onFormInspection<IR>(
    target: F,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormIssue(target, inspResult.diagnostic);
    }
  }

  async onFormItemIssue(
    form: F,
    item: lf.FormItem,
    diagnostic: string,
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onPreparedIssue(
      lchFormItemIssue<F>(form, item, diagnostic),
    );
  }

  async onFormItemInspection<IR>(
    form: F,
    item: lf.FormItem,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormItemIssue(form, item, inspResult.diagnostic);
    }
  }
}

export interface LchFormInspector<F extends lf.NihLhcForm = lf.NihLhcForm>
  extends
    insp.Inspector<
      F,
      string,
      Error,
      LhcFormInspectionDiagnostics<F>
    > {
  (
    target: F | LhcFormInspectionResult<F>,
    diags?: LhcFormInspectionDiagnostics<F>,
  ): Promise<F | LhcFormInspectionResult<F>>;
}
