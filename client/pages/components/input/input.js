const Input = ({ wrapperClass, title, error, onChange, onBlur, value }) => {
  return (
    <div className={wrapperClass}>
      {title && <label>{title}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        onBlur={onBlur}
        onChange={onChange}
        aria-describedby="validationServer03Feedback"
        value={value}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
