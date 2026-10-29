import {Command} from './command.interface.js';
import {readFileSync} from 'node:fs';
import chalk from 'chalk';
import {logError} from "../../shared/helpers/index.js";

type PackageJSONConfig = {
  version: string;
};

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly path: string = './package.json',
  ) {
  }

  private readVersion() {
    const json = readFileSync(this.path, 'utf-8');
    const content: unknown = JSON.parse(json);

    if(!isPackageJSONConfig(content)) {
      throw new Error('Failed to parse and get version');
    }

    return content.version;
  }

  public getName(): string {
    return '--version';
  }

  public execute(..._parameters: string[]) {
    try {
      const version = this.readVersion();
      console.info(chalk.green(version));

    } catch(err) {
      logError(err, `Error execute file on the path ${this.path}`);
    }
  }
}
