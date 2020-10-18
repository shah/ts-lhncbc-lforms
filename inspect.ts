import { inspect as insp } from "./deps.ts";
import type * as lf from "./lform.ts";

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

export const lhcFormInspectionPipeContent = insp.inspectionPipeContext;

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
  diagnostic: string | string[],
): LhcFormInspectionIssue<F> & insp.Diagnosable<string> {
  return insp.inspectionIssue(form, diagnostic);
}

export interface LhcFormItemInspectionIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
> extends LhcFormInspectionIssue<F> {
  item: I;
  ancestors?: lf.FormItem[];
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
  diagnostic: string | string[],
  ancestors?: lf.FormItem[],
): LhcFormItemInspectionIssue<F, I> & insp.Diagnosable<string> {
  return {
    ...lchFormIssue(form, diagnostic),
    item: item,
    ancestors: ancestors,
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

  readonly onFormItemIssue: <I = lf.FormItem>(
    form: F,
    item: I,
    diagnostic: string,
  ) => Promise<LhcFormInspectionResult<F>>;

  readonly onFormItemInspection: <IR, I = lf.FormItem>(
    form: F,
    item: I,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
  ) => Promise<LhcFormInspectionResult<F> | undefined>;
}

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionOptions {
}

export class TypicalLhcFormInspectionDiags<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionDiagnosticsRecorder<
  F,
  string,
  Error
> implements LhcFormInspectionDiagnostics<F> {
  constructor(
    context: insp.InspectionContext,
    options?: LhcFormInspectionOptions,
  ) {
    super(context, options);
  }

  async onFormIssue(
    target: F,
    diagnostic: string | string[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(lchFormIssue<F>(target, diagnostic));
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
      return await this.onFormIssue(target, inspResult.diagnostics);
    }
  }

  async onFormItemIssue<I = lf.FormItem>(
    form: F,
    item: I,
    diagnostic: string | string[],
    ancestors?: lf.FormItem[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(
      lchFormItemIssue<F, I>(form, item, diagnostic, ancestors),
    );
  }

  async onFormItemInspection<IR, I = lf.FormItem>(
    form: F,
    item: I,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
    ancestors?: lf.FormItem[],
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormItemIssue(
        form,
        item,
        inspResult.diagnostics,
        ancestors,
      );
    }
  }
}

export interface LchFormIssueDiagnosticPathSupplier<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> {
  (issue: insp.InspectionIssue<F>): string;
}

function truncate(content: unknown, n: number, useWordBoundary = true): string {
  let str: string;
  if (typeof content === "string") {
    str = content;
  } else {
    str = JSON.stringify(content);
  }
  if (str.length <= n) return str;
  const subString = str.substr(0, n - 1);
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(" "))
    : subString) + "...";
}

export interface LchFormIssueDiagnosticMessageSupplier<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> {
  (
    issue: insp.InspectionIssue<F> & insp.Diagnosable<string>,
    diagnostic: string,
    pathSupplier?: LchFormIssueDiagnosticPathSupplier,
  ): string;
}

export function defaultLchFormIssueDiagnosticPath<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(issue: insp.InspectionIssue<F>): string | undefined {
  if (isLhcFormItemInspectionIssue<F>(issue)) {
    const path = issue.ancestors
      ? [
        ...(issue.ancestors.map((i) => i.questionCode)),
        issue.item.questionCode,
      ]
      : [issue.item.questionCode];
    return `${path.join("::")} ${issue.item.question}`;
  }
}

export function defaultLhcFormIssueDiagnosticMessage<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(
  issue: insp.InspectionIssue<F> & insp.Diagnosable<string>,
  message: string,
  pathSupplier?: LchFormIssueDiagnosticPathSupplier,
): string | undefined {
  if (isLhcFormItemInspectionIssue<F>(issue)) {
    const path = pathSupplier
      ? pathSupplier(issue)
      : defaultLchFormIssueDiagnosticPath(issue);
    return `[${path}] ${message}: ${truncate(issue.item.value, 55)}`;
  } else {
    return message;
  }
}

export class ConsoleLhcFormInspectionDiags<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.ConsoleInspectionDiagnostics<
  F,
  string,
  Error
> implements LhcFormInspectionDiagnostics<F> {
  constructor(
    readonly wrap: LhcFormInspectionDiagnostics<F>,
    readonly verbose?: boolean,
    readonly diagMessage = defaultLhcFormIssueDiagnosticMessage,
  ) {
    super(wrap, verbose);
  }

  async onIssue(
    issue: insp.InspectionIssue<F>,
  ): Promise<insp.InspectionIssue<F>> {
    if (this.verbose && insp.isDiagnosable<string>(issue)) {
      const mrd = issue.mostRecentDiagnostic();
      if (mrd) console.error(this.diagMessage(issue, mrd));
    }
    return await this.wrap.onIssue(issue);
  }

  async onFormIssue(
    target: F,
    diagnostic: string | string[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(lchFormIssue<F>(target, diagnostic));
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
      return await this.onFormIssue(target, inspResult.diagnostics);
    }
  }

  async onFormItemIssue<I = lf.FormItem>(
    form: F,
    item: I,
    diagnostic: string | string[],
    ancestors?: lf.FormItem[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(
      lchFormItemIssue<F, I>(form, item, diagnostic, ancestors),
    );
  }

  async onFormItemInspection<IR, I = lf.FormItem>(
    form: F,
    item: I,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
    ancestors?: lf.FormItem[],
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormItemIssue(
        form,
        item,
        inspResult.diagnostics,
        ancestors,
      );
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
    diagnostic: string | string[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(lchFormIssue<F>(target, diagnostic));
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
      return await this.onFormIssue(target, inspResult.diagnostics);
    }
  }

  async onFormItemIssue<I = lf.FormItem>(
    form: F,
    item: I,
    diagnostic: string | string[],
    ancestors?: lf.FormItem[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(
      lchFormItemIssue<F, I>(form, item, diagnostic, ancestors),
    );
  }

  async onFormItemInspection<IR, I = lf.FormItem>(
    form: F,
    item: I,
    inspResult:
      | insp.InspectionResult<IR>
      | insp.InspectionResultSupplier<IR>
      | unknown,
    ancestors?: lf.FormItem[],
  ): Promise<LhcFormInspectionResult<F> | undefined> {
    if (
      insp.isInspectionIssue<IR>(inspResult) &&
      insp.isDiagnosable<string>(inspResult)
    ) {
      return await this.onFormItemIssue(
        form,
        item,
        inspResult.diagnostics,
        ancestors,
      );
    }
  }
}
