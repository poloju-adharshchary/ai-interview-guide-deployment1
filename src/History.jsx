import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./History.css";

function History() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sessions, search, roleFilter, sortBy]);

  const loadSessions = async () => {
    try {
      const userId =
        localStorage.getItem("user_id");

      const response =
        await axios.get(
          `http://127.0.0.1:8000/user-sessions/${userId}`
        );

      const data =
        response.data.sessions || [];

      setSessions(data);
      setFilteredSessions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = () => {
    let data = [...sessions];

    if (search) {
      data = data.filter((item) =>
        (
          item.session_name ||
          item.role
        )
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "All") {
      data = data.filter(
        (item) =>
          item.role === roleFilter
      );
    }

    if (sortBy === "Latest") {
      data.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );
    }

    if (sortBy === "Oldest") {
      data.sort(
        (a, b) =>
          new Date(a.created_at) -
          new Date(b.created_at)
      );
    }

    if (sortBy === "Highest Score") {
      data.sort(
        (a, b) =>
          b.total_score -
          a.total_score
      );
    }

    if (sortBy === "Lowest Score") {
      data.sort(
        (a, b) =>
          a.total_score -
          b.total_score
      );
    }

    setFilteredSessions(data);
  };

  const getBadge = (score, questions) => {
    const average =
      questions > 0
        ? score / questions
        : 0;

    if (average >= 8)
      return "Excellent";

    if (average >= 5)
      return "Good";

    return "Needs Improvement";
  };

  const getBadgeClass = (
    score,
    questions
  ) => {
    const average =
      questions > 0
        ? score / questions
        : 0;

    if (average >= 8)
      return "excellent";

    if (average >= 5)
      return "good";

    return "poor";
  };

  const renameSession = async (
    sessionId
  ) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/rename-session/${sessionId}`,
        {
          session_name: newName
        }
      );

      setEditingId(null);

      loadSessions();
    } catch (error) {
      console.log(error);
    }
  };

  const uniqueRoles = [
    "All",
    ...new Set(
      sessions.map(
        (item) => item.role
      )
    )
  ];

  return (
    <div className="history-container">

      <div className="history-header">
        <h1>
          Interview History
        </h1>

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard
        </button>
      </div>

      <div className="history-controls">

        <input
          type="text"
          placeholder="Search Interview..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="search-box"
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
        >
          {uniqueRoles.map(
            (role) => (
              <option
                key={role}
              >
                {role}
              </option>
            )
          )}
        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
        >
          <option>
            Latest
          </option>

          <option>
            Oldest
          </option>

          <option>
            Highest Score
          </option>

          <option>
            Lowest Score
          </option>
        </select>

      </div>

      {filteredSessions.length === 0 ? (
        <div className="empty-state">
          No Interview Sessions Found
        </div>
      ) : (
        filteredSessions.map(
          (
            session,
            index
          ) => (
            <div
              key={session.id}
              className="session-card"
            >

              <div
                className="session-main"
                onClick={() =>
                  navigate(
                    `/history/${session.id}`
                  )
                }
              >

                {editingId ===
                session.id ? (
                  <input
                    value={newName}
                    onChange={(e) =>
                      setNewName(
                        e.target.value
                      )
                    }
                    onKeyDown={(
                      e
                    ) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        renameSession(
                          session.id
                        );
                      }
                    }}
                    autoFocus
                    className="rename-input"
                  />
                ) : (
                  <h2
                    onDoubleClick={() => {
                      setEditingId(
                        session.id
                      );

                      setNewName(
                        session.session_name ||
                          `${session.role} Interview ${index + 1}`
                      );
                    }}
                  >
                    {session.session_name ||
                      `${session.role} Interview ${index + 1}`}
                  </h2>
                )}

                <p>
                  {session.role}
                </p>

                <p>
                  {
                    session.difficulty
                  }
                </p>

                <p>
                  Total Score :
                  {" "}
                  {
                    session.total_score
                  }
                </p>

                <p>
                  Questions :
                  {" "}
                  {
                    session.total_questions
                  }
                </p>

                <p>
                  {new Date(
                    session.created_at
                  ).toLocaleString()}
                </p>

              </div>

              <div
                className={`badge ${getBadgeClass(
                  session.total_score,
                  session.total_questions
                )}`}
              >
                {getBadge(
                  session.total_score,
                  session.total_questions
                )}
              </div>

            </div>
          )
        )
      )}
    </div>
  );
}

export default History;