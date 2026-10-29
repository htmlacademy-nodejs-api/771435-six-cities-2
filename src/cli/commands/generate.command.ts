import {Command} from './command.interface.js';
import {MockServerData} from '../../shared/types/index.js';
import got from 'got';
import {TsvOfferGenerate} from '../../shared/libs/offer-generator/index.js';
import {appendFile} from 'node:fs/promises';
import {TSVFileWriter} from '../../shared/libs/file-writer/index.js';
import {logError} from '../../shared/helpers/index.js';

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

  private validateCount(num: unknown) {
    if((typeof num !== 'number' || Number.isNaN(num)) && !(num instanceof Error)) {
      throw new Error(`Count should be a number. Current count - ${num}`);
    } else if (num instanceof Error) {
      logError(num, num.message);
    } else if(num === 0) {
      throw new Error(`Count cant be zero (0). Current count - ${num}`);
    } else if (num < 0) {
      throw new Error(`Count cant be below zero (0). Current count - ${num}`);
    }else if (num > 1000) {
      throw new Error('Count more then 1000. Please, use count less then 1000');
    }
  }

  private validateString(path:unknown, name: string) {
    if(typeof path !== 'string') {
      throw new Error(`Argument ${name}, should be a string. Current path - ${path}`);
    } else if (path.length < 3) {
      throw new Error(`Argument ${name}, should be more then 3 symbols.Current path - ${path}`);
    }
  }

  private validate(count:unknown, path: unknown, url: unknown) {
    this.validateCount(count);
    this.validateString(path, 'path');
    this.validateString(url, 'url');
  }

  getName(): string {
    return '--generate';
  }

  async execute(..._parameters: string[]) {
    const [count, path, url] = _parameters;
    const offerCount = Number.parseInt(count, 10);

    this.validate(offerCount, path, url);

    try {
      await this.load(url);
      await this.write(path, offerCount);
      console.info(`File ${path} was created!`);
    } catch (e) {
      logError(e, 'Cant generate data');
    }
  }
}
