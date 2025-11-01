import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const getData = async () => {
            try {

                const response = await getMyInfo();
                console.log("API 응답 전체:", response.data);
                setData(response);

            } catch (error) {
                console.error("내 정보를 가져오는 데 실패했습니다:", error);
                alert("로그인 해주세요");
                navigate("/login");
            }
        };
        getData();
    }, []);
    if (!data) {
        return <div>Loading...</div>;
    }
    const handleLogout = async() => {
      await logout();
      navigate('/login')
    }
    return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "50px",
    }}
  >
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>마이 페이지</h2>
      <p
        style={{
          fontSize: "18px",
          fontWeight: "500",
          margin: "8px 0",
        }}
      >
        이름: {data.data.name}
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#555",
          marginBottom: "20px",
        }}
      >
        이메일: {data.data.email}
      </p>

      {/* ✅ 로그아웃 버튼 디자인 */}
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "15px",
          backgroundColor: "#4a90e2",
          color: "white",
          fontSize: "15px",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#3b7cc1")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#4a90e2")
        }
      >
        로그아웃
      </button>
    </div>
  </div>
);


}

export default MyPage;
