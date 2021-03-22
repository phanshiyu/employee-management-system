import currency from 'currency.js';

export const formatDateString = (val) =>
  val ? new Date(val).toLocaleString('en-SG') : '';

export const formatSGD = (value) => currency(value).format();
