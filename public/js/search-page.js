import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class SearchPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .search-box {
        margin-bottom: 2rem;
    }
    form {
      display: flex;
      gap: 8px;
    }
    input {
      flex-grow: 1;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      padding: 12px 24px;
      border: none;
      background-color: #4285f4;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover {
      background-color: #357ae8;
    }
    .results-info {
        color: #5f6368;
        margin-bottom: 1.5rem;
    }
    .result-item {
      margin-bottom: 1.5rem;
    }
    .result-item a {
      font-size: 1.25rem;
      color: #1a0dab;
      text-decoration: none;
    }
    .result-item a:hover {
      text-decoration: underline;
    }
    .result-item .link {
        font-size: 0.875rem;
        color: #006621;
    }
    .result-item .snippet {
        color: #4d5156;
    }
    .loading, .error, .no-results {
        margin-top: 1rem;
        color: #5f6368;
    }
    .error {
        color: #d93025; 
    }
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #ebebeb;
    }
    .pagination button {
      background-color: #f8f9fa;
      color: #3c4043;
      border: 1px solid #dadce0;
      padding: 8px 16px;
    }
    .pagination button:hover {
      background-color: #f1f3f4;
    }
    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .page-info {
      color: #5f6368;
      font-size: 0.875rem;
    }
  `;

  static properties = {
    _query: { type: String, state: true },
    _results: { type: Array, state: true },
    _loading: { type: Boolean, state: true },
    _error: { type: String, state: true },
    _apiResponse: { type: Object, state: true },
    _hasSearched: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._query = '';
    this._results = [];
    this._loading = false;
    this._error = null;
    this._apiResponse = null;
    this._hasSearched = false;
    this._handleLocationChange = this._handleLocationChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._handleLocationChange);
    this._handleLocationChange(); // Initial check of the URL
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this._handleLocationChange);
  }

  _handleLocationChange() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const start = parseInt(params.get('start') || '1', 10);
    
    // Only perform a search if the query exists and is different from the current one,
    // or if the start index has changed.
    const requestInfo = this._apiResponse?.queries?.request?.[0];
    if (query && (query !== this._query || start !== requestInfo?.startIndex)) {
      this._query = query;
      this._performSearch(query, start);
    }
  }

  async _performSearch(query, startIndex = 1) {
    if (!query) return;

    this._loading = true;
    this._error = null;
    this._hasSearched = true;
    this.renderRoot.querySelector('.search-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      // Add { cache: 'no-cache' } to prevent browser from serving stale results
      const response = await fetch(`/.netlify/functions/google-search?q=${encodeURIComponent(query)}&start=${startIndex}`, {
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        let errorMsg = `Server responded with status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error?.message) {
             errorMsg = errorData.error.message;
          }
        } catch (e) {
          console.error("Could not parse error response from server.", e);
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('Data received from search function:', data);

      if (data.error) {
        throw new Error(`Google API Error: ${data.error.message}`);
      }
      
      this._apiResponse = data;
      this._results = data.items || [];
      this.requestUpdate(); // Ensure the component re-renders with new data

    } catch (error) {
      this._error = error.message;
      this._results = [];
      this._apiResponse = null;
      console.error('Search error:', error);
      this.requestUpdate(); // Also re-render on error
    } finally {
      this._loading = false;
    }
  }

  _updateUrl(query, startIndex) {
    const url = new URL(window.location);
    url.searchParams.set('q', query);
    url.searchParams.set('start', String(startIndex));
    // This updates the URL and triggers the 'popstate' listener via _handleLocationChange
    history.pushState({ path: url.href }, '', url.href);
    this._handleLocationChange();
  }
  
  _handleSearchSubmit(event) {
      event.preventDefault();
      const form = event.target;
      const input = form.querySelector('input');
      const query = input.value.trim();
      this._updateUrl(query, 1);
  }

  _handleNextPage() {
    const nextPage = this._apiResponse?.queries?.nextPage?.[0];
    if (!nextPage) return;
    this._updateUrl(this._query, nextPage.startIndex);
  }

  _handlePrevPage() {
    const previousPage = this._apiResponse?.queries?.previousPage?.[0];
    if (!previousPage) return;
    this._updateUrl(this._query, previousPage.startIndex);
  }

  render() {
    const requestInfo = this._apiResponse?.queries?.request?.[0];
    const searchInfo = this._apiResponse?.searchInformation;
    const hasNextPage = this._apiResponse?.queries?.nextPage;
    const hasPrevPage = this._apiResponse?.queries?.previousPage;
    
    const showNoResults = this._hasSearched && !this._loading && !this._error && this._results.length === 0;
    const currentPage = requestInfo ? Math.floor(requestInfo.startIndex / 10) + 1 : 1;

    return html`
      <div class="search-box">
        <form @submit=${this._handleSearchSubmit}>
          <input type="search" .value=${this._query} placeholder="Enter your search query...">
          <button type="submit">Search</button>
        </form>
      </div>

      ${this._loading ? html`<div class="loading">Loading...</div>` : ''}
      ${this._error ? html`<div class="error">${this._error}</div>` : ''}
      ${showNoResults ? html`<div class="no-results">No results found for "${this._query}".</div>` : ''}
      
      ${searchInfo ? html`
        <div class="results-info">
            About ${searchInfo.formattedTotalResults} results (${searchInfo.formattedSearchTime} seconds)
        </div>
      ` : ''}

      <div class="results">
        ${this._results.map(item => html`
          <div class="result-item">
            <a href=${item.link}>${item.htmlTitle || item.title}</a>
            <div class="link">${item.formattedUrl}</div>
            <div class="snippet">${item.htmlSnippet || item.snippet}</div>
          </div>
        `)}
      </div>

      ${this._results.length > 0 ? html`
        <div class="pagination">
          <button @click=${this._handlePrevPage} ?disabled=${!hasPrevPage}>
            &larr; Previous
          </button>
          <span class="page-info">
            Page ${currentPage}
          </span>
          <button @click=${this._handleNextPage} ?disabled=${!hasNextPage}>
            Next &rarr;
          </button>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('search-page', SearchPage);
