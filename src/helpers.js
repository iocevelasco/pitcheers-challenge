export const handlerStatus = (status) => {
  if (status === 'late') return 'btn-danger'
  else if (status === 'current') return 'btn-success'
}

export const formatDate = function (timestamp) {
  var date = new Date(timestamp);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const hours = `Hour ${date.getHours()}:${date.getMinutes()}`;
  return `${months[date.getMonth()]} / ${date.getDay()} / ${date.getFullYear()} | ${hours}`;
};

