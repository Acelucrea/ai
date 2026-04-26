import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple AI logic (replace with OpenAI later)
function getLegalAnswer(text) {
  text = text.toLowerCase();
  if (text.includes("arrest")) {
    return "Under Section 35 of the Nigerian Constitution, you must be informed of the reason for your arrest within 24 hours.";
  }
  if (text.includes("rent") || text.includes("evict")) {
    return "A landlord cannot evict you without proper notice and a court order under Lagos Tenancy Law.";
  }
  return "Based on Nigerian law, you have enforceable rights. Please consult a lawyer for detailed help.";
}

app.post("/api/ai", (req, res) => {
  const { text } = req.body;
  const answer = getLegalAnswer(text);
  res.json({ answer });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
