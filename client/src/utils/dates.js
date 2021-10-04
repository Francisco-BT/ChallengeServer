import moment from 'moment';

export function formatDate(date) {
  const momentDate = moment(date);

  if (momentDate.isValid()) {
    return momentDate.format('YYYY-MM-DD');
  }

  return '---';
}
