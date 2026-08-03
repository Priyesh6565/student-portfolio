function ErrorMessage({ message }) {
  return (
    <div className="card">
      <h2 style={{ color: "red" }}>Error</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;