function Header({ name, college }) {

  console.log("Header loaded");

  return (
    <header className="header">
      <h1>{name}</h1>
      <p>{college}</p>
    </header>
  );
}

export default Header;