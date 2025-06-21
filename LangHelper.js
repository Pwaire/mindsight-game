export class LangHelper {
  static getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || 'en'; // default to 'en' if missing
  }
}

// Usage
const currentLang = LangHelper.getLangFromURL();
console.log("Current language:", currentLang);
