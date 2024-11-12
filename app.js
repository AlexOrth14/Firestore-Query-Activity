// All teams' data
let teams = [
  {
    name: "Real Madrid",
    city: "Madrid",
    country: "Spain",
    topScorers: ["Ronaldo", "Benzema", "Hazard"],
    worldwideFans: 798,
  },
  {
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    topScorers: ["Messi", "Suarez", "Puyol"],
    worldwideFans: 738,
  },
  {
    name: "Manchester United",
    city: "Manchester",
    country: "England",
    topScorers: ["Cantona", "Rooney", "Ronaldo"],
    worldwideFans: 755,
  },
  {
    name: "Manchester City",
    city: "Manchester",
    country: "England",
    topScorers: ["Sterling", "Aguero", "Haaland"],
    worldwideFans: 537,
  },
  {
    name: "Brazil National Team",
    country: "Brazil",
    topScorers: ["Ronaldinho", "Cafu", "Bebeto"],
    worldwideFans: 950,
  },
  {
    name: "Argentina National Team",
    country: "Argentina",
    topScorers: ["Messi", "Batistuta", "Maradona"],
    worldwideFans: 888,
  },
  {
    name: "Atletico Madrid",
    city: "Madrid",
    country: "Spain",
    topScorers: ["Aragones", "Griezmann", "Torez"],
    worldwideFans: 400,
  },
];

// Filter and display teams in Spain
let spanishTeams = teams.filter((team) => team.country === "Spain");

console.log("Teams in Spain:");
spanishTeams.forEach((team) => {
  console.log(`Name: ${team.name}, City: ${team.city || "N/A"}`);
});
