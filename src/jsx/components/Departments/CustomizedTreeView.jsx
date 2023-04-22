import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
// web.cjs is required for IE11 support
import { useSpring, animated } from 'react-spring/web.cjs';
import { useState } from 'react';

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default function CustomizedTreeView(props) {
  const [statsData, setStatsData] = useState({ id: '', text: '', estimated_budget: '', actual_budget: '' })
  const [departmentSelected, setDepartmentSelected] = useState(false)
  const [raisedAmount,setRaisedAmount]=useState('')
  const [paidAmount,setPaidAmount] = useState('')

  const getTreeItemsFromData = departments => {
    return departments.map(department => {
      let children = undefined;
      // if (department.children && department.children.length > 0) {
      //   children = getTreeItemsFromData(department.children);
      // }
      let temparr = []
      for (let index = 0; index < props.companies.length; index++) {
        const company = props.companies[index];
        if (company.department_id == department.sl) temparr.push(company)
      }
      children = getChildItemsFromData(temparr)
      return (
        <StyledTreeItem
          key={department.sl}
          nodeId={department.sl}
          label={department.department_name}
          children={children}
          onClick={() => { setDepartmentSelected(true); setStatsData(department); getDepartmentRaisedAmount(department.sl) }}
        />
      );
    });
  };

  const getChildItemsFromData = (companies) => {
    return companies.map(company => {
      return (
        <StyledTreeItem
          key={company.sl}
          nodeId={company.sl}
          label={company.company_name}
          onClick={() => { setDepartmentSelected(false); setStatsData(company);getCompanyRaisedAmount(company.sl) }}
        />
      );
    })
  }

  const getCompanyRaisedAmount = (sl) =>{
    setRaisedAmount('')
    setPaidAmount('')
    props.raisedAmounts.forEach((raisedAmount)=>{
      if(raisedAmount.customer==sl){
        setRaisedAmount(raisedAmount.raised_amount)
      }
    })
    
    props.paidAmounts.forEach((paidAmount)=>{
      if(paidAmount.customer==sl){
        setPaidAmount(paidAmount.paid_amount)
      }
    })
  }

  const getDepartmentRaisedAmount = (sl) =>{
    setRaisedAmount('')
    setPaidAmount('')
    let res=0
    props.raisedAmounts.forEach((raisedAmount)=>{
      if(raisedAmount.department_id==sl){
        res+=parseInt(raisedAmount.raised_amount)
      }
    })
    setRaisedAmount(res)
    res=0
    props.paidAmounts.forEach((paidAmount)=>{
      if(paidAmount.department_id==sl){
        res+=parseInt(paidAmount.paid_amount)
      }
    })
    setPaidAmount(res)
  }

  const renderStats = (department) => {
  }

  const generateReminder = (sl)=>{
    window.location = "http://10.0.0.29/apts3_apis/formToWord2.php?id=" + sl
  }

  return (
    <>
      <div className='row' >
        <div className='col-md-6' style={{maxHeight:"300px",overflowY:"scroll"}}>
          <TreeView
            aria-label="customized"
            defaultExpanded={['1']}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', width: 'fit-content' }}
          >
            {getTreeItemsFromData(Object.values(props.departments))}
          </TreeView>
        </div>


        {departmentSelected ?
          <div className='col-md-6'>
            <table className="table verticle-middle table-responsive-md">
              <tbody>
                <tr>
                  <th scope="col">Department Name</th>
                  <td>{statsData.department_name}</td>
                </tr>
                <tr>
                  <th scope='col'>Total Raised Amount</th>
                  <td>{Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(raisedAmount)}</td>
                </tr >
                <tr>
                  <th scope='col'>Total Paid Amount</th>
                  <td>{Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paidAmount)}</td>
                </tr>
              </tbody >
            </table >
          </div>
          :
          <div className='col-md-6'>
            <table className="table verticle-middle table-responsive-md">
              <tbody>
                <tr>
                  <th scope="col">Company Name</th>
                  <td>{statsData.company_name}</td>
                </tr>
                <tr>
                  <th scope='col'>Total Raised Amount</th>
                  <td>{Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(raisedAmount)}</td>
                </tr >
                <tr>
                  <th scope='col'>Total Paid Amount</th>
                  <td>{Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paidAmount)}</td>
                </tr>
                <button className='btn btn-primary mt-2' onClick={()=>generateReminder(statsData.sl)}>Generate Reminder</button>
              </tbody >
            </table >
          </div>

        }



      </div>


    </>
  );
}



