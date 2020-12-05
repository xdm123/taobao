function getUnixTime(){
  return Math.round(new Date().getTime()/1000) ;
}



module.exports = {
  getUnixTime: getUnixTime,
}