import Ajv from 'ajv';
import schema from '../../../../packages/w3c-dtfm/schema.json';
import { logger } from '../logger';

export function validate(data: unknown) {
  const ajv = new Ajv();
  ajv.addKeyword('example');
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    logger.error(validate.errors);
  }
  return valid;
}
