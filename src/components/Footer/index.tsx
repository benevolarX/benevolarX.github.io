import Styles from './styles.module.scss';

function Footer() {
	return (
		<footer class={Styles.footer}>
			&copy; {new Date().getFullYear()} Jeanine White
			<small class={Styles.byline}>🚀 Built by Astro</small>
		</footer>
	);
}
export default Footer;
