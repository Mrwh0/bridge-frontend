import BN from 'bignumber.js'
import { FEE_MANAGER_MODE } from '../../../commons'

export const validFee = fee => {
  const zeroBN = new BN(0)
  return !zeroBN.eq(fee)
}

export const getFeeToApply = (homeFeeManager, foreignFeeManager, homeToForeignDirection) => {
  const data = getRewardableData(homeFeeManager, foreignFeeManager)
  return homeToForeignDirection ? data.homeFee : data.foreignFee
}

export const getRewardableData = (homeFeeManager, foreignFeeManager) => {
  if (homeFeeManager.feeManagerMode === FEE_MANAGER_MODE.BOTH_DIRECTIONS) {
    return {
      homeFee: homeFeeManager.homeFee,
      foreignFee: homeFeeManager.foreignFee,
      homeHistoricFee: homeFeeManager.homeHistoricFee,
      foreignHistoricFee: homeFeeManager.foreignHistoricFee,
      depositSymbol: 'home',
      withdrawSymbol: 'home',
      displayDeposit: true,
      displayWithdraw: true
    }
  } else if (
    homeFeeManager.feeManagerMode === FEE_MANAGER_MODE.ONE_DIRECTION &&
    foreignFeeManager.feeManagerMode === FEE_MANAGER_MODE.ONE_DIRECTION
  ) {
    return {
      homeFee: foreignFeeManager.homeFee,
      foreignFee: homeFeeManager.foreignFee,
      homeHistoricFee: foreignFeeManager.homeHistoricFee,
      foreignHistoricFee: homeFeeManager.foreignHistoricFee,
      depositSymbol: 'foreign',
      withdrawSymbol: 'home',
      displayDeposit: true,
      displayWithdraw: true
    }
  } else if (
    homeFeeManager.feeManagerMode === FEE_MANAGER_MODE.ONE_DIRECTION &&
    foreignFeeManager.feeManagerMode === FEE_MANAGER_MODE.UNDEFINED
  ) {
    return {
      homeFee: new BN(0),
      foreignFee: homeFeeManager.foreignFee,
      homeHistoricFee: [],
      foreignHistoricFee: homeFeeManager.foreignHistoricFee,
      depositSymbol: '',
      withdrawSymbol: 'home',
      displayDeposit: false,
      displayWithdraw: true
    }
  } else if (
    homeFeeManager.feeManagerMode === FEE_MANAGER_MODE.UNDEFINED &&
    foreignFeeManager.feeManagerMode === FEE_MANAGER_MODE.ONE_DIRECTION
  ) {
    return {
      homeFee: foreignFeeManager.homeFee,
      foreignFee: new BN(0),
      homeHistoricFee: foreignFeeManager.homeHistoricFee,
      foreignHistoricFee: [],
      depositSymbol: 'foreign',
      withdrawSymbol: '',
      displayDeposit: true,
      displayWithdraw: false
    }
  } else if (homeFeeManager.feeManagerMode === FEE_MANAGER_MODE.ONE_DIRECTION_STAKE) {
    return {
      homeFee: homeFeeManager.homeFee,
      foreignFee: new BN(0),
      depositSymbol: 'home',
      withdrawSymbol: '',
      displayDeposit: true,
      displayWithdraw: false
    }
  } else {
    return {
      homeFee: new BN(0),
      foreignFee: new BN(0),
      depositSymbol: '',
      withdrawSymbol: '',
      displayDeposit: false,
      displayWithdraw: false
    }
  }
}
