# variable-util-node

NodeJS loaders for @avanio/variable-util

## install

```bash
npm i @avanio/variable-util @avanio/variable-util-node --save
```

### Examples

```typescript
setLogger(console); // or log4js or winston
// Docker secret files
const dockerEnv = new DockerSecretsConfigLoader({fileLowerCase: true}).getLoader;
// settings json file (i.e. modified on pipeline or agent)
const fileEnv = new FileConfigLoader({fileName: './settings.json', type: 'json'}).getLoader;

// lookup from: env => JSON file "settings.json" => Docker "/run/secrets/database_uri"
const databaseUrl = await getConfigVariable('DATABASE_URI', [env(), fileEnv(), dockerEnv()], undefined, {sanitizeUrl: true});

// example override key: env => JSON file "settings.json" => Docker "/run/secrets/xxyyzz-database"
const databaseUrl = await getConfigVariable('DATABASE_URI', [env(), fileEnv(), dockerEnv('xxyyzz-database')], undefined, {sanitizeUrl: true});
```
