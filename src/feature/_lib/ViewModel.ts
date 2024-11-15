import { z } from 'zod';

export default abstract class ViewModel<T> {
  constructor(props: T) {
    this.validateProps(props);
  }

  protected abstract validateProps(props: T): T | z.ZodError;
}
