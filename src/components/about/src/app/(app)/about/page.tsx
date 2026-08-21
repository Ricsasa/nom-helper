import { AboutView } from '@/components/about/about-view';

/**
 * The screen behind both notice links. The (app) layout has already redirected
 * an anonymous visitor and set the language for the tree, so the page itself
 * has nothing to resolve: it renders the view.
 */
export default function AboutPage() {
  return <AboutView />;
}
