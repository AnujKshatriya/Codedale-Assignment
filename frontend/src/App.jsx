import { useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3000/api";

export default function DataFetcher() {
  const [userId, setUserId] = useState("");
  const [pollId, setPollId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Authorization": "Bearer test-session-token",
          "Content-Type": "application/json"
        }
      });
      console.log(response)
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">API Data Fetcher</h1>
      
      <div className="button-container">
        <button onClick={() => fetchData("/user/details")} disabled={loading}>
          {loading ? "Loading..." : "Get User Details"}
        </button>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={() => fetchData(`/posts/${userId}`)} disabled={loading || !userId}>
          {loading ? "Loading..." : "Get User Posts"}
        </button>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Poll ID"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
        />
        <button onClick={() => fetchData(`/poll/${pollId}`)} disabled={loading || !pollId}>
          {loading ? "Loading..." : "Get Poll Details"}
        </button>
      </div>

      {error && <p className="error">Error: {error}</p>}
      {data && (
        <div className="data-container">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
