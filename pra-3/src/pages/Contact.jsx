import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");

  return (
    <section className="card">
      <h2>Contact</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Hello, {name}</p>
    </section>
  );
}

export default Contact;