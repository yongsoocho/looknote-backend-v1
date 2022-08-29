import * as zipper from 'zip-local';
import { join } from 'path';
import { logger } from '../winston/index';

export const zipLogs = async () => {
  try {
    zipper.zip(join(process.cwd(), 'logs'), function (error, zipped) {
      if (error) {
        return logger.error(error);
      }
      if (!error) {
        zipped.compress();

        zipped.save(join(process.cwd(), 'logs.zip'), function (error) {
          return logger.error(error);
        });
      }
    });
  } catch (error) {
    return logger.error(error);
  }
};
