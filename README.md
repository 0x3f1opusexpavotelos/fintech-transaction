




##  end to end type safe with hono and zod
- Ultrafast and lightweight
- Fully typed and clean APIs
- run on edge(cloudflare workers,AWS Lambda) or serverless runtime(netlify),Deno, Bun and Node
-  sharing of the API specifications between the server and the client.
-

InferResponseType, InferRequestType
```bash
# state a project with hono template
bun create hono@latest <app>
# or add hono to existing project
bun add hono @hono/zod-validator zod
bnn add @hono/clerk-auth @clerk/backend
```

inferred
the path parameter

###
[zod](https://zod.dev/) -
compile time type infer w/ runtime type checking you ever could ask about API Response

Defines the shape of data queried from the database
or validate API requests.


  // cookie form  header json param query
    zValidator('')



## Format before commit
```bash
# add exact version over range
bun add --dev --exact eslint-config-prettier prettier husky lint-staged
bun add --dev eslint typescript-eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
bunx husky init
bun --eval "fs.writeFileSync('.husky/pre-commit','bunx lint-staged\n')"
```



## Features


each features are co-location for maintainability, layer of abstraction and Sensibility

- features
  - `/api`: query client
  - `/components`: query UI
  - `/hooks`: state hooks

account management
transaction History management

transaction history management
query,filter,add or edit transaction



if selected,disable
if deselected, enable

dashboard.overview
subscription and paywall



```ts
// array of object → fields-data object
const objectsToFieldsData = (arr: ObjectArray): FieldsData => {
  if (!arr.length) return { fields: [], data: [] };
  const fields = Object.keys(arr[0]);
  return {
    fields,
    data: arr.map(obj => fields.map(key => obj[key]))
  };
};

// field-data object to array of object
const fieldsDataToObjects = ({ fields, data }: FieldsData): ObjectArray =>
  data.map(row =>
    fields.reduce((obj, key, i) => ({ ...obj, [key]: row[i] }), {})
  );



// Object Array → Array of Arrays
const objectsToArrays = (arr: ObjectArray): ArrayOfArrays =>
  [Object.keys(arr[0]), ...arr.map(obj => Object.values(obj))]


// Array of Arrays → Object Array
const arraysToObjects = (arr: ArrayOfArrays): ObjectArray => {
  const [fields, ...data] = arr;
  return data.map(row =>
    fields.reduce((obj, key, i) => ({ ...obj, [key]: row[i] }), {})
  );
};

```



array of object
```
[
	{
		"Column 1": "foo",
		"Column 2": "bar"
	},
	{
		"Column 1": "abc",
		"Column 2": "def"
	}
]
```

field-data obejct
```
{
	"fields": ["Column 1", "Column 2"],
	"data": [
		["foo", "bar"],
		["abc", "def"]
	]
}
```

array of array
```
[
	["Column 1", "Column 2"],
	["foo", "bar"],
	["abc", "def"]
]

```


view-transiation api



> [!TIP]
> 有些api要在pull request中找到用例 - not yet documented
https://github.com/colinhacks/zod/pull/3415


z.extend
z.remap
z.mergei


parse dateStr to Date object,
or format Date object to dateStr.
ISO 8601格式是“YYYY-MM-DDTHH:mm:ss”
