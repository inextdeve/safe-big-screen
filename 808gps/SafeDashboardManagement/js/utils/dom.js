class HtmlElement {
  constructor(elementName, attributes = {}, ...children) {
    const EVENTS = ["click"];

    this.element = document.createElement(elementName);

    Object.keys(attributes).forEach((attributeName) => {
      if (EVENTS.includes(attributeName)) {
        this.element.addEventListener(attributeName, attributes[attributeName]);
        return;
      }
      this.element.setAttribute(attributeName, attributes[attributeName]);
    });

    this.element.append(...children);
  }

  add() {
    console.log(this.element);
    return this.element;
  }
  remove() {
    this.element.remove();
  }
}

export { HtmlElement };
