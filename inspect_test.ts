import {
  LhcFormVisitorContext,
  sectionsIndex,
  visitLhcFormItems,
} from "./inspect.ts";
import type { FormItem, NihLhcForm } from "./lform.ts";

/**
 * This is not a proper unit test, it's just a testing utility
 * TODO: either delete this file or turn it into a proper unit test
 */
Deno.test(`Test inspect`, async () => {
  const lhcForm: NihLhcForm = JSON.parse(
    Deno.readTextFileSync("./test4-offering-profile.lhc-form.json"),
  );
  const sects = sectionsIndex(lhcForm.items);
  console.dir(Object.keys(sects));
  visitLhcFormItems({
    form: lhcForm,
    handler: (
      ctx: LhcFormVisitorContext,
      item: FormItem,
      ...ancestors: FormItem[]
    ): void => {
      console.log(ancestors.length, item.header, item.question);
    },
  });
});
