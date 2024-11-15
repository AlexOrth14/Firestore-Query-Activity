// Add this code at the beginning of your app.js file
// This will add all teams to your Firestore database

async function setupDatabase() {
  const teams = [
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

  // Add each team to Firestore
  for (const team of teams) {
    try {
      await db.collection("teams").doc(team.name).set(team);
      console.log(`Added ${team.name} to database`);
    } catch (error) {
      console.error(`Error adding ${team.name}:`, error);
    }
  }

  console.log("Database setup complete!");
}

// Call the setup function
setupDatabase()
  .then(() => {
    console.log("Starting queries...");
    // Your existing query code will run after the database is populated
  })
  .catch((error) => {
    console.error("Setup failed:", error);
  });

// Filter and display teams in Spain
//let spanishTeams = teams.filter((team) => team.country === "Spain");

//console.log("Teams in Spain:");
//spanishTeams.forEach((team) => {
//  console.log(`Name: ${team.name}, City: ${team.city || "N/A"}`);
//});

// Assuming teams array from Task 1 is already defined

// Reference to the 'teams' collection
// const teamsCollection = db.collection("teams");

// Function to display results on the page
function displayResults(title, results) {
  const outputDiv = document.getElementById("output");
  const titleElement = document.createElement("h2");
  titleElement.textContent = title;
  outputDiv.appendChild(titleElement);

  if (results.length === 0) {
    const noResultsElement = document.createElement("p");
    noResultsElement.textContent = "No results found";
    outputDiv.appendChild(noResultsElement);
    return;
  }

  results.forEach((team) => {
    const teamElement = document.createElement("p");
    teamElement.textContent = JSON.stringify(team, null, 2); // Pretty print JSON
    outputDiv.appendChild(teamElement);
  });
}

// Reference to the 'teams' collection
const teamsCollection = db.collection("teams");

// 1. Show all teams in Spain
teamsCollection
  .where("country", "==", "Spain")
  .get()
  .then((querySnapshot) => {
    const teamsInSpain = [];
    querySnapshot.forEach((doc) => teamsInSpain.push(doc.data()));
    displayResults("All teams in Spain", teamsInSpain);
  })
  .catch((error) => console.error("Error fetching teams in Spain:", error));

// 2. Show all teams in Madrid, Spain
teamsCollection
  .where("city", "==", "Madrid")
  .where("country", "==", "Spain")
  .get()
  .then((querySnapshot) => {
    const teamsInMadrid = [];
    querySnapshot.forEach((doc) => teamsInMadrid.push(doc.data()));
    displayResults("All teams in Madrid, Spain", teamsInMadrid);
  })
  .catch((error) => console.error("Error fetching teams in Madrid:", error));

// 3. Show all national teams - modified to check for missing city field
teamsCollection
  .get()
  .then((querySnapshot) => {
    const nationalTeams = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (!team.city) {
        // Check if city field is missing or undefined
        nationalTeams.push(team);
      }
    });
    displayResults("All national teams", nationalTeams);
  })
  .catch((error) => console.error("Error fetching national teams:", error));

// 4. Show all teams that are not in Spain
teamsCollection
  .get()
  .then((querySnapshot) => {
    const teamsNotInSpain = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (team.country !== "Spain") {
        teamsNotInSpain.push(team);
      }
    });
    displayResults("All teams not in Spain", teamsNotInSpain);
  })
  .catch((error) => console.error("Error fetching teams not in Spain:", error));

// 5. Show all teams that are not in Spain or England
teamsCollection
  .get()
  .then((querySnapshot) => {
    const teamsNotInSpainOrEngland = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (team.country !== "Spain" && team.country !== "England") {
        teamsNotInSpainOrEngland.push(team);
      }
    });
    displayResults(
      "All teams not in Spain or England",
      teamsNotInSpainOrEngland
    );
  })
  .catch((error) =>
    console.error("Error fetching teams not in Spain or England:", error)
  );

// 6. Show all teams in Spain with more than 700M fans
teamsCollection
  .where("country", "==", "Spain")
  .get()
  .then((querySnapshot) => {
    const popularTeamsInSpain = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (team.worldwideFans > 700) {
        popularTeamsInSpain.push(team);
      }
    });
    displayResults(
      "All teams in Spain with more than 700M fans",
      popularTeamsInSpain
    );
  })
  .catch((error) =>
    console.error("Error fetching popular teams in Spain:", error)
  );

// 7. Show all teams with fans in the range of 500M and 600M
teamsCollection
  .get()
  .then((querySnapshot) => {
    const midRangeFanTeams = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (team.worldwideFans >= 500 && team.worldwideFans <= 600) {
        midRangeFanTeams.push(team);
      }
    });
    displayResults(
      "All teams with fans in range 500M to 600M",
      midRangeFanTeams
    );
  })
  .catch((error) =>
    console.error("Error fetching teams with mid-range fans:", error)
  );

// 8. Show all teams where Ronaldo is a top scorer
teamsCollection
  .get()
  .then((querySnapshot) => {
    const teamsWithRonaldo = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (team.topScorers.includes("Ronaldo")) {
        teamsWithRonaldo.push(team);
      }
    });
    displayResults("All teams where Ronaldo is a top scorer", teamsWithRonaldo);
  })
  .catch((error) =>
    console.error("Error fetching teams with Ronaldo as top scorer:", error)
  );

// 9. Show all teams where Ronaldo, Maradona, or Messi is a top scorer
teamsCollection
  .get()
  .then((querySnapshot) => {
    const teamsWithFamousScorers = [];
    querySnapshot.forEach((doc) => {
      const team = doc.data();
      if (
        team.topScorers.includes("Ronaldo") ||
        team.topScorers.includes("Maradona") ||
        team.topScorers.includes("Messi")
      ) {
        teamsWithFamousScorers.push(team);
      }
    });
    displayResults(
      "All teams where Ronaldo, Maradona, or Messi is a top scorer",
      teamsWithFamousScorers
    );
  })
  .catch((error) =>
    console.error("Error fetching teams with famous top scorers:", error)
  );
