import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { AxiosPost } from '../../../../context/UserContext';
import { pushNotify } from '../../../../services/NotifyService';
import TransactionInfo from './TransactionInfo';
import TransactionTable from './TransactionTable';

function Transaction(props) {
  const [showInfo, setShowInfo] = useState({ show: false, id: null })
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosPost('fetch_transactions.php');
      console.log(data)
      if (data.success) {
        setTransactions(data.transactions)
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

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <>
      {showInfo.show ? <TransactionInfo showInfo={showInfo} setShowInfo={setShowInfo}></TransactionInfo> :
        <TransactionTable isLoading={isLoading} transactions={transactions} fetchTransactions={fetchTransactions} setShowInfo={setShowInfo}></TransactionTable>}
    </>
  )

}

export default Transaction