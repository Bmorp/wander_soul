import { Component } from 'react';
import { site } from '../data/site';

// Keeps a broken section from taking the whole site down.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="page-hero page-hero--md">
        <div className="wrap page-hero-body">
          <h1 className="t-hero display">Something went wrong</h1>
          <p className="t-lead">Please refresh the page. If it keeps happening, message us on WhatsApp at {site.phoneDisplay}.</p>
          <div className="cta-row">
            <a className="btn btn-gold" href="/">
              Back to the home page
            </a>
          </div>
        </div>
      </section>
    );
  }
}
