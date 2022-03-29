import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { formatDate, handlerStatus } from './helpers';
import { Service } from './Service';
function App() {
  const [tenants, setTenantsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilter] = useState({
    order: 'name',
    tabs: 'all',
  });
  const getTenant = async () => {
    try {
      setLoading(false)
      const data = await Service.getTenants()
      if (!Array.isArray(data)) setTenantsList([])
      setTenantsList(data);
      setLoading(prevState => !prevState)
    } catch (error) {
      console.error('Error getting', error)
    }
  }

  useEffect(() => {
    getTenant()
  }, [])

  const reOrderTable = useCallback((orderBy) => setFilter(prevState => ({
    ...prevState,
    order: orderBy,
  })), [])


  const tenantsList = useMemo(() => {
    const tenantListFiltered = tenants.map(e => e).sort((a, b) => {
      if (a[filters.order] < b[filters.order]) { return -1; }
      if (a[filters.order] > b[filters.order]) { return 1; }
      return 0;
    })
    return tenantListFiltered
  }, [tenants, filters])

  return (
    <>
      <div className="container">
        <h1>Tenants</h1>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">All</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Payment is late</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Lease ends in less than a month</a>
          </li>
        </ul>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => reOrderTable('id')}>#</th>
              <th onClick={() => reOrderTable('name')} id='name'>Name</th>
              <th onClick={() => reOrderTable('paymentStatus')} id='paymentStatus'>Payment Status</th>
              <th onClick={() => reOrderTable('leaseEndDate')} id='leaseEndDate'>Lease End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {
            loading ? <tbody>
              {
                tenantsList.length ? tenantsList.map((tenant, index) => {
                  const status = handlerStatus(tenant.paymentStatus.toLowerCase())
                  return (
                    <tr datatest-id={`tenant-row${index}`} key={`tenant-key${index}`}>
                      <th>{tenant.id}</th>
                      <td>{tenant.name}</td>
                      <td className={status}>{tenant.paymentStatus}</td>
                      <td>{formatDate(tenant.leaseEndDate)}</td>
                      <td>
                        <button className="btn btn-danger" >Delete</button>
                      </td>
                    </tr>
                  )
                }) :
                  <tr>
                    <th>No result found</th>
                  </tr>
              }
            </tbody> :
              <tbody>
                <tr>
                  <th>Loading...</th>
                </tr>
              </tbody>
          }
        </table>
      </div>
      <div className="container">
        <button className="btn btn-secondary">Add Tenant</button>
      </div>
      <div className="container">
        <form>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" />
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select className="form-control">
              <option>CURRENT</option>
              <option>LATE</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lease End Date</label>
            <input className="form-control" />
          </div>
          <button className="btn btn-primary">Save</button>
          <button className="btn">Cancel</button>
        </form>
      </div>
    </>
  );
}

export default App;
