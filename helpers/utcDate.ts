function utcDate(epoch: number) {
  return new Date(epoch).toUTCString();
}

export default utcDate;
