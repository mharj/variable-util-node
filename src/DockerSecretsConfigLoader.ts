import * as fs from 'fs';
import * as path from 'path';
import {ConfigLoader, GetValue} from '@avanio/variable-util/dist/loaders';

export interface DockerSecretsConfigLoaderOptions {
	fileLowerCase: boolean;
	path: string;
	isSilent: false;
}

export class DockerSecretsConfigLoader extends ConfigLoader {
	public type = 'docker-secrets';
	private options: DockerSecretsConfigLoaderOptions;
	private valuePromises: Record<string, Promise<string | undefined> | undefined> = {};
	public constructor(options: Partial<DockerSecretsConfigLoaderOptions> = {}) {
		super();
		this.options = {fileLowerCase: false, path: '/run/secrets', isSilent: false, ...options};
	}

	public async get(key: string): Promise<GetValue> {
		const filePath = this.filePath(key);
		if (!this.valuePromises[key]) {
			if (!fs.existsSync(filePath)) {
				if (!this.options.isSilent) {
					throw new Error(`ConfigVariables[docker-secrets]: ${key} from ${filePath} not found`);
				}
				this.valuePromises[key] = Promise.resolve(undefined);
			} else {
				this.valuePromises[key] = fs.promises.readFile(filePath, 'utf8');
			}
		}
		const value = await this.valuePromises[key];
		return {value, path: filePath};
	}

	private filePath(key: string): string {
		return path.join(path.resolve(this.options.path), this.options.fileLowerCase ? key.toLowerCase() : key);
	}
}