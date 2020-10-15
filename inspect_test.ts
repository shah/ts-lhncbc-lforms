import { testingAsserts as ta } from "./deps-test.ts";
import { inspect as insp } from "./deps.ts";
import * as mod from "./inspect.ts";
import type { NihLhcForm } from "./lform.ts";

export async function inspectForm(
  ctx: mod.LhcFormInspectionContext,
  active: mod.LhcFormInspectionResult,
): Promise<mod.LhcFormInspectionResult> {
  // TODO put in some rules here
  return active;
}

Deno.test(`inspect form (TODO: add rules)`, async () => {
  const lform: NihLhcForm = JSON.parse(
    Deno.readTextFileSync("test1-with-error.lhc-form.json"),
  );
  const ctx = new mod.TypicalLhcFormInspectionContext();
  const ip = insp.inspectionPipe(inspectForm);
  const result = await ip(ctx, lform);

  ta.assert(mod.isSuccessfulLhcFormInspection(result));
  ta.assertEquals(ctx.inspectionDiags.inspectionIssues.length, 0);
  ta.assertEquals(ctx.inspectionDiags.inspectionExceptions.length, 0);
});
