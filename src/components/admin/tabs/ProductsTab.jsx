import React, { useState } from 'react';

const ProductsTab = ({ products, isInitialLoading, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Delete ${selectedIds.length} products?`)) return;
    selectedIds.forEach(id => onDeleteProduct(id));
    setSelectedIds([]);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b' }}>Products ({products.length})</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none',
              padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}>
              🗑️ Delete ({selectedIds.length})
            </button>
          )}
          <button onClick={onAddProduct} style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search products..."
          style={{
            flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
            fontSize: '14px', outline: 'none', color: '#1e293b'
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
            fontSize: '14px', color: '#1e293b', background: 'white', cursor: 'pointer', outline: 'none'
          }}
        >
          {categories.map((c, i) => (
            <option key={i} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {isInitialLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>No products found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '16px', width: '40px' }}>
                  <input type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </th>
                {['PRODUCT', 'CATEGORY', 'PRICE', 'STOCK', 'SALES', 'STATUS', 'ACTIONS'].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 6 ? 'right' : 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    background: selectedIds.includes(product.id) ? '#fef2f2' : hoveredRow === i ? '#f9fafb' : 'white',
                    transition: 'background 0.15s'
                  }}>
                  {/* Checkbox */}
                  <td style={{ padding: '16px' }}>
                    <input type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </td>
                  {/* Product with image + description */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={product.image || 'https://via.placeholder.com/48'}
                        alt={product.name}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb', flexShrink: 0 }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                      />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{product.name}</div>
                        {product.description && (
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>{product.category}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>${parseFloat(product.price).toFixed(2)}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#6b7280', fontWeight: product.stock < 10 ? 600 : 400 }}>
                    {product.stock} {product.stock === 0 ? '🔴' : product.stock < 10 ? '⚠️' : ''}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{product.sales || 0}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      background: product.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: product.status === 'active' ? '#065f46' : '#991b1b'
                    }}>
                      {product.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => onEditProduct(product)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '8px', fontSize: '18px', marginRight: '4px' }}>✏️</button>
                    <button onClick={() => onDeleteProduct(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', fontSize: '18px' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;