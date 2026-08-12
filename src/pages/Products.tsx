import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit2, Trash2, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product } from '../types';

const categories = [
  { value: '', label: 'Alle' },
  { value: 'rings', label: 'Ringe' },
  { value: 'necklaces', label: 'Ketten' },
  { value: 'earrings', label: 'Ohrringe' },
  { value: 'bracelets', label: 'Armbänder' },
  { value: 'watches', label: 'Uhren' },
];

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (formData: FormData) => {
    const productData = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as Product['category'],
      material: formData.get('material') as string,
      stock: parseInt(formData.get('stock') as string),
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      featured: formData.get('featured') === 'on',
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">Kollektion</h1>
          <p className="text-neutral-400 text-sm mt-1">{products.length} Produkte</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Hinzufügen
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm transition-shadow"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:shadow-neutral-100 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.featured && (
                <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Featured
                </span>
              )}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <MoreHorizontal className="w-4 h-4 text-neutral-600" />
                </button>
                {activeMenu === product.id && (
                  <div className="absolute top-10 right-0 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 min-w-[140px] z-10">
                    <button
                      onClick={() => { setEditingProduct(product); setShowModal(true); setActiveMenu(null); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => { deleteProduct(product.id); setActiveMenu(null); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Löschen
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{product.material}</p>
              <h3 className="font-medium text-neutral-900 mb-3">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-neutral-900">
                  €{product.price.toLocaleString('de-DE')}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.stock < 5 
                    ? 'text-rose-600 bg-rose-50' 
                    : 'text-neutral-500 bg-neutral-100'
                }`}>
                  {product.stock} Stk.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400">Keine Produkte gefunden</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }}>
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {editingProduct ? 'Bearbeiten' : 'Neues Produkt'}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingProduct(null); }}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
                  <input
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Beschreibung</label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Preis (€)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bestand</label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={editingProduct?.stock || 0}
                      required
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kategorie</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'rings'}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Material</label>
                  <input
                    name="material"
                    defaultValue={editingProduct?.material}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Bild URL</label>
                  <input
                    name="image"
                    defaultValue={editingProduct?.image}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm transition-all"
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    name="featured"
                    type="checkbox"
                    defaultChecked={editingProduct?.featured}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-sm text-neutral-600">Als Featured markieren</span>
                </label>
              </div>
              <div className="p-5 border-t border-neutral-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingProduct(null); }}
                  className="px-5 py-2.5 text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 text-sm font-medium transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
