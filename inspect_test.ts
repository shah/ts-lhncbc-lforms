import { testingAsserts as ta } from "./deps-test.ts";
import { inspect as insp } from "./deps.ts";
import * as mod from "./inspect.ts";
import type { NihLhcForm } from "./lform.ts";

// This is passed into mod.lhcFormInspectionPipe, which expects async
// deno-lint-ignore require-await
export async function inspectForm(
  target: NihLhcForm | mod.LhcFormInspectionResult,
  ctx?: insp.InspectionContext | mod.LhcFormInspectionDiagnostics,
): Promise<NihLhcForm | mod.LhcFormInspectionResult> {
  // TODO put in some rules here
  return target;
}

Deno.test(`inspect form (TODO: add rules)`, async () => {
  const lform: NihLhcForm = JSON.parse(
    Deno.readTextFileSync("test1-with-error.lhc-form.json"),
  );
  const diags = new mod.TypicalLhcFormInspectionDiags(
    mod.lhcFormInspectionPipeContent(),
  );
  const ip = mod.lhcFormInspectionPipe(inspectForm);
  const result = await ip(lform, diags);

  ta.assert(mod.isSuccessfulLhcFormInspection(result));
  ta.assertEquals(diags.inspectionIssues.length, 0);
});
