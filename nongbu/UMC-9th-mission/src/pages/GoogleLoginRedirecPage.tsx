import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage"; // 경로는 추정
import { LOCAL_STORAGE_KEY } from "../constants/key"; // 경로는 추정

const GoogleLoginRedirectPage = () => {
    const { setItem: setAccessToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken,
    );
    const { setItem: setRefreshToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken,
    );

    useEffect(() => {
        const urlParams : URLSearchParams = new URLSearchParams(window.location.search);
        const accessToken : string | null = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken : string | null = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            window.location.href = "/my";
        }
    }, [setAccessToken, setRefreshToken]);

    return <div>구글 로그인 리다이렉트</div>;
};

export default GoogleLoginRedirectPage;
