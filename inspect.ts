import { colors, inspect as insp } from "./deps.ts";
import type * as lf from "./lform.ts";

export interface LhcFormInspector<F extends lf.NihLhcForm = lf.NihLhcForm>
  extends insp.Inspector<F> {
  (
    target: F | LhcFormInspectionResult<F>,
    diags?: LhcFormInspectionDiagnostics<F>,
  ): Promise<F | LhcFormInspectionResult<F>>;
}

export function lhcFormInspectionPipe<F extends lf.NihLhcForm>(
  ...inspectors: insp.Inspector<F>[]
): insp.InspectionPipe<F> {
  return insp.inspectionPipe(...inspectors);
}

export const lhcFormInspectionPipeContent = insp.inspectionPipeContext;

// deno-lint-ignore no-empty-interface
export interface LhcFormInspectionResult<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends insp.InspectionResult<F> {
}

export const isLhcFormInspectionResult = insp.isInspectionResult;
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

export function lhcFormIssue<F extends lf.NihLhcForm = lf.NihLhcForm>(
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

export function lhcFormItemIssue<
  F extends lf.NihLhcForm = lf.NihLhcForm,
  I extends lf.FormItem = lf.FormItem,
>(
  form: F,
  item: I,
  diagnostic: string | string[],
  ancestors?: lf.FormItem[],
): LhcFormItemInspectionIssue<F, I> & insp.Diagnosable<string> {
  return {
    ...lhcFormIssue(form, diagnostic),
    item: item,
    ancestors: ancestors,
  };
}

export interface LhcFormInspectionDiagnostics<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> extends
  insp.InspectionDiagnostics<
    F,
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
  Error
> implements LhcFormInspectionDiagnostics<F> {
  constructor(context: insp.InspectionContext) {
    super(context);
  }

  async onFormIssue(
    target: F,
    diagnostic: string | string[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(lhcFormIssue<F>(target, diagnostic));
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
      lhcFormItemIssue<F, I>(form, item, diagnostic, ancestors),
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

export interface LhcFormIssueDiagnosticPathSupplier<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> {
  (issue: insp.InspectionIssue<F>): string;
}

export function truncate(
  content: unknown,
  maxChars: number,
  suffix = "...",
  useWordBoundary = true,
): string {
  let str: string;
  if (typeof content === "string") {
    str = content;
  } else {
    str = JSON.stringify(content);
  }
  if (str.length <= maxChars) return str;
  const subString = str.substr(0, maxChars - 1);
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(" "))
    : subString) + suffix;
}

export interface LhcFormIssueDiagnosticMessageSupplier<
  F extends lf.NihLhcForm = lf.NihLhcForm,
> {
  (
    issue: insp.InspectionIssue<F> & insp.Diagnosable<string>,
    diagnostic: string,
    pathSupplier?: LhcFormIssueDiagnosticPathSupplier,
  ): string;
}

export function defaultLhcFormIssueDiagnosticPath<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(issue: insp.InspectionIssue<F>): string | undefined {
  if (isLhcFormItemInspectionIssue<F>(issue)) {
    const path = issue.ancestors
      ? [
        ...(issue.ancestors.map((i) => i.questionCode)),
        issue.item.questionCode,
      ]
      : [issue.item.questionCode];
    return `${path.join("::")} ${truncate(issue.item.question, 20)}`;
  }
}

export function defaultLhcFormIssueDiagnosticMessage<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(
  issue: insp.InspectionIssue<F> & insp.Diagnosable<string>,
  message: string,
  pathSupplier?: LhcFormIssueDiagnosticPathSupplier,
): string | undefined {
  if (isLhcFormItemInspectionIssue<F>(issue)) {
    const path = pathSupplier
      ? pathSupplier(issue)
      : defaultLhcFormIssueDiagnosticPath(issue);
    return `[${path}] ${message}: ${truncate(issue.item.value, 55)}`;
  } else {
    return message;
  }
}

export function coloredLhcFormIssueDiagnosticPath<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(issue: insp.InspectionIssue<F>): string | undefined {
  if (isLhcFormItemInspectionIssue<F>(issue)) {
    const path = issue.ancestors
      ? [
        ...(issue.ancestors.map((i) => i.questionCode)),
        issue.item.questionCode,
      ]
      : [issue.item.questionCode];
    return `${colors.green(path.join("::"))} ${
      colors.brightWhite(truncate(issue.item.question, 20, colors.cyan("...")))
    }`;
  }
}

export function coloredLhcFormIssueDiagnosticMessage<
  F extends lf.NihLhcForm = lf.NihLhcForm,
>(
  issue: insp.InspectionIssue<F> & insp.Diagnosable<string>,
  message: string,
  pathSupplier?: LhcFormIssueDiagnosticPathSupplier,
): string | undefined {
  if (isLhcFormItemInspectionIssue<F>(issue)) {
    const path = pathSupplier
      ? pathSupplier(issue)
      : coloredLhcFormIssueDiagnosticPath(issue);
    let inspName: string | undefined = undefined;
    if (insp.isInspectorProvenanceSupplier(issue)) {
      inspName = ` ${
        colors.gray("(" + issue.inspectorProvenance.inspectorIdentity + ")")
      }`;
    }
    return `[${path}] ${colors.brightYellow(message)}: ${
      truncate(issue.item.value, 55, colors.cyan("..."))
    }${inspName}`;
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
    readonly diagMessage = coloredLhcFormIssueDiagnosticMessage,
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
    return await this.onIssue(lhcFormIssue<F>(target, diagnostic));
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
      lhcFormItemIssue<F, I>(form, item, diagnostic, ancestors),
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
  Error,
  W
> implements LhcFormInspectionDiagnostics<F> {
  async onFormIssue(
    target: F,
    diagnostic: string | string[],
  ): Promise<LhcFormInspectionResult<F>> {
    return await this.onIssue(lhcFormIssue<F>(target, diagnostic));
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
      lhcFormItemIssue<F, I>(form, item, diagnostic, ancestors),
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
