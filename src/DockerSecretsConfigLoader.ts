import * as fs from 'fs';
import * as path from 'path';
import {ConfigLoader, LoaderValue} from '@avanio/variable-util/dist/loaders';

export interface DockerSecretsConfigLoaderOptions {
	fileLowerCase: boolean;
	path: string;
	/** set to false if need errors */
	isSilent: boolean;
}

export class DockerSecretsConfigLoader extends ConfigLoader<string | undefined> {
	public type = 'docker-secrets';
	private options: DockerSecretsConfigLoaderOptions;
	private valuePromises: Record<string, Promise<string | undefined> | undefined> = {};
	public constructor(options: Partial<DockerSecretsConfigLoaderOptions> = {}) {
		super();
		this.options = {fileLowerCase: false, path: '/run/secrets', isSilent: true, ...options};
	}

	protected async handleLoader(rootKey: string, key?: string): Promise<LoaderValue> {
		const targetKey = key || rootKey;
		const filePath = this.filePath(targetKey);
		if (!this.valuePromises[targetKey]) {
			if (!fs.existsSync(filePath)) {
				if (!this.options.isSilent) {
					throw new Error(`ConfigVariables[docker-secrets]: ${key} from ${filePath} not found`);
				}
				this.valuePromises[targetKey] = Promise.resolve(undefined);
			} else {
				this.valuePromises[targetKey] = fs.promises.readFile(filePath, 'utf8');
			}
		}
		const value = await this.valuePromises[targetKey];
		return {value, path: filePath};
	}

	private filePath(key: string): string {
		return path.join(path.resolve(this.options.path), this.options.fileLowerCase ? key.toLowerCase() : key);
	}
}
