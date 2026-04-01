import { LitElement, html, css } from '/vendor/lit-v331-core.min.js';
export class PagefindSearchResults extends LitElement {
    static { this.styles = css `
    .results {
      margin-top: 1.5rem;
    }
    .result-item {
      margin-bottom: 1.5rem;
    }
    .result-item a {
      font-size: 1.1rem;
      color: #1a0dab;
      text-decoration: none;
    }
    .result-item a:hover {
      text-decoration: underline;
    }
    .snippet {
      color: #4d5156;
    }
    .loading, .error, .no-results {
      margin-top: 1rem;
      color: #5f6368;
    }
    .error {
      color: #d93025;
    }
    .load-more-container {
      margin-top: 2rem;
      text-align: center;
      padding-bottom: 2rem;
    }
    .load-more {
      background-color: #f8f9fa;
      border: 1px solid #dadce0;
      border-radius: 4px;
      color: #3c4043;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      padding: 8px 24px;
      transition: background-color 0.2s;
    }
    .load-more:hover:not(:disabled) {
      background-color: #f1f3f4;
      border-color: #bdc1c6;
    }
    .load-more:disabled {
      color: #9aa0a6;
      cursor: not-allowed;
    }
  `; }
    static { this.properties = {
        query: { type: String },
        results: { type: Array },
        allResults: { type: Array },
        loading: { type: Boolean },
        loadingMore: { type: Boolean },
        error: { type: String },
    }; }
    constructor() {
        super(...arguments);
        this.query = '';
        this.results = [];
        this.allResults = [];
        this.loading = false;
        this.loadingMore = false;
        this.error = null;
    }
    connectedCallback() {
        super.connectedCallback();
        // Read 'q' parameter from URL
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || '';
        if (q && q !== this.query) {
            this.query = q;
        }
    }
    updated(changed) {
        if (changed.has('query') && this.query) {
            this._search(this.query);
        }
    }
    async _search(query) {
        this.loading = true;
        this.error = null;
        this.results = [];
        this.allResults = [];
        try {
            // Dynamic import of pagefind
            const pagefind = await import('/pagefind/pagefind.js');
            if (!pagefind) {
                throw new Error('Pagefind not found. Make sure it is indexed and /pagefind/pagefind.js exists.');
            }
            // Set the base path to /pagefind/ explicitly if options is available
            if (pagefind.options) {
                await pagefind.options({ basePath: '/pagefind/' });
            }
            const res = await pagefind.search(query);
            this.allResults = res.results;
            // Await the data for the top 10 results (Pagefind returns placeholders by default)
            this.results = await Promise.all(this.allResults.slice(0, 10).map(r => r.data()));
        }
        catch (e) {
            this.error = e.message || 'Search failed';
            console.error('Pagefind error:', e);
        }
        finally {
            this.loading = false;
        }
    }
    async _loadMore() {
        if (this.loadingMore || this.results.length >= this.allResults.length)
            return;
        this.loadingMore = true;
        try {
            const nextIndex = this.results.length;
            const nextBatch = this.allResults.slice(nextIndex, nextIndex + 10);
            const newData = await Promise.all(nextBatch.map(r => r.data()));
            this.results = [...this.results, ...newData];
        }
        catch (e) {
            console.error('Error loading more results:', e);
        }
        finally {
            this.loadingMore = false;
        }
    }
    render() {
        if (this.loading)
            return html `<div class="loading">Loading...</div>`;
        if (this.error)
            return html `<div class="error">${this.error}</div>`;
        if (!this.query)
            return html ``;
        if (this.results.length === 0)
            return html `<div class="no-results">No results found for "${this.query}".</div>`;
        const hasMore = this.results.length < this.allResults.length;
        return html `
      <div class="results">
        ${this.results.map(item => html `
          <div class="result-item">
            <a href="${item.url}">${item.meta?.title || item.url}</a>
            <div class="snippet">${item.excerpt || ''}</div>
          </div>
        `)}
      </div>

      ${hasMore ? html `
        <div class="load-more-container">
          <button 
            class="load-more" 
            @click="${this._loadMore}" 
            ?disabled="${this.loadingMore}"
          >
            ${this.loadingMore ? 'Loading more...' : `Load more (${this.allResults.length - this.results.length} remaining)`}
          </button>
        </div>
      ` : ''}
    `;
    }
}
customElements.define('search-results', PagefindSearchResults);
