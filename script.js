let accessToken = "";

const BASE_URL = "https://greencell-service-211647811356.asia-northeast3.run.app";

// 1. 로그인
async function login() {
  const user_id = document.getElementById("user_id").value;
  const password = document.getElementById("password").value;

  const login_url = `${BASE_URL}/api/auth/login`;

  try {
    const res = await fetch(login_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, password }),
    });

    const data = await res.json();
    showResult(data);

    if (res.ok && data.access_token) {
      accessToken = data.access_token;
      document.getElementById("login_status").textContent =
        "✅ 로그인 성공! 토큰 저장됨";
    } else {
      document.getElementById("login_status").textContent = "❌ 로그인 실패";
    }
  } catch (err) {
    document.getElementById("login_status").textContent = "❌ 오류: " + err;
  }
}

// 2. 센서 데이터 전송
async function sendSensor() {
  if (!accessToken) {
    alert("먼저 로그인하세요!");
    return;
  }

  const url = `${BASE_URL}/api/farm/status`;

  const sensorData = {
    sensor_temp: Number(document.getElementById("temp").value),
    sensor_ph: Number(document.getElementById("ph").value),
    sensor_humid: Number(document.getElementById("humid").value),
    sensor_electric: Number(document.getElementById("electric").value),
    sensor_total_electric: Number(document.getElementById("total_electric").value),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sensorData),
    });

    const data = await res.json();
    showResult(data);

    if (res.ok) {
      document.getElementById("sensor_status").textContent = "✅ 전송 성공!";
    } else {
      document.getElementById("sensor_status").textContent = "❌ 전송 실패";
    }
  } catch (err) {
    document.getElementById("sensor_status").textContent = "❌ 오류: " + err;
  }
}

// 응답 결과 출력
function showResult(data) {
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}
