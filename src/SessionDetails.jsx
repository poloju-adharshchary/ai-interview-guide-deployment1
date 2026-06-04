import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Document,
  Packer,
  Paragraph
} from "docx";

import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function SessionDetails() {

  const { sessionId } = useParams();

  const [answers, setAnswers] =
    useState([]);
    const totalScore = answers.reduce(
  (sum, item) =>
    sum + Number(item.score || 0),
  0
);

const totalQuestions =
  answers.length;

const averageScore =
  totalQuestions > 0
    ? totalScore / totalQuestions
    : 0;

const totalScoreData = [
  {
    name: "Scored",
    value: totalScore
  },
  {
    name: "Remaining",
    value:
      Math.max(
        totalQuestions * 10 -
          totalScore,
        0
      )
  }
];

const averageScoreData = [
  {
    name: "Average",
    value: averageScore
  },
  {
    name: "Remaining",
    value:
      Math.max(
        10 - averageScore,
        0
      )
  }
];

  useEffect(() => {

    loadData();

  }, []);

  //pdf
  const exportPDF = async () => {

  const input =
    document.getElementById(
      "session-report"
    );

  const canvas =
    await html2canvas(
      input,
      {
        scale: 2,
        useCORS: true
      }
    );

  const imgData =
    canvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

  const pageWidth = 210;

  const pageHeight = 297;

  const imgWidth =
    pageWidth;

  const imgHeight =
    (canvas.height *
      imgWidth) /
    canvas.width;

  let heightLeft =
    imgHeight;

  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pageHeight;

  while (
    heightLeft > 0
  ) {

    position =
      heightLeft -
      imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -=
      pageHeight;
  }

  pdf.save(
    `Interview_Session_${sessionId}.pdf`
  );

};

//word

const exportWord = async () => {

  const content =
    document.getElementById(
      "session-report"
    ).innerText;

  const doc =
    new Document({
      sections: [
        {
          children: [
            new Paragraph(
              content
            )
          ]
        }
      ]
    });

  const blob =
    await Packer.toBlob(doc);

  saveAs(
    blob,
    `Interview_Session_${sessionId}.docx`
  );

};

const loadData = async () => {

  const res =
    await axios.get(
      `https://loving-dream-production-48cc.up.railway.app/get-session-details/${sessionId}`
    );

  setAnswers(
    res.data.answers
  );

};

  return (
    <div
    id="session-report"
      style={{
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h1>
        Interview Session
      </h1>

      {answers.map((item) => (

        <div
          key={item.id}
          style={{
            background: "#111827",
            marginBottom: "25px",
            padding: "20px",
            borderRadius: "15px",
            border:
              "1px solid #22d3ee"
          }}
        >

          <h3>
            🤖 Question
          </h3>

          <p>
            {item.question}
          </p>

          <h3>
            👤 Answer
          </h3>

          <p>
            {item.user_answer}
          </p>

          <h3>
            Score
          </h3>

          <p>
            {item.score}/10
          </p>

          <h3>
            Ideal Answer
          </h3>

          <p>
            {item.ideal_answer}
          </p>

          <h3>
            Feedback
          </h3>

          <p>
            {item.ai_feedback}
          </p>

        </div>

      ))}
<div
  style={{
    marginTop: "40px",
    background: "#111827",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #22d3ee"
  }}
>
  <h2>Interview Summary</h2>

  <p>
    Total Questions: {totalQuestions}
  </p>

  <p>
    Total Score: {totalScore}
  </p>

  <p>
    Average Score:
    {" "}
    {averageScore.toFixed(2)}
    /10
  </p>
</div>

<div
  style={{
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginTop: "40px"
  }}
>

  <div>

    <h2>
      Total Score Chart
    </h2>

    <PieChart
      width={350}
      height={350}
    >
      <Pie
        data={totalScoreData}
        dataKey="value"
        outerRadius={120}
        label
      >
        <Cell fill="#22d3ee" />
        <Cell fill="#374151" />
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>

  </div>

  <div>

    <h2>
      Average Score Chart
    </h2>

    <PieChart
      width={350}
      height={350}
    >
      <Pie
        data={averageScoreData}
        dataKey="value"
        outerRadius={120}
        label
      >
        <Cell fill="#10b981" />
        <Cell fill="#374151" />
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>

  </div>

</div>

<div
  style={{
    marginTop: "50px",
    textAlign: "center"
  }}
>

  <h2>
    Export Report
  </h2>

  <button
    onClick={exportPDF}
    style={{
      padding: "12px 25px",
      marginRight: "15px",
      background: "#22d3ee",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer"
    }}
  >
    Export PDF
  </button>

  <button
    onClick={exportWord}
    style={{
      padding: "12px 25px",
      background: "#10b981",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer"
    }}
  >
    Export Word
  </button>

</div>

    </div>
  );
}

export default SessionDetails;