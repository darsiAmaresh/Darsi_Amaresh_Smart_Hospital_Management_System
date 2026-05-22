import { useState, useMemo } from 'react';
import { Package, Receipt, DollarSign, TrendingDown } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { RevenueChart } from '../../components/ui/Charts';
import { revenueData } from '../../data/seedData';
import { StatCard } from '../../components/ui/StatCard';

export default function PharmacyBilling() {
  const { state, dispatch } = useHospital();
  const { toast } = useToast();
  const [tab, setTab] = useState('inventory');
  const [invoiceModal, setInvoiceModal] = useState(null);

  const stats = useMemo(() => ({
    totalRevenue: state.bills.reduce((s, b) => s + b.total, 0),
    paid: state.bills.filter((b) => b.status === 'paid').reduce((s, b) => s + b.total, 0),
    pending: state.bills.filter((b) => b.status === 'pending').length,
    lowStock: state.medicines.filter((m) => m.stock < 100).length,
  }), [state]);

  const updatePayment = (billId, status) => {
    dispatch({ type: 'UPDATE_BILL', payload: { id: billId, status, method: status === 'paid' ? 'Card' : null } });
    toast(`Payment marked as ${status}`, 'success');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pharmacy & Billing</h1>
        <p>Inventory, invoices & revenue tracking</p>
      </div>

      <div className="stats-grid stats-grid-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="success" />
        <StatCard icon={Receipt} label="Collected" value={`$${stats.paid.toLocaleString()}`} color="primary" />
        <StatCard icon={Package} label="Low Stock Items" value={stats.lowStock} color="warning" />
        <StatCard icon={TrendingDown} label="Pending Bills" value={stats.pending} color="danger" />
      </div>

      <div className="tabs">
        <button className={tab === 'inventory' ? 'active' : ''} onClick={() => setTab('inventory')}>Medicine Inventory</button>
        <button className={tab === 'billing' ? 'active' : ''} onClick={() => setTab('billing')}>Billing</button>
        <button className={tab === 'reports' ? 'active' : ''} onClick={() => setTab('reports')}>Revenue Reports</button>
      </div>

      {tab === 'inventory' && (
        <div className="card table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Medicine</th><th>Category</th><th>Stock</th><th>Unit</th><th>Price</th><th>Expiry</th><th>Supplier</th></tr>
              </thead>
              <tbody>
                {state.medicines.map((m) => (
                  <tr key={m.id} className={m.stock < 100 ? 'low-stock' : ''}>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.category}</td>
                    <td><span className={m.stock < 100 ? 'text-danger' : ''}>{m.stock}</span></td>
                    <td>{m.unit}</td>
                    <td>${m.price}</td>
                    <td>{m.expiry}</td>
                    <td>{m.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="card table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Total</th><th>Status</th><th>Payment</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {state.bills.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.patientName}</td>
                    <td>{b.date}</td>
                    <td>${b.total.toLocaleString()}</td>
                    <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                    <td>{b.method || '—'}</td>
                    <td className="actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => setInvoiceModal(b)}>View Invoice</button>
                      {b.status !== 'paid' && (
                        <button className="btn btn-sm btn-primary" onClick={() => updatePayment(b.id, 'paid')}>Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="card chart-card">
          <h3>Revenue vs Expenses</h3>
          <RevenueChart data={revenueData} />
          <div className="expense-summary">
            <h4>Expense Analytics</h4>
            <ul>
              <li><span>Staff Salaries</span><strong>$85,000</strong></li>
              <li><span>Medical Supplies</span><strong>$32,000</strong></li>
              <li><span>Equipment Maintenance</span><strong>$15,000</strong></li>
              <li><span>Utilities</span><strong>$10,000</strong></li>
            </ul>
          </div>
        </div>
      )}

      <Modal isOpen={!!invoiceModal} onClose={() => setInvoiceModal(null)} title="Invoice" size="md">
        {invoiceModal && (
          <div className="invoice">
            <div className="invoice-header">
              <h2>SmartCare Hospital</h2>
              <p>Invoice #{invoiceModal.id}</p>
              <p>Date: {invoiceModal.date}</p>
            </div>
            <p><strong>Patient:</strong> {invoiceModal.patientName}</p>
            <table className="invoice-items">
              <thead><tr><th>Item</th><th>Amount</th></tr></thead>
              <tbody>
                {invoiceModal.items.map((item, i) => (
                  <tr key={i}><td>{item.name}</td><td>${item.amount}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td><strong>Total</strong></td><td><strong>${invoiceModal.total}</strong></td></tr>
              </tfoot>
            </table>
            <p>Status: <span className={`status-badge ${invoiceModal.status}`}>{invoiceModal.status}</span></p>
            <button className="btn btn-primary" onClick={() => { toast('Invoice sent to printer (simulated)', 'info'); setInvoiceModal(null); }}>
              Print Invoice
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
