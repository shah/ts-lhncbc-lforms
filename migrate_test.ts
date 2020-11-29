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
  const removeFour: mod.LhcFormTopLevelItemMutationsPreparer<NihLhcForm> = (
    item,
    mutations,
  ) => {
    const removeValues = [
      `codingInstructions`,
      `copyrightNotice`,
      `dataType`,
      `units`,
    ];
    mutations.removeValues(...removeValues);
    return undefined;
  };
  const qcRegistry: Record<
    string,
    mod.LhcFormTopLevelItemMutationsPreparer<NihLhcForm>
  > = {
    "002-01-01": removeFour,
    "002-01-02": removeFour,
    "Q002-02-11": (item, mutations) => {
      const removeValues = [
        `dataType`,
        `hideUnits`,
      ];
      mutations.removeValues(...removeValues);
      return undefined;
    },
  };

  const lfmp = mod.lhcFormMutationsPreparer(
    (form, mutations): void => {
      mutations.removeValues(...[
        "/code",
        "/PATH_DELIMITER",
        "/template",
        "/type",
      ]);
    },
    mod.lchFormTopLevelItemMutationsQuesCodeRegistry(qcRegistry),
  );

  const testFormSrc = JSON.parse(
    Deno.readTextFileSync(
      testFilePath("test5-institution-profile.lhc-form.json"),
    ),
  ) as NihLhcForm;
  const formJPMS = lfmp(testFormSrc, jm.jsonPatchMutationsSupplier());
  const patchOps = formJPMS.patchOps();
  ta.assert(patchOps);
  ta.assertEquals(patchOps.length, 14);
});
