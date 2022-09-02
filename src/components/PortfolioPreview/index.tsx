import Styles from './styles.module.scss';
import type { MarkdownInstance } from 'astro'

function PortfolioPreview(props: { project: MarkdownInstance<Record<string, any>> }) {
	const { frontmatter } = props.project;
	return (
		<div class={Styles.card}>
			<div class={Styles.titleCard} style={`background-image:url(${frontmatter.img})`}>
				<h1 class={Styles.title}>{frontmatter.title}</h1>
			</div>
			<div class="pa3">
				<p class={`${Styles.desc} mt0 mb2`}>{frontmatter.description}</p>
				<div class={Styles.tags}>
					Tagged:
					{frontmatter.tags.map((t: string) => (
						<div class={Styles.tag} data-tag={t}>
							{t}
						</div>
					))}
				</div>
				<a class={Styles.link} href={props.project.url}>
					<span class={Styles.linkInner}>View</span>
				</a>
			</div>
		</div>
	);
}

export default PortfolioPreview;
