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
  const testFormSrc = JSON.parse(
    Deno.readTextFileSync(
      testFilePath("test5-institution-profile.lhc-form.json"),
    ),
  ) as NihLhcForm;

  const lfmp = mod.lhcFormMutationsPreparer(
    (form, formJPMS): void => {
      formJPMS.removeValues(...[
        "/code",
        "/PATH_DELIMITER",
        "/template",
        "/type",
      ]);
    },
    (item, itemJPMS) => {
      if (["002-01-01", "002-01-02"].find((q) => q == item.questionCode)) {
        const removeValues = [
          `codingInstructions`,
          `copyrightNotice`,
          `dataType`,
          `units`,
        ];
        itemJPMS.removeValues(...removeValues);
      }
      if (["Q002-02-11"].find((q) => q == item.questionCode)) {
        const removeValues = [
          `dataType`,
          `hideUnits`,
        ];
        itemJPMS.removeValues(...removeValues);
      }
      return undefined;
    },
  );
  const formJPMS = lfmp(testFormSrc, jm.jsonPatchMutationsSupplier());
  const patchOps = formJPMS.patchOps();
  ta.assert(patchOps);
  ta.assertEquals(patchOps.length, 14);
});
