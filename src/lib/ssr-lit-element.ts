import { LitElement } from "lit";

export abstract class SsrLitElement extends LitElement {
  public abstract render();
}
