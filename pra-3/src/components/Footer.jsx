function Footer({ email }) {

  console.log("Footer loaded");

  return (
    <footer className="footer">
      <p>Email : {email}</p>

      <p>© 2026 Student Portfolio</p>
    </footer>
  );
}

export default Footer;