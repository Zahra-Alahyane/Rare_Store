import React from 'react';

const EditProductModal = ({ editingProduct, setEditingProduct, onUpdate, onClose }) => {
  if (!editingProduct) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#1e293b' }}>Edit Product</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Product Name" value={editingProduct.name}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
            style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
            <option value="">Select Category</option>
            <option value="dresses">Dresses</option>
            <option value="jackets">Jackets</option>
            <option value="accessories">Accessories</option>
            <option value="tops">Tops</option>
          </select>
          <input type="number" placeholder="Price" value={editingProduct.price}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          <input type="number" placeholder="Stock Quantity" value={editingProduct.stock}
            onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
            style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          <input type="text" placeholder="Image URL" value={editingProduct.image}
            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
            style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
          <textarea placeholder="Description" rows="4" value={editingProduct.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '12px', background: '#f3f4f6', border: 'none',
              borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#6b7280'
            }}>Cancel</button>
            <button onClick={onUpdate} style={{
              flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'white'
            }}>Update Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;