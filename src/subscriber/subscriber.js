/** Abstract Subscriber facade */
class Subscriber {
  constructor() {
    if (this.constructor === Subscriber) {
      throw new TypeError('Abstract class "Subscriber" cannot be instantiated directly.');
    }
  }

  subclassResponsibility() {
    throw new Error(`${this.constructor}:subclass responsibility`);
  }

  // private methods
  _onConnect() {
    this.subclassResponsibility();
  }

  _onMessage() {
    this.subclassResponsibility();
  }

  _onExit() {
    this.subclassResponsibility();
  }

  // public methods
  init() {
    this.subclassResponsibility();
  }
}

module.exports = Subscriber;
