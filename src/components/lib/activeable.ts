import Component from "./recordable";
abstract class Activeable extends Component {
  constructor(...args: any) {
    super(...args);
  }
  abstract onActive(): void;
  abstract onDeActive(): void;
}
export default Activeable;
