import Styles from './styles.module.scss';
import type { MarkdownInstance } from 'astro'

function ArticleBlog(props: { project: MarkdownInstance<Record<string, any>> }) {
 const { frontmatter } = props.project;
 return (
  <div class={Styles.card}>
   <h1>{frontmatter.title}</h1>
   <div>
    <p>{frontmatter.description}</p>
    <div>
     Tagged:
     {frontmatter.tags.map((t: string) => (
      <div data-tag={t}>
       {t}
      </div>
     ))}
    </div>
    <a href={props.project.url}>
     <span>View</span>
    </a>
   </div>
  </div>
 );
}

export default ArticleBlog;
