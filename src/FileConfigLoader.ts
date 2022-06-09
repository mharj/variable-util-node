import * as fs from 'fs';
import {ConfigLoader, LoaderValue} from '@avanio/variable-util/dist/loaders';

export interface FileConfigLoaderOptions {
	fileName: string;
	type: 'json';
	/** set to false if need errors */
	isSilent?: boolean;
}

export class FileConfigLoader extends ConfigLoader<string | undefined> {
	public type = 'file';
	private options: FileConfigLoaderOptions;
	private filePromise: Promise<Record<string, string | undefined>> | undefined;

	public constructor(options: FileConfigLoaderOptions) {
		super();
		this.options = {isSilent: true, ...options};
	}

	public async reload(): Promise<void> {
		this.filePromise = this.loadFile();
		await this.filePromise;
	}

	public isLoaded(): boolean {
		return this.filePromise !== undefined;
	}

	protected async handleLoader(rootKey: string, key?: string): Promise<LoaderValue> {
		if (!this.filePromise) {
			this.filePromise = this.loadFile();
		}
		const data = await this.filePromise;
		const targetKey = key || rootKey;
		return {value: data[targetKey], path: this.options.fileName};
	}

	private async loadFile(): Promise<Record<string, string | undefined>> {
		if (!fs.existsSync(this.options.fileName)) {
			if (this.options.isSilent) {
				return {};
			}
			throw new Error(`ConfigVariables[file]: file ${this.options.fileName} not found`);
		}
		return JSON.parse(await fs.promises.readFile(this.options.fileName, 'utf8'));
	}
}
