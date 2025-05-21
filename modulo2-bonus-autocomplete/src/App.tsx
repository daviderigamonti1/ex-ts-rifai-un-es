// 🎯 Bonus
// Scegli un esercizio tra Carrello della Spesa, Lista di Politici, Autocomplete e Web Developer Signup del Modulo 2 – Advanced React e riscrivilo in React + TypeScript.
// Tipizza:
// le props dei componenti
// eventuali hook (useState, useReducer, useRef, useContext)
// Avvia il progetto e verifica che tutte le tipizzazioni siano corrette.

import { useEffect, useState, useCallback } from 'react';

function debounce<T>(
  callback: (value: T) => void,
  delay: number
): (value: T) => void {
  let timer: number;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay)
  };
};

type Product = {
  id: number,
  name: string,
  description: string,
  image: string,
  price: number
}

function isProduct(data: unknown): data is Product {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "name" in data && typeof data.name === "string" &&
    "description" in data && typeof data.description === "string" &&
    "image" in data && typeof data.image === "string" &&
    "price" in data && typeof data.price === "number"
  )
}

function App() {

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3333/products?search=${query}`);
      if (!res.ok) {
        throw new Error(`Errore HTTP ${res.status}: ${res.statusText}`)
      }
      const data: Product[] = await res.json();
      if (!(data instanceof Array)) {
        throw new Error("Non è un array!");
      }
      setSuggestions(data);
      console.log('API');
    } catch (err) {
      if (err instanceof Error) {
        console.error("Errore durante il recupero dei prodotti");
      } else {
        console.error("Errore sconosciuto:", err);
      }
    }
  }

  const debouncedFetchProducts = useCallback(
    debounce<string>(fetchProducts, 500)
    , []);

  useEffect(() => {
    debouncedFetchProducts(query);
  }, [query]);

  const fetchProductsDetails = async (id: number): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:3333/products/${id}`);
      if (!res.ok) {
        throw new Error(`Errore HTTP ${res.status}: ${res.statusText}`)
      }
      const data: Product = await res.json();
      if (!isProduct(data)) {
        throw new Error("Formato dei dati non valido");
      }
      setSelectedProduct(data);
      setQuery("");
      setSuggestions([]);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Errore durante il recupero del prodotto");
      } else {
        console.error("Errore sconosciuto:", err);
      }
    }
  }

  return (
    <>
      <h1>Autocomplete</h1>
      <input type="text"
        placeholder='Cerca un prodotto...'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className='dropdown'>
          {suggestions.map((product) => (
            <p key={product.id} onClick={() => fetchProductsDetails(product.id)}>{product.name}</p>
          ))}
        </div>
      )}
      {selectedProduct && (
        <div className="card">
          <h2>{selectedProduct.name}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <p>{selectedProduct.description}</p>
          <p><strong>Prezzo:</strong> {selectedProduct.price}€</p>
        </div>
      )}
    </>
  )
}

export default App;
