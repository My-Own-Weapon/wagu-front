export default abstract class ViewModel {
  constructor(props: unknown) {
    this.validateProps(props);
  }

  protected abstract validateProps(props: unknown): Error | unknown;
}
