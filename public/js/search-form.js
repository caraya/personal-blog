import { LitElement, html, css } from '/vendor/lit-v331-core.min.js';

export class PagefindSearchForm extends LitElement {
    static { this.styles = css `
    form {
      display: flex;
      gap: 8px;
    }
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      border: none;
      background: #4285f4;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #357ae8;
    }
  `; }
    render() {
        return html `
      <form @submit=${this._onSubmit}>
        <input type="search" name="q" placeholder="Search this site..." />
        <button type="submit">Search</button>
      </form>
    `;
    }
    _onSubmit(e) {
      e.preventDefault();
      const input = this.renderRoot.querySelector('input[name="q"]');
      const query = input?.value.trim();
      if (query) {
        // Redirect to /search.html?q=QUERY (absolute path)
        window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
      }
    }
}
customElements.define('search-form', PagefindSearchForm);
