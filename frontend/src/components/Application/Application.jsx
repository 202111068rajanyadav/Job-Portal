import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [college, setCollege] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [experience, setExperience] = useState("");
  const [currentCTC, setCurrentCTC] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const { id } = useParams();

  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (resume) {
      formData.append("resume", resume);
    }
    formData.append("qualification", qualification);
    formData.append("degree", degree);
    formData.append("branch", branch);
    formData.append("college", college);
    formData.append("passingYear", passingYear);
    formData.append("experience", experience);
    formData.append("currentCTC", currentCTC);
    formData.append("skills", skills);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setAge("");
      setEmail("");
      setPhone("");
      setAddress("");
      setResume(null);
      setQualification("");
      setDegree("");
      setBranch("");
      setCollege("");
      setPassingYear("");
      setExperience("");
      setCurrentCTC("");
      setSkills("");
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Full Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Age*"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Phone Number*"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Highest Qualification* (e.g., UG, PG)"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
          <input
            type="number"
            placeholder="Passing Year"
            value={passingYear}
            onChange={(e) => setPassingYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="Experience (in Years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <input
            type="number"
            placeholder="Current CTC"
            value={currentCTC}
            onChange={(e) => setCurrentCTC(e.target.value)}
          />
          <input
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Resume(Optional)
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default Application;
