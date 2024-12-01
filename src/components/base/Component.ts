export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
  }
  // возвращает DOM-элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}