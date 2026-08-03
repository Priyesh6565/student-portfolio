function Skills({ skillList }) {

  console.log("Skills loaded");

  return (
    <section className="card">
      <h2>Skills</h2>

      <ul>
        {skillList.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;