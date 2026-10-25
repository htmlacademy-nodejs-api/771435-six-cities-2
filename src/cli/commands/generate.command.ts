import {Command} from './command.interface.js';
import {MockServerData} from '../../shared/types/index.js';
import got from 'got';
import {TsvOfferGenerate} from '../../shared/libs/offer-generator/index.js';
import {appendFile} from 'node:fs/promises';
import {TSVFileWriter} from '../../shared/libs/file-writer/index.js';
import {getErrorMessage} from '../../shared/helpers/index.js';

export class GenerateCommand implements Command {
  private initData: MockServerData;

  private async load(url: string) {
    try {
      this.initData = await got.get(url).json();
    } catch {
      throw new Error(`Cant load data from ${url}`);
    }
  }

  private async write(path:string, count: number) {
    const generator = new TsvOfferGenerate(this.initData);
    const writer = new TSVFileWriter(path);

    for (let i = 0; i < count; i++) {
      await writer.write(generator.generate());
      await appendFile(path, `${generator.generate()}\n`, {encoding: 'utf8'});
    }
  }

  getName(): string {
    return '--generate';
  }

  async execute(..._parameters: string[]) {
    const [count, path, url] = _parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(path, offerCount);
      console.info(`File ${path} was created!`);
    } catch (e) {
      console.error('Cant generate data');

      if(e instanceof Error) {
        console.error('Cant generate data');
        console.error(getErrorMessage(e));
      }
    }
  }
}
