import React, { useState } from "react";
import Modal from "react-modal";
import "./Main.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainMedia.css";
import "../Faq/Faq";

Modal.setAppElement("#root");

function Main() {
  const [year, setYear] = useState("1학년");
  const [semester, setSemester] = useState("1학기");
  const [college, setCollege] = useState("공과대학");
  const [department, setDepartment] = useState("컴퓨터공학과");
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [majorrequired, setMajorrequired] = useState(0);
  const [generalCredit, setGeneralCredit] = useState(0);
  const [cyberCredit, setCyberCredit] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const departments = {
    "공과대학": ["컴퓨터공학과", "전자공학과", "기계공학과", "건축학과", "건축공학과", "게임소프트웨어학과", "교통공학과", "도시계획학과", "로봇공학과", "생태조경학과", "산업공학과", "신소재공학과", "의용공학과", "전기에너지공학과", "전자공학과", "토목공학과", "화학공학과", "환경공학과"],
    "사회과학학대학": ["경제금융학과", "광고홍보학과", "국제통상학과", "심리학과"],
    "경영대학": ["경영학과", "관광경영학과", "회계학과", "경영빅데이터학과", "경영정보학과", "세무학과"],
    "자연과학대학": ["공중보건학과", "생명과학과", "수학과", "식품가공학과", "식품영양학과", "통계학과", "화학과"],
    "음악공연예술대학": ["실용음악음향과"],
    "약학대학": ["약학과", "제약학과"],
    "미술대학": ["공예디자인과", "산업디자인과", "사진미디어과", "시각디자인과", "영샹애니메이션과", "텍스타일디자인과", "패션디자인과", "패션마케팅학과", "회화과"]
  };

  const navigate = useNavigate();

  const handleYearChange = (e) => setYear(e.target.value);
  const handleSemesterChange = (e) => setSemester(e.target.value);
  const handleCollegeChange = (e) => {
    setCollege(e.target.value);
    setDepartment(departments[e.target.value][0]);
  };
  const handleDepartmentChange = (dept) => {
    setDepartment(dept);
    setIsDepartmentModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openDepartmentModal = () => setIsDepartmentModalOpen(true);
  const closeDepartmentModal = () => setIsDepartmentModalOpen(false);

  const handleComplete = async () => {
    const data = {
      year: year.replace("학년", "").trim(),
      semester: semester.replace("학기", "").trim(),
      major: department.trim(),
      majorCredits: majorrequired,
      electiveCredits: generalCredit,
      cyberCredits: cyberCredit,
    };

    try {
      const response = await axios.post("http://localhost:8000/api/recommend", data);
      navigate("/timetable");
    } catch (error) {
      console.error("추천 요청 중 오류:", error.message);
      alert("원하시는 시간표가 존재하지 않습니다");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="header">
        <div className="header-container">
          <div className="logo-section">
            <img src="/logo2.png" alt="계명대학교" className="logo" />
            <div className="logo-text">
              <div className="university-name-ko">계명대학교</div>
              <div className="university-name-en">KEIMYUNG UNIVERSITY</div>
            </div>
            <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              &#9776;
            </button>
          </div>

          <nav className={`nav-buttons ${isMenuOpen ? "open" : ""}`}>
            <button className="nav-button" style={{ display: "none" }}>로그인</button>
            <button className="nav-button" style={{ display: "none" }}>프로필 수정</button>
            <button className="nav-button">설명</button>
            <button className="nav-button" onClick={() => navigate("/faq")}>문의하기</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="title-section">
          <h1 className="main-title">시간표 자동 생성</h1>
          <p className="subtitle">원하는 조건을 선택하시면 최적의 시간표를 추천해드립니다.</p>
        </div>

        <div className="form-container">
          <div className="dropdown-grid">
            <div className="form-group">
              <label className="form-label">학년</label>
              <select value={year} onChange={handleYearChange}>
                <option>1학년</option>
                <option>2학년</option>
                <option>3학년</option>
                <option>4학년</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">학기</label>
              <select value={semester} onChange={handleSemesterChange}>
                <option>1학기</option>
                <option>2학기</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">단과대학</label>
              <select value={college} onChange={handleCollegeChange}>
                <option>공과대학</option>
                <option>사회과학대학</option>
                <option>경영대학</option>
                <option>자연과학대학</option>
                <option>음악공연예술대학</option>
                <option>약학대학</option>
                <option>미술대학</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">학과</label>
              <button className="select-department-button" onClick={openDepartmentModal}>
                {department}
              </button>
            </div>
          </div>

          <Modal
            isOpen={isDepartmentModalOpen}
            onRequestClose={closeDepartmentModal}
            contentLabel="학과 선택"
            className="main-modal"
          >
            <h2>학과 선택</h2>
            <div className="modals-buttons">
              {departments[college].map((dept) => (
                <button
                  key={dept}
                  className="modals-button"
                  onClick={() => handleDepartmentChange(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
            <button className="modal-button" onClick={closeDepartmentModal}>닫기</button>
          </Modal>

          <div className="credit-group">
            <label className="form-label">학점 선택</label>
            <button className="creditselect-button" onClick={openModal}>
              전공학점 선택
            </button>
          </div>

          <div className="total-credit">
            전공학점 : {majorrequired} 학점 <br />
            교양학점 : {generalCredit} 학점 <br />
            원격학점 : {cyberCredit} 학점 <br />
            총 학점 : {majorrequired + generalCredit + cyberCredit} 학점
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="학점 선택"
            className="main-modal"
          >
            <h2>학점 선택</h2>

            <div className="modals-section">
              <label>전공학점</label>
              <div className="modals-buttons">
                {[0, 3, 6, 9, 12, 15, 18].map((credit) => (
                  <button
                    key={credit}
                    className={`modals-button ${majorrequired === credit ? "selected" : ""}`}
                    onClick={() => setMajorrequired(credit)}
                  >
                    {credit}학점
                  </button>
                ))}
              </div>
            </div>

            <div className="modals-section">
              <label>교양학점</label>
              <div className="modals-buttons">
                {[0, 3, 6, 9, 12, 15, 18].map((credit) => (
                  <button
                    key={credit}
                    className={`modals-button ${generalCredit === credit ? "selected" : ""}`}
                    onClick={() => setGeneralCredit(credit)}
                  >
                    {credit}학점
                  </button>
                ))}
              </div>
            </div>

            <div className="modals-section">
              <label>원격학점</label>
              <div className="modals-buttons">
                {[0, 3, 6].map((credit) => (
                  <button
                    key={credit}
                    className={`modals-button ${cyberCredit === credit ? "selected" : ""}`}
                    onClick={() => setCyberCredit(credit)}
                  >
                    {credit}학점
                  </button>
                ))}
              </div>
            </div>

            <button className="modal-button" onClick={closeModal}>닫기</button>
          </Modal>

          <div className="submit-container">
            <button className="submit-button" onClick={handleComplete}>시간표 추천</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Main;
