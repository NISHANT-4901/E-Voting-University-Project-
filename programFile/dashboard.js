document.addEventListener("DOMContentLoaded", () => {
  // Check for authentication
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/"; // Redirect to login if no token
    return;
  }

  // Add token to all fetch requests
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Initialize candidates
  const candidates = [
    {
      id: 1,
      name: "Candidate 1",
      party: "Party A",
      image: "IMAGE/userImage.jpg",
    },
    {
      id: 2,
      name: "Candidate 2",
      party: "Party B",
      image: "IMAGE/userImage.jpg",
    },
    {
      id: 3,
      name: "Candidate 3",
      party: "Party C",
      image: "IMAGE/userImage.jpg",
    },
    {
      id: 4,
      name: "Candidate 4",
      party: "Party D",
      image: "IMAGE/userImage.jpg",
    },
  ];

  let selectedCandidate = null;
  let hasVoted = false;

  // DOM elements
  const candidatesGrid = document.querySelector(".candidates-grid");
  const voteBtn = document.getElementById("voteBtn");
  const resultBtn = document.getElementById("resultBtn");
  const resultModal = document.getElementById("resultModal");
  const closeModal = document.getElementById("closeModal");
  const resultContent = document.getElementById("resultContent");
  const logoutBtn = document.getElementById("logoutBtn");

  // Check if user has already voted
  async function checkVoteStatus() {
    try {
      const response = await fetch("http://localhost:5000/api/check-vote", {
        headers,
      });
      const data = await response.json();
      if (data.hasVoted) {
        hasVoted = true;
        voteBtn.disabled = true;
        voteBtn.textContent = "Already Voted";
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  }

  // Populate candidates
  candidates.forEach((candidate) => {
    const candidateElement = document.createElement("div");
    candidateElement.className = "candidate";
    candidateElement.dataset.candidateId = candidate.id;
    candidateElement.innerHTML = `
      <img src="${candidate.image}" alt="${candidate.name}">
      <h3>${candidate.name}</h3>
      <p>${candidate.party}</p>
    `;
    candidatesGrid.appendChild(candidateElement);

    candidateElement.addEventListener("click", () => {
      if (!hasVoted) {
        document.querySelectorAll(".candidate").forEach((el) => {
          el.classList.remove("selected");
        });
        candidateElement.classList.add("selected");
        selectedCandidate = candidate.id;
        voteBtn.disabled = false;
      } else {
        alert("You have already cast your vote. Each user can only vote once.");
      }
    });
  });

  // Handle vote submission
  voteBtn.addEventListener("click", async () => {
    if (hasVoted) {
      alert("You have already cast your vote. Each user can only vote once.");
      return;
    }

    if (selectedCandidate && !hasVoted) {
      try {
        const response = await fetch("http://localhost:5000/api/vote", {
          method: "POST",
          headers,
          body: JSON.stringify({ candidateId: selectedCandidate }),
        });

        if (response.ok) {
          hasVoted = true;
          voteBtn.disabled = true;
          voteBtn.textContent = "Already Voted";
          alert(
            "Thank you for voting! You can view results using the 'Show Results' button."
          );
        } else {
          const data = await response.json();
          alert(data.message || "Failed to submit vote");
        }
      } catch (error) {
        console.error("Error submitting vote:", error);
        alert("An error occurred while submitting your vote");
      }
    }
  });

  // Show results
  resultBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:5000/api/votes", {
        headers,
      });
      const data = await response.json();
      const voteCounts = data.results;

      const maxVotes = Math.max(...Object.values(voteCounts));
      const winners = candidates.filter(
        (candidate) => voteCounts[candidate.id] === maxVotes
      );

      let resultsHTML = "";

      // Add winner section
      if (winners.length === 1) {
        const winner = winners[0];
        resultsHTML += `
          <div class="winner">
            <h3>WINNER</h3>
            <div class="candidate-result">
              <h4>${winner.name}</h4>
              <p>${winner.party}</p>
              <div class="votes">${voteCounts[winner.id]} votes</div>
            </div>
          </div>
        `;
      } else if (winners.length > 1) {
        resultsHTML += `
          <div class="tie">
            <h3>TIE BETWEEN:</h3>
            ${winners
              .map(
                (winner) => `
              <div class="candidate-result">
                <h4>${winner.name}</h4>
                <p>${winner.party}</p>
                <div class="votes">${voteCounts[winner.id]} votes</div>
              </div>
            `
              )
              .join("")}
          </div>
        `;
      }

      // Add other candidates
      const otherCandidates = candidates.filter(
        (candidate) => voteCounts[candidate.id] < maxVotes
      );
      if (otherCandidates.length > 0) {
        resultsHTML += `
          <div class="other-candidates">
            <h3>Other Candidates</h3>
            ${otherCandidates
              .map(
                (candidate) => `
              <div class="candidate-result">
                <h4>${candidate.name}</h4>
                <p>${candidate.party}</p>
                <div class="votes">${voteCounts[candidate.id] || 0} votes</div>
              </div>
            `
              )
              .join("")}
          </div>
        `;
      }

      resultContent.innerHTML = resultsHTML;
      resultModal.classList.add("show");
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("An error occurred while fetching the results");
    }
  });

  // Modal close handlers
  closeModal.addEventListener("click", () => {
    resultModal.classList.remove("show");
  });

  window.addEventListener("click", (event) => {
    if (event.target === resultModal) {
      resultModal.classList.remove("show");
    }
  });

  // Logout handler
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // Check vote status when page loads
  checkVoteStatus();
});
