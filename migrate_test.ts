import { testingAsserts as ta } from "./deps-test.ts";
import { jsonMutator as jm, path } from "./deps.ts";
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
  const removeFour: mod.LhcFormJsonPatchMutationsSupplier = (ctx) => {
    if (mod.isLhcFormItemMutationsSupplierContext(ctx)) {
      ctx.itemJPMS.removeValues(
        `codingInstructions`,
        `copyrightNotice`,
        `dataType`,
        `units`,
      );
    }
  };
  const quesCodesRegistry: mod.QuestionCodeMutationsSuppliers = new Map(
    Object.entries({
      "002-01-01": removeFour,
      "002-01-02": removeFour,
      "Q002-02-11": (ctx) => {
        if (mod.isLhcFormItemMutationsSupplierContext(ctx)) {
          ctx.itemJPMS.removeValues(`dataType`, `hideUnits`);
        }
      },
      [mod.questionCodesHierarchy("002-02-00", "002-02-01")]: (ctx) => {
        if (mod.isLhcFormSubItemMutationsSupplierContext(ctx)) {
          ctx.itemJPMS.removeValue(`codingInstructions`);
        }
      },
    }),
  );

  const lfmp = mod.lhcFormQuestionCodeMutationsSupplier((ctx) => {
    ctx.formJPMS.removeValues(...[
      "/code",
      "/PATH_DELIMITER",
      "/template",
      "/type",
    ]);
  }, quesCodesRegistry);

  const mlfr = mod.migrateLhcFormFile(
    testFilePath("test5-institution-profile.lhc-form.json"),
    lfmp,
  );
  ta.assert(jm.isJsonPatchMutationResult(mlfr.mutationResult));
  ta.assert(mlfr.mutationResult.mutated);

  // we created 14 patch operations but only 7 are valid so those are kept;
  // the others probaby weren't found in the source so they were filtered
  ta.assertEquals(mlfr.suggestedPatchOps.length, 15);
  ta.assertEquals(mlfr.mutationResult.patchOps.length, 7);
});
