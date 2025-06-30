import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class SearchForm extends LitElement {
  static styles = css`
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
  `;

  // --- Properties ---
  // 'searchPageUrl' is the URL of your search results page.
  static properties = {
    searchPageUrl: { type: String, attribute: 'search-page-url' },
  };

  constructor() {
    super();
    this.searchPageUrl = '/search.html'; // Default search page URL
  }

  // --- Event Handler ---
  // This function is called when the form is submitted.
  _handleSearch(event) {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('input');
    const query = input.value.trim();

    if (query) {
      // --- Redirect to Search Page ---
      // We append the search query to the URL.
      window.location.href = `${this.searchPageUrl}?q=${encodeURIComponent(query)}`;
    }
  }

  // --- Render Method ---
  render() {
    return html`
      <form @submit=${this._handleSearch}>
        <input type="search" placeholder="Search this site..." />
        <button type="submit">Search</button>
      </form>
    `;
  }
}

// --- Define Custom Element ---
customElements.define('search-form', SearchForm);
