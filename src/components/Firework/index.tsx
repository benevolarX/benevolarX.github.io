//import Styles from './styles.module.scss';

import { FireworkManager } from "./fireworkManager";

function Firework(props: { children: any }) {
 const firework = FireworkManager.create({
  opacity: 0.9,
  width: 1248,
  height: 768,
  speed: 100,
  max_rocket: 100,
  max_luminosite: 8,
  classNames: 'demo',
  sound: []
 });
 /*
 if (main !== null) {
  firework.attach(main);
  firework.start();
 }*/
 return <div>{props.children}</div>;
}

export default Firework;