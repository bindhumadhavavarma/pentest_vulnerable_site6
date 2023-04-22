import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { AxiosPost, convertNumberToWords } from '../../../../context/UserContext';
import { pushNotify } from '../../../../services/NotifyService';
import { Modal, Button } from "react-bootstrap";
import EditTransactions from './EditTransactions';

function TransactionInfo(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [transaction, setTransaction] = useState(null);
    const [approveForm, setApproveForm] = useState(false)
    const [declineForm, setdeclineForm] = useState(false)
    const [voucherId, setVoucherId] = useState(null);
    const [showEditForm, setShowEditForm] = useState({ show: false, data: null })

    const cancelApprove = () => {
        setApproveForm(false);
    }

    const showDeclineForm = () => {
        setdeclineForm(true);
    }

    const cancelDecline = () => {
        setdeclineForm(false);
    }

    const approveRequest = async () => {
        try {
            setIsLoading(true)
            const data = await AxiosPost('approve_transaction.php', { id: props.showInfo.id })
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Transaction Approved Successfully")
            } else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
            props.setShowInfo({ show: false, id: null })
        }
    }

    const declineRequest = async () => {
        try {
            setIsLoading(true)
            const data = await AxiosPost('reject_transaction.php', { id: props.showInfo.id })
            console.log(data)
            if (data.success) {
                pushNotify("success", "Success", "Transaction Declined Successfully")
            } else {
                pushNotify("error", "Error", data.error)
            }
        } catch {
            pushNotify("error", "Error", "Server Error!")
        } finally {
            setIsLoading(false)
            props.setShowInfo({ show: false, id: null })
        }
    }


    const fetchTransaction = async () => {
        try {
            setIsLoading(true);
            const data = await AxiosPost('fetch_transaction_info.php', { id: props.showInfo.id });
            console.log(data)
            if (data.success) {
                setTransaction(data)
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

    const toggleEditForm = () => {
        setShowEditForm({ show: true, data: transaction })
    }

    useEffect(() => {
        fetchTransaction()
    }, [])

    const generateInvoice = () => {
        console.log("http://10.0.0.29/apts3_apis/formToWord.php?id=" + props.showInfo.id)
        window.location = "http://10.0.0.29/apts3_apis/formToWord.php?id=" + props.showInfo.id
    }

    return (
        <>
            {
                showEditForm.show ?
                    <EditTransactions transaction={transaction.transaction_info} setShowInfo={props.setShowInfo} showEditForm={showEditForm}></EditTransactions>
                    :
                    <div>
                        <div className="col-xl-12 col-lg-12 col-xxl-12 col-sm-12">
                            <div className="card">
                                <div className="card-header border-0 pb-0" style={{ justifyContent: "left" }}>
                                    <button className="btn btn-primary tp-btn sharp" onClick={() => { props.setShowInfo({ show: false, id: null }) }} ><i className="fas fa-arrow-left"></i></button>
                                    <h4 className="card-title">Transaction Info</h4>
                                </div>
                                <div className="card-body" style={{ height: "calc(100vh - 18.5rem)" }}>
                                    <div className="table-responsive recentOrderTable" style={{ height: "100%" }}>
                                        {
                                            isLoading || transaction == null ?
                                                <div className="row mx-0" style={{ height: "100%" }}><ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /></div> :
                                                <div className='basic-form'>
                                                    <div className='row' style={{ margin: "0" }}>
                                                        <div className='col-md-6'>
                                                            <label>App Name</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.app_name}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>App Type</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.app_type}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Category</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.category}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>AP Government</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.gov}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Organisation</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.customer}</div>

                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Address Line 1 (Designation) </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.address}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Address Line 2 </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.address2}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Address Line 3 </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.address3}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Address Line 4 </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.address4}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Address Line 5 </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.address5}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Subject Address </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.subject_address}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Quantity </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} name="qty" >{transaction.transaction_info.qty}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Total</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} name="total" >{transaction.transaction_info.total}</div>
                                                            <span className='text-success'>{convertNumberToWords(transaction.transaction_info.total)}</span>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Invoice Date</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.invoice_date}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Mail Received Date</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.mail_received_date}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Sales Tax (Percentage)</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.sales_tax}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Gross Amoun</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.gross_amount}</div>
                                                            <span className='text-success'>{convertNumberToWords(transaction.transaction_info.gross_amount)}</span>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Payment Status</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.payment_status}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Amount Revceived</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.received_amount}</div>
                                                            <span className='text-success'>{convertNumberToWords(transaction.transaction_info.received_amount)}</span>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>CFMS Id</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.cfms_id}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Certificate Issued Date</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.certificate_issued_date}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Certificate Expired Date</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.certificate_expiry_date}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>APTS Receipt Number</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.apts_receipt_no}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>APTS Receipt Date</label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.apts_receipt_date}</div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <label>Remarks </label>
                                                            <div className='form-control' style={{"height":"fit-content"}} >{transaction.transaction_info.remarks}</div>
                                                        </div>
                                                        <div className='col-md-12 mt-2 text-end'>
                                                            <button className='btn btn-primary me-2' onClick={() => generateInvoice(transaction)}>Generate Invoice</button>
                                                            {transaction.transaction_info.transaction_status != 'Approved' ? <button className='btn btn-success' onClick={() => setApproveForm(true)}>Approve</button> : null}
                                                            {transaction.transaction_info.transaction_status != 'Rejected' ? <button className='btn btn-danger ms-1' onClick={() => setdeclineForm(true)}>Reject</button> : null}
                                                            <button className='btn btn-primary ' onClick={() => toggleEditForm()} style={{ "width": "fit-content", "margin": "5px" }}>Edit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal className="fade" show={approveForm} centered>
                            <Modal.Header>
                                <Modal.Title>Approve Transaction?</Modal.Title>
                                <Button
                                    onClick={cancelApprove}
                                    variant=""
                                    className="btn-close"
                                >

                                </Button>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    isLoading ?
                                        <ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /> :
                                        <div>Are you sure you want to approve the transaction?</div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    onClick={approveRequest}
                                    variant="success"
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={cancelApprove}
                                    variant="primary"
                                >
                                    cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal className="fade" show={declineForm} centered>
                            <Modal.Header>
                                <Modal.Title>Reject Transaction?</Modal.Title>
                                <Button
                                    onClick={cancelDecline}
                                    variant=""
                                    className="btn-close"
                                >

                                </Button>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    isLoading ?
                                        <ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /> :
                                        <div>Are you sure you want to reject the transaction?</div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    onClick={declineRequest}
                                    variant="danger light"
                                >
                                    Reject
                                </Button>
                                <Button variant="primary" onClick={cancelDecline}>Cancel</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
            }
        </>
    )
}

export default TransactionInfo