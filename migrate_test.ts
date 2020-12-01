import { testingAsserts as ta } from "./deps-test.ts";
import { jsonMutator as jm, path } from "./deps.ts";
import { NihLhcForm } from "./lform.ts";
import * as mod from "./mod.ts";

function testFilePath(relTestFileName: string): string {
  return path.join(
    path.relative(
      Deno.cwd(),
      path.dirname(path.fromFileUrl(import.meta.url)),
    ),
    relTestFileName,
  );
}

Deno.test(`mutate LHC Form values (for data migrations)`, () => {
  const qcExactSuppliers = new Map<
    string,
    mod.LhcFormItemJsonPatchMutationsSupplier<NihLhcForm>
  >();
  const qcRegExSuppliers = new Map<
    RegExp,
    mod.LhcFormItemJsonPatchMutationsSupplier<NihLhcForm>
  >();
  qcRegExSuppliers.set(/^002-01-01|002-01-02$/, (ctx) => {
    ctx.itemJPMS.removeValues(
      `codingInstructions`,
      `copyrightNotice`,
      `dataType`,
      `units`,
    );
  });
  qcExactSuppliers.set("Q002-02-11", (ctx) => {
    ctx.itemJPMS.removeValues(`dataType`, `hideUnits`);
  });
  qcExactSuppliers.set("002-02-00::002-02-01", (ctx) => {
    ctx.itemJPMS.removeValues(`codingInstructions`);
  });

  let commonEncountered = 0;
  let noMatchEncountered = 0;
  let reportMatchEncountered = 0;
  let itemsWithAnswersEncountered = 0;
  let answersEncountered = 0;
  const lfmp = mod.lhcFormFlexibleMutationsSupplier(
    (formCtx) => {
      formCtx.formJPMS.removeValues(...[
        "/code",
        "/PATH_DELIMITER",
        "/template",
        "/type",
      ]);
    },
    mod.lhcFormQuestionCodeMutationsSuppliers({
      questionCodesHierarchySearchKey: (...questionCodes: string[]): string => {
        return questionCodes.join("::");
      },
      exactMutators: qcExactSuppliers,
      regExMutators: qcRegExSuppliers,
      everyMutator: (ctx) => {
        commonEncountered++;
        if (ctx.forEachAnswer) {
          itemsWithAnswersEncountered++;
          ctx.forEachAnswer(() => {
            answersEncountered++;
          });
        }
        return undefined;
      },
      noMatchMutator: () => {
        noMatchEncountered++;
        return undefined;
      },
      reportMatch: (qc, supplier, regExp) => {
        reportMatchEncountered++;
      },
    }),
  );

  const mlfr = mod.migrateLhcFormFile(
    testFilePath("test5-institution-profile.lhc-form.json"),
    lfmp,
  );
  ta.assertEquals(commonEncountered, 31);
  ta.assertEquals(noMatchEncountered, 27);
  ta.assertEquals(reportMatchEncountered, 4);
  ta.assertEquals(itemsWithAnswersEncountered, 4);
  ta.assertEquals(answersEncountered, 21);
  ta.assert(jm.isJsonPatchMutationResult(mlfr.mutationResult));
  ta.assert(mlfr.mutationResult.mutated);

  // we created 14 patch operations but only 7 are valid so those are kept;
  // the others probaby weren't found in the source so they were filtered
  ta.assertEquals(mlfr.suggestedPatchOps.length, 15);
  ta.assertEquals(mlfr.mutationResult.patchOps.length, 7);
});
