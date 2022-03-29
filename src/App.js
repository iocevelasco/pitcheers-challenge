import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { formatDate, handlerStatus, filterByLastMonth } from './helpers';
import { Service } from './Service';
function App() {
  const [tenants, setTenantsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilter] = useState({
    order: 'name',
    tabs: 'all',
  });
  const [tabs, setTabs] = useState([
    { label: 'All', active: true, value: 'all' },
    { label: 'Payment is late', active: false, value: 'payment' },
    { label: 'Lease ends in less than a month', active: false, value: 'date' },
  ])
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

  const filterByTabs = (element, value) => {
    const filter = {
      all: element,
      payment: element.paymentStatus.toLowerCase() === 'late',
      date: filterByLastMonth(element.leaseEndDate)
    }
    return filter[value]
  }

  const tenantsList = useMemo(() => {
    const tenantListFiltered = tenants.map(e => e).sort((a, b) => {
      if (a[filters.order] < b[filters.order]) { return -1; }
      if (a[filters.order] > b[filters.order]) { return 1; }
      return 0;
    }).filter(element => filterByTabs(element, filters.tabs))
    return tenantListFiltered
  }, [tenants, filters])

  const handlerTab = useCallback((tabsValue, index) => {
    setFilter(prevState => ({
      ...prevState,
      tabs: tabsValue.value.toLowerCase(),
    }))
    setTabs(prevState => prevState.map((tab, i) => ({
      ...tab,
      active: i === index
    })))
  }, [])

  return (
    <>
      <div className="container">
        <h1>Tenants</h1>
        <ul className="nav nav-tabs">
          {
            tabs.map((tab, index) => {
              return (
                <li data-testid={`tab-${index}`} key={`tab-${index}`} onClick={() => handlerTab(tab, index)} className="nav-item">
                  <a className={`nav-link  ${!tab.active ? 'active' : ''}`} href="/#">{tab.label}</a>
                </li>
              )
            })
          }
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
