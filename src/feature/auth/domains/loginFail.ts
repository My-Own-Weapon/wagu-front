const loginFail = (
  errorMsg: string,
  setErrorMsg: (msg: string | null) => void,
) => {
  setErrorMsg(errorMsg);
};

export default loginFail;
