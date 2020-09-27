# LHC Forms Goverance

This library provides functionality to help validate and edit LHC Form JSON files.

The following commands are available:

```bash
❯ deno-run lformctl.ts --help
Goverend LHC Form Data Controller (GLForm) v1.3.0.

GLForm is a wrapper around the GovSuite GDC Controller which allows a more convenient CLI for
managing LForm Schemas.

Usage:
  lformctl lform type <lform-json-src> [--lform-schema-ts=<url>] [--validate] [--overwrite] [--verbose] [--dry-run]
  lformctl -h | --help
  lformctl --version

Options:
  <lform-json-src>            LHC Form JSON single local file name or glob (like "*.json" or "**/*.json")
  --lform-schema-ts=<url>     Where the lform.ts TypeScript schema can be found
  --validate                  Validate the generated TypeScript
  --overwrite                 If the destination file already exists, replace it
  --verbose                   Inform what actions are taking place
  -h --help                   Show this screen
  --version                   Show version
```

# Validation Example

Normal usage will be to have JSON files available in a directory and just run from URL:

```bash
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms/lformctl.ts" json type "**/*.json" --verbose
```

As shown above, you can use either a specific version or leave out the version number to use the latest version.

There is a sample LHC Form JSON file `test1-with-error.lhc-form.json` which has forced error. If you run the validator, it should give you a proper error message:

```bash
❯ deno-run lformctl.ts lform type "*.json" --validate --overwrite --verbose
TS2322 [ERROR]: Type 'string' is not assignable to type 'number'.
        min: 'bad data',
        ~~~
    at /test1-with-error.lhc-form.auto.ts:12:9
```

# Convert LHC Form JSON to Typed Data Gen (TDG) TypeScript

Normal usage will be to have JSON files available in a directory and just run from URL:

```bash
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms/lformctl.ts" lform type "**/*.json" --verbose
❯ deno-run "https://denopkg.com/shah/ts-lhncbc-lforms@v1.3.0/lformctl.ts" lform type "**/*.json" --verbose
```

As shown above, you can use either a specific version or leave out the version number to use the latest version.

You can take one or more LHC Form JSON files like `test1-with-error.lhc-form.json` and generate editable TypeScript files from them. If destination files already exist, they will not be overwritten unless explictly told to. For example:

```bash
❯ deno-run lformctl.ts lform type "*.json" --verbose
[GSDC-01-000] test1-with-error.lhc-form.auto.ts exists, overwrite not requested, not replacing
[GSDC-01-000] test2-github-issue2.lhc-form.auto.ts exists, overwrite not requested, not replacing
[GSDC-01-000] test3-update-interface-NihLhcForm.lhc-form.auto.ts exists, overwrite not requested, not replacing

❯ deno-run lformctl.ts lform type "*.json" --verbose --overwrite
Overwriting: test1-with-error.lhc-form.auto.ts
./test1-with-error.lhc-form.auto.ts
Overwriting: test2-github-issue2.lhc-form.auto.ts
./test2-github-issue2.lhc-form.auto.ts
Overwriting: test3-update-interface-NihLhcForm.lhc-form.auto.ts
./test3-update-interface-NihLhcForm.lhc-form.auto.ts

❯ deno fmt test1-with-error.lhc-form.auto.tdg.ts
```
