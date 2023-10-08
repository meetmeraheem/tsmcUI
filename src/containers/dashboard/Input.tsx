const Input = (props:any) => {
    const { onChange, value, resetinput,placeholder } = props;
    return (
      <div>
        <input onChange={onChange} value={value} placeholder={placeholder} />
      </div>
    );
  };
  export default Input;