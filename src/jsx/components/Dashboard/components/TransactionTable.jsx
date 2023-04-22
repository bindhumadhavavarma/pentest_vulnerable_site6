import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { AxiosPost } from '../../../../context/UserContext';
import { pushNotify } from '../../../../services/NotifyService';
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import Button from '@inovua/reactdatagrid-community/packages/Button'
import moment from 'moment';


function TransactionTable(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [transFilter, setTransFilter] = useState('');
  const [companies, setCompanies] = useState([])
  const [gridRef, setGridRef] = useState(null)
  window.moment = moment

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosPost('fetch_company_options.php');
      if (data.success) {
        setCompanies(data.options)
      }
      else {
        pushNotify("error", "Error", data.error)
      }
    } catch {
      pushNotify("error", "Error", "Server Error!")
    } finally {
      setIsLoading(false)
    }
  }

  const filterTransactions = (trans) => {
    return trans.customer.includes(transFilter)
  }

  const gridStyle = { height: "calc(100vh - 17rem)", marginTop: 10 };

  const filterValue = [
    { name: 'sl', operator: 'gte', type: 'number', value: '' },
    { name: 'app_name', operator: 'startsWith', type: 'string', value: '' },
    { name: 'company_name', operator: 'eq', type: 'select', value: null },
    { name: 'transaction_status', operator: 'eq', type: 'select', value: null },
    { name: 'payment_status', operator: 'eq', type: 'select', value: null },
    { name: 'gross_amount', operator: 'gte', type: 'number', value: null },
    { name: 'invoice_date', operator: 'after', type: 'date', value: null }
  ]

  const columns = [
    { name: 'sl', header: 'ID', defaultFlex: 1, minWidth: 70 },
    { name: 'invoice_date', header: 'Invoice Date', defaultFlex: 2, minWidth: 100,filterEditor: DateFilter, },
    { name: 'app_name', header: 'App Name', defaultFlex: 2, minWidth: 100 },
    {
      name: 'company_name', header: 'Company Name', defaultFlex: 2, filterEditor: SelectFilter, minWidth: 100,
      filterEditorProps: {
        placeholder: 'All',
        dataSource: companies
      },
    },
    {
      name: 'transaction_status', header: 'Transaction Status', defaultFlex: 2, minWidth: 100,
      render: ({ value }) =>
        (value == "Raised") ?
          (<span className="badge badge-rounded badge-primary">{value}</span>) :
          (value == "Approved") ?
            (<span className="badge badge-rounded badge-success">{value}</span>) :
            (value == "Rejected") ?
              (<span className="badge badge-rounded badge-danger">{value}</span>) :
              null,
      filterEditor: SelectFilter,
      filterEditorProps: {
        placeholder: 'All',
        dataSource: [{ id: 'Raised', label: 'Raised' }, { id: 'Approved', label: 'Approved' }, { id: 'Rejected', label: 'Rejected' }]
      },
    },
    {
      name: 'payment_status', header: 'Payment Status', defaultFlex: 2, minWidth: 100,
      render: ({ value }) =>
        (value == "Unpaid") ?
          (<span className="badge badge-rounded badge-danger">{value}</span>) :
          (value == "Paid") ?
            (<span className="badge badge-rounded badge-success">{value}</span>) :
            null,
      filterEditor: SelectFilter,
      filterEditorProps: {
        placeholder: 'All',
        dataSource: [{ id: 'Paid', label: 'Paid' }, { id: 'Unpaid', label: 'Unpaid' }]
      },
    },
    {
      name: 'gross_amount', header: 'Gross Amount', defaultFlex: 2, minWidth: 100,
      render: ({ value }) => Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
    },
    {
      name: "id", header: "Actions", defaultFlex: 1, minWidth: 100,
      render: ({ value }) => <button class="btn btn-primary tp-btn sharp" onClick={() => { props.setShowInfo({ show: true, id: value }) }} ><i class="fas fa-arrow-right"></i></button>
    },
    { name: 'qty', header: 'Quantity', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'total', header: 'Total', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'app_type', header: 'App Type', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'category', header: 'Category', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'address', header: 'Address Line 1', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'address2', header: 'Address Line 2', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'address3', header: 'Address Line 3', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'address4', header: 'Address Line 4', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'address5', header: 'Address Line 5', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'subject_address', header: 'Subject Address', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'mail_received_date', header: 'Mail Received Date', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'sales_tax', header: 'Sales Tax', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'raised_at', header: 'Raised At', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'remarks', header: 'Remarks', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'cfms_id', header: 'CFMS Id', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'certificate_issued_date', header: 'Certificate Issued Date', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'certificate_expiry_date', header: 'Certificate Expiry Date', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'apts_receipt_no', header: 'APTS Receipt Number', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
    { name: 'apts_receipt_date', header: 'APTS Receipt Date', defaultFlex: 2, defaultVisible: false, minWidth: 100 },
  ];

  useEffect(() => {
    props.fetchTransactions()
    fetchCompanies()
  }, [])

  const exportCSV = async () => {
    const columns = gridRef.current.visibleColumns;

    const header = columns.map((c) => {
      return `"${c.name}"`;
    }).join(',');

    const rows = gridRef.current.data.map((data) => columns.map((c) => {
      if (typeof data[c.id] === 'string' && data[c.id].includes(',')) {
        return `"${data[c.id]}"`;
      }
      return data[c.id];
    }).join(','));

    const contents = [header].concat(rows).join('\n');
    const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });

    downloadBlob(blob);
  };


  const downloadBlob = (blob, fileName = 'grid-data.csv') => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.position = 'absolute';
    link.style.visibility = 'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div>
      {props.isLoading || props.transactions == null || isLoading ?
        <>
          <Button
            onClick={props.fetchTransactions}
          >
            Sync Data
          </Button>
          <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            columns={columns}
            pagination='local'
            dataSource={[]}
            defaultLimit={25}
            defaultFilterValue={filterValue}
            loading={true}
          />
        </> :
        <>
          <Button onClick={props.fetchTransactions}>Sync Data</Button>
          <Button style={{ marginLeft: 10 }} onClick={exportCSV}>Export CSV</Button>
          <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            columns={columns}
            pagination='local'
            dataSource={props.transactions}
            defaultLimit={25}
            defaultFilterValue={filterValue}
            handle={setGridRef}
          />
        </>
      }
    </div>
  )
}

export default TransactionTable