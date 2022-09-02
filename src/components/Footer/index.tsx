import Styles from './styles.module.scss';

function Footer() {
	return (
		<footer class={Styles.footer}>
			&copy; {new Date().getFullYear()} benevolarX (auffret)
			<small class={Styles.byline}>🚀 généré par Astro</small>
		</footer>
	);
}
export default Footer;
