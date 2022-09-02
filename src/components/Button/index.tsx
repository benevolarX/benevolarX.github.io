import Styles from './styles.module.scss';

function Button(props: { children: any }) {
	return <span class={Styles.button}>{props.children}</span>;
}

export default Button;
