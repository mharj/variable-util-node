import * as path from 'path';
import {ConfigVariables} from '@avanio/variable-util';
import {expect} from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import {DockerSecretsConfigLoader, FileConfigLoader} from '../src';

const debugSpy = sinon.spy();
const infoSpy = sinon.spy();
const errorSpy = sinon.spy();
const warnSpy = sinon.spy();
const traceSpy = sinon.spy();

describe('config variable', () => {
	beforeEach(() => {
		debugSpy.resetHistory();
		infoSpy.resetHistory();
		errorSpy.resetHistory();
		warnSpy.resetHistory();
		traceSpy.resetHistory();
	});
	it('should return file variable value', async function () {
		const configVar = new ConfigVariables([new FileConfigLoader({fileName: './test/testSettings.json', isSilent: false, type: 'json'})], {
			logger: {
				info: infoSpy,
				debug: debugSpy,
				error: errorSpy,
				warn: warnSpy,
				trace: traceSpy,
			},
		});
		expect(await configVar.get('SETTINGS_VARIABLE1', undefined, {showValue: true})).to.be.eq('settings_file');
		expect(infoSpy.getCall(0).args[0]).to.be.eq(`ConfigVariables[file]: SETTINGS_VARIABLE1 [settings_file] from ./test/testSettings.json`);
	});
	it('should return docker secret value force lowercase key', async function () {
		const configVar = new ConfigVariables([new DockerSecretsConfigLoader({path: './test', isSilent: false, fileLowerCase: true})], {
			logger: {
				info: infoSpy,
				debug: debugSpy,
				error: errorSpy,
				warn: warnSpy,
				trace: traceSpy,
			},
		});
		expect(await configVar.get('DOCKERSECRET1', undefined, {showValue: true})).to.be.eq('docker_value');
		expect(infoSpy.getCall(0).args[0]).to.be.eq(
			`ConfigVariables[docker-secrets]: DOCKERSECRET1 [docker_value] from ${path.join(path.resolve('./test/'), 'dockersecret1')}`,
		);
	});
	it('should return docker secret value', async function () {
		const configVar = new ConfigVariables([new DockerSecretsConfigLoader({path: './test', isSilent: false})], {
			logger: {
				info: infoSpy,
				debug: debugSpy,
				error: errorSpy,
				warn: warnSpy,
				trace: traceSpy,
			},
		});
		expect(await configVar.get('dockersecret2', undefined, {showValue: true})).to.be.eq('docker_value');
		expect(infoSpy.getCall(0).args[0]).to.be.eq(
			`ConfigVariables[docker-secrets]: dockersecret2 [docker_value] from ${path.join(path.resolve('./test/'), 'dockersecret2')}`,
		);
	});
});
