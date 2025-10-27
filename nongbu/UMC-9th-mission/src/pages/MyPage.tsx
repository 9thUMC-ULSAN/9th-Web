import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    useEffect(() => {
        const getData = async () => {
            try {

                const response = await getMyInfo();
                console.log("API 응답 전체:", response.data);
                setData(response);

            } catch (error) {
                console.error("내 정보를 가져오는 데 실패했습니다:", error);
            }
        };
        getData();
    }, []);
    if (!data) {
        return <div>Loading...</div>;
    }
    return (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "20px 30px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ marginBottom: "10px" }}>마이 페이지</h2>
      <p style={{ fontSize: "18px", fontWeight: "500", margin: "8px 0" }}>
        이름: {data.data.name}
      </p>
      <p style={{ fontSize: "16px", color: "#555" }}>
        이메일: {data.data.email}
      </p>
    </div>
  </div>
);

}

export default MyPage;
