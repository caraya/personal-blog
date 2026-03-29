import { LitElement, html, css } from 'lit';
export class SearchForm extends LitElement {
    static { this.styles = css `
    :host {
      display: block;
    }
    form {
      display: flex;
      gap: 8px;
    }
    input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      border: none;
      background-color: #4285f4;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #357ae8;
    }
  `; }
    static { this.properties = {
        searchPageUrl: { type: String, attribute: 'search-page-url' },
    }; }
    constructor() {
        super();
        this.searchPageUrl = '/search.html';
    }
    _handleSearch(event) {
        event.preventDefault();
        const form = event.target;
        const input = form.querySelector('input');
        const query = input?.value.trim();
        if (query) {
            window.location.href = `${this.searchPageUrl}?q=${encodeURIComponent(query)}`;
        }
    }
    render() {
        return html `
      <form @submit=${this._handleSearch.bind(this)}>
        <input type="search" placeholder="Search this site..." />
        <button type="submit">Search</button>
      </form>
    `;
    }
}
customElements.define('search-form', SearchForm);
