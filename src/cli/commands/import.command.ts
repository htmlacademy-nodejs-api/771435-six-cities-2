import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/index.js';
import {createOffer, logError} from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  async execute(..._parameters: string[]): Promise<void> {
    const [path] = _parameters;
    const fileReader = new TsvFileReader(path.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      logError(error, `Can't import data from file: ${path}`);
    }
  }
}
