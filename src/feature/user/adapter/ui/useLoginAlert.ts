const useLoginAlert = () => {
  return {
    alert: (message: string) => {
      alert(message);
    },
  };
};

export default useLoginAlert;
