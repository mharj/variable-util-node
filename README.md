# variable-util-node

NodeJS loaders for @avanio/variable-util

## install

```bash
npm i @avanio/variable-util @avanio/variable-util-node --save
```

### Examples

```typescript
// JSON (flat) settings file
export const getConfigVariable = new ConfigVariables([new FileConfigLoader({fileName: './settings.json', isSilent: false, type: 'json'})], {
	logger: console,
}).get;

// Docker secret files
export const getConfigVariable = new ConfigVariables([new DockerSecretsConfigLoader({isSilent: false, fileLowerCase: true})], {
	logger: console,
}).get;

// Using multiple loaders
export const getConfigVariable = new ConfigVariables(
	[
		new EnvConfigLoader(),
		new FileConfigLoader({fileName: './settings.json', type: 'json'}),
		new DockerSecretsConfigLoader({fileLowerCase: true}),
	],
	{
		logger: console,
	},
).get;

const databaseUri = await configVariable.get('DATABASE_URI', undefined, {sanitizeUrl: true});
```
