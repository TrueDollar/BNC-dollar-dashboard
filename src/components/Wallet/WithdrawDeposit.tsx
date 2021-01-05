import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus, IconLock
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {approve, claimPool, deposit, withdraw} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {TSD, TSDS} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

type WithdrawDepositProps = {
  user: string
  balance: BigNumber,
  allowance: BigNumber,
  stagedBalance: BigNumber,
  status: number
};

function WithdrawDeposit({
  user, balance, allowance, stagedBalance, status
}: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Stage">
      {allowance.comparedTo(MAX_UINT256) === 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={"TSD"}/>
          </div>
          {/* Deposit Døllar into DAO */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="TSD"
                    value={depositAmount}
                    setter={setDepositAmount}
                    disabled={status !== 0}
                  />
                  <MaxButton
                    onClick={() => {
                      setDepositAmount(balance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip">
                      Make sure the value &gt; 0 and your status is Unlocked.
                    </Tooltip>
                  }
                >
                  <div style={{display: 'inline-block', cursor: 'not-allowed'}}>
                    <Button
                      style={{ pointerEvents: 'none' }}
                      wide
                      icon={status === 0 ? <IconCirclePlus/> : <IconLock/>}
                      label="Deposit"
                      onClick={() => {
                        deposit(
                          TSDS.addr,
                          toBaseUnitBN(depositAmount, TSD.decimals),
                        );
                      }}
                      disabled={status === 1 || !isPos(depositAmount) || depositAmount.isGreaterThan(balance)}
                    />
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Withdraw Døllar from DAO */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '7em'}}>
                <>
                  <BigNumberInput
                    adornment="TSD"
                    value={withdrawAmount}
                    setter={setWithdrawAmount}
                    disabled={status !== 0}
                  />
                  <MaxButton
                    onClick={() => {
                      setWithdrawAmount(stagedBalance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip">
                      Make sure the value &gt; 0 and your status is Unlocked.
                    </Tooltip>
                  }
                >
                  <div style={{display: 'inline-block', cursor: 'not-allowed'}}>
                    <Button
                      style={{ pointerEvents: 'none' }}
                      wide
                      icon={status === 0 ? <IconCircleMinus/> : <IconLock/>}
                      label="Withdraw"
                      onClick={() => {
                        withdraw(
                          TSDS.addr,
                          toBaseUnitBN(withdrawAmount, TSD.decimals),
                        );
                      }}
                      disabled={status === 1 || !isPos(withdrawAmount) || withdrawAmount.isGreaterThan(stagedBalance)}
                    />
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          </div>

        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={"TSD"}/>
          </div>
          <div style={{flexBasis: '35%'}}/>
          {/* Approve DAO to spend Døllar */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label="Approve"
              onClick={() => {
                approve(TSD.addr, TSDS.addr);
              }}
              disabled={user === ''}
            />
          </div>
        </div>
      }
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}>Staging requires your status as Unlocked.</span>
      </div>
    </Box>
  );
}

export default WithdrawDeposit;
