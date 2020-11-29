import { NihLhcForm } from "./lform.ts";

export function writeLhcFormFileSync(
  path: string | URL,
  form: NihLhcForm,
  options?: Deno.WriteFileOptions,
): void {
  Deno.writeTextFileSync(path, JSON.stringify(form, undefined, 2), options);
}

export function readLhcFormFileSync(path: string | URL): NihLhcForm {
  const content = JSON.parse(Deno.readTextFileSync(path));
  return content as NihLhcForm;
}
