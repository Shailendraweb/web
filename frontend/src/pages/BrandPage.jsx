import { useState } from 'react'
import BrandForm from '../components/BrandForm'
import BrandList from '../components/BrandList'
import '../styles/forms.css'

export function BrandPage() {
  const [editingBrand, setEditingBrand] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAdd = () => {
    setEditingBrand(null)
    setShowForm(true)
  }

  const handleEdit = (brand) => {
    setEditingBrand(brand)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingBrand(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBrand(null)
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Brands</h1>
        <p>Manage product brands</p>
      </div>

      <div className="page-content">
        <div className="content-grid">
          {/* List Section */}
          <div className="list-section">
            <div className="section-header">
              <h2>All Brands</h2>
              {!showForm && (
                <button className="btn-primary" onClick={handleAdd}>
                  + Add Brand
                </button>
              )}
            </div>
            <BrandList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="form-section">
              <div className="section-header">
                <h2>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
              </div>
              <BrandForm
                initialData={editingBrand}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrandPage
