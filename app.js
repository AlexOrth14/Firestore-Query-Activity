// add all teams to firestore database

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

// task 3 code begins

// updating Real Madrid's data

// teamsCollection
//   .doc("Real Madrid")
//   .update({
//     worldwideFans: 811,
//     name: "Real Madrid FC",
//   })
//   .then(() => {
//     console.log("Updated Real Madrids fans and team name");
//   })
//   .catch((error) => {
//     console.error("Error updating Real Madrid: ", error);
//   });

// updating Barcelona's data

// teamsCollection
//   .doc("Barcelona")
//   .update({
//     worldwideFans: 747,
//     name: "FC Barcelona",
//   })
//   .then(() => {
//     console.log("Updated Barcelonas fans and team name");
//   })
//   .catch((error) => {
//     console.error("Error updating Barcelona: ", error);
//   });
// teamsCollection
//   .doc("Barcelona")
//   .set(
//     {
//       worldwideFans: 747,
//       name: "FC Barcelona",
//     },
//     { merge: true }
//   )
//   .then(() => {
//     console.log("Successfully updated Barcelona with set().");
//   })
//   .catch((error) => {
//     console.error("Error using set() for Barcelona:", error.message, error);
//   });

// teamsCollection
//   .doc("Barcelona")
//   .update({
//     worldwideFans: 747,
//     name: "FC Barcelona",
//     topScorers: firebase.firestore.FieldValue.arrayRemove("Puyol"),
//     color: {
//       home: "Red",
//       away: "Gold",
//     },
//   })
//   .then(() => {
//     return teamsCollection.doc("Barcelona").update({
//       topScorers: firebase.firestore.FieldValue.arrayUnion("Deco"),
//       "color.away": "Pink", // Updating away jersey color
//     });
//   })
//   .then(() => {
//     console.log("Successfully updated Barcelona.");
//   })
//   .catch((error) => {
//     console.error("Error updating Barcelona:", error);
//   });

// updating top scorers

// real madrid top scorers

// Update Real Madrid's top scorers: Remove 'Hazard', Add 'Crispo'
// teamsCollection
//   .doc("Real Madrid") // Use the updated name from the previous step
//   .update({
//     topScorers: firebase.firestore.FieldValue.arrayRemove("Hazard"),
//   })
//   .then(() => {
//     return teamsCollection.doc("Real Madrid").update({
//       topScorers: firebase.firestore.FieldValue.arrayUnion("Crispo"),
//     });
//   })
//   .then(() => {
//     console.log("Updated Real Madrid's top scorers");
//   })
//   .catch((error) => {
//     console.error("Error updating Real Madrid's top scorers:", error);
//   });

// Update Barcelona's top scorers: Remove 'Puyol', Add 'Deco'
// teamsCollection
//   .doc("Barcelona") // Use the updated name from the previous step
//   .update({
//     topScorers: firebase.firestore.FieldValue.arrayRemove("Puyol"),
//   })
//   .then(() => {
//     return teamsCollection.doc("Barcelona").update({
//       topScorers: firebase.firestore.FieldValue.arrayUnion("Deco"),
//     });
//   })
//   .then(() => {
//     console.log("Updated Barcelona's top scorers");
//   })
//   .catch((error) => {
//     console.error("Error updating Barcelona's top scorers:", error);
//   });

// task 3 part b

// Add jersey colors to Real Madrid
// teamsCollection
//   .doc("Real Madrid") // Updated document name from previous tasks
//   .update({
//     color: {
//       home: "White",
//       away: "Black",
//     },
//   })
//   .then(() => {
//     console.log("Added jersey colors to Real Madrid FC");
//   })
//   .catch((error) => {
//     console.error("Error adding jersey colors to Real Madrid FC:", error);
//   });

// Add jersey colors to Barcelona
// teamsCollection
//   .doc("Barcelona") // Updated document name from previous tasks
//   .update({
//     color: {
//       home: "Red",
//       away: "Gold",
//     },
//   })
//   .then(() => {
//     console.log("Added jersey colors to FC Barcelona");
//   })
//   .catch((error) => {
//     console.error("Error adding jersey colors to FC Barcelona:", error);
//   });

// Update away jersey color for Real Madrid
// teamsCollection
//   .doc("Real Madrid")
//   .update({
//     "color.away": "Purple", // Update only the away jersey color
//   })
//   .then(() => {
//     console.log("Updated Real Madrid's away jersey color to Purple");
//   })
//   .catch((error) => {
//     console.error("Error updating Real Madrid's away jersey color:", error);
//   });

// Update away jersey color for Barcelona
// teamsCollection
//   .doc("Barcelona")
//   .update({
//     "color.away": "Pink", // Update only the away jersey color
//   })
//   .then(() => {
//     console.log("Updated Barcelona's away jersey color to Pink");
//   })
//   .catch((error) => {
//     console.error("Error updating Barcelona's away jersey color:", error);
//   });

// trying to update with a singular function
// async function updateTeams() {
//   try {
//     // Update Real Madrid in a single consolidated operation
//     await teamsCollection.doc("Real Madrid").update({
//       worldwideFans: 811,
//       name: "Real Madrid FC",
//       topScorers: firebase.firestore.FieldValue.arrayRemove("Hazard"),
//       color: {
//         home: "White",
//         away: "Purple", // Updated away jersey color directly
//       },
//     });
//     // Add 'Crispo' to the top scorers after removing 'Hazard'
//     await teamsCollection.doc("Real Madrid").update({
//       topScorers: firebase.firestore.FieldValue.arrayUnion("Crispo"),
//     });

//     console.log("Successfully updated Real Madrid.");

//     // Update Barcelona in a single consolidated operation
//     await teamsCollection.doc("Barcelona").update({
//       worldwideFans: 747,
//       name: "FC Barcelona",
//       topScorers: firebase.firestore.FieldValue.arrayRemove("Puyol"),
//       color: {
//         home: "Red",
//         away: "Pink", // Updated away jersey color directly
//       },
//     });
//     // Add 'Deco' to the top scorers after removing 'Puyol'
//     await teamsCollection.doc("Barcelona").update({
//       topScorers: firebase.firestore.FieldValue.arrayUnion("Deco"),
//     });

//     console.log("Successfully updated Barcelona.");
//   } catch (error) {
//     console.error("Error updating teams:", error);
//   }
// }

// Call the update function
// updateTeams();

// single update not working well. separate functions

// Main workflow function to ensure sequential execution
async function mainWorkflow() {
  console.log("Starting main workflow...");

  // Step 1: Set up the database (adds initial teams to Firestore)
  await setupDatabase()
    .then(() => {
      console.log("Teams successfully added to the database.");
    })
    .catch((error) => {
      console.error("Error setting up database:", error);
    });

  // Step 2: Update fans and names
  await updateTeams();

  // Step 3: Add and update jersey colors
  await updateJerseyColors();

  console.log("All updates completed.");
}

// Call the main workflow
mainWorkflow();

// Existing functions, refactored for clarity and sequential execution

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

async function updateTeamFansAndNames() {
  try {
    // Update Real Madrid fans and name
    await teamsCollection.doc("Real Madrid").update({
      worldwideFans: 811,
      name: "Real Madrid FC",
    });
    console.log("Updated Real Madrid's fans and name.");

    // Update Barcelona fans and name
    await teamsCollection.doc("Barcelona").update({
      worldwideFans: 747,
      name: "FC Barcelona",
    });
    console.log("Updated Barcelona's fans and name.");
  } catch (error) {
    console.error("Error updating fans and names:", error);
  }
}

async function updateTeamTopScorers() {
  try {
    // Update Real Madrid top scorers
    await teamsCollection.doc("Real Madrid").update({
      topScorers: firebase.firestore.FieldValue.arrayRemove("Hazard"),
    });
    await teamsCollection.doc("Real Madrid").update({
      topScorers: firebase.firestore.FieldValue.arrayUnion("Crispo"),
    });
    console.log("Updated Real Madrid's top scorers.");

    // Update Barcelona top scorers
    await teamsCollection.doc("Barcelona").update({
      topScorers: firebase.firestore.FieldValue.arrayRemove("Puyol"),
    });
    await teamsCollection.doc("Barcelona").update({
      topScorers: firebase.firestore.FieldValue.arrayUnion("Deco"),
    });
    console.log("Updated Barcelona's top scorers.");
  } catch (error) {
    console.error("Error updating top scorers:", error);
  }
}

async function updateTeams() {
  console.log("Starting team updates...");

  // Update fans and names
  await updateTeamFansAndNames();

  // Update top scorers
  await updateTeamTopScorers();

  console.log("All team updates completed.");
}

async function addInitialJerseyColors() {
  try {
    // Add initial jersey colors for Real Madrid
    await teamsCollection.doc("Real Madrid").update({
      color: {
        home: "White",
        away: "Black",
      },
    });
    console.log("Added initial jersey colors for Real Madrid.");

    // Add initial jersey colors for Barcelona
    await teamsCollection.doc("Barcelona").update({
      color: {
        home: "Red",
        away: "Gold",
      },
    });
    console.log("Added initial jersey colors for Barcelona.");
  } catch (error) {
    console.error("Error adding initial jersey colors:", error);
  }
}

async function updateAwayJerseyColors() {
  try {
    // Update away jersey color for Real Madrid
    await teamsCollection.doc("Real Madrid").update({
      "color.away": "Purple", // Update only the away color
    });
    console.log("Updated Real Madrid's away jersey color to Purple.");

    // Update away jersey color for Barcelona
    await teamsCollection.doc("Barcelona").update({
      "color.away": "Pink", // Update only the away color
    });
    console.log("Updated Barcelona's away jersey color to Pink.");
  } catch (error) {
    console.error("Error updating away jersey colors:", error);
  }
}

async function updateJerseyColors() {
  console.log("Starting jersey color updates...");

  // Add initial jersey colors
  await addInitialJerseyColors();

  // Update away jersey colors
  await updateAwayJerseyColors();

  console.log("Jersey color updates completed.");
}
